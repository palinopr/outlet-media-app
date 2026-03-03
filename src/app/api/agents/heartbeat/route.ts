import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { HeartbeatPayloadSchema } from "@/lib/api-schemas";
import { secretGuard, parseJsonBody, apiError } from "@/lib/api-helpers";

// Agent calls this every 30s to signal it's alive.
// Stored as a special job row so no schema changes needed.
export async function POST(request: Request) {
  const raw = await parseJsonBody<unknown>(request);
  if (raw instanceof Response) return raw;

  const parsed = HeartbeatPayloadSchema.safeParse(raw);
  if (!parsed.success) {
    return apiError("Invalid heartbeat payload", 400);
  }

  const secretErr = secretGuard(parsed.data.secret);
  if (secretErr) return secretErr;

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
