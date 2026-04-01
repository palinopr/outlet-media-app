import { beforeEach, describe, expect, it, vi } from "vitest";

const { getThread } = vi.hoisted(() => ({
  getThread: vi.fn(),
}));

vi.mock("@/features/client-agent/server", () => ({
  getThread,
}));

describe("client agent thread detail route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 404 when thread is unavailable/out of scope", async () => {
    getThread.mockResolvedValueOnce({
      ok: false,
      status: 404,
      body: { error: "Thread not found" },
    });

    const { GET } = await import("./route");
    const response = await GET(new Request("https://example.com"), {
      params: Promise.resolve({ slug: "acme", threadId: "thread_missing" }),
    });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({ error: "Thread not found" });
  });

  it("returns 200 with thread payload", async () => {
    getThread.mockResolvedValueOnce({
      ok: true,
      status: 200,
      body: {
        thread: {
          threadId: "thread_1",
          messages: [],
        },
      },
    });

    const { GET } = await import("./route");
    const response = await GET(new Request("https://example.com"), {
      params: Promise.resolve({ slug: "acme", threadId: "thread_1" }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      thread: {
        threadId: "thread_1",
        messages: [],
      },
    });
  });
});
