import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("/9am/orlando funnel route", () => {
  it("serves the public client landing page without auth redirects", async () => {
    const response = await GET();
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    expect(html).toContain('<base href="/9am/orlando/" />');
    expect(html).toContain("Perreo at 9AM Orlando");
    expect(html).toContain('fbq("init", "465799745886450")');
  });
});
