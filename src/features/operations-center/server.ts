import { listAgentOutcomes } from "@/features/agent-outcomes/server";
import { getDashboardActionCenter, getDashboardAssetSummary, getDashboardOpsSummary } from "@/features/dashboard/server";
import { getEventOperationsSummary } from "@/features/events/server";
import { buildOperationsCenterSnapshot } from "@/features/operations-center/summary";
import { listSystemEvents } from "@/features/system-events/server";
import { getWorkQueue } from "@/features/work-queue/server";
import { buildWorkQueueSummary } from "@/features/work-queue/summary";

export async function getAdminOperationsCenter(userId?: string | null) {
  const [actionCenter, agentOutcomes, assetSummary, eventOperations, events, opsSummary, workQueue, assignedWorkQueue] = await Promise.all([
    getDashboardActionCenter({ limit: 4, mode: "admin" }),
    listAgentOutcomes({ audience: "all", limit: 6 }),
    getDashboardAssetSummary({ limit: 6 }),
    getEventOperationsSummary({ limit: 5, mode: "admin" }),
    listSystemEvents({ audience: "all", limit: 8 }),
    getDashboardOpsSummary({ limit: 6, mode: "admin" }),
    getWorkQueue({ limit: 6, mode: "admin" }),
    userId
      ? getWorkQueue({ assigneeId: userId, limit: 4, mode: "admin" })
      : Promise.resolve(buildWorkQueueSummary([], { limit: 4 })),
  ]);

  return {
    actionCenter,
    assignedWorkQueue,
    agentOutcomes,
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
