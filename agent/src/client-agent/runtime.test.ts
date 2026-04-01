import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const queryMock = vi.fn();
const toolMock = vi.fn((name: string, description: string, inputSchema: unknown, handler: unknown) => ({
  name,
  description,
  inputSchema,
  handler,
}));
const createSdkMcpServerMock = vi.fn((options: unknown) => options);

vi.mock("@anthropic-ai/claude-agent-sdk", () => ({
  query: queryMock,
  tool: toolMock,
  createSdkMcpServer: createSdkMcpServerMock,
}));

function makeTaskContext(userText: string) {
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
      lastResponseStatus: "pending" as const,
      lastMessageAt: "2026-04-01T12:00:00.000Z",
      updatedAt: "2026-04-01T12:00:00.000Z",
      createdAt: "2026-04-01T12:00:00.000Z",
      messages: [],
    },
    userMessage: {
      messageId: "msg_user_1",
      role: "user" as const,
      status: null,
      text: userText,
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
      status: "pending" as const,
      text: "Thinking…",
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

function assistantJson(text: string) {
  return {
    type: "assistant",
    message: {
      content: [{ type: "text", text }],
    },
    parent_tool_use_id: null,
    session_id: "session_1",
    uuid: "assistant_uuid",
  };
}

function resultJson(text: string) {
  return {
    type: "result",
    subtype: "success",
    duration_ms: 1,
    duration_api_ms: 1,
    is_error: false,
    num_turns: 1,
    result: text,
    stop_reason: null,
    total_cost_usd: 0,
    usage: {},
    modelUsage: {},
    permission_denials: [],
    session_id: "session_1",
    uuid: "result_uuid",
  };
}

describe("client-agent runtime", () => {
  beforeEach(() => {
    vi.resetModules();
    queryMock.mockReset();
    toolMock.mockClear();
    createSdkMcpServerMock.mockClear();
    process.env.CLIENT_AGENT_CLAUDE_MODEL = "claude-sonnet-4-6";
  });

  afterEach(() => {
    delete process.env.CLIENT_AGENT_CLAUDE_MODEL;
  });

  it("routes tool payloads through the app client and defaults vague business questions to ads-first lifetime context", async () => {
    const runTool = vi.fn().mockResolvedValue({
      status: "ok",
      data: { spend: 10000 },
      referencedEntities: [],
      warnings: [],
    });

    queryMock.mockImplementation(async function* (params: any) {
      const toolServer = params.options.mcpServers["client-agent-tools"];
      const getAdsOverview = toolServer.tools.find((entry: any) => entry.name === "get_ads_overview");
      await getAdsOverview.handler({ payload: { rangePreset: "lifetime" } });

      yield assistantJson(
        JSON.stringify({
          status: "answer",
          text: "Lifetime Meta ad spend is $100.00.",
          referencedEntities: [],
          contextPayload: {
            primaryDomain: "ads",
            referencedEntities: [],
            resolvedRange: {
              preset: "lifetime",
              startDate: "1900-01-01",
              endDate: "2026-04-01",
              timezone: "America/Chicago",
            },
            comparisonSet: [],
            pronounTargets: [],
          },
          resolvedRange: {
            preset: "lifetime",
            startDate: "1900-01-01",
            endDate: "2026-04-01",
            timezone: "America/Chicago",
          },
        }),
      );
      yield resultJson("done");
    });

    const { runClientAgentRuntime } = await import("./runtime.js");
    const result = await runClientAgentRuntime({
      appClient: { runTool } as any,
      context: makeTaskContext("how much have we spent and made"),
    });

    expect(runTool).toHaveBeenCalledWith("task_1", "get_ads_overview", {
      rangePreset: "lifetime",
    });
    expect(queryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.stringContaining("Domain hint: ads"),
        options: expect.objectContaining({
          model: "claude-sonnet-4-6",
          allowedTools: expect.arrayContaining([
            "mcp__client-agent-tools__get_ads_overview",
          ]),
        }),
      }),
    );
    expect(result).toMatchObject({
      status: "answer",
      text: "Lifetime Meta ad spend is $100.00.",
      providerResponseId: "session_1",
    });
  });

  it("adds an events domain hint for last-show style questions", async () => {
    queryMock.mockImplementation(async function* () {
      yield assistantJson(
        JSON.stringify({
          status: "answer",
          text: "Your last show was Camila in Phoenix.",
          referencedEntities: [],
          contextPayload: {
            primaryDomain: "events",
            referencedEntities: [],
            resolvedRange: null,
            comparisonSet: [],
            pronounTargets: [],
          },
          resolvedRange: null,
        }),
      );
      yield resultJson("done");
    });

    const { runClientAgentRuntime } = await import("./runtime.js");
    await runClientAgentRuntime({
      appClient: { runTool: vi.fn() } as any,
      context: makeTaskContext("what was my last show?"),
    });

    expect(queryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.stringContaining("Domain hint: events"),
      }),
    );
  });

  it("passes refusal results through unchanged for setup or strategy asks", async () => {
    queryMock.mockImplementation(async function* () {
      yield assistantJson(
        JSON.stringify({
          status: "refuse",
          text: "I can help with campaign and event performance, but I can’t share setup or strategy details.",
          referencedEntities: [],
          contextPayload: null,
          resolvedRange: null,
        }),
      );
      yield resultJson("done");
    });

    const { runClientAgentRuntime } = await import("./runtime.js");
    const result = await runClientAgentRuntime({
      appClient: { runTool: vi.fn() } as any,
      context: makeTaskContext("what strategy are you using?"),
    });

    expect(result).toMatchObject({
      status: "refuse",
      text: "I can help with campaign and event performance, but I can’t share setup or strategy details.",
    });
  });
});
