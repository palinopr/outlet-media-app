import { describe, expect, it } from "vitest";
import { GET } from "./route";

function getCity(city: string) {
  return GET(new Request(`https://outletmedia.net/9am/${city}`), {
    params: Promise.resolve({ city }),
  });
}

describe("/9am/[city] funnel route", () => {
  it("serves each public city landing page without auth redirects", async () => {
    for (const city of ["philadelphia", "dc", "orlando", "atlanta"]) {
      const response = await getCity(city);
      const html = await response.text();

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("text/html");
      expect(html).toContain(`<base href="/9am/${city}/" />`);
      expect(html).toContain('fbq("init", "465799745886450")');
      expect(html).toContain('data-om-section="hero"');
      expect(html).toContain('src="/om-funnel-analytics.js"');
      expect(html).toContain("window.OmFunnelAnalytics?.start");
    }
  });

  it("rejects unknown city slugs", async () => {
    const response = await getCity("miami");

    expect(response.status).toBe(404);
  });
});
