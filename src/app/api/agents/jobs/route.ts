import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { authGuard, apiError } from "@/lib/api-helpers";

// Returns the last 30 jobs (excluding heartbeats) for the chat panel refresh
export async function GET() {
  const { error: authErr } = await authGuard();
  if (authErr) return authErr;

  if (!supabaseAdmin) {
    return NextResponse.json({ jobs: [] });
  }

  const { data, error } = await supabaseAdmin
    .from("agent_jobs")
    .select("id, agent_id, status, prompt, result, error, created_at, started_at, finished_at")
    .neq("agent_id", "heartbeat")
    .order("created_at", { ascending: true })
    .limit(30);

  if (error) {
    return apiError(error.message);
  }

  return NextResponse.json({ jobs: data ?? [] });
}
