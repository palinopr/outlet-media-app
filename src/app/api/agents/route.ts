import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { logSystemEvent } from "@/features/system-events/server";
import { supabaseAdmin } from "@/lib/supabase";
import { AgentPostSchema, VALID_AGENTS } from "@/lib/api-schemas";
import { adminGuard, apiError, dbError, parseJsonBody } from "@/lib/api-helpers";
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
    return dbError(error);
  }

  await logSystemEvent({
    eventName: "agent_action_requested",
    actorType: "user",
    entityType: "agent_task",
    entityId: taskId,
    visibility: "admin_only",
    source: "app",
    summary: `Queued agent task: ${action} -> ${agent}`,
    detail: prompt ? "Admin requested an external agent task from the web surface." : null,
    metadata: {
      action,
      fromAgent: "web-admin",
      params: prompt ? { prompt } : {},
      taskId,
      tier: "green",
      toAgent: agent,
    },
  });

  return NextResponse.json({ job: mapTaskToJob(data) });
}

// ─── GET /api/agents ─ latest status per agent ──────────────────────────────

export async function GET() {
  const adminErr = await adminGuard();
  if (adminErr) return adminErr;

  const agents = await getLatestAgentStatuses(VALID_AGENTS);
  return NextResponse.json({ agents });
}
