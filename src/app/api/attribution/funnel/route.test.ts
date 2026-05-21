import { beforeEach, describe, expect, it } from "vitest";
import { resetRateLimitsForTests } from "@/lib/request-guards";
import { POST } from "./route";

function post(body: unknown, headers: Record<string, string> = {}) {
  return POST(new Request("https://outletmedia.net/api/attribution/funnel", {
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      "user-agent": "vitest-browser",
      "x-forwarded-for": "203.0.113.20",
      ...headers,
    },
    method: "POST",
  }));
}

describe("POST /api/attribution/funnel", () => {
  beforeEach(() => {
    resetRateLimitsForTests();
  });

  it("accepts privacy-safe funnel attribution events", async () => {
    const response = await post({
      attribution: {
        ad_id: "333",
        adset_id: "222",
        campaign_id: "111",
        placement: "instagram_stories",
        utm_campaign: "ataca_sergio_newark",
      },
      click_id: "omc_test",
      cta: "hero",
      event_name: "ticket_click",
      funnel: "ataca-sergio",
      market: "newark",
      page_url: "https://outletmedia.net/ataca-sergio/newark?campaign_id=111&adset_id=222&ad_id=333&private=drop",
      session_id: "oms_test",
    });

    expect(response.status).toBe(204);
  });

  it("accepts heatmap-lite section visibility and CTA impressions", async () => {
    const sectionResponse = await post({
      attribution: { ad_id: "333", campaign_id: "111" },
      client_event_id: "ome_section",
      device_type: "mobile",
      event_name: "section_visible",
      funnel: "ataca-sergio",
      market: "newark",
      page_url: "https://outletmedia.net/ataca-sergio/newark?campaign_id=111&ad_id=333",
      sample_rate: 1,
      section_id: "hero",
      session_id: "oms_test",
      viewport_height: 844,
      viewport_orientation: "portrait",
      viewport_width: 390,
      visible_ratio: 0.72,
    });

    const ctaResponse = await post({
      cta: "sticky",
      event_name: "cta_impression",
      funnel: "ataca-sergio",
      market: "newark",
      page_url: "https://outletmedia.net/ataca-sergio/newark?campaign_id=111&ad_id=333",
      session_id: "oms_test",
      visible_ratio: 1,
    });

    expect(sectionResponse.status).toBe(204);
    expect(ctaResponse.status).toBe(204);
  });

  it("accepts scroll depth metrics", async () => {
    const response = await post({
      event_name: "scroll_depth",
      funnel: "9am",
      market: "orlando",
      page_url: "https://outletmedia.net/9am/orlando",
      scroll_depth_pct: 75,
      session_id: "oms_test",
    });

    expect(response.status).toBe(204);
  });

  it("rejects unknown event names", async () => {
    const response = await post({ event_name: "Purchase", funnel: "ataca-sergio" });

    expect(response.status).toBe(400);
  });

  it("rejects public ticket_redirect events because redirects are server-recorded only", async () => {
    const response = await post({ event_name: "ticket_redirect", funnel: "ataca-sergio", market: "newark" });

    expect(response.status).toBe(400);
  });

  it("rejects payloads over the endpoint size limit", async () => {
    const response = await post({ event_name: "page_view", funnel: "9am" }, { "content-length": "16001" });

    expect(response.status).toBe(413);
  });
});
