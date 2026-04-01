import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  AdsOverviewRequestSchema,
  CLIENT_AGENT_TOOL_NAMES,
  CompareEntitiesRequestSchema,
  CreativeDetailsRequestSchema,
  EventDetailsRequestSchema,
  GeographyBreakdownRequestSchema,
  PlacementBreakdownRequestSchema,
  SearchScopeRequestSchema,
  TimeseriesRequestSchema,
} from "./tool-contracts";
import { clientAgentToolHandlers } from "./tools";

const featureDir = import.meta.dirname;

function collectFeatureSources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      return collectFeatureSources(fullPath);
    }

    if (!entry.name.endsWith(".ts") && !entry.name.endsWith(".tsx")) {
      return [];
    }

    if (entry.name.endsWith(".test.ts") || entry.name.endsWith(".test.tsx")) {
      return [];
    }

    return [readFileSync(fullPath, "utf8")];
  });
}

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

  it("removes the hosted runtime files from the web client-agent feature path", () => {
    expect(existsSync(join(featureDir, "model.ts"))).toBe(false);
    expect(existsSync(join(featureDir, "runtime.ts"))).toBe(false);
  });

  it("keeps OpenAI-specific env references out of the web client-agent feature path", () => {
    const sources = collectFeatureSources(featureDir).join("\n");

    expect(sources).not.toContain("OPENAI_API_KEY");
    expect(sources).not.toContain("CLIENT_AGENT_OPENAI_MODEL");
  });

  it("keeps the worker tool gateway aligned with the approved tool list", () => {
    expect(CLIENT_AGENT_TOOL_NAMES).toEqual([
      "search_scope",
      "get_ads_overview",
      "get_events_overview",
      "get_campaign_details",
      "get_event_details",
      "get_creative_details",
      "get_demographic_breakdown",
      "get_geography_breakdown",
      "get_placement_breakdown",
      "compare_entities",
      "get_timeseries",
    ]);

    expect(Object.keys(clientAgentToolHandlers).sort()).toEqual(
      [...CLIENT_AGENT_TOOL_NAMES].sort(),
    );
  });
});
