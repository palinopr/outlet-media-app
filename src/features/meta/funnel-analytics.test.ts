import { describe, expect, it } from "vitest";
import { aggregateFunnelEngagement, type FunnelEngagementRow } from "./funnel-analytics";

function row(input: Partial<FunnelEngagementRow> & Pick<FunnelEngagementRow, "event_name">): FunnelEngagementRow {
  return {
    created_at: "2026-05-21T20:00:00.000Z",
    funnel: "ataca-sergio",
    market: "newark",
    sample_rate: 1,
    session_id: "s1",
    ...input,
  };
}

describe("aggregateFunnelEngagement", () => {
  it("aggregates privacy-safe section, CTA, scroll, device, and creative metrics", () => {
    const summary = aggregateFunnelEngagement([
      row({ event_name: "page_view", device_type: "mobile", meta_ad_name: "Creative A" }),
      row({ event_name: "section_visible", section_id: "hero", meta_ad_name: "Creative A" }),
      row({ event_name: "section_visible", section_id: "lineup", meta_ad_name: "Creative A" }),
      row({ event_name: "cta_impression", cta: "hero", meta_ad_name: "Creative A" }),
      row({ event_name: "ticket_click", cta: "hero", meta_ad_name: "Creative A" }),
      row({ event_name: "ticket_redirect", cta: "hero", meta_ad_name: "Creative A" }),
      row({ event_name: "scroll_depth", scroll_depth_pct: 75, meta_ad_name: "Creative A" }),
      row({ event_name: "page_view", device_type: "desktop", sample_rate: 0.5, session_id: "s2", utm_content: "Creative B" }),
      row({ event_name: "cta_impression", cta: "final", session_id: "s2", utm_content: "Creative B" }),
    ], 7);

    expect(summary.fromDb).toBe(true);
    expect(summary.totals.sessions).toBe(2);
    expect(summary.totals.pageViews).toBe(2);
    expect(summary.totals.ctaClicks).toBe(1);
    expect(summary.totals.ctaImpressions).toBe(2);
    expect(summary.totals.ctaCtr).toBe(0.5);
    expect(summary.totals.scroll75Rate).toBe(0.5);
    expect(summary.sections.map((section) => section.id)).toEqual(["hero", "lineup"]);
    expect(summary.ctas[0]).toMatchObject({ id: "hero", clicks: 1, impressions: 1 });
    expect(summary.deviceSplit).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "desktop", count: 1 }),
      expect.objectContaining({ id: "mobile", count: 1 }),
    ]));
    expect(summary.topSources[0]).toMatchObject({ source: "Creative A", clicks: 1 });
  });

  it("returns an empty directional summary for no rows", () => {
    const summary = aggregateFunnelEngagement([], 30);

    expect(summary.fromDb).toBe(false);
    expect(summary.lookbackDays).toBe(30);
    expect(summary.totals.sessions).toBe(0);
    expect(summary.totals.ctaCtr).toBeNull();
  });
});
