import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { runWithTypingHeartbeat } from "./typing-heartbeat";

describe("runWithTypingHeartbeat", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("fires immediately and keeps refreshing while the task is still running", async () => {
    const sendTyping = vi.fn(async () => undefined);
    let resolveTask!: () => void;
    const task = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveTask = resolve;
        }),
    );

    const pending = runWithTypingHeartbeat({
      intervalMs: 20_000,
      sendTyping,
      task,
    });

    expect(sendTyping).toHaveBeenCalledTimes(1);
    expect(task).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(19_999);
    expect(sendTyping).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1);
    expect(sendTyping).toHaveBeenCalledTimes(2);

    resolveTask();
    await pending;

    await vi.advanceTimersByTimeAsync(20_000);
    expect(sendTyping).toHaveBeenCalledTimes(2);
  });
});
