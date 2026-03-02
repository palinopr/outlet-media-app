/**
 * Tests for message-handler.ts bug fixes:
 * 1. Busy-agent reply says "try again" instead of misleading "queued"
 * 2. channelLocks released even when early setup (msg.reply) throws
 * 3. working message not deleted until sendAsAgent succeeds
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// --------------- mocks (must be before import) ---------------

vi.mock("../runner.js", () => ({
  runClaude: vi.fn().mockResolvedValue({ text: "agent response" }),
}));

vi.mock("../discord/core/router.js", () => ({
  getAgentForChannel: vi.fn().mockReturnValue({
    promptFile: "test-agent",
    maxTurns: 5,
    description: "test",
    readOnly: false,
    injectSnapshot: false,
  }),
}));

vi.mock("../services/queue-service.js", () => ({
  isAgentFree: vi.fn().mockReturnValue(true),
}));

vi.mock("../services/webhook-service.js", () => ({
  sendAsAgent: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../discord/features/memory.js", () => ({
  loadAgentMemory: vi.fn().mockResolvedValue(null),
}));

// Prevent fire-and-forget imports from loading real modules
vi.mock("../discord/core/entry.js", () => ({ notifyChannel: vi.fn() }));
vi.mock("../discord/commands/admin.js", () => ({ buildAdminPrompt: vi.fn() }));
vi.mock("../discord/features/skills.js", () => ({ maybeCreateSkill: vi.fn() }));
vi.mock("../agents/delegate.js", () => ({ processDelegations: vi.fn() }));

// --------------- imports ---------------

import { handleMessage, isChannelLocked, cleanForDiscord, chunkText } from "./message-handler.js";
import { isAgentFree } from "../services/queue-service.js";
import { sendAsAgent } from "../services/webhook-service.js";
import { runClaude } from "../runner.js";
import type { Message } from "discord.js";

// --------------- helpers ---------------

function makeMockMessage(overrides: Record<string, unknown> = {}): Message {
  const replyMsg = {
    edit: vi.fn().mockResolvedValue(undefined),
    delete: vi.fn().mockResolvedValue(undefined),
  };
  return {
    channelId: "ch-123",
    id: "msg-1",
    author: { username: "testuser", bot: false },
    content: "hello",
    channel: {
      sendTyping: vi.fn().mockResolvedValue(undefined),
      messages: {
        fetch: vi.fn().mockResolvedValue(new Map()),
      },
      send: vi.fn().mockResolvedValue(undefined),
    },
    reply: vi.fn().mockResolvedValue(replyMsg),
    ...overrides,
  } as unknown as Message;
}

// --------------- tests ---------------

describe("handleMessage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ===== Bug 1: misleading "queued" message =====
  describe("Bug 1: busy-agent reply text", () => {
    it("should tell the user to try again, not that the message is queued", async () => {
      vi.mocked(isAgentFree).mockReturnValue(false);

      const msg = makeMockMessage();
      await handleMessage(msg, "hello", "test-channel", null);

      expect(msg.reply).toHaveBeenCalledOnce();
      const replyText = vi.mocked(msg.reply).mock.calls[0][0] as string;

      // Must NOT say "queued"
      expect(replyText.toLowerCase()).not.toContain("queue");
      // Must suggest trying again
      expect(replyText.toLowerCase()).toContain("try again");
    });

    it("should return early without acquiring the channel lock", async () => {
      vi.mocked(isAgentFree).mockReturnValue(false);

      const msg = makeMockMessage();
      await handleMessage(msg, "hello", "test-channel", null);

      expect(isChannelLocked("ch-123")).toBe(false);
    });
  });

  // ===== Bug 2: channel lock leak =====
  describe("Bug 2: channel lock released on early failure", () => {
    it("should release the channel lock when msg.reply throws", async () => {
      vi.mocked(isAgentFree).mockReturnValue(true);

      const msg = makeMockMessage({
        reply: vi.fn().mockRejectedValue(new Error("Discord API error")),
      });

      await handleMessage(msg, "hello", "test-channel", null);

      // The lock MUST be released even though msg.reply threw
      expect(isChannelLocked("ch-123")).toBe(false);
    });

    it("should release the channel lock when sendTyping throws", async () => {
      vi.mocked(isAgentFree).mockReturnValue(true);

      // sendTyping is wrapped in .catch(() => {}), so this shouldn't break,
      // but msg.reply could still fail
      const msg = makeMockMessage({
        channel: {
          sendTyping: vi.fn().mockRejectedValue(new Error("Typing failed")),
          messages: { fetch: vi.fn().mockResolvedValue(new Map()) },
          send: vi.fn(),
        },
        reply: vi.fn().mockRejectedValue(new Error("Reply also failed")),
      });

      await handleMessage(msg, "hello", "test-channel", null);
      expect(isChannelLocked("ch-123")).toBe(false);
    });

    it("should release the channel lock when runClaude throws", async () => {
      vi.mocked(isAgentFree).mockReturnValue(true);
      vi.mocked(runClaude).mockRejectedValue(new Error("Claude crashed"));

      const msg = makeMockMessage();
      await handleMessage(msg, "hello", "test-channel", null);

      expect(isChannelLocked("ch-123")).toBe(false);
    });

    it("should release the channel lock on successful completion", async () => {
      vi.mocked(isAgentFree).mockReturnValue(true);
      vi.mocked(runClaude).mockResolvedValue({ text: "ok" } as never);

      const msg = makeMockMessage();
      await handleMessage(msg, "hello", "test-channel", null);

      expect(isChannelLocked("ch-123")).toBe(false);
    });
  });

  // ===== Bug 3: working message deleted prematurely =====
  describe("Bug 3: working message deletion order", () => {
    it("should NOT delete working before sendAsAgent succeeds", async () => {
      vi.mocked(isAgentFree).mockReturnValue(true);
      vi.mocked(runClaude).mockResolvedValue({ text: "response" } as never);

      const workingMsg = {
        edit: vi.fn().mockResolvedValue(undefined),
        delete: vi.fn().mockResolvedValue(undefined),
      };
      const msg = makeMockMessage({
        reply: vi.fn().mockResolvedValue(workingMsg),
      });

      // Track call order
      const callOrder: string[] = [];
      vi.mocked(sendAsAgent).mockImplementation(async () => {
        callOrder.push("sendAsAgent");
      });
      workingMsg.delete.mockImplementation(async () => {
        callOrder.push("delete");
      });

      await handleMessage(msg, "hello", "test-channel", null);

      // sendAsAgent must be called BEFORE delete
      expect(callOrder.indexOf("sendAsAgent")).toBeLessThan(
        callOrder.indexOf("delete"),
      );
    });

    it("should fall back to editing the working message when sendAsAgent throws", async () => {
      vi.mocked(isAgentFree).mockReturnValue(true);
      vi.mocked(runClaude).mockResolvedValue({ text: "response" } as never);
      vi.mocked(sendAsAgent).mockRejectedValue(new Error("Webhook failed"));

      const workingMsg = {
        edit: vi.fn().mockResolvedValue(undefined),
        delete: vi.fn().mockResolvedValue(undefined),
      };
      const msg = makeMockMessage({
        reply: vi.fn().mockResolvedValue(workingMsg),
      });

      await handleMessage(msg, "hello", "test-channel", null);

      // working.delete should NOT have been called (sendAsAgent failed first)
      expect(workingMsg.delete).not.toHaveBeenCalled();
      // Instead, it should fall back to editing the working message
      expect(workingMsg.edit).toHaveBeenCalled();
    });
  });
});

// --------------- unit tests for pure helpers ---------------

describe("cleanForDiscord", () => {
  it("should convert HTML bold to markdown", () => {
    expect(cleanForDiscord("<b>bold</b>")).toBe("**bold**");
  });

  it("should strip unknown HTML tags", () => {
    expect(cleanForDiscord("<div>text</div>")).toBe("text");
  });

  it("should collapse multiple newlines", () => {
    expect(cleanForDiscord("a\n\n\n\nb")).toBe("a\n\nb");
  });
});

describe("chunkText", () => {
  it("should split long text into chunks", () => {
    const result = chunkText("abcdef", 2);
    expect(result).toEqual(["ab", "cd", "ef"]);
  });

  it("should return one chunk for short text", () => {
    expect(chunkText("abc", 10)).toEqual(["abc"]);
  });

  it("should return empty array for empty string", () => {
    expect(chunkText("", 10)).toEqual([]);
  });
});
