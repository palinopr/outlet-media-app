import type { ScopeFilter } from "@/lib/member-access";
import { listApprovalRequests } from "@/features/approvals/server";
import { listNotificationsForUser } from "@/features/notifications/server";
import { getWorkQueue } from "@/features/work-queue/server";
import { buildWorkQueueSummary } from "@/features/work-queue/summary";

interface GetAdminNotificationsCenterOptions {
  userId?: string | null;
}

interface GetClientNotificationsCenterOptions {
  clientSlug: string;
  scope?: ScopeFilter;
  userId: string;
}

export async function getAdminNotificationsCenter(
  options: GetAdminNotificationsCenterOptions,
) {
  const userId = options.userId ?? null;
  const [approvals, notifications, assignedWorkQueue] = await Promise.all([
    listApprovalRequests({
      audience: "all",
      limit: 5,
      status: "pending",
    }),
    userId ? listNotificationsForUser(userId) : Promise.resolve([]),
    userId
      ? getWorkQueue({
          assigneeId: userId,
          limit: 4,
          mode: "admin",
        })
      : Promise.resolve(buildWorkQueueSummary([], { limit: 4 })),
  ]);

  return {
    approvals,
    assignedWorkQueue,
    notifications,
  };
}

export async function getClientNotificationsCenter(
  options: GetClientNotificationsCenterOptions,
) {
  const [approvals, notifications, assignedWorkQueue] = await Promise.all([
    listApprovalRequests({
      audience: "shared",
      clientSlug: options.clientSlug,
      limit: 5,
      scope: options.scope,
      status: "pending",
    }),
    listNotificationsForUser(options.userId, {
      clientSlug: options.clientSlug,
      scope: options.scope,
    }),
    getWorkQueue({
      assigneeId: options.userId,
      clientSlug: options.clientSlug,
      limit: 4,
      mode: "client",
      scope: options.scope,
    }),
  ]);

  return {
    approvals,
    assignedWorkQueue,
    notifications,
  };
}
