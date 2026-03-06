import { supabaseAdmin } from "@/lib/supabase";
import type { CreateNotificationInput } from "./types";

export async function createNotification(data: CreateNotificationInput) {
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { error } = await supabaseAdmin.from("notifications" as never).insert({
    client_slug: data.clientSlug ?? null,
    created_at: new Date().toISOString(),
    entity_id: data.entityId ?? null,
    entity_type: data.entityType ?? null,
    from_user_id: data.fromUserId ?? null,
    from_user_name: data.fromUserName ?? null,
    message: data.message ?? null,
    page_id: data.pageId ?? null,
    read: data.read ?? false,
    task_id: data.taskId ?? null,
    title: data.title,
    type: data.type,
    user_id: data.userId,
  } as never);
  if (error) throw new Error(error.message);
}

export async function listClientNotificationRecipients(
  clientSlug: string,
  options: { excludeUserId?: string | null } = {},
) {
  if (!supabaseAdmin) return [];

  const { data: client, error: clientError } = await supabaseAdmin
    .from("clients")
    .select("id")
    .eq("slug", clientSlug)
    .maybeSingle();

  if (clientError || !client) return [];

  let query = supabaseAdmin
    .from("client_members")
    .select("clerk_user_id")
    .eq("client_id", client.id)
    .not("clerk_user_id", "is", null);

  if (options.excludeUserId) {
    query = query.neq("clerk_user_id", options.excludeUserId);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[notifications] failed to list client recipients:", error.message);
    return [];
  }

  return [...new Set((data ?? []).map((row) => row.clerk_user_id).filter(Boolean))];
}
