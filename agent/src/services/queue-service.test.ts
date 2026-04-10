import { afterEach, describe, expect, it, vi } from "vitest";

const {
  safeLogAgentTaskDeferred,
  safeLogAgentTaskRequested,
  safeLogAgentTaskStarted,
  safeLogAgentTaskStatus,
  createClientMock,
} = vi.hoisted(() => ({
  safeLogAgentTaskDeferred: vi.fn().mockResolvedValue(undefined),
  safeLogAgentTaskRequested: vi.fn().mockResolvedValue(undefined),
  safeLogAgentTaskStarted: vi.fn().mockResolvedValue(undefined),
  safeLogAgentTaskStatus: vi.fn().mockResolvedValue(undefined),
  createClientMock: vi.fn(),
}));

vi.mock("./system-events-service.js", () => ({
  safeLogAgentTaskDeferred,
  safeLogAgentTaskRequested,
  safeLogAgentTaskStarted,
  safeLogAgentTaskStatus,
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: createClientMock,
}));

describe("queue-service", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  });

  it("runs queued tasks through the registered executor one at a time per target agent", async () => {
    const queue = await import("./queue-service.js");

    const started: string[] = [];
    let releaseFirstTask: () => void = () => {};
    const firstTaskDone = new Promise<void>((resolve) => {
      releaseFirstTask = resolve;
    });

    queue.setTaskExecutor(async (task) => {
      started.push(task.id);
      if (started.length === 1) {
        await firstTaskDone;
      }
      queue.completeTask(task.id, { ok: true });
    });

    const first = queue.enqueueTask("client-manager", "boss", "channel-handoff", {}, "green");
    const second = queue.enqueueTask("client-manager", "boss", "channel-handoff", {}, "green");

    expect(started).toEqual([first.id]);
    expect(queue.getQueueDepth("boss")).toBe(1);
    expect(safeLogAgentTaskRequested).toHaveBeenCalledTimes(2);
    expect(safeLogAgentTaskStarted).toHaveBeenCalledTimes(1);

    releaseFirstTask();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(started).toEqual([first.id, second.id]);
    expect(queue.getQueueDepth("boss")).toBe(0);
    expect(safeLogAgentTaskStarted).toHaveBeenCalledTimes(2);
    expect(safeLogAgentTaskStatus).toHaveBeenCalledTimes(2);
  });

  it("waits for a task to reach a terminal state", async () => {
    const queue = await import("./queue-service.js");

    queue.setTaskExecutor(async (task) => {
      queue.completeTask(task.id, { text: "done" });
    });

    const task = queue.enqueueTask("boss", "client-manager", "deliver-approved-message", {}, "green");
    const terminal = await queue.waitForTaskTerminal(task.id, 1_000);

    expect(terminal.status).toBe("completed");
    expect(terminal.result).toEqual({ text: "done" });
  });

  it("defers a task and retries it without failing the queue slot", async () => {
    const queue = await import("./queue-service.js");

    let attempts = 0;
    queue.setTaskExecutor(async (task) => {
      attempts += 1;
      if (attempts === 1) {
        queue.deferTask(task.id, "waiting for gmail-inbox", 1);
        return;
      }

      queue.completeTask(task.id, { ok: true });
    });

    const task = queue.enqueueTask("boss", "email-agent", "check-inbox", {}, "green");
    const terminal = await queue.waitForTaskTerminal(task.id, 1_000);

    expect(attempts).toBe(2);
    expect(terminal.status).toBe("completed");
    expect(terminal.result).toEqual({ ok: true });
    expect(safeLogAgentTaskDeferred).toHaveBeenCalledTimes(1);
  });

  it("recovers pending web-admin tasks and retires unsupported gmail-push tasks", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role";

    const runningEq = vi.fn().mockResolvedValue({ data: [], error: null });
    const updateEq = vi.fn().mockResolvedValue({ error: null });
    const pendingOrder = vi.fn().mockResolvedValue({
      data: [
        {
          id: "task_web",
          from_agent: "web-admin",
          to_agent: "assistant",
          action: "chat",
          params: {},
          tier: "green",
          status: "pending",
          result: null,
          error: null,
          created_at: "2026-04-03T12:00:00.000Z",
          started_at: null,
          completed_at: null,
          discord_message_id: null,
          approved_by: null,
        },
        {
          id: "task_gmail",
          from_agent: "gmail-push",
          to_agent: "email-agent",
          action: "gmail-history",
          params: {},
          tier: "green",
          status: "pending",
          result: null,
          error: null,
          created_at: "2026-04-03T12:01:00.000Z",
          started_at: null,
          completed_at: null,
          discord_message_id: null,
          approved_by: null,
        },
      ],
      error: null,
    });
    const update = vi.fn(() => ({ eq: updateEq }));
    const upsert = vi.fn().mockResolvedValue({ error: null });
    const select = vi.fn((columns: string) => {
      if (columns === "id") {
        return { eq: runningEq };
      }

      return {
        eq: vi.fn(() => ({
          order: pendingOrder,
        })),
      };
    });

    createClientMock.mockReturnValue({
      from: vi.fn(() => ({
        select,
        update,
        upsert,
      })),
    });

    const queue = await import("./queue-service.js");
    const executed: string[] = [];

    queue.setTaskExecutor(async (task) => {
      executed.push(task.id);
      queue.completeTask(task.id, { ok: true });
    });

    await queue.initQueue();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(executed).toEqual(["task_web"]);
    expect(update).toHaveBeenCalledWith({
      completed_at: expect.any(String),
      error: "gmail-push tasks are no longer supported by the single-agent runtime",
      status: "failed",
    });
    expect(updateEq).toHaveBeenCalledWith("id", "task_gmail");
  });

  it("polls newly persisted web-admin tasks after startup", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role";

    const runningEq = vi.fn().mockResolvedValue({ data: [], error: null });
    const pendingOrder = vi
      .fn()
      .mockResolvedValueOnce({ data: [], error: null })
      .mockResolvedValueOnce({
        data: [
          {
            id: "task_live",
            from_agent: "web-admin",
            to_agent: "assistant",
            action: "chat",
            params: { prompt: "hello" },
            tier: "green",
            status: "pending",
            result: null,
            error: null,
            created_at: "2026-04-03T12:05:00.000Z",
            started_at: null,
            completed_at: null,
            discord_message_id: null,
            approved_by: null,
          },
        ],
        error: null,
      });
    const update = vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) }));
    const upsert = vi.fn().mockResolvedValue({ error: null });
    const select = vi.fn((columns: string) => {
      if (columns === "id") {
        return { eq: runningEq };
      }

      return {
        eq: vi.fn(() => ({
          order: pendingOrder,
        })),
      };
    });

    createClientMock.mockReturnValue({
      from: vi.fn(() => ({
        select,
        update,
        upsert,
      })),
    });

    const queue = await import("./queue-service.js");
    const executed: string[] = [];

    queue.setTaskExecutor(async (task) => {
      executed.push(task.id);
      queue.completeTask(task.id, { ok: true });
    });

    await queue.initQueue();
    await queue.pollPersistedTasksNow();
    const terminal = await queue.waitForTaskTerminal("task_live", 1_000);

    expect(executed).toEqual(["task_live"]);
    expect(terminal.status).toBe("completed");
  });
});
