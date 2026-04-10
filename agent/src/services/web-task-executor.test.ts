import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  completeTask: vi.fn(),
  failTask: vi.fn(),
  runClaude: vi.fn(),
}));

vi.mock("../runner.js", () => ({
  runClaude: mocks.runClaude,
}));

vi.mock("./queue-service.js", () => ({
  completeTask: mocks.completeTask,
  failTask: mocks.failTask,
}));

describe("web-task-executor", () => {
  afterEach(() => {
    vi.clearAllMocks();
    mocks.completeTask.mockReset();
    mocks.failTask.mockReset();
    mocks.runClaude.mockReset();
    vi.resetModules();
  });

  it("runs a web-admin task with the canned agent prompt when no prompt is provided", async () => {
    mocks.runClaude.mockResolvedValue({
      success: true,
      text: "Meta summary",
    });

    const { createWebTaskExecutor } = await import("./web-task-executor.js");
    const execute = createWebTaskExecutor();

    await execute({
      action: "run",
      createdAt: new Date("2026-04-03T12:00:00.000Z"),
      from: "web-admin",
      id: "task_1",
      params: {},
      status: "running",
      tier: "green",
      to: "meta-ads",
    });

    expect(mocks.runClaude).toHaveBeenCalledWith(
      expect.objectContaining({
        maxTurns: 18,
        systemPromptName: "agent",
      }),
    );
    expect(mocks.completeTask).toHaveBeenCalledWith(
      "task_1",
      expect.objectContaining({
        agent: "meta-ads",
        source: "web-admin",
        text: "Meta summary",
      }),
    );
  });

  it("fails retired gmail-push tasks instead of executing them", async () => {
    const { createWebTaskExecutor } = await import("./web-task-executor.js");
    const execute = createWebTaskExecutor();

    await execute({
      action: "gmail-history",
      createdAt: new Date("2026-04-03T12:00:00.000Z"),
      from: "gmail-push",
      id: "task_gmail",
      params: {},
      status: "running",
      tier: "green",
      to: "email-agent",
    });

    expect(mocks.runClaude).not.toHaveBeenCalled();
    expect(mocks.failTask).toHaveBeenCalledWith(
      "task_gmail",
      "gmail-push tasks are no longer supported by the single-agent runtime",
    );
  });
});
