import { META_API_VERSION, type DateRange, META_PRESETS } from "./constants";
import { guessClientSlug } from "./client-slug";

export interface MetaCampaignCard {
  campaignId: string;
  name: string;
  status: string;
  objective: string;
  clientSlug: string;
  spend: number;
  roas: number | null;
  revenue: number | null;
  impressions: number;
  clicks: number;
  ctr: number | null;
  cpc: number | null;
  cpm: number | null;
  dailyBudget: number | null;
  startTime: string | null;
}

export interface DailyInsight {
  campaignId: string;
  date: string;
  spend: number;
  roas: number | null;
}

export interface MetaCampaignsResult {
  campaigns: MetaCampaignCard[];
  dailyInsights: DailyInsight[];
  clients: string[];
  error: string | null;
}

function getCredentials() {
  const token = process.env.META_ACCESS_TOKEN;
  const rawAccountId = process.env.META_AD_ACCOUNT_ID;
  if (!token || !rawAccountId) return null;
  const accountId = rawAccountId.replace(/^act_/, "");
  return { token, accountId };
}

interface MetaPagedResponse<T> {
  data: T[];
  paging?: { next?: string };
}

async function fetchAllPages<T>(url: string, label?: string): Promise<T[]> {
  const all: T[] = [];
  let nextUrl: string | null = url;
  while (nextUrl) {
    const res = await fetch(nextUrl, { next: { revalidate: 300 } });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[meta-campaigns] ${label ?? "fetch"} failed (${res.status}): ${body.slice(0, 500)}`);
      return all;
    }
    const json = await res.json();
    if (json.error) {
      console.error(`[meta-campaigns] ${label ?? "fetch"} API error:`, json.error.message ?? json.error);
      return all;
    }
    const paged = json as MetaPagedResponse<T>;
    if (paged.data) all.push(...paged.data);
    nextUrl = paged.paging?.next ?? null;
  }
  return all;
}

interface RawCampaign {
  id: string;
  name: string;
  status: string;
  objective?: string;
  daily_budget?: string;
  start_time?: string;
}

interface RawInsight {
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

interface RawDailyInsight extends RawInsight {
  date_start: string;
}

function buildCampaignFilter(ids: string[]): string {
  return JSON.stringify([
    { field: "campaign.id", operator: "IN", value: ids },
  ]);
}

function buildInsightsUrl(
  base: string,
  token: string,
  preset: string,
  filter: string,
  fields: string,
  limit: string,
  timeIncrement?: string,
): string {
  const url = new URL(`${base}/insights`);
  url.searchParams.set("access_token", token);
  url.searchParams.set("level", "campaign");
  url.searchParams.set("fields", fields);
  url.searchParams.set("date_preset", preset);
  url.searchParams.set("filtering", filter);
  url.searchParams.set("limit", limit);
  if (timeIncrement) url.searchParams.set("time_increment", timeIncrement);
  return url.toString();
}

export async function fetchAllCampaigns(
  range: DateRange,
  clientSlug?: string | null,
): Promise<MetaCampaignsResult> {
  const creds = getCredentials();
  if (!creds) {
    return {
      campaigns: [],
      dailyInsights: [],
      clients: [],
      error: "Meta API credentials not configured",
    };
  }

  const { token, accountId } = creds;
  const preset = META_PRESETS[range];
  const base = `https://graph.facebook.com/${META_API_VERSION}/act_${accountId}`;

  // Phase 1: fetch campaign list (lightweight -- no insights data)
  const campaignsUrl = new URL(`${base}/campaigns`);
  campaignsUrl.searchParams.set("access_token", token);
  campaignsUrl.searchParams.set(
    "fields",
    "id,name,status,objective,daily_budget,start_time",
  );
  campaignsUrl.searchParams.set("limit", "500");

  try {
    const rawCampaigns = await fetchAllPages<RawCampaign>(
      campaignsUrl.toString(),
      "campaigns",
    );

    // Derive client slugs and build clients list from all campaigns
    const campaignSlugs = new Map<string, string>();
    for (const c of rawCampaigns) {
      campaignSlugs.set(c.id, guessClientSlug(c.name));
    }
    const clients = [...new Set(campaignSlugs.values())]
      .filter((s) => s !== "unknown")
      .sort();

    // Phase 2: filter campaigns before fetching insights
    const filtered = clientSlug
      ? rawCampaigns.filter((c) => campaignSlugs.get(c.id) === clientSlug)
      : rawCampaigns;

    const insightIds = filtered.map((c) => c.id);

    // Fetch insights only for the campaigns we need (single request)
    let rawInsights: RawInsight[] = [];
    let rawDaily: RawDailyInsight[] = [];

    if (insightIds.length > 0) {
      const filter = buildCampaignFilter(insightIds);
      const insightsFields = "campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,cpm,purchase_roas";

      const [insights, daily] = await Promise.all([
        fetchAllPages<RawInsight>(
          buildInsightsUrl(base, token, preset, filter, insightsFields, "500"),
          "insights",
        ),
        fetchAllPages<RawDailyInsight>(
          buildInsightsUrl(base, token, preset, filter, "campaign_id,spend,purchase_roas", "5000", "1"),
          "daily",
        ),
      ]);
      rawInsights = insights;
      rawDaily = daily;
    }

    console.log(`[meta-campaigns] ${filtered.length}/${rawCampaigns.length} campaigns, ${rawInsights.length} insights, ${rawDaily.length} daily rows`);

    const insightMap = new Map<string, RawInsight>();
    for (const row of rawInsights) {
      insightMap.set(row.campaign_id, row);
    }

    const campaigns: MetaCampaignCard[] = filtered.map((c) => {
      const insight = insightMap.get(c.id);
      const spend = insight ? parseFloat(insight.spend) || 0 : 0;
      const roasVal = insight?.purchase_roas?.find(
        (r) => r.action_type === "omni_purchase",
      )?.value;
      const roas = roasVal ? parseFloat(roasVal) : null;

      return {
        campaignId: c.id,
        name: c.name,
        status: c.status,
        objective: c.objective ?? "",
        clientSlug: campaignSlugs.get(c.id) ?? "unknown",
        spend,
        roas,
        revenue: roas != null ? spend * roas : null,
        impressions: insight ? parseInt(insight.impressions) || 0 : 0,
        clicks: insight ? parseInt(insight.clicks) || 0 : 0,
        ctr: insight ? parseFloat(insight.ctr) || null : null,
        cpc: insight ? parseFloat(insight.cpc) || null : null,
        cpm: insight ? parseFloat(insight.cpm) || null : null,
        dailyBudget: c.daily_budget ? parseInt(c.daily_budget) / 100 : null,
        startTime: c.start_time ?? null,
      };
    });

    const dailyInsights: DailyInsight[] = rawDaily.map((d) => {
      const roasVal = d.purchase_roas?.find(
        (r) => r.action_type === "omni_purchase",
      )?.value;
      return {
        campaignId: d.campaign_id,
        date: d.date_start,
        spend: parseFloat(d.spend) || 0,
        roas: roasVal ? parseFloat(roasVal) : null,
      };
    });

    return { campaigns, dailyInsights, clients, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Meta API request failed";
    return { campaigns: [], dailyInsights: [], clients: [], error: msg };
  }
}
