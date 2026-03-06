"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod/v4";
import { adminGuard } from "@/lib/api-helpers";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/workspace-types";
import {
  createSystemEventFollowUpItem,
  deleteEventFollowUpItem,
  getEventFollowUpItemById,
  updateSystemEventFollowUpItem,
} from "@/features/event-follow-up-items/server";
import { getEventRecordById } from "@/features/events/server";
import { logAudit } from "./audit";

const VisibilityOptions = ["shared", "admin_only"] as const;

const CreateEventFollowUpItemSchema = z.object({
  eventId: z.string().uuid(),
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional().nullable(),
  status: z.enum(TASK_STATUSES).default("todo"),
  priority: z.enum(TASK_PRIORITIES).default("medium"),
  visibility: z.enum(VisibilityOptions).default("shared"),
  assigneeId: z.string().optional().nullable(),
  assigneeName: z.string().max(200).optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

const UpdateEventFollowUpItemSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(5000).optional().nullable(),
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  visibility: z.enum(VisibilityOptions).optional(),
  assigneeId: z.string().optional().nullable(),
  assigneeName: z.string().max(200).optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

function revalidateEventPaths(eventId: string, clientSlug: string | null) {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${eventId}`);

  if (clientSlug) {
    revalidatePath(`/client/${clientSlug}`);
    revalidatePath(`/client/${clientSlug}/events`);
    revalidatePath(`/client/${clientSlug}/event/${eventId}`);
  }
}

export async function createEventFollowUpItem(formData: {
  eventId: string;
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

  const parsed = CreateEventFollowUpItemSchema.parse(formData);
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const event = await getEventRecordById(parsed.eventId);
  if (!event) throw new Error("Event not found");

  const item = await createSystemEventFollowUpItem({
    actorId: user.id,
    actorName: user.fullName ?? user.firstName ?? user.username ?? "Unknown",
    actorType: "user",
    assigneeId: parsed.assigneeId ?? null,
    assigneeName: parsed.assigneeName ?? null,
    clientSlug: event.clientSlug,
    createdBy: user.id,
    description: parsed.description ?? null,
    dueDate: parsed.dueDate ?? null,
    eventId: parsed.eventId,
    priority: parsed.priority,
    status: parsed.status,
    title: parsed.title,
    visibility: parsed.visibility,
  });

  if (!item) throw new Error("Failed to create follow-up item");

  await logAudit("event_follow_up_item", item.id, "create", null, {
    event_id: parsed.eventId,
    title: parsed.title,
    visibility: parsed.visibility,
  });

  revalidateEventPaths(item.eventId, item.clientSlug);
  return item;
}

export async function updateEventFollowUpItem(formData: {
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

  const { itemId, ...raw } = formData;
  const parsed = UpdateEventFollowUpItemSchema.parse(raw);
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const item = await updateSystemEventFollowUpItem({
    actorId: user.id,
    actorName: user.fullName ?? user.firstName ?? user.username ?? "Unknown",
    actorType: "user",
    assigneeId: parsed.assigneeId ?? null,
    assigneeName: parsed.assigneeName ?? null,
    description: parsed.description ?? null,
    dueDate: parsed.dueDate ?? null,
    itemId,
    priority: parsed.priority,
    status: parsed.status,
    title: parsed.title,
    visibility: parsed.visibility,
  });

  if (!item) throw new Error("Failed to update follow-up item");

  await logAudit("event_follow_up_item", item.id, "update", null, parsed);
  revalidateEventPaths(item.eventId, item.clientSlug);
}

export async function deleteEventFollowUpItemAction(itemId: string) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const existing = await getEventFollowUpItemById(itemId);
  if (!existing) throw new Error("Follow-up item not found");

  const item = await deleteEventFollowUpItem(itemId, {
    actorId: user.id,
    actorName: user.fullName ?? user.firstName ?? user.username ?? "Unknown",
    actorType: "user",
  });

  if (!item) throw new Error("Failed to delete follow-up item");

  await logAudit("event_follow_up_item", item.id, "delete", null, {
    event_id: existing.eventId,
    title: existing.title,
  });

  revalidateEventPaths(existing.eventId, existing.clientSlug);
}
