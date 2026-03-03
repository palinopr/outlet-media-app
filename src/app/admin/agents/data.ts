import { supabaseAdmin } from "@/lib/supabase";

export interface AgentJob {
  id: string;
  agent_id: string;
  status: "pending" | "running" | "done" | "error";
  prompt: string | null;
  result: string | null;
  error: string | null;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
}

export interface AgentsData {
  jobs: AgentJob[];
  isOnline: boolean;
  lastSeen: string | null;
}

export async function getInitialData(): Promise<AgentsData> {
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

  return { jobs: (jobs ?? []) as AgentJob[], isOnline, lastSeen };
}
