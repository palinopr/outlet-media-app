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

export interface AgentCommandSummary {
  attentionJobs: AgentJobView[];
  metrics: AgentCommandMetric[];
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

  return {
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
  };
}
