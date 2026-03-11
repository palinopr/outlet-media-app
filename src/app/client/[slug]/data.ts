import { currentUser } from "@clerk/nextjs/server";
import { createClerkSupabaseClient, supabaseAdmin } from "@/lib/supabase";
import { type DateRange, RANGE_LABELS } from "@/lib/constants";
import { fetchAllCampaigns, type MetaCampaignCard } from "@/lib/meta-campaigns";
import { computeBlendedRoas } from "@/lib/formatters";
import type { ScopeFilter } from "@/lib/member-access";
import type { TmEvent, DemographicsRow, CampaignCard, EventCard, HeroStats, AudienceProfile } from "./types";
import { buildAudienceProfile, buildEventCard, buildTrendData } from "./lib";

export type { DateRange };


export interface ClientData {
  heroStats: HeroStats;
  campaigns: CampaignCard[];
  events: EventCard[];
  audience: AudienceProfile | null;
  dataSource: "meta_api" | "supabase";
  rangeLabel: string;
  trendData: Array<{ date: string; roas: number; spend: number }>;
}

interface GetClientDataOptions {
  includeEvents?: boolean;
}

const EMPTY: ClientData = {
  heroStats: {
    totalSpend: 0,
    blendedRoas: null,
    totalRevenue: null,
    totalImpressions: 0,
    totalClicks: 0,
    activeCampaigns: 0,
    totalCampaigns: 0,
  },
  campaigns: [],
  events: [],
  audience: null,
  dataSource: "supabase",
  rangeLabel: "Last 7 days",
  trendData: [],
};

async function getClientPortalReadClient() {
  if (!supabaseAdmin) return null;

  try {
    const user = await currentUser();
    const role = (user?.publicMetadata as { role?: string } | null)?.role;
    if (role === "admin") {
      return supabaseAdmin;
    }
  } catch {
    return null;
  }

  return (await createClerkSupabaseClient()) ?? null;
}

// --- Map shared MetaCampaignCard to client portal CampaignCard ---

export function toCampaignCard(c: MetaCampaignCard): CampaignCard {
  return {
    campaignId: c.campaignId,
    name: c.name,
    status: c.status,
    spend: c.spend,
    roas: c.roas,
    revenue: c.revenue,
    impressions: c.impressions,
    clicks: c.clicks,
    ctr: c.ctr,
    cpc: c.cpc,
    cpm: c.cpm,
    dailyBudget: c.dailyBudget,
    startTime: c.startTime,
  };
}

// --- Build hero stats ---

function buildHeroStats(campaigns: CampaignCard[]): HeroStats {
  let totalSpend = 0;
  let totalRevenue = 0;
  let totalImpressions = 0;
  let totalClicks = 0;

  for (const c of campaigns) {
    totalSpend += c.spend;
    totalRevenue += c.revenue ?? 0;
    totalImpressions += c.impressions;
    totalClicks += c.clicks;
  }

  const active = campaigns.filter((c) => c.status === "ACTIVE").length;

  return {
    totalSpend,
    blendedRoas: computeBlendedRoas(campaigns),
    totalRevenue: totalRevenue > 0 ? totalRevenue : null,
    totalImpressions,
    totalClicks,
    activeCampaigns: active,
    totalCampaigns: campaigns.length,
  };
}

// --- Build event cards from TM data ---

function buildEventCards(events: TmEvent[]): EventCard[] {
  return events.map(buildEventCard);
}

// --- Campaigns page data (Meta API via shared module + daily insights) ---

export async function getCampaignsPageData(slug: string, scope?: ScopeFilter): Promise<{
  campaigns: CampaignCard[];
  snapshots: Array<{ snapshot_date: string; roas: number | null; spend: number | null; campaign_id: string }>;
  dataSource: "meta_api" | "supabase";
}> {
  const result = await fetchAllCampaigns("30", slug);

  let campaigns = result.campaigns
    .map(toCampaignCard)
    .sort((a, b) => {
      const aTime = a.startTime ? new Date(a.startTime).getTime() : 0;
      const bTime = b.startTime ? new Date(b.startTime).getTime() : 0;
      return bTime - aTime;
    });

  if (scope?.allowedCampaignIds) {
    const allowed = new Set(scope.allowedCampaignIds);
    campaigns = campaigns.filter((c) => allowed.has(c.campaignId));
  }

  const campaignIds = new Set(campaigns.map((c) => c.campaignId));
  const snapshots = result.dailyInsights
    .filter((d) => campaignIds.has(d.campaignId))
    .map((d) => ({
      snapshot_date: d.date,
      roas: d.roas,
      spend: d.spend != null ? Math.round(d.spend * 100) : null,
      campaign_id: d.campaignId,
    }));

  return {
    campaigns,
    snapshots,
    dataSource: result.error ? "supabase" : "meta_api",
  };
}

// --- Events page data ---

export interface EventsPageData {
  events: EventCard[];
  totalEvents: number;
  onSaleCount: number;
  totalTicketsSold: number;
}

export async function getEventsPageData(
  slug: string,
  scope?: ScopeFilter,
): Promise<EventsPageData> {
  const db = await getClientPortalReadClient();

  let query = db
    ?.from("tm_events")
    .select("*")
    .eq("client_slug", slug)
    .order("date", { ascending: true });

  if (scope?.allowedEventIds && query) {
    query = query.in("id", scope.allowedEventIds);
  }

  const res = query ? await query : { data: null };
  const tmEvents = (res.data ?? []) as TmEvent[];
  const events = buildEventCards(tmEvents);

  const onSaleCount = events.filter(
    (e) => e.status.toLowerCase().replace(/_/g, "") === "onsale",
  ).length;

  const totalTicketsSold = events.reduce((sum, e) => sum + e.ticketsSold, 0);

  return {
    events,
    totalEvents: events.length,
    onSaleCount,
    totalTicketsSold,
  };
}

// --- Main data function ---

export async function getData(
  slug: string,
  range: DateRange,
  scope?: ScopeFilter,
  options: GetClientDataOptions = {},
): Promise<ClientData> {
  const db = await getClientPortalReadClient();
  const includeEvents = options.includeEvents ?? true;

  // Build events query (independent of Meta API)
  let eventsQuery = includeEvents
    ? db
        ?.from("tm_events")
        .select("*")
        .eq("client_slug", slug)
        .order("date", { ascending: true })
        .limit(50)
    : null;

  if (scope?.allowedEventIds && eventsQuery) {
    eventsQuery = eventsQuery.in("id", scope.allowedEventIds);
  }

  // Fetch campaigns (Meta API) and events (Supabase) in parallel
  const [result, eventsRes] = await Promise.all([
    fetchAllCampaigns(range, slug),
    eventsQuery ? eventsQuery : Promise.resolve({ data: null }),
  ]);

  let campaigns = result.campaigns.map(toCampaignCard);

  if (scope?.allowedCampaignIds) {
    const allowed = new Set(scope.allowedCampaignIds);
    campaigns = campaigns.filter((c) => allowed.has(c.campaignId));
  }

  if (campaigns.length === 0 && result.error) return EMPTY;

  const allowedCampaignIds = new Set(campaigns.map((campaign) => campaign.campaignId));
  const trendData = buildTrendData(
    result.dailyInsights
      .filter((row) => allowedCampaignIds.has(row.campaignId))
      .map((row) => ({
        snapshot_date: row.date,
        roas: row.roas,
        spend: row.spend != null ? Math.round(row.spend * 100) : null,
      })),
  );

  const dataSource = result.error ? "supabase" : "meta_api";
  const tmEvents = includeEvents ? ((eventsRes.data ?? []) as TmEvent[]) : [];
  const events = buildEventCards(tmEvents);

  // Demographics depend on event tm_ids
  let audience: AudienceProfile | null = null;
  if (includeEvents && tmEvents.length > 0 && db) {
    const tmIds = tmEvents.map((e) => e.tm_id);
    const { data: demoRows } = await db
      .from("tm_event_demographics")
      .select("*")
      .in("tm_id", tmIds);
    if (demoRows && demoRows.length > 0) {
      audience = buildAudienceProfile(demoRows as DemographicsRow[]);
    }
  }

  return {
    heroStats: buildHeroStats(campaigns),
    campaigns,
    events,
    audience,
    dataSource,
    rangeLabel: RANGE_LABELS[range],
    trendData,
  };
}
