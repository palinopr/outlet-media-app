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

import { searchScope } from "./search";

const broadScope = {
  clientId: "client_1",
  clientMemberId: "member_1",
  clientSlug: "acme",
  allowedCampaignIds: null,
  allowedEventIds: null,
  eventsEnabled: true,
  viewer: "member" as const,
};

describe("searchScope", () => {
  beforeEach(() => {
    getReportsData.mockReset();
    getCampaignDetail.mockReset();

    getReportsData.mockResolvedValue({
      campaigns: [{ campaignId: "cmp_1", name: "Campaign 1" }],
      snapshots: [],
      trendData: [],
      events: [
        {
          id: "evt_1",
          name: "Event 1",
          date: "2026-03-14",
          city: "Chicago",
          venue: "United Center",
        },
      ],
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
      },
      ads: [
        {
          adId: "ad_1",
          name: "video 4 - Bay Area",
        },
      ],
    });
  });

  it("searches campaigns, creatives, and events within scope", async () => {
    const result = await searchScope({
      scope: broadScope,
      args: { query: "Bay Area" },
    });

    expect(result.status).toBe("ok");
    if (result.status !== "ok") {
      throw new Error("expected search matches");
    }
    expect(result.data.matches).toEqual(
      expect.arrayContaining([expect.objectContaining({ entityType: "creative" })]),
    );
  });

  it("lists the full visible scope when the query is wildcarded", async () => {
    const result = await searchScope({
      scope: broadScope,
      args: { query: "*" },
    });

    expect(result.status).toBe("ok");
    if (result.status !== "ok") {
      throw new Error("expected wildcard search matches");
    }

    expect(result.data.matches).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ entityType: "campaign", entityId: "cmp_1" }),
        expect.objectContaining({ entityType: "event", entityId: "evt_1" }),
        expect.objectContaining({ entityType: "creative", entityId: "ad_1" }),
      ]),
    );
  });

  it("returns event chronology metadata for follow-up reasoning", async () => {
    const result = await searchScope({
      scope: broadScope,
      args: { query: "Event" },
    });

    expect(result.status).toBe("ok");
    if (result.status !== "ok") {
      throw new Error("expected event search matches");
    }

    expect(result.data.matches).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entityType: "event",
          entityId: "evt_1",
          date: "2026-03-14",
          city: "Chicago",
          venue: "United Center",
        }),
      ]),
    );
  });
});
