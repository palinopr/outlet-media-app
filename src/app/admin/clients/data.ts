import { supabaseAdmin } from "@/lib/supabase";
import { clerkClient } from "@clerk/nextjs/server";
import { computeBlendedRoas } from "@/lib/formatters";
import { getClientServices } from "@/lib/client-services";

export type {
  ClientSummary,
  ClientDetail,
  ClientMember,
  ClientCampaign,
  ClientEvent,
  ClientAsset,
  ClientAssetSource,
  ClientServiceRow,
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

  const [clientsRes, campaignsRes, eventsRes, membersRes] = await Promise.all([
    supabaseAdmin.from("clients").select("id, name, slug, status, created_at"),
    supabaseAdmin
      .from("meta_campaigns")
      .select("client_slug, status, spend, roas"),
    supabaseAdmin
      .from("tm_events")
      .select("client_slug")
      .not("client_slug", "is", null),
    supabaseAdmin.from("client_members").select("client_id"),
  ]);

  if (!clientsRes.data?.length) return [];

  const campaignsBySlug: Record<
    string,
    { status: string; spend: number | null; roas: number | null }[]
  > = {};
  for (const c of campaignsRes.data ?? []) {
    const slug = c.client_slug ?? "unknown";
    (campaignsBySlug[slug] ??= []).push(c);
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

  return clientsRes.data.map((client) => {
    const campaigns = campaignsBySlug[client.slug] ?? [];
    const totalSpend = campaigns.reduce(
      (s, c) => s + (c.spend ?? 0) / 100,
      0,
    );
    const totalRevenue = campaigns.reduce(
      (s, c) => s + ((c.spend ?? 0) / 100) * (c.roas ?? 0),
      0,
    );
    const activeCampaigns = campaigns.filter(
      (c) => c.status === "ACTIVE",
    ).length;
    const roas = computeBlendedRoas(campaigns.map(c => ({ spend: c.spend ?? 0, roas: c.roas }))) ?? 0;

    return {
      id: client.id,
      name: client.name,
      slug: client.slug,
      status: client.status,
      memberCount: membersByClientId[client.id] ?? 0,
      activeCampaigns,
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
    .select("id, name, slug, status, created_at")
    .eq("id", clientId)
    .single();

  if (!client) return null;

  const [membersRes, campaignsRes, eventsRes, assetsRes, assetSourcesRes, serviceRows] = await Promise.all([
    supabaseAdmin
      .from("client_members")
      .select("id, clerk_user_id, role, scope, created_at")
      .eq("client_id", clientId),
    supabaseAdmin
      .from("meta_campaigns")
      .select("id, campaign_id, name, status, spend, roas")
      .eq("client_slug", client.slug),
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
    getClientServices(clientId),
  ]);

  const memberRows = membersRes.data ?? [];
  const { campaignsByMember, eventsByMember } = await fetchMemberAssignments(memberRows.map((m) => m.id));
  const members = await enrichMembersWithClerk(memberRows, campaignsByMember, eventsByMember);

  const campaigns: ClientCampaign[] = (campaignsRes.data ?? []).map((c) => ({
    id: c.campaign_id ?? c.id,
    name: c.name,
    status: c.status,
    spend: (c.spend ?? 0) / 100,
    roas: c.roas ?? 0,
  }));

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

  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const totalRevenue = campaigns.reduce((s, c) => s + c.spend * c.roas, 0);
  const activeCampaigns = campaigns.filter(
    (c) => c.status === "ACTIVE",
  ).length;
  const roas = computeBlendedRoas(campaigns) ?? 0;

  return {
    id: client.id,
    name: client.name,
    slug: client.slug,
    status: client.status,
    memberCount: members.length,
    activeCampaigns,
    totalCampaigns: campaigns.length,
    activeShows: events.length,
    totalSpend,
    totalRevenue,
    roas,
    createdAt: client.created_at,
    members,
    campaigns,
    events,
    assets,
    assetSources,
    services: serviceRows,
  };
}
