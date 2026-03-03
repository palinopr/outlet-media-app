import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mockFrom } from "../setup";

const originalEnv = { ...process.env };

function makeRequest() {
  return new Request("http://localhost/api/agents/heartbeat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: "test-secret" }),
  });
}

// Reset modules for each test so we can control the supabaseAdmin export
describe("POST /api/agents/heartbeat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.INGEST_SECRET = "test-secret";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns 401 when secret is wrong", async () => {
    const { POST } = await import("@/app/api/agents/heartbeat/route");
    const req = new Request("http://localhost/api/agents/heartbeat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: "bad-secret" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 200 with ok true on successful insert", async () => {
    mockFrom.mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: null }),
    });

    const { POST } = await import("@/app/api/agents/heartbeat/route");
    const res = await POST(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
  });

  it("inserts into agent_jobs table", async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    mockFrom.mockReturnValue({ insert: mockInsert });

    const { POST } = await import("@/app/api/agents/heartbeat/route");
    await POST(makeRequest());

    expect(mockFrom).toHaveBeenCalledWith("agent_jobs");
  });

  it("inserts a heartbeat row with correct fields", async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    mockFrom.mockReturnValue({ insert: mockInsert });

    const { POST } = await import("@/app/api/agents/heartbeat/route");
    await POST(makeRequest());

    expect(mockInsert).toHaveBeenCalledWith({
      agent_id: "heartbeat",
      status: "done",
      prompt: null,
      result: "ping",
    });
  });

  it("returns 500 when supabase insert fails", async () => {
    mockFrom.mockReturnValue({
      insert: vi.fn().mockResolvedValue({
        error: { message: "DB connection lost" },
      }),
    });

    const { POST } = await import("@/app/api/agents/heartbeat/route");
    const res = await POST(makeRequest());

    expect(res.status).toBe(500);
  });

  it("returns ok false when insert fails", async () => {
    mockFrom.mockReturnValue({
      insert: vi.fn().mockResolvedValue({
        error: { message: "DB connection lost" },
      }),
    });

    const { POST } = await import("@/app/api/agents/heartbeat/route");
    const res = await POST(makeRequest());
    const body = await res.json();

    expect(body.ok).toBe(false);
  });
});

describe("POST /api/agents/heartbeat — supabase unavailable", () => {
  beforeEach(() => {
    process.env.INGEST_SECRET = "test-secret";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns 503 when supabaseAdmin is null", async () => {
    vi.resetModules();
    vi.doMock("@/lib/supabase", () => ({ supabaseAdmin: null }));

    const { POST } = await import("@/app/api/agents/heartbeat/route");
    const res = await POST(makeRequest());

    expect(res.status).toBe(503);
  });
});
