import type { AgentOutcomeView } from "@/features/agent-outcomes/summary";
import { countActionableAgentOutcomes } from "@/features/operations-center/summary";
import type { AgentJobView } from "@/lib/agent-jobs";

export interface AgentCommandMetric {
  detail: string;
  key: "actionable_outcomes" | "failed_recent" | "running" | "runtime";
  label: string;
  tone: "critical" | "neutral" | "positive";
  value: number | string;
}

export interface AgentCommandOutcomeBucket {
  key: "asset" | "campaign" | "crm" | "event" | "other";
  label: string;
  value: number;
}

export interface AgentCommandSummary {
  actionableOutcomes: AgentOutcomeView[];
  attentionJobs: AgentJobView[];
  metrics: AgentCommandMetric[];
  outcomeBuckets: AgentCommandOutcomeBucket[];
}

function runtimeDetail(isOnline: boolean, lastSeen: string | null) {
  if (isOnline) return "Heartbeat is healthy and agents are online.";
  if (lastSeen) return `Last heartbeat ${lastSeen}.`;
  return "No heartbeat reported yet.";
}

function recentCutoff(now: Date) {
  return now.getTime() - 24 * 60 * 60 * 1000;
}

function isRecent(job: AgentJobView, now: Date) {
  return new Date(job.created_at).getTime() >= recentCutoff(now);
}

function compareAttentionJobs(left: AgentJobView, right: AgentJobView) {
  const statusWeight = (job: AgentJobView) => {
    switch (job.status) {
      case "error":
        return 0;
      case "running":
        return 1;
      case "pending":
        return 2;
      default:
        return 3;
    }
  };

  const statusDiff = statusWeight(left) - statusWeight(right);
  if (statusDiff !== 0) return statusDiff;
  return right.created_at.localeCompare(left.created_at);
}

function hasLinkedWork(outcome: AgentOutcomeView) {
  return Boolean(
    outcome.linkedActionItemId ??
      outcome.linkedAssetFollowUpItemId ??
      outcome.linkedCrmFollowUpItemId ??
      outcome.linkedEventFollowUpItemId,
  );
}

function isActionableOutcome(outcome: AgentOutcomeView) {
  if (outcome.status === "pending" || outcome.status === "running") return true;
  return !hasLinkedWork(outcome);
}

function outcomeBucketKey(outcome: AgentOutcomeView): AgentCommandOutcomeBucket["key"] {
  if (outcome.assetId) return "asset";
  if (outcome.crmContactId) return "crm";
  if (outcome.eventId) return "event";
  if (outcome.campaignId) return "campaign";
  return "other";
}

function compareActionableOutcomes(left: AgentOutcomeView, right: AgentOutcomeView) {
  const statusWeight = (outcome: AgentOutcomeView) => {
    if (outcome.status === "error") return 0;
    if (outcome.status === "done" && !hasLinkedWork(outcome)) return 1;
    if (outcome.status === "running") return 2;
    if (outcome.status === "pending") return 3;
    return 4;
  };

  const statusDiff = statusWeight(left) - statusWeight(right);
  if (statusDiff !== 0) return statusDiff;
  return right.createdAt.localeCompare(left.createdAt);
}

export function buildAgentCommandSummary(input: {
  isOnline: boolean;
  jobs: AgentJobView[];
  lastSeen: string | null;
  now?: Date;
  outcomes: AgentOutcomeView[];
}): AgentCommandSummary {
  const now = input.now ?? new Date();
  const nonAssistantJobs = input.jobs.filter((job) => job.agent_id !== "assistant");
  const running = nonAssistantJobs.filter(
    (job) => job.status === "pending" || job.status === "running",
  );
  const failedRecent = nonAssistantJobs.filter(
    (job) => job.status === "error" && isRecent(job, now),
  );
  const actionableOutcomes = countActionableAgentOutcomes(input.outcomes);
  const actionableOutcomeQueue = input.outcomes
    .filter(isActionableOutcome)
    .sort(compareActionableOutcomes)
    .slice(0, 6);
  const outcomeBuckets = new Map<AgentCommandOutcomeBucket["key"], number>();

  for (const outcome of input.outcomes) {
    if (!isActionableOutcome(outcome)) continue;
    const key = outcomeBucketKey(outcome);
    outcomeBuckets.set(key, (outcomeBuckets.get(key) ?? 0) + 1);
  }

  return {
    actionableOutcomes: actionableOutcomeQueue,
    attentionJobs: nonAssistantJobs
      .filter((job) => job.status !== "done")
      .sort(compareAttentionJobs)
      .slice(0, 6),
    metrics: [
      {
        key: "runtime",
        label: "Runtime",
        value: input.isOnline ? "Online" : "Offline",
        detail: runtimeDetail(input.isOnline, input.lastSeen),
        tone: input.isOnline ? "positive" : "critical",
      },
      {
        key: "running",
        label: "Queued / running",
        value: running.length,
        detail: "Jobs waiting on the worker or actively executing.",
        tone: running.length > 0 ? "neutral" : "positive",
      },
      {
        key: "failed_recent",
        label: "Failed in 24h",
        value: failedRecent.length,
        detail: "Runs that need inspection or a retry.",
        tone: failedRecent.length > 0 ? "critical" : "positive",
      },
      {
        key: "actionable_outcomes",
        label: "Needs follow-through",
        value: actionableOutcomes,
        detail: "Agent work that is queued, still running, or missing a linked next step.",
        tone: actionableOutcomes > 0 ? "neutral" : "positive",
      },
    ],
    outcomeBuckets: [
      { key: "campaign", label: "Campaigns", value: outcomeBuckets.get("campaign") ?? 0 },
      { key: "asset", label: "Assets", value: outcomeBuckets.get("asset") ?? 0 },
      { key: "event", label: "Events", value: outcomeBuckets.get("event") ?? 0 },
      { key: "crm", label: "CRM", value: outcomeBuckets.get("crm") ?? 0 },
      { key: "other", label: "Other", value: outcomeBuckets.get("other") ?? 0 },
    ],
  };
}
