import { afterEach, describe, expect, it, vi } from "vitest";
import type { Message } from "discord.js";

const mocks = vi.hoisted(() => {
  const runClaude = vi.fn();
  const sendAsAgent = vi.fn().mockResolvedValue(undefined);
  const getAgentForChannel = vi.fn(() => ({
    readOnly: false,
    promptFile: "agent",
    maxTurns: 3,
  }));
  const channelSessions = new Map<string, string>();
  const markChannelLockAcquired = vi.fn();
  const markChannelLockHeartbeat = vi.fn();
  const markChannelLockReleased = vi.fn();

  return {
    channelSessions,
    runClaude,
    sendAsAgent,
    getAgentForChannel,
    markChannelLockAcquired,
    markChannelLockHeartbeat,
    markChannelLockReleased,
  };
});

vi.mock("../runner.js", () => ({
  runClaude: mocks.runClaude,
}));

vi.mock("../discord/core/router.js", () => ({
  getAgentForChannel: mocks.getAgentForChannel,
}));

vi.mock("../services/webhook-service.js", () => ({
  sendAsAgent: mocks.sendAsAgent,
}));

vi.mock("../discord/core/entry.js", () => ({
  channelSessions: mocks.channelSessions,
  markChannelLockAcquired: mocks.markChannelLockAcquired,
  markChannelLockHeartbeat: mocks.markChannelLockHeartbeat,
  markChannelLockReleased: mocks.markChannelLockReleased,
}));

function makeMessage(id: string, channelId: string): Message {
  const working = {
    edit: vi.fn().mockResolvedValue(undefined),
    delete: vi.fn().mockResolvedValue(undefined),
  };
  const reply = vi.fn().mockResolvedValue(working);

  const channel = {
    messages: {
      fetch: vi.fn().mockResolvedValue(new Map()),
    },
  };

  return {
    id,
    channelId,
    content: "hello",
    author: {
      bot: false,
      username: "alex",
    },
    channel,
    reply,
    _reply: reply,
  } as unknown as Message & { _reply: ReturnType<typeof vi.fn> };
}

describe("message-handler", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    mocks.channelSessions.clear();
  });

  it("acquires the channel lock before live processing and releases it after", async () => {
    let resolveClaude: (value: { success: boolean; text: string }) => void = () => {};
    mocks.runClaude.mockImplementation(
      async (options: { onChunk?: (text: string) => Promise<void> }) =>
        new Promise<{ success: boolean; text: string }>((resolve) => {
          void options.onChunk?.("partial");
          resolveClaude = resolve;
        }),
    );

    const { handleMessage, isChannelLocked } = await import("./message-handler.js");

    const first = makeMessage("m1", "channel-1");
    const second = makeMessage("m2", "channel-1");

    const firstRun = handleMessage(first, "first", "boss", null);

    expect(isChannelLocked("channel-1")).toBe(true);
    expect(mocks.markChannelLockAcquired).toHaveBeenCalledWith("channel-1");
    expect(mocks.markChannelLockHeartbeat).toHaveBeenCalledWith("channel-1");

    const secondRun = handleMessage(second, "second", "boss", null);

    for (let i = 0; i < 5 && mocks.runClaude.mock.calls.length === 0; i += 1) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    expect(mocks.runClaude).toHaveBeenCalledTimes(1);
    expect((second as Message & { _reply: ReturnType<typeof vi.fn> })._reply).not.toHaveBeenCalled();

    resolveClaude({ success: true, text: "done" });
    await firstRun;
    await secondRun;

    expect(isChannelLocked("channel-1")).toBe(false);
    expect(mocks.markChannelLockReleased).toHaveBeenCalledWith("channel-1");
  });

  it("stores the claude session id and resumes follow-up turns in the same channel", async () => {
    mocks.runClaude
      .mockImplementationOnce(async (options: { onActivity?: () => void }) => {
        options.onActivity?.();
        return { success: true, text: "first", sessionId: "sess_1" };
      })
      .mockResolvedValueOnce({ success: true, text: "second", sessionId: "sess_1" });

    const { handleMessage } = await import("./message-handler.js");

    const first = makeMessage("m1", "channel-session");
    await handleMessage(first, "first", "boss", null);

    const second = makeMessage("m2", "channel-session");
    await handleMessage(second, "second", "boss", null);

    expect(mocks.channelSessions.get("channel-session")).toBe("sess_1");
    expect(mocks.markChannelLockHeartbeat).toHaveBeenCalledWith("channel-session");
    expect(mocks.runClaude.mock.calls[0]?.[0]).toMatchObject({
      resumeSessionId: undefined,
    });
    expect(mocks.runClaude.mock.calls[1]?.[0]).toMatchObject({
      resumeSessionId: "sess_1",
    });
  });
});
