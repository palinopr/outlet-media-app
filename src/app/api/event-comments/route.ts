import { NextResponse, type NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod/v4";
import {
  apiError,
  authGuard,
  dbError,
  getAuthorName,
  shouldEnqueueCommentTriage,
  validateRequest,
} from "@/lib/api-helpers";
import {
  CreateEventCommentSchema,
  ResolveCommentSchema,
} from "@/lib/api-schemas";
import { excerpt } from "@/lib/text-utils";
import { enqueueExternalAgentTask } from "@/lib/agent-dispatch";
import { createClerkSupabaseClient, supabaseAdmin } from "@/lib/supabase";
import {
  canAccessEventComments,
  type EventCommentVisibility,
} from "@/features/event-comments/server";
import { getEventRecordById } from "@/features/events/server";
import { notifyDiscussionAudience } from "@/features/notifications/discussions";
import { allowsEventInScope } from "@/features/client-portal/scope";
import { logSystemEvent } from "@/features/system-events/server";
import {
  getEventWorkflowPaths,
  revalidateWorkflowPaths,
} from "@/features/workflow/revalidation";

const CreateScopedEventCommentSchema = CreateEventCommentSchema.extend({
  client_slug: z.string().min(1),
});

function eventCommentTriagePrompt(input: {
  authorName: string;
  clientSlug: string;
  comment: string;
  commentId: string;
  eventDate: string | null;
  eventId: string;
  eventName: string | null;
  eventVenue: string | null;
}) {
  return [
    "A client started a new event discussion thread.",
    `Client: ${input.clientSlug}`,
    input.eventName ? `Event: ${input.eventName}` : null,
    `Event ID: ${input.eventId}`,
    input.eventVenue ? `Venue: ${input.eventVenue}` : null,
    input.eventDate ? `Date: ${input.eventDate}` : null,
    `Comment ID: ${input.commentId}`,
    `Author: ${input.authorName}`,
    `Comment: ${input.comment}`,
    "Prepare a concise event operations triage note with:",
    "1. what the client is asking or flagging",
    "2. the next best ticketing or promotion response",
    "3. any missing information or blockers",
    "Keep it short and practical.",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function GET(request: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured");

  const eventId = request.nextUrl.searchParams.get("event_id");
  const clientSlug = request.nextUrl.searchParams.get("client_slug");
  if (!eventId || !clientSlug) {
    return apiError("event_id and client_slug are required", 400);
  }

  const access = await canAccessEventComments(userId, clientSlug);
  if (!access.allowed) return apiError("Forbidden", 403);
  if (!allowsEventInScope(access.scope, eventId)) {
    return apiError("Event not found", 404);
  }

  const event = await getEventRecordById(eventId);
  if (!event || event.clientSlug !== clientSlug) {
    return apiError("Event not found", 404);
  }

  const commentsDb = access.isAdmin ? supabaseAdmin : await createClerkSupabaseClient();
  if (!commentsDb) {
    return NextResponse.json({ comments: [] });
  }

  let query = commentsDb
    .from("event_comments")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: true });

  if (!access.isAdmin) {
    query = query.eq("visibility", "shared");
  }

  const { data, error: dbErr } = await query;
  if (dbErr) return dbError(dbErr);

  return NextResponse.json({ comments: data ?? [] });
}

export async function POST(request: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured");

  const { data: body, error: validationError } = await validateRequest(
    request,
    CreateScopedEventCommentSchema,
  );
  if (validationError) return validationError;

  const access = await canAccessEventComments(userId, body.client_slug, body.visibility);
  if (!access.allowed) return apiError("Forbidden", 403);
  if (!allowsEventInScope(access.scope, body.event_id)) {
    return apiError("Event not found", 404);
  }

  const event = await getEventRecordById(body.event_id);
  if (!event || event.clientSlug !== body.client_slug) {
    return apiError("Event not found", 404);
  }

  let visibility: EventCommentVisibility = body.visibility;

  if (body.parent_comment_id) {
    const { data: parent } = await supabaseAdmin
      .from("event_comments")
      .select("event_id, client_slug, visibility")
      .eq("id", body.parent_comment_id)
      .maybeSingle();

    if (!parent) return apiError("Parent comment not found", 404);
    if (parent.event_id !== body.event_id) {
      return apiError("Parent comment does not belong to this event", 400);
    }

    visibility = parent.visibility as EventCommentVisibility;
    if (visibility === "admin_only" && !access.isAdmin) {
      return apiError("Forbidden", 403);
    }
  }

  const user = await currentUser();
  const authorName = getAuthorName(user);
  const { data, error: dbErr } = await supabaseAdmin
    .from("event_comments")
    .insert({
      event_id: body.event_id,
      client_slug: body.client_slug,
      content: body.content,
      visibility,
      author_id: userId,
      author_name: authorName,
      parent_comment_id: body.parent_comment_id ?? null,
    })
    .select("*")
    .single();

  if (dbErr) return dbError(dbErr);

  const eventName = event.artist ?? event.name ?? body.event_id;
  await logSystemEvent({
    eventName: "event_comment_added",
    actorId: userId,
    clientSlug: body.client_slug,
    visibility,
    entityType: "event_comment",
    entityId: data.id as string,
    summary: body.parent_comment_id
      ? `Replied in ${eventName} discussion`
      : `Commented on ${eventName} discussion`,
    detail: excerpt(body.content),
    metadata: {
      eventId: body.event_id,
      parentCommentId: body.parent_comment_id ?? null,
      visibility,
    },
  });

  await notifyDiscussionAudience({
    actorId: userId,
    actorName: authorName,
    clientSlug: body.client_slug,
    entityId: body.event_id,
    entityType: "event",
    message: excerpt(body.content),
    title: body.parent_comment_id ? "New reply in event discussion" : "New event comment",
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
      action: "triage-event-comment",
      prompt: eventCommentTriagePrompt({
        authorName,
        clientSlug: body.client_slug,
        comment: body.content,
        commentId: data.id as string,
        eventDate: event.date,
        eventId: body.event_id,
        eventName,
        eventVenue: event.venue,
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
        summary: `Queued agent triage for event comment in ${eventName}`,
        detail: "Assistant will prepare a concise event response and next-step brief for the team.",
        metadata: {
          commentId: data.id,
          eventId: body.event_id,
          eventName,
          taskId,
          toAgent: "assistant",
        },
      });
    }
  }

  revalidateWorkflowPaths(getEventWorkflowPaths(body.client_slug, body.event_id));

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
    .from("event_comments")
    .select("event_id, client_slug, content, resolved, visibility")
    .eq("id", id)
    .maybeSingle();

  if (!existing) return apiError("Comment not found", 404);

  const event = await getEventRecordById(existing.event_id as string);
  const effectiveClientSlug = event?.clientSlug ?? (existing.client_slug as string);
  if (!effectiveClientSlug) return apiError("Comment not found", 404);

  const access = await canAccessEventComments(
    userId,
    effectiveClientSlug,
    existing.visibility as EventCommentVisibility,
  );
  if (!access.allowed) return apiError("Forbidden", 403);
  if (!allowsEventInScope(access.scope, existing.event_id as string)) {
    return apiError("Comment not found", 404);
  }

  const { error: dbErr } = await supabaseAdmin
    .from("event_comments")
    .update({ resolved: body.resolved, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (dbErr) return dbError(dbErr);

  if (body.resolved !== existing.resolved) {
    const eventName = event?.artist ?? event?.name ?? (existing.event_id as string);
    await logSystemEvent({
      eventName: "event_comment_resolved",
      actorId: userId,
      clientSlug: effectiveClientSlug,
      visibility: existing.visibility as EventCommentVisibility,
      entityType: "event_comment",
      entityId: id,
      summary: body.resolved
        ? `Resolved a comment in ${eventName} discussion`
        : `Reopened a comment in ${eventName} discussion`,
      detail: excerpt(existing.content as string),
      metadata: {
        eventId: existing.event_id,
        resolved: body.resolved,
      },
    });
  }

  revalidateWorkflowPaths(getEventWorkflowPaths(effectiveClientSlug, existing.event_id as string));

  return NextResponse.json({ success: true });
}
