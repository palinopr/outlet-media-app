import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mockFrom } from "../setup";

const originalEnv = { ...process.env };

describe("POST /api/alerts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.INGEST_SECRET = "test-secret";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns 401 when secret is wrong", async () => {
    const { POST } = await import("@/app/api/alerts/route");
    const req = new Request("http://localhost/api/alerts", {
      method: "POST",
      body: JSON.stringify({ secret: "bad-secret", message: "hello" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns Unauthorized error message for wrong secret", async () => {
    const { POST } = await import("@/app/api/alerts/route");
    const req = new Request("http://localhost/api/alerts", {
      method: "POST",
      body: JSON.stringify({ secret: "bad-secret", message: "hello" }),
    });
    const res = await POST(req);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 400 when message is empty", async () => {
    const { POST } = await import("@/app/api/alerts/route");
    const req = new Request("http://localhost/api/alerts", {
      method: "POST",
      body: JSON.stringify({ secret: "test-secret", message: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when message is whitespace only", async () => {
    const { POST } = await import("@/app/api/alerts/route");
    const req = new Request("http://localhost/api/alerts", {
      method: "POST",
      body: JSON.stringify({ secret: "test-secret", message: "   " }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns ok true on successful insert", async () => {
    mockFrom.mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: null }),
    });

    const { POST } = await import("@/app/api/alerts/route");
    const req = new Request("http://localhost/api/alerts", {
      method: "POST",
      body: JSON.stringify({ secret: "test-secret", message: "Campaign overspend alert" }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
  });

  it("inserts alert with trimmed message", async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    mockFrom.mockReturnValue({ insert: mockInsert });

    const { POST } = await import("@/app/api/alerts/route");
    const req = new Request("http://localhost/api/alerts", {
      method: "POST",
      body: JSON.stringify({ secret: "test-secret", message: "  padded message  " }),
    });
    await POST(req);

    expect(mockInsert).toHaveBeenCalledWith({
      message: "padded message",
      level: "info",
    });
  });

  it("defaults level to info when not provided", async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    mockFrom.mockReturnValue({ insert: mockInsert });

    const { POST } = await import("@/app/api/alerts/route");
    const req = new Request("http://localhost/api/alerts", {
      method: "POST",
      body: JSON.stringify({ secret: "test-secret", message: "test" }),
    });
    await POST(req);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ level: "info" })
    );
  });

  it("uses provided level value", async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    mockFrom.mockReturnValue({ insert: mockInsert });

    const { POST } = await import("@/app/api/alerts/route");
    const req = new Request("http://localhost/api/alerts", {
      method: "POST",
      body: JSON.stringify({ secret: "test-secret", message: "critical!", level: "error" }),
    });
    await POST(req);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ level: "error" })
    );
  });

  it("returns 500 when database insert fails", async () => {
    mockFrom.mockReturnValue({
      insert: vi.fn().mockResolvedValue({
        error: { message: "constraint violation" },
      }),
    });

    const { POST } = await import("@/app/api/alerts/route");
    const req = new Request("http://localhost/api/alerts", {
      method: "POST",
      body: JSON.stringify({ secret: "test-secret", message: "test" }),
    });
    const res = await POST(req);

    expect(res.status).toBe(500);
  });
});

describe("PATCH /api/alerts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.INGEST_SECRET = "test-secret";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns 401 when secret is wrong", async () => {
    const { PATCH } = await import("@/app/api/alerts/route");
    const req = new Request("http://localhost/api/alerts", {
      method: "PATCH",
      body: JSON.stringify({ secret: "wrong" }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(401);
  });

  it("marks all unread alerts as read", async () => {
    const mockIs = vi.fn().mockResolvedValue({ error: null });
    const mockUpdate = vi.fn().mockReturnValue({ is: mockIs });
    mockFrom.mockReturnValue({ update: mockUpdate });

    const { PATCH } = await import("@/app/api/alerts/route");
    const req = new Request("http://localhost/api/alerts", {
      method: "PATCH",
      body: JSON.stringify({ secret: "test-secret" }),
    });
    const res = await PATCH(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
  });

  it("calls update on agent_alerts with read_at timestamp", async () => {
    const mockIs = vi.fn().mockResolvedValue({ error: null });
    const mockUpdate = vi.fn().mockReturnValue({ is: mockIs });
    mockFrom.mockReturnValue({ update: mockUpdate });

    const { PATCH } = await import("@/app/api/alerts/route");
    const req = new Request("http://localhost/api/alerts", {
      method: "PATCH",
      body: JSON.stringify({ secret: "test-secret" }),
    });
    await PATCH(req);

    expect(mockFrom).toHaveBeenCalledWith("agent_alerts");
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ read_at: expect.any(String) })
    );
  });
});

describe("GET /api/alerts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.INGEST_SECRET = "test-secret";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  function makeGetRequest() {
    return new Request("http://localhost/api/alerts?secret=test-secret");
  }

  it("returns 401 when secret is wrong", async () => {
    const { GET } = await import("@/app/api/alerts/route");
    const res = await GET(new Request("http://localhost/api/alerts?secret=wrong"));
    expect(res.status).toBe(401);
  });

  it("returns alerts array on success", async () => {
    const alertRows = [
      { id: 1, message: "Test alert", level: "info", created_at: "2026-03-01" },
    ];

    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        is: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: alertRows, error: null }),
          }),
        }),
      }),
    });

    const { GET } = await import("@/app/api/alerts/route");
    const res = await GET(makeGetRequest());
    const body = await res.json();

    expect(body.alerts).toEqual(alertRows);
  });

  it("returns empty alerts array when data is null", async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        is: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      }),
    });

    const { GET } = await import("@/app/api/alerts/route");
    const res = await GET(makeGetRequest());
    const body = await res.json();

    expect(body.alerts).toEqual([]);
  });

  it("limits to 10 unread alerts", async () => {
    const mockLimit = vi.fn().mockResolvedValue({ data: [], error: null });
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        is: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: mockLimit,
          }),
        }),
      }),
    });

    const { GET } = await import("@/app/api/alerts/route");
    await GET(makeGetRequest());

    expect(mockLimit).toHaveBeenCalledWith(10);
  });
});

describe("GET /api/alerts — supabase unavailable", () => {
  beforeEach(() => {
    process.env.INGEST_SECRET = "test-secret";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns empty alerts array when supabaseAdmin is null", async () => {
    vi.resetModules();
    vi.doMock("@/lib/supabase", () => ({ supabaseAdmin: null }));

    const { GET } = await import("@/app/api/alerts/route");
    const res = await GET(new Request("http://localhost/api/alerts?secret=test-secret"));
    const body = await res.json();

    expect(body.alerts).toEqual([]);
  });
});

describe("POST /api/alerts — supabase unavailable", () => {
  beforeEach(() => {
    process.env.INGEST_SECRET = "test-secret";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns 500 when supabaseAdmin is null", async () => {
    vi.resetModules();
    vi.doMock("@/lib/supabase", () => ({ supabaseAdmin: null }));

    const { POST } = await import("@/app/api/alerts/route");
    const req = new Request("http://localhost/api/alerts", {
      method: "POST",
      body: JSON.stringify({ secret: "test-secret", message: "test" }),
    });
    const res = await POST(req);

    expect(res.status).toBe(500);
  });
});
