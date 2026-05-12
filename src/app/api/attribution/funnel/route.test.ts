import { describe, expect, it } from "vitest";
import { POST } from "./route";

function post(body: unknown) {
  return POST(new Request("https://outletmedia.net/api/attribution/funnel", {
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      "user-agent": "vitest-browser",
      "x-forwarded-for": "203.0.113.20",
    },
    method: "POST",
  }));
}

describe("POST /api/attribution/funnel", () => {
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
      page_url: "https://outletmedia.net/ataca-sergio/newark?campaign_id=111&adset_id=222&ad_id=333",
      session_id: "oms_test",
    });

    expect(response.status).toBe(204);
  });

  it("rejects unknown event names", async () => {
    const response = await post({ event_name: "Purchase", funnel: "ataca-sergio" });

    expect(response.status).toBe(400);
  });
});
