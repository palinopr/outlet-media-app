import { filterSystemEventsByScope, listSystemEvents } from "@/features/system-events/server";
import type { ScopeFilter } from "@/lib/member-access";
import { listApprovalRequests } from "./server";
import { buildApprovalCenterSummary } from "./summary";

export async function getAdminApprovalsCenter(clientSlug?: string | null) {
  const [pending, recentRaw, rawEvents] = await Promise.all([
    listApprovalRequests({
      audience: "all",
      clientSlug,
      limit: 12,
      status: "pending",
    }),
    listApprovalRequests({
      audience: "all",
      clientSlug,
      limit: 24,
      status: "all",
    }),
    listSystemEvents({
      audience: "all",
      clientSlug,
      entityType: "approval_request",
      limit: 12,
    }),
  ]);

  const recent = recentRaw.filter((approval) => approval.status !== "pending").slice(0, 12);

  return {
    events: rawEvents,
    pending,
    recent,
    summary: buildApprovalCenterSummary({ pending, recent }),
  };
}

export async function getClientApprovalsCenter(clientSlug: string, scope: ScopeFilter | undefined) {
  const [pending, recentRaw, rawEvents] = await Promise.all([
    listApprovalRequests({
      audience: "shared",
      clientSlug,
      limit: 12,
      scope,
      status: "pending",
    }),
    listApprovalRequests({
      audience: "shared",
      clientSlug,
      limit: 24,
      scope,
      status: "all",
    }),
    listSystemEvents({
      audience: "shared",
      clientSlug,
      entityType: "approval_request",
      limit: 12,
    }),
  ]);

  const recent = recentRaw.filter((approval) => approval.status !== "pending").slice(0, 12);

  return {
    events: filterSystemEventsByScope(rawEvents, scope),
    pending,
    recent,
    summary: buildApprovalCenterSummary({ pending, recent }),
  };
}
