import { beforeEach, describe, expect, it, vi } from "vitest";

const { getCampaignDetail, getReportsData } = vi.hoisted(() => ({
  getCampaignDetail: vi.fn(),
  getReportsData: vi.fn(),
}));

vi.mock("@/features/reports/server", () => ({
  getReportsData,
}));

vi.mock("../readers", () => ({
  loadClientAgentCampaignDetail: getCampaignDetail,
  loadClientAgentEventDetail: vi.fn(),
}));

import {
  getDemographicBreakdown,
  getGeographyBreakdown,
  getPlacementBreakdown,
} from "./breakdowns";

const broadScope = {
  clientId: "client_1",
  clientMemberId: "member_1",
  clientSlug: "acme",
  allowedCampaignIds: null,
  allowedEventIds: null,
  eventsEnabled: true,
  viewer: "member" as const,
};

const lifetimeRange = {
  preset: "lifetime" as const,
  startDate: "1900-01-01",
  endDate: "2026-04-01",
  timezone: "America/Chicago",
};

describe("breakdown tools", () => {
  beforeEach(() => {
    getCampaignDetail.mockReset();
    getReportsData.mockReset();

    getReportsData.mockResolvedValue({
      campaigns: [{ campaignId: "cmp_1" }, { campaignId: "cmp_2" }],
      snapshots: [],
      trendData: [],
      events: [],
      summary: {
        totalSpend: 0,
        totalRevenue: 0,
        blendedRoas: 0,
        totalImpressions: 0,
        totalClicks: 0,
        totalTicketsSold: 0,
        avgCpc: 0,
        avgCtr: 0,
      },
      dataSource: "meta_api",
      clients: ["acme"],
    });

    getCampaignDetail
      .mockResolvedValueOnce({
        campaign: { campaignId: "cmp_1", name: "Campaign 1" },
        ageGender: [
          {
            age: "25-34",
            gender: "Female",
            spend: 200,
            impressions: 1000,
            clicks: 40,
            roas: 3.5,
          },
        ],
        geography: [
          {
            market: "Miami",
            marketType: "city",
            spend: 200,
            impressions: 1000,
            clicks: 50,
          },
        ],
        placements: [
          {
            platform: "Instagram",
            position: "Feed",
            spend: 200,
            impressions: 1000,
            clicks: 50,
          },
        ],
      })
      .mockResolvedValueOnce({
        campaign: { campaignId: "cmp_2", name: "Campaign 2" },
        ageGender: [],
        geography: [],
        placements: [],
      });
  });

  it("returns normalized demographic rows", async () => {
    const result = await getDemographicBreakdown({
      scope: broadScope,
      args: { campaignIds: null, range: lifetimeRange },
    });

    expect(result.status).toBe("ok");
    if (result.status !== "ok") {
      throw new Error("expected demographic rows");
    }
    expect(result.data.rows[0]).toMatchObject({
      age: expect.any(String),
      gender: expect.any(String),
      spendUsd: expect.any(Number),
    });
  });

  it("returns normalized geography rows", async () => {
    const result = await getGeographyBreakdown({
      scope: broadScope,
      args: { campaignIds: null, range: lifetimeRange },
    });

    expect(result.status).toBe("ok");
    if (result.status !== "ok") {
      throw new Error("expected geography rows");
    }
    expect(result.data.rows[0]).toMatchObject({
      market: expect.any(String),
      marketType: expect.any(String),
      spendUsd: expect.any(Number),
      roas: null,
    });
  });

  it("returns normalized placement rows", async () => {
    const result = await getPlacementBreakdown({
      scope: broadScope,
      args: { campaignIds: null, range: lifetimeRange },
    });

    expect(result.status).toBe("ok");
    if (result.status !== "ok") {
      throw new Error("expected placement rows");
    }
    expect(result.data.rows[0]).toMatchObject({
      platform: expect.any(String),
      position: expect.any(String),
      spendUsd: expect.any(Number),
      ctr: expect.any(Number),
    });
  });
});
