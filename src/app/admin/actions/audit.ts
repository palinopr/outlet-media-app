"use server";

import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function logAudit(
  entityType: string,
  entityId: string,
  action: string,
  oldValue: unknown,
  newValue: unknown,
) {
  const user = await currentUser();
  if (!user || !supabaseAdmin) return;

  await supabaseAdmin.from("admin_audit_log").insert({
    user_id: user.id,
    user_email: user.emailAddresses[0]?.emailAddress ?? "unknown",
    entity_type: entityType,
    entity_id: entityId,
    action,
    old_value: oldValue,
    new_value: newValue,
  });
}
