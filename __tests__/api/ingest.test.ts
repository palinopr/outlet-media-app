import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mockFrom } from "../setup";

const originalEnv = { ...process.env };

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/ingest", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/ingest — auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.INGEST_SECRET = "test-secret";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("rejects oversized requests before parsing", async () => {
    const { POST } = await import("@/app/api/ingest/route");
    const res = await POST(
      new Request("http://localhost/api/ingest", {
        method: "POST",
        headers: { "Content-Length": String(6 * 1024 * 1024), "Content-Type": "application/json" },
        body: JSON.stringify({ secret: "test-secret", source: "meta", data: { scraped_at: "" } }),
      }),
    );
    expect(res.status).toBe(413);
  });

  it("returns 401 when secret is wrong", async () => {
    const { POST } = await import("@/app/api/ingest/route");
    const res = await POST(makeRequest({ secret: "bad", source: "meta", data: { scraped_at: "" } }));
    expect(res.status).toBe(401);
  });

  it("returns 400 when secret is missing", async () => {
    const { POST } = await import("@/app/api/ingest/route");
    const res = await POST(makeRequest({ source: "meta", data: { scraped_at: "" } }));
    expect(res.status).toBe(400);
  });

  it("rejects retired ingest sources at validation", async () => {
    const { POST } = await import("@/app/api/ingest/route");
    const res = await POST(
      makeRequest({ secret: "test-secret", source: "retired_ticketing", data: { scraped_at: "" } }),
    );
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Invalid payload");
  });

  it("returns error message for unknown source", async () => {
    const { POST } = await import("@/app/api/ingest/route");
    const res = await POST(
      makeRequest({ secret: "test-secret", source: "spotify", data: { scraped_at: "" } }),
    );
    const body = await res.json();
    expect(body.error).toBe("Invalid payload");
  });
});

describe("POST /api/ingest — supabase unavailable", () => {
  beforeEach(() => {
    process.env.INGEST_SECRET = "test-secret";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns 500 when supabaseAdmin is null", async () => {
    vi.resetModules();
    vi.doMock("@/lib/supabase", () => ({ supabaseAdmin: null }));

    const { POST } = await import("@/app/api/ingest/route");
    const res = await POST(
      makeRequest({ secret: "test-secret", source: "meta", data: { scraped_at: "" } }),
    );

    expect(res.status).toBe(500);
  });
});

describe("POST /api/ingest — meta source", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.doMock("@/lib/supabase", () => ({ supabaseAdmin: { from: mockFrom } }));
    vi.clearAllMocks();
    process.env.INGEST_SECRET = "test-secret";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns ok with inserted 0 when campaigns array is empty", async () => {
    const { POST } = await import("@/app/api/ingest/route");
    const res = await POST(
      makeRequest({
        secret: "test-secret",
        source: "meta",
        data: { campaigns: [], scraped_at: "2026-03-01" },
      }),
    );
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.inserted).toBe(0);
  });

  it("upserts campaigns into meta_campaigns table", async () => {
    const mockUpsert = vi.fn().mockResolvedValue({ error: null });
    const mockSnapshotUpsert = vi.fn().mockResolvedValue({ error: null });
    const mockStaleQuery = vi.fn().mockResolvedValue({ data: [], error: null });

    mockFrom.mockImplementation((table: string) => {
      if (table === "meta_campaigns") {
        return {
          upsert: mockUpsert,
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              not: vi.fn().mockReturnValue(mockStaleQuery()),
            }),
          }),
        };
      }
      if (table === "campaign_snapshots") {
        return { upsert: mockSnapshotUpsert };
      }
      return {};
    });

    const campaign = {
      campaign_id: "c1",
      name: "Test Campaign",
      status: "ACTIVE",
      spend: 100,
      impressions: 5000,
      clicks: 50,
    };

    const { POST } = await import("@/app/api/ingest/route");
    const res = await POST(
      makeRequest({
        secret: "test-secret",
        source: "meta",
        data: { campaigns: [campaign], scraped_at: "2026-03-01" },
      }),
    );
    const body = await res.json();

    expect(body.ok).toBe(true);
    expect(body.inserted).toBe(1);
  });

  it("returns 500 on meta_campaigns upsert failure", async () => {
    mockFrom.mockImplementation((table: string) => {
      if (table === "meta_campaigns") {
        return {
          upsert: vi.fn().mockResolvedValue({
            error: { message: "insert error" },
          }),
        };
      }
      return {};
    });

    const { POST } = await import("@/app/api/ingest/route");
    const res = await POST(
      makeRequest({
        secret: "test-secret",
        source: "meta",
        data: {
          campaigns: [
            { campaign_id: "c1", name: "X", status: "ACTIVE" },
          ],
          scraped_at: "2026-03-01",
        },
      }),
    );

    expect(res.status).toBe(500);
  });
});

describe("GET /api/ingest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.INGEST_SECRET = "test-secret";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  function makeGetRequest() {
    return new Request("http://localhost/api/ingest?secret=test-secret");
  }

  it("returns 401 when secret is wrong", async () => {
    const { GET } = await import("@/app/api/ingest/route");
    const res = await GET(new Request("http://localhost/api/ingest?secret=wrong"));
    expect(res.status).toBe(401);
  });

  it("returns status info about the ingest endpoint", async () => {
    const { GET } = await import("@/app/api/ingest/route");
    const res = await GET(makeGetRequest());
    const body = await res.json();

    expect(body.ok).toBe(true);
    expect(body.message).toContain("Ingest endpoint ready");
  });

  it("reports supabase connection status", async () => {
    const { GET } = await import("@/app/api/ingest/route");
    const res = await GET(makeGetRequest());
    const body = await res.json();

    expect(body).toHaveProperty("supabase_connected");
  });

  it("lists only supported sources", async () => {
    const { GET } = await import("@/app/api/ingest/route");
    const res = await GET(makeGetRequest());
    const body = await res.json();

    expect(body.sources).toEqual(["meta"]);
  });
});
