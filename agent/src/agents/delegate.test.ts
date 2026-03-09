import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  enqueueTask,
  completeTask,
  failTask,
  escalateTask,
  setTaskExecutor,
  getTaskExecutor,
  evaluateTier,
  sendAsAgent,
  sendWhatsAppMessage,
  executeScheduledCopySwap,
  runClaude,
  notifyChannel,
} = vi.hoisted(() => {
  let taskExecutor: ((task: Record<string, unknown>) => Promise<void>) | null = null;
  return {
    enqueueTask: vi.fn(),
    completeTask: vi.fn(),
    failTask: vi.fn(),
    escalateTask: vi.fn(),
    setTaskExecutor: vi.fn((executor: ((task: Record<string, unknown>) => Promise<void>) | null) => {
      taskExecutor = executor;
    }),
    getTaskExecutor: () => taskExecutor,
    evaluateTier: vi.fn(),
    sendAsAgent: vi.fn(),
    sendWhatsAppMessage: vi.fn(),
    executeScheduledCopySwap: vi.fn(),
    runClaude: vi.fn(),
    notifyChannel: vi.fn(),
  };
});

vi.mock("../services/queue-service.js", () => ({
  enqueueTask,
  completeTask,
  failTask,
  escalateTask,
  setTaskExecutor,
}));

vi.mock("../services/approval-service.js", () => ({
  evaluateTier,
}));

vi.mock("../services/webhook-service.js", () => ({
  sendAsAgent,
}));

vi.mock("../services/whatsapp-runtime-service.js", () => ({
  sendWhatsAppMessage,
}));

vi.mock("../services/meta-copy-swap-service.js", () => ({
  executeScheduledCopySwap,
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
    if (channelName === "clients") {
      return {
        promptFile: "customer-whatsapp-agent",
        maxTurns: 18,
        description: "customer-whatsapp-agent",
        readOnly: false,
      };
    }

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

import { bindDelegationTaskExecutor, executeAgentTask, processChannelMessages, processWhatsAppSends } from "./delegate.js";

async function runQueuedTaskFromCall(callIndex: number): Promise<void> {
  const executor = getTaskExecutor();
  if (!executor) {
    throw new Error("Task executor was not registered in the test.");
  }

  const [from, to, action, params, tier] = enqueueTask.mock.calls[callIndex] as [
    string,
    string,
    string,
    Record<string, unknown>,
    string,
  ];

  await executor({
    id: `queued-${callIndex + 1}`,
    from,
    to,
    action,
    params,
    tier,
    status: "running",
    createdAt: new Date(),
  });
}

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
    escalateTask.mockResolvedValue(undefined);
    executeScheduledCopySwap.mockResolvedValue({
      activateAdId: "120243055587590525",
      pauseAdId: "120242622824170525",
      rollbackPerformed: false,
      text: "Executed scheduled copy swap.",
    });
    sendWhatsAppMessage.mockResolvedValue({
      conversationId: "conversation-1",
      messageId: "SM123",
      ok: true,
    });
  });

  it("posts the channel message and executes a real agent handoff when handoff=true", async () => {
    const client = {
      guilds: {
        cache: {
          first: () => ({ id: "guild-1" }),
        },
      },
    } as never;

    bindDelegationTaskExecutor(client);
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
      expect.objectContaining({
        _queueDepth: 0,
        _queueNotifySource: false,
        _queueSourceChannel: "email",
        message: "Please handle this in HQ.",
        sourceChannel: "email",
        targetChannel: "boss",
      }),
      "green",
    );
    await runQueuedTaskFromCall(0);
    expect(runClaude).toHaveBeenCalledOnce();
    expect(result.posted).toBe(1);
    expect(result.handedOff).toBe(1);
    expect(result.handoffTargets).toEqual(["boss"]);
  });

  it("auto-attaches customer-facing metadata to handoffs from the WhatsApp lane", async () => {
    evaluateTier.mockReturnValue("escalate");

    const client = {
      guilds: {
        cache: {
          first: () => ({ id: "guild-1" }),
        },
      },
    } as never;

    bindDelegationTaskExecutor(client);
    await processChannelMessages(
      client,
      "```json\n{\"channel\":\"boss\",\"message\":\"Client asked for an update.\",\"handoff\":true}\n```",
      "clients",
      0,
      {
        inheritedParams: {
          conversationId: "conversation-1",
          messageId: "wamid.latest",
          toWaId: "13054870475",
        },
      },
    );

    expect(enqueueTask).toHaveBeenCalledWith(
      "customer-whatsapp-agent",
      "boss",
      "channel-handoff",
      expect.objectContaining({
        _queueDepth: 0,
        _queueNotifySource: false,
        _queueSourceChannel: "clients",
        message: "Client asked for an update.",
        sourceChannel: "clients",
        targetChannel: "boss",
        audience: "customer",
        delivery: "whatsapp",
        disclosure: "safe",
        conversationId: "conversation-1",
        messageId: "wamid.latest",
        toWaId: "13054870475",
      }),
      "green",
    );
    expect(escalateTask).toHaveBeenCalledWith("task-1");
  });

  it("preserves WhatsApp context through Boss handoff so Boss can delegate back to the liaison", async () => {
    runClaude.mockResolvedValue({
      text: "```json\n{\"delegate\":\"customer-whatsapp-agent\",\"action\":\"deliver-approved-message\",\"params\":{\"message\":\"Final approved reply.\",\"approved\":true}}\n```",
    });

    const client = {
      guilds: {
        cache: {
          first: () => ({
            id: "guild-1",
            channels: {
              cache: {
                find: vi.fn().mockReturnValue(undefined),
              },
            },
          }),
        },
      },
    } as never;

    bindDelegationTaskExecutor(client);
    await processChannelMessages(
      client,
      "```json\n{\"channel\":\"boss\",\"message\":\"Client needs an approved reply.\",\"handoff\":true}\n```",
      "clients",
      0,
      {
        inheritedParams: {
          conversationId: "conversation-1",
          messageId: "wamid.latest",
          toWaId: "13054870475",
        },
      },
    );

    await runQueuedTaskFromCall(0);

    expect(enqueueTask).toHaveBeenNthCalledWith(
      1,
      "customer-whatsapp-agent",
      "boss",
      "channel-handoff",
      expect.objectContaining({
        _queueDepth: 0,
        _queueNotifySource: false,
        _queueSourceChannel: "clients",
        conversationId: "conversation-1",
        messageId: "wamid.latest",
        toWaId: "13054870475",
      }),
      "green",
    );

    expect(enqueueTask).toHaveBeenNthCalledWith(
      2,
      "boss",
      "customer-whatsapp-agent",
      "deliver-approved-message",
      expect.objectContaining({
        _queueDepth: 1,
        _queueNotifySource: true,
        _queueSourceChannel: "boss",
        approved: true,
        audience: "customer",
        delivery: "whatsapp",
        disclosure: "safe",
        conversationId: "conversation-1",
        messageId: "wamid.latest",
        toWaId: "13054870475",
      }),
      "green",
    );
  });
});

describe("processWhatsAppSends", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sendWhatsAppMessage.mockResolvedValue({
      conversationId: "conversation-1",
      messageId: "SM123",
      ok: true,
    });
  });

  it("inherits conversation context and executes a real WhatsApp send", async () => {
    const result = await processWhatsAppSends(
      '```json\n{"whatsapp":{"message":"Hola, ya esta listo.","approved":true}}\n```',
      "clients",
      {
        inheritedParams: {
          conversationId: "conversation-1",
          messageId: "wamid.latest",
        },
      },
    );

    expect(sendWhatsAppMessage).toHaveBeenCalledWith({
      approved: true,
      body: "Hola, ya esta listo.",
      conversationId: "conversation-1",
      phoneNumberId: undefined,
      replyToMessageId: "wamid.latest",
      toWaId: undefined,
    });
    expect(result.sent).toBe(1);
    expect(result.errors).toEqual([]);
    expect(result.cleanText).toBe("");
  });
});

describe("customer-facing delegation propagation", () => {
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
    evaluateTier.mockReturnValue("escalate");
    sendAsAgent.mockResolvedValue(undefined);
    runClaude.mockResolvedValue({
      text: "```json\n{\"delegate\":\"media-buyer\",\"action\":\"customer-safe-status\",\"params\":{\"client\":\"zamora\"}}\n```",
    });
    notifyChannel.mockResolvedValue(undefined);
    escalateTask.mockResolvedValue(undefined);
    completeTask.mockResolvedValue(undefined);
  });

  it("inherits customer-facing metadata through Boss -> specialist delegations", async () => {
    const client = {
      guilds: {
        cache: {
          first: () => ({
            id: "guild-1",
            channels: {
              cache: {
                find: vi.fn().mockReturnValue(undefined),
              },
            },
          }),
        },
      },
    } as never;

    await executeAgentTask(
      client,
      {
        id: "boss-task",
        from: "customer-whatsapp-agent",
        to: "boss",
        action: "channel-handoff",
        params: {
          message: "Client wants a performance update.",
          sourceChannel: "clients",
          targetChannel: "boss",
          audience: "customer",
          delivery: "whatsapp",
          disclosure: "safe",
        },
        tier: "green",
        created_at: new Date().toISOString(),
        status: "running",
      } as never,
      "clients",
      0,
    );

    expect(runClaude).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.stringContaining("client-facing WhatsApp response"),
      }),
    );
    expect(enqueueTask).toHaveBeenNthCalledWith(
      1,
      "boss",
      "media-buyer",
      "customer-safe-status",
      expect.objectContaining({
        _queueDepth: 1,
        _queueNotifySource: true,
        _queueSourceChannel: "boss",
        client: "zamora",
        audience: "customer",
        delivery: "whatsapp",
        disclosure: "safe",
      }),
      "green",
    );
  });
});

describe("bounded executor actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sendAsAgent.mockResolvedValue(undefined);
    notifyChannel.mockResolvedValue(undefined);
    completeTask.mockResolvedValue(undefined);
    executeScheduledCopySwap.mockResolvedValue({
      activateAdId: "120243055587590525",
      pauseAdId: "120242622824170525",
      rollbackPerformed: false,
      text: "Executed scheduled copy swap.",
    });
  });

  it("executes scheduled copy swaps through the direct Meta executor", async () => {
    const client = {
      guilds: {
        cache: {
          first: () => ({
            id: "guild-1",
            channels: {
              cache: {
                find: vi.fn().mockReturnValue(undefined),
              },
            },
          }),
        },
      },
    } as never;

    const delivered = await executeAgentTask(
      client,
      {
        id: "copy-swap-task",
        from: "scheduler",
        to: "media-buyer",
        action: "scheduled-copy-swap",
        params: {
          activateAdId: "120243055587590525",
          pauseAdId: "120242622824170525",
          replyChannel: "boss",
        },
        tier: "green",
        status: "running",
        createdAt: new Date(),
      } as never,
      "schedule",
      0,
      { notifySource: false },
    );

    expect(executeScheduledCopySwap).toHaveBeenCalledWith(
      "copy-swap-task",
      expect.objectContaining({
        activateAdId: "120243055587590525",
        pauseAdId: "120242622824170525",
      }),
    );
    expect(runClaude).not.toHaveBeenCalled();
    expect(completeTask).toHaveBeenCalledWith(
      "copy-swap-task",
      expect.objectContaining({
        text: "Executed scheduled copy swap.",
      }),
    );
    expect(sendAsAgent).toHaveBeenCalledWith(
      "media-buyer",
      "media-buyer",
      expect.stringContaining("Task scheduled-copy-swap completed"),
    );
    expect(notifyChannel).toHaveBeenCalledWith(
      "boss",
      expect.stringContaining("media-buyer completed scheduled-copy-swap"),
    );
    expect(delivered).toBe("Executed scheduled copy swap.");
  });
});
