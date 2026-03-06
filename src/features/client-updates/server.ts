import { listAgentOutcomes } from "@/features/agent-outcomes/server";
import { listApprovalRequests } from "@/features/approvals/server";
import { getDashboardActionCenter, getDashboardAssetSummary, getDashboardOpsSummary } from "@/features/dashboard/server";
import { buildOperationsCenterSnapshot } from "@/features/operations-center/summary";
import { filterSystemEventsByScope, listSystemEvents } from "@/features/system-events/server";
import type { ScopeFilter } from "@/lib/member-access";

export async function getClientUpdatesCenter(
  clientSlug: string,
  scope: ScopeFilter | undefined,
) {
  const [actionCenter, agentOutcomes, approvals, assetSummary, rawEvents, opsSummary] =
    await Promise.all([
      getDashboardActionCenter({
        clientSlug,
        limit: 4,
        mode: "client",
        scopeCampaignIds: scope?.allowedCampaignIds,
      }),
      listAgentOutcomes({
        audience: "shared",
        clientSlug,
        limit: 6,
        scopeCampaignIds: scope?.allowedCampaignIds,
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
    ]);

  const events = filterSystemEventsByScope(rawEvents, {
    allowedCampaignIds: scope?.allowedCampaignIds ?? null,
    allowedEventIds: scope?.allowedEventIds ?? null,
  });

  return {
    actionCenter,
    agentOutcomes,
    approvals,
    assetSummary,
    events,
    opsSummary,
    snapshot: buildOperationsCenterSnapshot({
      actionCenter,
      agentOutcomes,
      assetSummary,
      events,
    }),
  };
}
