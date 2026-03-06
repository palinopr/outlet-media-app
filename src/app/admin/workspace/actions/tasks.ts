"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { adminGuard } from "@/lib/api-helpers";
import { CreateTaskSchema, UpdateTaskSchema } from "@/lib/api-schemas";
import {
  TASK_STATUS_LABELS,
  type NotificationType,
  type TaskStatus,
} from "@/lib/workspace-types";
import { logAudit } from "../../actions/audit";
import {
  logSystemEvent,
  summarizeChangedFields,
} from "@/features/system-events/server";

const TASK_FIELD_LABELS: Record<string, string> = {
  assignee_id: "assignee",
  assignee_name: "assignee name",
  description: "description",
  due_date: "due date",
  page_id: "linked page",
  priority: "priority",
  status: "status",
  title: "title",
};

function taskStatusLabel(status: string) {
  return TASK_STATUS_LABELS[status as TaskStatus] ?? status;
}

export async function createTask(formData: {
  title: string;
  description?: unknown;
  status?: string;
  priority?: string;
  assignee_id?: string | null;
  assignee_name?: string | null;
  page_id?: string | null;
  client_slug: string;
  due_date?: string | null;
}) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = CreateTaskSchema.parse(formData);

  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  // Get max position for the target status column
  const { data: maxRow } = await supabaseAdmin
    .from("workspace_tasks")
    .select("position")
    .eq("client_slug", parsed.client_slug)
    .eq("status", parsed.status)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const nextPosition = (maxRow?.position ?? -1) + 1;

  const { data: task, error } = await supabaseAdmin
    .from("workspace_tasks")
    .insert({
      title: parsed.title,
      description: parsed.description ?? null,
      status: parsed.status,
      priority: parsed.priority,
      assignee_id: parsed.assignee_id ?? null,
      assignee_name: parsed.assignee_name ?? null,
      page_id: parsed.page_id ?? null,
      client_slug: parsed.client_slug,
      due_date: parsed.due_date ?? null,
      created_by: user.id,
      position: nextPosition,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  // Notify assignee if assigned to someone else
  if (parsed.assignee_id && parsed.assignee_id !== user.id) {
    const userName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Someone";
    const notifType: NotificationType = "assignment";
    await supabaseAdmin.from("notifications").insert({
      user_id: parsed.assignee_id,
      type: notifType,
      title: "New task assigned",
      message: parsed.title,
      task_id: task.id,
      from_user_id: user.id,
      from_user_name: userName,
    });
  }

  await logAudit("task", task.id, "create", null, { title: parsed.title });
  await logSystemEvent({
    eventName: "workspace_task_created",
    actorId: user.id,
    clientSlug: parsed.client_slug,
    entityType: "workspace_task",
    entityId: task.id,
    taskId: task.id,
    pageId: parsed.page_id ?? null,
    summary: `Created task "${parsed.title}"`,
    detail: `Added it to ${taskStatusLabel(parsed.status ?? "todo")}.`,
    metadata: {
      priority: parsed.priority,
      status: parsed.status,
    },
  });
  revalidatePath("/admin/workspace/tasks");
  revalidatePath(`/client/${parsed.client_slug}/workspace/tasks`);
  return task;
}

export async function updateTask(formData: {
  taskId: string;
  title?: string;
  description?: unknown;
  status?: string;
  priority?: string;
  assignee_id?: string | null;
  assignee_name?: string | null;
  page_id?: string | null;
  due_date?: string | null;
  position?: number;
}) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { taskId, ...updates } = formData;
  const parsed = UpdateTaskSchema.parse(updates);

  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  // Get existing task for comparison
  const { data: existing } = await supabaseAdmin
    .from("workspace_tasks")
    .select("assignee_id, client_slug, page_id, status, title")
    .eq("id", taskId)
    .single();

  if (!existing) throw new Error("Task not found");

  const { error } = await supabaseAdmin
    .from("workspace_tasks")
    .update({ ...parsed, updated_at: new Date().toISOString() })
    .eq("id", taskId);

  if (error) throw new Error(error.message);

  // Notify new assignee if assignment changed
  if (
    parsed.assignee_id &&
    parsed.assignee_id !== existing.assignee_id &&
    parsed.assignee_id !== user.id
  ) {
    const userName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Someone";
    const notifType: NotificationType = "assignment";
    await supabaseAdmin.from("notifications").insert({
      user_id: parsed.assignee_id,
      type: notifType,
      title: "Task assigned to you",
      message: parsed.title ?? "A task",
      task_id: taskId,
      from_user_id: user.id,
      from_user_name: userName,
    });
  }

  await logAudit("task", taskId, "update", null, parsed);
  const changedFields = Object.keys(parsed)
    .filter((key) => key !== "position")
    .map((key) => TASK_FIELD_LABELS[key] ?? key.replaceAll("_", " "));

  if (changedFields.length > 0) {
    const nextTitle = parsed.title ?? existing.title;
    const statusChanged =
      typeof parsed.status === "string" && parsed.status !== existing.status;

    await logSystemEvent({
      eventName: "workspace_task_updated",
      actorId: user.id,
      clientSlug: existing.client_slug,
      entityType: "workspace_task",
      entityId: taskId,
      taskId,
      pageId: parsed.page_id ?? existing.page_id ?? null,
      summary: statusChanged
        ? `Moved task "${nextTitle}" to ${taskStatusLabel(parsed.status ?? existing.status)}`
        : `Updated task "${nextTitle}"`,
      detail: summarizeChangedFields(changedFields),
      metadata: {
        changedFields,
      },
    });
  }
  revalidatePath("/admin/workspace/tasks");
  revalidatePath(`/client/${existing.client_slug}/workspace/tasks`);
}

export async function deleteTask(formData: { taskId: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  // Get task for slug before deleting
  const { data: task } = await supabaseAdmin
    .from("workspace_tasks")
    .select("client_slug, title")
    .eq("id", formData.taskId)
    .single();

  if (!task) throw new Error("Task not found");

  const { error } = await supabaseAdmin
    .from("workspace_tasks")
    .delete()
    .eq("id", formData.taskId);

  if (error) throw new Error(error.message);

  await logAudit("task", formData.taskId, "delete", { title: task.title }, null);
  await logSystemEvent({
    eventName: "workspace_task_deleted",
    actorId: user.id,
    clientSlug: task.client_slug,
    entityType: "workspace_task",
    entityId: formData.taskId,
    taskId: formData.taskId,
    summary: `Deleted task "${task.title}"`,
  });
  revalidatePath("/admin/workspace/tasks");
  revalidatePath(`/client/${task.client_slug}/workspace/tasks`);
}

export async function reorderTask(formData: {
  taskId: string;
  status: string;
  position: number;
}) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const { data: existing } = await supabaseAdmin
    .from("workspace_tasks")
    .select("client_slug, status, title")
    .eq("id", formData.taskId)
    .single();

  if (!existing) throw new Error("Task not found");

  const { error } = await supabaseAdmin
    .from("workspace_tasks")
    .update({
      status: formData.status,
      position: formData.position,
      updated_at: new Date().toISOString(),
    })
    .eq("id", formData.taskId);

  if (error) throw new Error(error.message);

  if (existing.status !== formData.status) {
    await logSystemEvent({
      eventName: "workspace_task_reordered",
      actorId: user.id,
      clientSlug: existing.client_slug,
      entityType: "workspace_task",
      entityId: formData.taskId,
      taskId: formData.taskId,
      summary: `Moved task "${existing.title}" to ${taskStatusLabel(formData.status)}`,
    });
  }

  revalidatePath("/admin/workspace/tasks");
}
