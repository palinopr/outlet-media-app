import { NextResponse, type NextRequest } from "next/server";
import { authGuard, apiError } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";
import type { AppNotification } from "@/features/notifications/types";

export async function GET(_request: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured");

  const { data, error: dbErr } = await supabaseAdmin
    .from("notifications" as never)
    .select(
      "id, user_id, type, title, message, page_id, task_id, from_user_id, from_user_name, read, created_at, client_slug, entity_type, entity_id",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (dbErr) return apiError(dbErr.message);
  const notifications: AppNotification[] = ((data ?? []) as Record<string, unknown>[]).map(
    (row) => ({
      clientSlug: (row.client_slug as string | null) ?? null,
      createdAt: row.created_at as string,
      entityId: (row.entity_id as string | null) ?? null,
      entityType: (row.entity_type as string | null) ?? null,
      fromUserId: (row.from_user_id as string | null) ?? null,
      fromUserName: (row.from_user_name as string | null) ?? null,
      id: row.id as string,
      message: (row.message as string | null) ?? null,
      pageId: (row.page_id as string | null) ?? null,
      read: Boolean(row.read),
      taskId: (row.task_id as string | null) ?? null,
      title: row.title as string,
      type: row.type as string,
      userId: row.user_id as string,
    }),
  );
  return NextResponse.json({ notifications });
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
