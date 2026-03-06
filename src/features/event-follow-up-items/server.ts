import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/workspace-types";
import { enqueueExternalAgentTask } from "@/lib/agent-dispatch";
import { supabaseAdmin } from "@/lib/supabase";
import {
  logSystemEvent,
  summarizeChangedFields,
  type SystemEventActorType,
} from "@/features/system-events/server";

export type EventFollowUpItemVisibility = "admin_only" | "shared";

export interface EventFollowUpItem {
  id: string;
  eventId: string;
  eventName: string | null;
  eventDate: string | null;
  eventVenue: string | null;
  clientSlug: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  visibility: EventFollowUpItemVisibility;
  assigneeId: string | null;
  assigneeName: string | null;
  dueDate: string | null;
  createdBy: string | null;
  position: number;
  sourceEntityId: string | null;
  sourceEntityType: string | null;
  createdAt: string;
  updatedAt: string;
}

interface EventFollowUpItemActor {
  actorId?: string | null;
  actorName?: string | null;
  actorType?: SystemEventActorType;
}

interface EventFollowUpItemTriagePreviousState {
  priority: TaskPriority;
  status: TaskStatus;
}

interface ListEventFollowUpItemsOptions {
  audience?: "all" | EventFollowUpItemVisibility;
  clientSlug?: string | null;
  eventId?: string | null;
  limit?: number;
}

interface CreateSystemEventFollowUpItemInput extends EventFollowUpItemActor {
  eventId: string;
  clientSlug?: string | null;
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  visibility?: EventFollowUpItemVisibility;
  assigneeId?: string | null;
  assigneeName?: string | null;
  dueDate?: string | null;
  createdBy?: string | null;
  sourceEntityType?: string | null;
  sourceEntityId?: string | null;
}

interface UpdateSystemEventFollowUpItemInput extends EventFollowUpItemActor {
  itemId: string;
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  visibility?: EventFollowUpItemVisibility;
  assigneeId?: string | null;
  assigneeName?: string | null;
  dueDate?: string | null;
}

const EVENT_FOLLOW_UP_ITEM_SELECT =
  "id, event_id, client_slug, title, description, status, priority, visibility, assignee_id, assignee_name, due_date, created_by, position, source_entity_type, source_entity_id, created_at, updated_at";

const FIELD_LABELS: Record<string, string> = {
  assigneeId: "assignee",
  assigneeName: "assignee name",
  description: "description",
  dueDate: "due date",
  priority: "priority",
  status: "status",
  title: "title",
  visibility: "visibility",
};

function taskStatusLabel(status: TaskStatus) {
  return TASK_STATUS_LABELS[status] ?? status;
}

function shouldEnqueueEventFollowUpItemTriage(
  item: EventFollowUpItem,
  previous?: EventFollowUpItemTriagePreviousState,
) {
  if (item.sourceEntityType === "agent_task") return false;
  if (!previous) return item.status === "review" || item.priority === "urgent";

  return (
    (item.status === "review" && previous.status !== "review") ||
    (item.priority === "urgent" && previous.priority !== "urgent")
  );
}

function eventFollowUpItemTriagePrompt(item: EventFollowUpItem) {
  return [
    "An event follow-up item needs triage.",
    item.clientSlug ? `Client: ${item.clientSlug}` : "Client: unassigned",
    item.eventName ? `Event: ${item.eventName}` : null,
    `Event ID: ${item.eventId}`,
    item.eventVenue ? `Venue: ${item.eventVenue}` : null,
    item.eventDate ? `Date: ${item.eventDate}` : null,
    `Follow-up item: ${item.title}`,
    item.description ? `Description: ${item.description}` : null,
    `Status: ${taskStatusLabel(item.status)}`,
    `Priority: ${TASK_PRIORITY_LABELS[item.priority]}`,
    item.assigneeName ? `Assignee: ${item.assigneeName}` : null,
    item.dueDate ? `Due date: ${item.dueDate}` : null,
    `Follow-up item ID: ${item.id}`,
    "Give a concise event operations brief with:",
    "1. what this follow-up is about",
    "2. the next best ticketing or promotion step",
    "3. any blockers or missing information",
    "Keep it short and operational.",
  ]
    .filter(Boolean)
    .join("\n");
}

async function listEventInfo(eventIds: string[]) {
  if (!supabaseAdmin || eventIds.length === 0) {
    return new Map<string, { date: string | null; name: string | null; venue: string | null }>();
  }

  const { data, error } = await supabaseAdmin
    .from("tm_events")
    .select("id, name, artist, date, venue")
    .in("id", eventIds);

  if (error) {
    console.error("[event-follow-up-items] event lookup failed:", error.message);
    return new Map<string, { date: string | null; name: string | null; venue: string | null }>();
  }

  return new Map(
    (data ?? []).map((row) => {
      const record = row as Record<string, unknown>;
      return [
        String(record.id),
        {
          date: (record.date as string | null) ?? null,
          name: ((record.artist as string | null) ?? (record.name as string | null)) ?? null,
          venue: (record.venue as string | null) ?? null,
        },
      ];
    }),
  );
}

function mapEventFollowUpItem(
  row: Record<string, unknown>,
  eventInfo: Map<string, { date: string | null; name: string | null; venue: string | null }>,
): EventFollowUpItem {
  const eventId = row.event_id as string;
  const event = eventInfo.get(eventId);

  return {
    id: row.id as string,
    eventId,
    eventName: event?.name ?? null,
    eventDate: event?.date ?? null,
    eventVenue: event?.venue ?? null,
    clientSlug: (row.client_slug as string | null) ?? null,
    title: row.title as string,
    description: (row.description as string | null) ?? null,
    status: row.status as TaskStatus,
    priority: row.priority as TaskPriority,
    visibility: row.visibility as EventFollowUpItemVisibility,
    assigneeId: (row.assignee_id as string | null) ?? null,
    assigneeName: (row.assignee_name as string | null) ?? null,
    dueDate: (row.due_date as string | null) ?? null,
    createdBy: (row.created_by as string | null) ?? null,
    position: ((row.position as number | null) ?? 0) as number,
    sourceEntityId: (row.source_entity_id as string | null) ?? null,
    sourceEntityType: (row.source_entity_type as string | null) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function listEventFollowUpItems(
  options: ListEventFollowUpItemsOptions,
): Promise<EventFollowUpItem[]> {
  if (!supabaseAdmin) return [];

  let query = supabaseAdmin
    .from("event_follow_up_items" as never)
    .select(EVENT_FOLLOW_UP_ITEM_SELECT)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (options.clientSlug !== undefined) {
    if (options.clientSlug) {
      query = query.eq("client_slug", options.clientSlug);
    } else {
      query = query.is("client_slug", null);
    }
  }

  if (options.eventId) {
    query = query.eq("event_id", options.eventId);
  }

  if (options.audience && options.audience !== "all") {
    query = query.eq("visibility", options.audience);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[event-follow-up-items] list failed:", error.message);
    return [];
  }

  const rows = (data ?? []) as Record<string, unknown>[];
  const eventInfo = await listEventInfo(
    [...new Set(rows.map((row) => String(row.event_id)).filter(Boolean))],
  );

  return rows.map((row) => mapEventFollowUpItem(row, eventInfo));
}

export async function findEventFollowUpItemBySource(
  sourceEntityType: string,
  sourceEntityId: string,
): Promise<EventFollowUpItem | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from("event_follow_up_items" as never)
    .select(EVENT_FOLLOW_UP_ITEM_SELECT)
    .eq("source_entity_type", sourceEntityType)
    .eq("source_entity_id", sourceEntityId)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[event-follow-up-items] source lookup failed:", error.message);
    return null;
  }

  if (!data) return null;

  const eventInfo = await listEventInfo([String((data as Record<string, unknown>).event_id)]);
  return mapEventFollowUpItem(data as Record<string, unknown>, eventInfo);
}

export async function getEventFollowUpItemById(itemId: string): Promise<EventFollowUpItem | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from("event_follow_up_items" as never)
    .select(EVENT_FOLLOW_UP_ITEM_SELECT)
    .eq("id", itemId)
    .maybeSingle();

  if (error) {
    console.error("[event-follow-up-items] item lookup failed:", error.message);
    return null;
  }

  if (!data) return null;

  const eventInfo = await listEventInfo([String((data as Record<string, unknown>).event_id)]);
  return mapEventFollowUpItem(data as Record<string, unknown>, eventInfo);
}

export async function maybeEnqueueEventFollowUpItemTriage(
  item: EventFollowUpItem,
  previous?: EventFollowUpItemTriagePreviousState,
) {
  if (!shouldEnqueueEventFollowUpItemTriage(item, previous)) return null;

  const taskId = await enqueueExternalAgentTask({
    action: "triage-event-follow-up-item",
    prompt: eventFollowUpItemTriagePrompt(item),
    toAgent: "assistant",
  });

  if (!taskId) return null;

  await logSystemEvent({
    eventName: "agent_action_requested",
    actorType: "system",
    actorName: "Outlet Events",
    clientSlug: item.clientSlug ?? null,
    visibility: "admin_only",
    entityType: "agent_task",
    entityId: taskId,
    taskId,
    summary: `Queued agent triage for event follow-up "${item.title}"`,
    detail: "Assistant will prepare a concise event operations brief for the team.",
    metadata: {
      eventId: item.eventId,
      eventName: item.eventName,
      followUpItemId: item.id,
      toAgent: "assistant",
    },
  });

  return taskId;
}

export async function createSystemEventFollowUpItem(
  input: CreateSystemEventFollowUpItemInput,
): Promise<EventFollowUpItem | null> {
  if (!supabaseAdmin) return null;

  const { data: maxRow, error: maxError } = await supabaseAdmin
    .from("event_follow_up_items" as never)
    .select("position")
    .eq("event_id", input.eventId)
    .eq("status", input.status ?? "todo")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (maxError) {
    console.error("[event-follow-up-items] max position lookup failed:", maxError.message);
    return null;
  }

  const nextPosition =
    (((maxRow as Record<string, unknown> | null)?.position as number | null) ?? -1) + 1;

  const { data, error } = await supabaseAdmin
    .from("event_follow_up_items" as never)
    .insert({
      event_id: input.eventId,
      client_slug: input.clientSlug ?? null,
      title: input.title,
      description: input.description ?? null,
      status: input.status ?? "todo",
      priority: input.priority ?? "medium",
      visibility: input.visibility ?? "shared",
      assignee_id: input.assigneeId ?? null,
      assignee_name: input.assigneeName ?? null,
      due_date: input.dueDate ?? null,
      created_by: input.createdBy ?? input.actorId ?? null,
      position: nextPosition,
      source_entity_type: input.sourceEntityType ?? null,
      source_entity_id: input.sourceEntityId ?? null,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[event-follow-up-items] create failed:", error?.message ?? "unknown error");
    return null;
  }

  const item = await getEventFollowUpItemById(String((data as Record<string, unknown>).id));
  if (!item) return null;

  await logSystemEvent({
    eventName: "event_follow_up_item_created",
    actorId: input.actorId ?? null,
    actorName: input.actorName ?? null,
    actorType: input.actorType ?? "system",
    clientSlug: item.clientSlug ?? null,
    visibility: item.visibility,
    entityType: "event_follow_up_item",
    entityId: item.id,
    summary: `Created event follow-up "${item.title}"`,
    detail: `Added it to ${taskStatusLabel(item.status)} as ${TASK_PRIORITY_LABELS[item.priority]}.`,
    metadata: {
      eventId: item.eventId,
      eventName: item.eventName,
      priority: item.priority,
      status: item.status,
      visibility: item.visibility,
    },
  });

  await maybeEnqueueEventFollowUpItemTriage(item);
  return item;
}

export async function updateSystemEventFollowUpItem(
  input: UpdateSystemEventFollowUpItemInput,
): Promise<EventFollowUpItem | null> {
  if (!supabaseAdmin) return null;

  const { data: existing, error: existingError } = await supabaseAdmin
    .from("event_follow_up_items" as never)
    .select(EVENT_FOLLOW_UP_ITEM_SELECT)
    .eq("id", input.itemId)
    .maybeSingle();

  if (existingError || !existing) {
    console.error(
      "[event-follow-up-items] existing item lookup failed:",
      existingError?.message ?? "item not found",
    );
    return null;
  }

  const existingRow = existing as Record<string, unknown>;
  const nextValues = {
    assigneeId: input.assigneeId ?? existingRow.assignee_id ?? null,
    assigneeName: input.assigneeName ?? existingRow.assignee_name ?? null,
    description:
      "description" in input ? input.description ?? null : ((existingRow.description as string | null) ?? null),
    dueDate: "dueDate" in input ? input.dueDate ?? null : ((existingRow.due_date as string | null) ?? null),
    priority: input.priority ?? (existingRow.priority as TaskPriority),
    status: input.status ?? (existingRow.status as TaskStatus),
    title: input.title ?? (existingRow.title as string),
    visibility: input.visibility ?? (existingRow.visibility as EventFollowUpItemVisibility),
  };

  const changedKeys = Object.keys(input).filter((key) => {
    switch (key) {
      case "assigneeId":
        return nextValues.assigneeId !== existingRow.assignee_id;
      case "assigneeName":
        return nextValues.assigneeName !== existingRow.assignee_name;
      case "description":
        return nextValues.description !== existingRow.description;
      case "dueDate":
        return nextValues.dueDate !== existingRow.due_date;
      case "priority":
        return nextValues.priority !== existingRow.priority;
      case "status":
        return nextValues.status !== existingRow.status;
      case "title":
        return nextValues.title !== existingRow.title;
      case "visibility":
        return nextValues.visibility !== existingRow.visibility;
      default:
        return false;
    }
  });

  if (changedKeys.length === 0) {
    return getEventFollowUpItemById(input.itemId);
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (nextValues.status !== existingRow.status) {
    const { data: maxRow } = await supabaseAdmin
      .from("event_follow_up_items" as never)
      .select("position")
      .eq("event_id", existingRow.event_id)
      .eq("status", nextValues.status)
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();

    updates.position =
      (((maxRow as Record<string, unknown> | null)?.position as number | null) ?? -1) + 1;
  }

  if (changedKeys.includes("title")) updates.title = nextValues.title;
  if (changedKeys.includes("description")) updates.description = nextValues.description;
  if (changedKeys.includes("status")) updates.status = nextValues.status;
  if (changedKeys.includes("priority")) updates.priority = nextValues.priority;
  if (changedKeys.includes("visibility")) updates.visibility = nextValues.visibility;
  if (changedKeys.includes("assigneeId")) updates.assignee_id = nextValues.assigneeId;
  if (changedKeys.includes("assigneeName")) updates.assignee_name = nextValues.assigneeName;
  if (changedKeys.includes("dueDate")) updates.due_date = nextValues.dueDate;

  const { error } = await supabaseAdmin
    .from("event_follow_up_items" as never)
    .update(updates)
    .eq("id", input.itemId);

  if (error) {
    console.error("[event-follow-up-items] update failed:", error.message);
    return null;
  }

  const item = await getEventFollowUpItemById(input.itemId);
  if (!item) return null;

  const changedFields = changedKeys.map((key) => FIELD_LABELS[key] ?? key);
  await logSystemEvent({
    eventName: "event_follow_up_item_updated",
    actorId: input.actorId ?? null,
    actorName: input.actorName ?? null,
    actorType: input.actorType ?? "system",
    clientSlug: item.clientSlug ?? null,
    visibility: item.visibility,
    entityType: "event_follow_up_item",
    entityId: item.id,
    summary: `Updated event follow-up "${item.title}"`,
    detail: summarizeChangedFields(changedFields),
    metadata: {
      eventId: item.eventId,
      eventName: item.eventName,
      priority: item.priority,
      status: item.status,
      visibility: item.visibility,
    },
  });

  await maybeEnqueueEventFollowUpItemTriage(item, {
    priority: existingRow.priority as TaskPriority,
    status: existingRow.status as TaskStatus,
  });

  return item;
}

export async function deleteEventFollowUpItem(
  itemId: string,
  actor: EventFollowUpItemActor = {},
): Promise<EventFollowUpItem | null> {
  if (!supabaseAdmin) return null;

  const item = await getEventFollowUpItemById(itemId);
  if (!item) return null;

  const { error } = await supabaseAdmin
    .from("event_follow_up_items" as never)
    .delete()
    .eq("id", itemId);

  if (error) {
    console.error("[event-follow-up-items] delete failed:", error.message);
    return null;
  }

  await logSystemEvent({
    eventName: "event_follow_up_item_deleted",
    actorId: actor.actorId ?? null,
    actorName: actor.actorName ?? null,
    actorType: actor.actorType ?? "system",
    clientSlug: item.clientSlug ?? null,
    visibility: item.visibility,
    entityType: "event_follow_up_item",
    entityId: item.id,
    summary: `Deleted event follow-up "${item.title}"`,
    metadata: {
      eventId: item.eventId,
      eventName: item.eventName,
    },
  });

  return item;
}
