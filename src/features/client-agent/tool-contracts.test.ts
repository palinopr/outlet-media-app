import { describe, expect, it } from "vitest";

import {
  AdsOverviewRequestSchema,
  CompareEntitiesRequestSchema,
  CreativeDetailsRequestSchema,
  EventDetailsRequestSchema,
  GeographyBreakdownRequestSchema,
  PlacementBreakdownRequestSchema,
  SearchScopeRequestSchema,
  TimeseriesRequestSchema,
} from "./tool-contracts";

describe("client agent tool contracts", () => {
  it("accepts the ads overview request shape", () => {
    expect(
      AdsOverviewRequestSchema.parse({
        range: {
          preset: "lifetime",
          startDate: "1900-01-01",
          endDate: "2026-04-01",
          timezone: "America/Chicago",
        },
        campaignIds: null,
        creativeIds: null,
      }),
    ).toBeTruthy();
  });

  it("rejects compare requests with an invalid metric for campaign comparisons", () => {
    expect(() =>
      CompareEntitiesRequestSchema.parse({
        entityType: "campaign",
        entityIds: ["cmp_1", "cmp_2"],
        metric: "tickets_sold",
        range: {
          preset: "this_month",
          startDate: "2026-04-01",
          endDate: "2026-04-01",
          timezone: "America/Chicago",
        },
      }),
    ).toThrow();
  });

  it("accepts the search request shape", () => {
    expect(SearchScopeRequestSchema.parse({ query: "Bay Area" })).toBeTruthy();
  });

  it("accepts event and creative detail request shapes", () => {
    expect(
      EventDetailsRequestSchema.parse({
        eventIds: ["evt_1"],
        range: {
          preset: "last_30_days",
          startDate: "2026-03-02",
          endDate: "2026-04-01",
          timezone: "America/Chicago",
        },
      }),
    ).toBeTruthy();

    expect(
      CreativeDetailsRequestSchema.parse({
        creativeIds: null,
        query: "Bay Area",
        range: {
          preset: "last_30_days",
          startDate: "2026-03-02",
          endDate: "2026-04-01",
          timezone: "America/Chicago",
        },
      }),
    ).toBeTruthy();
  });

  it("accepts geography and placement breakdown request shapes", () => {
    expect(
      GeographyBreakdownRequestSchema.parse({
        campaignIds: null,
        range: {
          preset: "last_30_days",
          startDate: "2026-03-02",
          endDate: "2026-04-01",
          timezone: "America/Chicago",
        },
      }),
    ).toBeTruthy();

    expect(
      PlacementBreakdownRequestSchema.parse({
        campaignIds: null,
        range: {
          preset: "last_30_days",
          startDate: "2026-03-02",
          endDate: "2026-04-01",
          timezone: "America/Chicago",
        },
      }),
    ).toBeTruthy();
  });

  it("rejects a timeseries request with an unsupported interval", () => {
    expect(() =>
      TimeseriesRequestSchema.parse({
        domain: "ads",
        entityType: "campaign",
        entityIds: ["cmp_1"],
        metric: "spend",
        range: {
          preset: "lifetime",
          startDate: "1900-01-01",
          endDate: "2026-04-01",
          timezone: "America/Chicago",
        },
        interval: "hour",
      }),
    ).toThrow();
  });
});
