import { beforeEach, describe, expect, it, vi } from "vitest";

const { createThread, listThreads } = vi.hoisted(() => ({
  createThread: vi.fn(),
  listThreads: vi.fn(),
}));

vi.mock("@/features/client-agent/server", () => ({
  createThread,
  listThreads,
}));

describe("client agent threads route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("forwards list responses including 401 auth failures", async () => {
    listThreads.mockResolvedValueOnce({
      ok: false,
      status: 401,
      body: { error: "Unauthenticated" },
    });

    const { GET } = await import("./route");
    const response = await GET(new Request("https://example.com"), {
      params: Promise.resolve({ slug: "acme" }),
    });
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ error: "Unauthenticated" });
  });

  it("forwards 200 list payload", async () => {
    listThreads.mockResolvedValueOnce({
      ok: true,
      status: 200,
      body: {
        threads: [{ threadId: "thread_1" }],
      },
    });

    const { GET } = await import("./route");
    const response = await GET(new Request("https://example.com"), {
      params: Promise.resolve({ slug: "acme" }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      threads: [{ threadId: "thread_1" }],
    });
  });

  it("forwards create responses including 403 feature-disabled errors", async () => {
    createThread.mockResolvedValueOnce({
      ok: false,
      status: 403,
      body: { error: "Forbidden" },
    });

    const { POST } = await import("./route");
    const response = await POST(new Request("https://example.com", { method: "POST" }), {
      params: Promise.resolve({ slug: "acme" }),
    });
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body).toEqual({ error: "Forbidden" });
  });
});
