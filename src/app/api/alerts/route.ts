import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { AlertPostSchema, AlertPatchSchema } from "@/lib/api-schemas";
import { apiError, secretGuard, validateRequest } from "@/lib/api-helpers";

// POST -- agent writes an alert (requires INGEST_SECRET)
export async function POST(request: Request) {
  const { data: body, error: valErr } = await validateRequest(request, AlertPostSchema);
  if (valErr) return valErr;

  const secretErr = secretGuard(body.secret);
  if (secretErr) return secretErr;
  if (!supabaseAdmin) {
    return apiError("DB not configured", 500);
  }

  const { error } = await supabaseAdmin.from("agent_alerts").insert({
    message: body.message.trim(),
    level: body.level ?? "info",
  });

  if (error) {
    console.error("alerts insert error:", error);
    return apiError(error.message, 500);
  }

  return NextResponse.json({ ok: true });
}

// PATCH -- mark all alerts read
export async function PATCH(request: Request) {
  const { data: body, error: valErr } = await validateRequest(request, AlertPatchSchema);
  if (valErr) return valErr;
  const secretErr = secretGuard(body.secret);
  if (secretErr) return secretErr;
  if (!supabaseAdmin) return apiError("DB not configured", 500);

  const { error } = await supabaseAdmin
    .from("agent_alerts")
    .update({ read_at: new Date().toISOString() })
    .is("read_at", null);

  if (error) {
    console.error("alerts update error:", error);
    return apiError(error.message, 500);
  }

  return NextResponse.json({ ok: true });
}

// GET -- list recent unread alerts (requires INGEST_SECRET via ?secret= query param)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secretErr = secretGuard(searchParams.get("secret"));
  if (secretErr) return secretErr;
  if (!supabaseAdmin) return NextResponse.json({ alerts: [] });

  const { data } = await supabaseAdmin
    .from("agent_alerts")
    .select("id, message, level, created_at")
    .is("read_at", null)
    .order("created_at", { ascending: false })
    .limit(10);

  return NextResponse.json({ alerts: data ?? [] });
}
