import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CampaignDetailData, EventDetailData } from "@/app/client/[slug]/types";

const { getCampaignDetail, getEventDetail, getReportsData } = vi.hoisted(() => ({
  getCampaignDetail: vi.fn(),
  getEventDetail: vi.fn(),
  getReportsData: vi.fn(),
}));

vi.mock("@/features/reports/server", () => ({
  getReportsData,
}));

vi.mock("./readers", () => ({
  loadClientAgentCampaignDetail: getCampaignDetail,
  loadClientAgentEventDetail: getEventDetail,
}));

import {
  compareEntities,
  getBreakdowns,
  getEntityDetails,
  getEventInsights,
  getOverview,
  resolvePreviousEventIntent,
  getTimeseries,
  getTopMovers,
  resolveEventIntent,
} from "./data";

const scope = {
  clientId: "client_1",
  clientMemberId: "member_1",
  clientSlug: "acme",
  allowedCampaignIds: ["cmp_1", "cmp_2"],
  allowedEventIds: ["evt_1"],
  eventsEnabled: true,
  viewer: "member" as const,
};

const broadScope = {
  ...scope,
  allowedCampaignIds: null,
  allowedEventIds: null,
};

function makeCampaign(index: number) {
  return {
    campaignId: `cmp_${index}`,
    name: `Campaign ${index}`,
    status: "ACTIVE",
    clientSlug: "acme",
    spend: 1000 + index,
    roas: 2 + index / 10,
    revenue: 2000 + index,
    impressions: 10000 + index,
    clicks: 100 + index,
    ctr: 1.5,
    cpc: 2.1,
    cpm: 10.2,
    dailyBudget: 5000,
    startTime: "2026-03-01T00:00:00.000Z",
  };
}

function makeEvent(index: number) {
  return {
    id: `evt_${index}`,
    name: `Event ${index}`,
    venue: `Venue ${index}`,
    city: `City ${index}`,
    clientSlug: "acme",
    date: `2026-03-${String((index % 28) + 1).padStart(2, "0")}`,
    status: "onsale",
    ticketsSold: 100 + index,
    ticketsAvailable: 200 + index,
    sellThrough: 40 + index,
    avgTicketPrice: 65 + index,
    potentialRevenue: 10000 + index,
    gross: 9000 + index,
    updatedAt: "2026-03-31T12:00:00.000Z",
    ticketPlatform: "ticketmaster" as const,
    artist: `Artist ${index}`,
    ticketsSoldToday: index,
    revenueToday: 200 + index,
    conversionRate: 2.3,
    edpTotalViews: 300 + index,
    edpAvgDailyViews: 20 + index,
  };
}

function buildCampaignDetail(): CampaignDetailData {
  return {
    campaign: {
      campaignId: "cmp_1",
      name: "Campaign 1",
      status: "ACTIVE",
      spend: 4200,
      roas: 3.2,
      revenue: 13440,
      impressions: 220000,
      clicks: 5400,
      ctr: 2.45,
      cpc: 1.8,
      cpm: 12.4,
      dailyBudget: 8000,
      startTime: "2026-03-01T00:00:00.000Z",
    },
    ageGender: Array.from({ length: 20 }, (_, index) => ({
      age: `18-${24 + index}`,
      gender: index % 2 === 0 ? "Male" : "Female",
      spend: 100 + index,
      impressions: 5000 + index,
      clicks: 120 + index,
      ctr: 2.4,
      roas: 3.1,
    })),
    placements: Array.from({ length: 18 }, (_, index) => ({
      platform: index % 2 === 0 ? "Instagram" : "Facebook",
      position: `Placement ${index}`,
      spend: 150 + index,
      impressions: 2000 + index,
      clicks: 60 + index,
      ctr: 2.2,
    })),
    geography: Array.from({ length: 16 }, (_, index) => ({
      market: `Market ${index}`,
      marketType: index % 2 === 0 ? "region" : "country",
      spend: 130 + index,
      impressions: 4000 + index,
      clicks: 70 + index,
      ctr: 1.8,
      cpc: 2.1,
    })),
    ads: Array.from({ length: 15 }, (_, index) => ({
      adId: `ad_${index}`,
      name: `Creative ${index}`,
      status: "ACTIVE",
      thumbnailUrl: null,
      creativeTitle: `Creative ${index}`,
      creativeBody: `Body ${index}`,
      spend: 80 + index,
      impressions: 1500 + index,
      clicks: 45 + index,
      reach: 900 + index,
      ctr: 2.9,
      cpc: 1.7,
      roas: 2.7,
      revenue: 400 + index,
    })),
    hourly: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      spend: 40 + hour,
      impressions: 1000 + hour,
      clicks: 30 + hour,
      ctr: 2.1,
    })),
    daily: Array.from({ length: 40 }, (_, index) => ({
      date: `2026-03-${String((index % 31) + 1).padStart(2, "0")}`,
      dayOfWeek: index % 7,
      dayLabel: "Mon",
      spend: 100 + index,
      revenue: 300 + index,
      roas: 3 + index / 100,
      impressions: 1000 + index,
      clicks: 40 + index,
      ctr: 2.3,
    })),
    recommendations: [],
    dataSource: "meta_api",
    rangeLabel: "Last 30 Days",
  };
}

function buildEventDetail(): EventDetailData {
  return {
    event: {
      id: "evt_1",
      name: "Event 1",
      venue: "Arena 1",
      city: "Miami",
      date: "2026-04-15",
      status: "onsale",
      ticketsSold: 1200,
      ticketsAvailable: 800,
      sellThrough: 60,
      avgTicketPrice: 75,
      potentialRevenue: 150000,
      gross: 90000,
      updatedAt: "2026-03-31T12:00:00.000Z",
      ticketPlatform: "ticketmaster",
      artist: "Artist 1",
      ticketsSoldToday: 35,
      revenueToday: 2600,
      conversionRate: 4.1,
      edpTotalViews: 12000,
      edpAvgDailyViews: 300,
    },
    snapshots: Array.from({ length: 45 }, (_, index) => ({
      date: `2026-03-${String((index % 31) + 1).padStart(2, "0")}`,
      ticketsSold: 100 + index,
      ticketsAvailable: 300 - index,
      gross: 10000 + index * 100,
    })),
    dailyDeltas: Array.from({ length: 20 }, (_, index) => ({
      date: `2026-03-${String((index % 31) + 1).padStart(2, "0")}`,
      label: `Day ${index}`,
      ticketsDelta: 10 + index,
      revenueDelta: 100 + index,
    })),
    velocity: {
      avgDailySales: 20,
      recentDailySales: 24,
      trend: "accelerating",
      trendPct: 12,
      daysUntilEvent: 15,
      projectedTotalSold: 1500,
    },
    audience: null,
    linkedCampaigns: Array.from({ length: 16 }, (_, index) => ({
      campaignId: `cmp_${index + 1}`,
      name: `Campaign ${index + 1}`,
      status: "ACTIVE",
      spend: 100 + index,
      roas: 2.5,
      impressions: 1000 + index,
      clicks: 50 + index,
    })),
    channelBreakdown: {
      internet: 60,
      mobile: 25,
      box: 10,
      phone: 5,
    },
  };
}

describe("client-agent data tools", () => {
  beforeEach(() => {
    getReportsData.mockReset();
    getCampaignDetail.mockReset();
    getEventDetail.mockReset();

    getReportsData.mockResolvedValue({
      campaigns: Array.from({ length: 14 }, (_, index) => makeCampaign(index + 1)),
      snapshots: [],
      trendData: Array.from({ length: 40 }, (_, index) => ({
        date: `2026-03-${String((index % 31) + 1).padStart(2, "0")}`,
        roas: 2.5 + index / 100,
        spend: 1000 + index * 10,
      })),
      events: Array.from({ length: 14 }, (_, index) => makeEvent(index + 1)),
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
    getCampaignDetail.mockResolvedValue(buildCampaignDetail());
    getEventDetail.mockResolvedValue(buildEventDetail());
  });

  it("returns the count of allowed events for broad show inventory questions", async () => {
    getReportsData.mockResolvedValueOnce({
      campaigns: [],
      snapshots: [],
      trendData: [],
      events: [makeEvent(1), makeEvent(2), makeEvent(3)],
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

    const result = await resolveEventIntent({
      message: "how many shows we have",
      scope: {
        ...broadScope,
        allowedEventIds: ["evt_1", "evt_2", "evt_3"],
      },
    });

    expect(result).toMatchObject({
      kind: "count",
      totalEvents: 3,
    });
  });

  it("picks the most recent dated event for 'last show'", async () => {
    getReportsData.mockResolvedValueOnce({
      campaigns: [],
      snapshots: [],
      trendData: [],
      events: [
        { ...makeEvent(1), date: "2026-03-20" },
        { ...makeEvent(2), date: "2026-04-02" },
        { ...makeEvent(3), date: "2026-03-29" },
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
    getEventDetail.mockImplementation(async ({ eventId }: { eventId: string }) => ({
      ...buildEventDetail(),
      event: {
        ...buildEventDetail().event,
        id: eventId,
        name: eventId === "evt_2" ? "Event 2" : `Event ${eventId.slice(-1)}`,
        date:
          eventId === "evt_2"
            ? "2026-04-02"
            : eventId === "evt_3"
              ? "2026-03-29"
              : "2026-03-20",
      },
    }));

    const result = await resolveEventIntent({
      message: "how we did last show",
      scope: broadScope,
    });

    expect(result).toMatchObject({
      kind: "entity",
      eventId: "evt_2",
    });
  });

  it("returns clarify when multiple events share the same latest date", async () => {
    getReportsData.mockResolvedValueOnce({
      campaigns: [],
      snapshots: [],
      trendData: [],
      events: [
        { ...makeEvent(1), date: "2026-04-05" },
        { ...makeEvent(2), date: "2026-04-05" },
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

    const result = await resolveEventIntent({
      message: "how we did last show",
      scope: broadScope,
    });

    expect(result).toMatchObject({
      kind: "clarify",
      choices: expect.arrayContaining([
        expect.objectContaining({ entityId: "evt_1", entityType: "event" }),
        expect.objectContaining({ entityId: "evt_2", entityType: "event" }),
      ]),
    });
  });

  it("uses event detail dates when summary event dates are stale or missing", async () => {
    getReportsData.mockResolvedValueOnce({
      campaigns: [],
      snapshots: [],
      trendData: [],
      events: [
        { ...makeEvent(1), date: "2026-04-02" },
        { ...makeEvent(2), date: null as unknown as string },
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
    getEventDetail.mockImplementation(async ({ eventId }: { eventId: string }) => ({
      ...buildEventDetail(),
      event: {
        ...buildEventDetail().event,
        id: eventId,
        name: eventId === "evt_2" ? "Event 2" : "Event 1",
        date: eventId === "evt_2" ? "2026-04-10" : "2026-04-02",
      },
    }));

    const result = await resolveEventIntent({
      message: "how we did last show",
      scope: broadScope,
    });

    expect(result).toMatchObject({
      kind: "entity",
      eventId: "evt_2",
    });
  });

  it("returns none when no allowed events exist", async () => {
    getReportsData.mockResolvedValueOnce({
      campaigns: [],
      snapshots: [],
      trendData: [],
      events: [makeEvent(1), makeEvent(2)],
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

    const result = await resolveEventIntent({
      message: "how we did last show",
      scope: {
        ...broadScope,
        allowedEventIds: [],
      },
    });

    expect(result).toEqual({ kind: "none" });
  });

  it("resolves the show immediately before the current event", async () => {
    getReportsData.mockResolvedValueOnce({
      campaigns: [],
      snapshots: [],
      trendData: [],
      events: [
        { ...makeEvent(1), date: "2026-04-10" },
        { ...makeEvent(2), date: "2026-04-05" },
        { ...makeEvent(3), date: "2026-03-28" },
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
    getEventDetail.mockImplementation(async ({ eventId }: { eventId: string }) => ({
      ...buildEventDetail(),
      event: {
        ...buildEventDetail().event,
        id: eventId,
        name: eventId === "evt_2" ? "Event 2" : eventId === "evt_1" ? "Event 1" : "Event 3",
        date:
          eventId === "evt_1"
            ? "2026-04-10"
            : eventId === "evt_2"
              ? "2026-04-05"
              : "2026-03-28",
      },
    }));

    const result = await resolvePreviousEventIntent({
      currentEventId: "evt_1",
      scope: broadScope,
    });

    expect(result).toMatchObject({
      kind: "entity",
      eventId: "evt_2",
    });
  });

  it("aggregates audience breakdowns across allowed campaigns when no single campaign is specified", async () => {
    getReportsData.mockResolvedValueOnce({
      campaigns: [makeCampaign(1), makeCampaign(2)],
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
        ...buildCampaignDetail(),
        campaign: { ...buildCampaignDetail().campaign, campaignId: "cmp_1", name: "Campaign 1" },
        ageGender: [
          {
            age: "25-34",
            gender: "Female",
            spend: 200,
            impressions: 1000,
            clicks: 40,
            ctr: 4,
            roas: 3.5,
          },
          {
            age: "35-44",
            gender: "Male",
            spend: 100,
            impressions: 800,
            clicks: 16,
            ctr: 2,
            roas: 2.1,
          },
        ],
      })
      .mockResolvedValueOnce({
        ...buildCampaignDetail(),
        campaign: { ...buildCampaignDetail().campaign, campaignId: "cmp_2", name: "Campaign 2" },
        ageGender: [
          {
            age: "25-34",
            gender: "Female",
            spend: 300,
            impressions: 1200,
            clicks: 60,
            ctr: 5,
            roas: 4.1,
          },
          {
            age: "45-54",
            gender: "Female",
            spend: 90,
            impressions: 700,
            clicks: 14,
            ctr: 2,
            roas: 1.9,
          },
        ],
      });

    const result = await getBreakdowns({
      scope: broadScope,
      entityType: "campaign",
      entityId: null,
      range: {
        preset: "last_30_days",
        startDate: "2026-03-01",
        endDate: "2026-03-31",
        timezone: "America/Chicago",
      },
      breakdown: "age_gender",
    });

    expect(result.status).toBe("ok");
    if (result.status !== "ok") {
      throw new Error("expected aggregate breakdown");
    }

    expect(result.blocks[0]).toMatchObject({ type: "table" });
    expect(result.blocks[0]?.type === "table" && result.blocks[0].rows[0]).toMatchObject({
      Age: "25-34",
      Gender: "Female",
      Spend: "$500",
      CTR: "4.55",
      ROAS: "3.86",
    });
    expect(result.referencedEntities).toEqual([
      { entityId: "cmp_1", entityType: "campaign", name: "Campaign 1" },
      { entityId: "cmp_2", entityType: "campaign", name: "Campaign 2" },
    ]);
  });

  it("caps overview blocks and filters out-of-scope campaigns and events", async () => {
    const range = {
      preset: "last_30_days" as const,
      startDate: "2026-03-01",
      endDate: "2026-03-31",
      timezone: "America/Chicago",
    };
    const result = await getOverview({
      scope,
      range,
    });

    expect(result.status).toBe("ok");
    if (result.status !== "ok") {
      throw new Error("expected overview data");
    }

    expect(result.blocks[0]).toMatchObject({ type: "metric_cards" });
    expect(result.blocks[0]?.type === "metric_cards" && result.blocks[0].cards).toHaveLength(6);
    expect(result.blocks[1]).toMatchObject({ type: "table" });
    expect(result.blocks[1]?.type === "table" && result.blocks[1].rows).toHaveLength(2);
    expect(result.blocks[2]).toMatchObject({ type: "table" });
    expect(result.blocks[2]?.type === "table" && result.blocks[2].rows).toHaveLength(1);
    expect(result.blocks[3]).toMatchObject({ type: "chart" });
    expect(
      result.blocks[3]?.type === "chart" && result.blocks[3].series[0]?.points,
    ).toHaveLength(31);
    expect(result.referencedEntities).toEqual([
      { entityId: "cmp_1", entityType: "campaign", name: "Campaign 1" },
      { entityId: "cmp_2", entityType: "campaign", name: "Campaign 2" },
      { entityId: "evt_1", entityType: "event", name: "Event 1" },
    ]);
    expect(getReportsData).toHaveBeenCalledWith(
      expect.objectContaining({
        clientSlug: scope.clientSlug,
        range: "30",
      }),
    );
  });

  it("returns typed no-data results for out-of-scope entity details", async () => {
    const campaignResult = await getEntityDetails({
      scope,
      entityId: "cmp_9",
      entityType: "campaign",
      range: {
        preset: "last_30_days",
        startDate: "2026-03-01",
        endDate: "2026-03-31",
        timezone: "America/Chicago",
      },
    });

    expect(campaignResult).toMatchObject({
      status: "no_data",
      reason: "not_found",
    });
    expect(getCampaignDetail).not.toHaveBeenCalledWith(
      scope.clientSlug,
      "cmp_9",
      expect.anything(),
      expect.anything(),
    );
  });

  it("passes the resolved range through to campaign detail reads", async () => {
    const range = {
      preset: "this_quarter" as const,
      startDate: "2026-01-01",
      endDate: "2026-03-31",
      timezone: "America/Chicago",
    };

    const result = await getEntityDetails({
      scope,
      entityId: "cmp_1",
      entityType: "campaign",
      range,
    });

    expect(result.status).toBe("ok");
    expect(getCampaignDetail).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: scope.clientSlug,
        campaignId: "cmp_1",
        range,
      }),
    );
  });

  it("falls back to campaign aggregate metrics when the detail loader has no daily series", async () => {
    getCampaignDetail.mockResolvedValueOnce({
      ...buildCampaignDetail(),
      daily: [],
      campaign: {
        ...buildCampaignDetail().campaign,
        spend: 4200,
        revenue: 13440,
        roas: 3.2,
        impressions: 220000,
        clicks: 5400,
        ctr: 2.45,
      },
    });

    const result = await getEntityDetails({
      scope,
      entityId: "cmp_1",
      entityType: "campaign",
      range: {
        preset: "this_month",
        startDate: "2026-03-01",
        endDate: "2026-03-31",
        timezone: "America/Chicago",
      },
    });

    expect(result.status).toBe("ok");
    if (result.status !== "ok") {
      throw new Error("expected campaign detail data");
    }

    expect(result.blocks[0]).toMatchObject({
      type: "metric_cards",
      cards: expect.arrayContaining([
        expect.objectContaining({ label: "Spend", value: "$4,200" }),
        expect.objectContaining({ label: "Revenue", value: "$13,440" }),
        expect.objectContaining({ label: "Impressions", value: "220,000" }),
      ]),
    });
  });

  it("labels current event cards distinctly from requested-range metrics", async () => {
    const result = await getEntityDetails({
      scope,
      entityId: "evt_1",
      entityType: "event",
      range: {
        preset: "custom",
        startDate: "2026-03-11",
        endDate: "2026-03-12",
        timezone: "America/Chicago",
      },
    });

    expect(result.status).toBe("ok");
    if (result.status !== "ok") {
      throw new Error("expected event detail data");
    }

    expect(result.blocks[0]).toMatchObject({
      type: "metric_cards",
      cards: expect.arrayContaining([
        expect.objectContaining({ label: "Tickets Sold" }),
        expect.objectContaining({ label: "Current Sell Through" }),
        expect.objectContaining({ label: "Current Views" }),
        expect.objectContaining({ label: "Current Conversion" }),
      ]),
    });
  });

  it("filters compare results to in-scope entities only", async () => {
    const range = {
      preset: "this_quarter" as const,
      startDate: "2026-01-01",
      endDate: "2026-03-31",
      timezone: "America/Chicago",
    };
    const result = await compareEntities({
      scope,
      entityType: "campaign",
      entityIds: ["cmp_1", "cmp_2", "cmp_9"],
      range,
      metric: "spend",
    });

    expect(result.status).toBe("ok");
    if (result.status !== "ok") {
      throw new Error("expected compare data");
    }

    expect(result.blocks[0]).toMatchObject({ type: "table" });
    expect(result.blocks[0]?.type === "table" && result.blocks[0].rows).toEqual([
      expect.objectContaining({ Entity: "Campaign 1" }),
      expect.objectContaining({ Entity: "Campaign 2" }),
    ]);
    expect(getReportsData).toHaveBeenCalledWith(
      expect.objectContaining({
        clientSlug: scope.clientSlug,
        range: {
          since: "2026-01-01",
          until: "2026-03-31",
        },
      }),
    );
  });

  it("caps campaign breakdown tables at 12 rows", async () => {
    const range = {
      preset: "this_month" as const,
      startDate: "2026-03-01",
      endDate: "2026-03-31",
      timezone: "America/Chicago",
    };
    const result = await getBreakdowns({
      scope,
      entityType: "campaign",
      entityId: "cmp_1",
      range,
      breakdown: "creative",
    });

    expect(result.status).toBe("ok");
    if (result.status !== "ok") {
      throw new Error("expected breakdown data");
    }

    expect(result.blocks[0]).toMatchObject({ type: "table" });
    expect(result.blocks[0]?.type === "table" && result.blocks[0].rows).toHaveLength(12);
    expect(getCampaignDetail).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: scope.clientSlug,
        campaignId: "cmp_1",
        range,
      }),
    );
  });

  it("caps chart series at 31 points for timeseries output", async () => {
    const range = {
      preset: "custom" as const,
      startDate: "2026-03-10",
      endDate: "2026-03-20",
      timezone: "America/Chicago",
    };
    const result = await getTimeseries({
      scope,
      entityType: "campaign",
      entityIds: ["cmp_1"],
      range,
      metric: "spend",
      interval: "day",
    });

    expect(result.status).toBe("ok");
    if (result.status !== "ok") {
      throw new Error("expected timeseries data");
    }

    expect(result.blocks[0]).toMatchObject({ type: "chart" });
    expect(result.blocks[0]?.type === "chart" && result.blocks[0].series[0]?.points).toHaveLength(
      11,
    );
    expect(getCampaignDetail).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: scope.clientSlug,
        campaignId: "cmp_1",
        range,
      }),
    );
  });

  it("caps top movers at 10 rows", async () => {
    const range = {
      preset: "this_week" as const,
      startDate: "2026-03-29",
      endDate: "2026-03-31",
      timezone: "America/Chicago",
    };
    const result = await getTopMovers({
      scope: broadScope,
      entityType: "campaign",
      range,
      metric: "roas",
      direction: "desc",
    });

    expect(result.status).toBe("ok");
    if (result.status !== "ok") {
      throw new Error("expected top movers data");
    }

    expect(result.blocks[0]).toMatchObject({ type: "table" });
    expect(result.blocks[0]?.type === "table" && result.blocks[0].rows).toHaveLength(10);
    expect(getReportsData).toHaveBeenCalledWith(
      expect.objectContaining({
        clientSlug: broadScope.clientSlug,
        range: {
          since: "2026-03-29",
          until: "2026-03-31",
        },
      }),
    );
  });

  it("returns event insights only for events still in scope and filters metrics to the requested range", async () => {
    getEventDetail.mockResolvedValueOnce({
      event: {
        ...buildEventDetail().event,
        id: "evt_1",
        name: "Event 1",
      },
      snapshots: [
        { date: "2026-03-10", ticketsSold: 100, ticketsAvailable: 900, gross: 1000 },
        { date: "2026-03-11", ticketsSold: 120, ticketsAvailable: 880, gross: 1400 },
        { date: "2026-03-12", ticketsSold: 150, ticketsAvailable: 850, gross: 2000 },
      ],
      dailyDeltas: [
        { date: "2026-03-11", label: "Mar 11", ticketsDelta: 20, revenueDelta: 400 },
        { date: "2026-03-12", label: "Mar 12", ticketsDelta: 30, revenueDelta: 600 },
      ],
      velocity: buildEventDetail().velocity,
      audience: null,
      linkedCampaigns: [],
      channelBreakdown: null,
    });

    const result = await getEventInsights({
      scope,
      eventIds: ["evt_1", "evt_9"],
      range: {
        preset: "custom",
        startDate: "2026-03-11",
        endDate: "2026-03-12",
        timezone: "America/Chicago",
      },
    });

    expect(result.status).toBe("ok");
    if (result.status !== "ok") {
      throw new Error("expected event insights data");
    }

    expect(getEventDetail).toHaveBeenCalledTimes(1);
    expect(result.referencedEntities).toEqual([
      { entityId: "evt_1", entityType: "event", name: "Event 1" },
    ]);
    expect(result.blocks[0]).toMatchObject({ type: "table" });
    expect(result.blocks[0]?.type === "table" && result.blocks[0].rows).toEqual([
      {
        Event: "Event 1",
        "Tickets Sold": 50,
        Gross: "$1,000",
      },
    ]);
  });
});
