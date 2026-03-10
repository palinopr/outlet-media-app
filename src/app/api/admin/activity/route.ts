import { NextResponse } from "next/server";
import { z } from "zod";
import { currentUser } from "@clerk/nextjs/server";
import { adminGuard, apiError, validateRequest } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";

// "action" events go through logActivity() server action, not this API
const ActivitySchema = z.object({
  event_type: z.enum(["page_view", "error", "session_start"]),
  page: z.string().nullable().optional(),
  detail: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  const adminErr = await adminGuard();
  if (adminErr) return adminErr;

  const caller = await currentUser();
  if (!caller) return apiError("Unauthenticated", 401);

  const { data, error: valErr } = await validateRequest(request, ActivitySchema);
  if (valErr) return valErr;

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { error } = await supabaseAdmin.from("admin_activity").insert({
    user_id: caller.id,
    user_email: caller.emailAddresses[0]?.emailAddress ?? "unknown",
    event_type: data.event_type,
    page: data.page ?? null,
    detail: data.detail,
    metadata: data.metadata ?? {},
  });

  if (error) {
    return apiError("Failed to log activity", 500);
  }

  return NextResponse.json({ ok: true });
}
