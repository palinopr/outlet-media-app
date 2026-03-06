import { supabaseAdmin } from "@/lib/supabase";
import type { AppNotification, CreateNotificationInput } from "./types";

interface ListNotificationsForUserOptions {
  clientSlug?: string | null;
  limit?: number;
}

function mapNotificationRow(row: Record<string, unknown>): AppNotification {
  return {
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
  };
}

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

export async function listNotificationsForUser(
  userId: string,
  options: ListNotificationsForUserOptions = {},
): Promise<AppNotification[]> {
  if (!supabaseAdmin || !userId) return [];

  let query = supabaseAdmin
    .from("notifications" as never)
    .select(
      "id, user_id, type, title, message, page_id, task_id, from_user_id, from_user_name, read, created_at, client_slug, entity_type, entity_id",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(options.limit ?? 50);

  if (options.clientSlug) {
    query = query.eq("client_slug", options.clientSlug);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[notifications] failed to list notifications:", error.message);
    return [];
  }

  return ((data ?? []) as Record<string, unknown>[]).map((row) => mapNotificationRow(row));
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
