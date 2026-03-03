"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import { supabaseAdmin } from "@/lib/supabase";
import { adminGuard } from "@/lib/api-helpers";
import { logAudit } from "./audit";

const RenameClientSchema = z.object({
  oldSlug: z.string().min(1),
  newSlug: z.string().min(1).regex(/^[a-z0-9_]+$/),
});

export async function renameClient(formData: { oldSlug: string; newSlug: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = RenameClientSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");
  if (parsed.oldSlug === parsed.newSlug) return;

  const { error: e1 } = await supabaseAdmin
    .from("meta_campaigns")
    .update({ client_slug: parsed.newSlug, updated_at: new Date().toISOString() })
    .eq("client_slug", parsed.oldSlug);
  if (e1) throw new Error(e1.message);

  const { error: e2 } = await supabaseAdmin
    .from("tm_events")
    .update({ client_slug: parsed.newSlug, updated_at: new Date().toISOString() })
    .eq("client_slug", parsed.oldSlug);
  if (e2) throw new Error(e2.message);

  await logAudit("client", parsed.oldSlug, "rename", { slug: parsed.oldSlug }, { slug: parsed.newSlug });
  revalidatePath("/admin/clients");
  revalidatePath("/admin/campaigns");
  revalidatePath("/admin/events");
}

const DeactivateClientSchema = z.object({
  slug: z.string().min(1),
});

export async function deactivateClient(formData: { slug: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = DeactivateClientSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { error } = await supabaseAdmin
    .from("meta_campaigns")
    .update({ status: "PAUSED", updated_at: new Date().toISOString() })
    .eq("client_slug", parsed.slug)
    .eq("status", "ACTIVE");

  if (error) throw new Error(error.message);

  await logAudit("client", parsed.slug, "deactivate", null, { paused_all_campaigns: true });
  revalidatePath("/admin/clients");
  revalidatePath("/admin/campaigns");
}
