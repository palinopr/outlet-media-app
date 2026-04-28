import {
  TASK_PRIORITY_LABELS,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/workspace-types";
import { taskStatusLabel } from "@/lib/action-item-labels";
import { getFeatureReadClient, supabaseAdmin } from "@/lib/supabase";
import { notifyWorkflowAssignee } from "@/features/notifications/workflow";
import {
  logSystemEvent,
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

const ASSET_FOLLOW_UP_ITEM_SELECT =
  "id, asset_id, client_slug, title, description, status, priority, visibility, assignee_id, assignee_name, due_date, created_by, position, source_entity_type, source_entity_id, created_at, updated_at";

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

async function listAssetNames(assetIds: string[]): Promise<Map<string, string>> {
  if (!supabaseAdmin || assetIds.length === 0) return new Map();

  const { data, error } = await supabaseAdmin
    .from("ad_assets")
    .select("id, file_name")
    .in("id", assetIds);

  if (error) {
    console.error("[asset-follow-up-items] asset lookup failed:", error.message);
    return new Map();
  }

  return new Map(
    (data ?? []).map((row) => [
      String((row as Record<string, unknown>).id),
      String((row as Record<string, unknown>).file_name ?? ""),
    ]),
  );
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

  return item;
}

