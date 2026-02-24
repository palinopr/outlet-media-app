import { supabaseAdmin } from "@/lib/supabase";
import type { DateRange } from "../../data";
import type {
  CampaignCard,
  CampaignDetailData,
  AgeGenderBreakdown,
  PlacementBreakdown,
  AdCard,
} from "../../lib";

// --- Meta API date presets (duplicated from parent to avoid circular imports) ---

const META_PRESETS: Record<DateRange, string> = {
  today: "today",
  yesterday: "yesterday",
  "7": "last_7d",
  "14": "last_14d",
  "30": "last_30d",
  lifetime: "maximum",
};

const RANGE_LABELS: Record<DateRange, string> = {
  today: "Today",
  yesterday: "Yesterday",
  "7": "Last 7 days",
  "14": "Last 14 days",
  "30": "Last 30 days",
  lifetime: "Lifetime",
};

// --- Meta API helpers ---

function getMetaCreds(): { token: string; accountId: string } | null {
  const token = process.env.META_ACCESS_TOKEN;
  const rawId = process.env.META_AD_ACCOUNT_ID;
  if (!token || !rawId) return null;
  return { token, accountId: rawId.replace(/^act_/, "") };
}

async function metaGet<T>(url: URL, label?: string): Promise<T | null> {
  try {
    const res = await fetch(url.toString(), { next: { revalidate: 300 } });
    if (!res.ok) {
      console.error(`[meta:${label ?? "unknown"}] HTTP ${res.status}`);
      return null;
    }
    const json = await res.json();
    if (json.error) {
      console.error(`[meta:${label ?? "unknown"}] API error:`, json.error.message ?? json.error);
      return null;
    }
    return json as T;
  } catch (err) {
    console.error(`[meta:${label ?? "unknown"}] fetch failed:`, err);
    return null;
  }
}

// --- Fetch campaign overview from Meta (single campaign) ---

interface MetaCampaignInfo {
  id: string;
  name: string;
  status: string;
  daily_budget?: string;
  start_time?: string;
}

interface MetaInsightRow {
  campaign_id: string;
  campaign_name: string;
  spend: string;
  impressions: string;
  clicks: string;
  ctr: string;
  cpc: string;
  cpm: string;
  reach?: string;
  frequency?: string;
  purchase_roas?: Array<{ action_type: string; value: string }>;
}

async function fetchCampaignOverview(
  campaignId: string,
  range: DateRange,
  creds: { token: string; accountId: string },
): Promise<{ info: MetaCampaignInfo | null; insights: MetaInsightRow | null }> {
  // Campaign info
  const infoUrl = new URL(`https://graph.facebook.com/v21.0/${campaignId}`);
  infoUrl.searchParams.set("access_token", creds.token);
  infoUrl.searchParams.set("fields", "id,name,status,daily_budget,start_time");

  // Campaign insights
  const insightsUrl = new URL(`https://graph.facebook.com/v21.0/${campaignId}/insights`);
  insightsUrl.searchParams.set("access_token", creds.token);
  insightsUrl.searchParams.set(
    "fields",
    "campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,cpm,reach,frequency,purchase_roas",
  );
  insightsUrl.searchParams.set("date_preset", META_PRESETS[range]);

  const [infoRes, insightsRes] = await Promise.all([
    metaGet<MetaCampaignInfo>(infoUrl, "campaignInfo"),
    metaGet<{ data: MetaInsightRow[] }>(insightsUrl, "campaignInsights"),
  ]);

  return {
    info: infoRes,
    insights: insightsRes?.data?.[0] ?? null,
  };
}

// --- Fetch age/gender breakdowns ---

// Breakdown dimensions (age, gender) come automatically in the response
// when specified via the `breakdowns` param -- do NOT include them in `fields`.
// `purchase_roas` is an action metric incompatible with demographic breakdowns.
interface MetaAgeGenderRow {
  age: string;
  gender: string;
  impressions: string;
  clicks: string;
  ctr: string;
  spend?: string;
}

async function fetchAgeGender(
  campaignId: string,
  range: DateRange,
  creds: { token: string; accountId: string },
): Promise<AgeGenderBreakdown[]> {
  const url = new URL(`https://graph.facebook.com/v21.0/${campaignId}/insights`);
  url.searchParams.set("access_token", creds.token);
  url.searchParams.set("fields", "impressions,clicks,ctr,spend");
  url.searchParams.set("breakdowns", "age,gender");
  url.searchParams.set("date_preset", META_PRESETS[range]);
  url.searchParams.set("limit", "100");

  const res = await metaGet<{ data: MetaAgeGenderRow[] }>(url, "ageGender");
  if (!res?.data) return [];

  return res.data.map((r) => ({
    age: r.age,
    gender: r.gender === "male" ? "Male" : r.gender === "female" ? "Female" : r.gender,
    spend: r.spend ? parseFloat(r.spend) : 0,
    impressions: parseInt(r.impressions) || 0,
    clicks: parseInt(r.clicks) || 0,
    ctr: parseFloat(r.ctr) || null,
    roas: null,
  }));
}

// --- Fetch placement breakdowns ---

// Same as age/gender: breakdown dimensions come from the `breakdowns` param.
interface MetaPlacementRow {
  publisher_platform: string;
  platform_position: string;
  impressions: string;
  clicks: string;
  ctr: string;
  spend?: string;
}

async function fetchPlacements(
  campaignId: string,
  range: DateRange,
  creds: { token: string; accountId: string },
): Promise<PlacementBreakdown[]> {
  const url = new URL(`https://graph.facebook.com/v21.0/${campaignId}/insights`);
  url.searchParams.set("access_token", creds.token);
  url.searchParams.set("fields", "impressions,clicks,ctr,spend");
  url.searchParams.set("breakdowns", "publisher_platform,platform_position");
  url.searchParams.set("date_preset", META_PRESETS[range]);
  url.searchParams.set("limit", "100");

  const res = await metaGet<{ data: MetaPlacementRow[] }>(url, "placements");
  if (!res?.data) return [];

  return res.data.map((r) => ({
    platform: formatPlatform(r.publisher_platform),
    position: formatPosition(r.platform_position),
    spend: r.spend ? parseFloat(r.spend) : 0,
    impressions: parseInt(r.impressions) || 0,
    clicks: parseInt(r.clicks) || 0,
    ctr: parseFloat(r.ctr) || null,
  }));
}

function formatPlatform(p: string): string {
  const map: Record<string, string> = {
    facebook: "Facebook",
    instagram: "Instagram",
    audience_network: "Audience Network",
    messenger: "Messenger",
  };
  return map[p] ?? p;
}

function formatPosition(p: string): string {
  return p
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// --- Fetch ads with creative info ---

interface MetaAdRow {
  id: string;
  name: string;
  status: string;
  creative?: {
    thumbnail_url?: string;
    title?: string;
    body?: string;
  };
  insights?: {
    data: Array<{
      spend: string;
      impressions: string;
      clicks: string;
      reach?: string;
      ctr: string;
      cpc: string;
      purchase_roas?: Array<{ action_type: string; value: string }>;
    }>;
  };
}

async function fetchAds(
  campaignId: string,
  range: DateRange,
  creds: { token: string; accountId: string },
): Promise<AdCard[]> {
  const url = new URL(`https://graph.facebook.com/v21.0/${campaignId}/ads`);
  url.searchParams.set("access_token", creds.token);
  url.searchParams.set(
    "fields",
    `id,name,status,creative{thumbnail_url,title,body},insights.date_preset(${META_PRESETS[range]}){spend,impressions,clicks,reach,ctr,cpc,purchase_roas}`,
  );
  url.searchParams.set("limit", "50");

  const res = await metaGet<{ data: MetaAdRow[] }>(url, "ads");
  if (!res?.data) return [];

  return res.data.map((ad) => {
    const ins = ad.insights?.data?.[0];
    const spend = ins ? parseFloat(ins.spend) || 0 : 0;
    const roasVal = ins?.purchase_roas?.find(
      (r) => r.action_type === "omni_purchase",
    )?.value;
    const roas = roasVal ? parseFloat(roasVal) : null;

    return {
      adId: ad.id,
      name: ad.name,
      status: ad.status,
      thumbnailUrl: ad.creative?.thumbnail_url ?? null,
      creativeTitle: ad.creative?.title ?? null,
      creativeBody: ad.creative?.body ?? null,
      spend,
      impressions: ins ? parseInt(ins.impressions) || 0 : 0,
      clicks: ins ? parseInt(ins.clicks) || 0 : 0,
      reach: ins?.reach ? parseInt(ins.reach) : null,
      ctr: ins ? parseFloat(ins.ctr) || null : null,
      cpc: ins ? parseFloat(ins.cpc) || null : null,
      roas,
      revenue: roas != null ? spend * roas : null,
    };
  });
}

// --- Main data function ---

export async function getCampaignDetail(
  slug: string,
  campaignId: string,
  range: DateRange,
): Promise<CampaignDetailData | null> {
  const creds = getMetaCreds();

  // Try Meta API first (parallel calls for speed)
  if (creds) {
    const [overview, ageGender, placements, ads] = await Promise.all([
      fetchCampaignOverview(campaignId, range, creds),
      fetchAgeGender(campaignId, range, creds),
      fetchPlacements(campaignId, range, creds),
      fetchAds(campaignId, range, creds),
    ]);

    if (overview.info) {
      const spend = overview.insights ? parseFloat(overview.insights.spend) || 0 : 0;
      const roasVal = overview.insights?.purchase_roas?.find(
        (r) => r.action_type === "omni_purchase",
      )?.value;
      const roas = roasVal ? parseFloat(roasVal) : null;

      const campaign: CampaignCard = {
        campaignId,
        name: overview.info.name,
        status: overview.info.status,
        spend,
        roas,
        revenue: roas != null ? spend * roas : null,
        impressions: overview.insights ? parseInt(overview.insights.impressions) || 0 : 0,
        clicks: overview.insights ? parseInt(overview.insights.clicks) || 0 : 0,
        ctr: overview.insights ? parseFloat(overview.insights.ctr) || null : null,
        cpc: overview.insights ? parseFloat(overview.insights.cpc) || null : null,
        cpm: overview.insights ? parseFloat(overview.insights.cpm) || null : null,
        dailyBudget: overview.info.daily_budget
          ? parseInt(overview.info.daily_budget) / 100
          : null,
        startTime: overview.info.start_time ?? null,
      };

      return {
        campaign,
        ageGender,
        placements,
        ads,
        dataSource: "meta_api",
        rangeLabel: RANGE_LABELS[range],
      };
    }
  }

  // Fallback: Supabase (no breakdowns or ads available)
  if (!supabaseAdmin) return null;

  const { data: row } = await supabaseAdmin
    .from("meta_campaigns")
    .select(
      "campaign_id, name, status, spend, roas, impressions, clicks, ctr, cpc, cpm, daily_budget, start_time",
    )
    .eq("campaign_id", campaignId)
    .eq("client_slug", slug)
    .single();

  if (!row) return null;

  const spend = (row.spend ?? 0) / 100;
  const roas = row.roas != null ? Number(row.roas) : null;

  return {
    campaign: {
      campaignId: row.campaign_id,
      name: row.name ?? "Unknown Campaign",
      status: row.status ?? "UNKNOWN",
      spend,
      roas,
      revenue: roas != null ? spend * roas : null,
      impressions: row.impressions ?? 0,
      clicks: row.clicks ?? 0,
      ctr: row.ctr != null ? Number(row.ctr) : null,
      cpc: row.cpc != null ? Number(row.cpc) : null,
      cpm: row.cpm != null ? Number(row.cpm) : null,
      dailyBudget: row.daily_budget != null ? row.daily_budget / 100 : null,
      startTime: row.start_time,
    },
    ageGender: [],
    placements: [],
    ads: [],
    dataSource: "supabase",
    rangeLabel: RANGE_LABELS[range],
  };
}
