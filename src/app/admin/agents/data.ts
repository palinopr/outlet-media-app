import { listAgentOutcomes } from "@/features/agent-outcomes/server";
import { buildAgentCommandSummary, type AgentCommandSummary } from "@/features/agents/summary";
import {
  getHeartbeatStatus,
  listAgentJobs,
  type AgentJobView,
} from "@/lib/agent-jobs";

export type AgentJob = AgentJobView;

export interface AgentsData {
  commandSummary: AgentCommandSummary;
  jobs: AgentJob[];
  isOnline: boolean;
  lastSeen: string | null;
  outcomes: Awaited<ReturnType<typeof listAgentOutcomes>>;
}

export async function getInitialData(): Promise<AgentsData> {
  const [jobs, heartbeat, outcomes] = await Promise.all([
    listAgentJobs(80),
    getHeartbeatStatus(),
    listAgentOutcomes({
      audience: "all",
      limit: 12,
    }),
  ]);

  return {
    commandSummary: buildAgentCommandSummary({
      isOnline: heartbeat.isOnline,
      jobs,
      lastSeen: heartbeat.lastSeen,
      outcomes,
    }),
    jobs,
    isOnline: heartbeat.isOnline,
    lastSeen: heartbeat.lastSeen,
    outcomes,
  };
}
