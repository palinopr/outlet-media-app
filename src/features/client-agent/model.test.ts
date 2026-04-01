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
  getTimeseries,
  getTopMovers,
  searchEntities,
} = vi.hoisted(() => ({
  compareEntities: vi.fn(),
  getBreakdowns: vi.fn(),
  getEntityDetails: vi.fn(),
  getEventInsights: vi.fn(),
  getOverview: vi.fn(),
  getTimeseries: vi.fn(),
  getTopMovers: vi.fn(),
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
  getTimeseries,
  getTopMovers,
  searchEntities,
}));

import { generateClientAgentModelResponse } from "./model";

describe("client-agent model adapter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    process.env.OPENAI_API_KEY = "test-openai-key";
    process.env.CLIENT_AGENT_OPENAI_MODEL = "gpt-5";
    compareEntities.mockResolvedValue({ status: "no_data", blocks: [], referencedEntities: [] });
    getBreakdowns.mockResolvedValue({ status: "no_data", blocks: [], referencedEntities: [] });
    getEntityDetails.mockResolvedValue({ status: "no_data", blocks: [], referencedEntities: [] });
    getEventInsights.mockResolvedValue({ status: "no_data", blocks: [], referencedEntities: [] });
    getOverview.mockResolvedValue({ status: "no_data", blocks: [], referencedEntities: [] });
    getTimeseries.mockResolvedValue({ status: "no_data", blocks: [], referencedEntities: [] });
    getTopMovers.mockResolvedValue({ status: "no_data", blocks: [], referencedEntities: [] });
    searchEntities.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
      resolvedRange: {
        preset: "yesterday",
        startDate: "2026-03-30",
        endDate: "2026-03-30",
        timezone: "America/Chicago",
      },
      providerResponseId: "resp_3",
    });
  });

  it("falls back to the authoritative tool blocks when model formatting throws after successful data execution", async () => {
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
      text: expect.stringContaining("summary"),
      blocks: [
        {
          type: "metric_cards",
          title: "Overview",
        },
      ],
      referencedEntities: [
        {
          entityId: "cmp_1",
          entityType: "campaign",
          name: "Zamora - Camila - Phoenix",
        },
      ],
      resolvedRange: {
        preset: "this_month",
        startDate: "2026-03-01",
        endDate: "2026-03-31",
        timezone: "America/Chicago",
      },
      providerResponseId: null,
    });
  });
});
