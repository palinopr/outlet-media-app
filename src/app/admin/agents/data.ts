import {
  getHeartbeatStatus,
  listAgentJobs,
  type AgentJobView,
} from "@/lib/agent-jobs";

export type AgentJob = AgentJobView;

export interface AgentsData {
  jobs: AgentJob[];
  isOnline: boolean;
  lastSeen: string | null;
}

export async function getInitialData(): Promise<AgentsData> {
  const [jobs, heartbeat] = await Promise.all([
    listAgentJobs(80),
    getHeartbeatStatus(),
  ]);

  return {
    jobs,
    isOnline: heartbeat.isOnline,
    lastSeen: heartbeat.lastSeen,
  };
}
