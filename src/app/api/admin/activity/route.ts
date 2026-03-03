import { NextResponse } from "next/server";
import { z } from "zod";
import { adminGuard, parseJsonBody } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";

// "action" events go through logActivity() server action, not this API
const ActivitySchema = z.object({
  event_type: z.enum(["page_view", "error", "session_start"]),
  page: z.string().nullable().optional(),
  detail: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  user_id: z.string(),
  user_email: z.string(),
});

export async function POST(request: Request) {
  const adminErr = await adminGuard();
  if (adminErr) return adminErr;

  const raw = await parseJsonBody<unknown>(request);
  if (raw instanceof Response) return raw;

  const parsed = ActivitySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { error } = await supabaseAdmin.from("admin_activity").insert({
    user_id: parsed.data.user_id,
    user_email: parsed.data.user_email,
    event_type: parsed.data.event_type,
    page: parsed.data.page ?? null,
    detail: parsed.data.detail,
    metadata: parsed.data.metadata ?? {},
  });

  if (error) {
    return NextResponse.json({ error: "Failed to log activity" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
