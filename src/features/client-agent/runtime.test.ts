import { beforeEach, describe, expect, it, vi } from "vitest";

const { queryMock, toolMock, createSdkMcpServerMock } = vi.hoisted(() => ({
  queryMock: vi.fn(),
  toolMock: vi.fn(),
  createSdkMcpServerMock: vi.fn(),
}));

const {
  compareEntities,
  getAdsOverview,
  getCampaignDetails,
  getCreativeDetails,
  getDemographicBreakdown,
  getEventDetails,
  getEventsOverview,
  getGeographyBreakdown,
  getPlacementBreakdown,
  getTimeseries,
  searchScope,
} = vi.hoisted(() => ({
  compareEntities: vi.fn(),
  getAdsOverview: vi.fn(),
  getCampaignDetails: vi.fn(),
  getCreativeDetails: vi.fn(),
  getDemographicBreakdown: vi.fn(),
  getEventDetails: vi.fn(),
  getEventsOverview: vi.fn(),
  getGeographyBreakdown: vi.fn(),
  getPlacementBreakdown: vi.fn(),
  getTimeseries: vi.fn(),
  searchScope: vi.fn(),
}));

vi.mock("@anthropic-ai/claude-agent-sdk", () => ({
  query: queryMock,
  tool: toolMock,
  createSdkMcpServer: createSdkMcpServerMock,
}));

vi.mock("./tools", () => ({
  compareEntities,
  getAdsOverview,
  getCampaignDetails,
  getCreativeDetails,
  getDemographicBreakdown,
  getEventDetails,
  getEventsOverview,
  getGeographyBreakdown,
  getPlacementBreakdown,
  getTimeseries,
  searchScope,
}));

import { runClientAgentRuntime } from "./runtime";

const memberScope = () => ({
  clientId: "client_1",
  clientMemberId: "member_1",
  clientSlug: "zamora",
  allowedCampaignIds: null,
  allowedEventIds: null,
  eventsEnabled: true,
  viewer: "member" as const,
});

const lifetimeRange = {
  preset: "lifetime" as const,
  startDate: "1900-01-01",
  endDate: "2026-04-01",
  timezone: "America/Chicago",
};

function sdkResultSuccess({
  result,
  sessionId = "sess_client_agent",
}: {
  result: string;
  sessionId?: string;
}) {
  return {
    type: "result" as const,
    subtype: "success" as const,
    duration_ms: 1,
    duration_api_ms: 1,
    is_error: false,
    num_turns: 1,
    result,
    stop_reason: null,
    total_cost_usd: 0,
    usage: {} as Record<string, unknown>,
    modelUsage: {},
    permission_denials: [],
    uuid: "uuid_result",
    session_id: sessionId,
  };
}

function sdkAssistantMessage({
  text,
  sessionId = "sess_client_agent",
}: {
  text: string;
  sessionId?: string;
}) {
  return {
    type: "assistant" as const,
    parent_tool_use_id: null,
    error: undefined,
    uuid: "uuid_assistant",
    session_id: sessionId,
    message: {
      content: [
        {
          type: "text",
          text,
        },
      ],
    },
  };
}

function getServerFromQueryCall() {
  const firstCall = queryMock.mock.calls[0]?.[0] as
    | { options?: { mcpServers?: Record<string, { tools?: Array<{ name: string; handler: (args: unknown, extra: unknown) => Promise<unknown> }> }> } }
    | undefined;

  return firstCall?.options?.mcpServers?.["client-agent-tools"];
}

function makeMockQuery(
  iterate: (params: unknown) => AsyncGenerator<unknown>,
) {
  const close = vi.fn();

  return (params: unknown) => ({
    close,
    async *[Symbol.asyncIterator]() {
      yield* iterate(params);
    },
  });
}

describe("client-agent runtime", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ANTHROPIC_API_KEY = "test-anthropic-key";
    delete process.env.ANTHROPIC_AUTH_TOKEN;
    delete process.env.CLIENT_AGENT_CLAUDE_MODEL;

    toolMock.mockImplementation((name, description, inputSchema, handler) => ({
      name,
      description,
      inputSchema,
      handler,
    }));
    createSdkMcpServerMock.mockImplementation((options) => ({
      type: "sdk",
      name: options.name,
      instance: { close: vi.fn() },
      tools: options.tools ?? [],
    }));

    searchScope.mockResolvedValue({ status: "no_data", referencedEntities: [] });
    getAdsOverview.mockResolvedValue({ status: "no_data", referencedEntities: [] });
    getEventsOverview.mockResolvedValue({ status: "no_data", referencedEntities: [] });
    getCampaignDetails.mockResolvedValue({ status: "no_data", referencedEntities: [] });
    getEventDetails.mockResolvedValue({ status: "no_data", referencedEntities: [] });
    getCreativeDetails.mockResolvedValue({ status: "no_data", referencedEntities: [] });
    getDemographicBreakdown.mockResolvedValue({ status: "no_data", referencedEntities: [] });
    getGeographyBreakdown.mockResolvedValue({ status: "no_data", referencedEntities: [] });
    getPlacementBreakdown.mockResolvedValue({ status: "no_data", referencedEntities: [] });
    compareEntities.mockResolvedValue({ status: "no_data", referencedEntities: [] });
    getTimeseries.mockResolvedValue({ status: "no_data", referencedEntities: [] });
  });

  it("executes the ads overview tool through the Claude SDK and returns final prose", async () => {
    getAdsOverview.mockResolvedValue({
      status: "ok",
      data: {
        totals: {
          spendUsd: 22000,
          revenueUsd: 88000,
          roas: 4,
        },
      },
      referencedEntities: [
        {
          entityId: "cmp_1",
          entityType: "campaign",
          name: "Zamora - Camila - Phoenix",
        },
      ],
    });

    queryMock.mockImplementation(
      makeMockQuery(async function* () {
        const server = getServerFromQueryCall();
        const adsTool = server?.tools?.find((entry) => entry.name === "get_ads_overview");
        await adsTool?.handler(
          { range: lifetimeRange, campaignIds: null, creativeIds: null },
          {},
        );
        yield sdkResultSuccess({
          result:
            "ANSWER: Lifetime on Meta ads, you've spent $22,000 and generated $88,000 in tracked revenue.",
        });
      }),
    );

    const result = await runClientAgentRuntime({
      history: [],
      message: "how much have we spent and made",
      scope: memberScope(),
      scopeSummary: {
        clientSlug: "zamora",
        eventsEnabled: true,
      },
    });

    expect(getAdsOverview).toHaveBeenCalledWith({
      scope: memberScope(),
      args: {
        range: lifetimeRange,
        campaignIds: null,
        creativeIds: null,
      },
    });
    expect(queryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: "how much have we spent and made",
        options: expect.objectContaining({
          model: "claude-sonnet-4-6",
          permissionMode: "dontAsk",
          allowedTools: expect.arrayContaining([
            "mcp__client-agent-tools__get_ads_overview",
          ]),
        }),
      }),
    );
    expect(result).toMatchObject({
      status: "answer",
      text: "Lifetime on Meta ads, you've spent $22,000 and generated $88,000 in tracked revenue.",
      referencedEntities: [
        {
          entityId: "cmp_1",
          entityType: "campaign",
          name: "Zamora - Camila - Phoenix",
        },
      ],
      resolvedRange: lifetimeRange,
      providerResponseId: "sess_client_agent",
    });
  });

  it("returns a safe error when the anthropic api key is missing", async () => {
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_AUTH_TOKEN;

    const result = await runClientAgentRuntime({
      history: [],
      message: "how much have we spent",
      scope: memberScope(),
      scopeSummary: {
        clientSlug: "zamora",
        eventsEnabled: true,
      },
    });

    expect(queryMock).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      status: "error",
      text: "I'm unable to answer that right now.",
    });
  });

  it("allows the runtime to start when only an anthropic auth token is present", async () => {
    delete process.env.ANTHROPIC_API_KEY;
    process.env.ANTHROPIC_AUTH_TOKEN = "test-auth-token";

    queryMock.mockImplementation(
      makeMockQuery(async function* () {
        yield sdkResultSuccess({
          result: "ANSWER: Lifetime on Meta ads, you've spent $11,559 so far.",
        });
      }),
    );

    const result = await runClientAgentRuntime({
      history: [],
      message: "how much we have spend on ads?",
      scope: memberScope(),
      scopeSummary: {
        clientSlug: "zamora",
        eventsEnabled: true,
      },
    });

    expect(queryMock).toHaveBeenCalledOnce();
    expect(result).toMatchObject({
      status: "answer",
      text: "Lifetime on Meta ads, you've spent $11,559 so far.",
    });
  });

  it("appends the refusal note after safe analytics for mixed prompts", async () => {
    queryMock.mockImplementation(
      makeMockQuery(async function* () {
        yield sdkResultSuccess({
          result:
            "ANSWER: Lifetime on Meta ads, you've spent $22,000 and generated $88,000 in tracked revenue.",
        });
      }),
    );

    const result = await runClientAgentRuntime({
      history: [],
      message: "how much have we spent and how is this wired internally",
      scope: memberScope(),
      scopeSummary: {
        clientSlug: "zamora",
        eventsEnabled: true,
      },
    });

    expect(result.status).toBe("answer");
    expect(result.text).toContain("Lifetime on Meta ads");
    expect(result.text).toContain("I can help with performance");
  });

  it("resets prior creative context when a new turn broadens back to overall ads", async () => {
    queryMock.mockImplementation(
      makeMockQuery(async function* () {
        yield sdkResultSuccess({
          result: "ANSWER: Lifetime on Meta ads, you've spent $11,559 so far.",
        });
      }),
    );

    const result = await runClientAgentRuntime({
      history: [
        {
          role: "assistant",
          text: "video 4 - Bay Area is the strongest creative in scope right now, with ROAS 0, CTR 3.24, and spend of $101 over last 30 days.",
          referencedEntities: [
            {
              entityId: "ad_1",
              entityType: "creative",
              name: "video 4 - Bay Area",
              campaignId: "cmp_1",
            },
          ],
          contextPayload: {
            primaryDomain: "ads",
            referencedEntities: [
              {
                entityId: "ad_1",
                entityType: "creative",
                name: "video 4 - Bay Area",
                campaignId: "cmp_1",
              },
            ],
            resolvedRange: lifetimeRange,
            comparisonSet: [],
            pronounTargets: ["ad_1"],
          },
          resolvedRange: lifetimeRange,
        },
      ],
      message: "how much we have spend on ads?",
      scope: memberScope(),
      scopeSummary: {
        clientSlug: "zamora",
        eventsEnabled: true,
      },
    });

    expect(queryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: "how much we have spend on ads?",
        options: expect.objectContaining({
          systemPrompt: expect.stringContaining(
            "The current user message broadens scope to the full visible ads portfolio.",
          ),
        }),
      }),
    );
    expect(result).toMatchObject({
      status: "answer",
      text: "Lifetime on Meta ads, you've spent $11,559 so far.",
      referencedEntities: [],
      contextPayload: null,
    });
  });

  it("passes only the current user message and resolved context memo for real follow-ups", async () => {
    queryMock.mockImplementation(
      makeMockQuery(async function* (params) {
        expect(params).toMatchObject({
          prompt: "and before that?",
          options: {
            systemPrompt: expect.stringContaining(
              "Most recent resolved thread context: primary domain events; referenced entities Ricardo Arjona - LO QUE EL SECO NO DIJO TOUR; resolved range lifetime. Reuse this context for follow-ups unless the user clearly changes direction.",
            ),
          },
        });
        yield sdkAssistantMessage({
          text: "ANSWER: Before that, the prior show was Camila - Regresa Tour.",
        });
      }),
    );

    const result = await runClientAgentRuntime({
      history: [
        {
          role: "user",
          text: "what was my last show?",
          resolvedRange: lifetimeRange,
        },
        {
          role: "assistant",
          text: "Your most recent show was Ricardo Arjona - LO QUE EL SECO NO DIJO TOUR.",
          referencedEntities: [
            {
              entityId: "evt_latest",
              entityType: "event",
              name: "Ricardo Arjona - LO QUE EL SECO NO DIJO TOUR",
            },
          ],
          contextPayload: {
            primaryDomain: "events",
            referencedEntities: [
              {
                entityId: "evt_latest",
                entityType: "event",
                name: "Ricardo Arjona - LO QUE EL SECO NO DIJO TOUR",
              },
            ],
            resolvedRange: lifetimeRange,
            comparisonSet: [],
            pronounTargets: ["evt_latest"],
          },
          resolvedRange: lifetimeRange,
        },
      ],
      message: "and before that?",
      scope: memberScope(),
      scopeSummary: {
        clientSlug: "zamora",
        eventsEnabled: true,
      },
    });

    expect(result).toMatchObject({
      status: "answer",
      text: "Before that, the prior show was Camila - Regresa Tour.",
      providerResponseId: "sess_client_agent",
    });
  });
});
