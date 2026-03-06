import { createNotification, listAdminNotificationRecipients } from "./server";

type WorkflowAssignmentVisibility = "admin_only" | "shared";

interface WorkflowAssignmentNotificationInput {
  actorId?: string | null;
  actorName?: string | null;
  assigneeId?: string | null;
  clientSlug?: string | null;
  entityId: string;
  entityType: string;
  message?: string | null;
  title: string;
  visibility: WorkflowAssignmentVisibility;
}

export async function notifyWorkflowAssignee(input: WorkflowAssignmentNotificationInput) {
  if (!input.assigneeId || input.assigneeId === input.actorId) return false;

  if (input.visibility === "admin_only") {
    const adminIds = await listAdminNotificationRecipients();
    if (!adminIds.includes(input.assigneeId)) return false;
  }

  await createNotification({
    clientSlug: input.clientSlug ?? null,
    entityId: input.entityId,
    entityType: input.entityType,
    fromUserId: input.actorId ?? null,
    fromUserName: input.actorName ?? null,
    message: input.message ?? null,
    title: input.title,
    type: "assignment",
    userId: input.assigneeId,
  });

  return true;
}
