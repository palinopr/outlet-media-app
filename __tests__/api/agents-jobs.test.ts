import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockFrom } from "../setup";

describe("GET /api/agents/jobs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns jobs array on success", async () => {
    const mockJobs = [
      { id: 1, agent_id: "meta-ads", status: "done", prompt: null, result: "ok", error: null, created_at: "2026-03-01", started_at: null, finished_at: null },
    ];

    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        neq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: mockJobs, error: null }),
          }),
        }),
      }),
    });

    const { GET } = await import("@/app/api/agents/jobs/route");
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.jobs).toEqual(mockJobs);
  });

  it("excludes heartbeat rows from results", async () => {
    const mockNeq = vi.fn().mockReturnValue({
      order: vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    });

    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        neq: mockNeq,
      }),
    });

    const { GET } = await import("@/app/api/agents/jobs/route");
    await GET();

    expect(mockNeq).toHaveBeenCalledWith("agent_id", "heartbeat");
  });

  it("limits results to 30 rows", async () => {
    const mockLimit = vi.fn().mockResolvedValue({ data: [], error: null });

    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        neq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: mockLimit,
          }),
        }),
      }),
    });

    const { GET } = await import("@/app/api/agents/jobs/route");
    await GET();

    expect(mockLimit).toHaveBeenCalledWith(30);
  });

  it("returns 500 with error message on database failure", async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        neq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: null, error: { message: "timeout" } }),
          }),
        }),
      }),
    });

    const { GET } = await import("@/app/api/agents/jobs/route");
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("timeout");
  });

  it("returns empty jobs array when data is null", async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        neq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      }),
    });

    const { GET } = await import("@/app/api/agents/jobs/route");
    const res = await GET();
    const body = await res.json();

    expect(body.jobs).toEqual([]);
  });
});

describe("GET /api/agents/jobs — supabase unavailable", () => {
  it("returns empty jobs array when supabaseAdmin is null", async () => {
    vi.resetModules();
    vi.doMock("@/lib/supabase", () => ({ supabaseAdmin: null }));

    const { GET } = await import("@/app/api/agents/jobs/route");
    const res = await GET();
    const body = await res.json();

    expect(body.jobs).toEqual([]);
  });
});
