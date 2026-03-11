import { supabaseAdmin } from "@/lib/supabase";
import {
  applyEffectiveCampaignClientSlugs,
  listEffectiveCampaignRowsForClientSlug,
} from "@/lib/campaign-client-assignment";
import { clerkClient } from "@clerk/nextjs/server";
import { centsToUsd, computeBlendedRoas } from "@/lib/formatters";
import { getClientServices } from "@/lib/client-services";
import { buildClientWorkflowHealth } from "@/features/clients/summary";
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
  ClientEvent,
  ClientAsset,
  ClientAssetSource,
} from "./types";

import type {
  ClientSummary,
  ClientDetail,
  ClientMember,
  ClientCampaign,
  ClientEvent,
  ClientAsset,
  ClientAssetSource,
} from "./types";

// ─── Summaries ──────────────────────────────────────────────────────────────

export async function getClientSummaries(): Promise<ClientSummary[]> {
  if (!supabaseAdmin) return [];

  const [
    clientsRes,
    campaignsRes,
    eventsRes,
    membersRes,
    approvalsRes,
    actionItemsRes,
    assetsRes,
    connectedAccountsRes,
    campaignDiscussionsRes,
    crmDiscussionsRes,
    assetDiscussionsRes,
    eventDiscussionsRes,
  ] = await Promise.all([
    supabaseAdmin.from("clients").select("id, name, slug, status, created_at"),
    supabaseAdmin
      .from("meta_campaigns")
      .select("campaign_id, client_slug, name, status, spend, roas"),
    supabaseAdmin
      .from("tm_events")
      .select("client_slug")
      .not("client_slug", "is", null),
    supabaseAdmin.from("client_members").select("client_id"),
    supabaseAdmin
      .from("approval_requests")
      .select("client_slug, entity_type, entity_id, metadata")
      .eq("status", "pending"),
    supabaseAdmin
      .from("campaign_action_items")
      .select("campaign_id, status")
      .neq("status", "done"),
    supabaseAdmin
      .from("ad_assets")
      .select("client_slug, status")
      .in("status", ["new", "labeled"]),
    supabaseAdmin
      .from("client_accounts")
      .select(
        "id, client_slug, ad_account_id, ad_account_name, status, connected_at, token_expires_at, last_used_at",
      ),
    supabaseAdmin
      .from("campaign_comments")
      .select("campaign_id")
      .eq("resolved", false)
      .is("parent_comment_id", null),
    supabaseAdmin
      .from("crm_comments" as never)
      .select("client_slug")
      .eq("resolved", false)
      .is("parent_comment_id", null),
    supabaseAdmin
      .from("asset_comments" as never)
      .select("client_slug")
      .eq("resolved", false)
      .is("parent_comment_id", null),
    supabaseAdmin
      .from("event_comments" as never)
      .select("client_slug")
      .eq("resolved", false)
      .is("parent_comment_id", null),
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
  for (const c of effectiveCampaignRows) {
    const slug = c.client_slug ?? "unknown";
    (campaignsBySlug[slug] ??= []).push({
      campaignId: c.campaign_id,
      status: c.status ?? "unknown",
      spend: c.spend ?? null,
      roas: c.roas ?? null,
    });
  }

  const campaignIdsBySlug = new Map<string, Set<string>>();
  for (const [slug, campaigns] of Object.entries(campaignsBySlug)) {
    campaignIdsBySlug.set(
      slug,
      new Set(campaigns.map((campaign) => campaign.campaignId)),
    );
  }

  const showsBySlug: Record<string, number> = {};
  for (const e of eventsRes.data ?? []) {
    const slug = e.client_slug as string;
    showsBySlug[slug] = (showsBySlug[slug] ?? 0) + 1;
  }

  const membersByClientId: Record<string, number> = {};
  for (const m of membersRes.data ?? []) {
    membersByClientId[m.client_id] = (membersByClientId[m.client_id] ?? 0) + 1;
  }

  const pendingApprovalsBySlug: Record<string, number> = {};
  for (const row of approvalsRes.data ?? []) {
    const approvalClientSlug = (row.client_slug as string | null) ?? null;
    const entityType = (row.entity_type as string | null) ?? null;
    const entityId = (row.entity_id as string | null) ?? null;
    const metadata =
      typeof row.metadata === "object" && row.metadata !== null
        ? (row.metadata as Record<string, unknown>)
        : {};
    const campaignId =
      entityType === "campaign"
        ? entityId
        : typeof metadata.campaignId === "string"
          ? metadata.campaignId
          : null;

    if (campaignId) {
      for (const [slug, campaignIds] of campaignIdsBySlug) {
        if (!campaignIds.has(campaignId)) continue;
        pendingApprovalsBySlug[slug] = (pendingApprovalsBySlug[slug] ?? 0) + 1;
      }
      continue;
    }

    const slug = approvalClientSlug ?? "unknown";
    pendingApprovalsBySlug[slug] = (pendingApprovalsBySlug[slug] ?? 0) + 1;
  }

  const openActionItemsBySlug: Record<string, number> = {};
  for (const row of actionItemsRes.data ?? []) {
    const campaignId = (row.campaign_id as string | null) ?? null;
    if (!campaignId) continue;

    for (const [slug, campaignIds] of campaignIdsBySlug) {
      if (!campaignIds.has(campaignId)) continue;
      openActionItemsBySlug[slug] = (openActionItemsBySlug[slug] ?? 0) + 1;
    }
  }

  const assetsNeedingReviewBySlug: Record<string, number> = {};
  for (const row of assetsRes.data ?? []) {
    const slug = (row.client_slug as string | null) ?? "unknown";
    assetsNeedingReviewBySlug[slug] = (assetsNeedingReviewBySlug[slug] ?? 0) + 1;
  }

  const openDiscussionsBySlug: Record<string, number> = {};
  for (const row of campaignDiscussionsRes.data ?? []) {
    const campaignId = (row as { campaign_id?: string | null }).campaign_id ?? null;
    if (!campaignId) continue;

    for (const [slug, campaignIds] of campaignIdsBySlug) {
      if (!campaignIds.has(campaignId)) continue;
      openDiscussionsBySlug[slug] = (openDiscussionsBySlug[slug] ?? 0) + 1;
    }
  }

  for (const dataset of [
    crmDiscussionsRes.data ?? [],
    assetDiscussionsRes.data ?? [],
    eventDiscussionsRes.data ?? [],
  ]) {
    for (const row of dataset) {
      const record = row as { client_slug?: string | null };
      const slug = record.client_slug ?? "unknown";
      openDiscussionsBySlug[slug] = (openDiscussionsBySlug[slug] ?? 0) + 1;
    }
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
      (s, c) => s + (centsToUsd(c.spend ?? 0) as number),
      0,
    );
    const totalRevenue = campaigns.reduce(
      (s, c) => s + (centsToUsd(c.spend ?? 0) as number) * (c.roas ?? 0),
      0,
    );
    const activeCampaigns = campaigns.filter(
      (c) => c.status === "ACTIVE",
    ).length;
    const roas = computeBlendedRoas(campaigns.map(c => ({ spend: c.spend ?? 0, roas: c.roas }))) ?? 0;
    const connectionSummary = buildConnectedAccountsSummary(
      connectedAccountsBySlug.get(client.slug) ?? [],
    );
    const attention = buildClientWorkflowHealth({
      assetsNeedingReview: assetsNeedingReviewBySlug[client.slug] ?? 0,
      openActionItems: openActionItemsBySlug[client.slug] ?? 0,
      openDiscussions: openDiscussionsBySlug[client.slug] ?? 0,
      pendingApprovals: pendingApprovalsBySlug[client.slug] ?? 0,
    });

    return {
      assetsNeedingReview: attention.assetsNeedingReview,
      connectedAccountCount: connectionSummary.totalCount,
      connectionRiskAccounts: connectionSummary.attentionCount,
      id: client.id,
      name: client.name,
      slug: client.slug,
      status: client.status,
      memberCount: membersByClientId[client.id] ?? 0,
      needsAttention: attention.needsAttention,
      activeCampaigns,
      openActionItems: attention.openActionItems,
      openDiscussions: attention.openDiscussions,
      pendingApprovals: attention.pendingApprovals,
      totalCampaigns: campaigns.length,
      activeShows: showsBySlug[client.slug] ?? 0,
      totalSpend,
      totalRevenue,
      roas,
      createdAt: client.created_at,
    };
  });
}

// ─── Detail ─────────────────────────────────────────────────────────────────

async function fetchMemberAssignments(memberIds: string[]) {
  if (memberIds.length === 0) {
    return { campaignsByMember: new Map<string, string[]>(), eventsByMember: new Map<string, string[]>() };
  }

  const [assignedCampaignsRes, assignedEventsRes] = await Promise.all([
    supabaseAdmin!
      .from("client_member_campaigns")
      .select("member_id, campaign_id")
      .in("member_id", memberIds),
    supabaseAdmin!
      .from("client_member_events")
      .select("member_id, event_id")
      .in("member_id", memberIds),
  ]);

  const campaignsByMember = new Map<string, string[]>();
  for (const row of assignedCampaignsRes.data ?? []) {
    const list = campaignsByMember.get(row.member_id) ?? [];
    list.push(row.campaign_id);
    campaignsByMember.set(row.member_id, list);
  }

  const eventsByMember = new Map<string, string[]>();
  for (const row of assignedEventsRes.data ?? []) {
    const list = eventsByMember.get(row.member_id) ?? [];
    list.push(row.event_id);
    eventsByMember.set(row.member_id, list);
  }

  return { campaignsByMember, eventsByMember };
}

async function enrichMembersWithClerk(
  memberRows: { id: string; clerk_user_id: string; role: string; scope: string; created_at: string }[],
  campaignsByMember: Map<string, string[]>,
  eventsByMember: Map<string, string[]>,
): Promise<ClientMember[]> {
  const clerk = await clerkClient();
  return Promise.all(
    memberRows.map(async (m) => {
      let name = "Unknown user";
      let email = "";
      try {
        const user = await clerk.users.getUser(m.clerk_user_id);
        name =
          [user.firstName, user.lastName].filter(Boolean).join(" ") ||
          "Unknown user";
        email = user.emailAddresses?.[0]?.emailAddress ?? "";
      } catch {
        // Clerk user deleted or unreachable
      }
      return {
        id: m.id,
        clerkUserId: m.clerk_user_id,
        role: m.role,
        scope: m.scope,
        name,
        email,
        createdAt: m.created_at,
        assignedCampaignIds: campaignsByMember.get(m.id) ?? [],
        assignedEventIds: eventsByMember.get(m.id) ?? [],
      };
    }),
  );
}

export async function getClientDetail(
  clientId: string,
): Promise<ClientDetail | null> {
  if (!supabaseAdmin) return null;

  const { data: client } = await supabaseAdmin
    .from("clients")
    .select("id, name, slug, status, created_at, events_enabled")
    .eq("id", clientId)
    .single();

  if (!client) return null;

  const [
    membersRes,
    campaignsRes,
    eventsRes,
    assetsRes,
    assetSourcesRes,
    connectedAccountsRes,
    serviceRows,
    approvalsRes,
    actionItemsRes,
    campaignDiscussionsRes,
    crmDiscussionsRes,
    assetDiscussionsRes,
    eventDiscussionsRes,
    pendingInvites,
  ] = await Promise.all([
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
      .from("tm_events")
      .select("id, name, venue, date, status")
      .eq("client_slug", client.slug)
      .order("date", { ascending: true }),
    supabaseAdmin
      .from("ad_assets")
      .select("id, file_name, public_url, media_type, placement, format, labels, status, created_at")
      .eq("client_slug", client.slug)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("asset_sources")
      .select("id, provider, folder_url, folder_name, last_synced_at, file_count")
      .eq("client_slug", client.slug)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("client_accounts")
      .select(
        "id, client_slug, ad_account_id, ad_account_name, status, connected_at, token_expires_at, last_used_at",
      )
      .eq("client_slug", client.slug)
      .order("connected_at", { ascending: false }),
    getClientServices(clientId),
    supabaseAdmin
      .from("approval_requests")
      .select("id, client_slug, entity_type, entity_id, metadata")
      .eq("status", "pending"),
    supabaseAdmin
      .from("campaign_action_items")
      .select("id, campaign_id")
      .neq("status", "done"),
    supabaseAdmin
      .from("campaign_comments")
      .select("id, campaign_id")
      .eq("resolved", false)
      .is("parent_comment_id", null),
    supabaseAdmin
      .from("crm_comments" as never)
      .select("id")
      .eq("client_slug", client.slug)
      .eq("resolved", false)
      .is("parent_comment_id", null),
    supabaseAdmin
      .from("asset_comments" as never)
      .select("id")
      .eq("client_slug", client.slug)
      .eq("resolved", false)
      .is("parent_comment_id", null),
    supabaseAdmin
      .from("event_comments" as never)
      .select("id")
      .eq("client_slug", client.slug)
      .eq("resolved", false)
      .is("parent_comment_id", null),
    listActionableInvitations({ clientSlug: client.slug }),
  ]);

  const memberRows = membersRes.data ?? [];
  const { campaignsByMember, eventsByMember } = await fetchMemberAssignments(memberRows.map((m) => m.id));
  const members = await enrichMembersWithClerk(memberRows, campaignsByMember, eventsByMember);

  const campaigns: ClientCampaign[] = campaignsRes.map((c) => ({
    id: c.campaign_id ?? c.id,
    name: c.name ?? c.campaign_id ?? c.id,
    status: c.status ?? "unknown",
    spend: centsToUsd(c.spend ?? 0) as number,
    roas: c.roas ?? 0,
  }));
  const clientCampaignIds = new Set(campaigns.map((campaign) => campaign.id));

  const events: ClientEvent[] = (eventsRes.data ?? []).map((e) => ({
    id: e.id,
    name: e.name,
    venue: e.venue,
    date: e.date,
    status: e.status,
  }));

  const assets: ClientAsset[] = (assetsRes.data ?? []).map((a) => ({
    id: a.id,
    fileName: a.file_name,
    publicUrl: a.public_url,
    mediaType: a.media_type,
    placement: a.placement,
    format: a.format,
    labels: a.labels ?? [],
    status: a.status,
    createdAt: a.created_at,
  }));

  const assetSources: ClientAssetSource[] = (assetSourcesRes.data ?? []).map((s) => ({
    id: s.id,
    provider: s.provider,
    folderUrl: s.folder_url,
    folderName: s.folder_name,
    lastSyncedAt: s.last_synced_at,
    fileCount: s.file_count,
  }));

  const connectedAccounts: ConnectedAccount[] = ((connectedAccountsRes.data ?? []) as ConnectedAccount[]);
  const connectionSummary = buildConnectedAccountsSummary(connectedAccounts);

  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const totalRevenue = campaigns.reduce((s, c) => s + c.spend * c.roas, 0);
  const activeCampaigns = campaigns.filter(
    (c) => c.status === "ACTIVE",
  ).length;
  const roas = computeBlendedRoas(campaigns) ?? 0;
  const attention = buildClientWorkflowHealth({
    assetsNeedingReview: assets.filter((asset) => asset.status === "new" || asset.status === "labeled").length,
    openActionItems: ((actionItemsRes.data ?? []) as Array<{ campaign_id: string | null }>)
      .filter((row) => row.campaign_id && clientCampaignIds.has(row.campaign_id))
      .length,
    openDiscussions:
      ((campaignDiscussionsRes.data ?? []) as Array<{ campaign_id: string | null }>)
        .filter((row) => row.campaign_id && clientCampaignIds.has(row.campaign_id))
        .length +
      ((crmDiscussionsRes.data ?? []) as unknown[]).length +
      ((assetDiscussionsRes.data ?? []) as unknown[]).length +
      ((eventDiscussionsRes.data ?? []) as unknown[]).length,
    pendingApprovals: ((approvalsRes.data ?? []) as Array<Record<string, unknown>>)
      .filter((row) => {
        const approvalClientSlug = (row.client_slug as string | null) ?? null;
        const entityType = (row.entity_type as string | null) ?? null;
        const entityId = (row.entity_id as string | null) ?? null;
        const metadata =
          typeof row.metadata === "object" && row.metadata !== null
            ? (row.metadata as Record<string, unknown>)
            : {};
        const campaignId =
          entityType === "campaign"
            ? entityId
            : typeof metadata.campaignId === "string"
              ? metadata.campaignId
              : null;

        if (campaignId) {
          return clientCampaignIds.has(campaignId);
        }

        return approvalClientSlug === client.slug;
      })
      .length,
  });

  return {
    assetsNeedingReview: attention.assetsNeedingReview,
    connectedAccountCount: connectionSummary.totalCount,
    connectionRiskAccounts: connectionSummary.attentionCount,
    id: client.id,
    name: client.name,
    slug: client.slug,
    status: client.status,
    memberCount: members.length,
    pendingInvites,
    needsAttention: attention.needsAttention,
    activeCampaigns,
    openActionItems: attention.openActionItems,
    openDiscussions: attention.openDiscussions,
    pendingApprovals: attention.pendingApprovals,
    totalCampaigns: campaigns.length,
    activeShows: events.length,
    totalSpend,
    totalRevenue,
    roas,
    createdAt: client.created_at,
    members,
    connectedAccounts,
    campaigns,
    eventsEnabled: client.events_enabled ?? false,
    events,
    assets,
    assetSources,
    services: serviceRows,
  };
}
