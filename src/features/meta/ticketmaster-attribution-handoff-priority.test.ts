import { describe, expect, it, vi } from "vitest";

const query = vi.hoisted(() => {
  const chain = {
    eq: vi.fn(() => chain),
    from: vi.fn(() => chain),
    gte: vi.fn(() => chain),
    limit: vi.fn(() => chain),
    lte: vi.fn(() => chain),
    maybeSingle: vi.fn(),
    order: vi.fn(() => chain),
    select: vi.fn(() => chain),
  };
  return chain;
});

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: query,
}));

import { findTicketmasterAttributionMatch } from "./ticketmaster-attribution-handoff";

const META_CAMPAIGN_ID = "120247445551520525";
const META_ADSET_ID = "120247445606520525";
const META_AD_ID = "120247446000000525";
const STALE_HANDOFF_AD_ID = "120247446000000999";

describe("findTicketmasterAttributionMatch priority", () => {
  it("trusts direct Ticketmaster Meta ids before stale handoff matches", async () => {
    query.maybeSingle.mockResolvedValue({
      data: {
        click_id: "omc_test",
        id: "stale-handoff",
        meta_ad_id: STALE_HANDOFF_AD_ID,
        meta_adset_id: META_ADSET_ID,
        meta_campaign_id: META_CAMPAIGN_ID,
        session_id: "oms_test",
      },
      error: null,
    });

    const match = await findTicketmasterAttributionMatch(
      {
        attribution: {
          metaAdId: META_AD_ID,
        },
        eventName: "Purchase",
        funnel: "ataca-sergio",
        market: "newark",
        omClickId: "omc_test",
        omSessionId: "oms_test",
        ticketmasterEventId: "02006478E042F9B1",
      },
      "2026-05-23T20:00:00.000Z",
    );

    expect(match).toMatchObject({
      confidence: "deterministic",
      method: "direct_ticketmaster_params",
    });
    expect(match?.attribution.metaAdId).toBe(META_AD_ID);
    expect(match?.attribution.metaAdId).not.toBe(STALE_HANDOFF_AD_ID);
    expect(query.from).not.toHaveBeenCalled();
    expect(query.maybeSingle).not.toHaveBeenCalled();
  });
});
