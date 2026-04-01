import { beforeEach, describe, expect, it, vi } from "vitest";

const { sendMessage } = vi.hoisted(() => ({
  sendMessage: vi.fn(),
}));

vi.mock("@/features/client-agent/server", () => ({
  sendMessage,
}));

describe("client agent thread messages route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when message payload is invalid", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://example.com", {
        method: "POST",
        body: JSON.stringify({ message: "   " }),
        headers: { "Content-Type": "application/json" },
      }),
      {
        params: Promise.resolve({ slug: "acme", threadId: "thread_1" }),
      },
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual(
      expect.objectContaining({
        error: "Invalid payload",
      }),
    );
    expect(sendMessage).not.toHaveBeenCalled();
  });

  it("returns 200 for product refusals with the response contract shape", async () => {
    sendMessage.mockResolvedValueOnce({
      ok: true,
      status: 200,
      body: {
        status: "refuse",
        thread_id: "thread_1",
        message_id: "message_1",
        text: "I can only answer client-safe campaign and event questions.",
        blocks: [],
        referenced_entities: [],
        resolved_range: null,
      },
    });

    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://example.com", {
        method: "POST",
        body: JSON.stringify({
          message: "How is this wired internally?",
          client_generated_id: "client_message_1",
        }),
        headers: { "Content-Type": "application/json" },
      }),
      {
        params: Promise.resolve({ slug: "acme", threadId: "thread_1" }),
      },
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      status: "refuse",
      thread_id: "thread_1",
      message_id: "message_1",
      text: "I can only answer client-safe campaign and event questions.",
      blocks: [],
      referenced_entities: [],
      resolved_range: null,
    });
    expect(sendMessage).toHaveBeenCalledWith({
      slug: "acme",
      threadId: "thread_1",
      message: "How is this wired internally?",
      clientGeneratedId: "client_message_1",
    });
  });

  it("forwards 404 thread unavailable and 401 unauthenticated statuses", async () => {
    sendMessage.mockResolvedValueOnce({
      ok: false,
      status: 404,
      body: { error: "Thread not found" },
    });

    const { POST } = await import("./route");
    const notFoundResponse = await POST(
      new Request("https://example.com", {
        method: "POST",
        body: JSON.stringify({ message: "hello" }),
        headers: { "Content-Type": "application/json" },
      }),
      {
        params: Promise.resolve({ slug: "acme", threadId: "thread_missing" }),
      },
    );

    expect(notFoundResponse.status).toBe(404);

    sendMessage.mockResolvedValueOnce({
      ok: false,
      status: 401,
      body: { error: "Unauthenticated" },
    });

    const unauthenticatedResponse = await POST(
      new Request("https://example.com", {
        method: "POST",
        body: JSON.stringify({ message: "hello again" }),
        headers: { "Content-Type": "application/json" },
      }),
      {
        params: Promise.resolve({ slug: "acme", threadId: "thread_1" }),
      },
    );

    expect(unauthenticatedResponse.status).toBe(401);
  });
});
