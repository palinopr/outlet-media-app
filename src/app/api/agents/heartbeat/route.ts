import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { HeartbeatPayloadSchema } from "@/lib/api-schemas";
import { secretGuard, parseJsonBody, apiError } from "@/lib/api-helpers";

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
    .from("agent_runtime_state")
    .upsert({
      key: "heartbeat",
      value: {
        last_seen: new Date().toISOString(),
        source: "agent",
      },
    });

  if (error) {
    console.error("[heartbeat] insert failed:", error.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
