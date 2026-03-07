"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import { currentUser } from "@clerk/nextjs/server";
import {
  getCampaignWorkflowPaths,
  revalidateWorkflowPaths,
} from "@/features/workflow/revalidation";
import {
  applyEffectiveCampaignClientSlugs,
  getEffectiveCampaignRowById,
} from "@/lib/campaign-client-assignment";
import { supabaseAdmin } from "@/lib/supabase";
import { adminGuard } from "@/lib/api-helpers";
import { logAudit } from "./audit";
import { syncCampaignStatus, syncCampaignBudget } from "./meta-sync";
import { logSystemEvent } from "@/features/system-events/server";
import {
  approvalMatchesCampaignOwnership,
  notificationMatchesCampaignOwnership,
  systemEventMatchesCampaignOwnership,
} from "@/features/campaigns/ownership-sync";

function eventVisibility(clientSlug: string | null | undefined) {
  return clientSlug ? "shared" : "admin_only";
}

function centsLabel(value: number | null | undefined) {
  if (typeof value !== "number") return "unknown budget";
  return `$${(value / 100).toFixed(0)}/day`;
}

function revalidateCampaignPaths(
  campaignId: string,
  clientSlugs: Array<string | null | undefined>,
) {
  const uniqueClientSlugs = [...new Set(clientSlugs)];
  for (const clientSlug of uniqueClientSlugs) {
    revalidateWorkflowPaths(getCampaignWorkflowPaths(clientSlug, campaignId));
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

async function ensureClientExists(clientSlug: string) {
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { data: existing } = await supabaseAdmin
    .from("clients")
    .select("id")
    .eq("slug", clientSlug)
    .maybeSingle();

  if (existing) return;

  const name = clientSlug
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const { error } = await supabaseAdmin
    .from("clients")
    .insert({ name, slug: clientSlug, status: "active" });

  if (error) throw new Error(error.message);
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

  const uniqueCampaignIds = [...new Set(campaignIds.filter(Boolean))];
  if (uniqueCampaignIds.length === 0) return;

  const previousSlugs = [
    ...new Set(
      previousClientSlugs.filter(
        (value): value is string => Boolean(value) && value !== clientSlug,
      ),
    ),
  ];

  const [commentRowsRes, actionItemRowsRes] = await Promise.all([
    supabaseAdmin
      .from("campaign_comments")
      .select("id")
      .in("campaign_id", uniqueCampaignIds),
    supabaseAdmin
      .from("campaign_action_items")
      .select("id")
      .in("campaign_id", uniqueCampaignIds),
  ]);

  if (commentRowsRes.error) throw new Error(commentRowsRes.error.message);
  if (actionItemRowsRes.error) throw new Error(actionItemRowsRes.error.message);

  const campaignCommentIds = new Set(
    ((commentRowsRes.data ?? []) as Array<{ id: string | null }>)
      .map((row) => row.id)
      .filter((value): value is string => Boolean(value)),
  );
  const campaignActionItemIds = new Set(
    ((actionItemRowsRes.data ?? []) as Array<{ id: string | null }>)
      .map((row) => row.id)
      .filter((value): value is string => Boolean(value)),
  );
  const campaignIdSet = new Set(uniqueCampaignIds);

  const approvalRowsQuery = supabaseAdmin
    .from("approval_requests")
    .select("id, entity_type, entity_id, metadata");
  const approvalRows =
    previousSlugs.length > 0
      ? approvalRowsQuery.in("client_slug", previousSlugs)
      : approvalRowsQuery.limit(0);

  const { data: approvalRowsData, error: approvalRowsError } = await approvalRows;
  if (approvalRowsError) throw new Error(approvalRowsError.message);

  const approvalIds = new Set(
    ((approvalRowsData ?? []) as Record<string, unknown>[])
      .filter((row) => approvalMatchesCampaignOwnership(row, campaignIdSet))
      .map((row) => String(row.id)),
  );

  const updates: PromiseLike<{ error: { message: string } | null }>[] = [
    supabaseAdmin
      .from("campaign_comments")
      .update({ client_slug: clientSlug })
      .in("campaign_id", uniqueCampaignIds),
    supabaseAdmin
      .from("campaign_action_items")
      .update({ client_slug: clientSlug })
      .in("campaign_id", uniqueCampaignIds),
  ];

  if (approvalIds.size > 0) {
    updates.push(
      supabaseAdmin
        .from("approval_requests")
        .update({ client_slug: clientSlug })
        .in("id", [...approvalIds]),
    );
  }

  const updateResults = await Promise.all(updates);
  for (const result of updateResults) {
    if (result.error) throw new Error(result.error.message);
  }

  if (previousSlugs.length === 0) return;

  const [notificationRowsRes, systemEventRowsRes] = await Promise.all([
    supabaseAdmin
      .from("notifications" as never)
      .select("id, entity_type, entity_id")
      .in("client_slug", previousSlugs),
    supabaseAdmin
      .from("system_events")
      .select("id, entity_type, entity_id, metadata")
      .in("client_slug", previousSlugs),
  ]);

  if (notificationRowsRes.error) throw new Error(notificationRowsRes.error.message);
  if (systemEventRowsRes.error) throw new Error(systemEventRowsRes.error.message);

  const linkedEntities = {
    approvalIds,
    campaignActionItemIds,
    campaignCommentIds,
    campaignIds: campaignIdSet,
  };

  const notificationIds = ((notificationRowsRes.data ?? []) as Record<string, unknown>[])
    .filter((row) => notificationMatchesCampaignOwnership(row, linkedEntities))
    .map((row) => String(row.id));
  const systemEventIds = ((systemEventRowsRes.data ?? []) as Record<string, unknown>[])
    .filter((row) => systemEventMatchesCampaignOwnership(row, linkedEntities))
    .map((row) => String(row.id));

  const linkedUpdates: PromiseLike<{ error: { message: string } | null }>[] = [];

  if (notificationIds.length > 0) {
    linkedUpdates.push(
      supabaseAdmin
        .from("notifications" as never)
        .update({ client_slug: clientSlug } as never)
        .in("id", notificationIds),
    );
  }

  if (systemEventIds.length > 0) {
    linkedUpdates.push(
      supabaseAdmin
        .from("system_events")
        .update({ client_slug: clientSlug })
        .in("id", systemEventIds),
    );
  }

  const linkedResults = await Promise.all(linkedUpdates);
  for (const result of linkedResults) {
    if (result.error) throw new Error(result.error.message);
  }
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
  revalidateCampaignPaths(parsed.campaignId, [old?.client_slug]);
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
  revalidateCampaignPaths(parsed.campaignId, [old?.client_slug]);
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
  revalidateCampaignPaths(parsed.campaignId, [old?.client_slug]);
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
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  await ensureClientExists(parsed.clientSlug);

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
  revalidateCampaignPaths(parsed.campaignId, [old?.client_slug, parsed.clientSlug]);
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
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  await ensureClientExists(parsed.clientSlug);

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
    revalidateCampaignPaths(campaignId, [...oldClientSlugs, parsed.clientSlug]);
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
    results.push("Budget -> $" + (changes.dailyBudgetCents / 100).toFixed(0) + "/day");
  }

  if (supabaseAdmin) {
    await supabaseAdmin
      .from("meta_campaigns")
      .update({ synced_at: new Date().toISOString() })
      .eq("campaign_id", campaignId);
  }

  await logAudit("campaign", campaignId, "sync_to_meta", null, { changes, results });
  revalidateCampaignPaths(campaignId, [null]);

  return results;
}
