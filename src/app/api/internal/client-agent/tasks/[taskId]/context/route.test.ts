import { beforeEach, describe, expect, it, vi } from "vitest";

const { getTaskContext } = vi.hoisted(() => ({
  getTaskContext: vi.fn(),
}));

vi.mock("@/features/client-agent/worker-api", () => ({
  getTaskContext,
}));

describe("client-agent worker context route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CLIENT_AGENT_WORKER_SECRET = "worker-secret";
  });

  it("returns 401 when the worker secret is missing or invalid", async () => {
    const { GET } = await import("./route");

    const response = await GET(new Request("https://example.com"), {
      params: Promise.resolve({ taskId: "task_1" }),
    });
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ error: "Unauthorized" });
    expect(getTaskContext).not.toHaveBeenCalled();
  });

  it("returns the worker execution bundle for a valid pending task", async () => {
    getTaskContext.mockResolvedValueOnce({
      ok: true,
      context: {
        task_id: "task_1",
        thread_id: "thread_1",
        user_message_id: "msg_user_1",
        assistant_message_id: "msg_assistant_pending",
        scope_summary: {
          client_slug: "acme",
          events_enabled: true,
        },
        scope: {
          clientId: "client_1",
          clientMemberId: "member_1",
          clientSlug: "acme",
          allowedCampaignIds: ["cmp_1"],
          allowedEventIds: ["evt_1"],
          eventsEnabled: true,
          viewer: "member",
        },
        thread: {
          threadId: "thread_1",
          title: "How are we pacing?",
          previewText: "Thinking…",
          referencedEntities: [],
          lastResponseStatus: "pending",
          lastMessageAt: "2026-04-01T12:00:00.000Z",
          updatedAt: "2026-04-01T12:00:00.000Z",
          createdAt: "2026-04-01T12:00:00.000Z",
          messages: [],
        },
      },
    });

    const { GET } = await import("./route");
    const response = await GET(
      new Request("https://example.com", {
        headers: {
          Authorization: "Bearer worker-secret",
        },
      }),
      {
        params: Promise.resolve({ taskId: "task_1" }),
      },
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      thread_id: "thread_1",
      assistant_message_id: "msg_assistant_pending",
      scope_summary: {
        client_slug: "acme",
        events_enabled: true,
      },
    });
    expect(getTaskContext).toHaveBeenCalledWith("task_1");
  });

  it("forwards invalid task and wrong-task-type failures", async () => {
    const { GET } = await import("./route");

    getTaskContext.mockResolvedValueOnce({
      ok: false,
      status: 404,
      error: "Task not found",
    });

    const notFound = await GET(
      new Request("https://example.com", {
        headers: { Authorization: "Bearer worker-secret" },
      }),
      {
        params: Promise.resolve({ taskId: "task_missing" }),
      },
    );

    expect(notFound.status).toBe(404);

    getTaskContext.mockResolvedValueOnce({
      ok: false,
      status: 409,
      error: "Task is not a client-agent reply task",
    });

    const wrongType = await GET(
      new Request("https://example.com", {
        headers: { Authorization: "Bearer worker-secret" },
      }),
      {
        params: Promise.resolve({ taskId: "task_wrong" }),
      },
    );

    expect(wrongType.status).toBe(409);
  });
});
