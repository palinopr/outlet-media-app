import { fetchAllCampaigns, type MetaCampaignCard, type DailyInsight } from "@/lib/meta-campaigns";
import { type DateRange } from "@/lib/constants";

export type { MetaCampaignCard, DailyInsight, DateRange };

export interface CampaignsData {
  campaigns: MetaCampaignCard[];
  clients: string[];
  dailyInsights: DailyInsight[];
  error: string | null;
}

export async function getCampaigns(
  clientSlug: string | null,
  range: DateRange,
): Promise<CampaignsData> {
  const result = await fetchAllCampaigns(range, clientSlug);

  return {
    campaigns: result.campaigns,
    clients: result.clients,
    dailyInsights: result.dailyInsights,
    error: result.error,
  };
}
