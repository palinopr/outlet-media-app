import { beforeEach, describe, expect, it, vi } from "vitest";

const META_CAMPAIGN_ID = "120247445551520525";
const META_ADSET_ID = "120247445606520525";
const META_AD_ID = "120247446000000525";

const { enrichAttributionWithMetaAdHierarchy, findTicketmasterAttributionMatch, state, supabaseAdmin } = vi.hoisted(() => {
  const state = {
    existing: null as Record<string, unknown> | null,
    inserted: null as Record<string, unknown> | null,
    updated: null as Record<string, unknown> | null,
  };

  const query = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    maybeSingle: vi.fn(async () => ({ data: state.existing, error: null })),
    insert: vi.fn(async (row: Record<string, unknown>) => {
      state.inserted = row;
      return { error: null };
    }),
    update: vi.fn((row: Record<string, unknown>) => {
      state.updated = row;
      return query;
    }),
  };

  return {
    enrichAttributionWithMetaAdHierarchy: vi.fn(),
    findTicketmasterAttributionMatch: vi.fn(),
    state,
    supabaseAdmin: {
      from: vi.fn(() => query),
    },
  };
});

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin,
}));

vi.mock("@/features/meta/meta-ad-hierarchy", () => ({
  enrichAttributionWithMetaAdHierarchy,
}));

vi.mock("@/features/meta/ticketmaster-attribution-handoff", () => ({
  findTicketmasterAttributionMatch,
}));

import { recordTicketmasterCapiEvent } from "./ticketmaster-capi-log";

describe("recordTicketmasterCapiEvent", () => {
  beforeEach(() => {
    state.existing = null;
    state.inserted = null;
    state.updated = null;
    enrichAttributionWithMetaAdHierarchy.mockImplementation(async (attribution) => ({
      ...attribution,
      metaAdName: "Resolved ad",
      metaAdsetId: META_ADSET_ID,
      metaAdsetName: "Resolved ad set",
      metaCampaignId: META_CAMPAIGN_ID,
      metaCampaignName: "Resolved campaign",
    }));
    findTicketmasterAttributionMatch.mockResolvedValue(null);
    vi.clearAllMocks();
  });

  it("stores resolved ad set and campaign hierarchy for direct ad-id purchase rows", async () => {
    await recordTicketmasterCapiEvent({
      log: {
        attribution: {
          metaAdId: META_AD_ID,
        },
        eventId: "tm_event",
        eventName: "Purchase",
        hitAt: "2026-05-23T18:00:00.000Z",
        orderId: "ORDER-1",
        ticketmasterEventId: "02006478E042F9B1",
        value: 125,
      },
      metaResult: {
        body: { events_received: 1 },
        ok: true,
        status: 200,
      },
    });

    expect(enrichAttributionWithMetaAdHierarchy).toHaveBeenCalledWith(expect.objectContaining({
      metaAdId: META_AD_ID,
    }));
    expect(state.inserted).toMatchObject({
      attribution_match_confidence: "deterministic",
      attribution_match_method: "direct_ticketmaster_params",
      meta_ad_id: META_AD_ID,
      meta_ad_name: "Resolved ad",
      meta_adset_id: META_ADSET_ID,
      meta_adset_name: "Resolved ad set",
      meta_campaign_id: META_CAMPAIGN_ID,
      meta_campaign_name: "Resolved campaign",
      meta_ok: true,
      meta_status: 200,
    });
  });

  it("updates an existing deterministic ad row when hierarchy fields were missing", async () => {
    state.existing = {
      attempt_count: 1,
      attribution_match_confidence: "deterministic",
      attribution_match_method: "direct_ticketmaster_params",
      created_at: "2026-05-23T18:00:00.000Z",
      meta_ad_id: META_AD_ID,
    };

    await recordTicketmasterCapiEvent({
      log: {
        attribution: {
          metaAdId: META_AD_ID,
        },
        eventId: "tm_event",
        eventName: "Purchase",
        hitAt: "2026-05-23T18:05:00.000Z",
        orderId: "ORDER-1",
        ticketmasterEventId: "02006478E042F9B1",
        value: 125,
      },
    });

    expect(state.updated).toMatchObject({
      attempt_count: 2,
      attribution_match_confidence: "deterministic",
      attribution_match_method: "direct_ticketmaster_params",
      meta_ad_id: META_AD_ID,
      meta_ad_name: "Resolved ad",
      meta_adset_id: META_ADSET_ID,
      meta_adset_name: "Resolved ad set",
      meta_campaign_id: META_CAMPAIGN_ID,
      meta_campaign_name: "Resolved campaign",
    });
  });

  it("preserves existing hierarchy fields when a retry only adds a missing ad name", async () => {
    state.existing = {
      attempt_count: 1,
      attribution_handoff_id: "handoff_existing",
      attribution_match_confidence: "deterministic",
      attribution_match_method: "direct_ticketmaster_params",
      attribution_matched_at: "2026-05-23T18:00:30.000Z",
      created_at: "2026-05-23T18:00:00.000Z",
      meta_ad_id: META_AD_ID,
      meta_adset_id: META_ADSET_ID,
      meta_adset_name: "Existing ad set",
      meta_campaign_id: META_CAMPAIGN_ID,
      meta_campaign_name: "Existing campaign",
      om_click_id: "omc_existing",
      om_session_id: "oms_existing",
    };
    enrichAttributionWithMetaAdHierarchy.mockResolvedValueOnce({
      metaAdId: META_AD_ID,
      metaAdName: "Resolved ad",
    });

    await recordTicketmasterCapiEvent({
      log: {
        attribution: {
          metaAdId: META_AD_ID,
        },
        eventId: "tm_event",
        eventName: "Purchase",
        hitAt: "2026-05-23T18:05:00.000Z",
        orderId: "ORDER-1",
        ticketmasterEventId: "02006478E042F9B1",
        value: 125,
      },
    });

    expect(state.updated).toMatchObject({
      attribution_handoff_id: "handoff_existing",
      attribution_match_confidence: "deterministic",
      attribution_match_method: "direct_ticketmaster_params",
      attribution_matched_at: "2026-05-23T18:00:30.000Z",
      meta_ad_id: META_AD_ID,
      meta_ad_name: "Resolved ad",
      meta_adset_id: META_ADSET_ID,
      meta_adset_name: "Existing ad set",
      meta_campaign_id: META_CAMPAIGN_ID,
      meta_campaign_name: "Existing campaign",
      om_click_id: "omc_existing",
      om_session_id: "oms_existing",
    });
  });

  it("lets direct Ticketmaster params replace an existing handoff-derived ad id", async () => {
    state.existing = {
      attempt_count: 1,
      attribution_handoff_id: "handoff_existing",
      attribution_match_confidence: "deterministic",
      attribution_match_method: "direct_click_id",
      created_at: "2026-05-23T20:00:00.000Z",
      meta_ad_id: "120247446000000999",
      om_click_id: "omc_old_123",
    };
    findTicketmasterAttributionMatch.mockResolvedValueOnce({
      attribution: {
        metaAdId: "120247446000000999",
      },
      clickId: "omc_old_123",
      confidence: "deterministic",
      handoffId: "handoff_existing",
      method: "direct_click_id",
    });

    await recordTicketmasterCapiEvent({
      log: {
        attribution: {
          metaAdId: META_AD_ID,
        },
        eventId: "tm_direct_priority",
        eventName: "Purchase",
        hitAt: "2026-05-23T20:05:00.000Z",
        omClickId: "omc_new_123",
        orderId: "ORDER-1",
        ticketmasterEventId: "02006478E042F9B1",
        value: 125,
      },
      metaPixelId: "pixel",
      metaResult: {
        body: { events_received: 1 },
        ok: true,
        status: 200,
      },
    });

    expect(state.updated).toMatchObject({
      attempt_count: 2,
      attribution_handoff_id: null,
      attribution_match_confidence: "deterministic",
      attribution_match_method: "direct_ticketmaster_params",
      event_id: "tm_direct_priority",
      meta_ad_id: META_AD_ID,
      om_click_id: "omc_new_123",
    });
  });
});
