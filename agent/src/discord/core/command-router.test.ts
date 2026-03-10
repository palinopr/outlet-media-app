import { afterEach, describe, expect, it, vi } from "vitest";
import type { Message } from "discord.js";

const {
  handleMessage,
  isChannelLocked,
  acquireChannelLock,
  releaseChannelLock,
  buildPromptFromDiscordMessage,
  markChannelLockAcquired,
  markChannelLockReleased,
  checkAutoMod,
} = vi.hoisted(() => ({
  handleMessage: vi.fn(),
  isChannelLocked: vi.fn().mockReturnValue(false),
  acquireChannelLock: vi.fn().mockReturnValue(true),
  releaseChannelLock: vi.fn(),
  buildPromptFromDiscordMessage: vi.fn().mockResolvedValue({
    prompt: "prompt from message builder",
    fallbackMessage: null,
  }),
  markChannelLockAcquired: vi.fn(),
  markChannelLockReleased: vi.fn(),
  checkAutoMod: vi.fn().mockResolvedValue(false),
}));

vi.mock("./access.js", () => ({
  canRunCommand: vi.fn().mockReturnValue(true),
  canUseChannel: vi.fn().mockReturnValue(true),
  getAccessDeniedMessage: vi.fn().mockReturnValue("Access denied."),
  isReadOnlyChannel: vi.fn().mockReturnValue(false),
}));

vi.mock("../../events/message-handler.js", () => ({
  handleMessage,
  isChannelLocked,
  acquireChannelLock,
  releaseChannelLock,
  chunkText: (text: string) => [text],
}));

vi.mock("./message-prompt.js", () => ({
  buildPromptFromDiscordMessage,
}));

vi.mock("./entry.js", () => ({
  channelSessions: new Map<string, string>(),
  markChannelLockAcquired,
  markChannelLockReleased,
  checkAndReleaseStaleLock: vi.fn().mockReturnValue(false),
  notifyChannel: vi.fn(),
}));

vi.mock("../commands/schedule.js", () => ({
  handleScheduleCommand: vi.fn(),
}));

vi.mock("../commands/supervisor.js", () => ({
  handleSuperviseCommand: vi.fn(),
}));

vi.mock("../commands/ops.js", () => ({
  handleOpsCommand: vi.fn(),
}));

vi.mock("../commands/dashboard.js", () => ({
  handleDashboardCommand: vi.fn(),
}));

vi.mock("../../services/webhook-service.js", () => ({
  sendAsAgent: vi.fn(),
}));

vi.mock("../../services/scheduled-handoff-service.js", () => ({
  extractScheduledCopySwapParams: vi.fn(),
  formatScheduledTimeLabel: vi.fn(),
  looksLikeScheduledBudgetRequest: vi.fn().mockReturnValue(false),
  looksLikeScheduledCopySwapRequest: vi.fn().mockReturnValue(false),
  parseScheduledDispatchTime: vi.fn(),
  scheduleCopySwapHandoff: vi.fn(),
  scheduleBudgetUpdateHandoff: vi.fn(),
}));

vi.mock("../commands/admin.js", () => ({
  checkAutoMod,
}));

function makeGuildMessage(
  content: string,
  channelName: string,
): Message {
  const channelSend = vi.fn().mockResolvedValue(undefined);
  return {
    id: `msg-${channelName}-${content}`,
    channelId: `channel-${channelName}`,
    author: { id: "user-1", username: "jaime", bot: false },
    attachments: new Map(),
    content,
    guild: null,
    member: null,
    reply: vi.fn().mockResolvedValue(undefined),
    channel: {
      name: channelName,
      isThread: () => false,
      send: channelSend,
    },
  } as unknown as Message;
}

function makeDirectMessage(content: string): Message {
  return {
    id: `dm-${content}`,
    channelId: "dm-1",
    author: { id: "user-1", username: "jaime", bot: false },
    attachments: new Map(),
    content,
    guild: null,
    member: null,
    reply: vi.fn().mockResolvedValue(undefined),
    channel: {
      send: vi.fn().mockResolvedValue(undefined),
    },
  } as unknown as Message;
}

describe("routeMessage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("routes assistant-prefixed questions to Boss from a mapped work channel", async () => {
    const { routeMessage } = await import("./command-router.js");
    const msg = makeGuildMessage("assistant: give me the real status", "general");

    await routeMessage(msg, null);

    expect(buildPromptFromDiscordMessage).toHaveBeenCalledWith(
      "give me the real status",
      expect.anything(),
    );
    expect(handleMessage).toHaveBeenCalledWith(
      msg,
      "prompt from message builder",
      "boss",
      null,
    );
  });

  it("routes direct messages to Boss", async () => {
    const { routeMessage } = await import("./command-router.js");
    const msg = makeDirectMessage("what changed today");

    await routeMessage(msg, null);

    expect(buildPromptFromDiscordMessage).toHaveBeenCalledWith(
      "what changed today",
      expect.anything(),
    );
    expect(handleMessage).toHaveBeenCalledWith(
      msg,
      "prompt from message builder",
      "boss",
      null,
    );
  });

  it("fails loudly for unmapped channels instead of falling back to general chat", async () => {
    const { routeMessage } = await import("./command-router.js");
    const msg = makeGuildMessage("hello", "rogue-room");

    await routeMessage(msg, null);

    expect(buildPromptFromDiscordMessage).not.toHaveBeenCalled();
    expect(handleMessage).not.toHaveBeenCalled();
    expect(msg.reply).toHaveBeenCalledWith(
      "No agent route is configured for #rogue-room. Use #boss or start your message with `assistant:` in a mapped work channel.",
    );
  });

  it("routes !ops through the owner ops handler", async () => {
    const { handleOpsCommand } = await import("../commands/ops.js");
    vi.mocked(handleOpsCommand).mockResolvedValue({
      text: "",
      embed: { title: "Boss Ops Snapshot" } as never,
    });

    const { routeMessage } = await import("./command-router.js");
    const msg = makeGuildMessage("!ops", "boss");

    await routeMessage(msg, null);

    expect(handleOpsCommand).toHaveBeenCalledWith(undefined);
    expect(msg.reply).toHaveBeenCalledWith("Building Boss ops snapshot...");
    const channel = msg.channel as unknown as { send: ReturnType<typeof vi.fn> };
    expect(channel.send).toHaveBeenCalledWith({
      embeds: [{ title: "Boss Ops Snapshot" }],
    });
  });
});
