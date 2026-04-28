import { fetchCampaignById, type MetaCampaignCard } from "@/lib/meta-campaigns";
import { getEffectiveCampaignRowById } from "@/lib/campaign-client-assignment";
import { supabaseAdmin } from "@/lib/supabase";

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.length > 0) return Number(value);
  return null;
}

function centsToDollars(value: number | string | null | undefined) {
  const amount = toNumber(value);
  return amount == null ? null : amount / 100;
}

interface CampaignOperatingRow {
  campaign_id: string;
  client_slug: string | null;
  name: string | null;
  status: string | null;
  objective: string | null;
  campaign_type: string | null;
  spend: number | string | null;
  roas: number | string | null;
  impressions: number | string | null;
  clicks: number | string | null;
  ctr: number | string | null;
  cpc: number | string | null;
  cpm: number | string | null;
  daily_budget: number | string | null;
  start_time: string | null;
}

export interface CampaignOperatingData {
  campaign: MetaCampaignCard;
}

export async function getCampaignOperatingData(campaignId: string): Promise<CampaignOperatingData | null> {
  if (!supabaseAdmin) throw new Error("DB not configured");

  const data = await getEffectiveCampaignRowById<CampaignOperatingRow>(
    campaignId,
    "campaign_id, name, status, objective, client_slug, campaign_type, spend, roas, impressions, clicks, ctr, cpc, cpm, daily_budget, start_time",
  );
  if (!data) {
    const metaResult = await fetchCampaignById(campaignId);
    return metaResult.campaign ? { campaign: metaResult.campaign } : null;
  }

  const spend = centsToDollars(data.spend) ?? 0;
  const roas = toNumber(data.roas);

  return {
    campaign: {
      campaignId: data.campaign_id,
      name: data.name ?? campaignId,
      status: data.status ?? "unknown",
      objective: data.objective ?? "",
      clientSlug: data.client_slug ?? "unknown",
      campaignType: data.campaign_type ?? "sales",
      spend,
      roas,
      revenue: roas != null ? spend * roas : null,
      impressions: toNumber(data.impressions) ?? 0,
      clicks: toNumber(data.clicks) ?? 0,
      ctr: toNumber(data.ctr),
      cpc: toNumber(data.cpc),
      cpm: toNumber(data.cpm),
      dailyBudget: centsToDollars(data.daily_budget),
      startTime: data.start_time ?? null,
    },
  };
}
