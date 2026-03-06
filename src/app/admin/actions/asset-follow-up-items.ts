"use server";

import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod/v4";
import {
  getAssetFollowUpItemById,
  maybeEnqueueAssetFollowUpItemTriage,
} from "@/features/asset-follow-up-items/server";
import { notifyWorkflowAssignee } from "@/features/notifications/workflow";
import {
  getAssetWorkflowPaths,
  revalidateWorkflowPaths,
} from "@/features/workflow/revalidation";
import { adminGuard } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
} from "@/lib/workspace-types";
import { logSystemEvent, summarizeChangedFields } from "@/features/system-events/server";
import { logAudit } from "./audit";

const VisibilityOptions = ["shared", "admin_only"] as const;

const CreateAssetFollowUpItemSchema = z.object({
  assetId: z.string().uuid(),
  clientSlug: z.string().min(1),
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional().nullable(),
  status: z.enum(TASK_STATUSES).default("todo"),
  priority: z.enum(TASK_PRIORITIES).default("medium"),
  visibility: z.enum(VisibilityOptions).default("shared"),
  assigneeId: z.string().optional().nullable(),
  assigneeName: z.string().max(200).optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

const UpdateAssetFollowUpItemSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(5000).optional().nullable(),
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  visibility: z.enum(VisibilityOptions).optional(),
  assigneeId: z.string().optional().nullable(),
  assigneeName: z.string().max(200).optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

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

function taskStatusLabel(status: string) {
  return TASK_STATUS_LABELS[status as keyof typeof TASK_STATUS_LABELS] ?? status;
}

export async function createAssetFollowUpItem(formData: {
  assetId: string;
  clientSlug: string;
  title: string;
  description?: string | null;
  status?: string;
  priority?: string;
  visibility?: "shared" | "admin_only";
  assigneeId?: string | null;
  assigneeName?: string | null;
  dueDate?: string | null;
}) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = CreateAssetFollowUpItemSchema.parse(formData);
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const { data: maxRow } = await supabaseAdmin
    .from("asset_follow_up_items" as never)
    .select("position")
    .eq("asset_id", parsed.assetId)
    .eq("status", parsed.status)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextPosition =
    (((maxRow as Record<string, unknown> | null)?.position as number | null) ?? -1) + 1;

  const { data, error } = await supabaseAdmin
    .from("asset_follow_up_items" as never)
    .insert({
      asset_id: parsed.assetId,
      client_slug: parsed.clientSlug,
      title: parsed.title,
      description: parsed.description ?? null,
      status: parsed.status,
      priority: parsed.priority,
      visibility: parsed.visibility,
      assignee_id: parsed.assigneeId ?? null,
      assignee_name: parsed.assigneeName ?? null,
      due_date: parsed.dueDate || null,
      created_by: user.id,
      position: nextPosition,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  const itemId = String((data as Record<string, unknown>).id);
  const item = await getAssetFollowUpItemById(itemId);
  if (!item) throw new Error("Follow-up item not found after creation");

  await logAudit("asset_follow_up_item", item.id, "create", null, {
    asset_id: parsed.assetId,
    title: parsed.title,
    visibility: parsed.visibility,
  });

  await logSystemEvent({
    eventName: "asset_follow_up_item_created",
    actorId: user.id,
    clientSlug: parsed.clientSlug,
    visibility: parsed.visibility,
    entityType: "asset_follow_up_item",
    entityId: item.id,
    summary: `Created asset follow-up "${parsed.title}"`,
    detail: `Added it to ${taskStatusLabel(parsed.status)} as ${TASK_PRIORITY_LABELS[parsed.priority]}.`,
    metadata: {
      assetId: parsed.assetId,
      assetName: item.assetName,
      priority: parsed.priority,
      status: parsed.status,
      visibility: parsed.visibility,
    },
  });

  await notifyWorkflowAssignee({
    actorId: user.id,
    actorName: user.fullName ?? user.firstName ?? user.username ?? "Unknown",
    assigneeId: parsed.assigneeId ?? null,
    clientSlug: parsed.clientSlug,
    entityId: parsed.assetId,
    entityType: "asset",
    message: parsed.title,
    title: "Asset follow-up assigned to you",
    visibility: parsed.visibility,
  });

  await maybeEnqueueAssetFollowUpItemTriage(item);
  revalidateWorkflowPaths(getAssetWorkflowPaths(parsed.clientSlug, parsed.assetId));
  return item;
}

export async function updateAssetFollowUpItem(formData: {
  itemId: string;
  title?: string;
  description?: string | null;
  status?: string;
  priority?: string;
  visibility?: "shared" | "admin_only";
  assigneeId?: string | null;
  assigneeName?: string | null;
  dueDate?: string | null;
}) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { itemId, ...raw } = formData;
  const parsed = UpdateAssetFollowUpItemSchema.parse(raw);
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const { data: existing } = await supabaseAdmin
    .from("asset_follow_up_items" as never)
    .select(
      "asset_id, client_slug, title, description, status, priority, visibility, assignee_id, assignee_name, due_date, position",
    )
    .eq("id", itemId)
    .maybeSingle();

  if (!existing) throw new Error("Follow-up item not found");
  const existingRow = existing as Record<string, unknown>;

  const nextValues = {
    assigneeId: "assigneeId" in parsed ? parsed.assigneeId ?? null : existingRow.assignee_id,
    assigneeName:
      "assigneeName" in parsed ? parsed.assigneeName ?? null : existingRow.assignee_name,
    description: "description" in parsed ? parsed.description ?? null : existingRow.description,
    dueDate: "dueDate" in parsed ? parsed.dueDate ?? null : existingRow.due_date,
    priority: "priority" in parsed ? parsed.priority : existingRow.priority,
    status: "status" in parsed ? parsed.status : existingRow.status,
    title: "title" in parsed ? parsed.title : existingRow.title,
    visibility: "visibility" in parsed ? parsed.visibility : existingRow.visibility,
  };

  const changedKeys = Object.keys(parsed).filter((key) => {
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

  if (changedKeys.length === 0) return;

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (nextValues.status !== existingRow.status) {
    const { data: maxRow } = await supabaseAdmin
      .from("asset_follow_up_items" as never)
      .select("position")
      .eq("asset_id", existingRow.asset_id)
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
    .eq("id", itemId);

  if (error) throw new Error(error.message);

  const item = await getAssetFollowUpItemById(itemId);
  if (!item) throw new Error("Follow-up item not found after update");

  await logAudit("asset_follow_up_item", itemId, "update", null, parsed);

  const changedFields = changedKeys.map((key) => FIELD_LABELS[key] ?? key);
  await logSystemEvent({
    eventName: "asset_follow_up_item_updated",
    actorId: user.id,
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

  if (nextValues.assigneeId && nextValues.assigneeId !== existingRow.assignee_id) {
    await notifyWorkflowAssignee({
      actorId: user.id,
      actorName: user.fullName ?? user.firstName ?? user.username ?? "Unknown",
      assigneeId: nextValues.assigneeId as string,
      clientSlug: item.clientSlug,
      entityId: item.assetId,
      entityType: "asset",
      message: item.title,
      title: "Asset follow-up assigned to you",
      visibility: item.visibility,
    });
  }

  await maybeEnqueueAssetFollowUpItemTriage(item, {
    priority: existingRow.priority as typeof item.priority,
    status: existingRow.status as typeof item.status,
  });
  revalidateWorkflowPaths(getAssetWorkflowPaths(item.clientSlug, item.assetId));
}

export async function deleteAssetFollowUpItemAction(itemId: string) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const item = await getAssetFollowUpItemById(itemId);
  if (!item) throw new Error("Follow-up item not found");

  const { error } = await supabaseAdmin
    .from("asset_follow_up_items" as never)
    .delete()
    .eq("id", itemId);

  if (error) throw new Error(error.message);

  await logAudit("asset_follow_up_item", itemId, "delete", null, {
    asset_id: item.assetId,
    title: item.title,
  });

  await logSystemEvent({
    eventName: "asset_follow_up_item_deleted",
    actorId: user.id,
    clientSlug: item.clientSlug,
    visibility: item.visibility,
    entityType: "asset_follow_up_item",
    entityId: item.id,
    summary: `Deleted asset follow-up "${item.title}"`,
    metadata: {
      assetId: item.assetId,
      assetName: item.assetName,
    },
  });

  revalidateWorkflowPaths(getAssetWorkflowPaths(item.clientSlug, item.assetId));
}
