import { supabaseAdmin } from "@/lib/supabase";
import { ChatPanel } from "@/components/admin/agents/chat-panel";
import { AgentSidebar } from "@/components/admin/agents/agent-sidebar";

export const dynamic = "force-dynamic";

async function getInitialData() {
  if (!supabaseAdmin) return { jobs: [], isOnline: false, lastSeen: null };

  // Last 30 jobs (excluding heartbeats), oldest first for chat order
  const { data: jobs } = await supabaseAdmin
    .from("agent_jobs")
    .select("id, agent_id, status, prompt, result, error, created_at, started_at, finished_at")
    .neq("agent_id", "heartbeat")
    .order("created_at", { ascending: true })
    .limit(30);

  // Most recent heartbeat to determine online status
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

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-6 lg:-m-8">

      {/* Page header */}
      <div className="px-6 lg:px-8 py-4 border-b border-border/60 shrink-0">
        <h1 className="text-xl font-semibold tracking-tight">Agent Command Center</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Talk to the agent, view all runs, trigger tasks manually
        </p>
      </div>

      {/* Content — chat left, controls right */}
      <div className="flex flex-1 overflow-hidden">

        {/* Chat feed */}
        <div className="flex-1 overflow-hidden border-r border-border/60">
          <ChatPanel initialJobs={jobs} />
        </div>

        {/* Sidebar */}
        <div className="w-72 shrink-0 overflow-y-auto p-4">
          <AgentSidebar isOnline={isOnline} lastSeen={lastSeen} />
        </div>

      </div>
    </div>
  );
}
