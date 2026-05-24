import { describe, expect, it } from "vitest";
import {
  buildTicketmasterCapiEventBreakdown,
  buildTicketmasterCapiMatchingReport,
  buildTicketmasterHandoffEventBreakdown,
  summarizeTicketmasterHandoffRows,
  summarizeTicketmasterCapiRows,
} from "./ticketmaster-capi-matching-report-helpers.mjs";

const META_AD_ID = "120247446000000525";

function purchase(overrides = {}) {
  return {
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
    utm_content: null,
    value: 100,
    ...overrides,
  };
}

describe("ticketmaster CAPI matching report helpers", () => {
  it("ignores failed Meta sends when judging matching quality", () => {
    const summary = summarizeTicketmasterCapiRows([
      ...Array.from({ length: 9 }, () => purchase()),
      purchase({
        attribution_match_confidence: "deterministic",
        attribution_match_method: "direct_ticketmaster_params",
        meta_ad_id: META_AD_ID,
        meta_ok: false,
      }),
    ]);

    expect(summary.accepted_purchases).toBe(9);
    expect(summary.purchases).toBe(10);
    expect(summary.accepted_rate).toBe(90);
    expect(summary.direct_meta_object_rows).toBe(0);
    expect(summary.optimization_grade_rows).toBe(0);
    expect(summary.status).toBe("accepted_without_direct_matching");
  });

  it("marks direct low-confidence rows as not optimization-grade", () => {
    const summary = summarizeTicketmasterCapiRows([
      purchase({
        attribution_match_confidence: "low",
        attribution_match_method: "unique_recent_ua_handoff",
        meta_ad_id: META_AD_ID,
      }),
    ]);

    expect(summary.direct_meta_object_rows).toBe(1);
    expect(summary.optimization_grade_rows).toBe(0);
    expect(summary.status).toBe("accepted_without_optimization_grade_matching");
  });

  it("breaks accepted purchases down by safe event, funnel, and market", () => {
    const breakdown = buildTicketmasterCapiEventBreakdown([
      purchase({ ticketmaster_event_name: "Festival ATACA SERGIO", value: 250 }),
      purchase({
        funnel: "jay-wheeler",
        market: "san-juan",
        ticketmaster_event_id: "JAY12345",
        ticketmaster_event_name: "Jay Wheeler",
      }),
      purchase({
        funnel: "jay-wheeler",
        market: "san-juan",
        ticketmaster_event_id: "JAY12345",
        ticketmaster_event_name: "Jay Wheeler Live",
        value: 125,
      }),
    ]);

    expect(breakdown).toHaveLength(2);
    expect(breakdown[0]).toMatchObject({
      event_id: "JAY12345",
      funnel: "jay-wheeler",
      market: "san-juan",
      name: "Jay Wheeler",
      purchases: 2,
      revenue: 225,
    });
    expect(breakdown[1]).toMatchObject({
      event_id: "SERGIO123",
      name: "Festival ATACA SERGIO",
      purchases: 1,
      revenue: 250,
    });
  });

  it("does not expose unsafe labels in event breakdown", () => {
    const breakdown = buildTicketmasterCapiEventBreakdown([
      purchase({
        funnel: "https://unsafe.example/funnel",
        market: "555-111-2222",
        ticketmaster_event_id: "https://unsafe.example/event",
        ticketmaster_event_name: "buyer@example.com",
      }),
    ]);

    expect(breakdown).toHaveLength(1);
    expect(breakdown[0]).toMatchObject({
      event_id: null,
      funnel: null,
      market: null,
      name: "Unknown event",
    });
    expect(JSON.stringify(breakdown[0])).not.toContain("buyer@example.com");
    expect(JSON.stringify(breakdown[0])).not.toContain("unsafe.example");
    expect(JSON.stringify(breakdown[0])).not.toContain("555-111-2222");
  });

  it("builds the full report with capped event breakdown", () => {
    const report = buildTicketmasterCapiMatchingReport({
      breakdownLimit: 1,
      cutoff: "2026-05-24T00:00:00.000Z",
      filters: { funnel: null, market: null, ticketmaster_event_id: null },
      generatedAt: "2026-05-24T01:00:00.000Z",
      rowLimit: 1000,
      handoffRows: [
        {
          click_id: "omc_click_123",
          fbclid: "fbclid_123",
          fbc: "fb.1.1710000000000.abc123",
          fbp: "fb.1.1710000000000.def456",
          funnel: "ataca-sergio",
          market: "newark",
          meta_ad_id: null,
          meta_adset_id: null,
          meta_campaign_id: null,
          session_id: "oms_session_123",
          ticketmaster_event_id: "SERGIO123",
          ticketmaster_event_name: "Festival ATACA SERGIO",
        },
      ],
      rows: [
        purchase({ value: 250 }),
        purchase({ funnel: "jay-wheeler", market: "san-juan", ticketmaster_event_id: "JAY12345", ticketmaster_event_name: "Jay Wheeler" }),
      ],
    });

    expect(report.summary.purchases).toBe(2);
    expect(report.event_breakdown).toHaveLength(1);
    expect(report.handoff_summary.rows).toBe(1);
    expect(report.handoff_summary.any_meta_object_rows).toBe(0);
    expect(report.handoff_event_breakdown).toHaveLength(1);
    expect(report.event_breakdown[0].name).toBe("Festival ATACA SERGIO");
  });

  it("summarizes handoff capture without exposing raw tracking values", () => {
    const handoffRows = [
      {
        click_id: "omc_click_123",
        fbclid: "fbclid_123",
        fbc: "fb.1.1710000000000.abc123",
        fbp: "fb.1.1710000000000.def456",
        funnel: "ataca-sergio",
        market: "newark",
        meta_ad_id: META_AD_ID,
        meta_adset_id: null,
        meta_campaign_id: null,
        session_id: "oms_session_123",
        ticketmaster_event_id: "SERGIO123",
        ticketmaster_event_name: "Festival ATACA SERGIO",
      },
      {
        click_id: "omc_click_456",
        fbclid: null,
        fbc: null,
        fbp: null,
        funnel: "ataca-sergio",
        market: "newark",
        meta_ad_id: null,
        meta_adset_id: null,
        meta_campaign_id: null,
        session_id: null,
        ticketmaster_event_id: "SERGIO123",
        ticketmaster_event_name: "Festival ATACA SERGIO",
      },
    ];

    expect(summarizeTicketmasterHandoffRows(handoffRows)).toMatchObject({
      any_meta_object_rows: 1,
      click_id_rows: 2,
      fbclid_rows: 1,
      fbc_rows: 1,
      fbp_rows: 1,
      meta_ad_rows: 1,
      meta_object_capture_rate: 50,
      rows: 2,
      session_id_rows: 1,
    });
    expect(buildTicketmasterHandoffEventBreakdown(handoffRows)[0]).toMatchObject({
      any_meta_object_rows: 1,
      event_id: "SERGIO123",
      name: "Festival ATACA SERGIO",
      rows: 2,
    });
  });
});
