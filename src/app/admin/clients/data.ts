import { clerkClient } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  applyEffectiveCampaignClientSlugs,
  listEffectiveCampaignRowsForClientSlug,
} from "@/lib/campaign-client-assignment";
import { centsToUsd, computeBlendedRoas } from "@/lib/formatters";
import { listActionableInvitations } from "@/features/invitations/server";
import {
  buildConnectedAccountsSummary,
  type ConnectedAccount,
} from "@/features/settings/connected-accounts";

export type {
  ClientSummary,
  ClientDetail,
  ClientMember,
  ClientCampaign,
} from "./types";

import type {
  ClientSummary,
  ClientDetail,
  ClientMember,
  ClientCampaign,
} from "./types";

export async function getClientSummaries(): Promise<ClientSummary[]> {
  if (!supabaseAdmin) return [];

  const [clientsRes, campaignsRes, membersRes, connectedAccountsRes] = await Promise.all([
    supabaseAdmin.from("clients").select("id, name, slug, status, created_at"),
    supabaseAdmin
      .from("meta_campaigns")
      .select("campaign_id, client_slug, name, status, spend, roas"),
    supabaseAdmin.from("client_members").select("client_id"),
    supabaseAdmin
      .from("client_accounts")
      .select(
        "id, client_slug, ad_account_id, ad_account_name, status, connected_at, token_expires_at, last_used_at",
      ),
  ]);

  if (!clientsRes.data?.length) return [];

  const effectiveCampaignRows = await applyEffectiveCampaignClientSlugs(
    (campaignsRes.data ?? []) as Array<{
      campaign_id: string;
      client_slug: string | null;
      name: string | null;
      status: string | null;
      spend: number | null;
      roas: number | null;
    }>,
  );

  const campaignsBySlug: Record<
    string,
    { campaignId: string; status: string; spend: number | null; roas: number | null }[]
  > = {};
  for (const campaign of effectiveCampaignRows) {
    const slug = campaign.client_slug ?? "unknown";
    (campaignsBySlug[slug] ??= []).push({
      campaignId: campaign.campaign_id,
      status: campaign.status ?? "unknown",
      spend: campaign.spend ?? null,
      roas: campaign.roas ?? null,
    });
  }

  const membersByClientId: Record<string, number> = {};
  for (const member of membersRes.data ?? []) {
    membersByClientId[member.client_id] = (membersByClientId[member.client_id] ?? 0) + 1;
  }

  const connectedAccountsBySlug = new Map<string, ConnectedAccount[]>();
  for (const row of (connectedAccountsRes.data ?? []) as ConnectedAccount[]) {
    const slug = row.client_slug ?? "unknown";
    const accounts = connectedAccountsBySlug.get(slug) ?? [];
    accounts.push(row);
    connectedAccountsBySlug.set(slug, accounts);
  }

  return clientsRes.data.map((client) => {
    const campaigns = campaignsBySlug[client.slug] ?? [];
    const totalSpend = campaigns.reduce(
      (sum, campaign) => sum + (centsToUsd(campaign.spend ?? 0) as number),
      0,
    );
    const totalRevenue = campaigns.reduce(
      (sum, campaign) => sum + (centsToUsd(campaign.spend ?? 0) as number) * (campaign.roas ?? 0),
      0,
    );
    const activeCampaigns = campaigns.filter((campaign) => campaign.status === "ACTIVE").length;
    const roas = computeBlendedRoas(campaigns.map((campaign) => ({
      spend: campaign.spend ?? 0,
      roas: campaign.roas,
    }))) ?? 0;
    const connectionSummary = buildConnectedAccountsSummary(
      connectedAccountsBySlug.get(client.slug) ?? [],
    );

    return {
      connectedAccountCount: connectionSummary.totalCount,
      connectionRiskAccounts: connectionSummary.attentionCount,
      id: client.id,
      name: client.name,
      slug: client.slug,
      status: client.status,
      memberCount: membersByClientId[client.id] ?? 0,
      needsAttention: connectionSummary.attentionCount,
      activeCampaigns,
      totalCampaigns: campaigns.length,
      totalSpend,
      totalRevenue,
      roas,
      createdAt: client.created_at,
    };
  });
}

async function fetchMemberAssignments(memberIds: string[]) {
  if (memberIds.length === 0) {
    return { campaignsByMember: new Map<string, string[]>() };
  }

  const assignedCampaignsRes = await supabaseAdmin!
    .from("client_member_campaigns")
    .select("member_id, campaign_id")
    .in("member_id", memberIds);

  const campaignsByMember = new Map<string, string[]>();
  for (const row of assignedCampaignsRes.data ?? []) {
    const list = campaignsByMember.get(row.member_id) ?? [];
    list.push(row.campaign_id);
    campaignsByMember.set(row.member_id, list);
  }

  return { campaignsByMember };
}

async function enrichMembersWithClerk(
  memberRows: { id: string; clerk_user_id: string; role: string; scope: string; created_at: string }[],
  campaignsByMember: Map<string, string[]>,
): Promise<ClientMember[]> {
  const clerk = await clerkClient();
  return Promise.all(
    memberRows.map(async (member) => {
      let name = "Unknown user";
      let email = "";
      try {
        const user = await clerk.users.getUser(member.clerk_user_id);
        name = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Unknown user";
        email = user.emailAddresses?.[0]?.emailAddress ?? "";
      } catch {
        // Clerk user deleted or unreachable.
      }
      return {
        id: member.id,
        clerkUserId: member.clerk_user_id,
        role: member.role,
        scope: member.scope,
        name,
        email,
        createdAt: member.created_at,
        assignedCampaignIds: campaignsByMember.get(member.id) ?? [],
      };
    }),
  );
}

export async function getClientDetail(clientId: string): Promise<ClientDetail | null> {
  if (!supabaseAdmin) return null;

  const { data: client } = await supabaseAdmin
    .from("clients")
    .select("id, name, slug, status, created_at, portal_brand_name, portal_logo_url, portal_logo_alt")
    .eq("id", clientId)
    .single();

  if (!client) return null;

  const [membersRes, campaignsRes, connectedAccountsRes, pendingInvites] = await Promise.all([
    supabaseAdmin
      .from("client_members")
      .select("id, clerk_user_id, role, scope, created_at")
      .eq("client_id", clientId),
    listEffectiveCampaignRowsForClientSlug<{
      id: string;
      campaign_id: string;
      name: string | null;
      status: string | null;
      spend: number | null;
      roas: number | null;
      client_slug: string | null;
    }>("id, campaign_id, name, status, spend, roas, client_slug", client.slug),
    supabaseAdmin
      .from("client_accounts")
      .select(
        "id, client_slug, ad_account_id, ad_account_name, status, connected_at, token_expires_at, last_used_at",
      )
      .eq("client_slug", client.slug)
      .order("connected_at", { ascending: false }),
    listActionableInvitations({ clientSlug: client.slug }),
  ]);

  const memberRows = membersRes.data ?? [];
  const { campaignsByMember } = await fetchMemberAssignments(memberRows.map((member) => member.id));
  const members = await enrichMembersWithClerk(memberRows, campaignsByMember);

  const campaigns: ClientCampaign[] = campaignsRes.map((campaign) => ({
    id: campaign.campaign_id ?? campaign.id,
    name: campaign.name ?? campaign.campaign_id ?? campaign.id,
    status: campaign.status ?? "unknown",
    spend: centsToUsd(campaign.spend ?? 0) as number,
    roas: campaign.roas ?? 0,
  }));

  const connectedAccounts = (connectedAccountsRes.data ?? []) as ConnectedAccount[];
  const connectionSummary = buildConnectedAccountsSummary(connectedAccounts);
  const totalSpend = campaigns.reduce((sum, campaign) => sum + campaign.spend, 0);
  const totalRevenue = campaigns.reduce((sum, campaign) => sum + campaign.spend * campaign.roas, 0);
  const activeCampaigns = campaigns.filter((campaign) => campaign.status === "ACTIVE").length;
  const roas = computeBlendedRoas(campaigns) ?? 0;

  return {
    connectedAccountCount: connectionSummary.totalCount,
    connectionRiskAccounts: connectionSummary.attentionCount,
    id: client.id,
    name: client.name,
    slug: client.slug,
    status: client.status,
    memberCount: members.length,
    pendingInvites,
    needsAttention: connectionSummary.attentionCount,
    activeCampaigns,
    totalCampaigns: campaigns.length,
    totalSpend,
    totalRevenue,
    roas,
    createdAt: client.created_at,
    brandName: client.portal_brand_name ?? null,
    logoAlt: client.portal_logo_alt ?? null,
    logoUrl: client.portal_logo_url ?? null,
    members,
    campaigns,
  };
}
