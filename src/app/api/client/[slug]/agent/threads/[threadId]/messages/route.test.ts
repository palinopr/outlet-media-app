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

  it("returns the queued contract with the client request id", async () => {
    sendMessage.mockResolvedValueOnce({
      ok: true,
      status: 202,
      body: {
        status: "queued",
        thread_id: "thread_1",
        task_id: "task_1",
        assistant_message_id: "assistant_pending_1",
      },
    });

    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://example.com", {
        method: "POST",
        body: JSON.stringify({
          message: "How are campaigns doing?",
          client_request_id: "client_request_1",
        }),
        headers: { "Content-Type": "application/json" },
      }),
      {
        params: Promise.resolve({ slug: "acme", threadId: "thread_1" }),
      },
    );
    const body = await response.json();

    expect(response.status).toBe(202);
    expect(body).toEqual({
      status: "queued",
      client_request_id: "client_request_1",
      thread_id: "thread_1",
      task_id: "task_1",
      assistant_message_id: "assistant_pending_1",
    });
    expect(sendMessage).toHaveBeenCalledWith({
      slug: "acme",
      threadId: "thread_1",
      message: "How are campaigns doing?",
      clientGeneratedId: "client_request_1",
    });
  });
});
