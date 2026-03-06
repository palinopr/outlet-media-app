import { describe, expect, it } from "vitest";
import {
  buildReportsSummary,
  type ReportsCampaignCard,
  type ReportsEventCard,
} from "@/features/reports/summary";

function makeCampaign(
  overrides: Partial<ReportsCampaignCard> = {},
): ReportsCampaignCard {
  return {
    campaignId: "cmp_1",
    name: "Campaign",
    status: "ACTIVE",
    clientSlug: "zamora",
    spend: 1000,
    roas: 4,
    revenue: 4000,
    impressions: 10000,
    clicks: 500,
    ctr: 5,
    cpc: 2,
    cpm: 10,
    dailyBudget: null,
    startTime: null,
    ...overrides,
  };
}

function makeEvent(overrides: Partial<ReportsEventCard> = {}): ReportsEventCard {
  return {
    id: "evt_1",
    name: "Show",
    venue: "Arena",
    city: "Chicago",
    clientSlug: "zamora",
    date: "2026-03-10",
    status: "onsale",
    ticketsSold: 200,
    ticketsAvailable: 100,
    sellThrough: 67,
    avgTicketPrice: 45,
    potentialRevenue: 10000,
    gross: 9000,
    updatedAt: "2026-03-06T12:00:00.000Z",
    ticketPlatform: "ticketmaster",
    artist: "Artist",
    ticketsSoldToday: 20,
    revenueToday: 900,
    conversionRate: 2.5,
    edpTotalViews: 1000,
    edpAvgDailyViews: 100,
    ...overrides,
  };
}

describe("buildReportsSummary", () => {
  it("aggregates spend, revenue, ROAS, and ticket totals", () => {
    const summary = buildReportsSummary(
      [
        makeCampaign(),
        makeCampaign({
          campaignId: "cmp_2",
          spend: 500,
          roas: 2,
          revenue: 1000,
          impressions: 5000,
          clicks: 125,
          ctr: 2.5,
          cpc: 4,
        }),
      ],
      [makeEvent(), makeEvent({ id: "evt_2", ticketsSold: 50 })],
    );

    expect(summary).toEqual({
      totalSpend: 1500,
      totalRevenue: 5000,
      blendedRoas: (4 * 1000 + 2 * 500) / 1500,
      totalImpressions: 15000,
      totalClicks: 625,
      totalTicketsSold: 250,
      avgCpc: 3,
      avgCtr: 3.75,
    });
  });
});
