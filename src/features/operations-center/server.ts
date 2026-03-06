import { listAgentOutcomes } from "@/features/agent-outcomes/server";
import { getDashboardActionCenter, getDashboardAssetSummary, getDashboardOpsSummary } from "@/features/dashboard/server";
import { buildOperationsCenterSnapshot } from "@/features/operations-center/summary";
import { listSystemEvents } from "@/features/system-events/server";
import { getWorkQueue } from "@/features/work-queue/server";

export async function getAdminOperationsCenter() {
  const [actionCenter, agentOutcomes, assetSummary, events, opsSummary, workQueue] = await Promise.all([
    getDashboardActionCenter({ limit: 4, mode: "admin" }),
    listAgentOutcomes({ audience: "all", limit: 6 }),
    getDashboardAssetSummary({ limit: 6 }),
    listSystemEvents({ audience: "all", limit: 8 }),
    getDashboardOpsSummary({ limit: 6, mode: "admin" }),
    getWorkQueue({ limit: 6, mode: "admin" }),
  ]);

  return {
    actionCenter,
    agentOutcomes,
    assetSummary,
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
