"use server";

import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod/v4";
import {
  getCampaignActionItemById,
  maybeEnqueueCampaignActionItemTriage,
} from "@/features/campaign-action-items/server";
import { notifyWorkflowAssignee } from "@/features/notifications/workflow";
import {
  getCampaignWorkflowPaths,
  revalidateWorkflowPaths,
} from "@/features/workflow/revalidation";
import { adminGuard } from "@/lib/api-helpers";
import { getEffectiveCampaignClientSlug } from "@/lib/campaign-client-assignment";
import { supabaseAdmin } from "@/lib/supabase";
import { TASK_PRIORITIES, TASK_PRIORITY_LABELS, TASK_STATUSES } from "@/lib/workspace-types";
import { FIELD_LABELS, taskStatusLabel } from "@/lib/action-item-labels";
import { logAudit } from "./audit";
import { logSystemEvent, summarizeChangedFields } from "@/features/system-events/server";

const CampaignActionVisibility = ["shared", "admin_only"] as const;

const CreateCampaignActionItemSchema = z.object({
  campaignId: z.string().min(1),
  clientSlug: z.string().min(1),
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional().nullable(),
  status: z.enum(TASK_STATUSES).default("todo"),
  priority: z.enum(TASK_PRIORITIES).default("medium"),
  visibility: z.enum(CampaignActionVisibility).default("shared"),
  assigneeId: z.string().optional().nullable(),
  assigneeName: z.string().max(200).optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

const UpdateCampaignActionItemSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(5000).optional().nullable(),
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  visibility: z.enum(CampaignActionVisibility).optional(),
  assigneeId: z.string().optional().nullable(),
  assigneeName: z.string().max(200).optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

export async function createCampaignActionItem(formData: {
  campaignId: string;
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

  const parsed = CreateCampaignActionItemSchema.parse(formData);
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");
  const effectiveClientSlug =
    (await getEffectiveCampaignClientSlug(parsed.campaignId)) ?? parsed.clientSlug;

  const { data: maxRow } = await supabaseAdmin
    .from("campaign_action_items")
    .select("position")
    .eq("campaign_id", parsed.campaignId)
    .eq("status", parsed.status)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextPosition = (maxRow?.position ?? -1) + 1;

  const { data, error } = await supabaseAdmin
    .from("campaign_action_items")
    .insert({
      campaign_id: parsed.campaignId,
      client_slug: effectiveClientSlug,
      title: parsed.title,
      description: parsed.description ?? null,
      status: parsed.status,
      priority: parsed.priority,
      visibility: parsed.visibility,
      assignee_id: parsed.assigneeId ?? null,
      assignee_name: parsed.assigneeName ?? null,
      due_date: parsed.dueDate ?? null,
      created_by: user.id,
      position: nextPosition,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await logAudit("campaign_action_item", data.id, "create", null, {
    campaign_id: parsed.campaignId,
    title: parsed.title,
    visibility: parsed.visibility,
  });
  await logSystemEvent({
    eventName: "campaign_action_item_created",
    actorId: user.id,
    clientSlug: effectiveClientSlug,
    visibility: parsed.visibility,
    entityType: "campaign_action_item",
    entityId: data.id,
    summary: `Created campaign action "${parsed.title}"`,
    detail: `Added it to ${taskStatusLabel(parsed.status)} as ${TASK_PRIORITY_LABELS[parsed.priority]}.`,
    metadata: {
      campaignId: parsed.campaignId,
      priority: parsed.priority,
      status: parsed.status,
      visibility: parsed.visibility,
    },
  });

  await notifyWorkflowAssignee({
    actorId: user.id,
    actorName: user.fullName ?? user.firstName ?? user.username ?? "Unknown",
    assigneeId: parsed.assigneeId ?? null,
    clientSlug: effectiveClientSlug,
    entityId: parsed.campaignId,
    entityType: "campaign",
    message: parsed.title,
    title: "Campaign action assigned to you",
    visibility: parsed.visibility,
  });

  const createdItem = await getCampaignActionItemById(data.id);
  if (createdItem) {
    await maybeEnqueueCampaignActionItemTriage(createdItem);
  }

  revalidateWorkflowPaths(getCampaignWorkflowPaths(effectiveClientSlug, parsed.campaignId));
  return data;
}

export async function updateCampaignActionItem(formData: {
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
  const parsed = UpdateCampaignActionItemSchema.parse(raw);
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const { data: existing } = await supabaseAdmin
    .from("campaign_action_items")
    .select(
      "campaign_id, client_slug, title, description, status, priority, visibility, assignee_id, assignee_name, due_date, position",
    )
    .eq("id", itemId)
    .maybeSingle();

  if (!existing) throw new Error("Action item not found");
  const effectiveClientSlug =
    (await getEffectiveCampaignClientSlug(existing.campaign_id)) ?? existing.client_slug;

  const nextValues = {
    assigneeId: "assigneeId" in parsed ? parsed.assigneeId ?? null : existing.assignee_id,
    assigneeName:
      "assigneeName" in parsed ? parsed.assigneeName ?? null : existing.assignee_name,
    description: "description" in parsed ? parsed.description ?? null : existing.description,
    dueDate: "dueDate" in parsed ? parsed.dueDate ?? null : existing.due_date,
    priority: "priority" in parsed ? parsed.priority : existing.priority,
    status: "status" in parsed ? parsed.status : existing.status,
    title: "title" in parsed ? parsed.title : existing.title,
    visibility: "visibility" in parsed ? parsed.visibility : existing.visibility,
  };

  const changedKeys = Object.keys(parsed).filter((key) => {
    switch (key) {
      case "assigneeId":
        return nextValues.assigneeId !== existing.assignee_id;
      case "assigneeName":
        return nextValues.assigneeName !== existing.assignee_name;
      case "description":
        return nextValues.description !== existing.description;
      case "dueDate":
        return nextValues.dueDate !== existing.due_date;
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

  if (changedKeys.length === 0) {
    return;
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (nextValues.status !== existing.status) {
    const { data: maxRow } = await supabaseAdmin
      .from("campaign_action_items")
      .select("position")
      .eq("campaign_id", existing.campaign_id)
      .eq("status", nextValues.status)
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();

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
  if (effectiveClientSlug !== existing.client_slug) updates.client_slug = effectiveClientSlug;

  const { error } = await supabaseAdmin
    .from("campaign_action_items")
    .update(updates)
    .eq("id", itemId);

  if (error) throw new Error(error.message);

  const auditPayload = Object.fromEntries(
    changedKeys.map((key) => [key, parsed[key as keyof typeof parsed]]),
  );
  await logAudit("campaign_action_item", itemId, "update", null, auditPayload);
  const changedFields = changedKeys.map((key) => FIELD_LABELS[key] ?? key);

  if (changedFields.length > 0) {
    const statusChanged = nextValues.status !== existing.status;

    await logSystemEvent({
      eventName: "campaign_action_item_updated",
      actorId: user.id,
      clientSlug: effectiveClientSlug,
      visibility: nextValues.visibility as "shared" | "admin_only",
      entityType: "campaign_action_item",
      entityId: itemId,
      summary: statusChanged
        ? `Moved campaign action "${nextValues.title}" to ${taskStatusLabel(nextValues.status)}`
        : `Updated campaign action "${nextValues.title}"`,
      detail: summarizeChangedFields(changedFields),
      metadata: {
        campaignId: existing.campaign_id,
        changedFields,
        status: nextValues.status,
        visibility: nextValues.visibility,
      },
    });
  }

  if (nextValues.assigneeId && nextValues.assigneeId !== existing.assignee_id) {
    await notifyWorkflowAssignee({
      actorId: user.id,
      actorName: user.fullName ?? user.firstName ?? user.username ?? "Unknown",
      assigneeId: nextValues.assigneeId as string,
      clientSlug: effectiveClientSlug,
      entityId: existing.campaign_id,
      entityType: "campaign",
      message: nextValues.title,
      title: "Campaign action assigned to you",
      visibility: nextValues.visibility as "shared" | "admin_only",
    });
  }

  const updatedItem = await getCampaignActionItemById(itemId);
  if (updatedItem) {
    await maybeEnqueueCampaignActionItemTriage(updatedItem, {
      priority: existing.priority,
      status: existing.status,
    });
  }

  revalidateWorkflowPaths(getCampaignWorkflowPaths(effectiveClientSlug, existing.campaign_id));
}

export async function deleteCampaignActionItem(formData: { itemId: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const { data: existing } = await supabaseAdmin
    .from("campaign_action_items")
    .select("campaign_id, client_slug, title, visibility")
    .eq("id", formData.itemId)
    .maybeSingle();

  if (!existing) throw new Error("Action item not found");
  const effectiveClientSlug =
    (await getEffectiveCampaignClientSlug(existing.campaign_id)) ?? existing.client_slug;

  const { error } = await supabaseAdmin
    .from("campaign_action_items")
    .delete()
    .eq("id", formData.itemId);

  if (error) throw new Error(error.message);

  await logAudit("campaign_action_item", formData.itemId, "delete", { title: existing.title }, null);
  await logSystemEvent({
    eventName: "campaign_action_item_deleted",
    actorId: user.id,
    clientSlug: effectiveClientSlug,
    visibility: existing.visibility,
    entityType: "campaign_action_item",
    entityId: formData.itemId,
    summary: `Deleted campaign action "${existing.title}"`,
    metadata: {
      campaignId: existing.campaign_id,
    },
  });

  revalidateWorkflowPaths(getCampaignWorkflowPaths(effectiveClientSlug, existing.campaign_id));
}
