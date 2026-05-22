import { describe, expect, it } from "vitest";
import { attributionMatchFromHandoffRow } from "./ticketmaster-attribution-handoff";

describe("ticketmaster attribution handoffs", () => {
  it("maps handoff rows into attribution matches with method and confidence", () => {
    const match = attributionMatchFromHandoffRow(
      {
        click_id: "omc_test",
        fbc: "fb.1.1763766000000.clicktoken",
        id: "handoff-id",
        meta_ad_id: "120247446000000525",
        meta_ad_name: "Creative A",
        meta_adset_id: "120247445606520525",
        meta_campaign_id: "120247445551520525",
        placement: "instagram_stories",
        session_id: "oms_test",
        site_source: "ig",
        utm_campaign: "ataca_sergio_newark",
        utm_content: "333",
        utm_medium: "paid_social",
        utm_source: "meta",
      },
      "direct_click_id",
      "deterministic",
    );

    expect(match).toMatchObject({
      clickId: "omc_test",
      confidence: "deterministic",
      handoffId: "handoff-id",
      method: "direct_click_id",
      sessionId: "oms_test",
    });
    expect(match.attribution).toMatchObject({
      fbc: "fb.1.1763766000000.clicktoken",
      metaAdId: "120247446000000525",
      metaAdName: "Creative A",
      metaAdsetId: "120247445606520525",
      metaCampaignId: "120247445551520525",
      placement: "instagram_stories",
      siteSource: "ig",
      utmContent: "333",
    });
  });
});
