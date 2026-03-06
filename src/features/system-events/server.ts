import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export type SystemEventName =
  | "agent_action_requested"
  | "approval_approved"
  | "approval_cancelled"
  | "approval_rejected"
  | "approval_requested"
  | "asset_deleted"
  | "asset_folder_imported"
  | "asset_uploaded"
  | "campaign_updated"
  | "event_updated"
  | "workspace_comment_added"
  | "workspace_comment_deleted"
  | "workspace_comment_resolved"
  | "workspace_page_archived"
  | "workspace_page_created"
  | "workspace_page_deleted"
  | "workspace_page_restored"
  | "workspace_page_updated"
  | "workspace_task_created"
  | "workspace_task_deleted"
  | "workspace_task_reordered"
  | "workspace_task_updated";

export type SystemEventVisibility = "admin_only" | "shared";
export type SystemEventActorType = "agent" | "system" | "user";

export interface SystemEvent {
  id: string;
  createdAt: string;
  eventName: SystemEventName | string;
  visibility: SystemEventVisibility;
  actorType: SystemEventActorType;
  actorId: string | null;
  actorName: string | null;
  clientSlug: string | null;
  summary: string;
  detail: string | null;
  entityType: string | null;
  entityId: string | null;
  pageId: string | null;
  taskId: string | null;
  metadata: Record<string, unknown>;
}

interface ActorInput {
  actorId?: string | null;
  actorName?: string | null;
  actorType?: SystemEventActorType;
}

interface LogSystemEventInput extends ActorInput {
  eventName: SystemEventName;
  summary: string;
  detail?: string | null;
  clientSlug?: string | null;
  visibility?: SystemEventVisibility;
  entityType?: string | null;
  entityId?: string | null;
  pageId?: string | null;
  taskId?: string | null;
  metadata?: Record<string, unknown>;
}

interface ListSystemEventsOptions {
  audience?: "all" | SystemEventVisibility;
  clientSlug?: string | null;
  entityId?: string | null;
  entityType?: string | null;
  limit?: number;
}

interface ListCampaignSystemEventsOptions {
  audience?: "all" | SystemEventVisibility;
  clientSlug: string;
  campaignId: string;
  limit?: number;
}

function eventMatchesCampaign(event: SystemEvent, campaignId: string) {
  if (event.entityType === "campaign" && event.entityId === campaignId) return true;
  return event.metadata.campaignId === campaignId;
}

function toActorName(user: Awaited<ReturnType<typeof currentUser>>): string | null {
  if (!user) return null;
  if (user.fullName) return user.fullName;

  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  if (name) return name;

  return user.emailAddresses[0]?.emailAddress ?? user.username ?? null;
}

async function resolveActor(input: ActorInput) {
  if (input.actorName && (input.actorId || input.actorType)) {
    return {
      actorId: input.actorId ?? null,
      actorName: input.actorName,
      actorType: input.actorType ?? "user",
    };
  }

  const user = await currentUser();

  return {
    actorId: input.actorId ?? user?.id ?? null,
    actorName: input.actorName ?? toActorName(user),
    actorType: input.actorType ?? "user",
  };
}

export async function getCurrentActor(input: ActorInput = {}) {
  return resolveActor(input);
}

export async function logSystemEvent(input: LogSystemEventInput): Promise<void> {
  if (!supabaseAdmin) return;

  const actor = await resolveActor(input);

  const { error } = await supabaseAdmin.from("system_events").insert({
    event_name: input.eventName,
    visibility: input.visibility ?? "shared",
    actor_type: actor.actorType,
    actor_id: actor.actorId,
    actor_name: actor.actorName,
    client_slug: input.clientSlug ?? null,
    summary: input.summary,
    detail: input.detail ?? null,
    entity_type: input.entityType ?? null,
    entity_id: input.entityId ?? null,
    page_id: input.pageId ?? null,
    task_id: input.taskId ?? null,
    metadata: input.metadata ?? {},
  });

  if (error) {
    console.error("[system-events] Failed to write event:", error.message);
  }
}

export async function listSystemEvents(
  options: ListSystemEventsOptions = {},
): Promise<SystemEvent[]> {
  if (!supabaseAdmin) return [];

  let query = supabaseAdmin
    .from("system_events")
    .select(
      "id, created_at, event_name, visibility, actor_type, actor_id, actor_name, client_slug, summary, detail, entity_type, entity_id, page_id, task_id, metadata",
    )
    .order("created_at", { ascending: false })
    .limit(options.limit ?? 12);

  if (options.clientSlug) {
    query = query.eq("client_slug", options.clientSlug);
  }

  if (options.entityType) {
    query = query.eq("entity_type", options.entityType);
  }

  if (options.entityId) {
    query = query.eq("entity_id", options.entityId);
  }

  if (options.audience && options.audience !== "all") {
    query = query.eq("visibility", options.audience);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[system-events] Failed to list events:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    createdAt: row.created_at as string,
    eventName: row.event_name as SystemEventName | string,
    visibility: row.visibility as SystemEventVisibility,
    actorType: row.actor_type as SystemEventActorType,
    actorId: (row.actor_id as string | null) ?? null,
    actorName: (row.actor_name as string | null) ?? null,
    clientSlug: (row.client_slug as string | null) ?? null,
    summary: row.summary as string,
    detail: (row.detail as string | null) ?? null,
    entityType: (row.entity_type as string | null) ?? null,
    entityId: (row.entity_id as string | null) ?? null,
    pageId: (row.page_id as string | null) ?? null,
    taskId: (row.task_id as string | null) ?? null,
    metadata: ((row.metadata as Record<string, unknown> | null) ?? {}) as Record<
      string,
      unknown
    >,
  }));
}

export async function listCampaignSystemEvents(
  options: ListCampaignSystemEventsOptions,
): Promise<SystemEvent[]> {
  const events = await listSystemEvents({
    audience: options.audience,
    clientSlug: options.clientSlug,
    limit: Math.max((options.limit ?? 8) * 6, 24),
  });

  return events.filter((event) => eventMatchesCampaign(event, options.campaignId)).slice(0, options.limit ?? 8);
}

export function summarizeChangedFields(fields: string[]): string | null {
  if (fields.length === 0) return null;
  if (fields.length === 1) return `Changed ${fields[0]}.`;
  if (fields.length === 2) return `Changed ${fields[0]} and ${fields[1]}.`;

  return `Changed ${fields.slice(0, -1).join(", ")}, and ${fields.at(-1)}.`;
}
