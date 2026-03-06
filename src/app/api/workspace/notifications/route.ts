import { NextResponse, type NextRequest } from "next/server";
import { authGuard, apiError } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";
import { listNotificationsForUser } from "@/features/notifications/server";

export async function GET(request: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured");

  const clientSlug = request.nextUrl.searchParams.get("clientSlug");
  const notifications = await listNotificationsForUser(userId, {
    clientSlug,
  });
  return NextResponse.json({ notifications });
}

export async function PATCH(request: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured");

  let body: { clientSlug?: string; id?: string; markAll?: boolean };
  try {
    body = await request.json();
  } catch {
    return apiError("Malformed JSON", 400);
  }

  if (body.markAll) {
    let query = supabaseAdmin
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);

    if (body.clientSlug) {
      query = query.eq("client_slug", body.clientSlug);
    }

    const { error: dbErr } = await query;
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
