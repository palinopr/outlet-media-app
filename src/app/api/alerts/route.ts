import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { AlertPostSchema, AlertPatchSchema } from "@/lib/api-schemas";

// POST -- agent writes an alert (requires INGEST_SECRET)
export async function POST(request: Request) {
  const raw = await request.json();
  const parsed = AlertPostSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const body = parsed.data;

  if (!process.env.INGEST_SECRET || body.secret !== process.env.INGEST_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "DB not configured" }, { status: 500 });
  }

  const { error } = await supabaseAdmin.from("agent_alerts").insert({
    message: body.message.trim(),
    level: body.level ?? "info",
  });

  if (error) {
    console.error("alerts insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// PATCH -- mark all alerts read
export async function PATCH(request: Request) {
  const raw = await request.json();
  const parsed = AlertPatchSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const body = parsed.data;
  if (!process.env.INGEST_SECRET || body.secret !== process.env.INGEST_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseAdmin) return NextResponse.json({ error: "DB not configured" }, { status: 500 });

  await supabaseAdmin
    .from("agent_alerts")
    .update({ read_at: new Date().toISOString() })
    .is("read_at", null);

  return NextResponse.json({ ok: true });
}

// GET — list recent unread alerts (used by dashboard)
export async function GET() {
  if (!supabaseAdmin) return NextResponse.json({ alerts: [] });

  const { data } = await supabaseAdmin
    .from("agent_alerts")
    .select("id, message, level, created_at")
    .is("read_at", null)
    .order("created_at", { ascending: false })
    .limit(10);

  return NextResponse.json({ alerts: data ?? [] });
}
