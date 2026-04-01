import { describe, expect, it } from "vitest";

import { normalizeRange, resolveRangeFromMessage } from "./range";

describe("normalizeRange", () => {
  const now = new Date("2026-03-31T15:00:00.000Z");

  it("normalizes today", () => {
    expect(normalizeRange("today", { now, timezone: "America/Chicago" })).toEqual({
      preset: "today",
      startDate: "2026-03-31",
      endDate: "2026-03-31",
      timezone: "America/Chicago",
    });
  });

  it("normalizes yesterday", () => {
    expect(normalizeRange("yesterday", { now, timezone: "America/Chicago" })).toEqual({
      preset: "yesterday",
      startDate: "2026-03-30",
      endDate: "2026-03-30",
      timezone: "America/Chicago",
    });
  });

  it("normalizes last 7 days", () => {
    expect(normalizeRange("last 7 days", { now, timezone: "America/Chicago" })).toEqual({
      preset: "last_7_days",
      startDate: "2026-03-25",
      endDate: "2026-03-31",
      timezone: "America/Chicago",
    });
  });

  it("normalizes this month", () => {
    expect(normalizeRange("this month", { now, timezone: "America/Chicago" })).toEqual({
      preset: "this_month",
      startDate: "2026-03-01",
      endDate: "2026-03-31",
      timezone: "America/Chicago",
    });
  });

  it("normalizes this quarter", () => {
    expect(normalizeRange("this quarter", { now, timezone: "America/Chicago" })).toEqual({
      preset: "this_quarter",
      startDate: "2026-01-01",
      endDate: "2026-03-31",
      timezone: "America/Chicago",
    });
  });

  it("returns null when multiple supported ranges appear in the same message", () => {
    expect(
      resolveRangeFromMessage("How did Tokyo Dome do today versus yesterday?", {
        now,
        timezone: "America/Chicago",
      }),
    ).toBeNull();
  });
});
