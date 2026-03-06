import type { AgentOutcomeView } from "@/features/agent-outcomes/summary";
import type { AssetLibrarySummary } from "@/features/assets/summary";
import type { DashboardActionCenter } from "@/features/dashboard/server";
import type { SystemEvent } from "@/features/system-events/server";

export type OperationsCenterMetricKey =
  | "pending_approvals"
  | "open_discussions"
  | "crm_follow_ups"
  | "agent_follow_through"
  | "assets_needing_review";

export interface OperationsCenterMetric {
  detail: string;
  key: OperationsCenterMetricKey;
  label: string;
  value: number;
}

export interface OperationsCenterSnapshot {
  lastSharedEventAt: string | null;
  metrics: OperationsCenterMetric[];
}

function metricValue(summary: AssetLibrarySummary, key: "needs_review") {
  return summary.metrics.find((metric) => metric.key === key)?.value ?? 0;
}

function hasLinkedWork(outcome: AgentOutcomeView) {
  return Boolean(
    outcome.linkedActionItemId ??
      outcome.linkedAssetFollowUpItemId ??
      outcome.linkedCrmFollowUpItemId ??
      outcome.linkedEventFollowUpItemId,
  );
}

export function countActionableAgentOutcomes(outcomes: AgentOutcomeView[]) {
  return outcomes.filter((outcome) => {
    if (outcome.status === "pending" || outcome.status === "running") return true;
    return !hasLinkedWork(outcome);
  }).length;
}

export function buildOperationsCenterSnapshot(input: {
  actionCenter: DashboardActionCenter;
  agentOutcomes: AgentOutcomeView[];
  assetSummary: AssetLibrarySummary;
  events: SystemEvent[];
}): OperationsCenterSnapshot {
  const actionableAgentOutcomes = countActionableAgentOutcomes(input.agentOutcomes);

  return {
    lastSharedEventAt: input.events[0]?.createdAt ?? null,
    metrics: [
      {
        key: "pending_approvals",
        label: "Pending approvals",
        value: input.actionCenter.approvals.length,
        detail: "Client and internal decisions waiting on review.",
      },
      {
        key: "open_discussions",
        label: "Open discussions",
        value: input.actionCenter.discussions.length,
        detail: "Threads that still need a reply or resolution.",
      },
      {
        key: "crm_follow_ups",
        label: "CRM follow-ups",
        value: input.actionCenter.crmFollowUps.length,
        detail: "Relationship work due soon or already in motion.",
      },
      {
        key: "agent_follow_through",
        label: "Agent follow-through",
        value: actionableAgentOutcomes,
        detail: "Queued or untriaged agent work that still needs handling.",
      },
      {
        key: "assets_needing_review",
        label: "Assets needing review",
        value: metricValue(input.assetSummary, "needs_review"),
        detail: "Creative still waiting on review or clearer context.",
      },
    ],
  };
}
