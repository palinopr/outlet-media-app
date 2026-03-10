import {
  TASK_PRIORITY_LABELS,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/workspace-types";
import { FIELD_LABELS, taskStatusLabel } from "@/lib/action-item-labels";
import { enqueueExternalAgentTask } from "@/lib/agent-dispatch";
import { getFeatureReadClient, supabaseAdmin } from "@/lib/supabase";
import { notifyWorkflowAssignee } from "@/features/notifications/workflow";
import {
  logSystemEvent,
  summarizeChangedFields,
  type SystemEventActorType,
} from "@/features/system-events/server";

export type AssetFollowUpItemVisibility = "admin_only" | "shared";

export interface AssetFollowUpItem {
  id: string;
  assetId: string;
  assetName: string | null;
  clientSlug: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  visibility: AssetFollowUpItemVisibility;
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

interface AssetFollowUpItemActor {
  actorId?: string | null;
  actorName?: string | null;
  actorType?: SystemEventActorType;
}

interface AssetFollowUpItemTriagePreviousState {
  priority: TaskPriority;
  status: TaskStatus;
}

interface ListAssetFollowUpItemsOptions {
  assetId?: string | null;
  audience?: "all" | AssetFollowUpItemVisibility;
  clientSlug?: string | null;
  limit?: number;
}

interface CreateSystemAssetFollowUpItemInput extends AssetFollowUpItemActor {
  assetId: string;
  clientSlug: string;
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  visibility?: AssetFollowUpItemVisibility;
  assigneeId?: string | null;
  assigneeName?: string | null;
  dueDate?: string | null;
  createdBy?: string | null;
  sourceEntityType?: string | null;
  sourceEntityId?: string | null;
}

interface UpdateSystemAssetFollowUpItemInput extends AssetFollowUpItemActor {
  itemId: string;
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  visibility?: AssetFollowUpItemVisibility;
  assigneeId?: string | null;
  assigneeName?: string | null;
  dueDate?: string | null;
}

const ASSET_FOLLOW_UP_ITEM_SELECT =
  "id, asset_id, client_slug, title, description, status, priority, visibility, assignee_id, assignee_name, due_date, created_by, position, source_entity_type, source_entity_id, created_at, updated_at";

function shouldEnqueueAssetFollowUpItemTriage(
  item: AssetFollowUpItem,
  previous?: AssetFollowUpItemTriagePreviousState,
) {
  if (item.sourceEntityType === "agent_task") return false;
  if (!previous) return item.status === "review" || item.priority === "urgent";

  return (
    (item.status === "review" && previous.status !== "review") ||
    (item.priority === "urgent" && previous.priority !== "urgent")
  );
}

function assetFollowUpItemTriagePrompt(item: AssetFollowUpItem) {
  return [
    "A creative follow-up item needs triage.",
    `Client: ${item.clientSlug}`,
    item.assetName ? `Asset: ${item.assetName}` : null,
    `Asset ID: ${item.assetId}`,
    `Follow-up item: ${item.title}`,
    item.description ? `Description: ${item.description}` : null,
    `Status: ${taskStatusLabel(item.status)}`,
    `Priority: ${TASK_PRIORITY_LABELS[item.priority]}`,
    item.assigneeName ? `Assignee: ${item.assigneeName}` : null,
    item.dueDate ? `Due date: ${item.dueDate}` : null,
    `Follow-up item ID: ${item.id}`,
    "Give a concise creative operations brief with:",
    "1. what this follow-up is about",
    "2. the next best review or production step",
    "3. any blockers or missing information",
    "Keep it short and operational.",
  ]
    .filter(Boolean)
    .join("\n");
}

async function listAssetNames(assetIds: string[]) {
  if (!supabaseAdmin || assetIds.length === 0) return new Map<string, string>();

  const { data, error } = await supabaseAdmin
    .from("ad_assets")
    .select("id, file_name")
    .in("id", assetIds);

  if (error) {
    console.error("[asset-follow-up-items] asset lookup failed:", error.message);
    return new Map<string, string>();
  }

  return new Map(
    (data ?? []).map((row) => [
      String((row as Record<string, unknown>).id),
      String((row as Record<string, unknown>).file_name ?? ""),
    ]),
  );
}


function mapAssetFollowUpItem(
  row: Record<string, unknown>,
  assetNames: Map<string, string>,
): AssetFollowUpItem {
  const assetId = row.asset_id as string;

  return {
    id: row.id as string,
    assetId,
    assetName: assetNames.get(assetId) ?? null,
    clientSlug: row.client_slug as string,
    title: row.title as string,
    description: (row.description as string | null) ?? null,
    status: row.status as TaskStatus,
    priority: row.priority as TaskPriority,
    visibility: row.visibility as AssetFollowUpItemVisibility,
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

export async function listAssetFollowUpItems(
  options: ListAssetFollowUpItemsOptions,
): Promise<AssetFollowUpItem[]> {
  const db = await getFeatureReadClient(!!options.clientSlug);
  if (!db) return [];

  let query = db
    .from("asset_follow_up_items" as never)
    .select(ASSET_FOLLOW_UP_ITEM_SELECT)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (options.clientSlug) {
    query = query.eq("client_slug", options.clientSlug);
  }

  if (options.assetId) {
    query = query.eq("asset_id", options.assetId);
  }

  if (options.audience && options.audience !== "all") {
    query = query.eq("visibility", options.audience);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[asset-follow-up-items] list failed:", error.message);
    return [];
  }

  const rows = (data ?? []) as Record<string, unknown>[];
  const assetIds = [...new Set(rows.map((row) => String(row.asset_id)).filter(Boolean))];
  const assetNames =
    assetIds.length === 0
      ? new Map<string, string>()
      : await db
          .from("ad_assets")
          .select("id, file_name")
          .in("id", assetIds)
          .then(({ data: assetRows, error: assetError }) => {
            if (assetError) {
              console.error("[asset-follow-up-items] asset lookup failed:", assetError.message);
              return new Map<string, string>();
            }

            return new Map(
              (assetRows ?? []).map((row) => [
                String((row as Record<string, unknown>).id),
                String((row as Record<string, unknown>).file_name ?? ""),
              ]),
            );
          });

  return rows.map((row) => mapAssetFollowUpItem(row, assetNames));
}

export async function findAssetFollowUpItemBySource(
  sourceEntityType: string,
  sourceEntityId: string,
): Promise<AssetFollowUpItem | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from("asset_follow_up_items" as never)
    .select(ASSET_FOLLOW_UP_ITEM_SELECT)
    .eq("source_entity_type", sourceEntityType)
    .eq("source_entity_id", sourceEntityId)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[asset-follow-up-items] source lookup failed:", error.message);
    return null;
  }

  if (!data) return null;

  const assetNames = await listAssetNames([String((data as Record<string, unknown>).asset_id)]);
  return mapAssetFollowUpItem(data as Record<string, unknown>, assetNames);
}

export async function getAssetFollowUpItemById(itemId: string): Promise<AssetFollowUpItem | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from("asset_follow_up_items" as never)
    .select(ASSET_FOLLOW_UP_ITEM_SELECT)
    .eq("id", itemId)
    .maybeSingle();

  if (error) {
    console.error("[asset-follow-up-items] item lookup failed:", error.message);
    return null;
  }

  if (!data) return null;

  const assetNames = await listAssetNames([String((data as Record<string, unknown>).asset_id)]);
  return mapAssetFollowUpItem(data as Record<string, unknown>, assetNames);
}

export async function maybeEnqueueAssetFollowUpItemTriage(
  item: AssetFollowUpItem,
  previous?: AssetFollowUpItemTriagePreviousState,
) {
  if (!shouldEnqueueAssetFollowUpItemTriage(item, previous)) return null;

  const taskId = await enqueueExternalAgentTask({
    action: "triage-asset-follow-up-item",
    prompt: assetFollowUpItemTriagePrompt(item),
    toAgent: "assistant",
  });

  if (!taskId) return null;

  await logSystemEvent({
    eventName: "agent_action_requested",
    actorType: "system",
    actorName: "Outlet Assets",
    clientSlug: item.clientSlug,
    visibility: item.visibility,
    entityType: "agent_task",
    entityId: taskId,
    summary: `Queued asset agent triage for follow-up "${item.title}"`,
    detail: "Assistant will prepare a concise creative next-step brief.",
    metadata: {
      assetId: item.assetId,
      assetName: item.assetName,
      assetFollowUpItemId: item.id,
      sourceEntityId: item.sourceEntityId,
      sourceEntityType: item.sourceEntityType,
      taskId,
      toAgent: "assistant",
    },
  });

  return taskId;
}

export async function createSystemAssetFollowUpItem(
  input: CreateSystemAssetFollowUpItemInput,
): Promise<AssetFollowUpItem | null> {
  if (!supabaseAdmin) return null;

  if (input.sourceEntityType && input.sourceEntityId) {
    const existing = await findAssetFollowUpItemBySource(
      input.sourceEntityType,
      input.sourceEntityId,
    );
    if (existing) return existing;
  }

  const status = input.status ?? "todo";
  const priority = input.priority ?? "medium";
  const visibility = input.visibility ?? "shared";

  const { data: maxRow } = await supabaseAdmin
    .from("asset_follow_up_items" as never)
    .select("position")
    .eq("asset_id", input.assetId)
    .eq("status", status)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextPosition =
    (((maxRow as Record<string, unknown> | null)?.position as number | null) ?? -1) + 1;

  const { data, error } = await supabaseAdmin
    .from("asset_follow_up_items" as never)
    .insert({
      asset_id: input.assetId,
      client_slug: input.clientSlug,
      title: input.title,
      description: input.description ?? null,
      status,
      priority,
      visibility,
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

  if (error) {
    console.error("[asset-follow-up-items] create failed:", error.message);
    return null;
  }

  const itemId = String((data as Record<string, unknown>).id);
  const item = await getAssetFollowUpItemById(itemId);
  if (!item) return null;

  await logSystemEvent({
    eventName: "asset_follow_up_item_created",
    actorId: input.actorId ?? null,
    actorName: input.actorName ?? null,
    actorType: input.actorType ?? "user",
    clientSlug: input.clientSlug,
    visibility,
    entityType: "asset_follow_up_item",
    entityId: item.id,
    summary: `Created asset follow-up "${item.title}"`,
    detail: `Added it to ${taskStatusLabel(item.status)} as ${TASK_PRIORITY_LABELS[item.priority]}.`,
    metadata: {
      assetId: item.assetId,
      assetName: item.assetName,
      priority: item.priority,
      status: item.status,
      visibility: item.visibility,
    },
  });

  await notifyWorkflowAssignee({
    actorId: input.actorId ?? null,
    actorName: input.actorName ?? null,
    assigneeId: item.assigneeId,
    clientSlug: item.clientSlug,
    entityId: item.assetId,
    entityType: "asset",
    message: item.title,
    title: "Asset follow-up assigned to you",
    visibility,
  });

  await maybeEnqueueAssetFollowUpItemTriage(item);
  return item;
}

export async function updateSystemAssetFollowUpItem(
  input: UpdateSystemAssetFollowUpItemInput,
): Promise<AssetFollowUpItem | null> {
  if (!supabaseAdmin) return null;

  const existing = await getAssetFollowUpItemById(input.itemId);
  if (!existing) return null;

  const nextValues = {
    assigneeId: "assigneeId" in input ? input.assigneeId ?? null : existing.assigneeId,
    assigneeName: "assigneeName" in input ? input.assigneeName ?? null : existing.assigneeName,
    description: "description" in input ? input.description ?? null : existing.description,
    dueDate: "dueDate" in input ? input.dueDate ?? null : existing.dueDate,
    priority: "priority" in input ? input.priority ?? existing.priority : existing.priority,
    status: "status" in input ? input.status ?? existing.status : existing.status,
    title: "title" in input ? input.title ?? existing.title : existing.title,
    visibility:
      "visibility" in input ? input.visibility ?? existing.visibility : existing.visibility,
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
    const { data: maxRow } = await supabaseAdmin
      .from("asset_follow_up_items" as never)
      .select("position")
      .eq("asset_id", existing.assetId)
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
    .from("asset_follow_up_items" as never)
    .update(updates)
    .eq("id", input.itemId);

  if (error) {
    console.error("[asset-follow-up-items] update failed:", error.message);
    return null;
  }

  const item = await getAssetFollowUpItemById(input.itemId);
  if (!item) return null;

  const changedFields = changedKeys.map((key) => FIELD_LABELS[key] ?? key);
  await logSystemEvent({
    eventName: "asset_follow_up_item_updated",
    actorId: input.actorId ?? null,
    actorName: input.actorName ?? null,
    actorType: input.actorType ?? "user",
    clientSlug: item.clientSlug,
    visibility: item.visibility,
    entityType: "asset_follow_up_item",
    entityId: item.id,
    summary: `Updated asset follow-up "${item.title}"`,
    detail: summarizeChangedFields(changedFields),
    metadata: {
      assetId: item.assetId,
      assetName: item.assetName,
      priority: item.priority,
      status: item.status,
      visibility: item.visibility,
    },
  });

  if (item.assigneeId && item.assigneeId !== existing.assigneeId) {
    await notifyWorkflowAssignee({
      actorId: input.actorId ?? null,
      actorName: input.actorName ?? null,
      assigneeId: item.assigneeId,
      clientSlug: item.clientSlug,
      entityId: item.assetId,
      entityType: "asset",
      message: item.title,
      title: "Asset follow-up assigned to you",
      visibility: item.visibility,
    });
  }

  await maybeEnqueueAssetFollowUpItemTriage(item, {
    priority: existing.priority,
    status: existing.status,
  });
  return item;
}

export async function deleteAssetFollowUpItem(
  itemId: string,
  actor: AssetFollowUpItemActor = {},
): Promise<AssetFollowUpItem | null> {
  if (!supabaseAdmin) return null;

  const existing = await getAssetFollowUpItemById(itemId);
  if (!existing) return null;

  const { error } = await supabaseAdmin
    .from("asset_follow_up_items" as never)
    .delete()
    .eq("id", itemId);

  if (error) {
    console.error("[asset-follow-up-items] delete failed:", error.message);
    return null;
  }

  await logSystemEvent({
    eventName: "asset_follow_up_item_deleted",
    actorId: actor.actorId ?? null,
    actorName: actor.actorName ?? null,
    actorType: actor.actorType ?? "user",
    clientSlug: existing.clientSlug,
    visibility: existing.visibility,
    entityType: "asset_follow_up_item",
    entityId: existing.id,
    summary: `Deleted asset follow-up "${existing.title}"`,
    metadata: {
      assetId: existing.assetId,
      assetName: existing.assetName,
    },
  });

  return existing;
}
