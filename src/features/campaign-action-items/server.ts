import type { TaskPriority, TaskStatus } from "@/lib/workspace-types";
import { supabaseAdmin } from "@/lib/supabase";

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
  createdAt: string;
  updatedAt: string;
}

interface ListCampaignActionItemsOptions {
  audience?: "all" | CampaignActionItemVisibility;
  campaignId: string;
  clientSlug: string;
  limit?: number;
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
    .select(
      "id, campaign_id, client_slug, title, description, status, priority, visibility, assignee_id, assignee_name, due_date, created_by, position, created_at, updated_at",
    )
    .eq("campaign_id", options.campaignId)
    .eq("client_slug", options.clientSlug)
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
