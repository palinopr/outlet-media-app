import { afterEach, describe, expect, it, vi } from "vitest";

describe("queue-service", () => {
  afterEach(() => {
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

    releaseFirstTask();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(started).toEqual([first.id, second.id]);
    expect(queue.getQueueDepth("boss")).toBe(0);
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
});
