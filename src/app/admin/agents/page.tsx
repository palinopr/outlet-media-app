import { getInitialData } from "./data";
import { ChatPanel } from "@/components/admin/agents/chat-panel";
import { AgentSidebar } from "@/components/admin/agents/agent-sidebar";
import { JobHistory } from "@/components/admin/agents/job-history";

export const dynamic = "force-dynamic";

export default async function AgentsPage() {
  const { jobs, isOnline, lastSeen } = await getInitialData();

  // Chat panel gets only assistant jobs, in ascending order
  const chatJobs = [...jobs]
    .filter((j) => j.agent_id === "assistant")
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Agent Command Center</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Talk to the agent, view all runs, trigger tasks manually
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_272px] gap-6 items-start">
        <div className="rounded-xl border border-border/60 bg-card h-[640px] flex flex-col overflow-hidden">
          <ChatPanel initialJobs={chatJobs} />
        </div>
        <AgentSidebar isOnline={isOnline} lastSeen={lastSeen} />
      </div>

      <JobHistory jobs={jobs} />

    </div>
  );
}
