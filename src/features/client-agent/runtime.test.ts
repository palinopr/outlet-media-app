import { beforeEach, describe, expect, it, vi } from "vitest";

const { responsesCreate } = vi.hoisted(() => ({
  responsesCreate: vi.fn(),
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

vi.mock("openai", () => ({
  default: vi.fn(() => ({
    responses: {
      create: responsesCreate,
    },
  })),
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

function functionCallResponse({
  id,
  name,
  args,
  callId = "call_1",
}: {
  id: string;
  name: string;
  args: unknown;
  callId?: string;
}) {
  return {
    id,
    created_at: 1,
    output_text: "",
    error: null,
    incomplete_details: null,
    instructions: null,
    metadata: null,
    model: "gpt-5.4",
    object: "response" as const,
    output: [
      {
        id: `fc_${callId}`,
        type: "function_call" as const,
        call_id: callId,
        name,
        arguments: JSON.stringify(args),
        status: "completed" as const,
      },
    ],
    parallel_tool_calls: false,
    temperature: null,
    tool_choice: "auto" as const,
    tools: [],
    top_p: null,
    truncation: "disabled" as const,
    usage: {
      input_tokens: 0,
      input_tokens_details: { cached_tokens: 0 },
      output_tokens: 0,
      output_tokens_details: { reasoning_tokens: 0 },
      total_tokens: 0,
    },
    user: null,
  };
}

function finalMessageResponse({
  id,
  text,
}: {
  id: string;
  text: string;
}) {
  return {
    id,
    created_at: 1,
    output_text: text,
    error: null,
    incomplete_details: null,
    instructions: null,
    metadata: null,
    model: "gpt-5.4",
    object: "response" as const,
    output: [
      {
        id: "msg_1",
        type: "message" as const,
        role: "assistant" as const,
        status: "completed" as const,
        content: [
          {
            type: "output_text" as const,
            text,
            annotations: [],
          },
        ],
      },
    ],
    parallel_tool_calls: false,
    temperature: null,
    tool_choice: "auto" as const,
    tools: [],
    top_p: null,
    truncation: "disabled" as const,
    usage: {
      input_tokens: 0,
      input_tokens_details: { cached_tokens: 0 },
      output_tokens: 0,
      output_tokens_details: { reasoning_tokens: 0 },
      total_tokens: 0,
    },
    user: null,
  };
}

describe("client-agent runtime", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.OPENAI_API_KEY = "test-openai-key";
    delete process.env.CLIENT_AGENT_OPENAI_MODEL;

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

  it("executes sequential tool calls until the model returns final text", async () => {
    getAdsOverview.mockResolvedValue({
      status: "ok",
      data: {
        totals: {
          spendUsd: 22000,
          revenueUsd: 88000,
          roas: 4,
          impressions: 1000000,
          clicks: 35000,
          ctr: 3.5,
          cpcUsd: 0.63,
          cpmUsd: 22,
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

    responsesCreate
      .mockResolvedValueOnce(
        functionCallResponse({
          id: "resp_1",
          name: "get_ads_overview",
          args: { range: lifetimeRange, campaignIds: null, creativeIds: null },
        }),
      )
      .mockResolvedValueOnce(
        finalMessageResponse({
          id: "resp_2",
          text: "ANSWER: Lifetime on Meta ads, you've spent $22,000 and generated $88,000 in tracked revenue.",
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
    expect(responsesCreate).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        model: "gpt-5.4",
        store: false,
        parallel_tool_calls: false,
      }),
    );
    expect(responsesCreate).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        input: expect.arrayContaining([
          expect.objectContaining({
            type: "function_call_output",
            call_id: "call_1",
          }),
        ]),
      }),
    );
    expect(result).toMatchObject({
      status: "answer",
      text: "Lifetime on Meta ads, you've spent $22,000 and generated $88,000 in tracked revenue.",
      blocks: [],
      referencedEntities: [
        {
          entityId: "cmp_1",
          entityType: "campaign",
          name: "Zamora - Camila - Phoenix",
        },
      ],
      resolvedRange: lifetimeRange,
      providerResponseId: "resp_2",
    });
  });

  it("allows one invalid-arguments correction cycle", async () => {
    getTimeseries.mockResolvedValue({
      status: "ok",
      data: {
        series: [
          { x: "2026-01", y: 12000 },
          { x: "2026-02", y: 10000 },
        ],
      },
      referencedEntities: [
        {
          entityId: "cmp_1",
          entityType: "campaign",
          name: "Zamora - Camila - Phoenix",
        },
      ],
    });

    responsesCreate
      .mockResolvedValueOnce(
        functionCallResponse({
          id: "resp_1",
          name: "get_timeseries",
          args: {
            domain: "ads",
            entityType: "campaign",
            entityIds: ["cmp_1"],
            metric: "bad_metric",
            range: lifetimeRange,
            interval: "month",
          },
          callId: "call_bad",
        }),
      )
      .mockResolvedValueOnce(
        functionCallResponse({
          id: "resp_2",
          name: "get_timeseries",
          args: {
            domain: "ads",
            entityType: "campaign",
            entityIds: ["cmp_1"],
            metric: "spend",
            range: lifetimeRange,
            interval: "month",
          },
          callId: "call_good",
        }),
      )
      .mockResolvedValueOnce(
        finalMessageResponse({
          id: "resp_3",
          text: "ANSWER: Here is the lifetime spend trend.",
        }),
      );

    const result = await runClientAgentRuntime({
      history: [],
      message: "show me lifetime spend trend",
      scope: memberScope(),
      scopeSummary: {
        clientSlug: "zamora",
        eventsEnabled: true,
      },
    });

    expect(getTimeseries).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      status: "answer",
      text: "Here is the lifetime spend trend.",
      resolvedRange: lifetimeRange,
      providerResponseId: "resp_3",
    });
  });

  it("appends the refusal note after safe analytics for mixed prompts", async () => {
    getAdsOverview.mockResolvedValue({
      status: "ok",
      data: {
        totals: {
          spendUsd: 22000,
          revenueUsd: 88000,
          roas: 4,
          impressions: 1000000,
          clicks: 35000,
          ctr: 3.5,
          cpcUsd: 0.63,
          cpmUsd: 22,
        },
      },
      referencedEntities: [],
    });

    responsesCreate
      .mockResolvedValueOnce(
        functionCallResponse({
          id: "resp_1",
          name: "get_ads_overview",
          args: { range: lifetimeRange, campaignIds: null, creativeIds: null },
        }),
      )
      .mockResolvedValueOnce(
        finalMessageResponse({
          id: "resp_2",
          text: "ANSWER: Lifetime on Meta ads, you've spent $22,000 and generated $88,000 in tracked revenue.",
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

  it("resets prior creative context when a follow-up broadens back to overall ads", async () => {
    responsesCreate.mockResolvedValueOnce(
      finalMessageResponse({
        id: "resp_1",
        text: "ANSWER: Lifetime on Meta ads, you've spent $11,559 so far.",
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

    expect(responsesCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        instructions: expect.stringContaining(
          "The current user message broadens scope to the full visible ads portfolio.",
        ),
        input: [
          {
            type: "message",
            role: "user",
            content: "how much we have spend on ads?",
          },
        ],
      }),
    );
    expect(result).toMatchObject({
      status: "answer",
      text: "Lifetime on Meta ads, you've spent $11,559 so far.",
      referencedEntities: [],
      contextPayload: null,
    });
  });
});
