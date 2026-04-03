import type { AgentOutcomeView } from "@/features/agent-outcomes/summary";

function hasLinkedWork(outcome: AgentOutcomeView) {
  return Boolean(
    outcome.linkedActionItemId ??
      outcome.linkedAssetFollowUpItemId ??
      outcome.linkedEventFollowUpItemId,
  );
}

export function countActionableAgentOutcomes(outcomes: AgentOutcomeView[]) {
  return outcomes.filter((outcome) => {
    if (outcome.status === "pending" || outcome.status === "running") return true;
    return !hasLinkedWork(outcome);
  }).length;
}

