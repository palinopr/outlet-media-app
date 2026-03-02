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

  it("returns 401 when secret is wrong", async () => {
    const { POST } = await import("@/app/api/ingest/route");
    const res = await POST(makeRequest({ secret: "bad", source: "meta", data: { scraped_at: "" } }));
    expect(res.status).toBe(401);
  });

  it("returns 400 when secret is missing (Zod validation)", async () => {
    const { POST } = await import("@/app/api/ingest/route");
    const res = await POST(makeRequest({ source: "meta", data: { scraped_at: "" } }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for unknown source", async () => {
    const { POST } = await import("@/app/api/ingest/route");
    const res = await POST(
      makeRequest({ secret: "test-secret", source: "unknown", data: { scraped_at: "" } })
    );
    expect(res.status).toBe(400);
  });

  it("returns error message for unknown source (Zod validation)", async () => {
    const { POST } = await import("@/app/api/ingest/route");
    const res = await POST(
      makeRequest({ secret: "test-secret", source: "spotify", data: { scraped_at: "" } })
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
      makeRequest({ secret: "test-secret", source: "meta", data: { scraped_at: "" } })
    );

    expect(res.status).toBe(500);
  });
});

describe("POST /api/ingest — ticketmaster_one source", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.doMock("@/lib/supabase", () => ({ supabaseAdmin: { from: mockFrom } }));
    vi.clearAllMocks();
    process.env.INGEST_SECRET = "test-secret";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns ok with inserted 0 when events array is empty", async () => {
    const { POST } = await import("@/app/api/ingest/route");
    const res = await POST(
      makeRequest({
        secret: "test-secret",
        source: "ticketmaster_one",
        data: { events: [], scraped_at: "2026-03-01" },
      })
    );
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.inserted).toBe(0);
  });

  it("returns ok with inserted 0 when events key is missing", async () => {
    const { POST } = await import("@/app/api/ingest/route");
    const res = await POST(
      makeRequest({
        secret: "test-secret",
        source: "ticketmaster_one",
        data: { scraped_at: "2026-03-01" },
      })
    );
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.inserted).toBe(0);
  });

  it("upserts events into tm_events table", async () => {
    const mockUpsert = vi.fn().mockResolvedValue({ error: null });
    // For snapshot fallback query
    const mockSnapshotUpsert = vi.fn().mockResolvedValue({ error: null });

    mockFrom.mockImplementation((table: string) => {
      if (table === "tm_events") {
        return { upsert: mockUpsert };
      }
      if (table === "event_snapshots") {
        return { upsert: mockSnapshotUpsert };
      }
      return {
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockReturnValue({
            not: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      };
    });

    const { POST } = await import("@/app/api/ingest/route");
    const event = {
      tm_id: "ev1",
      tm1_number: "TM001",
      name: "Test Show",
      artist: "Test Artist",
      venue: "Test Venue",
      city: "NYC",
      date: "2026-04-01",
      status: "active",
      tickets_sold: 100,
      gross: 5000,
      url: "https://tm.com/ev1",
      scraped_at: "2026-03-01",
    };
    const res = await POST(
      makeRequest({
        secret: "test-secret",
        source: "ticketmaster_one",
        data: { events: [event], scraped_at: "2026-03-01" },
      })
    );
    const body = await res.json();

    expect(mockFrom).toHaveBeenCalledWith("tm_events");
    expect(mockUpsert).toHaveBeenCalled();
    expect(body.ok).toBe(true);
    expect(body.inserted).toBe(1);
  });

  it("returns 500 on tm_events upsert failure", async () => {
    mockFrom.mockImplementation((table: string) => {
      if (table === "tm_events") {
        return {
          upsert: vi.fn().mockResolvedValue({
            error: { message: "constraint error" },
          }),
        };
      }
      return {};
    });

    const { POST } = await import("@/app/api/ingest/route");
    const res = await POST(
      makeRequest({
        secret: "test-secret",
        source: "ticketmaster_one",
        data: {
          events: [
            {
              tm_id: "ev1", tm1_number: "TM001", name: "X", artist: "Y",
              venue: "Z", city: "A", date: "2026-04-01", status: "active",
              url: "https://tm.com", scraped_at: "2026-03-01",
            },
          ],
          scraped_at: "2026-03-01",
        },
      })
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
      })
    );
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.inserted).toBe(0);
  });

  it("upserts campaigns into meta_campaigns table", async () => {
    const mockUpsert = vi.fn().mockResolvedValue({ error: null });
    const mockSnapshotUpsert = vi.fn().mockResolvedValue({ error: null });
    // For stale campaign check
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
      })
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
      })
    );

    expect(res.status).toBe(500);
  });
});

describe("POST /api/ingest — tm_demographics source", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.INGEST_SECRET = "test-secret";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns ok with inserted 0 when demographics array is empty", async () => {
    const { POST } = await import("@/app/api/ingest/route");
    const res = await POST(
      makeRequest({
        secret: "test-secret",
        source: "tm_demographics",
        data: { demographics: [], scraped_at: "2026-03-01" },
      })
    );
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.inserted).toBe(0);
  });

  it("upserts demographics into tm_event_demographics table", async () => {
    const mockUpsert = vi.fn().mockResolvedValue({ error: null });
    mockFrom.mockReturnValue({ upsert: mockUpsert });

    const { POST } = await import("@/app/api/ingest/route");
    const res = await POST(
      makeRequest({
        secret: "test-secret",
        source: "tm_demographics",
        data: {
          demographics: [
            { tm_id: "ev1", fans_total: 5000, fetched_at: "2026-03-01" },
          ],
          scraped_at: "2026-03-01",
        },
      })
    );
    const body = await res.json();

    expect(mockFrom).toHaveBeenCalledWith("tm_event_demographics");
    expect(body.ok).toBe(true);
    expect(body.inserted).toBe(1);
  });

  it("returns 500 on demographics upsert failure", async () => {
    mockFrom.mockReturnValue({
      upsert: vi.fn().mockResolvedValue({
        error: { message: "upsert failed" },
      }),
    });

    const { POST } = await import("@/app/api/ingest/route");
    const res = await POST(
      makeRequest({
        secret: "test-secret",
        source: "tm_demographics",
        data: {
          demographics: [{ tm_id: "ev1", fetched_at: "2026-03-01" }],
          scraped_at: "2026-03-01",
        },
      })
    );

    expect(res.status).toBe(500);
  });
});

describe("GET /api/ingest", () => {
  it("returns status info about the ingest endpoint", async () => {
    const { GET } = await import("@/app/api/ingest/route");
    const res = await GET();
    const body = await res.json();

    expect(body.ok).toBe(true);
    expect(body.message).toContain("Ingest endpoint ready");
  });

  it("reports supabase connection status", async () => {
    const { GET } = await import("@/app/api/ingest/route");
    const res = await GET();
    const body = await res.json();

    expect(body).toHaveProperty("supabase_connected");
  });

  it("lists supported sources", async () => {
    const { GET } = await import("@/app/api/ingest/route");
    const res = await GET();
    const body = await res.json();

    expect(body.sources).toContain("ticketmaster_one");
    expect(body.sources).toContain("meta");
  });
});
