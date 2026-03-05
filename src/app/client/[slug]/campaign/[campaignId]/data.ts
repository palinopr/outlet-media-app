import { supabaseAdmin } from "@/lib/supabase";
import { type DateRange, META_PRESETS, RANGE_LABELS } from "@/lib/constants";
import { META_API_VERSION } from "@/lib/constants";
import { metaGet, metaInsightsUrl } from "@/lib/meta-api";
import type { CampaignCard, CampaignDetailData, AgeGenderBreakdown, PlacementBreakdown, AdCard, HourlyBreakdown, DailyPoint } from "../../types";
import { DAY_LABELS } from "../../types";
import { generateRecommendations } from "../../lib";

// --- Meta API helpers ---

function getMetaCreds(): { token: string; accountId: string } | null {
  const token = process.env.META_ACCESS_TOKEN;
  const rawId = process.env.META_AD_ACCOUNT_ID;
  if (!token || !rawId) return null;
  return { token, accountId: rawId.replace(/^act_/, "") };
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
  const infoUrl = new URL(`https://graph.facebook.com/${META_API_VERSION}/${campaignId}`);
  infoUrl.searchParams.set("access_token", creds.token);
  infoUrl.searchParams.set("fields", "id,name,status,daily_budget,start_time");

  // Campaign insights
  const insightsUrl = metaInsightsUrl(
    campaignId, creds.token,
    "campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,cpm,reach,frequency,purchase_roas",
    { datePreset: META_PRESETS[range] },
  );

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
  const url = metaInsightsUrl(campaignId, creds.token, "impressions,clicks,ctr,spend", {
    datePreset: META_PRESETS[range],
    breakdowns: "age,gender",
    limit: 100,
  });

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
  const url = metaInsightsUrl(campaignId, creds.token, "impressions,clicks,ctr,spend", {
    datePreset: META_PRESETS[range],
    breakdowns: "publisher_platform,platform_position",
    limit: 100,
  });

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

// --- Fetch hourly breakdown ---

interface MetaHourlyRow {
  hourly_stats_aggregated_by_advertiser_time_zone: string; // "00:00:00" - "23:00:00"
  impressions: string;
  clicks: string;
  ctr: string;
}

async function fetchHourly(
  campaignId: string,
  range: DateRange,
  creds: { token: string; accountId: string },
): Promise<HourlyBreakdown[]> {
  const url = metaInsightsUrl(campaignId, creds.token, "impressions,clicks,ctr", {
    datePreset: META_PRESETS[range],
    breakdowns: "hourly_stats_aggregated_by_advertiser_time_zone",
    limit: 50,
  });

  const res = await metaGet<{ data: MetaHourlyRow[] }>(url, "hourly");
  if (!res?.data) return [];

  return res.data.map((r) => ({
    hour: parseInt(r.hourly_stats_aggregated_by_advertiser_time_zone) || 0,
    impressions: parseInt(r.impressions) || 0,
    clicks: parseInt(r.clicks) || 0,
    ctr: parseFloat(r.ctr) || null,
  })).sort((a, b) => a.hour - b.hour);
}

// --- Fetch daily time series ---

interface MetaDailyRow {
  date_start: string;
  date_stop: string;
  impressions: string;
  clicks: string;
  ctr: string;
}

async function fetchDaily(
  campaignId: string,
  range: DateRange,
  creds: { token: string; accountId: string },
): Promise<DailyPoint[]> {
  // time_increment=1 gives day-by-day breakdown
  const url = metaInsightsUrl(campaignId, creds.token, "impressions,clicks,ctr", {
    datePreset: META_PRESETS[range],
    timeIncrement: "1",
    limit: 90,
  });

  const res = await metaGet<{ data: MetaDailyRow[] }>(url, "daily");
  if (!res?.data) return [];

  return res.data.map((r) => {
    const d = new Date(r.date_start + "T12:00:00");
    return {
      date: r.date_start,
      dayOfWeek: d.getDay(),
      dayLabel: DAY_LABELS[d.getDay()],
      impressions: parseInt(r.impressions) || 0,
      clicks: parseInt(r.clicks) || 0,
      ctr: parseFloat(r.ctr) || null,
    };
  }).sort((a, b) => a.date.localeCompare(b.date));
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
  const url = new URL(`https://graph.facebook.com/${META_API_VERSION}/${campaignId}/ads`);
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
    const [overview, ageGender, placements, ads, hourly, daily] = await Promise.all([
      fetchCampaignOverview(campaignId, range, creds),
      fetchAgeGender(campaignId, range, creds),
      fetchPlacements(campaignId, range, creds),
      fetchAds(campaignId, range, creds),
      fetchHourly(campaignId, range, creds),
      fetchDaily(campaignId, range, creds),
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

      const recommendations = generateRecommendations(
        campaign,
        ageGender,
        placements,
        ads,
        hourly,
        daily,
      );

      return {
        campaign,
        ageGender,
        placements,
        ads,
        hourly,
        daily,
        recommendations,
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
    hourly: [],
    daily: [],
    recommendations: [],
    dataSource: "supabase",
    rangeLabel: RANGE_LABELS[range],
  };
}
