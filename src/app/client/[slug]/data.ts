import { supabaseAdmin } from "@/lib/supabase";
import { type DateRange, RANGE_LABELS } from "@/lib/constants";
import { fetchAllCampaigns, type MetaCampaignCard } from "@/lib/meta-campaigns";
import type { TmEvent, DemographicsRow, CampaignCard, EventCard, HeroStats, AudienceProfile } from "./types";
import { buildAudienceProfile } from "./lib";

export type { DateRange };


export interface ClientData {
  heroStats: HeroStats;
  campaigns: CampaignCard[];
  events: EventCard[];
  audience: AudienceProfile | null;
  dataSource: "meta_api" | "supabase";
  rangeLabel: string;
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
    spendDelta: null,
  },
  campaigns: [],
  events: [],
  audience: null,
  dataSource: "supabase",
  rangeLabel: "Last 7 days",
};

// --- Map shared MetaCampaignCard to client portal CampaignCard ---

function toCampaignCard(c: MetaCampaignCard): CampaignCard {
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
  let weightedRoas = 0;
  let spendWithRoas = 0;

  for (const c of campaigns) {
    totalSpend += c.spend;
    totalRevenue += c.revenue ?? 0;
    totalImpressions += c.impressions;
    totalClicks += c.clicks;
    if (c.roas != null && c.spend > 0) {
      weightedRoas += c.roas * c.spend;
      spendWithRoas += c.spend;
    }
  }

  const blendedRoas = spendWithRoas > 0 ? weightedRoas / spendWithRoas : null;
  const active = campaigns.filter((c) => c.status === "ACTIVE").length;

  return {
    totalSpend,
    blendedRoas,
    totalRevenue: totalRevenue > 0 ? totalRevenue : null,
    totalImpressions,
    totalClicks,
    activeCampaigns: active,
    totalCampaigns: campaigns.length,
    spendDelta: null,
  };
}

// --- Build event cards from TM data ---

function buildEventCards(events: TmEvent[]): EventCard[] {
  return events.map((e) => {
    const sold = e.tickets_sold ?? 0;
    const available = e.tickets_available;
    const cap = available != null ? sold + available : null;
    const sellThrough = cap != null && cap > 0 ? Math.round((sold / cap) * 100) : null;

    return {
      id: e.id,
      name: e.name,
      venue: e.venue,
      city: e.city ?? "",
      date: e.date,
      status: e.status,
      ticketsSold: sold,
      ticketsAvailable: available,
      sellThrough,
      avgTicketPrice: e.avg_ticket_price != null ? Number(e.avg_ticket_price) : null,
      potentialRevenue: e.potential_revenue,
      gross: e.gross,
    };
  });
}

// --- Campaigns page data (Meta API via shared module + daily insights) ---

export async function getCampaignsPageData(slug: string): Promise<{
  campaigns: CampaignCard[];
  snapshots: Array<{ snapshot_date: string; roas: number | null; spend: number | null; campaign_id: string }>;
  dataSource: "meta_api" | "supabase";
}> {
  const result = await fetchAllCampaigns("30", slug);

  const campaigns = result.campaigns
    .map(toCampaignCard)
    .sort((a, b) => {
      const aTime = a.startTime ? new Date(a.startTime).getTime() : 0;
      const bTime = b.startTime ? new Date(b.startTime).getTime() : 0;
      return bTime - aTime;
    });

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

// --- Main data function ---

export async function getData(
  slug: string,
  range: DateRange,
): Promise<ClientData> {
  const result = await fetchAllCampaigns(range, slug);

  const campaigns = result.campaigns
    .map(toCampaignCard);

  if (campaigns.length === 0 && result.error) return EMPTY;

  const dataSource = result.error ? "supabase" : "meta_api";

  // TM events (still from Supabase)
  const eventsRes = supabaseAdmin
    ? await supabaseAdmin
        .from("tm_events")
        .select("*")
        .eq("client_slug", slug)
        .order("date", { ascending: true })
        .limit(50)
    : { data: null };

  const tmEvents = (eventsRes.data ?? []) as TmEvent[];
  const events = buildEventCards(tmEvents);

  // Demographics
  let audience: AudienceProfile | null = null;
  if (tmEvents.length > 0 && supabaseAdmin) {
    const tmIds = tmEvents.map((e) => e.tm_id);
    const { data: demoRows } = await supabaseAdmin
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
  };
}
