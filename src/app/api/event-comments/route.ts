import { NextResponse, type NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { apiError, authGuard, validateRequest } from "@/lib/api-helpers";
import { CreateEventCommentSchema, ResolveCommentSchema } from "@/lib/api-schemas";
import { enqueueExternalAgentTask } from "@/lib/agent-dispatch";
import { supabaseAdmin } from "@/lib/supabase";
import {
  canAccessEventComments,
  type EventCommentVisibility,
  listEventComments,
} from "@/features/event-comments/server";
import { allowsEventInScope } from "@/features/client-portal/scope";
import { getEventOperatingData, getEventRecordById } from "@/features/events/server";
import { logSystemEvent } from "@/features/system-events/server";

interface EventCommentRow {
  id: string;
  event_id: string;
  author_id: string | null;
  client_slug: string | null;
  content: string;
  resolved: boolean;
  visibility: EventCommentVisibility;
}

function excerpt(text: string, limit = 140) {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit - 1)}…`;
}

async function getAuthorName() {
  const user = await currentUser();
  return [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Unknown";
}

function shouldEnqueueEventCommentTriage(options: {
  isAdmin: boolean;
  parentCommentId?: string;
  visibility: EventCommentVisibility;
}) {
  return !options.isAdmin && !options.parentCommentId && options.visibility === "shared";
}

function eventCommentTriagePrompt(input: {
  clientSlug: string | null;
  comment: string;
  commentId: string;
  eventDate: string | null;
  eventId: string;
  eventName: string;
  eventVenue: string | null;
  authorName: string;
  primaryCampaignId: string | null;
  primaryCampaignName: string | null;
}) {
  return [
    "A client started a new event discussion thread.",
    input.clientSlug ? `Client: ${input.clientSlug}` : "Client: unassigned",
    `Event: ${input.eventName}`,
    `Event ID: ${input.eventId}`,
    input.eventVenue ? `Venue: ${input.eventVenue}` : null,
    input.eventDate ? `Date: ${input.eventDate}` : null,
    input.primaryCampaignName ? `Linked campaign: ${input.primaryCampaignName}` : null,
    input.primaryCampaignId ? `Campaign ID: ${input.primaryCampaignId}` : null,
    `Comment ID: ${input.commentId}`,
    `Author: ${input.authorName}`,
    `Comment: ${input.comment}`,
    "Prepare a concise event operations triage note with:",
    "1. what the client is asking or flagging about the show",
    "2. the best next ticketing or promotion action",
    "3. any missing approvals, inventory context, or blockers",
    "Keep it short and operational.",
  ]
    .filter(Boolean)
    .join("\n");
}

async function getEventContext(eventId: string) {
  const data = await getEventOperatingData(eventId);
  if (!data) return null;

  return {
    event: data.event,
    primaryCampaign: data.linkedCampaigns[0] ?? null,
  };
}

export async function GET(request: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;

  const eventId = request.nextUrl.searchParams.get("event_id");
  if (!eventId) {
    return apiError("event_id is required", 400);
  }

  const event = await getEventRecordById(eventId);
  if (!event) return apiError("Event not found", 404);

  const access = await canAccessEventComments(userId, event.clientSlug);
  if (!access.allowed) return apiError("Forbidden", 403);
  if (!allowsEventInScope(access.scope, eventId)) {
    return apiError("Event not found", 404);
  }

  const comments = await listEventComments({
    eventId,
    audience: access.isAdmin ? "all" : "shared",
  });

  return NextResponse.json({ comments });
}

export async function POST(request: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured");

  const { data: body, error: validationError } = await validateRequest(
    request,
    CreateEventCommentSchema,
  );
  if (validationError) return validationError;

  const eventContext = await getEventContext(body.event_id);
  if (!eventContext) return apiError("Event not found", 404);

  const access = await canAccessEventComments(userId, eventContext.event.clientSlug, body.visibility);
  if (!access.allowed) return apiError("Forbidden", 403);
  if (!allowsEventInScope(access.scope, body.event_id)) {
    return apiError("Event not found", 404);
  }

  let visibility: EventCommentVisibility = body.visibility;

  if (body.parent_comment_id) {
    const { data: parentRow } = await supabaseAdmin
      .from("event_comments" as never)
      .select("event_id, visibility")
      .eq("id", body.parent_comment_id)
      .maybeSingle();
    const parent = parentRow as EventCommentRow | null;

    if (!parent) return apiError("Parent comment not found", 404);
    if (parent.event_id !== body.event_id) {
      return apiError("Parent comment does not belong to this event", 400);
    }

    visibility = parent.visibility as EventCommentVisibility;
    if (visibility === "admin_only" && !access.isAdmin) {
      return apiError("Forbidden", 403);
    }
  }

  const authorName = await getAuthorName();
  const { data: createdRow, error: dbErr } = await supabaseAdmin
    .from("event_comments" as never)
    .insert({
      author_id: userId,
      author_name: authorName,
      client_slug: eventContext.event.clientSlug,
      content: body.content,
      event_id: body.event_id,
      parent_comment_id: body.parent_comment_id ?? null,
      visibility,
    })
    .select("*")
    .single();
  const data = createdRow as EventCommentRow | null;

  if (dbErr || !data) return apiError(dbErr?.message ?? "Failed to create comment");

  await logSystemEvent({
    eventName: "event_comment_added",
    actorId: userId,
    clientSlug: eventContext.event.clientSlug,
    visibility,
    entityType: "event_comment",
    entityId: data.id,
    summary: body.parent_comment_id
      ? `Replied in event discussion for "${eventContext.event.artist || eventContext.event.name}"`
      : `Commented on event "${eventContext.event.artist || eventContext.event.name}"`,
    detail: excerpt(body.content),
    metadata: {
      eventId: body.event_id,
      eventName: eventContext.event.artist || eventContext.event.name,
      campaignId: eventContext.primaryCampaign?.campaignId ?? null,
      campaignName: eventContext.primaryCampaign?.name ?? null,
      parentCommentId: body.parent_comment_id ?? null,
      visibility,
    },
  });

  if (
    shouldEnqueueEventCommentTriage({
      isAdmin: access.isAdmin,
      parentCommentId: body.parent_comment_id,
      visibility,
    })
  ) {
    const taskId = await enqueueExternalAgentTask({
      action: "triage-event-comment",
      prompt: eventCommentTriagePrompt({
        authorName,
        clientSlug: eventContext.event.clientSlug,
        comment: body.content,
        commentId: data.id,
        eventDate: eventContext.event.date,
        eventId: body.event_id,
        eventName: eventContext.event.artist || eventContext.event.name,
        eventVenue: eventContext.event.venue,
        primaryCampaignId: eventContext.primaryCampaign?.campaignId ?? null,
        primaryCampaignName: eventContext.primaryCampaign?.name ?? null,
      }),
      toAgent: "assistant",
    });

    if (taskId) {
      await logSystemEvent({
        eventName: "agent_action_requested",
        actorType: "system",
        actorName: "Outlet Events",
        clientSlug: eventContext.event.clientSlug,
        visibility: "admin_only",
        entityType: "agent_task",
        entityId: taskId,
        summary: `Queued agent triage for event discussion on "${eventContext.event.artist || eventContext.event.name}"`,
        detail: "Assistant will prepare a concise ticketing or promotion response brief for the team.",
        metadata: {
          commentId: data.id,
          eventId: body.event_id,
          eventName: eventContext.event.artist || eventContext.event.name,
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

  const { data: existingRow } = await supabaseAdmin
    .from("event_comments" as never)
    .select("event_id, client_slug, content, resolved, visibility")
    .eq("id", id)
    .maybeSingle();
  const existing = existingRow as EventCommentRow | null;

  if (!existing) return apiError("Comment not found", 404);

  const access = await canAccessEventComments(
    userId,
    existing.client_slug ?? null,
    existing.visibility as EventCommentVisibility,
  );
  if (!access.allowed) return apiError("Forbidden", 403);
  if (!allowsEventInScope(access.scope, existing.event_id as string)) {
    return apiError("Comment not found", 404);
  }

  const { error: dbErr } = await supabaseAdmin
    .from("event_comments" as never)
    .update({ resolved: body.resolved, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (dbErr) return apiError(dbErr.message);

  if (body.resolved !== existing.resolved) {
    const event = await getEventRecordById(existing.event_id as string);
    await logSystemEvent({
      eventName: "event_comment_resolved",
      actorId: userId,
      clientSlug: existing.client_slug ?? null,
      visibility: existing.visibility as EventCommentVisibility,
      entityType: "event_comment",
      entityId: id,
      summary: body.resolved
        ? `Resolved a comment on "${event?.artist || event?.name || "event"}"`
        : `Reopened a comment on "${event?.artist || event?.name || "event"}"`,
      detail: excerpt(existing.content as string),
      metadata: {
        eventId: existing.event_id,
        eventName: event?.artist || event?.name || null,
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

  const { data: existingRow } = await supabaseAdmin
    .from("event_comments" as never)
    .select("event_id, client_slug, content, author_id, visibility")
    .eq("id", id)
    .maybeSingle();
  const existing = existingRow as EventCommentRow | null;

  if (!existing) return apiError("Comment not found", 404);

  const access = await canAccessEventComments(
    userId,
    existing.client_slug ?? null,
    existing.visibility as EventCommentVisibility,
  );
  if (!access.allowed) return apiError("Forbidden", 403);
  if (!allowsEventInScope(access.scope, existing.event_id as string)) {
    return apiError("Comment not found", 404);
  }
  if (!access.isAdmin && existing.author_id !== userId) {
    return apiError("Forbidden", 403);
  }

  const { error: dbErr } = await supabaseAdmin
    .from("event_comments" as never)
    .delete()
    .eq("id", id);

  if (dbErr) return apiError(dbErr.message);

  const event = await getEventRecordById(existing.event_id as string);
  await logSystemEvent({
    eventName: "event_comment_deleted",
    actorId: userId,
    clientSlug: existing.client_slug ?? null,
    visibility: existing.visibility as EventCommentVisibility,
    entityType: "event_comment",
    entityId: id,
    summary: `Deleted a comment from "${event?.artist || event?.name || "event"}" discussion`,
    detail: excerpt(existing.content as string),
    metadata: {
      eventId: existing.event_id,
      eventName: event?.artist || event?.name || null,
    },
  });

  return NextResponse.json({ success: true });
}
