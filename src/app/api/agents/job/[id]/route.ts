import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "DB not configured" }, { status: 503 });
  }

  const { data, error } = await supabaseAdmin
    .from("agent_jobs")
    .select("id, agent_id, status, prompt, result, error, created_at, started_at, finished_at")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json({ job: data });
}
