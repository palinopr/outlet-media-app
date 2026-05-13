import { describe, expect, it } from "vitest";
import { buildTicketmasterCapiEvent } from "./conversions-api";

describe("buildTicketmasterCapiEvent", () => {
  it("preserves ad attribution from Ticketmaster source_url", () => {
    const sourceUrl = encodeURIComponent(
      "https://www.ticketmaster.com/event/02006478E042F9B1?om_click_id=omc_test&om_session_id=oms_test&campaign_id=111&adset_id=222&ad_id=333&placement=instagram_stories",
    );
    const result = buildTicketmasterCapiEvent(
      new URL(`https://outletmedia.net/api/meta/ticketmaster-capi?order_id=ABC123&value=125&source_url=${sourceUrl}`),
      new Headers({ "user-agent": "vitest-browser", "x-forwarded-for": "203.0.113.10" }),
      new Date("2026-05-12T16:00:00Z"),
    );

    expect(result.event?.event_name).toBe("Purchase");
    expect(result.log.omClickId).toBe("omc_test");
    expect(result.log.omSessionId).toBe("oms_test");
    expect(result.log.attribution?.metaCampaignId).toBe("111");
    expect(result.log.attribution?.metaAdsetId).toBe("222");
    expect(result.log.attribution?.metaAdId).toBe("333");
    expect(result.log.attribution?.placement).toBe("instagram_stories");
  });

  it("preserves ad attribution from Ticketmaster confirmation edp URLs", () => {
    const edp = encodeURIComponent(
      "https://www.ticketmaster.com/event/02006478E042F9B1?om_click_id=omc_nested&om_session_id=oms_nested&campaign_id=111&adset_id=222&ad_id=333",
    );
    const sourceUrl = encodeURIComponent(`https://checkout.ticketmaster.com/confirmation/test-order?edp=${edp}`);
    const result = buildTicketmasterCapiEvent(
      new URL(`https://outletmedia.net/api/meta/ticketmaster-capi?order_id=ABC123&value=125&source_url=${sourceUrl}`),
      new Headers({ "user-agent": "vitest-browser", "x-forwarded-for": "203.0.113.10" }),
      new Date("2026-05-12T16:00:00Z"),
    );

    expect(result.log.omClickId).toBe("omc_nested");
    expect(result.log.omSessionId).toBe("oms_nested");
    expect(result.log.attribution?.metaCampaignId).toBe("111");
    expect(result.log.attribution?.metaAdsetId).toBe("222");
    expect(result.log.attribution?.metaAdId).toBe("333");
  });
});
