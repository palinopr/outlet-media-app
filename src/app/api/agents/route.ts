import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { AgentPostSchema, VALID_AGENTS } from "@/lib/api-schemas";
import { adminGuard, apiError, parseJsonBody } from "@/lib/api-helpers";

// ─── POST /api/agents ─ queue a job ──────────────────────────────────────────

export async function POST(request: Request) {
  const adminErr = await adminGuard();
  if (adminErr) return adminErr;

  const raw = await parseJsonBody<unknown>(request);
  if (raw instanceof Response) return raw;

  const parsed = AgentPostSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const { agent, prompt } = parsed.data;

  if (!supabaseAdmin) {
    return apiError("Supabase not connected. Set SUPABASE_* env vars and redeploy.", 503);
  }

  const { data, error } = await supabaseAdmin
    .from("agent_jobs")
    .insert({ agent_id: agent, status: "pending", prompt: prompt ?? null })
    .select("id, agent_id, status, created_at")
    .single();

  if (error) {
    console.error("[api/agents] insert failed:", error.message);
    return apiError(error.message);
  }

  return NextResponse.json({ job: data });
}

// ─── GET /api/agents ─ latest status per agent ──────────────────────────────

export async function GET() {
  const adminErr = await adminGuard();
  if (adminErr) return adminErr;

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
    return apiError(error.message);
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
