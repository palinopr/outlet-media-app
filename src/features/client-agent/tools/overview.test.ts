import { beforeEach, describe, expect, it, vi } from "vitest";

const { getEventDetail, getReportsData } = vi.hoisted(() => ({
  getEventDetail: vi.fn(),
  getReportsData: vi.fn(),
}));

vi.mock("@/features/reports/server", () => ({
  getReportsData,
}));

vi.mock("../readers", () => ({
  loadClientAgentCampaignDetail: vi.fn(),
  loadClientAgentEventDetail: getEventDetail,
}));

import { getAdsOverview, getEventsOverview } from "./overview";

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

describe("overview tools", () => {
  beforeEach(() => {
    getReportsData.mockReset();
    getEventDetail.mockReset();

    getReportsData.mockResolvedValue({
      campaigns: [
        {
          campaignId: "cmp_1",
          name: "Campaign 1",
          spend: 22000,
          revenue: 88000,
          roas: 4,
          impressions: 880000,
          clicks: 22000,
          ctr: 2.5,
          cpc: 1,
          cpm: 25,
        },
      ],
      snapshots: [],
      trendData: [],
      events: [{ id: "evt_1", name: "Event 1" }],
      summary: {
        totalSpend: 22000,
        totalRevenue: 88000,
        blendedRoas: 4,
        totalImpressions: 880000,
        totalClicks: 22000,
        totalTicketsSold: 6400,
        avgCpc: 1.8,
        avgCtr: 2.4,
      },
      dataSource: "meta_api",
      clients: ["acme"],
    });

    getEventDetail.mockResolvedValue({
      event: {
        id: "evt_1",
        name: "Event 1",
        sellThrough: 46,
        edpTotalViews: 2300,
        conversionRate: 2,
      },
      snapshots: [
        { date: "2026-03-10", ticketsSold: 100, ticketsAvailable: 900, gross: 1000 },
        { date: "2026-03-11", ticketsSold: 120, ticketsAvailable: 880, gross: 1400 },
      ],
      dailyDeltas: [{ date: "2026-03-11", label: "Mar 11", ticketsDelta: 20, revenueDelta: 400 }],
    });
  });

  it("returns normalized lifetime ads overview totals", async () => {
    const result = await getAdsOverview({
      scope: broadScope,
      args: { range: lifetimeRange, campaignIds: null, creativeIds: null },
    });

    expect(result).toMatchObject({
      status: "ok",
      data: {
        totals: {
          spendUsd: 22000,
          revenueUsd: 88000,
        },
      },
    });
  });

  it("returns normalized events overview totals", async () => {
    const result = await getEventsOverview({
      scope: broadScope,
      args: { range: lifetimeRange, eventIds: null },
    });

    expect(result).toMatchObject({
      status: "ok",
      data: {
        totals: {
          ticketsSold: expect.any(Number),
          grossUsd: expect.any(Number),
        },
      },
    });
  });
});
