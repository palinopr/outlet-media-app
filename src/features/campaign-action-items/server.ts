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
import { getEffectiveCampaignClientSlug } from "@/lib/campaign-client-assignment";

export type CampaignActionItemVisibility = "admin_only" | "shared";

export interface CampaignActionItem {
  id: string;
  campaignId: string;
  clientSlug: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  visibility: CampaignActionItemVisibility;
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

interface CampaignActionItemActor {
  actorId?: string | null;
  actorName?: string | null;
  actorType?: SystemEventActorType;
}

interface CampaignActionItemTriagePreviousState {
  priority: TaskPriority;
  status: TaskStatus;
}

interface ListCampaignActionItemsOptions {
  audience?: "all" | CampaignActionItemVisibility;
  campaignId: string;
  clientSlug: string;
  limit?: number;
}

interface CreateSystemCampaignActionItemInput extends CampaignActionItemActor {
  campaignId: string;
  clientSlug: string;
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  visibility?: CampaignActionItemVisibility;
  assigneeId?: string | null;
  assigneeName?: string | null;
  dueDate?: string | null;
  createdBy?: string | null;
  sourceEntityType?: string | null;
  sourceEntityId?: string | null;
}

interface UpdateSystemCampaignActionItemInput extends CampaignActionItemActor {
  itemId: string;
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  visibility?: CampaignActionItemVisibility;
  assigneeId?: string | null;
  assigneeName?: string | null;
  dueDate?: string | null;
}

const CAMPAIGN_ACTION_ITEM_SELECT =
  "id, campaign_id, client_slug, title, description, status, priority, visibility, assignee_id, assignee_name, due_date, created_by, position, source_entity_type, source_entity_id, created_at, updated_at";

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

function shouldEnqueueCampaignActionItemTriage(
  item: CampaignActionItem,
  previous?: CampaignActionItemTriagePreviousState,
) {
  if (item.sourceEntityType === "approval_request") return false;
  if (!previous) return item.status === "review" || item.priority === "urgent";

  return (
    (item.status === "review" && previous.status !== "review") ||
    (item.priority === "urgent" && previous.priority !== "urgent")
  );
}

function campaignActionItemTriagePrompt(item: CampaignActionItem) {
  return [
    `A campaign action item needs triage.`,
    `Client: ${item.clientSlug}`,
    `Campaign ID: ${item.campaignId}`,
    `Action item: ${item.title}`,
    item.description ? `Description: ${item.description}` : null,
    `Status: ${taskStatusLabel(item.status)}`,
    `Priority: ${TASK_PRIORITY_LABELS[item.priority]}`,
    item.assigneeName ? `Assignee: ${item.assigneeName}` : null,
    item.dueDate ? `Due date: ${item.dueDate}` : null,
    `Action item ID: ${item.id}`,
    `Give a concise operations brief with:`,
    `1. what this action item is about`,
    `2. the next best step`,
    `3. any blockers or missing information`,
    `Keep it short and operational.`,
  ]
    .filter(Boolean)
    .join("\n");
}

function mapCampaignActionItem(row: Record<string, unknown>): CampaignActionItem {
  return {
    id: row.id as string,
    campaignId: row.campaign_id as string,
    clientSlug: row.client_slug as string,
    title: row.title as string,
    description: (row.description as string | null) ?? null,
    status: row.status as TaskStatus,
    priority: row.priority as TaskPriority,
    visibility: row.visibility as CampaignActionItemVisibility,
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

export async function listCampaignActionItems(
  options: ListCampaignActionItemsOptions,
): Promise<CampaignActionItem[]> {
  if (!supabaseAdmin) return [];

  let query = supabaseAdmin
    .from("campaign_action_items")
    .select(CAMPAIGN_ACTION_ITEM_SELECT)
    .eq("campaign_id", options.campaignId)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (options.audience && options.audience !== "all") {
    query = query.eq("visibility", options.audience);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[campaign-action-items] list failed:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapCampaignActionItem(row as Record<string, unknown>));
}

export async function findCampaignActionItemBySource(
  sourceEntityType: string,
  sourceEntityId: string,
): Promise<CampaignActionItem | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from("campaign_action_items")
    .select(CAMPAIGN_ACTION_ITEM_SELECT)
    .eq("source_entity_type", sourceEntityType)
    .eq("source_entity_id", sourceEntityId)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[campaign-action-items] source lookup failed:", error.message);
    return null;
  }

  return data ? mapCampaignActionItem(data as Record<string, unknown>) : null;
}

export async function getCampaignActionItemById(
  itemId: string,
): Promise<CampaignActionItem | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from("campaign_action_items")
    .select(CAMPAIGN_ACTION_ITEM_SELECT)
    .eq("id", itemId)
    .maybeSingle();

  if (error) {
    console.error("[campaign-action-items] item lookup failed:", error.message);
    return null;
  }

  return data ? mapCampaignActionItem(data as Record<string, unknown>) : null;
}

export async function maybeEnqueueCampaignActionItemTriage(
  item: CampaignActionItem,
  previous?: CampaignActionItemTriagePreviousState,
) {
  if (!shouldEnqueueCampaignActionItemTriage(item, previous)) return null;

  const taskId = await enqueueExternalAgentTask({
    action: "triage-campaign-action-item",
    prompt: campaignActionItemTriagePrompt(item),
    toAgent: "assistant",
  });

  if (!taskId) return null;

  await logSystemEvent({
    eventName: "agent_action_requested",
    actorType: "system",
    clientSlug: item.clientSlug,
    visibility: item.visibility,
    entityType: "agent_task",
    entityId: taskId,
    summary: `Queued agent triage for action item "${item.title}"`,
    detail: "Assistant will prepare a concise operational next-step brief.",
    metadata: {
      actionItemId: item.id,
      campaignId: item.campaignId,
      sourceEntityId: item.sourceEntityId,
      sourceEntityType: item.sourceEntityType,
      taskId,
      toAgent: "assistant",
    },
  });

  return taskId;
}

export async function createSystemCampaignActionItem(
  input: CreateSystemCampaignActionItemInput,
): Promise<CampaignActionItem | null> {
  if (!supabaseAdmin) return null;

  const effectiveClientSlug =
    (await getEffectiveCampaignClientSlug(input.campaignId)) ?? input.clientSlug;

  if (input.sourceEntityType && input.sourceEntityId) {
    const existing = await findCampaignActionItemBySource(
      input.sourceEntityType,
      input.sourceEntityId,
    );

    if (existing) {
      if (existing.clientSlug !== effectiveClientSlug) {
        const { error } = await supabaseAdmin
          .from("campaign_action_items")
          .update({
            client_slug: effectiveClientSlug,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (error) {
          console.error("[campaign-action-items] source ownership sync failed:", error.message);
        } else {
          return {
            ...existing,
            clientSlug: effectiveClientSlug,
          };
        }
      }

      return existing;
    }
  }

  const status = input.status ?? "todo";
  const priority = input.priority ?? "medium";
  const visibility = input.visibility ?? "shared";

  const { data: maxRow, error: maxError } = await supabaseAdmin
    .from("campaign_action_items")
    .select("position")
    .eq("campaign_id", input.campaignId)
    .eq("status", status)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (maxError) {
    console.error("[campaign-action-items] position lookup failed:", maxError.message);
    return null;
  }

  const { data, error } = await supabaseAdmin
    .from("campaign_action_items")
    .insert({
      campaign_id: input.campaignId,
      client_slug: effectiveClientSlug,
      title: input.title,
      description: input.description ?? null,
      status,
      priority,
      visibility,
      assignee_id: input.assigneeId ?? null,
      assignee_name: input.assigneeName ?? null,
      due_date: input.dueDate ?? null,
      created_by: input.createdBy ?? input.actorId ?? null,
      position: (maxRow?.position ?? -1) + 1,
      source_entity_type: input.sourceEntityType ?? null,
      source_entity_id: input.sourceEntityId ?? null,
    })
    .select(CAMPAIGN_ACTION_ITEM_SELECT)
    .single();

  if (error) {
    console.error("[campaign-action-items] create failed:", error.message);
    return null;
  }

  const item = mapCampaignActionItem(data as Record<string, unknown>);

  await logSystemEvent({
    eventName: "campaign_action_item_created",
    actorId: input.actorId ?? null,
    actorName: input.actorName ?? null,
    actorType: input.actorType ?? "system",
    clientSlug: item.clientSlug,
    visibility,
    entityType: "campaign_action_item",
    entityId: item.id,
    summary: `Created campaign action "${item.title}"`,
    detail: `Added it to ${taskStatusLabel(item.status)} as ${TASK_PRIORITY_LABELS[item.priority]}.`,
    metadata: {
      campaignId: item.campaignId,
      priority: item.priority,
      sourceEntityId: item.sourceEntityId,
      sourceEntityType: item.sourceEntityType,
      status: item.status,
      visibility: item.visibility,
    },
  });

  await notifyWorkflowAssignee({
    actorId: input.actorId ?? null,
    actorName: input.actorName ?? null,
    assigneeId: item.assigneeId,
    clientSlug: item.clientSlug,
    entityId: item.campaignId,
    entityType: "campaign",
    message: item.title,
    title: "Campaign action assigned to you",
    visibility,
  });

  await maybeEnqueueCampaignActionItemTriage(item);

  return item;
}

export async function updateSystemCampaignActionItem(
  input: UpdateSystemCampaignActionItemInput,
): Promise<CampaignActionItem | null> {
  if (!supabaseAdmin) return null;

  const { data: existingRow, error: fetchError } = await supabaseAdmin
    .from("campaign_action_items")
    .select(CAMPAIGN_ACTION_ITEM_SELECT)
    .eq("id", input.itemId)
    .maybeSingle();

  if (fetchError) {
    console.error("[campaign-action-items] fetch failed:", fetchError.message);
    return null;
  }

  if (!existingRow) return null;

  const existing = mapCampaignActionItem(existingRow as Record<string, unknown>);
  const effectiveClientSlug =
    (await getEffectiveCampaignClientSlug(existing.campaignId)) ?? existing.clientSlug;
  const nextValues = {
    assigneeId:
      "assigneeId" in input ? input.assigneeId ?? null : existing.assigneeId,
    assigneeName:
      "assigneeName" in input ? input.assigneeName ?? null : existing.assigneeName,
    description:
      "description" in input ? input.description ?? null : existing.description,
    dueDate: "dueDate" in input ? input.dueDate ?? null : existing.dueDate,
    priority: "priority" in input ? input.priority : existing.priority,
    status: "status" in input ? input.status : existing.status,
    title: "title" in input ? input.title : existing.title,
    visibility: "visibility" in input ? input.visibility : existing.visibility,
  };

  const changedKeys = Object.keys(input).filter((key) => {
    switch (key) {
      case "assigneeId":
        return nextValues.assigneeId !== existing.assigneeId;
      case "assigneeName":
        return nextValues.assigneeName !== existing.assigneeName;
      case "description":
        return nextValues.description !== existing.description;
      case "dueDate":
        return nextValues.dueDate !== existing.dueDate;
      case "priority":
        return nextValues.priority !== existing.priority;
      case "status":
        return nextValues.status !== existing.status;
      case "title":
        return nextValues.title !== existing.title;
      case "visibility":
        return nextValues.visibility !== existing.visibility;
      default:
        return false;
    }
  });

  if (changedKeys.length === 0) return existing;

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (nextValues.status !== existing.status) {
    const { data: maxRow, error: positionError } = await supabaseAdmin
      .from("campaign_action_items")
      .select("position")
      .eq("campaign_id", existing.campaignId)
      .eq("status", nextValues.status)
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (positionError) {
      console.error(
        "[campaign-action-items] destination position lookup failed:",
        positionError.message,
      );
      return null;
    }

    updates.position = (maxRow?.position ?? -1) + 1;
  }

  if (changedKeys.includes("title")) updates.title = nextValues.title;
  if (changedKeys.includes("description")) updates.description = nextValues.description;
  if (changedKeys.includes("status")) updates.status = nextValues.status;
  if (changedKeys.includes("priority")) updates.priority = nextValues.priority;
  if (changedKeys.includes("visibility")) updates.visibility = nextValues.visibility;
  if (changedKeys.includes("assigneeId")) updates.assignee_id = nextValues.assigneeId;
  if (changedKeys.includes("assigneeName")) updates.assignee_name = nextValues.assigneeName;
  if (changedKeys.includes("dueDate")) updates.due_date = nextValues.dueDate;
  if (effectiveClientSlug !== existing.clientSlug) updates.client_slug = effectiveClientSlug;

  const { data: updatedRow, error: updateError } = await supabaseAdmin
    .from("campaign_action_items")
    .update(updates)
    .eq("id", input.itemId)
    .select(CAMPAIGN_ACTION_ITEM_SELECT)
    .single();

  if (updateError) {
    console.error("[campaign-action-items] update failed:", updateError.message);
    return null;
  }

  const updated = mapCampaignActionItem(updatedRow as Record<string, unknown>);
  const changedFields = changedKeys.map((key) => FIELD_LABELS[key] ?? key);
  const statusChanged = updated.status !== existing.status;

  await logSystemEvent({
    eventName: "campaign_action_item_updated",
    actorId: input.actorId ?? null,
    actorName: input.actorName ?? null,
    actorType: input.actorType ?? "system",
    clientSlug: updated.clientSlug,
    visibility: updated.visibility,
    entityType: "campaign_action_item",
    entityId: updated.id,
    summary: statusChanged
      ? `Moved campaign action "${updated.title}" to ${taskStatusLabel(updated.status)}`
      : `Updated campaign action "${updated.title}"`,
    detail: summarizeChangedFields(changedFields),
    metadata: {
      campaignId: updated.campaignId,
      changedFields,
      sourceEntityId: updated.sourceEntityId,
      sourceEntityType: updated.sourceEntityType,
      status: updated.status,
      visibility: updated.visibility,
    },
  });

  if (updated.assigneeId && updated.assigneeId !== existing.assigneeId) {
    await notifyWorkflowAssignee({
      actorId: input.actorId ?? null,
      actorName: input.actorName ?? null,
      assigneeId: updated.assigneeId,
      clientSlug: updated.clientSlug,
      entityId: updated.campaignId,
      entityType: "campaign",
      message: updated.title,
      title: "Campaign action assigned to you",
      visibility: updated.visibility,
    });
  }

  await maybeEnqueueCampaignActionItemTriage(updated, {
    priority: existing.priority,
    status: existing.status,
  });

  return updated;
}
