import { supabaseAdmin } from "@/lib/supabase";
import { clerkClient } from "@clerk/nextjs/server";
import { computeBlendedRoas } from "@/lib/formatters";

export interface ClientSummary {
  id: string;
  name: string;
  slug: string;
  status: string;
  memberCount: number;
  activeCampaigns: number;
  totalCampaigns: number;
  activeShows: number;
  totalSpend: number;
  totalRevenue: number;
  roas: number;
  createdAt: string;
}

export interface ClientDetail extends ClientSummary {
  members: ClientMember[];
  campaigns: ClientCampaign[];
  events: ClientEvent[];
}

export interface ClientMember {
  id: string;
  clerkUserId: string;
  role: string;
  scope: string;
  name: string;
  email: string;
  createdAt: string;
  assignedCampaignIds: string[];
  assignedEventIds: string[];
}

export interface ClientEvent {
  id: string;
  name: string;
  venue: string;
  date: string;
  status: string;
}

export interface ClientCampaign {
  id: string;
  name: string;
  status: string;
  spend: number;
  roas: number;
}

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
    const roas = computeBlendedRoas(campaigns.map(c => ({ spend: (c.spend ?? 0) / 100, roas: c.roas ?? null }))) ?? 0;

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

  const [membersRes, campaignsRes, eventsRes] = await Promise.all([
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
  ]);

  const memberRows = membersRes.data ?? [];

  // Fetch assignments for all members in parallel
  const memberIds = memberRows.map((m) => m.id);
  const [assignedCampaignsRes, assignedEventsRes] = memberIds.length > 0
    ? await Promise.all([
        supabaseAdmin
          .from("client_member_campaigns")
          .select("member_id, campaign_id")
          .in("member_id", memberIds),
        supabaseAdmin
          .from("client_member_events")
          .select("member_id, event_id")
          .in("member_id", memberIds),
      ])
    : [{ data: [] }, { data: [] }];

  // Group assignments by member
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

  const clerk = await clerkClient();
  const members: ClientMember[] = await Promise.all(
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
        // Clerk user deleted or unreachable -- use fallbacks
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
  };
}
