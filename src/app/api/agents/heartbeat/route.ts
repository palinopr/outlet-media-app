import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Agent calls this every 30s to signal it's alive.
// Stored as a special job row so no schema changes needed.
export async function POST() {
  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const { error } = await supabaseAdmin
    .from("agent_jobs")
    .insert({
      agent_id: "heartbeat",
      status: "done",
      prompt: null,
      result: "ping",
    });

  if (error) {
    console.error("[heartbeat] insert failed:", error.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
