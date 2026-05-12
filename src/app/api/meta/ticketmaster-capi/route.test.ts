import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

function request(url: string) {
  return new Request(url, {
    headers: {
      "user-agent": "vitest-browser",
      "x-forwarded-for": "203.0.113.10",
      referer: "https://www.ticketmaster.com/event/02006478E042F9B1?fbclid=from-referrer",
    },
  });
}

describe("GET /api/meta/ticketmaster-capi", () => {
  beforeEach(() => {
    vi.stubEnv("META_CAPI_ACCESS_TOKEN", "test-capi-token");
    vi.stubEnv("META_CAPI_PIXEL_ID", "1553637492361321");
    vi.stubEnv("TICKETMASTER_CAPI_PIXEL_SECRET", "ticketmaster-secret");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ events_received: 1 }), {
          headers: { "content-type": "application/json" },
          status: 200,
        }),
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns a 1x1 image and forwards valid Ticketmaster purchase data to Meta CAPI", async () => {
    const response = await GET(
      request(
        "https://outletmedia.net/api/meta/ticketmaster-capi?key=ticketmaster-secret&order_id=ABC123&value=125.50&currency=USD&eventname=Festival%20Ataca%20Sergio&eventdate=2026-05-30&eventid=02006478E042F9B1&quantity=2",
      ),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("image/gif");
    expect(fetch).toHaveBeenCalledTimes(1);

    const [url, init] = vi.mocked(fetch).mock.calls[0] ?? [];
    expect(String(url)).toContain("/v21.0/1553637492361321/events");
    expect(String(url)).toContain("access_token=test-capi-token");
    expect(init?.method).toBe("POST");

    const body = JSON.parse(String(init?.body));
    const event = body.data[0];
    expect(event.event_name).toBe("Purchase");
    expect(event.action_source).toBe("website");
    expect(event.event_id).toMatch(/^tm_/);
    expect(event.event_source_url).toContain("ticketmaster.com/event/02006478E042F9B1");
    expect(event.custom_data).toMatchObject({
      content_ids: ["02006478E042F9B1"],
      content_name: "Festival Ataca Sergio",
      currency: "USD",
      event_date: "2026-05-30",
      num_items: 2,
      order_id: "ABC123",
      value: 125.5,
    });
    expect(event.user_data).toMatchObject({
      client_ip_address: "203.0.113.10",
      client_user_agent: "vitest-browser",
      fbc: expect.stringContaining("from-referrer"),
    });
  });

  it("does not forward events when the static Ticketmaster key is missing or wrong", async () => {
    const response = await GET(
      request(
        "https://outletmedia.net/api/meta/ticketmaster-capi?key=wrong&order_id=ABC123&value=125.50",
      ),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("image/gif");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("does not forward malformed purchases without an order id and value", async () => {
    const response = await GET(
      request("https://outletmedia.net/api/meta/ticketmaster-capi?key=ticketmaster-secret&eventname=Festival"),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("image/gif");
    expect(fetch).not.toHaveBeenCalled();
  });
});
