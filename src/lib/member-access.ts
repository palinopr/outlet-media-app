import { cache } from "react";
import { supabaseAdmin } from "./supabase";

export interface ScopeFilter {
  allowedCampaignIds: string[] | null;
}

export interface MemberAccess {
  memberId: string;
  clientId: string;
  clientSlug: string;
  clientName: string;
  role: string;
  scope: "all" | "assigned";
}

export interface ScopedAccess extends MemberAccess {
  allowedCampaignIds: string[] | null;
}

export async function getMemberships(clerkUserId: string): Promise<MemberAccess[]> {
  if (!supabaseAdmin) return [];

  const { data } = await supabaseAdmin
    .from("client_members")
    .select("id, client_id, role, scope, clients(slug, name)")
    .eq("clerk_user_id", clerkUserId);

  if (!data?.length) return [];

  return data.flatMap((row) => {
    const client = row.clients as unknown as { slug: string; name: string } | null;
    if (!client) return [];
    return [{
      memberId: row.id,
      clientId: row.client_id,
      clientSlug: client.slug,
      clientName: client.name,
      role: row.role,
      scope: row.scope as "all" | "assigned",
    }];
  });
}

export const getMemberAccessForSlug = cache(async function getMemberAccessForSlug(
  clerkUserId: string,
  slug: string,
): Promise<ScopedAccess | null> {
  if (!supabaseAdmin) return null;

  const { data: client } = await supabaseAdmin
    .from("clients")
    .select("id, slug, name")
    .eq("slug", slug)
    .single();

  if (!client) return null;

  const { data: row } = await supabaseAdmin
    .from("client_members")
    .select("id, client_id, role, scope")
    .eq("clerk_user_id", clerkUserId)
    .eq("client_id", client.id)
    .single();

  if (!row) return null;

  const access: ScopedAccess = {
    memberId: row.id,
    clientId: row.client_id,
    clientSlug: client.slug,
    clientName: client.name,
    role: row.role,
    scope: row.scope as "all" | "assigned",
    allowedCampaignIds: null,
  };

  if (access.scope === "assigned") {
    const campaignsRes = await supabaseAdmin
      .from("client_member_campaigns")
      .select("campaign_id")
      .eq("member_id", access.memberId);

    access.allowedCampaignIds = (campaignsRes.data ?? []).map((campaign) => campaign.campaign_id);
  }

  return access;
});
