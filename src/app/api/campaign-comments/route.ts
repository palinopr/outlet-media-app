import { NextResponse, type NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { apiError, authGuard, validateRequest } from "@/lib/api-helpers";
import {
  CreateCampaignCommentSchema,
  ResolveCommentSchema,
} from "@/lib/api-schemas";
import { enqueueExternalAgentTask } from "@/lib/agent-dispatch";
import { supabaseAdmin } from "@/lib/supabase";
import {
  canAccessCampaignComments,
  type CampaignCommentVisibility,
} from "@/features/campaign-comments/server";
import { notifyDiscussionAudience } from "@/features/notifications/discussions";
import { allowsCampaignInScope } from "@/features/client-portal/scope";
import { logSystemEvent } from "@/features/system-events/server";
import {
  getCampaignWorkflowPaths,
  revalidateWorkflowPaths,
} from "@/features/workflow/revalidation";

function excerpt(text: string, limit = 140) {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit - 1)}…`;
}

async function getCampaignName(campaignId: string) {
  if (!supabaseAdmin) return null;
  const { data } = await supabaseAdmin
    .from("meta_campaigns")
    .select("name")
    .eq("campaign_id", campaignId)
    .maybeSingle();

  return (data?.name as string | undefined) ?? null;
}

async function getAuthorName() {
  const user = await currentUser();
  return [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Unknown";
}

function shouldEnqueueCampaignCommentTriage(options: {
  isAdmin: boolean;
  parentCommentId?: string;
  visibility: CampaignCommentVisibility;
}) {
  return !options.isAdmin && !options.parentCommentId && options.visibility === "shared";
}

function campaignCommentTriagePrompt(input: {
  campaignId: string;
  campaignName: string | null;
  clientSlug: string;
  commentId: string;
  comment: string;
  authorName: string;
}) {
  return [
    `A client started a new campaign discussion thread.`,
    `Client: ${input.clientSlug}`,
    input.campaignName ? `Campaign: ${input.campaignName}` : null,
    `Campaign ID: ${input.campaignId}`,
    `Comment ID: ${input.commentId}`,
    `Author: ${input.authorName}`,
    `Comment: ${input.comment}`,
    `Prepare a concise operations triage note with:`,
    `1. what the client is asking or flagging`,
    `2. the next best response or action`,
    `3. any missing information or blockers`,
    `Keep it short and practical.`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function GET(request: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured");

  const campaignId = request.nextUrl.searchParams.get("campaign_id");
  const clientSlug = request.nextUrl.searchParams.get("client_slug");
  if (!campaignId || !clientSlug) {
    return apiError("campaign_id and client_slug are required", 400);
  }

  const access = await canAccessCampaignComments(userId, clientSlug);
  if (!access.allowed) return apiError("Forbidden", 403);
  if (!allowsCampaignInScope(access.scope, campaignId)) {
    return apiError("Campaign not found", 404);
  }

  let query = supabaseAdmin
    .from("campaign_comments")
    .select("*")
    .eq("campaign_id", campaignId)
    .eq("client_slug", clientSlug)
    .order("created_at", { ascending: true });

  if (!access.isAdmin) {
    query = query.eq("visibility", "shared");
  }

  const { data, error: dbErr } = await query;
  if (dbErr) return apiError(dbErr.message);

  return NextResponse.json({ comments: data ?? [] });
}

export async function POST(request: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured");

  const { data: body, error: validationError } = await validateRequest(
    request,
    CreateCampaignCommentSchema,
  );
  if (validationError) return validationError;

  const access = await canAccessCampaignComments(userId, body.client_slug, body.visibility);
  if (!access.allowed) return apiError("Forbidden", 403);
  if (!allowsCampaignInScope(access.scope, body.campaign_id)) {
    return apiError("Campaign not found", 404);
  }

  let visibility: CampaignCommentVisibility = body.visibility;

  if (body.parent_comment_id) {
    const { data: parent } = await supabaseAdmin
      .from("campaign_comments")
      .select("campaign_id, client_slug, visibility")
      .eq("id", body.parent_comment_id)
      .maybeSingle();

    if (!parent) return apiError("Parent comment not found", 404);
    if (parent.campaign_id !== body.campaign_id || parent.client_slug !== body.client_slug) {
      return apiError("Parent comment does not belong to this campaign", 400);
    }

    visibility = parent.visibility as CampaignCommentVisibility;
    if (visibility === "admin_only" && !access.isAdmin) {
      return apiError("Forbidden", 403);
    }
  }

  const authorName = await getAuthorName();
  const { data, error: dbErr } = await supabaseAdmin
    .from("campaign_comments")
    .insert({
      campaign_id: body.campaign_id,
      client_slug: body.client_slug,
      content: body.content,
      visibility,
      author_id: userId,
      author_name: authorName,
      parent_comment_id: body.parent_comment_id ?? null,
    })
    .select("*")
    .single();

  if (dbErr) return apiError(dbErr.message);

  const campaignName = await getCampaignName(body.campaign_id);
  await logSystemEvent({
    eventName: "campaign_comment_added",
    actorId: userId,
    clientSlug: body.client_slug,
    visibility,
    entityType: "campaign_comment",
    entityId: data.id as string,
    summary: body.parent_comment_id
      ? `Replied in ${campaignName ?? "campaign"} discussion`
      : `Commented on ${campaignName ?? "campaign"} discussion`,
    detail: excerpt(body.content),
    metadata: {
      campaignId: body.campaign_id,
      parentCommentId: body.parent_comment_id ?? null,
      visibility,
    },
  });

  await notifyDiscussionAudience({
    actorId: userId,
    actorName: authorName,
    clientSlug: body.client_slug,
    entityId: body.campaign_id,
    entityType: "campaign",
    message: excerpt(body.content),
    title: body.parent_comment_id ? "New reply in campaign discussion" : "New campaign comment",
    visibility,
  });

  if (
    shouldEnqueueCampaignCommentTriage({
      isAdmin: access.isAdmin,
      parentCommentId: body.parent_comment_id,
      visibility,
    })
  ) {
    const taskId = await enqueueExternalAgentTask({
      action: "triage-campaign-comment",
      prompt: campaignCommentTriagePrompt({
        campaignId: body.campaign_id,
        campaignName,
        clientSlug: body.client_slug,
        commentId: data.id as string,
        comment: body.content,
        authorName,
      }),
      toAgent: "assistant",
    });

    if (taskId) {
      await logSystemEvent({
        eventName: "agent_action_requested",
        actorType: "system",
        clientSlug: body.client_slug,
        visibility: "admin_only",
        entityType: "agent_task",
        entityId: taskId,
        summary: `Queued agent triage for campaign comment in ${campaignName ?? "campaign"}`,
        detail: "Assistant will prepare a concise response and next-step brief for the team.",
        metadata: {
          campaignId: body.campaign_id,
          campaignName,
          commentId: data.id,
          taskId,
          toAgent: "assistant",
        },
      });
    }
  }

  revalidateWorkflowPaths(
    getCampaignWorkflowPaths(body.client_slug, body.campaign_id),
  );

  return NextResponse.json({ comment: data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured");

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return apiError("id required", 400);

  const { data: body, error: validationError } = await validateRequest(
    request,
    ResolveCommentSchema,
  );
  if (validationError) return validationError;

  const { data: existing } = await supabaseAdmin
    .from("campaign_comments")
    .select("campaign_id, client_slug, content, resolved, visibility")
    .eq("id", id)
    .maybeSingle();

  if (!existing) return apiError("Comment not found", 404);

  const access = await canAccessCampaignComments(
    userId,
    existing.client_slug as string,
    existing.visibility as CampaignCommentVisibility,
  );
  if (!access.allowed) return apiError("Forbidden", 403);
  if (!allowsCampaignInScope(access.scope, existing.campaign_id as string)) {
    return apiError("Comment not found", 404);
  }

  const { error: dbErr } = await supabaseAdmin
    .from("campaign_comments")
    .update({ resolved: body.resolved, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (dbErr) return apiError(dbErr.message);

  if (body.resolved !== existing.resolved) {
    const campaignName = await getCampaignName(existing.campaign_id as string);
    await logSystemEvent({
      eventName: "campaign_comment_resolved",
      actorId: userId,
      clientSlug: existing.client_slug as string,
      visibility: existing.visibility as CampaignCommentVisibility,
      entityType: "campaign_comment",
      entityId: id,
      summary: body.resolved
        ? `Resolved a comment in ${campaignName ?? "campaign"} discussion`
        : `Reopened a comment in ${campaignName ?? "campaign"} discussion`,
      detail: excerpt(existing.content as string),
      metadata: {
        campaignId: existing.campaign_id,
        resolved: body.resolved,
      },
    });
  }

  revalidateWorkflowPaths(
    getCampaignWorkflowPaths(
      existing.client_slug as string,
      existing.campaign_id as string,
    ),
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured");

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return apiError("id required", 400);

  const { data: existing } = await supabaseAdmin
    .from("campaign_comments")
    .select("campaign_id, client_slug, content, author_id, visibility")
    .eq("id", id)
    .maybeSingle();

  if (!existing) return apiError("Comment not found", 404);

  const access = await canAccessCampaignComments(
    userId,
    existing.client_slug as string,
    existing.visibility as CampaignCommentVisibility,
  );
  if (!access.allowed) return apiError("Forbidden", 403);
  if (!allowsCampaignInScope(access.scope, existing.campaign_id as string)) {
    return apiError("Comment not found", 404);
  }
  if (!access.isAdmin && existing.author_id !== userId) {
    return apiError("Forbidden", 403);
  }

  const { error: dbErr } = await supabaseAdmin
    .from("campaign_comments")
    .delete()
    .eq("id", id);

  if (dbErr) return apiError(dbErr.message);

  const campaignName = await getCampaignName(existing.campaign_id as string);
  await logSystemEvent({
    eventName: "campaign_comment_deleted",
    actorId: userId,
    clientSlug: existing.client_slug as string,
    visibility: existing.visibility as CampaignCommentVisibility,
    entityType: "campaign_comment",
    entityId: id,
    summary: `Deleted a comment from ${campaignName ?? "campaign"} discussion`,
    detail: excerpt(existing.content as string),
    metadata: {
      campaignId: existing.campaign_id,
    },
  });

  revalidateWorkflowPaths(
    getCampaignWorkflowPaths(
      existing.client_slug as string,
      existing.campaign_id as string,
    ),
  );

  return NextResponse.json({ success: true });
}
