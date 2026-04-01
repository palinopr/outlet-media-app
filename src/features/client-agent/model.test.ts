import { beforeEach, describe, expect, it, vi } from "vitest";

const { responsesParse, zodTextFormat } = vi.hoisted(() => ({
  responsesParse: vi.fn(),
  zodTextFormat: vi.fn((schema: unknown, name: string) => ({ name, schema })),
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

import { generateClientAgentModelResponse } from "./model";

describe("client-agent model adapter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.OPENAI_API_KEY = "test-openai-key";
    process.env.CLIENT_AGENT_OPENAI_MODEL = "gpt-5";
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
});
