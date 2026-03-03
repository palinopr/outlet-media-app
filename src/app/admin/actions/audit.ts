"use server";

import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export type ActivityEventType = "page_view" | "action" | "error" | "session_start";

export async function logActivity(
  eventType: ActivityEventType,
  detail: string,
  page?: string | null,
  metadata?: Record<string, unknown>,
) {
  const user = await currentUser();
  if (!user || !supabaseAdmin) return;

  await supabaseAdmin.from("admin_activity").insert({
    user_id: user.id,
    user_email: user.emailAddresses[0]?.emailAddress ?? "unknown",
    event_type: eventType,
    page: page ?? null,
    detail,
    metadata: metadata ?? {},
  });
}

/** Backward-compatible wrapper. Writes to admin_activity with event_type='action'. */
export async function logAudit(
  entityType: string,
  entityId: string,
  action: string,
  oldValue: unknown,
  newValue: unknown,
) {
  await logActivity("action", action, null, {
    entity_type: entityType,
    entity_id: entityId,
    old_value: oldValue,
    new_value: newValue,
  });
}
