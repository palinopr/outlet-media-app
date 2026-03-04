"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import { supabaseAdmin } from "@/lib/supabase";
import { adminGuard } from "@/lib/api-helpers";
import { logAudit } from "./audit";
import { syncCampaignStatus, syncCampaignBudget } from "./meta-sync";

const UpdateStatusSchema = z.object({
  campaignId: z.string().min(1),
  status: z.enum(["ACTIVE", "PAUSED"]),
});

export async function updateCampaignStatus(formData: { campaignId: string; status: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = UpdateStatusSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { data: old } = await supabaseAdmin
    .from("meta_campaigns")
    .select("status")
    .eq("campaign_id", parsed.campaignId)
    .single();

  const { error } = await supabaseAdmin
    .from("meta_campaigns")
    .update({ status: parsed.status, updated_at: new Date().toISOString() })
    .eq("campaign_id", parsed.campaignId);

  if (error) throw new Error(error.message);

  await logAudit("campaign", parsed.campaignId, "update_status", { status: old?.status }, { status: parsed.status });
  revalidatePath("/admin/campaigns");
}

const UpdateTypeSchema = z.object({
  campaignId: z.string().min(1),
  campaignType: z.enum(["sales", "music", "traffic"]),
});

export async function updateCampaignType(formData: { campaignId: string; campaignType: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = UpdateTypeSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { data: old } = await supabaseAdmin
    .from("meta_campaigns")
    .select("campaign_type")
    .eq("campaign_id", parsed.campaignId)
    .single();

  const { error } = await supabaseAdmin
    .from("meta_campaigns")
    .update({ campaign_type: parsed.campaignType, updated_at: new Date().toISOString() })
    .eq("campaign_id", parsed.campaignId);

  if (error) throw new Error(error.message);

  await logAudit("campaign", parsed.campaignId, "update_type", { campaign_type: old?.campaign_type }, { campaign_type: parsed.campaignType });
  revalidatePath("/admin/campaigns");
}

const UpdateBudgetSchema = z.object({
  campaignId: z.string().min(1),
  dailyBudgetCents: z.number().int().positive(),
});

export async function updateCampaignBudget(formData: { campaignId: string; dailyBudgetCents: number }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = UpdateBudgetSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { data: old } = await supabaseAdmin
    .from("meta_campaigns")
    .select("daily_budget")
    .eq("campaign_id", parsed.campaignId)
    .single();

  const { error } = await supabaseAdmin
    .from("meta_campaigns")
    .update({ daily_budget: parsed.dailyBudgetCents, updated_at: new Date().toISOString() })
    .eq("campaign_id", parsed.campaignId);

  if (error) throw new Error(error.message);

  await logAudit("campaign", parsed.campaignId, "update_budget", { daily_budget: old?.daily_budget }, { daily_budget: parsed.dailyBudgetCents });
  revalidatePath("/admin/campaigns");
}

const AssignClientSchema = z.object({
  campaignId: z.string().min(1),
  clientSlug: z.string(),
});

export async function assignCampaignClient(formData: { campaignId: string; clientSlug: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = AssignClientSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { data: old } = await supabaseAdmin
    .from("meta_campaigns")
    .select("client_slug")
    .eq("campaign_id", parsed.campaignId)
    .single();

  const { error } = await supabaseAdmin
    .from("meta_campaigns")
    .update({ client_slug: parsed.clientSlug || null, updated_at: new Date().toISOString() })
    .eq("campaign_id", parsed.campaignId);

  if (error) throw new Error(error.message);

  await logAudit("campaign", parsed.campaignId, "assign_client", { client_slug: old?.client_slug }, { client_slug: parsed.clientSlug });
  revalidatePath("/admin/campaigns");
}

const BulkAssignSchema = z.object({
  campaignIds: z.array(z.string().min(1)).min(1),
  clientSlug: z.string().min(1),
});

export async function bulkAssignClient(formData: { campaignIds: string[]; clientSlug: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = BulkAssignSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");

  // Auto-create client in clients table if it doesn't exist
  const { data: existing } = await supabaseAdmin
    .from("clients")
    .select("id")
    .eq("slug", parsed.clientSlug)
    .maybeSingle();

  if (!existing) {
    const name = parsed.clientSlug
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    const { error: clientErr } = await supabaseAdmin
      .from("clients")
      .insert({ name, slug: parsed.clientSlug, status: "active" });
    if (clientErr) throw new Error(clientErr.message);
  }

  // Save campaign -> client overrides
  const now = new Date().toISOString();
  for (const campaignId of parsed.campaignIds) {
    const { error: upsertErr } = await supabaseAdmin
      .from("campaign_client_overrides")
      .upsert(
        { campaign_id: campaignId, client_slug: parsed.clientSlug, updated_at: now },
        { onConflict: "campaign_id" },
      );
    if (upsertErr) throw new Error(upsertErr.message);
  }

  await logAudit("campaign", "bulk", "bulk_assign_client", null, {
    count: parsed.campaignIds.length,
    client_slug: parsed.clientSlug,
  });

  revalidatePath("/admin/campaigns");
  revalidatePath("/admin/clients");
  return parsed.campaignIds.length;
}

export async function syncCampaignToMeta(campaignId: string, changes: { status?: string; dailyBudgetCents?: number }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const results: string[] = [];

  if (changes.status) {
    await syncCampaignStatus(campaignId, changes.status);
    results.push("Status -> " + changes.status);
  }
  if (changes.dailyBudgetCents) {
    await syncCampaignBudget(campaignId, changes.dailyBudgetCents);
    results.push("Budget -> $" + (changes.dailyBudgetCents / 100).toFixed(0) + "/day");
  }

  if (supabaseAdmin) {
    await supabaseAdmin
      .from("meta_campaigns")
      .update({ synced_at: new Date().toISOString() })
      .eq("campaign_id", campaignId);
  }

  await logAudit("campaign", campaignId, "sync_to_meta", null, { changes, results });
  revalidatePath("/admin/campaigns");

  return results;
}
