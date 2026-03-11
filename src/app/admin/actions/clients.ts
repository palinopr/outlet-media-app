"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import { clerkClient } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { listEffectiveCampaignRowsForClientSlug } from "@/lib/campaign-client-assignment";
import { adminGuard } from "@/lib/api-helpers";
import {
  CreateClientSchema,
  UpdateClientSchema,
  AddClientMemberSchema,
  RemoveClientMemberSchema,
  ChangeClientMemberRoleSchema,
} from "@/lib/api-schemas";
import { logAudit } from "./audit";
import { revalidateAccessManagementPaths } from "@/features/access/revalidation";

const RenameClientSchema = z.object({
  oldSlug: z.string().min(1),
  newSlug: z.string().min(1).regex(/^[a-z0-9_]+$/),
});

async function getClientAccessContextById(clientId: string) {
  if (!supabaseAdmin) return null;

  const { data } = await supabaseAdmin
    .from("clients")
    .select("id, slug")
    .eq("id", clientId)
    .single();

  if (!data) return null;

  return {
    clientId: data.id as string,
    clientSlug: data.slug as string,
  };
}

async function getClientAccessContextByMemberId(memberId: string) {
  if (!supabaseAdmin) return null;

  const { data: member } = await supabaseAdmin
    .from("client_members")
    .select("client_id")
    .eq("id", memberId)
    .single();

  if (!member?.client_id) return null;
  return getClientAccessContextById(member.client_id as string);
}

const CLIENT_SLUG_REFERENCE_TABLES = [
  "ad_assets",
  "approval_requests",
  "asset_comments",
  "asset_follow_up_items",
  "asset_sources",
  "campaign_action_items",
  "campaign_client_overrides",
  "campaign_comments",
  "client_accounts",
  "crm_comments",
  "crm_contacts",
  "crm_follow_up_items",
  "email_events",
  "email_reply_examples",
  "event_comments",
  "event_follow_up_items",
  "meta_campaigns",
  "notifications",
  "system_events",
  "tm_events",
  "workspace_pages",
  "workspace_tasks",
] as const;

async function revalidateClientSlugSurfaces(
  oldSlug: string,
  newSlug: string,
  clientId: string,
) {
  revalidateAccessManagementPaths({
    clientId,
    clientSlug: newSlug,
  });
  revalidatePath("/admin/activity");
  revalidatePath("/admin/assets");
  revalidatePath("/admin/campaigns");
  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/admin/conversations");
  revalidatePath("/admin/crm");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/events");
  revalidatePath("/admin/notifications");
  revalidatePath("/admin/reports");
  revalidatePath("/admin/workspace", "layout");
  revalidatePath("/admin/workspace/tasks");
  revalidatePath(`/client/${oldSlug}`, "layout");
  revalidatePath(`/client/${newSlug}`, "layout");
}

async function renameClientSlugReferences(oldSlug: string, newSlug: string) {
  if (!supabaseAdmin) throw new Error("DB not configured");

  for (const table of CLIENT_SLUG_REFERENCE_TABLES) {
    const { error } = await supabaseAdmin
      .from(table as never)
      .update({ client_slug: newSlug } as never)
      .eq("client_slug", oldSlug);

    if (error) throw new Error(error.message);
  }
}

async function pauseCampaignsForClientSlug(slug: string) {
  if (!supabaseAdmin) throw new Error("DB not configured");

  const campaigns = await listEffectiveCampaignRowsForClientSlug<{
    campaign_id: string;
    client_slug: string | null;
    status: string | null;
  }>("campaign_id, client_slug, status", slug);

  const activeCampaignIds = campaigns
    .filter((campaign) => campaign.status === "ACTIVE")
    .map((campaign) => campaign.campaign_id);

  if (activeCampaignIds.length === 0) {
    return 0;
  }

  const { error } = await supabaseAdmin
    .from("meta_campaigns")
    .update({ status: "PAUSED", updated_at: new Date().toISOString() })
    .in("campaign_id", activeCampaignIds);

  if (error) throw new Error(error.message);
  return activeCampaignIds.length;
}

export async function renameClient(formData: { oldSlug: string; newSlug: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = RenameClientSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");
  if (parsed.oldSlug === parsed.newSlug) return;

  const { data: client, error: clientError } = await supabaseAdmin
    .from("clients")
    .select("id, slug")
    .eq("slug", parsed.oldSlug)
    .single();
  if (clientError) throw new Error(clientError.message);

  const { error: updateClientError } = await supabaseAdmin
    .from("clients")
    .update({ slug: parsed.newSlug })
    .eq("id", client.id);
  if (updateClientError) throw new Error(updateClientError.message);

  await renameClientSlugReferences(parsed.oldSlug, parsed.newSlug);

  await logAudit("client", parsed.oldSlug, "rename", { slug: parsed.oldSlug }, { slug: parsed.newSlug });
  await revalidateClientSlugSurfaces(parsed.oldSlug, parsed.newSlug, client.id as string);
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
    .from("clients")
    .update({ status: "inactive" })
    .eq("slug", parsed.slug);

  if (error) throw new Error(error.message);

  const pausedCampaigns = await pauseCampaignsForClientSlug(parsed.slug);

  await logAudit("client", parsed.slug, "deactivate", null, {
    paused_active_campaigns: pausedCampaigns,
  });
  revalidateAccessManagementPaths();
  revalidatePath("/admin/clients");
  revalidatePath("/admin/campaigns");
}

// ─── Bulk deactivate clients ─────────────────────────────────────────────────

const BulkDeactivateClientsSchema = z.object({
  clientIds: z.array(z.string().min(1)).min(1),
});

export async function bulkDeactivateClients(formData: { clientIds: string[] }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = BulkDeactivateClientsSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { data: clientsRes, error: clientsError } = await supabaseAdmin
    .from("clients")
    .select("slug")
    .in("id", parsed.clientIds);

  if (clientsError) throw new Error(clientsError.message);

  const { error } = await supabaseAdmin
    .from("clients")
    .update({ status: "inactive" })
    .in("id", parsed.clientIds);

  if (error) throw new Error(error.message);

  for (const client of clientsRes ?? []) {
    if (typeof client.slug === "string" && client.slug.length > 0) {
      await pauseCampaignsForClientSlug(client.slug);
    }
  }

  await logAudit("client", "bulk", "bulk_deactivate", null, {
    count: parsed.clientIds.length,
  });
  revalidateAccessManagementPaths();
  return { success: true };
}

// ─── Create client ──────────────────────────────────────────────────────────

export async function createClient(formData: { name: string; slug: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = CreateClientSchema.parse(formData);

  const { data, error } = await supabaseAdmin
    .from("clients")
    .insert({ name: parsed.name, slug: parsed.slug })
    .select("id, slug")
    .single();

  if (error) {
    if (error.code === "23505") throw new Error("A client with this slug already exists");
    throw new Error(error.message);
  }

  await logAudit("client", data.id, "create", null, {
    name: parsed.name,
    slug: parsed.slug,
  });
  revalidateAccessManagementPaths({
    clientId: data.id,
    clientSlug: data.slug,
  });
  return data;
}

// ─── Update client ──────────────────────────────────────────────────────────

export async function updateClient(formData: {
  clientId: string;
  eventsEnabled?: boolean;
  name?: string;
  slug?: string;
  status?: string;
}) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = UpdateClientSchema.parse(formData);
  const { clientId, eventsEnabled, ...updates } = parsed;
  const dbUpdates = {
    ...updates,
    ...(eventsEnabled === undefined ? {} : { events_enabled: eventsEnabled }),
  };

  const { error } = await supabaseAdmin
    .from("clients")
    .update(dbUpdates)
    .eq("id", clientId);

  if (error) throw new Error(error.message);

  await logAudit("client", clientId, "update", null, parsed);
  const accessContext = await getClientAccessContextById(clientId);
  revalidateAccessManagementPaths(accessContext ?? {});
}

// ─── Add member to client ───────────────────────────────────────────────────

export async function addClientMember(formData: { clientId: string; clerkUserId: string; role?: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = AddClientMemberSchema.parse(formData);

  // Get the client slug for Clerk metadata
  const { data: client } = await supabaseAdmin
    .from("clients")
    .select("slug")
    .eq("id", parsed.clientId)
    .single();

  if (!client) throw new Error("Client not found");

  // Insert member row
  const { error } = await supabaseAdmin
    .from("client_members")
    .insert({
      client_id: parsed.clientId,
      clerk_user_id: parsed.clerkUserId,
      role: parsed.role,
    });

  if (error) {
    if (error.code === "23505") throw new Error("User is already a member of this client");
    throw new Error(error.message);
  }

  // Set client_slug in Clerk metadata (only if user has no existing slug)
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(parsed.clerkUserId);
  const existingMeta = (user.publicMetadata ?? {}) as Record<string, unknown>;
  if (!existingMeta.client_slug) {
    await clerk.users.updateUserMetadata(parsed.clerkUserId, {
      publicMetadata: { ...existingMeta, client_slug: client.slug },
    });
  }

  await logAudit("client_member", parsed.clerkUserId, "add", null, {
    clientId: parsed.clientId,
    role: parsed.role,
  });
  revalidateAccessManagementPaths({
    clientId: parsed.clientId,
    clientSlug: client.slug,
  });
}

// ─── Remove member from client ──────────────────────────────────────────────

export async function removeClientMember(formData: { clientId: string; memberId: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = RemoveClientMemberSchema.parse(formData);

  // Get member info before deletion (for Clerk cleanup)
  const { data: member } = await supabaseAdmin
    .from("client_members")
    .select("clerk_user_id")
    .eq("id", parsed.memberId)
    .eq("client_id", parsed.clientId)
    .single();

  if (!member) throw new Error("Member not found");

  const { error } = await supabaseAdmin
    .from("client_members")
    .delete()
    .eq("id", parsed.memberId);

  if (error) throw new Error(error.message);

  // Check if user has other client memberships
  const { data: otherMemberships } = await supabaseAdmin
    .from("client_members")
    .select("id")
    .eq("clerk_user_id", member.clerk_user_id)
    .limit(1);

  // If no other memberships, clear client_slug from Clerk
  if (!otherMemberships?.length) {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(member.clerk_user_id);
    const existingMeta = (user.publicMetadata ?? {}) as Record<string, unknown>;
    delete existingMeta.client_slug;
    await clerk.users.updateUserMetadata(member.clerk_user_id, {
      publicMetadata: existingMeta,
    });
  }

  await logAudit("client_member", parsed.memberId, "remove", { clerkUserId: member.clerk_user_id }, null);
  const accessContext = await getClientAccessContextById(parsed.clientId);
  revalidateAccessManagementPaths(accessContext ?? {});
}

// ─── Change member role ─────────────────────────────────────────────────────

export async function changeClientMemberRole(formData: { memberId: string; role: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = ChangeClientMemberRoleSchema.parse(formData);
  const accessContext = await getClientAccessContextByMemberId(parsed.memberId);

  const { error } = await supabaseAdmin
    .from("client_members")
    .update({ role: parsed.role })
    .eq("id", parsed.memberId);

  if (error) throw new Error(error.message);

  await logAudit("client_member", parsed.memberId, "change_role", null, { role: parsed.role });
  revalidateAccessManagementPaths(accessContext ?? {});
}

// ─── Change member scope ────────────────────────────────────────────────────

export async function changeClientMemberScope(formData: { memberId: string; scope: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const scope = formData.scope;
  if (scope !== "all" && scope !== "assigned") throw new Error("Invalid scope");
  const accessContext = await getClientAccessContextByMemberId(formData.memberId);

  const { error } = await supabaseAdmin
    .from("client_members")
    .update({ scope })
    .eq("id", formData.memberId);

  if (error) throw new Error(error.message);

  await logAudit("client_member", formData.memberId, "change_scope", null, { scope });
  revalidateAccessManagementPaths(accessContext ?? {});
}

// ─── Update member campaign assignments ─────────────────────────────────────

export async function updateMemberCampaigns(formData: { memberId: string; campaignIds: string[] }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");
  const accessContext = await getClientAccessContextByMemberId(formData.memberId);

  // Delete existing assignments
  await supabaseAdmin
    .from("client_member_campaigns")
    .delete()
    .eq("member_id", formData.memberId);

  // Insert new assignments
  if (formData.campaignIds.length > 0) {
    const rows = formData.campaignIds.map((campaign_id) => ({
      member_id: formData.memberId,
      campaign_id,
    }));
    const { error } = await supabaseAdmin
      .from("client_member_campaigns")
      .insert(rows);
    if (error) throw new Error(error.message);
  }

  await logAudit("client_member", formData.memberId, "update_campaigns", null, {
    count: formData.campaignIds.length,
  });
  revalidateAccessManagementPaths(accessContext ?? {});
}

// ─── Update member event assignments ────────────────────────────────────────

export async function updateMemberEvents(formData: { memberId: string; eventIds: string[] }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");
  const accessContext = await getClientAccessContextByMemberId(formData.memberId);

  // Delete existing assignments
  await supabaseAdmin
    .from("client_member_events")
    .delete()
    .eq("member_id", formData.memberId);

  // Insert new assignments
  if (formData.eventIds.length > 0) {
    const rows = formData.eventIds.map((event_id) => ({
      member_id: formData.memberId,
      event_id,
    }));
    const { error } = await supabaseAdmin
      .from("client_member_events")
      .insert(rows);
    if (error) throw new Error(error.message);
  }

  await logAudit("client_member", formData.memberId, "update_events", null, {
    count: formData.eventIds.length,
  });
  revalidateAccessManagementPaths(accessContext ?? {});
}
