"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import { currentUser } from "@clerk/nextjs/server";
import {
  getCampaignRevalidationPaths,
  revalidateCampaignPaths as revalidateCampaignRoutePaths,
} from "@/features/campaigns/revalidation";
import {
  applyEffectiveCampaignClientSlugs,
  getEffectiveCampaignRowById,
} from "@/lib/campaign-client-assignment";
import { supabaseAdmin } from "@/lib/supabase";
import { adminGuard } from "@/lib/api-helpers";
import { centsToUsd } from "@/lib/formatters";
import { logAudit } from "./audit";
import { syncCampaignStatus, syncCampaignBudget } from "./meta-sync";
import { logSystemEvent } from "@/features/system-events/server";

function eventVisibility(clientSlug: string | null | undefined) {
  return clientSlug ? "shared" : "admin_only";
}

function centsLabel(value: number | null | undefined) {
  if (typeof value !== "number") return "unknown budget";
  return `$${(centsToUsd(value) as number).toFixed(0)}/day`;
}

function revalidateCampaignSurfaces(
  campaignId: string,
  clientSlugs: Array<string | null | undefined>,
) {
  const uniqueClientSlugs = [...new Set(clientSlugs)];
  for (const clientSlug of uniqueClientSlugs) {
    revalidateCampaignRoutePaths(getCampaignRevalidationPaths(clientSlug, campaignId));
  }
}

async function revalidateClientAccountPaths(clientSlugs: Array<string | null | undefined>) {
  if (!supabaseAdmin) return;

  const uniqueClientSlugs = [...new Set(clientSlugs.filter((value): value is string => Boolean(value)))];
  if (uniqueClientSlugs.length === 0) return;

  const { data, error } = await supabaseAdmin
    .from("clients")
    .select("id, slug")
    .in("slug", uniqueClientSlugs);

  if (error) throw new Error(error.message);

  for (const client of data ?? []) {
    revalidatePath(`/admin/clients/${client.id}`);
  }
}

async function getAssignableClientBySlug(clientSlug: string) {
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { data, error } = await supabaseAdmin
    .from("clients")
    .select("id, slug, status")
    .eq("slug", clientSlug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Client not found. Create the client before assigning campaigns.");
  if (data.status !== "active") throw new Error("Client is inactive. Reactivate it before assigning campaigns.");

  return data;
}

async function upsertCampaignClientOverrides(campaignIds: string[], clientSlug: string) {
  if (!supabaseAdmin) throw new Error("DB not configured");

  const now = new Date().toISOString();
  for (const campaignId of campaignIds) {
    const { error } = await supabaseAdmin
      .from("campaign_client_overrides")
      .upsert(
        { campaign_id: campaignId, client_slug: clientSlug, updated_at: now },
        { onConflict: "campaign_id" },
      );

    if (error) throw new Error(error.message);
  }
}

async function syncCampaignLinkedClientSlug(
  campaignIds: string[],
  clientSlug: string,
  previousClientSlugs: Array<string | null | undefined>,
) {
  if (!supabaseAdmin) throw new Error("DB not configured");

  const campaignIdSet = new Set(campaignIds.filter(Boolean));
  if (campaignIdSet.size === 0) return;

  const previousSlugs = [
    ...new Set(
      previousClientSlugs.filter(
        (value): value is string => Boolean(value) && value !== clientSlug,
      ),
    ),
  ];
  if (previousSlugs.length === 0) return;

  const { data, error } = await supabaseAdmin
    .from("system_events")
    .select("id, entity_type, entity_id, metadata")
    .in("client_slug", previousSlugs);

  if (error) throw new Error(error.message);

  const systemEventIds = ((data ?? []) as Record<string, unknown>[])
    .filter((row) => {
      const entityType = typeof row.entity_type === "string" ? row.entity_type : null;
      const entityId = typeof row.entity_id === "string" ? row.entity_id : null;
      const metadata =
        typeof row.metadata === "object" && row.metadata !== null
          ? (row.metadata as Record<string, unknown>)
          : {};
      const metadataCampaignId =
        typeof metadata.campaignId === "string" ? metadata.campaignId : null;

      return (
        (entityType === "campaign" && entityId != null && campaignIdSet.has(entityId)) ||
        (metadataCampaignId != null && campaignIdSet.has(metadataCampaignId))
      );
    })
    .map((row) => String(row.id));

  if (systemEventIds.length === 0) return;

  const updateRes = await supabaseAdmin
    .from("system_events")
    .update({ client_slug: clientSlug })
    .in("id", systemEventIds);

  if (updateRes.error) throw new Error(updateRes.error.message);
}

const UpdateStatusSchema = z.object({
  campaignId: z.string().min(1),
  status: z.enum(["ACTIVE", "PAUSED"]),
});

export async function updateCampaignStatus(formData: { campaignId: string; status: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = UpdateStatusSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const { data: old } = await supabaseAdmin
    .from("meta_campaigns")
    .select("client_slug, name, status")
    .eq("campaign_id", parsed.campaignId)
    .single();

  const { error } = await supabaseAdmin
    .from("meta_campaigns")
    .update({ status: parsed.status, updated_at: new Date().toISOString() })
    .eq("campaign_id", parsed.campaignId);

  if (error) throw new Error(error.message);

  await logAudit("campaign", parsed.campaignId, "update_status", { status: old?.status }, { status: parsed.status });
  await logSystemEvent({
    eventName: "campaign_updated",
    actorId: user.id,
    clientSlug: old?.client_slug ?? null,
    visibility: eventVisibility(old?.client_slug),
    entityType: "campaign",
    entityId: parsed.campaignId,
    summary: `Set campaign "${old?.name ?? parsed.campaignId}" to ${parsed.status}`,
    detail: old?.status ? `Previously ${old.status}.` : null,
    metadata: {
      field: "status",
      from: old?.status ?? null,
      to: parsed.status,
    },
  });
  revalidateCampaignSurfaces(parsed.campaignId, [old?.client_slug]);
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
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const { data: old } = await supabaseAdmin
    .from("meta_campaigns")
    .select("campaign_type, client_slug, name")
    .eq("campaign_id", parsed.campaignId)
    .single();

  const { error } = await supabaseAdmin
    .from("meta_campaigns")
    .update({ campaign_type: parsed.campaignType, updated_at: new Date().toISOString() })
    .eq("campaign_id", parsed.campaignId);

  if (error) throw new Error(error.message);

  await logAudit("campaign", parsed.campaignId, "update_type", { campaign_type: old?.campaign_type }, { campaign_type: parsed.campaignType });
  await logSystemEvent({
    eventName: "campaign_updated",
    actorId: user.id,
    clientSlug: old?.client_slug ?? null,
    visibility: eventVisibility(old?.client_slug),
    entityType: "campaign",
    entityId: parsed.campaignId,
    summary: `Changed campaign type for "${old?.name ?? parsed.campaignId}"`,
    detail: `Set type to ${parsed.campaignType}.`,
    metadata: {
      field: "campaign_type",
      from: old?.campaign_type ?? null,
      to: parsed.campaignType,
    },
  });
  revalidateCampaignSurfaces(parsed.campaignId, [old?.client_slug]);
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
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const { data: old } = await supabaseAdmin
    .from("meta_campaigns")
    .select("client_slug, daily_budget, name")
    .eq("campaign_id", parsed.campaignId)
    .single();

  const { error } = await supabaseAdmin
    .from("meta_campaigns")
    .update({ daily_budget: parsed.dailyBudgetCents, updated_at: new Date().toISOString() })
    .eq("campaign_id", parsed.campaignId);

  if (error) throw new Error(error.message);

  await logAudit("campaign", parsed.campaignId, "update_budget", { daily_budget: old?.daily_budget }, { daily_budget: parsed.dailyBudgetCents });
  await logSystemEvent({
    eventName: "campaign_updated",
    actorId: user.id,
    clientSlug: old?.client_slug ?? null,
    visibility: eventVisibility(old?.client_slug),
    entityType: "campaign",
    entityId: parsed.campaignId,
    summary: `Updated budget for "${old?.name ?? parsed.campaignId}"`,
    detail: `${centsLabel(old?.daily_budget)} -> ${centsLabel(parsed.dailyBudgetCents)}`,
    metadata: {
      field: "daily_budget",
      from: old?.daily_budget ?? null,
      to: parsed.dailyBudgetCents,
    },
  });
  revalidateCampaignSurfaces(parsed.campaignId, [old?.client_slug]);
}

const ClientSlugAssignmentSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9_]+$/)
  .refine((slug) => slug !== "unknown", "Select an active client account");

const AssignClientSchema = z.object({
  campaignId: z.string().min(1),
  clientSlug: ClientSlugAssignmentSchema,
});

export async function assignCampaignClient(formData: { campaignId: string; clientSlug: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = AssignClientSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const targetClient = await getAssignableClientBySlug(parsed.clientSlug);

  const old = await getEffectiveCampaignRowById<{
    campaign_id: string;
    client_slug: string | null;
    name: string | null;
  }>(parsed.campaignId, "campaign_id, client_slug, name");

  await upsertCampaignClientOverrides([parsed.campaignId], parsed.clientSlug);
  await syncCampaignLinkedClientSlug(
    [parsed.campaignId],
    parsed.clientSlug,
    [old?.client_slug],
  );

  await logAudit("campaign", parsed.campaignId, "assign_client", { client_slug: old?.client_slug }, { client_slug: parsed.clientSlug });
  await logSystemEvent({
    eventName: "campaign_updated",
    actorId: user.id,
    clientSlug: parsed.clientSlug,
    visibility: "shared",
    entityType: "campaign",
    entityId: parsed.campaignId,
    summary: `Assigned campaign "${old?.name ?? parsed.campaignId}" to ${parsed.clientSlug}`,
    detail: old?.client_slug ? `Previously assigned to ${old.client_slug}.` : null,
    metadata: {
      field: "client_slug",
      from: old?.client_slug ?? null,
      to: parsed.clientSlug,
    },
  });
  revalidateCampaignSurfaces(parsed.campaignId, [old?.client_slug, parsed.clientSlug]);
  revalidatePath("/admin/campaigns");
  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${targetClient.id}`);
  await revalidateClientAccountPaths([old?.client_slug, parsed.clientSlug]);
}

const BulkAssignSchema = z.object({
  campaignIds: z.array(z.string().min(1)).min(1),
  clientSlug: ClientSlugAssignmentSchema,
});

export async function bulkAssignClient(formData: { campaignIds: string[]; clientSlug: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = BulkAssignSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  await getAssignableClientBySlug(parsed.clientSlug);

  const { data: existingCampaignRows, error: existingCampaignRowsError } = await supabaseAdmin
    .from("meta_campaigns")
    .select("campaign_id, client_slug, name")
    .in("campaign_id", parsed.campaignIds);

  if (existingCampaignRowsError) throw new Error(existingCampaignRowsError.message);

  const oldEffectiveCampaignRows = await applyEffectiveCampaignClientSlugs(
    (existingCampaignRows ?? []) as Array<{
      campaign_id: string;
      client_slug: string | null;
      name: string | null;
    }>,
  );
  const oldClientSlugs = oldEffectiveCampaignRows.map((row) => row.client_slug);

  await upsertCampaignClientOverrides(parsed.campaignIds, parsed.clientSlug);
  await syncCampaignLinkedClientSlug(
    parsed.campaignIds,
    parsed.clientSlug,
    oldClientSlugs,
  );

  await logAudit("campaign", "bulk", "bulk_assign_client", null, {
    count: parsed.campaignIds.length,
    client_slug: parsed.clientSlug,
  });
  await logSystemEvent({
    eventName: "campaign_updated",
    actorId: user.id,
    clientSlug: parsed.clientSlug,
    visibility: "shared",
    entityType: "campaign_batch",
    entityId: "bulk",
    summary: `Assigned ${parsed.campaignIds.length} campaign${parsed.campaignIds.length === 1 ? "" : "s"} to ${parsed.clientSlug}`,
    metadata: {
      campaignIds: parsed.campaignIds,
      count: parsed.campaignIds.length,
    },
  });

  for (const campaignId of parsed.campaignIds) {
    revalidateCampaignSurfaces(campaignId, [...oldClientSlugs, parsed.clientSlug]);
  }
  revalidatePath("/admin/campaigns");
  revalidatePath("/admin/clients");
  await revalidateClientAccountPaths([...oldClientSlugs, parsed.clientSlug]);
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
    results.push("Budget -> $" + (centsToUsd(changes.dailyBudgetCents) as number).toFixed(0) + "/day");
  }

  if (supabaseAdmin) {
    await supabaseAdmin
      .from("meta_campaigns")
      .update({ synced_at: new Date().toISOString() })
      .eq("campaign_id", campaignId);
  }

  await logAudit("campaign", campaignId, "sync_to_meta", null, { changes, results });
  revalidateCampaignSurfaces(campaignId, [null]);

  return results;
}
