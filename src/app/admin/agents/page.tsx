import { supabaseAdmin } from "@/lib/supabase";
import { ChatPanel } from "@/components/admin/agents/chat-panel";
import { AgentSidebar } from "@/components/admin/agents/agent-sidebar";
import { JobHistory } from "@/components/admin/agents/job-history";

export const dynamic = "force-dynamic";

async function getInitialData() {
  if (!supabaseAdmin) return { jobs: [], isOnline: false, lastSeen: null };

  const { data: jobs } = await supabaseAdmin
    .from("agent_jobs")
    .select("id, agent_id, status, prompt, result, error, created_at, started_at, finished_at")
    .neq("agent_id", "heartbeat")
    .order("created_at", { ascending: false })
    .limit(80);

  const { data: hb } = await supabaseAdmin
    .from("agent_jobs")
    .select("created_at")
    .eq("agent_id", "heartbeat")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const lastSeen = hb?.created_at ?? null;
  const isOnline = lastSeen
    ? Date.now() - new Date(lastSeen).getTime() < 2 * 60 * 1000
    : false;

  return { jobs: jobs ?? [], isOnline, lastSeen };
}

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
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-[640px] flex flex-col overflow-hidden">
          <ChatPanel initialJobs={chatJobs} />
        </div>
        <AgentSidebar isOnline={isOnline} lastSeen={lastSeen} />
      </div>

      <JobHistory jobs={jobs} />

    </div>
  );
}
