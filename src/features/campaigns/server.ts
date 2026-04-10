import { mapAssetRows } from "@/features/assets/lib";
import { listCampaignAssets } from "@/features/assets/server";
import { listCampaignActionItems } from "@/features/campaign-action-items/server";
import { listCampaignComments } from "@/features/campaign-comments/server";
import { listCampaignApprovalRequests } from "@/features/approvals/server";
import { listCampaignSystemEvents } from "@/features/system-events/server";
import { getEventRecordById, type EventOperatingRecord } from "@/features/events/server";
import type { MetaCampaignCard } from "@/lib/meta-campaigns";
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
  tm_event_id: string | null;
}

export interface CampaignOperatingData {
  actionItems: Awaited<ReturnType<typeof listCampaignActionItems>>;
  approvals: Awaited<ReturnType<typeof listCampaignApprovalRequests>>;
  assets: ReturnType<typeof mapAssetRows>;
  campaign: MetaCampaignCard;
  comments: Awaited<ReturnType<typeof listCampaignComments>>;
  linkedEvents: EventOperatingRecord[];
  systemEvents: Awaited<ReturnType<typeof listCampaignSystemEvents>>;
}


export async function getCampaignOperatingData(campaignId: string): Promise<CampaignOperatingData | null> {
  if (!supabaseAdmin) throw new Error("DB not configured");

  const data = await getEffectiveCampaignRowById<CampaignOperatingRow>(
    campaignId,
    "campaign_id, name, status, objective, client_slug, campaign_type, spend, roas, impressions, clicks, ctr, cpc, cpm, daily_budget, start_time, tm_event_id",
  );
  if (!data) return null;

  const campaign: MetaCampaignCard = {
    campaignId: data.campaign_id as string,
    name: (data.name as string) ?? campaignId,
    status: (data.status as string) ?? "unknown",
    objective: (data.objective as string) ?? "",
    clientSlug: (data.client_slug as string | null) ?? "unknown",
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
      linkedEvents: [],
      systemEvents: [],
    };
  }

  const [systemEvents, approvals, assetRows, actionItems, comments, linkedEvent] = await Promise.all([
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
    data.tm_event_id ? getEventRecordById(data.tm_event_id) : Promise.resolve(null),
  ]);

  return {
    actionItems,
    approvals,
    assets: mapAssetRows(assetRows),
    campaign,
    comments,
    linkedEvents: linkedEvent ? [linkedEvent] : [],
    systemEvents,
  };
}

