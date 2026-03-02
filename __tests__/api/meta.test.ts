import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { GET } from "@/app/api/meta/route";

// We don't need supabase mocks for meta route — it calls fetch directly
vi.mock("@/lib/supabase", () => ({ supabaseAdmin: null }));

const originalEnv = { ...process.env };

describe("GET /api/meta", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    process.env.META_ACCESS_TOKEN = "test-token";
    process.env.META_AD_ACCOUNT_ID = "123456";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  it("returns 500 when META_ACCESS_TOKEN is missing", async () => {
    delete process.env.META_ACCESS_TOKEN;
    const req = new Request("http://localhost/api/meta");
    const res = await GET(req);
    expect(res.status).toBe(500);
  });

  it("returns 500 when META_AD_ACCOUNT_ID is missing and no query param", async () => {
    delete process.env.META_AD_ACCOUNT_ID;
    const req = new Request("http://localhost/api/meta");
    const res = await GET(req);
    expect(res.status).toBe(500);
  });

  it("returns error message when credentials are missing", async () => {
    delete process.env.META_ACCESS_TOKEN;
    const req = new Request("http://localhost/api/meta");
    const res = await GET(req);
    const body = await res.json();
    expect(body.error).toBe("Meta API credentials not configured");
  });

  it("calls Facebook Graph API with correct URL", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ data: [] }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const req = new Request("http://localhost/api/meta");
    await GET(req);

    expect(mockFetch).toHaveBeenCalledOnce();
    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain("graph.facebook.com/v21.0/act_123456/campaigns");
  });

  it("passes access_token and fields in query params", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ data: [] }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const req = new Request("http://localhost/api/meta");
    await GET(req);

    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain("access_token=test-token");
    expect(calledUrl).toContain("fields=");
  });

  it("strips act_ prefix from account_id to avoid duplication", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ data: [] }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const req = new Request("http://localhost/api/meta?account_id=act_789");
    await GET(req);

    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain("act_789");
    expect(calledUrl).not.toContain("act_act_789");
  });

  it("uses query param account_id over env var", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ data: [] }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const req = new Request("http://localhost/api/meta?account_id=999");
    await GET(req);

    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain("act_999");
  });

  it("forwards the JSON response from Facebook API", async () => {
    const apiPayload = { data: [{ id: "1", name: "Campaign A" }] };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: () => Promise.resolve(apiPayload),
      })
    );

    const req = new Request("http://localhost/api/meta");
    const res = await GET(req);
    const body = await res.json();
    expect(body).toEqual(apiPayload);
  });
});
