import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { responsesParse, zodTextFormat } = vi.hoisted(() => ({
  responsesParse: vi.fn(),
  zodTextFormat: vi.fn((schema: unknown, name: string) => ({ name, schema })),
}));

const {
  compareEntities,
  getBreakdowns,
  getEntityDetails,
  getEventInsights,
  getOverview,
  resolvePreviousEventIntent,
  getTimeseries,
  getTopMovers,
  resolveEventIntent,
  searchEntities,
} = vi.hoisted(() => ({
  compareEntities: vi.fn(),
  getBreakdowns: vi.fn(),
  getEntityDetails: vi.fn(),
  getEventInsights: vi.fn(),
  getOverview: vi.fn(),
  resolvePreviousEventIntent: vi.fn(),
  getTimeseries: vi.fn(),
  getTopMovers: vi.fn(),
  resolveEventIntent: vi.fn(),
  searchEntities: vi.fn(),
}));

vi.mock("openai", () => ({
  default: vi.fn(() => ({
    responses: {
      parse: responsesParse,
    },
  })),
}));

vi.mock("openai/helpers/zod", () => ({
  zodTextFormat,
}));

vi.mock("./data", () => ({
  compareEntities,
  getBreakdowns,
  getEntityDetails,
  getEventInsights,
  getOverview,
  resolvePreviousEventIntent,
  getTimeseries,
  getTopMovers,
  resolveEventIntent,
  searchEntities,
}));

import { generateClientAgentModelResponse } from "./model";

describe("client-agent model adapter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    process.env.OPENAI_API_KEY = "test-openai-key";
    delete process.env.CLIENT_AGENT_OPENAI_MODEL;
    compareEntities.mockResolvedValue({ status: "no_data", blocks: [], referencedEntities: [] });
    getBreakdowns.mockResolvedValue({ status: "no_data", blocks: [], referencedEntities: [] });
    getEntityDetails.mockResolvedValue({ status: "no_data", blocks: [], referencedEntities: [] });
    getEventInsights.mockResolvedValue({ status: "no_data", blocks: [], referencedEntities: [] });
    getOverview.mockResolvedValue({ status: "no_data", blocks: [], referencedEntities: [] });
    resolvePreviousEventIntent.mockResolvedValue({ kind: "none" });
    getTimeseries.mockResolvedValue({ status: "no_data", blocks: [], referencedEntities: [] });
    getTopMovers.mockResolvedValue({ status: "no_data", blocks: [], referencedEntities: [] });
    resolveEventIntent.mockResolvedValue({ kind: "none" });
    searchEntities.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("defaults client agent responses to gpt-5.4 when no override is configured", async () => {
    responsesParse.mockResolvedValue({
      id: "resp_model_default",
      output: [
        {
          type: "message",
          content: [
            {
              type: "output_text",
              parsed: {
                status: "answer",
                text: "Direct answer.",
                blocks: [],
                referenced_entities: [],
                resolved_range: null,
              },
            },
          ],
        },
      ],
    });

    await generateClientAgentModelResponse({
      history: [],
      message: "How are my campaigns doing?",
      scopeSummary: {
        clientSlug: "zamora",
        eventsEnabled: true,
      },
    });

    expect(responsesParse).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "gpt-5.4",
      }),
    );
  });

  it("uses Responses API parse with store:false and Zod text format", async () => {
    responsesParse.mockResolvedValue({
      id: "resp_1",
      output: [
        {
          type: "message",
          content: [
            {
              type: "output_text",
              parsed: {
                status: "answer",
                text: "Here is your answer.",
                blocks: [],
                referenced_entities: [],
                resolved_range: null,
              },
            },
          ],
        },
      ],
    });

    const result = await generateClientAgentModelResponse({
      history: [],
      message: "How did campaign performance look yesterday?",
      scopeSummary: {
        clientSlug: "acme",
        eventsEnabled: true,
      },
    });

    expect(result.status).toBe("answer");
    expect(zodTextFormat).toHaveBeenCalled();
    expect(responsesParse).toHaveBeenCalledWith(
      expect.objectContaining({
        store: false,
        text: expect.objectContaining({
          format: expect.anything(),
        }),
      }),
    );
  });

  it("returns a safe error payload when OPENAI_API_KEY is missing", async () => {
    delete process.env.OPENAI_API_KEY;

    const result = await generateClientAgentModelResponse({
      history: [],
      message: "How did campaign performance look yesterday?",
      scopeSummary: {
        clientSlug: "acme",
        eventsEnabled: true,
      },
    });

    expect(result).toMatchObject({
      status: "error",
      blocks: [],
      referencedEntities: [],
      resolvedRange: null,
    });
    expect(result.text.toLowerCase()).toContain("unable");
    expect(responsesParse).not.toHaveBeenCalled();
  });

  it("returns a safe error payload when schema parsing fails", async () => {
    responsesParse.mockResolvedValue({
      id: "resp_2",
      output: [
        {
          type: "message",
          content: [
            {
              type: "output_text",
              parsed: {
                status: "not_a_valid_status",
                text: "bad",
              },
            },
          ],
        },
      ],
    });

    const result = await generateClientAgentModelResponse({
      history: [{ role: "user", text: "hello" }],
      message: "How did campaign performance look yesterday?",
      scopeSummary: {
        clientSlug: "acme",
        eventsEnabled: true,
      },
    });

    expect(result).toMatchObject({
      status: "error",
      blocks: [],
      referencedEntities: [],
      resolvedRange: null,
    });
    expect(result.providerResponseId).toBe("resp_2");
  });

  it("uses authoritative tool metadata instead of the model echoed payload", async () => {
    responsesParse.mockResolvedValue({
      id: "resp_3",
      output: [
        {
          type: "message",
          content: [
            {
              type: "output_text",
              parsed: {
                status: "answer",
                text: "Here is your answer.",
                blocks: [
                  {
                    type: "metric_cards",
                    cards: [{ label: "Bad", value: "Bad" }],
                  },
                ],
                referenced_entities: [
                  {
                    entityId: "cmp_out_of_scope",
                    entityType: "campaign",
                    name: "Leaked Campaign",
                  },
                ],
                resolved_range: null,
              },
            },
          ],
        },
      ],
    });

    const result = await generateClientAgentModelResponse({
      history: [],
      message: "How did campaign performance look yesterday?",
      scopeSummary: {
        clientSlug: "acme",
        eventsEnabled: true,
      },
    });

    expect(result).toMatchObject({
      status: "answer",
      blocks: [],
      referencedEntities: [],
      resolvedRange: expect.objectContaining({
        preset: "yesterday",
        timezone: "America/Chicago",
      }),
      providerResponseId: "resp_3",
    });
  });

  it("returns prose-only answers even when analytics tools return blocks", async () => {
    getOverview.mockResolvedValue({
      status: "ok",
      blocks: [
        {
          type: "metric_cards",
          title: "Overview",
          cards: [
            { label: "Spend", value: "$12.6K" },
            { label: "Revenue", value: "$90.6K" },
          ],
        },
      ],
      referencedEntities: [
        {
          entityId: "cmp_1",
          entityType: "campaign",
          name: "Zamora - Camila - Phoenix",
        },
      ],
    });
    responsesParse.mockResolvedValue({
      id: "resp_prose_only",
      output: [
        {
          type: "message",
          content: [
            {
              type: "output_text",
              parsed: {
                status: "answer",
                text: "Your campaigns are pacing well this month.",
                blocks: [],
                referenced_entities: [],
                resolved_range: null,
              },
            },
          ],
        },
      ],
    });

    const result = await generateClientAgentModelResponse({
      history: [],
      message: "How are my campaigns doing this month?",
      scope: {
        clientId: "client_1",
        clientMemberId: "member_1",
        clientSlug: "zamora",
        allowedCampaignIds: null,
        allowedEventIds: null,
        eventsEnabled: true,
        viewer: "member",
      },
      scopeSummary: {
        clientSlug: "zamora",
        eventsEnabled: true,
      },
    });

    expect(result).toMatchObject({
      status: "answer",
      text: "Your campaigns are pacing well this month.",
      blocks: [],
    });
  });

  it("falls back to conversational prose instead of canned report copy when formatting fails", async () => {
    responsesParse.mockRejectedValue(new Error("formatter failed"));
    getOverview.mockResolvedValue({
      status: "ok",
      blocks: [
        {
          type: "metric_cards",
          title: "Overview",
          cards: [
            { label: "Spend", value: "$12.6K" },
            { label: "Revenue", value: "$90.6K" },
          ],
        },
      ],
      referencedEntities: [
        {
          entityId: "cmp_1",
          entityType: "campaign",
          name: "Zamora - Camila - Phoenix",
        },
      ],
    });

    const result = await generateClientAgentModelResponse({
      history: [],
      message: "How are my campaigns doing this month?",
      scope: {
        clientId: "client_1",
        clientMemberId: "member_1",
        clientSlug: "zamora",
        allowedCampaignIds: null,
        allowedEventIds: null,
        eventsEnabled: true,
        viewer: "member",
      },
      scopeSummary: {
        clientSlug: "zamora",
        eventsEnabled: true,
      },
    });

    expect(result).toMatchObject({
      status: "answer",
      text: expect.not.stringContaining("summary"),
      blocks: [],
      referencedEntities: [
        {
          entityId: "cmp_1",
          entityType: "campaign",
          name: "Zamora - Camila - Phoenix",
        },
      ],
      resolvedRange: expect.objectContaining({
        preset: "this_month",
        timezone: "America/Chicago",
      }),
      providerResponseId: null,
    });
  });

  it("answers 'how many shows we have' with prose instead of overview blocks", async () => {
    resolveEventIntent.mockResolvedValue({
      kind: "count",
      totalEvents: 5,
      referencedEntities: [
        { entityId: "evt_1", entityType: "event", name: "Camila Phoenix" },
      ],
    });
    responsesParse.mockResolvedValue({
      id: "resp_show_count",
      output: [
        {
          type: "message",
          content: [
            {
              type: "output_text",
              parsed: {
                status: "answer",
                text: "You currently have 5 shows in scope.",
                blocks: [],
                referenced_entities: [],
                resolved_range: null,
              },
            },
          ],
        },
      ],
    });

    const result = await generateClientAgentModelResponse({
      history: [],
      message: "how many shows we have",
      scope: {
        clientId: "client_1",
        clientMemberId: "member_1",
        clientSlug: "zamora",
        allowedCampaignIds: null,
        allowedEventIds: null,
        eventsEnabled: true,
        viewer: "member",
      },
      scopeSummary: {
        clientSlug: "zamora",
        eventsEnabled: true,
      },
    });

    expect(result.status).toBe("answer");
    expect(result.text).toContain("5 shows");
    expect(result.blocks).toEqual([]);
  });

  it("answers 'how we did last show' using the inferred most recent event", async () => {
    resolveEventIntent.mockResolvedValue({
      kind: "entity",
      eventId: "evt_latest",
      referencedEntities: [
        { entityId: "evt_latest", entityType: "event", name: "Camila Phoenix" },
      ],
    });
    getEntityDetails.mockResolvedValue({
      status: "ok",
      blocks: [
        {
          type: "metric_cards",
          title: "Event Performance",
          cards: [{ label: "Tickets Sold", value: "430" }],
        },
      ],
      referencedEntities: [
        { entityId: "evt_latest", entityType: "event", name: "Camila Phoenix" },
      ],
    });
    responsesParse.mockResolvedValue({
      id: "resp_last_show",
      output: [
        {
          type: "message",
          content: [
            {
              type: "output_text",
              parsed: {
                status: "answer",
                text: "Your most recent show was Camila Phoenix.",
                blocks: [],
                referenced_entities: [],
                resolved_range: null,
              },
            },
          ],
        },
      ],
    });

    const result = await generateClientAgentModelResponse({
      history: [],
      message: "how we did last show",
      scope: {
        clientId: "client_1",
        clientMemberId: "member_1",
        clientSlug: "zamora",
        allowedCampaignIds: null,
        allowedEventIds: null,
        eventsEnabled: true,
        viewer: "member",
      },
      scopeSummary: {
        clientSlug: "zamora",
        eventsEnabled: true,
      },
    });

    expect(result.text).toContain("most recent show");
    expect(result.referencedEntities).toMatchObject([
      { entityId: "evt_latest", entityType: "event" },
    ]);
    expect(result.blocks).toEqual([]);
  });

  it("answers 'and before that?' using the previously referenced show from history", async () => {
    resolvePreviousEventIntent.mockResolvedValue({
      kind: "entity",
      eventId: "evt_previous",
      referencedEntities: [
        { entityId: "evt_previous", entityType: "event", name: "Camila San Diego" },
      ],
    });
    getEntityDetails.mockResolvedValue({
      status: "ok",
      blocks: [
        {
          type: "metric_cards",
          title: "Event Performance",
          cards: [
            { label: "Tickets Sold", value: "381" },
            { label: "Gross", value: "$48,100" },
          ],
        },
      ],
      referencedEntities: [
        { entityId: "evt_previous", entityType: "event", name: "Camila San Diego" },
      ],
    });
    responsesParse.mockResolvedValue({
      id: "resp_previous_show",
      output: [
        {
          type: "message",
          content: [
            {
              type: "output_text",
              parsed: {
                status: "answer",
                text: "Before that, your previous show was Camila San Diego.",
                blocks: [],
                referenced_entities: [],
                resolved_range: null,
              },
            },
          ],
        },
      ],
    });

    const result = await generateClientAgentModelResponse({
      history: [
        { role: "user", text: "what was my last show?" },
        {
          role: "assistant",
          text: "Your most recent show was Camila Phoenix.",
          referencedEntities: [
            { entityId: "evt_latest", entityType: "event", name: "Camila Phoenix" },
          ],
        },
      ],
      message: "and before that?",
      scope: {
        clientId: "client_1",
        clientMemberId: "member_1",
        clientSlug: "zamora",
        allowedCampaignIds: null,
        allowedEventIds: null,
        eventsEnabled: true,
        viewer: "member",
      },
      scopeSummary: {
        clientSlug: "zamora",
        eventsEnabled: true,
      },
    });

    expect(resolvePreviousEventIntent).toHaveBeenCalledWith({
      currentEventId: "evt_latest",
      scope: expect.objectContaining({
        clientSlug: "zamora",
      }),
    });
    expect(result.text).toContain("previous show");
    expect(result.referencedEntities).toMatchObject([
      { entityId: "evt_previous", entityType: "event" },
    ]);
  });

  it("uses aggregate campaign breakdowns for broad audience questions", async () => {
    getBreakdowns.mockResolvedValue({
      status: "ok",
      blocks: [
        {
          type: "table",
          title: "Breakdown",
          columns: ["Age", "Gender", "Spend", "CTR", "ROAS"],
          rows: [
            {
              Age: "25-34",
              Gender: "Female",
              Spend: "$4,200",
              CTR: "2.40",
              ROAS: "3.80",
            },
          ],
        },
      ],
      referencedEntities: [
        { entityId: "cmp_1", entityType: "campaign", name: "Camila Phoenix" },
        { entityId: "cmp_2", entityType: "campaign", name: "Camila Anaheim" },
      ],
    });
    responsesParse.mockResolvedValue({
      id: "resp_audience",
      output: [
        {
          type: "message",
          content: [
            {
              type: "output_text",
              parsed: {
                status: "answer",
                text: "Right now, women 25-34 are the strongest audience in your campaigns.",
                blocks: [],
                referenced_entities: [],
                resolved_range: null,
              },
            },
          ],
        },
      ],
    });

    const result = await generateClientAgentModelResponse({
      history: [],
      message: "Which audience is performing best right now?",
      scope: {
        clientId: "client_1",
        clientMemberId: "member_1",
        clientSlug: "zamora",
        allowedCampaignIds: null,
        allowedEventIds: null,
        eventsEnabled: true,
        viewer: "member",
      },
      scopeSummary: {
        clientSlug: "zamora",
        eventsEnabled: true,
      },
    });

    expect(getBreakdowns).toHaveBeenCalledWith(
      expect.objectContaining({
        breakdown: "age_gender",
        entityId: null,
      }),
    );
    expect(result.text).toContain("strongest audience");
  });

  it("asks a short clarification when multiple latest shows are tied", async () => {
    resolveEventIntent.mockResolvedValue({
      kind: "clarify",
      choices: [
        { entityId: "evt_camila", entityType: "event", name: "Camila Phoenix" },
        { entityId: "evt_arjona", entityType: "event", name: "Arjona Houston" },
      ],
    });

    const result = await generateClientAgentModelResponse({
      history: [],
      message: "how we did last show",
      scope: {
        clientId: "client_1",
        clientMemberId: "member_1",
        clientSlug: "zamora",
        allowedCampaignIds: null,
        allowedEventIds: null,
        eventsEnabled: true,
        viewer: "member",
      },
      scopeSummary: {
        clientSlug: "zamora",
        eventsEnabled: true,
      },
    });

    expect(result.status).toBe("clarify");
    expect(result.text).toMatch(/camila|arjona/i);
    expect(result.blocks).toEqual([]);
  });

  it("returns a prose answer when no allowed shows are available", async () => {
    resolveEventIntent.mockResolvedValue({ kind: "none" });

    const result = await generateClientAgentModelResponse({
      history: [],
      message: "how we did last show",
      scope: {
        clientId: "client_1",
        clientMemberId: "member_1",
        clientSlug: "zamora",
        allowedCampaignIds: null,
        allowedEventIds: [],
        eventsEnabled: true,
        viewer: "member",
      },
      scopeSummary: {
        clientSlug: "zamora",
        eventsEnabled: true,
      },
    });

    expect(result.status).toBe("answer");
    expect(result.text).toMatch(/no shows|no events/i);
    expect(result.blocks).toEqual([]);
  });
});
