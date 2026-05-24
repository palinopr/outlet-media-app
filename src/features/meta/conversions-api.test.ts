import { describe, expect, it } from "vitest";
import { buildTicketmasterCapiEvent, sanitizeTicketmasterCapiSourceUrl } from "./conversions-api";

const META_CAMPAIGN_ID = "120247445551520525";
const META_ADSET_ID = "120247445606520525";
const META_AD_ID = "120247446000000525";

describe("sanitizeTicketmasterCapiSourceUrl", () => {
  it("redacts Ticketmaster confirmation paths and keeps only approved attribution params", () => {
    const sourceUrl = "https://checkout.ticketmaster.com/confirmation/private-order?email=buyer@example.com&phone=5551234567&key=secret&campaign_name=buyer@example.com&utm_campaign=sk_live_secret&utm_content=Call%205551234567&edp="
      + encodeURIComponent(`https://www.ticketmaster.com/event/02006478E042F9B1?om_click_id=omc_test&ad_id=${META_AD_ID}&email=buyer@example.com`);

    const sanitized = sanitizeTicketmasterCapiSourceUrl(sourceUrl);

    const decoded = decodeURIComponent(sanitized ?? "");
    expect(sanitized).toContain("https://checkout.ticketmaster.com/confirmation");
    expect(sanitized).not.toContain("private-order");
    expect(sanitized).not.toContain("buyer%40example.com");
    expect(decoded).not.toContain("buyer@example.com");
    expect(decoded).toContain("om_click_id=omc_test");
    expect(decoded).toContain(`ad_id=${META_AD_ID}`);
    expect(decoded).not.toContain("5551234567");
    expect(decoded).not.toContain("secret");
    expect(decoded).not.toContain("campaign_name=");
    expect(decoded).not.toContain("utm_campaign=");
    expect(decoded).not.toContain("utm_content=");
  });

  it("redacts non-confirmation Ticketmaster checkout and order paths", () => {
    expect(sanitizeTicketmasterCapiSourceUrl("https://checkout.ticketmaster.com/checkout/order-private-123?om_click_id=omc_test"))
      .toBe("https://checkout.ticketmaster.com/checkout?om_click_id=omc_test");
    expect(sanitizeTicketmasterCapiSourceUrl(`https://www.ticketmaster.com/order/private-456?ad_id=${META_AD_ID}&email=buyer@example.com`))
      .toBe(`https://www.ticketmaster.com/order?ad_id=${META_AD_ID}`);
    expect(sanitizeTicketmasterCapiSourceUrl(`https://checkout.example.com/order/private-789?ad_id=${META_AD_ID}&email=buyer@example.com`))
      .toBe(`https://checkout.example.com/order?ad_id=${META_AD_ID}`);
    expect(sanitizeTicketmasterCapiSourceUrl(`https://www.ticketmaster.com/event/02006478E042F9B1/orders/ABC123?ad_id=${META_AD_ID}`))
      .toBe(`https://www.ticketmaster.com/order?ad_id=${META_AD_ID}`);
    expect(sanitizeTicketmasterCapiSourceUrl(`https://www.ticketmaster.com/event/02006478E042F9B1/order-confirmation/ABC123?ad_id=${META_AD_ID}`))
      .toBe(`https://www.ticketmaster.com/confirmation?ad_id=${META_AD_ID}`);
    expect(sanitizeTicketmasterCapiSourceUrl(`https://www.ticketmaster.com/confirmation-ABC123?ad_id=${META_AD_ID}`))
      .toBe(`https://www.ticketmaster.com/confirmation?ad_id=${META_AD_ID}`);
  });
});

describe("buildTicketmasterCapiEvent", () => {
  it("preserves ad attribution from Ticketmaster source_url", () => {
    const sourceUrl = encodeURIComponent(
      `https://www.ticketmaster.com/event/02006478E042F9B1?om_click_id=omc_test&om_session_id=oms_test&om_cta=hero&om_funnel=ataca-sergio&om_market=newark&campaign_id=${META_CAMPAIGN_ID}&adset_id=${META_ADSET_ID}&ad_id=${META_AD_ID}&placement=instagram_stories`,
    );
    const result = buildTicketmasterCapiEvent(
      new URL(`https://outletmedia.net/api/meta/ticketmaster-capi?order_id=ABC123&value=125&source_url=${sourceUrl}`),
      new Headers({ "user-agent": "vitest-browser", "x-forwarded-for": "203.0.113.10" }),
      new Date("2026-05-12T16:00:00Z"),
    );

    expect(result.event?.event_name).toBe("Purchase");
    expect(result.log.omClickId).toBe("omc_test");
    expect(result.log.omSessionId).toBe("oms_test");
    expect(result.log.cta).toBe("hero");
    expect(result.log.funnel).toBe("ataca-sergio");
    expect(result.log.market).toBe("newark");
    expect(result.log.attribution?.metaCampaignId).toBe(META_CAMPAIGN_ID);
    expect(result.log.attribution?.metaAdsetId).toBe(META_ADSET_ID);
    expect(result.log.attribution?.metaAdId).toBe(META_AD_ID);
    expect(result.log.attribution?.placement).toBe("instagram_stories");
    expect(result.log.sourceUrl).not.toContain("confirmation");
    expect(result.log.billingZip).toBeUndefined();
    expect(result.log.billingState).toBeUndefined();
    expect(result.log.country).toBeUndefined();
  });

  it("drops unsafe explicit Meta event IDs and falls back to generated IDs", () => {
    const result = buildTicketmasterCapiEvent(
      new URL("https://outletmedia.net/api/meta/ticketmaster-capi?order_id=ABC123&value=125&meta_event_id=buyer@example.com"),
      new Headers({ "user-agent": "vitest-browser" }),
      new Date("2026-05-12T16:00:00Z"),
    );

    expect(result.event?.event_id).toMatch(/^tm_[a-f0-9]{32}$/);
    expect(result.event?.event_id).not.toContain("buyer@example.com");
    expect(result.log.eventId).toBe(result.event?.event_id);
  });

  it("preserves ad attribution from Ticketmaster confirmation edp URLs", () => {
    const edp = encodeURIComponent(
      `https://www.ticketmaster.com/event/02006478E042F9B1?om_click_id=omc_nested&om_session_id=oms_nested&campaign_id=${META_CAMPAIGN_ID}&adset_id=${META_ADSET_ID}&ad_id=${META_AD_ID}`,
    );
    const sourceUrl = encodeURIComponent(`https://checkout.ticketmaster.com/confirmation/test-order?edp=${edp}`);
    const result = buildTicketmasterCapiEvent(
      new URL(`https://outletmedia.net/api/meta/ticketmaster-capi?order_id=ABC123&value=125&source_url=${sourceUrl}`),
      new Headers({ "user-agent": "vitest-browser", "x-forwarded-for": "203.0.113.10" }),
      new Date("2026-05-12T16:00:00Z"),
    );

    expect(result.log.omClickId).toBe("omc_nested");
    expect(result.log.omSessionId).toBe("oms_nested");
    expect(result.log.attribution?.metaCampaignId).toBe(META_CAMPAIGN_ID);
    expect(result.log.attribution?.metaAdsetId).toBe(META_ADSET_ID);
    expect(result.log.attribution?.metaAdId).toBe(META_AD_ID);
    expect(result.log.sourceUrl).toContain("checkout.ticketmaster.com/confirmation");
    expect(result.log.sourceUrl).not.toContain("test-order");
  });

  it("promotes a valid Ticketmaster CFC value to Meta ad attribution", () => {
    const result = buildTicketmasterCapiEvent(
      new URL(`https://outletmedia.net/api/meta/ticketmaster-capi?order_id=ABC123&value=125&utm_content=${META_AD_ID}`),
      new Headers({ "user-agent": "vitest-browser", "x-forwarded-for": "203.0.113.10" }),
      new Date("2026-05-12T16:00:00Z"),
    );

    expect(result.log.attribution?.metaAdId).toBe(META_AD_ID);
    expect(result.log.attribution?.utmContent).toBe(META_AD_ID);
  });

  it("promotes valid CFC attribution when a raw ad id is invalid", () => {
    const result = buildTicketmasterCapiEvent(
      new URL(`https://outletmedia.net/api/meta/ticketmaster-capi?order_id=ABC123&value=125&ad_id=bad&utm_content=${META_AD_ID}`),
      new Headers({ "user-agent": "vitest-browser", "x-forwarded-for": "203.0.113.10" }),
      new Date("2026-05-12T16:00:00Z"),
    );

    expect(result.log.attribution?.metaAdId).toBe(META_AD_ID);
  });

  it("keeps non-Meta CFC values as labels only", () => {
    const result = buildTicketmasterCapiEvent(
      new URL("https://outletmedia.net/api/meta/ticketmaster-capi?order_id=ABC123&value=125&utm_content=CFC_BUYAT_2197213"),
      new Headers({ "user-agent": "vitest-browser", "x-forwarded-for": "203.0.113.10" }),
      new Date("2026-05-12T16:00:00Z"),
    );

    expect(result.log.attribution?.metaAdId).toBeUndefined();
    expect(result.log.attribution?.utmContent).toBe("CFC_BUYAT_2197213");
  });
});
