import { supabaseAdmin } from "@/lib/supabase";
import { fetchAllCampaigns } from "@/lib/meta-campaigns";
import type { ScopeFilter } from "@/lib/member-access";
import type { CampaignCard, EventCard, TmEvent } from "../types";
import { toCampaignCard } from "../data";
import { buildEventCard } from "../lib";

export interface ReportsSummary {
  totalSpend: number;
  totalRevenue: number;
  blendedRoas: number | null;
  totalImpressions: number;
  totalClicks: number;
  totalTicketsSold: number;
  avgCpc: number | null;
  avgCtr: number | null;
}

export interface ReportsData {
  campaigns: CampaignCard[];
  snapshots: Array<{
    snapshot_date: string;
    roas: number | null;
    spend: number | null;
    campaign_id: string;
  }>;
  events: EventCard[];
  summary: ReportsSummary;
  dataSource: "meta_api" | "supabase";
}

function buildSummary(
  campaigns: CampaignCard[],
  events: EventCard[],
): ReportsSummary {
  let totalSpend = 0;
  let totalRevenue = 0;
  let totalImpressions = 0;
  let totalClicks = 0;
  let weightedRoas = 0;
  let spendWithRoas = 0;
  let cpcSum = 0;
  let cpcCount = 0;
  let ctrSum = 0;
  let ctrCount = 0;

  for (const c of campaigns) {
    totalSpend += c.spend;
    totalRevenue += c.revenue ?? 0;
    totalImpressions += c.impressions;
    totalClicks += c.clicks;
    if (c.roas != null && c.spend > 0) {
      weightedRoas += c.roas * c.spend;
      spendWithRoas += c.spend;
    }
    if (c.cpc != null) {
      cpcSum += c.cpc;
      cpcCount++;
    }
    if (c.ctr != null) {
      ctrSum += c.ctr;
      ctrCount++;
    }
  }

  const totalTicketsSold = events.reduce((s, e) => s + e.ticketsSold, 0);

  return {
    totalSpend,
    totalRevenue,
    blendedRoas: spendWithRoas > 0 ? weightedRoas / spendWithRoas : null,
    totalImpressions,
    totalClicks,
    totalTicketsSold,
    avgCpc: cpcCount > 0 ? cpcSum / cpcCount : null,
    avgCtr: ctrCount > 0 ? ctrSum / ctrCount : null,
  };
}

export async function getReportsData(
  slug: string,
  scope?: ScopeFilter,
): Promise<ReportsData> {
  const result = await fetchAllCampaigns("30", slug);

  let campaigns = result.campaigns.map(toCampaignCard);

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

  // Fetch events from Supabase
  let eventsQuery = supabaseAdmin
    ?.from("tm_events")
    .select("*")
    .eq("client_slug", slug)
    .order("date", { ascending: true })
    .limit(50);

  if (scope?.allowedEventIds && eventsQuery) {
    eventsQuery = eventsQuery.in("id", scope.allowedEventIds);
  }

  const eventsRes = eventsQuery ? await eventsQuery : { data: null };
  const tmEvents = (eventsRes.data ?? []) as TmEvent[];
  const events = tmEvents.map(buildEventCard);

  const summary = buildSummary(campaigns, events);

  return {
    campaigns,
    snapshots,
    events,
    summary,
    dataSource: result.error ? "supabase" : "meta_api",
  };
}
