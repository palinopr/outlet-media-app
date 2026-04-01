import { beforeEach, describe, expect, it, vi } from "vitest";

const { runClientAgentRuntime } = vi.hoisted(() => ({
  runClientAgentRuntime: vi.fn(),
}));

vi.mock("./runtime", () => ({
  runClientAgentRuntime,
}));

import { generateClientAgentModelResponse } from "./model";

describe("client-agent model wrapper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("delegates to the tool-driven runtime without changing the transport shape", async () => {
    const runtimeResponse = {
      status: "answer" as const,
      text: "Lifetime on Meta ads, you've spent $22,000 and generated $88,000 in tracked revenue.",
      blocks: [],
      referencedEntities: [
        {
          entityId: "cmp_1",
          entityType: "campaign" as const,
          name: "Zamora - Camila - Phoenix",
        },
      ],
      resolvedRange: {
        preset: "lifetime" as const,
        startDate: "1900-01-01",
        endDate: "2026-04-01",
        timezone: "America/Chicago",
      },
      contextPayload: {
        primaryDomain: "ads" as const,
        referencedEntities: [
          {
            entityId: "cmp_1",
            entityType: "campaign" as const,
            name: "Zamora - Camila - Phoenix",
          },
        ],
        resolvedRange: {
          preset: "lifetime" as const,
          startDate: "1900-01-01",
          endDate: "2026-04-01",
          timezone: "America/Chicago",
        },
        comparisonSet: [],
        pronounTargets: ["cmp_1"],
      },
      providerResponseId: "resp_final",
    };

    runClientAgentRuntime.mockResolvedValue(runtimeResponse);

    const input = {
      history: [],
      message: "how much have we spent and made",
      scope: {
        clientId: "client_1",
        clientMemberId: "member_1",
        clientSlug: "zamora",
        allowedCampaignIds: null,
        allowedEventIds: null,
        eventsEnabled: true,
        viewer: "member" as const,
      },
      scopeSummary: {
        clientSlug: "zamora",
        eventsEnabled: true,
      },
    };

    const result = await generateClientAgentModelResponse(input);

    expect(runClientAgentRuntime).toHaveBeenCalledWith(input);
    expect(result).toEqual(runtimeResponse);
  });
});
