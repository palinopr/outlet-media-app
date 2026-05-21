import { describe, expect, it } from "vitest";
import { GET } from "./route";

function getMarket(market: string) {
  return GET(new Request(`https://outletmedia.net/ataca-sergio/${market}`), {
    params: Promise.resolve({ market }),
  });
}

describe("/ataca-sergio/[market] funnel route", () => {
  it("serves the Newark public landing page without auth redirects", async () => {
    const response = await getMarket("newark");
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    expect(html).toContain('<base href="/ataca-sergio/newark/" />');
    expect(html).toContain('fbq("init", "1553637492361321")');
    expect(html).toContain("Festival Ataca Sergio");
    expect(html).toContain('data-slug="la-india"');
    expect(html).toContain('data-proof="la-india"');
    expect(html).toContain('data-om-section="hero"');
    expect(html).toContain('src="/om-funnel-analytics.js"');
    expect(html).toContain("window.OmFunnelAnalytics?.start");
    expect(html).toContain("la-india-message.mp4");
    expect(html).toContain("https://www.ticketmaster.com/event/02006478E042F9B1");
  });

  it("rejects unknown market slugs", async () => {
    const response = await getMarket("miami");

    expect(response.status).toBe(404);
  });
});
