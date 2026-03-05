"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import { clerkClient } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { adminGuard } from "@/lib/api-helpers";
import {
  CreateClientSchema,
  UpdateClientSchema,
  AddClientMemberSchema,
  RemoveClientMemberSchema,
  ChangeClientMemberRoleSchema,
} from "@/lib/api-schemas";
import { toggleClientService, seedClientServices } from "@/lib/client-services";
import { SERVICE_KEYS, type ServiceKey } from "@/lib/service-registry";
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

// ─── Bulk deactivate clients ─────────────────────────────────────────────────

const BulkDeactivateClientsSchema = z.object({
  clientIds: z.array(z.string().min(1)).min(1),
});

export async function bulkDeactivateClients(formData: { clientIds: string[] }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = BulkDeactivateClientsSchema.parse(formData);
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { error } = await supabaseAdmin
    .from("clients")
    .update({ status: "inactive" })
    .in("id", parsed.clientIds);

  if (error) throw new Error(error.message);

  await logAudit("client", "bulk", "bulk_deactivate", null, {
    count: parsed.clientIds.length,
  });
  revalidatePath("/admin/clients");
  return { success: true };
}

// ─── Create client ──────────────────────────────────────────────────────────

export async function createClient(formData: { name: string; slug: string; services?: string[] }) {
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

  // Seed services if provided
  const serviceKeys = (formData.services ?? []).filter((k): k is ServiceKey =>
    SERVICE_KEYS.includes(k as ServiceKey),
  );
  if (serviceKeys.length > 0) {
    await seedClientServices(data.id, serviceKeys);
  }

  await logAudit("client", data.id, "create", null, {
    name: parsed.name,
    slug: parsed.slug,
    services: serviceKeys,
  });
  revalidatePath("/admin/clients");
  return data;
}

// --- Toggle service ---

const ToggleServiceSchema = z.object({
  clientId: z.string().min(1),
  serviceKey: z.string().min(1),
  enabled: z.boolean(),
  config: z.record(z.string(), z.unknown()).optional(),
});

export async function toggleService(formData: {
  clientId: string;
  serviceKey: string;
  enabled: boolean;
  config?: Record<string, unknown>;
}) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = ToggleServiceSchema.parse(formData);
  if (!SERVICE_KEYS.includes(parsed.serviceKey as ServiceKey)) {
    throw new Error(`Invalid service key: ${parsed.serviceKey}`);
  }

  await toggleClientService(
    parsed.clientId,
    parsed.serviceKey,
    parsed.enabled,
    parsed.config,
  );

  await logAudit("client_service", parsed.clientId, "toggle", null, {
    serviceKey: parsed.serviceKey,
    enabled: parsed.enabled,
  });
  revalidatePath("/admin/clients");
}

// ─── Update client ──────────────────────────────────────────────────────────

export async function updateClient(formData: { clientId: string; name?: string; slug?: string; status?: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = UpdateClientSchema.parse(formData);
  const { clientId, ...updates } = parsed;

  const { error } = await supabaseAdmin
    .from("clients")
    .update(updates)
    .eq("id", clientId);

  if (error) throw new Error(error.message);

  await logAudit("client", clientId, "update", null, updates);
  revalidatePath("/admin/clients");
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
  revalidatePath("/admin/clients");
  revalidatePath("/admin/users");
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
  revalidatePath("/admin/clients");
  revalidatePath("/admin/users");
}

// ─── Change member role ─────────────────────────────────────────────────────

export async function changeClientMemberRole(formData: { memberId: string; role: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = ChangeClientMemberRoleSchema.parse(formData);

  const { error } = await supabaseAdmin
    .from("client_members")
    .update({ role: parsed.role })
    .eq("id", parsed.memberId);

  if (error) throw new Error(error.message);

  await logAudit("client_member", parsed.memberId, "change_role", null, { role: parsed.role });
  revalidatePath("/admin/clients");
}

// ─── Change member scope ────────────────────────────────────────────────────

export async function changeClientMemberScope(formData: { memberId: string; scope: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const scope = formData.scope;
  if (scope !== "all" && scope !== "assigned") throw new Error("Invalid scope");

  const { error } = await supabaseAdmin
    .from("client_members")
    .update({ scope })
    .eq("id", formData.memberId);

  if (error) throw new Error(error.message);

  await logAudit("client_member", formData.memberId, "change_scope", null, { scope });
  revalidatePath("/admin/clients");
}

// ─── Update member campaign assignments ─────────────────────────────────────

export async function updateMemberCampaigns(formData: { memberId: string; campaignIds: string[] }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

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
  revalidatePath("/admin/clients");
}

// ─── Update member event assignments ────────────────────────────────────────

export async function updateMemberEvents(formData: { memberId: string; eventIds: string[] }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

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
  revalidatePath("/admin/clients");
}
