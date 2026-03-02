import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { AgentPostSchema, VALID_AGENTS } from "@/lib/api-schemas";

// ─── POST /api/agents ─ queue a job ──────────────────────────────────────────

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const raw = await request.json();
  const parsed = AgentPostSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const { agent, prompt } = parsed.data;

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
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

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
