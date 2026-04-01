import { beforeEach, describe, expect, it, vi } from "vitest";

const { getCampaignDetail, getEventDetail, getReportsData } = vi.hoisted(() => ({
  getCampaignDetail: vi.fn(),
  getEventDetail: vi.fn(),
  getReportsData: vi.fn(),
}));

vi.mock("@/features/reports/server", () => ({
  getReportsData,
}));

vi.mock("../readers", () => ({
  loadClientAgentCampaignDetail: getCampaignDetail,
  loadClientAgentEventDetail: getEventDetail,
}));

import { compareEntities, getTimeseries } from "./compare-timeseries";

const broadScope = {
  clientId: "client_1",
  clientMemberId: "member_1",
  clientSlug: "acme",
  allowedCampaignIds: ["cmp_1", "cmp_2"],
  allowedEventIds: ["evt_1"],
  eventsEnabled: true,
  viewer: "member" as const,
};

const lifetimeRange = {
  preset: "lifetime" as const,
  startDate: "1900-01-01",
  endDate: "2026-04-01",
  timezone: "America/Chicago",
};

describe("compare and timeseries tools", () => {
  beforeEach(() => {
    getReportsData.mockReset();
    getCampaignDetail.mockReset();
    getEventDetail.mockReset();

    getReportsData.mockResolvedValue({
      campaigns: [
        {
          campaignId: "cmp_1",
          name: "Campaign 1",
          spend: 1000,
          revenue: 3000,
          roas: 3,
          impressions: 10000,
          clicks: 200,
          ctr: 2,
          cpc: 5,
          cpm: 10,
        },
        {
          campaignId: "cmp_2",
          name: "Campaign 2",
          spend: 900,
          revenue: 1800,
          roas: 2,
          impressions: 8000,
          clicks: 150,
          ctr: 1.8,
          cpc: 6,
          cpm: 11,
        },
      ],
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

    getCampaignDetail.mockResolvedValue({
      campaign: { campaignId: "cmp_1", name: "Campaign 1" },
      daily: [
        {
          date: "2026-03-01",
          spend: 100,
          revenue: 300,
          roas: 3,
          impressions: 1000,
          clicks: 40,
          ctr: 2.3,
        },
        {
          date: "2026-03-15",
          spend: 120,
          revenue: 360,
          roas: 3,
          impressions: 1100,
          clicks: 44,
          ctr: 2.4,
        },
      ],
      ads: [
        {
          adId: "ad_1",
          name: "video 4 - Bay Area",
          spend: 101,
          revenue: 0,
          roas: 0,
          impressions: 5000,
          clicks: 162,
          ctr: 3.24,
          cpc: 1.5,
        },
      ],
    });
  });

  it("compares campaigns with a valid ads metric", async () => {
    const result = await compareEntities({
      scope: broadScope,
      args: {
        entityType: "campaign",
        entityIds: ["cmp_1", "cmp_2"],
        metric: "roas",
        range: lifetimeRange,
      },
    });

    expect(result.status).toBe("ok");
  });

  it("returns a monthly spend series", async () => {
    const result = await getTimeseries({
      scope: broadScope,
      args: {
        domain: "ads",
        entityType: "campaign",
        entityIds: ["cmp_1"],
        metric: "spend",
        range: lifetimeRange,
        interval: "month",
      },
    });

    expect(result.status).toBe("ok");
    if (result.status !== "ok") {
      throw new Error("expected timeseries");
    }
    expect(result.data.series.length).toBeGreaterThan(0);
  });

  it("compares creatives even when the member has broad campaign scope", async () => {
    const result = await compareEntities({
      scope: {
        ...broadScope,
        allowedCampaignIds: null,
      },
      args: {
        entityType: "creative",
        entityIds: ["ad_1"],
        metric: "spend",
        range: lifetimeRange,
      },
    });

    expect(result.status).toBe("ok");
    if (result.status !== "ok") {
      throw new Error("expected creative comparison rows");
    }

    expect(result.data.rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entityId: "ad_1",
          entityType: "creative",
        }),
      ]),
    );
  });
});
