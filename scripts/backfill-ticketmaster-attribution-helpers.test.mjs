import { describe, expect, it } from "vitest";
import { isValidMetaEntityId, metaAdIdFromCfc } from "./backfill-ticketmaster-attribution-helpers.mjs";

describe("Ticketmaster attribution backfill helpers", () => {
  it("promotes numeric Meta-shaped CFC values", () => {
    expect(metaAdIdFromCfc({ utm_content: "120247527693110525" })).toBe("120247527693110525");
  });

  it("does not promote arbitrary CFC labels", () => {
    expect(metaAdIdFromCfc({ utm_content: "CFC_BUYAT_2197213" })).toBeNull();
  });

  it("validates Meta entity ids conservatively", () => {
    expect(isValidMetaEntityId("120247527693110525")).toBe(true);
    expect(isValidMetaEntityId("bad")).toBe(false);
    expect(isValidMetaEntityId("120247527693110525_extra")).toBe(false);
  });
});
