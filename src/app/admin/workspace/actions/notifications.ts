"use server";

import { supabaseAdmin } from "@/lib/supabase";
import type { NotificationInsert } from "@/lib/workspace-types";

export async function createNotification(data: NotificationInsert) {
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { error } = await supabaseAdmin.from("notifications").insert(data);
  if (error) throw new Error(error.message);
}

export async function markAsRead(notificationId: string) {
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { error } = await supabaseAdmin
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);
  if (error) throw new Error(error.message);
}

export async function markAllAsRead(userId: string) {
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { error } = await supabaseAdmin
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);
  if (error) throw new Error(error.message);
}

export async function getUnreadCount(userId: string): Promise<number> {
  if (!supabaseAdmin) return 0;

  const { count, error } = await supabaseAdmin
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false);

  if (error) return 0;
  return count ?? 0;
}
