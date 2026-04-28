import { type CampaignRangeInput } from "@/lib/constants";
import { fetchAllCampaigns, type MetaCampaignCard } from "@/lib/meta-campaigns";
import type { ScopeFilter } from "@/lib/member-access";
import type { CampaignCard } from "@/features/client-portal/types";

export type { CampaignRangeInput };


// --- Map shared MetaCampaignCard to client portal CampaignCard ---

export function toCampaignCard(c: MetaCampaignCard): CampaignCard {
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

// --- Campaigns page data (Meta API via shared module + daily insights) ---

export async function getCampaignsPageData(
  slug: string,
  range: CampaignRangeInput,
  scope?: ScopeFilter,
): Promise<{
  campaigns: CampaignCard[];
  snapshots: Array<{ snapshot_date: string; roas: number | null; spend: number | null; campaign_id: string }>;
  dataSource: "meta_api" | "supabase";
}> {
  const result = await fetchAllCampaigns(range, slug);

  let campaigns = result.campaigns
    .map(toCampaignCard)
    .sort((a, b) => {
      const aTime = a.startTime ? new Date(a.startTime).getTime() : 0;
      const bTime = b.startTime ? new Date(b.startTime).getTime() : 0;
      return bTime - aTime;
    });

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

  return {
    campaigns,
    snapshots,
    dataSource: result.error ? "supabase" : "meta_api",
  };
}
