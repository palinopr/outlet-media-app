import { mapAssetRows } from "@/features/assets/lib";
import { listCampaignAssets } from "@/features/assets/server";
import { listCampaignActionItems } from "@/features/campaign-action-items/server";
import { listCampaignComments } from "@/features/campaign-comments/server";
import { listCampaignApprovalRequests } from "@/features/approvals/server";
import { listCampaignSystemEvents } from "@/features/system-events/server";
import type { MetaCampaignCard } from "@/lib/meta-campaigns";
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

export async function getCampaignOperatingData(campaignId: string) {
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { data, error } = await supabaseAdmin
    .from("meta_campaigns")
    .select(
      "campaign_id, name, status, objective, client_slug, campaign_type, spend, roas, impressions, clicks, ctr, cpc, cpm, daily_budget, start_time",
    )
    .eq("campaign_id", campaignId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const campaign: MetaCampaignCard = {
    campaignId: data.campaign_id as string,
    name: (data.name as string) ?? campaignId,
    status: (data.status as string) ?? "unknown",
    objective: (data.objective as string) ?? "",
    clientSlug: (data.client_slug as string) ?? "unknown",
    campaignType: (data.campaign_type as string) ?? "sales",
    spend: centsToDollars(data.spend) ?? 0,
    roas: toNumber(data.roas),
    revenue:
      toNumber(data.roas) != null && centsToDollars(data.spend) != null
        ? (centsToDollars(data.spend) as number) * (toNumber(data.roas) as number)
        : null,
    impressions: toNumber(data.impressions) ?? 0,
    clicks: toNumber(data.clicks) ?? 0,
    ctr: toNumber(data.ctr),
    cpc: toNumber(data.cpc),
    cpm: toNumber(data.cpm),
    dailyBudget: centsToDollars(data.daily_budget),
    startTime: (data.start_time as string | null) ?? null,
  };

  if (!data.client_slug) {
    return {
      actionItems: [],
      approvals: [],
      assets: [],
      campaign,
      comments: [],
      events: [],
    };
  }

  const [events, approvals, assetRows, actionItems, comments] = await Promise.all([
    listCampaignSystemEvents({
      audience: "all",
      clientSlug: data.client_slug,
      campaignId,
      limit: 8,
    }),
    listCampaignApprovalRequests({
      audience: "all",
      clientSlug: data.client_slug,
      campaignId,
      limit: 8,
      status: "pending",
    }),
    listCampaignAssets(data.client_slug, campaign.name, 8),
    listCampaignActionItems({
      audience: "all",
      campaignId,
      clientSlug: data.client_slug,
      limit: 16,
    }),
    listCampaignComments({
      audience: "all",
      campaignId,
      clientSlug: data.client_slug,
    }),
  ]);

  return {
    actionItems,
    approvals,
    assets: mapAssetRows(assetRows),
    campaign,
    comments,
    events,
  };
}
