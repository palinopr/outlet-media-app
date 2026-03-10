import { describe, it, expect, vi, beforeEach } from "vitest";

const { adminGuard, listAgentJobs } = vi.hoisted(() => ({
  adminGuard: vi.fn(),
  listAgentJobs: vi.fn(),
}));

vi.mock("@/lib/api-helpers", () => ({
  adminGuard,
  apiError: (message: string, status = 500) =>
    Response.json({ error: message }, { status }),
}));

vi.mock("@/lib/agent-jobs", () => ({
  listAgentJobs,
}));

describe("GET /api/agents/jobs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    adminGuard.mockResolvedValue(null);
  });

  it("returns jobs array on success", async () => {
    const mockJobs = [
      { id: "1", agent_id: "meta-ads", status: "done", prompt: null, result: "ok", error: null, created_at: "2026-03-01", started_at: null, finished_at: null },
    ];

    listAgentJobs.mockResolvedValue(mockJobs);

    const { GET } = await import("@/app/api/agents/jobs/route");
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.jobs).toEqual([...mockJobs].reverse());
  });

  it("calls listAgentJobs with limit 30", async () => {
    listAgentJobs.mockResolvedValue([]);

    const { GET } = await import("@/app/api/agents/jobs/route");
    await GET();

    expect(listAgentJobs).toHaveBeenCalledWith(30);
  });

  it("returns 500 with generic error on failure", async () => {
    listAgentJobs.mockRejectedValue(new Error("timeout"));

    const { GET } = await import("@/app/api/agents/jobs/route");
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Failed to fetch jobs");
  });

  it("returns empty jobs array when listAgentJobs returns empty", async () => {
    listAgentJobs.mockResolvedValue([]);

    const { GET } = await import("@/app/api/agents/jobs/route");
    const res = await GET();
    const body = await res.json();

    expect(body.jobs).toEqual([]);
  });

  it("returns 403 when admin guard fails", async () => {
    adminGuard.mockResolvedValue(Response.json({ error: "Forbidden" }, { status: 403 }));

    const { GET } = await import("@/app/api/agents/jobs/route");
    const res = await GET();

    expect(res.status).toBe(403);
  });
});
