import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  enqueueTask,
  completeTask,
  failTask,
  evaluateTier,
  sendAsAgent,
  runClaude,
  notifyChannel,
} = vi.hoisted(() => ({
  enqueueTask: vi.fn(),
  completeTask: vi.fn(),
  failTask: vi.fn(),
  evaluateTier: vi.fn(),
  sendAsAgent: vi.fn(),
  runClaude: vi.fn(),
  notifyChannel: vi.fn(),
}));

vi.mock("../services/queue-service.js", () => ({
  enqueueTask,
  completeTask,
  failTask,
}));

vi.mock("../services/approval-service.js", () => ({
  evaluateTier,
}));

vi.mock("../services/webhook-service.js", () => ({
  sendAsAgent,
}));

vi.mock("../runner.js", () => ({
  runClaude,
}));

vi.mock("../discord/core/entry.js", () => ({
  notifyChannel,
}));

vi.mock("../discord/features/restructure.js", () => ({
  WHITELISTED_CHANNELS: new Set(["boss", "dashboard", "email", "general"]),
}));

vi.mock("../discord/core/router.js", () => ({
  getAgentForChannel: vi.fn((channelName: string) => {
    if (channelName === "email") {
      return {
        promptFile: "email-agent",
        maxTurns: 20,
        description: "email-agent",
        readOnly: false,
      };
    }

    if (channelName === "boss") {
      return {
        promptFile: "boss",
        maxTurns: 25,
        description: "boss",
        readOnly: false,
      };
    }

    return {
      promptFile: "general",
      maxTurns: 10,
      description: "general",
      readOnly: false,
    };
  }),
}));

import { processChannelMessages } from "./delegate.js";

describe("processChannelMessages", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    enqueueTask.mockImplementation(
      (
        from: string,
        to: string,
        action: string,
        params: Record<string, unknown>,
        tier: string,
      ) => ({
        id: "task-1",
        from,
        to,
        action,
        params,
        tier,
      }),
    );
    evaluateTier.mockReturnValue("execute");
    sendAsAgent.mockResolvedValue(undefined);
    runClaude.mockResolvedValue({ text: "Boss has it." });
    notifyChannel.mockResolvedValue(undefined);
  });

  it("posts the channel message and executes a real agent handoff when handoff=true", async () => {
    const client = {
      guilds: {
        cache: {
          first: () => ({ id: "guild-1" }),
        },
      },
    } as never;

    const result = await processChannelMessages(
      client,
      "```json\n{\"channel\":\"boss\",\"message\":\"Please handle this in HQ.\",\"handoff\":true}\n```",
      "email",
    );

    expect(sendAsAgent).toHaveBeenCalledWith("email-agent", "boss", "Please handle this in HQ.");
    expect(enqueueTask).toHaveBeenCalledWith(
      "email-agent",
      "boss",
      "channel-handoff",
      {
        message: "Please handle this in HQ.",
        sourceChannel: "email",
        targetChannel: "boss",
      },
      "green",
    );
    await vi.waitFor(() => {
      expect(runClaude).toHaveBeenCalledOnce();
    });
    expect(result.posted).toBe(1);
    expect(result.handedOff).toBe(1);
    expect(result.handoffTargets).toEqual(["boss"]);
  });
});
