import { afterEach, describe, expect, it, vi } from "vitest";

const {
  safeLogAgentTaskDeferred,
  safeLogAgentTaskRequested,
  safeLogAgentTaskStarted,
  safeLogAgentTaskStatus,
} = vi.hoisted(() => ({
  safeLogAgentTaskDeferred: vi.fn().mockResolvedValue(undefined),
  safeLogAgentTaskRequested: vi.fn().mockResolvedValue(undefined),
  safeLogAgentTaskStarted: vi.fn().mockResolvedValue(undefined),
  safeLogAgentTaskStatus: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./system-events-service.js", () => ({
  safeLogAgentTaskDeferred,
  safeLogAgentTaskRequested,
  safeLogAgentTaskStarted,
  safeLogAgentTaskStatus,
}));

describe("queue-service", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
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

    const first = queue.enqueueTask("customer-whatsapp-agent", "boss", "channel-handoff", {}, "green");
    const second = queue.enqueueTask("customer-whatsapp-agent", "boss", "channel-handoff", {}, "green");

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

    const task = queue.enqueueTask("boss", "customer-whatsapp-agent", "deliver-approved-message", {}, "green");
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
});
