import { describe, expect, it } from "vitest";

import { ThreadContextPayloadSchema } from "./thread-context";

describe("ThreadContextPayloadSchema", () => {
  it("accepts campaign, event, and creative references for follow-ups", () => {
    expect(
      ThreadContextPayloadSchema.parse({
        primaryDomain: "ads",
        referencedEntities: [
          {
            entityId: "ad_1",
            entityType: "creative",
            name: "video 4 - Bay Area",
            campaignId: "cmp_1",
          },
        ],
        resolvedRange: {
          preset: "lifetime",
          startDate: "1900-01-01",
          endDate: "2026-04-01",
          timezone: "America/Chicago",
        },
        comparisonSet: [],
        pronounTargets: ["ad_1"],
      }),
    ).toMatchObject({
      primaryDomain: "ads",
      pronounTargets: ["ad_1"],
    });
  });

  it("rejects creative references without a parent campaign id", () => {
    expect(() =>
      ThreadContextPayloadSchema.parse({
        primaryDomain: "ads",
        referencedEntities: [
          {
            entityId: "ad_1",
            entityType: "creative",
            name: "video 4 - Bay Area",
          },
        ],
        resolvedRange: null,
        comparisonSet: [],
        pronounTargets: [],
      }),
    ).toThrow();
  });
});
