import { listAgentOutcomes } from "@/features/agent-outcomes/server";
import { listApprovalRequests } from "@/features/approvals/server";
import { getDashboardActionCenter, getDashboardAssetSummary, getDashboardOpsSummary } from "@/features/dashboard/server";
import { getEventOperationsSummary } from "@/features/events/server";
import { buildOperationsCenterSnapshot } from "@/features/operations-center/summary";
import { filterSystemEventsByClientScope, listSystemEvents } from "@/features/system-events/server";
import { getWorkQueue } from "@/features/work-queue/server";
import { buildWorkQueueSummary } from "@/features/work-queue/summary";
import type { ScopeFilter } from "@/lib/member-access";

export async function getClientUpdatesCenter(
  clientSlug: string,
  scope: ScopeFilter | undefined,
  userId?: string | null,
) {
  const [actionCenter, agentOutcomes, approvals, assetSummary, eventOperations, rawEvents, opsSummary, workQueue, assignedWorkQueue] =
    await Promise.all([
      getDashboardActionCenter({
        clientSlug,
        limit: 4,
        mode: "client",
        scopeCampaignIds: scope?.allowedCampaignIds,
        scopeEventIds: scope?.allowedEventIds,
      }),
      listAgentOutcomes({
        audience: "shared",
        clientSlug,
        limit: 6,
        scopeCampaignIds: scope?.allowedCampaignIds,
        scopeEventIds: scope?.allowedEventIds,
      }),
      listApprovalRequests({
        audience: "shared",
        clientSlug,
        limit: 6,
        scope,
        status: "pending",
      }),
      getDashboardAssetSummary({
        clientSlug,
        limit: 4,
        scope,
      }),
      getEventOperationsSummary({
        clientSlug,
        limit: 5,
        mode: "client",
        scope,
      }),
      listSystemEvents({
        audience: "shared",
        clientSlug,
        limit: 12,
      }),
      getDashboardOpsSummary({
        clientSlug,
        limit: 6,
        mode: "client",
        scopeCampaignIds: scope?.allowedCampaignIds,
      }),
      getWorkQueue({
        clientSlug,
        limit: 6,
        mode: "client",
        scope,
      }),
      userId
        ? getWorkQueue({
            assigneeId: userId,
            clientSlug,
            limit: 4,
            mode: "client",
            scope,
          })
        : Promise.resolve(buildWorkQueueSummary([], { limit: 4 })),
    ]);

  const events = await filterSystemEventsByClientScope(clientSlug, rawEvents, {
    allowedCampaignIds: scope?.allowedCampaignIds ?? null,
    allowedEventIds: scope?.allowedEventIds ?? null,
  });

  return {
    actionCenter,
    assignedWorkQueue,
    agentOutcomes,
    approvals,
    assetSummary,
    eventOperations,
    events,
    opsSummary,
    workQueue,
    snapshot: buildOperationsCenterSnapshot({
      actionCenter,
      agentOutcomes,
      assetSummary,
      events,
    }),
  };
}
