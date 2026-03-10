import { describe, expect, it } from "vitest";
import { findBestDayOfWeek, findBestHour, findTopCreative, findTopMarket } from "./lib";
import type { AdCard, DailyPoint, GeographyBreakdown, HourlyBreakdown } from "./types";

describe("client campaign analytics helpers", () => {
  it("prefers the strongest CTR hour once delivery is meaningful", () => {
    const hourly: HourlyBreakdown[] = [
      { hour: 9, spend: 40, impressions: 220, clicks: 4, ctr: 1.82 },
      { hour: 13, spend: 55, impressions: 260, clicks: 8, ctr: 3.08 },
      { hour: 20, spend: 22, impressions: 25, clicks: 3, ctr: 12 },
    ];

    expect(findBestHour(hourly)?.hour).toBe(13);
  });

  it("prefers high-performing markets only after clearing a meaningful impression floor", () => {
    const geography: GeographyBreakdown[] = [
      {
        market: "Texas",
        marketType: "region",
        spend: 120,
        impressions: 1800,
        clicks: 52,
        ctr: 2.89,
        cpc: 2.31,
      },
      {
        market: "Florida",
        marketType: "region",
        spend: 95,
        impressions: 1500,
        clicks: 30,
        ctr: 2,
        cpc: 3.16,
      },
      {
        market: "Tiny Test Market",
        marketType: "region",
        spend: 6,
        impressions: 40,
        clicks: 4,
        ctr: 10,
        cpc: 1.5,
      },
    ];

    expect(findTopMarket(geography)?.market).toBe("Texas");
  });

  it("prefers ROAS-leading creatives over raw reach", () => {
    const creatives: AdCard[] = [
      {
        adId: "a",
        name: "High volume ad",
        status: "ACTIVE",
        thumbnailUrl: null,
        creativeTitle: null,
        creativeBody: null,
        spend: 60,
        impressions: 12000,
        clicks: 240,
        reach: 9800,
        ctr: 2,
        cpc: 0.25,
        roas: 1.4,
        revenue: 84,
      },
      {
        adId: "b",
        name: "High ROAS ad",
        status: "ACTIVE",
        thumbnailUrl: null,
        creativeTitle: null,
        creativeBody: null,
        spend: 45,
        impressions: 5400,
        clicks: 175,
        reach: 4300,
        ctr: 3.24,
        cpc: 0.26,
        roas: 4.8,
        revenue: 216,
      },
    ];

    expect(findTopCreative(creatives)?.name).toBe("High ROAS ad");
  });

  it("returns no hour, market, creative, or weekday signal when the range has zero delivery", () => {
    const hourly: HourlyBreakdown[] = [
      { hour: 9, spend: 0, impressions: 0, clicks: 0, ctr: null },
      { hour: 13, spend: 0, impressions: 0, clicks: 0, ctr: null },
    ];
    const geography: GeographyBreakdown[] = [
      {
        market: "Barcelona",
        marketType: "region",
        spend: 0,
        impressions: 0,
        clicks: 0,
        ctr: null,
        cpc: null,
      },
    ];
    const creatives: AdCard[] = [
      {
        adId: "zero",
        name: "No delivery ad",
        status: "PAUSED",
        thumbnailUrl: null,
        creativeTitle: null,
        creativeBody: null,
        spend: 0,
        impressions: 0,
        clicks: 0,
        reach: 0,
        ctr: null,
        cpc: null,
        roas: null,
        revenue: null,
      },
    ];
    const daily: DailyPoint[] = [
      {
        date: "2026-03-10",
        dayOfWeek: 2,
        dayLabel: "Tue",
        spend: 0,
        revenue: null,
        roas: null,
        impressions: 0,
        clicks: 0,
        ctr: null,
      },
    ];

    expect(findBestHour(hourly)).toBeNull();
    expect(findTopMarket(geography)).toBeNull();
    expect(findTopCreative(creatives)).toBeNull();
    expect(findBestDayOfWeek(daily)).toBeNull();
  });
});
