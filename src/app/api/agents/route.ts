import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const VALID_AGENTS = ["tm-monitor", "meta-ads", "campaign-monitor", "assistant"] as const;
type AgentId = (typeof VALID_AGENTS)[number];

// ─── POST /api/agents ─ queue a job ──────────────────────────────────────────

export async function POST(request: Request) {
  const body = (await request.json()) as { agent: string; prompt?: string };
  const { agent, prompt } = body;

  if (!VALID_AGENTS.includes(agent as AgentId)) {
    return NextResponse.json({ error: "Unknown agent" }, { status: 400 });
  }

  if (!supabaseAdmin) {
    // Supabase not connected yet - return a clear message instead of crashing
    return NextResponse.json(
      { error: "Supabase not connected. Set SUPABASE_* env vars and redeploy." },
      { status: 503 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("agent_jobs")
    .insert({ agent_id: agent, status: "pending", prompt: prompt ?? null })
    .select("id, agent_id, status, created_at")
    .single();

  if (error) {
    console.error("[api/agents] insert failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ job: data });
}

// ─── GET /api/agents ─ latest status per agent ──────────────────────────────

export async function GET() {
  if (!supabaseAdmin) {
    // Return idle stubs when DB not connected
    return NextResponse.json({
      agents: VALID_AGENTS.map((id) => ({
        agent_id: id,
        status: "idle",
        last_run: null,
        last_result: null,
      })),
    });
  }

  // Fetch the most recent job for each agent
  const { data, error } = await supabaseAdmin
    .from("agent_jobs")
    .select("agent_id, status, result, error, finished_at")
    .order("created_at", { ascending: false })
    .limit(50); // enough to find one per agent

  if (error) {
    console.error("[api/agents] fetch failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Pick latest row per agent
  const latest = new Map<string, (typeof data)[number]>();
  for (const row of data ?? []) {
    if (!latest.has(row.agent_id)) latest.set(row.agent_id, row);
  }

  const agents = VALID_AGENTS.map((id) => {
    const job = latest.get(id);
    return {
      agent_id: id,
      status: job?.status ?? "idle",
      last_run: job?.finished_at ?? null,
      last_result: job?.result ?? null,
    };
  });

  return NextResponse.json({ agents });
}
