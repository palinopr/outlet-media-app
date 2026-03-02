import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockFrom } from "../setup";

describe("POST /api/agents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 for unknown agent", async () => {
    const { POST } = await import("@/app/api/agents/route");
    const req = new Request("http://localhost/api/agents", {
      method: "POST",
      body: JSON.stringify({ agent: "unknown-agent" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns error message for unknown agent (Zod validation)", async () => {
    const { POST } = await import("@/app/api/agents/route");
    const req = new Request("http://localhost/api/agents", {
      method: "POST",
      body: JSON.stringify({ agent: "invalid" }),
    });
    const res = await POST(req);
    const body = await res.json();
    expect(body.error).toBe("Invalid payload");
  });

  it("accepts tm-monitor as valid agent", async () => {
    const mockInsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: { id: 1, agent_id: "tm-monitor", status: "pending", created_at: "2026-03-01" },
          error: null,
        }),
      }),
    });
    mockFrom.mockReturnValue({ insert: mockInsert });

    const { POST } = await import("@/app/api/agents/route");
    const req = new Request("http://localhost/api/agents", {
      method: "POST",
      body: JSON.stringify({ agent: "tm-monitor" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("accepts meta-ads as valid agent", async () => {
    const mockInsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: { id: 2, agent_id: "meta-ads", status: "pending", created_at: "2026-03-01" },
          error: null,
        }),
      }),
    });
    mockFrom.mockReturnValue({ insert: mockInsert });

    const { POST } = await import("@/app/api/agents/route");
    const req = new Request("http://localhost/api/agents", {
      method: "POST",
      body: JSON.stringify({ agent: "meta-ads" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("accepts campaign-monitor as valid agent", async () => {
    const mockInsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: { id: 3, agent_id: "campaign-monitor", status: "pending", created_at: "2026-03-01" },
          error: null,
        }),
      }),
    });
    mockFrom.mockReturnValue({ insert: mockInsert });

    const { POST } = await import("@/app/api/agents/route");
    const req = new Request("http://localhost/api/agents", {
      method: "POST",
      body: JSON.stringify({ agent: "campaign-monitor" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("accepts assistant as valid agent", async () => {
    const mockInsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: { id: 4, agent_id: "assistant", status: "pending", created_at: "2026-03-01" },
          error: null,
        }),
      }),
    });
    mockFrom.mockReturnValue({ insert: mockInsert });

    const { POST } = await import("@/app/api/agents/route");
    const req = new Request("http://localhost/api/agents", {
      method: "POST",
      body: JSON.stringify({ agent: "assistant" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("inserts a pending job with prompt", async () => {
    const mockInsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: { id: 5, agent_id: "tm-monitor", status: "pending", created_at: "2026-03-01" },
          error: null,
        }),
      }),
    });
    mockFrom.mockReturnValue({ insert: mockInsert });

    const { POST } = await import("@/app/api/agents/route");
    const req = new Request("http://localhost/api/agents", {
      method: "POST",
      body: JSON.stringify({ agent: "tm-monitor", prompt: "check sales" }),
    });
    await POST(req);

    expect(mockInsert).toHaveBeenCalledWith({
      agent_id: "tm-monitor",
      status: "pending",
      prompt: "check sales",
    });
  });

  it("sets prompt to null when not provided", async () => {
    const mockInsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: { id: 6, agent_id: "tm-monitor", status: "pending", created_at: "2026-03-01" },
          error: null,
        }),
      }),
    });
    mockFrom.mockReturnValue({ insert: mockInsert });

    const { POST } = await import("@/app/api/agents/route");
    const req = new Request("http://localhost/api/agents", {
      method: "POST",
      body: JSON.stringify({ agent: "tm-monitor" }),
    });
    await POST(req);

    expect(mockInsert).toHaveBeenCalledWith({
      agent_id: "tm-monitor",
      status: "pending",
      prompt: null,
    });
  });

  it("returns the created job on success", async () => {
    const jobData = { id: 7, agent_id: "tm-monitor", status: "pending", created_at: "2026-03-01" };
    mockFrom.mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: jobData, error: null }),
        }),
      }),
    });

    const { POST } = await import("@/app/api/agents/route");
    const req = new Request("http://localhost/api/agents", {
      method: "POST",
      body: JSON.stringify({ agent: "tm-monitor" }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(body.job).toEqual(jobData);
  });

  it("returns 500 when database insert fails", async () => {
    mockFrom.mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: "duplicate key" },
          }),
        }),
      }),
    });

    const { POST } = await import("@/app/api/agents/route");
    const req = new Request("http://localhost/api/agents", {
      method: "POST",
      body: JSON.stringify({ agent: "tm-monitor" }),
    });
    const res = await POST(req);

    expect(res.status).toBe(500);
  });

  it("returns error message when insert fails", async () => {
    mockFrom.mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: "duplicate key" },
          }),
        }),
      }),
    });

    const { POST } = await import("@/app/api/agents/route");
    const req = new Request("http://localhost/api/agents", {
      method: "POST",
      body: JSON.stringify({ agent: "tm-monitor" }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(body.error).toBe("duplicate key");
  });
});

describe("POST /api/agents — supabase unavailable", () => {
  it("returns 503 when supabaseAdmin is null", async () => {
    vi.resetModules();
    vi.doMock("@/lib/supabase", () => ({ supabaseAdmin: null }));

    const { POST } = await import("@/app/api/agents/route");
    const req = new Request("http://localhost/api/agents", {
      method: "POST",
      body: JSON.stringify({ agent: "tm-monitor" }),
    });
    const res = await POST(req);

    expect(res.status).toBe(503);
  });
});

describe("GET /api/agents", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.doMock("@/lib/supabase", () => ({ supabaseAdmin: { from: mockFrom } }));
    vi.clearAllMocks();
  });

  it("returns agents array on success", async () => {
    const dbRows = [
      { agent_id: "tm-monitor", status: "done", result: "ok", error: null, finished_at: "2026-03-01T10:00:00Z" },
      { agent_id: "meta-ads", status: "pending", result: null, error: null, finished_at: null },
    ];

    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({ data: dbRows, error: null }),
        }),
      }),
    });

    const { GET } = await import("@/app/api/agents/route");
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.agents).toHaveLength(4);
  });

  it("maps latest job status per agent", async () => {
    const dbRows = [
      { agent_id: "tm-monitor", status: "done", result: "synced 10 events", error: null, finished_at: "2026-03-01T10:00:00Z" },
    ];

    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({ data: dbRows, error: null }),
        }),
      }),
    });

    const { GET } = await import("@/app/api/agents/route");
    const res = await GET();
    const body = await res.json();

    const tmAgent = body.agents.find((a: { agent_id: string }) => a.agent_id === "tm-monitor");
    expect(tmAgent.status).toBe("done");
    expect(tmAgent.last_result).toBe("synced 10 events");
  });

  it("defaults to idle status for agents with no jobs", async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
      }),
    });

    const { GET } = await import("@/app/api/agents/route");
    const res = await GET();
    const body = await res.json();

    for (const agent of body.agents) {
      expect(agent.status).toBe("idle");
      expect(agent.last_run).toBeNull();
    }
  });

  it("returns 500 when database query fails", async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({ data: null, error: { message: "connection refused" } }),
        }),
      }),
    });

    const { GET } = await import("@/app/api/agents/route");
    const res = await GET();

    expect(res.status).toBe(500);
  });
});

describe("GET /api/agents — supabase unavailable", () => {
  it("returns idle stubs for all agents when supabaseAdmin is null", async () => {
    vi.resetModules();
    vi.doMock("@/lib/supabase", () => ({ supabaseAdmin: null }));

    const { GET } = await import("@/app/api/agents/route");
    const res = await GET();
    const body = await res.json();

    expect(body.agents).toHaveLength(4);
    for (const agent of body.agents) {
      expect(agent.status).toBe("idle");
    }
  });
});
