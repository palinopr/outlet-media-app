import { NextResponse, type NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { apiError, authGuard, validateRequest } from "@/lib/api-helpers";
import { CreateCrmCommentSchema, ResolveCommentSchema } from "@/lib/api-schemas";
import { enqueueExternalAgentTask } from "@/lib/agent-dispatch";
import { supabaseAdmin } from "@/lib/supabase";
import { canAccessCrmComments, type CrmCommentVisibility } from "@/features/crm-comments/server";
import { notifyDiscussionAudience } from "@/features/notifications/discussions";
import { logSystemEvent } from "@/features/system-events/server";

function excerpt(text: string, limit = 140) {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit - 1)}…`;
}

async function getContactName(contactId: string) {
  if (!supabaseAdmin) return null;

  const { data } = await supabaseAdmin
    .from("crm_contacts" as never)
    .select("full_name")
    .eq("id", contactId)
    .maybeSingle();

  return ((data as Record<string, unknown> | null)?.full_name as string | undefined) ?? null;
}

async function getAuthorName() {
  const user = await currentUser();
  return [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Unknown";
}

function shouldEnqueueCrmCommentTriage(options: {
  isAdmin: boolean;
  parentCommentId?: string;
  visibility: CrmCommentVisibility;
}) {
  return !options.isAdmin && !options.parentCommentId && options.visibility === "shared";
}

function crmCommentTriagePrompt(input: {
  clientSlug: string;
  comment: string;
  commentId: string;
  authorName: string;
  contactId: string;
  contactName: string | null;
}) {
  return [
    "A client started a new CRM discussion thread.",
    `Client: ${input.clientSlug}`,
    input.contactName ? `Contact: ${input.contactName}` : null,
    `CRM contact ID: ${input.contactId}`,
    `Comment ID: ${input.commentId}`,
    `Author: ${input.authorName}`,
    `Comment: ${input.comment}`,
    "Prepare a concise CRM triage note with:",
    "1. what the client is asking or flagging",
    "2. the best next response or relationship step",
    "3. any missing context or blockers",
    "Keep it short and operational.",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function GET(request: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured");

  const contactId = request.nextUrl.searchParams.get("contact_id");
  const clientSlug = request.nextUrl.searchParams.get("client_slug");
  if (!contactId || !clientSlug) {
    return apiError("contact_id and client_slug are required", 400);
  }

  const access = await canAccessCrmComments(userId, clientSlug);
  if (!access.allowed) return apiError("Forbidden", 403);

  let query = supabaseAdmin
    .from("crm_comments")
    .select("*")
    .eq("contact_id", contactId)
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
    CreateCrmCommentSchema,
  );
  if (validationError) return validationError;

  const access = await canAccessCrmComments(userId, body.client_slug, body.visibility);
  if (!access.allowed) return apiError("Forbidden", 403);

  let visibility: CrmCommentVisibility = body.visibility;

  if (body.parent_comment_id) {
    const { data: parent } = await supabaseAdmin
      .from("crm_comments")
      .select("contact_id, client_slug, visibility")
      .eq("id", body.parent_comment_id)
      .maybeSingle();

    if (!parent) return apiError("Parent comment not found", 404);
    if (parent.contact_id !== body.contact_id || parent.client_slug !== body.client_slug) {
      return apiError("Parent comment does not belong to this CRM contact", 400);
    }

    visibility = parent.visibility as CrmCommentVisibility;
    if (visibility === "admin_only" && !access.isAdmin) {
      return apiError("Forbidden", 403);
    }
  }

  const authorName = await getAuthorName();
  const { data, error: dbErr } = await supabaseAdmin
    .from("crm_comments")
    .insert({
      contact_id: body.contact_id,
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

  const contactName = await getContactName(body.contact_id);
  await logSystemEvent({
    eventName: "crm_comment_added",
    actorId: userId,
    clientSlug: body.client_slug,
    visibility,
    entityType: "crm_comment",
    entityId: data.id as string,
    summary: body.parent_comment_id
      ? `Replied in ${contactName ?? "CRM contact"} discussion`
      : `Commented on ${contactName ?? "CRM contact"} discussion`,
    detail: excerpt(body.content),
    metadata: {
      crmContactId: body.contact_id,
      crmContactName: contactName,
      parentCommentId: body.parent_comment_id ?? null,
      visibility,
    },
  });

  await notifyDiscussionAudience({
    actorId: userId,
    actorName: authorName,
    clientSlug: body.client_slug,
    entityId: body.contact_id,
    entityType: "crm_contact",
    message: excerpt(body.content),
    title: body.parent_comment_id ? "New reply in CRM discussion" : "New CRM comment",
    visibility,
  });

  if (
    shouldEnqueueCrmCommentTriage({
      isAdmin: access.isAdmin,
      parentCommentId: body.parent_comment_id,
      visibility,
    })
  ) {
    const taskId = await enqueueExternalAgentTask({
      action: "triage-crm-comment",
      prompt: crmCommentTriagePrompt({
        authorName,
        clientSlug: body.client_slug,
        comment: body.content,
        commentId: data.id as string,
        contactId: body.contact_id,
        contactName,
      }),
      toAgent: "assistant",
    });

    if (taskId) {
      await logSystemEvent({
        eventName: "agent_action_requested",
        actorType: "system",
        actorName: "Outlet CRM",
        clientSlug: body.client_slug,
        visibility: "admin_only",
        entityType: "agent_task",
        entityId: taskId,
        summary: `Queued agent triage for ${contactName ?? "CRM contact"} discussion`,
        detail: "Assistant will prepare a concise CRM response and next-step brief for the team.",
        metadata: {
          crmContactId: body.contact_id,
          crmContactName: contactName,
          commentId: data.id,
          taskId,
          toAgent: "assistant",
        },
      });
    }
  }

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
    .from("crm_comments")
    .select("contact_id, client_slug, content, resolved, visibility")
    .eq("id", id)
    .maybeSingle();

  if (!existing) return apiError("Comment not found", 404);

  const access = await canAccessCrmComments(
    userId,
    existing.client_slug as string,
    existing.visibility as CrmCommentVisibility,
  );
  if (!access.allowed) return apiError("Forbidden", 403);

  const { error: dbErr } = await supabaseAdmin
    .from("crm_comments")
    .update({ resolved: body.resolved, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (dbErr) return apiError(dbErr.message);

  if (body.resolved !== existing.resolved) {
    const contactName = await getContactName(existing.contact_id as string);
    await logSystemEvent({
      eventName: "crm_comment_resolved",
      actorId: userId,
      clientSlug: existing.client_slug as string,
      visibility: existing.visibility as CrmCommentVisibility,
      entityType: "crm_comment",
      entityId: id,
      summary: body.resolved
        ? `Resolved a comment in ${contactName ?? "CRM contact"} discussion`
        : `Reopened a comment in ${contactName ?? "CRM contact"} discussion`,
      detail: excerpt(existing.content as string),
      metadata: {
        crmContactId: existing.contact_id,
        crmContactName: contactName,
        resolved: body.resolved,
      },
    });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured");

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return apiError("id required", 400);

  const { data: existing } = await supabaseAdmin
    .from("crm_comments")
    .select("contact_id, client_slug, content, author_id, visibility")
    .eq("id", id)
    .maybeSingle();

  if (!existing) return apiError("Comment not found", 404);

  const access = await canAccessCrmComments(
    userId,
    existing.client_slug as string,
    existing.visibility as CrmCommentVisibility,
  );
  if (!access.allowed) return apiError("Forbidden", 403);
  if (!access.isAdmin && existing.author_id !== userId) {
    return apiError("Forbidden", 403);
  }

  const { error: dbErr } = await supabaseAdmin.from("crm_comments").delete().eq("id", id);
  if (dbErr) return apiError(dbErr.message);

  const contactName = await getContactName(existing.contact_id as string);
  await logSystemEvent({
    eventName: "crm_comment_deleted",
    actorId: userId,
    clientSlug: existing.client_slug as string,
    visibility: existing.visibility as CrmCommentVisibility,
    entityType: "crm_comment",
    entityId: id,
    summary: `Deleted a comment from ${contactName ?? "CRM contact"} discussion`,
    detail: excerpt(existing.content as string),
    metadata: {
      crmContactId: existing.contact_id,
      crmContactName: contactName,
    },
  });

  return NextResponse.json({ success: true });
}
