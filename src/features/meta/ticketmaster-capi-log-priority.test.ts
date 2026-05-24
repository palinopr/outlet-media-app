import { beforeEach, describe, expect, it, vi } from "vitest";

const query = vi.hoisted(() => {
  const chain = {
    eq: vi.fn(() => chain),
    from: vi.fn(() => chain),
    insert: vi.fn(() => chain),
    maybeSingle: vi.fn(),
    select: vi.fn(() => chain),
    update: vi.fn(() => chain),
  };
  return chain;
});

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: query,
}));

vi.mock("@/features/meta/meta-attribution-enrichment", () => ({
  enrichMetaAttributionHierarchy: vi.fn(async ({ attribution }) => attribution ?? {}),
  getMetaAttributionEnrichmentToken: vi.fn(() => ""),
}));

vi.mock("@/features/meta/ticketmaster-attribution-handoff", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./ticketmaster-attribution-handoff")>();
  return {
    ...actual,
    findTicketmasterAttributionMatch: vi.fn(async () => ({
      attribution: {
        metaAdId: "120247446000000525",
      },
      confidence: "deterministic",
      method: "direct_ticketmaster_params",
    })),
  };
});

import { recordTicketmasterCapiEvent } from "./ticketmaster-capi-log";

describe("recordTicketmasterCapiEvent attribution priority", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lets direct Ticketmaster params replace an existing handoff-derived direct id", async () => {
    query.maybeSingle.mockResolvedValue({
      data: {
        attempt_count: 1,
        attribution_match_confidence: "deterministic",
        attribution_match_method: "direct_click_id",
        created_at: "2026-05-23T20:00:00.000Z",
        id: "existing-row",
        meta_ad_id: "120247446000000999",
        om_click_id: "omc_old_123",
      },
      error: null,
    });

    await recordTicketmasterCapiEvent({
      log: {
        attribution: {
          metaAdId: "120247446000000525",
        },
        eventId: "tm_direct_priority",
        eventName: "Purchase",
        hitAt: "2026-05-23T20:05:00.000Z",
        omClickId: "omc_new_123",
        orderId: "ORDER-1",
        value: 125,
      },
      metaPixelId: "pixel",
      metaResult: {
        body: { events_received: 1 },
        ok: true,
        status: 200,
      },
    });

    expect(query.update).toHaveBeenCalledTimes(1);
    expect(query.update).toHaveBeenCalledWith(expect.objectContaining({
      attempt_count: 2,
      attribution_match_confidence: "deterministic",
      attribution_match_method: "direct_ticketmaster_params",
      event_id: "tm_direct_priority",
      meta_ad_id: "120247446000000525",
      om_click_id: "omc_new_123",
    }));
  });
});
