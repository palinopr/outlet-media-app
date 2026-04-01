import { beforeEach, describe, expect, it, vi } from "vitest";

const { resolveTask } = vi.hoisted(() => ({
  resolveTask: vi.fn(),
}));

vi.mock("@/features/client-agent/worker-api", () => ({
  resolveTask,
}));

describe("client-agent worker resolve route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CLIENT_AGENT_WORKER_SECRET = "worker-secret";
  });

  it("returns 401 when the worker secret is missing or invalid", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://example.com", {
        method: "POST",
        body: JSON.stringify({ status: "error", text: "Unable to answer right now." }),
        headers: { "Content-Type": "application/json" },
      }),
      {
        params: Promise.resolve({ taskId: "task_1" }),
      },
    );

    expect(response.status).toBe(401);
    expect(resolveTask).not.toHaveBeenCalled();
  });

  it("forwards successful assistant resolutions", async () => {
    resolveTask.mockResolvedValueOnce({
      ok: true,
      body: {
        status: "answer",
        thread_id: "thread_1",
        assistant_message_id: "msg_assistant_pending",
      },
    });

    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://example.com", {
        method: "POST",
        body: JSON.stringify({
          status: "answer",
          text: "You are pacing ahead of target.",
          referenced_entities: [],
          context_payload: null,
          resolved_range: null,
          provider_response_id: "resp_1",
        }),
        headers: {
          Authorization: "Bearer worker-secret",
          "Content-Type": "application/json",
        },
      }),
      {
        params: Promise.resolve({ taskId: "task_1" }),
      },
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      status: "answer",
      assistant_message_id: "msg_assistant_pending",
    });
    expect(resolveTask).toHaveBeenCalledWith("task_1", {
      blocks: [],
      contextPayload: null,
      providerResponseId: "resp_1",
      referencedEntities: [],
      resolvedRange: null,
      status: "answer",
      text: "You are pacing ahead of target.",
    });
  });

  it("forwards failure resolutions that mark the placeholder error", async () => {
    resolveTask.mockResolvedValueOnce({
      ok: true,
      body: {
        status: "error",
        thread_id: "thread_1",
        assistant_message_id: "msg_assistant_pending",
      },
    });

    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://example.com", {
        method: "POST",
        body: JSON.stringify({
          status: "error",
          text: "Unable to answer right now.",
        }),
        headers: {
          Authorization: "Bearer worker-secret",
          "Content-Type": "application/json",
        },
      }),
      {
        params: Promise.resolve({ taskId: "task_1" }),
      },
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      status: "error",
      assistant_message_id: "msg_assistant_pending",
    });
    expect(resolveTask).toHaveBeenCalledWith("task_1", {
      blocks: [],
      contextPayload: null,
      providerResponseId: null,
      referencedEntities: [],
      resolvedRange: null,
      status: "error",
      text: "Unable to answer right now.",
    });
  });

  it("forwards invalid task and wrong-task-type failures", async () => {
    const { POST } = await import("./route");

    resolveTask.mockResolvedValueOnce({
      ok: false,
      status: 404,
      error: "Task not found",
    });

    const missing = await POST(
      new Request("https://example.com", {
        method: "POST",
        body: JSON.stringify({
          status: "error",
          text: "Unable to answer right now.",
        }),
        headers: {
          Authorization: "Bearer worker-secret",
          "Content-Type": "application/json",
        },
      }),
      {
        params: Promise.resolve({ taskId: "task_missing" }),
      },
    );

    expect(missing.status).toBe(404);

    resolveTask.mockResolvedValueOnce({
      ok: false,
      status: 409,
      error: "Task is not a client-agent reply task",
    });

    const wrongType = await POST(
      new Request("https://example.com", {
        method: "POST",
        body: JSON.stringify({
          status: "error",
          text: "Unable to answer right now.",
        }),
        headers: {
          Authorization: "Bearer worker-secret",
          "Content-Type": "application/json",
        },
      }),
      {
        params: Promise.resolve({ taskId: "task_wrong" }),
      },
    );

    expect(wrongType.status).toBe(409);
  });
});
