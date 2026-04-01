import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const createClientAgentAppClientMock = vi.fn();
const runClientAgentRuntimeMock = vi.fn();

vi.mock("./app-client.js", () => ({
  createClientAgentAppClient: createClientAgentAppClientMock,
}));

vi.mock("./runtime.js", () => ({
  runClientAgentRuntime: runClientAgentRuntimeMock,
}));

function makeTask() {
  return {
    id: "task_1",
    from_agent: "client-portal",
    to_agent: "client-agent",
    action: "reply",
    params: {},
    tier: "green" as const,
    status: "pending",
  };
}

function makeContext(assistantStatus: "pending" | "answer" = "pending") {
  return {
    taskId: "task_1",
    threadId: "thread_1",
    userMessageId: "msg_user_1",
    assistantMessageId: "msg_assistant_1",
    scopeSummary: {
      clientSlug: "acme",
      eventsEnabled: true,
      viewer: "member" as const,
    },
    scope: {
      clientId: "client_1",
      clientMemberId: "member_1",
      clientSlug: "acme",
      allowedCampaignIds: null,
      allowedEventIds: null,
      eventsEnabled: true,
      viewer: "member" as const,
    },
    thread: {
      threadId: "thread_1",
      title: "Thread 1",
      previewText: "Preview",
      referencedEntities: [],
      lastResponseStatus: assistantStatus,
      lastMessageAt: "2026-04-01T12:00:00.000Z",
      updatedAt: "2026-04-01T12:00:00.000Z",
      createdAt: "2026-04-01T12:00:00.000Z",
      messages: [],
    },
    userMessage: {
      messageId: "msg_user_1",
      role: "user" as const,
      status: null,
      text: "How much have we spent?",
      blocks: [],
      referencedEntities: [],
      contextPayload: null,
      resolvedRange: null,
      providerResponseId: null,
      clientGeneratedId: "client_request_1",
      clientRequestId: "client_request_1",
      agentTaskId: null,
      createdAt: "2026-04-01T12:00:00.000Z",
    },
    assistantMessage: {
      messageId: "msg_assistant_1",
      role: "assistant" as const,
      status: assistantStatus,
      text: assistantStatus === "pending" ? "Thinking…" : "Done",
      blocks: [],
      referencedEntities: [],
      contextPayload: null,
      resolvedRange: null,
      providerResponseId: null,
      clientGeneratedId: null,
      clientRequestId: "client_request_1",
      agentTaskId: "task_1",
      createdAt: "2026-04-01T12:00:01.000Z",
    },
  };
}

describe("client-agent task processor", () => {
  beforeEach(() => {
    vi.resetModules();
    createClientAgentAppClientMock.mockReset();
    runClientAgentRuntimeMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("runs the local runtime and resolves the task with the normalized result", async () => {
    const appClient = {
      getTaskContext: vi.fn().mockResolvedValue(makeContext()),
      resolveTask: vi.fn().mockResolvedValue({
        status: "answer",
        threadId: "thread_1",
        assistantMessageId: "msg_assistant_1",
      }),
      runTool: vi.fn(),
    };
    createClientAgentAppClientMock.mockReturnValue(appClient);
    runClientAgentRuntimeMock.mockResolvedValue({
      status: "answer",
      text: "Lifetime Meta ad spend is $100.00.",
      referencedEntities: [],
      contextPayload: null,
      resolvedRange: null,
      providerResponseId: "session_1",
    });

    const { processClientAgentTask } = await import("./task-processor.js");
    const result = await processClientAgentTask(makeTask());

    expect(runClientAgentRuntimeMock).toHaveBeenCalledWith({
      appClient,
      context: expect.objectContaining({
        taskId: "task_1",
      }),
    });
    expect(appClient.resolveTask).toHaveBeenCalledWith(
      "task_1",
      expect.objectContaining({
        status: "answer",
        text: "Lifetime Meta ad spend is $100.00.",
        blocks: [],
      }),
    );
    expect(result).toBe("Lifetime Meta ad spend is $100.00.");
  });

  it("exits idempotently when the placeholder is already resolved", async () => {
    const appClient = {
      getTaskContext: vi.fn().mockResolvedValue(makeContext("answer")),
      resolveTask: vi.fn(),
      runTool: vi.fn(),
    };
    createClientAgentAppClientMock.mockReturnValue(appClient);

    const { processClientAgentTask } = await import("./task-processor.js");
    const result = await processClientAgentTask(makeTask());

    expect(runClientAgentRuntimeMock).not.toHaveBeenCalled();
    expect(appClient.resolveTask).not.toHaveBeenCalled();
    expect(result).toBe("Client agent task already resolved.");
  });

  it("resolves the task with an error result when the runtime fails", async () => {
    const appClient = {
      getTaskContext: vi.fn().mockResolvedValue(makeContext()),
      resolveTask: vi.fn().mockResolvedValue({
        status: "error",
        threadId: "thread_1",
        assistantMessageId: "msg_assistant_1",
      }),
      runTool: vi.fn(),
    };
    createClientAgentAppClientMock.mockReturnValue(appClient);
    runClientAgentRuntimeMock.mockRejectedValue(new Error("runtime boom"));

    const { processClientAgentTask } = await import("./task-processor.js");
    const result = await processClientAgentTask(makeTask());

    expect(appClient.resolveTask).toHaveBeenCalledWith(
      "task_1",
      expect.objectContaining({
        status: "error",
        text: expect.stringContaining("runtime boom"),
        blocks: [],
      }),
    );
    expect(result).toContain("runtime boom");
  });
});
