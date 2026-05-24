import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/meta/attribution", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/meta/attribution")>();
  return {
    ...actual,
    recordMarketingAttributionEvent: vi.fn(),
  };
});

vi.mock("@/features/meta/ticketmaster-attribution-handoff", () => ({
  recordTicketmasterAttributionHandoff: vi.fn(),
}));

import { recordMarketingAttributionEvent } from "@/features/meta/attribution";
import { recordTicketmasterAttributionHandoff } from "@/features/meta/ticketmaster-attribution-handoff";
import { GET } from "./route";

const META_CAMPAIGN_ID = "120247445551520525";
const META_ADSET_ID = "120247445606520525";
const META_AD_ID = "120247446000000525";

function getRedirect(slug: string, query = "") {
  return GET(new Request(`https://outletmedia.net/out/ticketmaster/${slug}${query}`), {
    params: Promise.resolve({ slug }),
  });
}

describe("GET /out/ticketmaster/[slug]", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.mocked(recordMarketingAttributionEvent).mockReset();
    vi.mocked(recordTicketmasterAttributionHandoff).mockReset();
  });

  it("redirects through to Ticketmaster with click and ad attribution parameters", async () => {
    const response = await getRedirect(
      "ataca-sergio-newark",
      `?om_session_id=oms_test&om_click_id=omc_test&cta=hero&campaign_id=${META_CAMPAIGN_ID}&adset_id=${META_ADSET_ID}&ad_id=${META_AD_ID}&placement=instagram_stories&utm_content=story_v1`,
    );

    expect(response.status).toBe(302);
    const location = response.headers.get("location");
    expect(location).toContain("https://www.ticketmaster.com/event/02006478E042F9B1");
    const target = new URL(location ?? "");
    expect(target.searchParams.get("om_click_id")).toBe("omc_test");
    expect(target.searchParams.get("om_session_id")).toBe("oms_test");
    expect(target.searchParams.get("om_cta")).toBe("hero");
    expect(target.searchParams.get("om_funnel")).toBe("ataca-sergio");
    expect(target.searchParams.get("om_market")).toBe("newark");
    expect(target.searchParams.get("eventid")).toBe("02006478E042F9B1");
    expect(target.searchParams.get("tm_event_id")).toBe("02006478E042F9B1");
    expect(target.searchParams.get("ticketmaster_event_id")).toBe("02006478E042F9B1");
    expect(target.searchParams.get("tm_event_name")).toBe("Festival ATACA SERGIO");
    expect(target.searchParams.get("ticketmaster_event_name")).toBe("Festival ATACA SERGIO");
    expect(target.searchParams.get("campaign_id")).toBe(META_CAMPAIGN_ID);
    expect(target.searchParams.get("adset_id")).toBe(META_ADSET_ID);
    expect(target.searchParams.get("ad_id")).toBe(META_AD_ID);
    expect(target.searchParams.get("placement")).toBe("instagram_stories");
    expect(target.searchParams.get("utm_source")).toBe("meta");
    expect(target.searchParams.get("utm_medium")).toBe("paid_social");
    expect(target.searchParams.get("utm_campaign")).toBe("ataca_sergio_newark");
    expect(target.searchParams.get("utm_content")).toBe(META_AD_ID);
    expect(vi.mocked(recordTicketmasterAttributionHandoff).mock.calls[0]?.[0]).toMatchObject({
      ticketmasterEventId: "02006478E042F9B1",
      ticketmasterEventName: "Festival ATACA SERGIO",
    });
  });

  it("falls back to the original CFC value when no Meta ad id is present", async () => {
    const response = await getRedirect(
      "ataca-sergio-newark",
      "?om_click_id=omc_test&cta=hero&utm_content=story_v1",
    );

    const target = new URL(response.headers.get("location") ?? "");
    expect(target.searchParams.get("utm_content")).toBe("story_v1");
  });

  it("uses a valid Meta ad alias when an earlier ad id value is invalid", async () => {
    const response = await getRedirect(
      "ataca-sergio-newark",
      `?ad_id=bad&meta_ad_id=${META_AD_ID}&utm_content=story_v1`,
    );

    const target = new URL(response.headers.get("location") ?? "");
    expect(target.searchParams.get("ad_id")).toBe(META_AD_ID);
    expect(target.searchParams.get("utm_content")).toBe(META_AD_ID);
  });

  it("waits for the handoff write instead of timing out before redirect", async () => {
    vi.useFakeTimers();
    let handoffCompleted = false;
    vi.mocked(recordTicketmasterAttributionHandoff).mockImplementationOnce(() => new Promise<void>((resolve) => {
      setTimeout(() => {
        handoffCompleted = true;
        resolve();
      }, 300);
    }));

    let responseSettled = false;
    const responsePromise = getRedirect(
      "ataca-sergio-newark",
      `?om_session_id=oms_test&om_click_id=omc_test&cta=hero&ad_id=${META_AD_ID}`,
    ).then((response) => {
      responseSettled = true;
      return response;
    });

    await vi.advanceTimersByTimeAsync(250);
    expect(responseSettled).toBe(false);
    expect(handoffCompleted).toBe(false);

    await vi.advanceTimersByTimeAsync(50);
    const response = await responsePromise;

    expect(handoffCompleted).toBe(true);
    expect(response.status).toBe(302);
  });

  it("canonicalizes Meta attribution aliases before the Ticketmaster handoff", async () => {
    const response = await getRedirect(
      "ataca-sergio-newark",
      `?meta_campaign_id=${META_CAMPAIGN_ID}&meta_adset_id=${META_ADSET_ID}&meta_ad_id=${META_AD_ID}&site_source_name=ig`,
    );

    const target = new URL(response.headers.get("location") ?? "");
    expect(target.searchParams.get("campaign_id")).toBe(META_CAMPAIGN_ID);
    expect(target.searchParams.get("adset_id")).toBe(META_ADSET_ID);
    expect(target.searchParams.get("ad_id")).toBe(META_AD_ID);
    expect(target.searchParams.get("site_source")).toBe("ig");
    expect(target.searchParams.has("meta_campaign_id")).toBe(false);
    expect(target.searchParams.has("meta_adset_id")).toBe(false);
    expect(target.searchParams.has("meta_ad_id")).toBe(false);
  });

  it("rejects unknown ticket destination slugs", async () => {
    const response = await getRedirect("unknown");

    expect(response.status).toBe(404);
  });
});
