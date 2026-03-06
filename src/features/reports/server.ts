import { buildTrendData } from "@/app/client/[slug]/lib";
import type { TmEvent } from "@/app/client/[slug]/types";
import type { ScopeFilter } from "@/lib/member-access";
import { fetchAllCampaigns, type MetaCampaignCard } from "@/lib/meta-campaigns";
import { supabaseAdmin } from "@/lib/supabase";
import { listAgentOutcomes } from "@/features/agent-outcomes/server";
import type { AgentOutcomeView } from "@/features/agent-outcomes/summary";
import {
  getDashboardActionCenter,
  getDashboardOpsSummary,
  type DashboardActionCenter,
} from "@/features/dashboard/server";
import type { DashboardOpsSummary, DashboardSummaryMode } from "@/features/dashboard/summary";
import {
  getEventOperationsSummary,
} from "@/features/events/server";
import type { EventOperationsSummary } from "@/features/events/summary";
import {
  buildReportsSummary,
  type ReportsCampaignCard,
  type ReportsEventCard,
} from "./summary";

export interface ReportsData {
  campaigns: ReportsCampaignCard[];
  snapshots: Array<{
    snapshot_date: string;
    roas: number | null;
    spend: number | null;
    campaign_id: string;
  }>;
  trendData: Array<{ date: string; roas: number; spend: number }>;
  events: ReportsEventCard[];
  summary: ReturnType<typeof buildReportsSummary>;
  dataSource: "meta_api" | "supabase";
  clients: string[];
}

function detectPlatform(tmId: string): ReportsEventCard["ticketPlatform"] {
  if (tmId.startsWith("eata_")) return "vivaticket";
  if (tmId.length > 0) return "ticketmaster";
  return "unknown";
}

function toReportsCampaign(campaign: MetaCampaignCard): ReportsCampaignCard {
  return {
    campaignId: campaign.campaignId,
    name: campaign.name,
    status: campaign.status,
    clientSlug: campaign.clientSlug,
    spend: campaign.spend,
    roas: campaign.roas,
    revenue: campaign.revenue,
    impressions: campaign.impressions,
    clicks: campaign.clicks,
    ctr: campaign.ctr,
    cpc: campaign.cpc,
    cpm: campaign.cpm,
    dailyBudget: campaign.dailyBudget,
    startTime: campaign.startTime,
  };
}

function toReportsEvent(event: TmEvent): ReportsEventCard {
  const sold = event.tickets_sold ?? 0;
  const available = event.tickets_available;
  const capacity = available != null ? sold + available : null;
  const sellThrough = capacity != null && capacity > 0 ? Math.round((sold / capacity) * 100) : null;

  return {
    id: event.id,
    name: event.name,
    venue: event.venue,
    city: event.city ?? "",
    clientSlug: event.client_slug ?? null,
    date: event.date,
    status: event.status,
    ticketsSold: sold,
    ticketsAvailable: available,
    sellThrough,
    avgTicketPrice: event.avg_ticket_price != null ? Number(event.avg_ticket_price) : null,
    potentialRevenue: event.potential_revenue,
    gross: event.gross,
    updatedAt: event.updated_at ?? null,
    ticketPlatform: detectPlatform(event.tm_id),
    artist: event.artist ?? "",
    ticketsSoldToday: event.tickets_sold_today ?? null,
    revenueToday: event.revenue_today ?? null,
    conversionRate: event.conversion_rate != null ? Number(event.conversion_rate) : null,
    edpTotalViews: event.edp_total_views != null ? Number(event.edp_total_views) : null,
    edpAvgDailyViews:
      event.edp_avg_daily_views != null ? Number(event.edp_avg_daily_views) : null,
  };
}

interface GetReportsDataOptions {
  clientSlug?: string | null;
  scope?: ScopeFilter;
}

interface GetReportsWorkflowDataOptions {
  clientSlug?: string | null;
  limit?: number;
  mode: DashboardSummaryMode;
  scope?: ScopeFilter;
}

export interface ReportsWorkflowData {
  actionCenter: DashboardActionCenter;
  agentOutcomes: AgentOutcomeView[];
  eventOperations: EventOperationsSummary;
  opsSummary: DashboardOpsSummary;
}

export async function getReportsData(
  options: GetReportsDataOptions = {},
): Promise<ReportsData> {
  const result = await fetchAllCampaigns("30", options.clientSlug ?? null);

  let campaigns = result.campaigns.map(toReportsCampaign);

  if (options.scope?.allowedCampaignIds) {
    const allowed = new Set(options.scope.allowedCampaignIds);
    campaigns = campaigns.filter((campaign) => allowed.has(campaign.campaignId));
  }

  const campaignIds = new Set(campaigns.map((campaign) => campaign.campaignId));
  const snapshots = result.dailyInsights
    .filter((row) => campaignIds.has(row.campaignId))
    .map((row) => ({
      snapshot_date: row.date,
      roas: row.roas,
      spend: row.spend != null ? Math.round(row.spend * 100) : null,
      campaign_id: row.campaignId,
    }));

  let eventsQuery = supabaseAdmin
    ?.from("tm_events")
    .select("*")
    .order("date", { ascending: true })
    .limit(options.clientSlug ? 50 : 200);

  if (options.clientSlug && eventsQuery) {
    eventsQuery = eventsQuery.eq("client_slug", options.clientSlug);
  }

  if (options.scope?.allowedEventIds && eventsQuery) {
    eventsQuery = eventsQuery.in("id", options.scope.allowedEventIds);
  }

  const eventsRes = eventsQuery ? await eventsQuery : { data: null };
  const events = ((eventsRes.data ?? []) as TmEvent[]).map(toReportsEvent);

  return {
    campaigns,
    snapshots,
    trendData: buildTrendData(snapshots),
    events,
    summary: buildReportsSummary(campaigns, events),
    dataSource: result.error ? "supabase" : "meta_api",
    clients: result.clients,
  };
}

export async function getReportsWorkflowData(
  options: GetReportsWorkflowDataOptions,
): Promise<ReportsWorkflowData> {
  const scopeCampaignIds = options.scope?.allowedCampaignIds ?? null;
  const scopeEventIds = options.scope?.allowedEventIds ?? null;
  const audience = options.mode === "client" ? "shared" : "all";
  const limit = options.limit ?? 4;

  const [opsSummary, actionCenter, agentOutcomes, eventOperations] = await Promise.all([
    getDashboardOpsSummary({
      clientSlug: options.clientSlug ?? undefined,
      limit: Math.max(limit, 5),
      mode: options.mode,
      scopeCampaignIds,
    }),
    getDashboardActionCenter({
      clientSlug: options.clientSlug ?? undefined,
      limit,
      mode: options.mode,
      scopeCampaignIds,
      scopeEventIds,
    }),
    listAgentOutcomes({
      audience,
      clientSlug: options.clientSlug ?? undefined,
      limit,
      scopeCampaignIds,
      scopeEventIds,
    }),
    getEventOperationsSummary({
      clientSlug: options.clientSlug ?? undefined,
      limit: Math.max(limit, 5),
      mode: options.mode,
      scope: options.scope,
    }),
  ]);

  return {
    actionCenter,
    agentOutcomes,
    eventOperations,
    opsSummary,
  };
}
