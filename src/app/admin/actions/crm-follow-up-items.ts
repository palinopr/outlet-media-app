"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod/v4";
import {
  getCrmFollowUpItemById,
  maybeEnqueueCrmFollowUpItemTriage,
} from "@/features/crm-follow-up-items/server";
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

const CreateCrmFollowUpItemSchema = z.object({
  contactId: z.string().min(1),
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

const UpdateCrmFollowUpItemSchema = z.object({
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

function revalidateCrmPaths(clientSlug: string, contactId: string) {
  revalidatePath("/admin/crm");
  revalidatePath(`/admin/crm/${contactId}`);
  revalidatePath(`/client/${clientSlug}/crm`);
  revalidatePath(`/client/${clientSlug}/crm/${contactId}`);
}

export async function createCrmFollowUpItem(formData: {
  contactId: string;
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

  const parsed = CreateCrmFollowUpItemSchema.parse(formData);
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const { data: maxRow } = await supabaseAdmin
    .from("crm_follow_up_items" as never)
    .select("position")
    .eq("contact_id", parsed.contactId)
    .eq("status", parsed.status)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextPosition = (((maxRow as Record<string, unknown> | null)?.position as number | null) ?? -1) + 1;

  const { data, error } = await supabaseAdmin
    .from("crm_follow_up_items" as never)
    .insert({
      contact_id: parsed.contactId,
      client_slug: parsed.clientSlug,
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

  const itemId = String((data as Record<string, unknown>).id);
  const item = await getCrmFollowUpItemById(itemId);
  if (!item) throw new Error("Follow-up item not found after creation");

  await logAudit("crm_follow_up_item", item.id, "create", null, {
    contact_id: parsed.contactId,
    title: parsed.title,
    visibility: parsed.visibility,
  });

  await logSystemEvent({
    eventName: "crm_follow_up_item_created",
    actorId: user.id,
    clientSlug: parsed.clientSlug,
    visibility: parsed.visibility,
    entityType: "crm_follow_up_item",
    entityId: item.id,
    summary: `Created CRM follow-up "${parsed.title}"`,
    detail: `Added it to ${taskStatusLabel(parsed.status)} as ${TASK_PRIORITY_LABELS[parsed.priority]}.`,
    metadata: {
      crmContactId: parsed.contactId,
      crmContactName: item.contactName,
      priority: parsed.priority,
      status: parsed.status,
      visibility: parsed.visibility,
    },
  });

  await maybeEnqueueCrmFollowUpItemTriage(item);
  revalidateCrmPaths(parsed.clientSlug, parsed.contactId);
  return item;
}

export async function updateCrmFollowUpItem(formData: {
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
  const parsed = UpdateCrmFollowUpItemSchema.parse(raw);
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const { data: existing } = await supabaseAdmin
    .from("crm_follow_up_items" as never)
    .select(
      "contact_id, client_slug, title, description, status, priority, visibility, assignee_id, assignee_name, due_date, position",
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
      .from("crm_follow_up_items" as never)
      .select("position")
      .eq("contact_id", existingRow.contact_id)
      .eq("status", nextValues.status)
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();

    updates.position = (((maxRow as Record<string, unknown> | null)?.position as number | null) ?? -1) + 1;
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
    .from("crm_follow_up_items" as never)
    .update(updates)
    .eq("id", itemId);

  if (error) throw new Error(error.message);

  const changedFields = changedKeys.map((key) => FIELD_LABELS[key] ?? key);
  const item = await getCrmFollowUpItemById(itemId);
  if (!item) throw new Error("Follow-up item not found after update");

  await logAudit("crm_follow_up_item", itemId, "update", null, parsed);
  await logSystemEvent({
    eventName: "crm_follow_up_item_updated",
    actorId: user.id,
    clientSlug: item.clientSlug,
    visibility: item.visibility,
    entityType: "crm_follow_up_item",
    entityId: item.id,
    summary: `Updated CRM follow-up "${item.title}"`,
    detail: summarizeChangedFields(changedFields),
    metadata: {
      crmContactId: item.contactId,
      crmContactName: item.contactName,
      priority: item.priority,
      status: item.status,
      visibility: item.visibility,
    },
  });

  await maybeEnqueueCrmFollowUpItemTriage(item, {
    priority: existingRow.priority as typeof item.priority,
    status: existingRow.status as typeof item.status,
  });

  revalidateCrmPaths(item.clientSlug, item.contactId);
}

export async function deleteCrmFollowUpItem(itemId: string) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const item = await getCrmFollowUpItemById(itemId);
  if (!item) throw new Error("Follow-up item not found");

  const { error } = await supabaseAdmin
    .from("crm_follow_up_items" as never)
    .delete()
    .eq("id", itemId);

  if (error) throw new Error(error.message);

  await logAudit("crm_follow_up_item", itemId, "delete", null, {
    title: item.title,
    contact_id: item.contactId,
  });
  await logSystemEvent({
    eventName: "crm_follow_up_item_deleted",
    actorId: user.id,
    clientSlug: item.clientSlug,
    visibility: item.visibility,
    entityType: "crm_follow_up_item",
    entityId: item.id,
    summary: `Deleted CRM follow-up "${item.title}"`,
    detail: "Removed it from the CRM workflow.",
    metadata: {
      crmContactId: item.contactId,
      crmContactName: item.contactName,
      priority: item.priority,
      status: item.status,
      visibility: item.visibility,
    },
  });

  revalidateCrmPaths(item.clientSlug, item.contactId);
}
