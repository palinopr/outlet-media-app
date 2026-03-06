import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { AgentPostSchema, VALID_AGENTS } from "@/lib/api-schemas";
import { adminGuard, apiError, parseJsonBody } from "@/lib/api-helpers";
import { getLatestAgentStatuses, mapTaskToJob } from "@/lib/agent-jobs";

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

  const taskId = `web_${randomUUID()}`;
  const action = agent === "assistant" ? "chat" : "run";

  const { data, error } = await supabaseAdmin
    .from("agent_tasks")
    .insert({
      id: taskId,
      from_agent: "web-admin",
      to_agent: agent,
      action,
      params: prompt ? { prompt } : {},
      tier: "green",
      status: "pending",
    })
    .select("id, from_agent, to_agent, action, params, status, result, error, created_at, started_at, completed_at")
    .single();

  if (error) {
    console.error("[api/agents] insert failed:", error.message);
    return apiError(error.message);
  }

  return NextResponse.json({ job: mapTaskToJob(data) });
}

// ─── GET /api/agents ─ latest status per agent ──────────────────────────────

export async function GET() {
  const adminErr = await adminGuard();
  if (adminErr) return adminErr;

  const agents = await getLatestAgentStatuses(VALID_AGENTS);
  return NextResponse.json({ agents });
}
