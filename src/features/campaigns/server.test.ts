import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MetaCampaignCard } from "@/lib/meta-campaigns";

const getEffectiveCampaignRowById = vi.fn();
const fetchCampaignById = vi.fn();

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {},
}));

vi.mock("@/lib/campaign-client-assignment", () => ({
  getEffectiveCampaignRowById,
}));

vi.mock("@/lib/meta-campaigns", () => ({
  fetchCampaignById,
}));

const liveCampaign: MetaCampaignCard = {
  campaignId: "120-live",
  name: "Live Meta Campaign",
  status: "ACTIVE",
  objective: "OUTCOME_SALES",
  clientSlug: "sienna",
  campaignType: "sales",
  spend: 25,
  roas: null,
  revenue: null,
  impressions: 1200,
  clicks: 42,
  ctr: 3.5,
  cpc: 0.6,
  cpm: 20.8,
  dailyBudget: 100,
  startTime: "2026-04-01T00:00:00-0400",
};

describe("getCampaignOperatingData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("falls back to live Meta data when a linked campaign is not stored locally", async () => {
    getEffectiveCampaignRowById.mockResolvedValue(null);
    fetchCampaignById.mockResolvedValue({ campaign: liveCampaign, dailyInsights: [], error: null });

    const { getCampaignOperatingData } = await import("./server");
    const data = await getCampaignOperatingData("120-live");

    expect(fetchCampaignById).toHaveBeenCalledWith("120-live");
    expect(data?.campaign).toEqual(liveCampaign);
  });

  it("uses the local campaign row when available", async () => {
    getEffectiveCampaignRowById.mockResolvedValue({
      campaign_id: "cmp_1",
      campaign_type: "sales",
      clicks: 20,
      client_slug: "zamora",
      cpc: 250,
      cpm: 1000,
      ctr: 4,
      daily_budget: 5000,
      impressions: 500,
      name: "Stored Campaign",
      objective: "OUTCOME_SALES",
      roas: 2,
      spend: 10000,
      start_time: "2026-04-01",
      status: "ACTIVE",
    });

    const { getCampaignOperatingData } = await import("./server");
    const data = await getCampaignOperatingData("cmp_1");

    expect(fetchCampaignById).not.toHaveBeenCalled();
    expect(data?.campaign).toMatchObject({
      campaignId: "cmp_1",
      dailyBudget: 50,
      name: "Stored Campaign",
      revenue: 200,
      spend: 100,
    });
  });
});
