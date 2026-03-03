import { supabaseAdmin } from "@/lib/supabase";
import { type DateRange, META_PRESETS, RANGE_LABELS } from "@/lib/constants";
import { META_API_VERSION } from "@/lib/constants";
import { getClientToken, getActiveAccountsForSlug } from "@/lib/client-token";
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

// --- Meta Graph API types ---

interface MetaInsightRow {
  campaign_id: string;
  campaign_name: string;
  spend: string;
  impressions: string;
  clicks: string;
  ctr: string;
  cpc: string;
  cpm: string;
  purchase_roas?: Array<{ action_type: string; value: string }>;
}

interface MetaCampaignRow {
  id: string;
  name: string;
  status: string;
  daily_budget?: string;
  start_time?: string;
}

// --- Meta API fetch ---

async function fetchMetaInsights(
  campaignIds: string[],
  range: DateRange,
  token: string,
  rawAccountId: string,
): Promise<{ insights: MetaInsightRow[]; campaigns: MetaCampaignRow[] } | null> {
  // Strip act_ prefix if present -- the URL template adds it
  const accountId = rawAccountId.replace(/^act_/, "");

  const filterJson = JSON.stringify([
    { field: "campaign.id", operator: "IN", value: campaignIds },
  ]);

  const insightsUrl = new URL(
    `https://graph.facebook.com/${META_API_VERSION}/act_${accountId}/insights`,
  );
  insightsUrl.searchParams.set("access_token", token);
  insightsUrl.searchParams.set("level", "campaign");
  insightsUrl.searchParams.set(
    "fields",
    "campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,cpm,purchase_roas",
  );
  insightsUrl.searchParams.set("date_preset", META_PRESETS[range]);
  insightsUrl.searchParams.set("filtering", filterJson);
  insightsUrl.searchParams.set("limit", "500");

  const campaignsUrl = new URL(
    `https://graph.facebook.com/${META_API_VERSION}/act_${accountId}/campaigns`,
  );
  campaignsUrl.searchParams.set("access_token", token);
  campaignsUrl.searchParams.set("fields", "id,name,status,daily_budget,start_time");
  campaignsUrl.searchParams.set("filtering", filterJson);
  campaignsUrl.searchParams.set("limit", "500");

  try {
    const [insightsRes, campaignsRes] = await Promise.all([
      fetch(insightsUrl.toString(), { next: { revalidate: 300 } }),
      fetch(campaignsUrl.toString(), { next: { revalidate: 300 } }),
    ]);

    if (!insightsRes.ok || !campaignsRes.ok) return null;

    const insightsJson = await insightsRes.json();
    const campaignsJson = await campaignsRes.json();

    if (insightsJson.error || campaignsJson.error) return null;

    return {
      insights: insightsJson.data ?? [],
      campaigns: campaignsJson.data ?? [],
    };
  } catch {
    return null;
  }
}

// --- Build campaigns from Meta API ---

function buildFromMeta(
  insights: MetaInsightRow[],
  metaCampaigns: MetaCampaignRow[],
): CampaignCard[] {
  const statusMap = new Map<string, MetaCampaignRow>();
  for (const c of metaCampaigns) statusMap.set(c.id, c);

  return insights.map((row) => {
    const info = statusMap.get(row.campaign_id);
    const spend = parseFloat(row.spend) || 0;
    const roas =
      row.purchase_roas?.find((r) => r.action_type === "omni_purchase")?.value;
    const roasNum = roas ? parseFloat(roas) : null;

    return {
      campaignId: row.campaign_id,
      name: row.campaign_name || info?.name || "Unknown Campaign",
      status: info?.status ?? "UNKNOWN",
      spend,
      roas: roasNum,
      revenue: roasNum != null ? spend * roasNum : null,
      impressions: parseInt(row.impressions) || 0,
      clicks: parseInt(row.clicks) || 0,
      ctr: parseFloat(row.ctr) || null,
      cpc: parseFloat(row.cpc) || null,
      cpm: parseFloat(row.cpm) || null,
      dailyBudget: info?.daily_budget ? parseInt(info.daily_budget) / 100 : null,
      startTime: info?.start_time ?? null,
    };
  });
}

// --- Build campaigns from Supabase (fallback) ---

function buildFromSupabase(
  rows: Array<{
    campaign_id: string;
    name: string | null;
    status: string | null;
    spend: number | null;
    roas: number | null;
    impressions: number | null;
    clicks: number | null;
    ctr: number | null;
    cpc: number | null;
    cpm: number | null;
    daily_budget: number | null;
    start_time: string | null;
  }>,
): CampaignCard[] {
  return rows.map((r) => {
    const spend = (r.spend ?? 0) / 100;
    const roas = r.roas != null ? Number(r.roas) : null;
    return {
      campaignId: r.campaign_id,
      name: r.name ?? "Unknown Campaign",
      status: r.status ?? "UNKNOWN",
      spend,
      roas,
      revenue: roas != null ? spend * roas : null,
      impressions: r.impressions ?? 0,
      clicks: r.clicks ?? 0,
      ctr: r.ctr != null ? Number(r.ctr) : null,
      cpc: r.cpc != null ? Number(r.cpc) : null,
      cpm: r.cpm != null ? Number(r.cpm) : null,
      dailyBudget: r.daily_budget != null ? r.daily_budget / 100 : null,
      startTime: r.start_time,
    };
  });
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

// --- Shared campaign fetch: Supabase rows + Meta API resolution ---

type SupabaseCampaignRow = {
  campaign_id: string;
  name: string | null;
  status: string | null;
  spend: number | null;
  roas: number | null;
  impressions: number | null;
  clicks: number | null;
  ctr: number | null;
  cpc: number | null;
  cpm: number | null;
  daily_budget: number | null;
  start_time: string | null;
};

async function fetchClientCampaigns(
  slug: string,
  range: DateRange,
): Promise<{
  campaigns: CampaignCard[];
  campaignIds: string[];
  dataSource: "meta_api" | "supabase";
} | null> {
  if (!supabaseAdmin) return null;

  const { data: campaignRows } = await supabaseAdmin
    .from("meta_campaigns")
    .select("campaign_id, name, status, spend, roas, impressions, clicks, ctr, cpc, cpm, daily_budget, start_time")
    .eq("client_slug", slug);

  if (!campaignRows || campaignRows.length === 0) return null;

  const rows = campaignRows as SupabaseCampaignRow[];
  const campaignIds = rows.map((c) => c.campaign_id);

  // Resolve per-client token, fall back to global env var
  const clientAccounts = await getActiveAccountsForSlug(slug);

  let metaToken: string | null = null;
  let adAccountId: string | null = null;

  if (clientAccounts.length > 0) {
    const account = clientAccounts[0];
    adAccountId = account.ad_account_id;
    metaToken = await getClientToken(slug, account.ad_account_id);
  }

  if (!metaToken) {
    metaToken = process.env.META_ACCESS_TOKEN ?? null;
    adAccountId = process.env.META_AD_ACCOUNT_ID ?? null;
  }

  const metaResult =
    metaToken && adAccountId
      ? await fetchMetaInsights(campaignIds, range, metaToken, adAccountId)
      : null;

  let campaigns: CampaignCard[];
  let dataSource: "meta_api" | "supabase";

  if (metaResult && metaResult.insights.length > 0) {
    campaigns = buildFromMeta(metaResult.insights, metaResult.campaigns);
    dataSource = "meta_api";
  } else if (metaResult && metaResult.campaigns.length > 0 && metaResult.insights.length === 0) {
    const statusMap = new Map(metaResult.campaigns.map((c) => [c.id, c]));
    campaigns = rows.map((r) => {
      const meta = statusMap.get(r.campaign_id);
      return {
        campaignId: r.campaign_id,
        name: meta?.name ?? r.name ?? "Unknown Campaign",
        status: meta?.status ?? r.status ?? "UNKNOWN",
        spend: 0,
        roas: null,
        revenue: null,
        impressions: 0,
        clicks: 0,
        ctr: null,
        cpc: null,
        cpm: null,
        dailyBudget: meta?.daily_budget
          ? parseInt(meta.daily_budget) / 100
          : r.daily_budget != null
            ? r.daily_budget / 100
            : null,
        startTime: meta?.start_time ?? r.start_time,
      };
    });
    dataSource = "meta_api";
  } else {
    campaigns = buildFromSupabase(rows);
    dataSource = "supabase";
  }

  // Update last_used_at when a per-client token was used successfully
  if (dataSource === "meta_api" && clientAccounts.length > 0 && supabaseAdmin && adAccountId) {
    supabaseAdmin
      .from("client_accounts")
      .update({ last_used_at: new Date().toISOString() })
      .eq("ad_account_id", adAccountId)
      .then(() => {}, () => {});
  }

  return { campaigns, campaignIds, dataSource };
}

// --- Campaigns page data (Meta API first, Supabase fallback + snapshots) ---

export async function getCampaignsPageData(slug: string): Promise<{
  campaigns: CampaignCard[];
  snapshots: Array<{ snapshot_date: string; roas: number | null; spend: number | null; campaign_id: string }>;
  dataSource: "meta_api" | "supabase";
}> {
  const empty = { campaigns: [], snapshots: [], dataSource: "supabase" as const };

  const result = await fetchClientCampaigns(slug, "30");
  if (!result) return empty;

  result.campaigns.sort((a, b) => b.spend - a.spend);

  let snapshots: Array<{ snapshot_date: string; roas: number | null; spend: number | null; campaign_id: string }> = [];
  const { data } = await supabaseAdmin!
    .from("campaign_snapshots")
    .select("snapshot_date, roas, spend, campaign_id")
    .in("campaign_id", result.campaignIds)
    .order("snapshot_date", { ascending: true })
    .limit(500);
  snapshots = data ?? [];

  return { campaigns: result.campaigns, snapshots, dataSource: result.dataSource };
}

// --- Main data function ---

export async function getData(
  slug: string,
  range: DateRange,
): Promise<ClientData> {
  const result = await fetchClientCampaigns(slug, range);
  if (!result) return EMPTY;

  const { campaigns, dataSource } = result;

  // Fetch TM events for this client (optional enrichment)
  const eventsRes = await supabaseAdmin!
    .from("tm_events")
    .select("*")
    .eq("client_slug", slug)
    .order("date", { ascending: true })
    .limit(50);

  const tmEvents = (eventsRes.data ?? []) as TmEvent[];
  const events = buildEventCards(tmEvents);

  // Fetch demographics if events exist
  let audience: AudienceProfile | null = null;
  if (tmEvents.length > 0) {
    const tmIds = tmEvents.map((e) => e.tm_id);
    const { data: demoRows } = await supabaseAdmin!
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

export async function getLastSyncedAt(slug: string): Promise<string | null> {
  if (!supabaseAdmin) return null;
  const { data } = await supabaseAdmin
    .from("meta_campaigns")
    .select("synced_at")
    .eq("client_slug", slug)
    .order("synced_at", { ascending: false })
    .limit(1)
    .single();
  return data?.synced_at ?? null;
}
