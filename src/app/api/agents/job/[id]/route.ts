import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { authGuard, apiError } from "@/lib/api-helpers";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error: authErr } = await authGuard();
  if (authErr) return authErr;

  if (!supabaseAdmin) {
    return apiError("DB not configured", 503);
  }

  const { data, error } = await supabaseAdmin
    .from("agent_jobs")
    .select("id, agent_id, status, prompt, result, error, created_at, started_at, finished_at")
    .eq("id", id)
    .single();

  if (error) {
    return apiError(error.message, 404);
  }

  return NextResponse.json({ job: data });
}
