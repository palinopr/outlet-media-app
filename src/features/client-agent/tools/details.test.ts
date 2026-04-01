import { beforeEach, describe, expect, it, vi } from "vitest";

const { getCampaignDetail, getEventDetail } = vi.hoisted(() => ({
  getCampaignDetail: vi.fn(),
  getEventDetail: vi.fn(),
}));
const { getReportsData } = vi.hoisted(() => ({
  getReportsData: vi.fn(),
}));

vi.mock("@/features/reports/server", () => ({
  getReportsData,
}));

vi.mock("../readers", () => ({
  loadClientAgentCampaignDetail: getCampaignDetail,
  loadClientAgentEventDetail: getEventDetail,
}));

import {
  getCampaignDetails,
  getCreativeDetails,
  getEventDetails,
} from "./details";

const broadScope = {
  clientId: "client_1",
  clientMemberId: "member_1",
  clientSlug: "acme",
  allowedCampaignIds: ["cmp_1"],
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

describe("detail tools", () => {
  beforeEach(() => {
    getCampaignDetail.mockReset();
    getEventDetail.mockReset();
    getReportsData.mockReset();

    getReportsData.mockResolvedValue({
      campaigns: [{ campaignId: "cmp_1", name: "Campaign 1" }],
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
      campaign: {
        campaignId: "cmp_1",
        name: "Campaign 1",
        spend: 4200,
        revenue: 13440,
        roas: 3.2,
        impressions: 220000,
        clicks: 5400,
        ctr: 2.45,
      },
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

    getEventDetail.mockResolvedValue({
      event: {
        id: "evt_1",
        name: "Event 1",
        sellThrough: 46,
        conversionRate: 2,
        edpTotalViews: 2300,
      },
      snapshots: [
        { date: "2026-03-10", ticketsSold: 100, ticketsAvailable: 900, gross: 1000 },
        { date: "2026-03-11", ticketsSold: 120, ticketsAvailable: 880, gross: 1400 },
      ],
      dailyDeltas: [{ date: "2026-03-11", label: "Mar 11", ticketsDelta: 20, revenueDelta: 400 }],
    });
  });

  it("returns campaign details without inlining breakdown families", async () => {
    const result = await getCampaignDetails({
      scope: broadScope,
      args: { campaignIds: ["cmp_1"], range: lifetimeRange },
    });

    expect(result.status).toBe("ok");
    if (result.status !== "ok") {
      throw new Error("expected campaign details");
    }
    expect(result.data.campaigns[0]).toMatchObject({
      campaignId: "cmp_1",
      metrics: expect.any(Object),
    });
    expect(result.data.campaigns[0]).not.toHaveProperty("demographics");
  });

  it("returns event details with range metrics and current snapshot fields", async () => {
    const result = await getEventDetails({
      scope: broadScope,
      args: { eventIds: ["evt_1"], range: lifetimeRange },
    });

    expect(result.status).toBe("ok");
    if (result.status !== "ok") {
      throw new Error("expected event details");
    }
    expect(result.data.events[0]).toMatchObject({
      eventId: "evt_1",
      metrics: expect.objectContaining({
        ticketsSold: expect.any(Number),
        grossUsd: expect.any(Number),
        currentSellThroughPct: expect.any(Number),
        currentConversionPct: expect.any(Number),
        currentViews: expect.any(Number),
      }),
    });
  });

  it("returns creative details scoped to allowed campaigns", async () => {
    const result = await getCreativeDetails({
      scope: broadScope,
      args: { creativeIds: null, query: "Bay Area", range: lifetimeRange },
    });

    expect(result.status).toBe("ok");
    if (result.status !== "ok") {
      throw new Error("expected creative details");
    }
    expect(result.data.creatives[0]).toMatchObject({
      creativeId: expect.any(String),
      campaignId: expect.any(String),
      metrics: expect.objectContaining({
        spendUsd: expect.any(Number),
        roas: expect.any(Number),
        ctr: expect.any(Number),
      }),
    });
  });

  it("returns creative details for broad client scope without explicit campaign ids", async () => {
    const result = await getCreativeDetails({
      scope: {
        ...broadScope,
        allowedCampaignIds: null,
      },
      args: { creativeIds: null, query: "Bay Area", range: lifetimeRange },
    });

    expect(result.status).toBe("ok");
    if (result.status !== "ok") {
      throw new Error("expected creative details for broad scope");
    }

    expect(result.data.creatives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          creativeId: "ad_1",
          campaignId: "cmp_1",
        }),
      ]),
    );
  });
});
