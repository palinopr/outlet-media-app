import { NextResponse, type NextRequest } from "next/server";
import { authGuard, apiError } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(_request: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured");

  const { data, error: dbErr } = await supabaseAdmin
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (dbErr) return apiError(dbErr.message);
  return NextResponse.json({ notifications: data });
}

export async function PATCH(request: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured");

  let body: { id?: string; markAll?: boolean };
  try {
    body = await request.json();
  } catch {
    return apiError("Malformed JSON", 400);
  }

  if (body.markAll) {
    const { error: dbErr } = await supabaseAdmin
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);

    if (dbErr) return apiError(dbErr.message);
    return NextResponse.json({ success: true });
  }

  if (body.id) {
    const { error: dbErr } = await supabaseAdmin
      .from("notifications")
      .update({ read: true })
      .eq("id", body.id)
      .eq("user_id", userId);

    if (dbErr) return apiError(dbErr.message);
    return NextResponse.json({ success: true });
  }

  return apiError("Provide id or markAll", 400);
}
