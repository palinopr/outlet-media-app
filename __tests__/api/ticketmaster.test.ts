import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { GET } from "@/app/api/ticketmaster/route";

vi.mock("@/lib/supabase", () => ({ supabaseAdmin: null }));

const originalEnv = { ...process.env };

describe("GET /api/ticketmaster", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    process.env.TICKETMASTER_API_KEY = "tm-test-key";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  it("returns 500 when TICKETMASTER_API_KEY is missing", async () => {
    delete process.env.TICKETMASTER_API_KEY;
    const req = new Request("http://localhost/api/ticketmaster");
    const res = await GET(req);
    expect(res.status).toBe(500);
  });

  it("returns error message when API key is not configured", async () => {
    delete process.env.TICKETMASTER_API_KEY;
    const req = new Request("http://localhost/api/ticketmaster");
    const res = await GET(req);
    const body = await res.json();
    expect(body.error).toBe("TICKETMASTER_API_KEY not configured");
  });

  it("calls Ticketmaster discovery API", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ _embedded: { events: [] } }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const req = new Request("http://localhost/api/ticketmaster");
    await GET(req);

    expect(mockFetch).toHaveBeenCalledOnce();
    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain("app.ticketmaster.com/discovery/v2/events");
  });

  it("passes API key in query params", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({}),
    });
    vi.stubGlobal("fetch", mockFetch);

    const req = new Request("http://localhost/api/ticketmaster");
    await GET(req);

    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain("apikey=tm-test-key");
  });

  it("sets classificationName to music", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({}),
    });
    vi.stubGlobal("fetch", mockFetch);

    const req = new Request("http://localhost/api/ticketmaster");
    await GET(req);

    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain("classificationName=music");
  });

  it("includes keyword when provided as query param", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({}),
    });
    vi.stubGlobal("fetch", mockFetch);

    const req = new Request("http://localhost/api/ticketmaster?keyword=beyonce");
    await GET(req);

    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain("keyword=beyonce");
  });

  it("omits keyword param when not provided", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({}),
    });
    vi.stubGlobal("fetch", mockFetch);

    const req = new Request("http://localhost/api/ticketmaster");
    await GET(req);

    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).not.toContain("keyword=");
  });

  it("forwards the JSON response from Ticketmaster", async () => {
    const apiPayload = { _embedded: { events: [{ id: "ev1" }] } };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(apiPayload),
      })
    );

    const req = new Request("http://localhost/api/ticketmaster");
    const res = await GET(req);
    const body = await res.json();
    expect(body).toEqual(apiPayload);
  });
});
