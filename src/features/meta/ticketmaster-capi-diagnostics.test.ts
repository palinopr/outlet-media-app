import { describe, expect, it } from "vitest";
import {
  buildTicketmasterCapiEventMatchingBreakdown,
  buildTicketmasterCapiMatchingSummary,
  hasValidCfcCandidate,
  isValidMetaEntityId,
} from "./ticketmaster-capi-diagnostics";

const META_AD_ID = "120247446000000525";

describe("ticketmaster CAPI diagnostics", () => {
  it("counts accepted purchases separately from deterministic ad matching", () => {
    const summary = buildTicketmasterCapiMatchingSummary([
      {
        attribution_match_confidence: "medium",
        attribution_match_method: "exact_ip_ua_handoff",
        event_name: "Purchase",
        is_test: false,
        meta_ad_id: null,
        meta_adset_id: null,
        meta_campaign_id: null,
        meta_ok: true,
        quantity: 2,
        skip_reason: null,
        source_url: null,
        value: 125,
      },
      {
        attribution_match_confidence: "unknown",
        attribution_match_method: null,
        event_name: "Purchase",
        is_test: false,
        meta_ad_id: null,
        meta_adset_id: null,
        meta_campaign_id: null,
        meta_ok: true,
        quantity: 1,
        skip_reason: null,
        source_url: null,
        value: "75",
      },
    ]);

    expect(summary.acceptedCount).toBe(2);
    expect(summary.acceptedRate).toBe(100);
    expect(summary.directMetaObjectCount).toBe(0);
    expect(summary.optimizationGradeCount).toBe(0);
    expect(summary.confidenceCounts).toMatchObject({ medium: 1, unknown: 1 });
    expect(summary.status).toBe("accepted_without_direct_matching");
  });

  it("treats direct numeric Meta object rows as optimization-grade when confidence is strong", () => {
    const summary = buildTicketmasterCapiMatchingSummary([
      {
        attribution_match_confidence: "deterministic",
        attribution_match_method: "direct_ticketmaster_params",
        event_name: "Purchase",
        is_test: false,
        meta_ad_id: META_AD_ID,
        meta_adset_id: null,
        meta_campaign_id: null,
        meta_ok: true,
        quantity: 3,
        skip_reason: null,
        source_url: null,
        value: 300,
      },
    ]);

    expect(summary.directMetaObjectCount).toBe(1);
    expect(summary.directTicketmasterParamCount).toBe(1);
    expect(summary.optimizationGradeCount).toBe(1);
    expect(summary.adLevelCoverageRate).toBe(100);
    expect(summary.status).toBe("healthy");
  });

  it("does not mark direct Meta object rows usable when confidence is not optimization-grade", () => {
    const summary = buildTicketmasterCapiMatchingSummary([
      {
        attribution_match_confidence: "low",
        attribution_match_method: "unique_recent_ua_handoff",
        event_name: "Purchase",
        is_test: false,
        meta_ad_id: META_AD_ID,
        meta_adset_id: null,
        meta_campaign_id: null,
        meta_ok: true,
        quantity: 1,
        skip_reason: null,
        source_url: null,
        value: 100,
      },
    ]);

    expect(summary.directMetaObjectCount).toBe(1);
    expect(summary.optimizationGradeCount).toBe(0);
    expect(summary.status).toBe("accepted_without_optimization_grade_matching");
  });

  it("ignores failed Meta sends when judging matching quality", () => {
    const acceptedRows = Array.from({ length: 9 }, () => ({
      attribution_match_confidence: "unknown",
      attribution_match_method: null,
      event_name: "Purchase",
      is_test: false,
      meta_ad_id: null,
      meta_adset_id: null,
      meta_campaign_id: null,
      meta_ok: true,
      quantity: 1,
      skip_reason: null,
      source_url: null,
      value: 100,
    }));
    const summary = buildTicketmasterCapiMatchingSummary([
      ...acceptedRows,
      {
        attribution_match_confidence: "deterministic",
        attribution_match_method: "direct_ticketmaster_params",
        event_name: "Purchase",
        is_test: false,
        meta_ad_id: META_AD_ID,
        meta_adset_id: null,
        meta_campaign_id: null,
        meta_ok: false,
        quantity: 1,
        skip_reason: null,
        source_url: null,
        value: 100,
      },
    ]);

    expect(summary.acceptedCount).toBe(9);
    expect(summary.purchaseCount).toBe(10);
    expect(summary.acceptedRate).toBe(90);
    expect(summary.directMetaObjectCount).toBe(0);
    expect(summary.optimizationGradeCount).toBe(0);
    expect(summary.status).toBe("accepted_without_direct_matching");
  });

  it("detects valid CFC candidates in nested source URLs without accepting non-Meta CFC labels", () => {
    expect(isValidMetaEntityId("CFC_BUYAT_2197213")).toBe(false);
    expect(hasValidCfcCandidate({
      attribution_match_confidence: null,
      attribution_match_method: null,
      event_name: "Purchase",
      is_test: false,
      meta_ad_id: null,
      meta_adset_id: null,
      meta_campaign_id: null,
      meta_ok: true,
      quantity: 1,
      skip_reason: null,
      source_url: `https://checkout.ticketmaster.com/confirmation?edp=${encodeURIComponent(`https://www.ticketmaster.com/event/abc?ad_id=${META_AD_ID}`)}`,
      utm_content: "CFC_BUYAT_2197213",
      value: 100,
    })).toBe(true);
  });

  it("breaks matching quality out by Ticketmaster event and funnel", () => {
    const breakdown = buildTicketmasterCapiEventMatchingBreakdown([
      {
        attribution_match_confidence: "deterministic",
        attribution_match_method: "direct_ticketmaster_params",
        event_name: "Purchase",
        funnel: "ataca-sergio",
        is_test: false,
        market: "newark",
        meta_ad_id: META_AD_ID,
        meta_adset_id: null,
        meta_campaign_id: null,
        meta_ok: true,
        quantity: 2,
        skip_reason: null,
        source_url: null,
        ticketmaster_event_id: "02006478E042F9B1",
        ticketmaster_event_name: "Festival ATACA SERGIO",
        value: 250,
      },
      {
        attribution_match_confidence: "unknown",
        attribution_match_method: null,
        event_name: "Purchase",
        funnel: "jay-wheeler",
        is_test: false,
        market: "san-juan",
        meta_ad_id: null,
        meta_adset_id: null,
        meta_campaign_id: null,
        meta_ok: true,
        quantity: 1,
        skip_reason: null,
        source_url: null,
        ticketmaster_event_id: "JAY123",
        ticketmaster_event_name: "Jay Wheeler",
        value: 100,
      },
      {
        attribution_match_confidence: "high",
        attribution_match_method: "exact_ip_ua_handoff",
        event_name: "Purchase",
        funnel: "jay-wheeler",
        is_test: false,
        market: "san-juan",
        meta_ad_id: null,
        meta_adset_id: null,
        meta_campaign_id: null,
        meta_ok: true,
        quantity: 1,
        skip_reason: null,
        source_url: null,
        ticketmaster_event_id: "JAY123",
        ticketmaster_event_name: "Jay Wheeler",
        value: 100,
      },
    ]);

    expect(breakdown).toHaveLength(2);
    expect(breakdown[0]).toMatchObject({
      name: "Jay Wheeler",
      purchaseCount: 2,
      optimizationGradeCount: 0,
      unknownCount: 1,
    });
    expect(breakdown[0].confidenceCounts.high).toBe(1);
    expect(breakdown[0].status).toBe("accepted_without_direct_matching");
    expect(breakdown[1]).toMatchObject({
      name: "Festival ATACA SERGIO",
      purchaseCount: 1,
      optimizationGradeCount: 1,
      status: "healthy",
    });
  });

  it("groups by stable Ticketmaster event ID even when event names vary", () => {
    const breakdown = buildTicketmasterCapiEventMatchingBreakdown([
      {
        attribution_match_confidence: "deterministic",
        attribution_match_method: "direct_ticketmaster_params",
        event_name: "Purchase",
        funnel: "jay-wheeler",
        is_test: false,
        market: "san-juan",
        meta_ad_id: META_AD_ID,
        meta_adset_id: null,
        meta_campaign_id: null,
        meta_ok: true,
        quantity: 1,
        skip_reason: null,
        source_url: null,
        ticketmaster_event_id: "JAY12345",
        ticketmaster_event_name: "Jay Wheeler",
        value: 100,
      },
      {
        attribution_match_confidence: "high",
        attribution_match_method: "exact_ip_ua_handoff",
        event_name: "Purchase",
        funnel: "jay-wheeler",
        is_test: false,
        market: "san-juan",
        meta_ad_id: META_AD_ID,
        meta_adset_id: null,
        meta_campaign_id: null,
        meta_ok: true,
        quantity: 1,
        skip_reason: null,
        source_url: null,
        ticketmaster_event_id: "JAY12345",
        ticketmaster_event_name: "Jay Wheeler Live",
        value: 120,
      },
    ]);

    expect(breakdown).toHaveLength(1);
    expect(breakdown[0]).toMatchObject({
      eventId: "JAY12345",
      funnel: "jay-wheeler",
      market: "san-juan",
      name: "Jay Wheeler",
      purchaseCount: 2,
      revenue: 220,
    });
  });

  it("returns privacy-safe event labels for the matching breakdown", () => {
    const breakdown = buildTicketmasterCapiEventMatchingBreakdown([
      {
        attribution_match_confidence: "unknown",
        attribution_match_method: null,
        event_name: "Purchase",
        funnel: "https://unsafe.example/funnel",
        is_test: false,
        market: "555-111-2222",
        meta_ad_id: null,
        meta_adset_id: null,
        meta_campaign_id: null,
        meta_ok: true,
        quantity: 1,
        skip_reason: null,
        source_url: null,
        ticketmaster_event_id: "https://unsafe.example/event",
        ticketmaster_event_name: "buyer@example.com",
        value: 100,
      },
    ]);

    expect(breakdown).toHaveLength(1);
    expect(breakdown[0]).toMatchObject({
      eventId: null,
      funnel: null,
      market: null,
      name: "Unknown event",
    });
    expect(JSON.stringify(breakdown[0])).not.toContain("buyer@example.com");
    expect(JSON.stringify(breakdown[0])).not.toContain("unsafe.example");
    expect(JSON.stringify(breakdown[0])).not.toContain("555-111-2222");
  });

  it("keeps event-level acceptance failures visible without counting them as matches", () => {
    const acceptedRows = Array.from({ length: 2 }, () => ({
      attribution_match_confidence: "unknown",
      attribution_match_method: null,
      event_name: "Purchase",
      funnel: "ataca-sergio",
      is_test: false,
      market: "newark",
      meta_ad_id: null,
      meta_adset_id: null,
      meta_campaign_id: null,
      meta_ok: true,
      quantity: 1,
      skip_reason: null,
      source_url: null,
      ticketmaster_event_id: "SERGIO123",
      ticketmaster_event_name: "Festival ATACA SERGIO",
      value: 100,
    }));
    const breakdown = buildTicketmasterCapiEventMatchingBreakdown([
      ...acceptedRows,
      {
        attribution_match_confidence: "deterministic",
        attribution_match_method: "direct_ticketmaster_params",
        event_name: "Purchase",
        funnel: "ataca-sergio",
        is_test: false,
        market: "newark",
        meta_ad_id: META_AD_ID,
        meta_adset_id: null,
        meta_campaign_id: null,
        meta_ok: false,
        quantity: 1,
        skip_reason: null,
        source_url: null,
        ticketmaster_event_id: "SERGIO123",
        ticketmaster_event_name: "Festival ATACA SERGIO",
        value: 100,
      },
    ]);

    expect(breakdown).toHaveLength(1);
    expect(breakdown[0]).toMatchObject({
      acceptedCount: 2,
      acceptedRate: 67,
      directMetaObjectCount: 0,
      optimizationGradeCount: 0,
      purchaseCount: 3,
      status: "acceptance_issue",
    });
  });
});
