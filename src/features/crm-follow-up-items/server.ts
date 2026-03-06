import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/workspace-types";
import { enqueueExternalAgentTask } from "@/lib/agent-dispatch";
import { supabaseAdmin } from "@/lib/supabase";
import { notifyWorkflowAssignee } from "@/features/notifications/workflow";
import {
  logSystemEvent,
  summarizeChangedFields,
  type SystemEventActorType,
} from "@/features/system-events/server";

export type CrmFollowUpItemVisibility = "admin_only" | "shared";

export interface CrmFollowUpItem {
  id: string;
  contactId: string;
  contactName: string | null;
  clientSlug: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  visibility: CrmFollowUpItemVisibility;
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

interface CrmFollowUpItemActor {
  actorId?: string | null;
  actorName?: string | null;
  actorType?: SystemEventActorType;
}

interface CrmFollowUpItemTriagePreviousState {
  priority: TaskPriority;
  status: TaskStatus;
}

interface ListCrmFollowUpItemsOptions {
  audience?: "all" | CrmFollowUpItemVisibility;
  clientSlug?: string | null;
  contactId?: string | null;
  limit?: number;
}

interface CreateSystemCrmFollowUpItemInput extends CrmFollowUpItemActor {
  contactId: string;
  clientSlug: string;
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  visibility?: CrmFollowUpItemVisibility;
  assigneeId?: string | null;
  assigneeName?: string | null;
  dueDate?: string | null;
  createdBy?: string | null;
  sourceEntityType?: string | null;
  sourceEntityId?: string | null;
}

const CRM_FOLLOW_UP_ITEM_SELECT =
  "id, contact_id, client_slug, title, description, status, priority, visibility, assignee_id, assignee_name, due_date, created_by, position, source_entity_type, source_entity_id, created_at, updated_at";

function taskStatusLabel(status: TaskStatus) {
  return TASK_STATUS_LABELS[status] ?? status;
}

function shouldEnqueueCrmFollowUpItemTriage(
  item: CrmFollowUpItem,
  previous?: CrmFollowUpItemTriagePreviousState,
) {
  if (item.sourceEntityType === "agent_task") return false;
  if (!previous) return item.status === "review" || item.priority === "urgent";

  return (
    (item.status === "review" && previous.status !== "review") ||
    (item.priority === "urgent" && previous.priority !== "urgent")
  );
}

function crmFollowUpItemTriagePrompt(item: CrmFollowUpItem) {
  return [
    "A CRM follow-up item needs triage.",
    `Client: ${item.clientSlug}`,
    item.contactName ? `Contact: ${item.contactName}` : null,
    `CRM contact ID: ${item.contactId}`,
    `Follow-up item: ${item.title}`,
    item.description ? `Description: ${item.description}` : null,
    `Status: ${taskStatusLabel(item.status)}`,
    `Priority: ${TASK_PRIORITY_LABELS[item.priority]}`,
    item.assigneeName ? `Assignee: ${item.assigneeName}` : null,
    item.dueDate ? `Due date: ${item.dueDate}` : null,
    `Follow-up item ID: ${item.id}`,
    "Give a concise CRM operations brief with:",
    "1. what this follow-up is about",
    "2. the next best manual follow-up step",
    "3. any blockers or missing context",
    "Keep it short and operational.",
  ]
    .filter(Boolean)
    .join("\n");
}

async function listContactNames(contactIds: string[]) {
  if (!supabaseAdmin || contactIds.length === 0) return new Map<string, string>();

  const { data, error } = await supabaseAdmin
    .from("crm_contacts" as never)
    .select("id, full_name")
    .in("id", contactIds);

  if (error) {
    console.error("[crm-follow-up-items] contact lookup failed:", error.message);
    return new Map<string, string>();
  }

  return new Map(
    (data ?? []).map((row) => [
      String((row as Record<string, unknown>).id),
      String((row as Record<string, unknown>).full_name ?? ""),
    ]),
  );
}

function mapCrmFollowUpItem(
  row: Record<string, unknown>,
  contactNames: Map<string, string>,
): CrmFollowUpItem {
  const contactId = row.contact_id as string;

  return {
    id: row.id as string,
    contactId,
    contactName: contactNames.get(contactId) ?? null,
    clientSlug: row.client_slug as string,
    title: row.title as string,
    description: (row.description as string | null) ?? null,
    status: row.status as TaskStatus,
    priority: row.priority as TaskPriority,
    visibility: row.visibility as CrmFollowUpItemVisibility,
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

export async function listCrmFollowUpItems(
  options: ListCrmFollowUpItemsOptions,
): Promise<CrmFollowUpItem[]> {
  if (!supabaseAdmin) return [];

  let query = supabaseAdmin
    .from("crm_follow_up_items" as never)
    .select(CRM_FOLLOW_UP_ITEM_SELECT)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (options.clientSlug) {
    query = query.eq("client_slug", options.clientSlug);
  }

  if (options.contactId) {
    query = query.eq("contact_id", options.contactId);
  }

  if (options.audience && options.audience !== "all") {
    query = query.eq("visibility", options.audience);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[crm-follow-up-items] list failed:", error.message);
    return [];
  }

  const rows = (data ?? []) as Record<string, unknown>[];
  const contactNames = await listContactNames(
    [...new Set(rows.map((row) => String(row.contact_id)).filter(Boolean))],
  );

  return rows.map((row) => mapCrmFollowUpItem(row, contactNames));
}

export async function findCrmFollowUpItemBySource(
  sourceEntityType: string,
  sourceEntityId: string,
): Promise<CrmFollowUpItem | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from("crm_follow_up_items" as never)
    .select(CRM_FOLLOW_UP_ITEM_SELECT)
    .eq("source_entity_type", sourceEntityType)
    .eq("source_entity_id", sourceEntityId)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[crm-follow-up-items] source lookup failed:", error.message);
    return null;
  }

  if (!data) return null;

  const contactNames = await listContactNames([String((data as Record<string, unknown>).contact_id)]);
  return mapCrmFollowUpItem(data as Record<string, unknown>, contactNames);
}

export async function getCrmFollowUpItemById(itemId: string): Promise<CrmFollowUpItem | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from("crm_follow_up_items" as never)
    .select(CRM_FOLLOW_UP_ITEM_SELECT)
    .eq("id", itemId)
    .maybeSingle();

  if (error) {
    console.error("[crm-follow-up-items] item lookup failed:", error.message);
    return null;
  }

  if (!data) return null;

  const contactNames = await listContactNames([String((data as Record<string, unknown>).contact_id)]);
  return mapCrmFollowUpItem(data as Record<string, unknown>, contactNames);
}

export async function maybeEnqueueCrmFollowUpItemTriage(
  item: CrmFollowUpItem,
  previous?: CrmFollowUpItemTriagePreviousState,
) {
  if (!shouldEnqueueCrmFollowUpItemTriage(item, previous)) return null;

  const taskId = await enqueueExternalAgentTask({
    action: "triage-crm-follow-up-item",
    prompt: crmFollowUpItemTriagePrompt(item),
    toAgent: "assistant",
  });

  if (!taskId) return null;

  await logSystemEvent({
    eventName: "agent_action_requested",
    actorType: "system",
    actorName: "Outlet CRM",
    clientSlug: item.clientSlug,
    visibility: item.visibility,
    entityType: "agent_task",
    entityId: taskId,
    summary: `Queued CRM agent triage for follow-up "${item.title}"`,
    detail: "Assistant will prepare a concise CRM next-step brief.",
    metadata: {
      crmContactId: item.contactId,
      crmContactName: item.contactName,
      crmFollowUpItemId: item.id,
      sourceEntityId: item.sourceEntityId,
      sourceEntityType: item.sourceEntityType,
      taskId,
      toAgent: "assistant",
    },
  });

  return taskId;
}

export async function createSystemCrmFollowUpItem(
  input: CreateSystemCrmFollowUpItemInput,
): Promise<CrmFollowUpItem | null> {
  if (!supabaseAdmin) return null;

  if (input.sourceEntityType && input.sourceEntityId) {
    const existing = await findCrmFollowUpItemBySource(input.sourceEntityType, input.sourceEntityId);
    if (existing) return existing;
  }

  const status = input.status ?? "todo";
  const priority = input.priority ?? "medium";

  const { data: maxRow } = await supabaseAdmin
    .from("crm_follow_up_items" as never)
    .select("position")
    .eq("contact_id", input.contactId)
    .eq("status", status)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextPosition = (((maxRow as Record<string, unknown> | null)?.position as number | null) ?? -1) + 1;

  const { data, error } = await supabaseAdmin
    .from("crm_follow_up_items" as never)
    .insert({
      contact_id: input.contactId,
      client_slug: input.clientSlug,
      title: input.title,
      description: input.description ?? null,
      status,
      priority,
      visibility: input.visibility ?? "shared",
      assignee_id: input.assigneeId ?? null,
      assignee_name: input.assigneeName ?? null,
      due_date: input.dueDate ?? null,
      created_by: input.createdBy ?? null,
      position: nextPosition,
      source_entity_type: input.sourceEntityType ?? null,
      source_entity_id: input.sourceEntityId ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[crm-follow-up-items] create failed:", error.message);
    return null;
  }

  const item = await getCrmFollowUpItemById(String((data as Record<string, unknown>).id));
  if (!item) return null;

  await logSystemEvent({
    eventName: "crm_follow_up_item_created",
    actorId: input.actorId,
    actorName: input.actorName,
    actorType: input.actorType,
    clientSlug: item.clientSlug,
    visibility: item.visibility,
    entityType: "crm_follow_up_item",
    entityId: item.id,
    summary: `Created CRM follow-up "${item.title}"`,
    detail: `Added it to ${taskStatusLabel(item.status)} as ${TASK_PRIORITY_LABELS[item.priority]}.`,
    metadata: {
      crmContactId: item.contactId,
      crmContactName: item.contactName,
      priority: item.priority,
      status: item.status,
      visibility: item.visibility,
      sourceEntityId: item.sourceEntityId,
      sourceEntityType: item.sourceEntityType,
    },
  });

  await notifyWorkflowAssignee({
    actorId: input.actorId ?? null,
    actorName: input.actorName ?? null,
    assigneeId: item.assigneeId,
    clientSlug: item.clientSlug,
    entityId: item.contactId,
    entityType: "crm_contact",
    message: item.title,
    title: "CRM follow-up assigned to you",
    visibility: item.visibility,
  });

  await maybeEnqueueCrmFollowUpItemTriage(item);
  return item;
}

export async function summarizeCrmFollowUpChanges(fields: string[]) {
  return summarizeChangedFields(fields);
}
