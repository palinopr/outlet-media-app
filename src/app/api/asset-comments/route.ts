import { NextResponse, type NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  apiError,
  authGuard,
  dbError,
  getAuthorName,
  shouldEnqueueCommentTriage,
  validateRequest,
} from "@/lib/api-helpers";
import { excerpt } from "@/lib/text-utils";
import { CreateAssetCommentSchema, ResolveCommentSchema } from "@/lib/api-schemas";
import { enqueueExternalAgentTask } from "@/lib/agent-dispatch";
import { supabaseAdmin } from "@/lib/supabase";
import {
  canAccessAssetComments,
  type AssetCommentVisibility,
  listAssetComments,
} from "@/features/asset-comments/server";
import {
  getAssetOperatingData,
  getAssetRecordById,
  getClientAssetScope,
} from "@/features/assets/server";
import { notifyDiscussionAudience } from "@/features/notifications/discussions";
import { logSystemEvent } from "@/features/system-events/server";
import {
  getAssetWorkflowPaths,
  revalidateWorkflowPaths,
} from "@/features/workflow/revalidation";

interface AssetCommentRow {
  id: string;
  asset_id: string;
  author_id: string | null;
  client_slug: string;
  content: string;
  resolved: boolean;
  visibility: AssetCommentVisibility;
}

function assetCommentTriagePrompt(input: {
  assetId: string;
  assetName: string;
  authorName: string;
  clientSlug: string;
  comment: string;
  commentId: string;
  primaryCampaignId: string | null;
  primaryCampaignName: string | null;
}) {
  return [
    "A client started a new creative discussion thread.",
    `Client: ${input.clientSlug}`,
    `Asset: ${input.assetName}`,
    `Asset ID: ${input.assetId}`,
    input.primaryCampaignName ? `Linked campaign: ${input.primaryCampaignName}` : null,
    input.primaryCampaignId ? `Campaign ID: ${input.primaryCampaignId}` : null,
    `Comment ID: ${input.commentId}`,
    `Author: ${input.authorName}`,
    `Comment: ${input.comment}`,
    "Prepare a concise creative triage note with:",
    "1. what the client is asking or flagging about this asset",
    "2. the best next review or production action",
    "3. any missing specs, approvals, or blockers",
    "Keep it short and operational.",
  ]
    .filter(Boolean)
    .join("\n");
}

async function getAssetContext(assetId: string) {
  const data = await getAssetOperatingData(assetId);
  if (!data) return null;

  return {
    asset: data.asset,
    primaryCampaign: data.linkedCampaigns[0] ?? null,
  };
}

export async function GET(request: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;

  const assetId = request.nextUrl.searchParams.get("asset_id");
  const clientSlug = request.nextUrl.searchParams.get("client_slug");
  if (!assetId || !clientSlug) {
    return apiError("asset_id and client_slug are required", 400);
  }

  const access = await canAccessAssetComments(userId, clientSlug);
  if (!access.allowed) return apiError("Forbidden", 403);

  const scope = access.isAdmin ? undefined : await getClientAssetScope(userId, clientSlug);
  const asset = access.isAdmin
    ? await getAssetRecordById(assetId)
    : (await getAssetOperatingData(assetId, [], scope))?.asset ?? null;
  if (!asset || asset.client_slug !== clientSlug) {
    return apiError("Asset not found", 404);
  }

  const comments = await listAssetComments({
    assetId,
    audience: access.isAdmin ? "all" : "shared",
    clientSlug,
  });

  return NextResponse.json({ comments });
}

export async function POST(request: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured");

  const { data: body, error: validationError } = await validateRequest(
    request,
    CreateAssetCommentSchema,
  );
  if (validationError) return validationError;

  const access = await canAccessAssetComments(userId, body.client_slug, body.visibility);
  if (!access.allowed) return apiError("Forbidden", 403);

  const scope = access.isAdmin
    ? undefined
    : await getClientAssetScope(userId, body.client_slug);
  const assetContext = access.isAdmin
    ? await getAssetContext(body.asset_id)
    : await getAssetOperatingData(body.asset_id, [], scope).then((data) =>
        data
          ? {
              asset: data.asset,
              primaryCampaign: data.linkedCampaigns[0] ?? null,
            }
          : null,
      );
  if (!assetContext || assetContext.asset.client_slug !== body.client_slug) {
    return apiError("Asset not found", 404);
  }

  let visibility: AssetCommentVisibility = body.visibility;

  if (body.parent_comment_id) {
    const { data: parentRow } = await supabaseAdmin
      .from("asset_comments" as never)
      .select("asset_id, client_slug, visibility")
      .eq("id", body.parent_comment_id)
      .maybeSingle();
    const parent = parentRow as AssetCommentRow | null;

    if (!parent) return apiError("Parent comment not found", 404);
    if (parent.asset_id !== body.asset_id || parent.client_slug !== body.client_slug) {
      return apiError("Parent comment does not belong to this asset", 400);
    }

    visibility = parent.visibility as AssetCommentVisibility;
    if (visibility === "admin_only" && !access.isAdmin) {
      return apiError("Forbidden", 403);
    }
  }

  const user = await currentUser();
  const authorName = getAuthorName(user);
  const { data: createdRow, error: dbErr } = await supabaseAdmin
    .from("asset_comments" as never)
    .insert({
      asset_id: body.asset_id,
      client_slug: body.client_slug,
      content: body.content,
      visibility,
      author_id: userId,
      author_name: authorName,
      parent_comment_id: body.parent_comment_id ?? null,
    })
    .select("*")
    .single();
  const data = createdRow as AssetCommentRow | null;

  if (dbErr) return dbError(dbErr);
  if (!data) return apiError("Failed to create comment");

  await logSystemEvent({
    eventName: "asset_comment_added",
    actorId: userId,
    clientSlug: body.client_slug,
    visibility,
    entityType: "asset_comment",
    entityId: data.id as string,
    summary: body.parent_comment_id
      ? `Replied in asset discussion for "${assetContext.asset.file_name}"`
      : `Commented on asset "${assetContext.asset.file_name}"`,
    detail: excerpt(body.content),
    metadata: {
      assetId: body.asset_id,
      assetName: assetContext.asset.file_name,
      campaignId: assetContext.primaryCampaign?.campaignId ?? null,
      campaignName: assetContext.primaryCampaign?.name ?? null,
      parentCommentId: body.parent_comment_id ?? null,
      visibility,
    },
  });

  await notifyDiscussionAudience({
    actorId: userId,
    actorName: authorName,
    clientSlug: body.client_slug,
    entityId: body.asset_id,
    entityType: "asset",
    message: excerpt(body.content),
    title: body.parent_comment_id ? "New reply in asset discussion" : "New asset comment",
    visibility,
  });

  if (
    shouldEnqueueCommentTriage({
      isAdmin: access.isAdmin,
      parentCommentId: body.parent_comment_id,
      visibility,
    })
  ) {
    const taskId = await enqueueExternalAgentTask({
      action: "triage-asset-comment",
      prompt: assetCommentTriagePrompt({
        assetId: body.asset_id,
        assetName: assetContext.asset.file_name,
        authorName,
        clientSlug: body.client_slug,
        comment: body.content,
        commentId: data.id as string,
        primaryCampaignId: assetContext.primaryCampaign?.campaignId ?? null,
        primaryCampaignName: assetContext.primaryCampaign?.name ?? null,
      }),
      toAgent: "assistant",
    });

    if (taskId) {
      await logSystemEvent({
        eventName: "agent_action_requested",
        actorType: "system",
        actorName: "Outlet Assets",
        clientSlug: body.client_slug,
        visibility: "admin_only",
        entityType: "agent_task",
        entityId: taskId,
        summary: `Queued agent triage for asset discussion on "${assetContext.asset.file_name}"`,
        detail: "Assistant will prepare a concise creative review and response brief for the team.",
        metadata: {
          assetId: body.asset_id,
          assetName: assetContext.asset.file_name,
          campaignId: assetContext.primaryCampaign?.campaignId ?? null,
          campaignName: assetContext.primaryCampaign?.name ?? null,
          commentId: data.id,
          taskId,
          toAgent: "assistant",
        },
      });
    }
  }

  revalidateWorkflowPaths(getAssetWorkflowPaths(body.client_slug, body.asset_id));

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

  const { data: existingRow } = await supabaseAdmin
    .from("asset_comments" as never)
    .select("asset_id, client_slug, content, resolved, visibility")
    .eq("id", id)
    .maybeSingle();
  const existing = existingRow as AssetCommentRow | null;

  if (!existing) return apiError("Comment not found", 404);

  const access = await canAccessAssetComments(
    userId,
    existing.client_slug as string,
    existing.visibility as AssetCommentVisibility,
  );
  if (!access.allowed) return apiError("Forbidden", 403);

  const scope = access.isAdmin
    ? undefined
    : await getClientAssetScope(userId, existing.client_slug as string);
  const assetContext = access.isAdmin
    ? await getAssetRecordById(existing.asset_id as string)
    : (await getAssetOperatingData(existing.asset_id as string, [], scope))?.asset ?? null;
  if (!assetContext) return apiError("Comment not found", 404);

  const { error: dbErr } = await supabaseAdmin
    .from("asset_comments" as never)
    .update({ resolved: body.resolved, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (dbErr) return dbError(dbErr);

  if (body.resolved !== existing.resolved) {
    await logSystemEvent({
      eventName: "asset_comment_resolved",
      actorId: userId,
      clientSlug: existing.client_slug as string,
      visibility: existing.visibility as AssetCommentVisibility,
      entityType: "asset_comment",
      entityId: id,
      summary: body.resolved
        ? `Resolved a comment on "${assetContext.file_name ?? "asset"}"`
        : `Reopened a comment on "${assetContext.file_name ?? "asset"}"`,
      detail: excerpt(existing.content as string),
      metadata: {
        assetId: existing.asset_id,
        assetName: assetContext.file_name ?? null,
        resolved: body.resolved,
      },
    });
  }

  revalidateWorkflowPaths(
    getAssetWorkflowPaths(existing.client_slug, existing.asset_id),
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured");

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return apiError("id required", 400);

  const { data: existingRow } = await supabaseAdmin
    .from("asset_comments" as never)
    .select("asset_id, client_slug, content, author_id, visibility")
    .eq("id", id)
    .maybeSingle();
  const existing = existingRow as AssetCommentRow | null;

  if (!existing) return apiError("Comment not found", 404);

  const access = await canAccessAssetComments(
    userId,
    existing.client_slug as string,
    existing.visibility as AssetCommentVisibility,
  );
  if (!access.allowed) return apiError("Forbidden", 403);
  if (!access.isAdmin && existing.author_id !== userId) {
    return apiError("Forbidden", 403);
  }

  const scope = access.isAdmin
    ? undefined
    : await getClientAssetScope(userId, existing.client_slug as string);
  const asset = access.isAdmin
    ? await getAssetRecordById(existing.asset_id as string)
    : (await getAssetOperatingData(existing.asset_id as string, [], scope))?.asset ?? null;
  if (!asset) return apiError("Comment not found", 404);

  const { error: dbErr } = await supabaseAdmin
    .from("asset_comments" as never)
    .delete()
    .eq("id", id);

  if (dbErr) return dbError(dbErr);

  await logSystemEvent({
    eventName: "asset_comment_deleted",
    actorId: userId,
    clientSlug: existing.client_slug as string,
    visibility: existing.visibility as AssetCommentVisibility,
    entityType: "asset_comment",
    entityId: id,
    summary: `Deleted a comment from "${asset?.file_name ?? "asset"}" discussion`,
    detail: excerpt(existing.content as string),
    metadata: {
      assetId: existing.asset_id,
      assetName: asset?.file_name ?? null,
    },
  });

  revalidateWorkflowPaths(
    getAssetWorkflowPaths(existing.client_slug, existing.asset_id),
  );

  return NextResponse.json({ success: true });
}
