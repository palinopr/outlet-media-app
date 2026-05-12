import { describe, expect, it } from "vitest";
import { GET } from "./route";

function getRedirect(slug: string, query = "") {
  return GET(new Request(`https://outletmedia.net/out/ticketmaster/${slug}${query}`), {
    params: Promise.resolve({ slug }),
  });
}

describe("GET /out/ticketmaster/[slug]", () => {
  it("redirects through to Ticketmaster with click and ad attribution parameters", async () => {
    const response = await getRedirect(
      "ataca-sergio-newark",
      "?om_session_id=oms_test&om_click_id=omc_test&cta=hero&campaign_id=111&adset_id=222&ad_id=333&placement=instagram_stories&utm_content=story_v1",
    );

    expect(response.status).toBe(302);
    const location = response.headers.get("location");
    expect(location).toContain("https://www.ticketmaster.com/event/02006478E042F9B1");
    const target = new URL(location ?? "");
    expect(target.searchParams.get("om_click_id")).toBe("omc_test");
    expect(target.searchParams.get("om_session_id")).toBe("oms_test");
    expect(target.searchParams.get("om_cta")).toBe("hero");
    expect(target.searchParams.get("campaign_id")).toBe("111");
    expect(target.searchParams.get("adset_id")).toBe("222");
    expect(target.searchParams.get("ad_id")).toBe("333");
    expect(target.searchParams.get("placement")).toBe("instagram_stories");
    expect(target.searchParams.get("utm_source")).toBe("meta");
    expect(target.searchParams.get("utm_medium")).toBe("paid_social");
    expect(target.searchParams.get("utm_campaign")).toBe("ataca_sergio_newark");
    expect(target.searchParams.get("utm_content")).toBe("story_v1");
  });

  it("rejects unknown ticket destination slugs", async () => {
    const response = await getRedirect("unknown");

    expect(response.status).toBe(404);
  });
});
