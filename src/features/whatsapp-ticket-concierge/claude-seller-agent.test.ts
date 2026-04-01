import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  runTicketConciergeSellerTurn,
  type TicketConciergeSellerAgentDeps,
} from "./claude-seller-agent";
import type { TicketConciergePreparedOption } from "./types";

function buildOption(overrides: Partial<TicketConciergePreparedOption>): TicketConciergePreparedOption {
  return {
    execution: {
      eventUrl:
        "https://www.ticketmaster.com/ricardo-arjona-lo-que-el-seco-miami-florida-04-02-2026/event/0D0062FF195A626B",
      quantity: 2,
      source: "ticketmaster_browser",
      ticketListLabel: "Sec 114 • Row K Standard Admission $149.00",
    },
    id: "opt_1",
    isUnderBudget: true,
    label: "Option 1",
    mapSvg: "<svg />",
    mapToken: "map_1",
    note: "Best value",
    ordinal: 1,
    quantity: 2,
    quoteSource: "exact",
    row: "K",
    seatLabels: ["7", "8"],
    section: "114",
    totalCents: 28600,
    ...overrides,
  };
}

function buildDeps(
  overrides: Partial<TicketConciergeSellerAgentDeps> = {},
): TicketConciergeSellerAgentDeps {
  return {
    createOptionSet: vi.fn(async () => ({
      id: "set_1",
      options: [
        buildOption({ id: "opt_1", label: "Option 1", ordinal: 1 }),
        buildOption({ id: "opt_2", label: "Option 2", mapToken: "map_2", ordinal: 2 }),
        buildOption({ id: "opt_3", label: "Option 3", mapToken: "map_3", ordinal: 3 }),
      ],
      status: "active",
    })),
    createRun: vi.fn(async () => ({ id: "run_1" })),
    expireOptionSet: vi.fn(async () => undefined),
    getActiveOptionSetSelectionSnapshot: vi.fn(async () => null),
    prepareStructuredSelection: vi.fn(async () => ({
      eventContext: {
        artist: "Ricardo Arjona",
        city: "Miami",
        date: "2026-04-02",
        eventId: "0D0062FF195A626B",
        eventUrl:
          "https://www.ticketmaster.com/ricardo-arjona-lo-que-el-seco-miami-florida-04-02-2026/event/0D0062FF195A626B",
      },
      intent: {
        maxTotalCents: 30000,
        preferences: [],
        quantity: 2,
      },
      options: [
        buildOption({ id: "opt_1", label: "Option 1", ordinal: 1 }),
        buildOption({ id: "opt_2", label: "Option 2", mapToken: "map_2", ordinal: 2 }),
        buildOption({ id: "opt_3", label: "Option 3", mapToken: "map_3", ordinal: 3 }),
      ],
      scenarioKey: "zamora_arjona_miami_v1",
      status: "options_ready" as const,
    })),
    querySellerAgent: vi.fn(async (input) => {
      await input.toolHandlers.prepareOptions({
        maxTotalCents: 30000,
        preferences: [],
        quantity: 2,
      });
      return {
        sessionId: "sess_new",
        text: "Perfecto, te paso tres opciones para Ricardo Arjona en Miami.",
      };
    }),
    replaceActiveOptionSet: vi.fn(async () => ({
      id: "set_1",
      options: [],
      status: "active",
    })),
    runCheckout: vi.fn(async () => ({
      checkoutUrl: "https://auth.ticketmaster.com/as/authorization.oauth2?TMUO=abc",
      status: "checkout_ready" as const,
    })),
    selectOption: vi.fn(async () => undefined),
    updateConversationMetadata: vi.fn(async () => undefined),
    updateRunState: vi.fn(async () => undefined),
    ...overrides,
  };
}

describe("runTicketConciergeSellerTurn", () => {
  const contact = {
    id: "contact_1",
    profile_name: "Jaime",
    wa_id: "13055551212",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("captures the Claude session id, stores it on the conversation, and returns prepared options", async () => {
    const deps = buildDeps();

    const result = await runTicketConciergeSellerTurn(
      {
        contact,
        conversation: {
          id: "conv_1",
          metadata: {
            automationRoute: "ticket_concierge",
            conciergeAllowed: true,
            scenarioKey: "zamora_arjona_miami_v1",
          },
        },
        latestInboundMessageId: "db_msg_1",
        message: {
          messageId: "provider_msg_1",
          textBody: "Necesito 2 tickets por menos de $300 total",
        },
      },
      deps,
    );

    expect(deps.querySellerAgent).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: "Necesito 2 tickets por menos de $300 total",
        resumeSessionId: null,
      }),
    );
    expect(deps.updateConversationMetadata).toHaveBeenCalledWith(
      "conv_1",
      expect.objectContaining({
        ticketConciergeSeller: expect.objectContaining({
          claudeSessionId: "sess_new",
          language: "es",
        }),
      }),
    );
    expect(result).toMatchObject({
      introText: "Perfecto, te paso tres opciones para Ricardo Arjona en Miami.",
      kind: "prepared_options",
    });
    expect(result.kind === "prepared_options" ? result.options : []).toHaveLength(3);
  });

  it("turns a numeric reply into checkout without waiting on the seller model", async () => {
    const deps = buildDeps({
      getActiveOptionSetSelectionSnapshot: vi.fn(async () => ({
        optionSet: {
          conversationId: "conv_1",
          expiresAt: "2099-04-01T00:05:00.000Z",
          id: "set_1",
          runId: "run_1",
          selectedOptionId: null,
          status: "active" as const,
        },
        options: [
          buildOption({ id: "opt_1", label: "Option 1", ordinal: 1 }),
          buildOption({ id: "opt_2", label: "Option 2", mapToken: "map_2", ordinal: 2 }),
          buildOption({ id: "opt_3", label: "Option 3", mapToken: "map_3", ordinal: 3 }),
        ],
        run: {
          customerMessage: "Necesito 2 tickets por menos de $300 total",
          eventContext: {
            city: "Miami",
          },
          id: "run_1",
          intent: {
            maxTotalCents: 30000,
            preferences: [],
            quantity: 2,
          },
          scenarioKey: "zamora_arjona_miami_v1",
          status: "options_sent" as const,
        },
      })),
    });

    const result = await runTicketConciergeSellerTurn(
      {
        contact,
        conversation: {
          id: "conv_1",
          metadata: {
            automationRoute: "ticket_concierge",
            conciergeAllowed: true,
            scenarioKey: "zamora_arjona_miami_v1",
            ticketConciergeSeller: {
              claudeSessionId: "sess_existing",
            },
          },
        },
        latestInboundMessageId: "db_msg_2",
        message: {
          messageId: "provider_msg_2",
          textBody: "2",
        },
      },
      deps,
    );

    expect(deps.querySellerAgent).not.toHaveBeenCalled();
    expect(deps.runCheckout).toHaveBeenCalledWith({
      option: expect.objectContaining({ id: "opt_2", ordinal: 2 }),
    });
    expect(deps.selectOption).toHaveBeenCalledWith({
      optionId: "opt_2",
      optionSetId: "set_1",
    });
    expect(deps.updateConversationMetadata).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      body: expect.stringContaining("https://auth.ticketmaster.com/as/authorization.oauth2?TMUO=abc"),
      kind: "text",
    });
  });

  it("flattens markdown checkout links before returning a WhatsApp reply", async () => {
    const deps = buildDeps({
      getActiveOptionSetSelectionSnapshot: vi.fn(async () => ({
        optionSet: {
          conversationId: "conv_1",
          expiresAt: "2099-04-01T00:05:00.000Z",
          id: "set_1",
          runId: "run_1",
          selectedOptionId: null,
          status: "active" as const,
        },
        options: [
          buildOption({ id: "opt_1", label: "Option 1", ordinal: 1 }),
          buildOption({ id: "opt_2", label: "Option 2", mapToken: "map_2", ordinal: 2 }),
          buildOption({ id: "opt_3", label: "Option 3", mapToken: "map_3", ordinal: 3 }),
        ],
        run: {
          customerMessage: "Necesito 2 tickets por menos de $300 total",
          eventContext: {
            city: "Miami",
          },
          id: "run_1",
          intent: {
            maxTotalCents: 30000,
            preferences: [],
            quantity: 2,
          },
          scenarioKey: "zamora_arjona_miami_v1",
          status: "options_sent" as const,
        },
      })),
      querySellerAgent: vi.fn(async (input) => {
        await input.toolHandlers.choosePreparedOption({ optionOrdinal: 2 });
        return {
          sessionId: "sess_existing",
          text: "Aqui tienes tu link:\n[Comprar en Ticketmaster](https://auth.ticketmaster.com/as/authorization.oauth2?TMUO=abc)",
        };
      }),
    });

    const result = await runTicketConciergeSellerTurn(
      {
        contact,
        conversation: {
          id: "conv_1",
          metadata: {
            automationRoute: "ticket_concierge",
            conciergeAllowed: true,
            scenarioKey: "zamora_arjona_miami_v1",
            ticketConciergeSeller: {
              claudeSessionId: "sess_existing",
              language: "es",
            },
          },
        },
        latestInboundMessageId: "db_msg_3",
        message: {
          messageId: "provider_msg_3",
          textBody: "Mandame el link otra vez",
        },
      },
      deps,
    );

    expect(result).toMatchObject({ kind: "text" });
    if (result.kind !== "text") {
      throw new Error("expected text result");
    }
    expect(result.body).toContain("Comprar en Ticketmaster\nhttps://auth.ticketmaster.com/as/authorization.oauth2?TMUO=abc");
    expect(result.body).not.toContain("[Comprar en Ticketmaster](");
  });

  it("refreshes fresh options when a direct numeric pick hits inventory_changed", async () => {
    const options = [
      buildOption({ id: "opt_1", label: "Option 1", ordinal: 1 }),
      buildOption({ id: "opt_2", label: "Option 2", mapToken: "map_2", ordinal: 2 }),
      buildOption({ id: "opt_3", label: "Option 3", mapToken: "map_3", ordinal: 3 }),
    ];
    const deps = buildDeps({
      getActiveOptionSetSelectionSnapshot: vi.fn(async () => ({
        optionSet: {
          conversationId: "conv_1",
          expiresAt: "2099-04-01T00:05:00.000Z",
          id: "set_1",
          runId: "run_1",
          selectedOptionId: null,
          status: "active" as const,
        },
        options,
        run: {
          customerMessage: "Necesito 2 tickets por menos de $300 total",
          eventContext: {
            city: "Miami",
          },
          id: "run_1",
          intent: {
            maxTotalCents: 30000,
            preferences: [],
            quantity: 2,
          },
          scenarioKey: "zamora_arjona_miami_v1",
          status: "options_sent" as const,
        },
      })),
      replaceActiveOptionSet: vi.fn(async () => ({
        id: "set_2",
        options,
        status: "active",
      })),
      runCheckout: vi.fn(async () => ({
        reason: "selected_seats_unavailable",
        status: "inventory_changed" as const,
      })),
    });

    const result = await runTicketConciergeSellerTurn(
      {
        contact,
        conversation: {
          id: "conv_1",
          metadata: {
            automationRoute: "ticket_concierge",
            conciergeAllowed: true,
            scenarioKey: "zamora_arjona_miami_v1",
            ticketConciergeSeller: {
              claudeSessionId: "sess_existing",
            },
          },
        },
        latestInboundMessageId: "db_msg_3",
        message: {
          messageId: "provider_msg_3",
          textBody: "1",
        },
      },
      deps,
    );

    expect(deps.querySellerAgent).not.toHaveBeenCalled();
    expect(deps.runCheckout).toHaveBeenCalledWith({
      option: expect.objectContaining({ id: "opt_1", ordinal: 1 }),
    });
    expect(deps.prepareStructuredSelection).toHaveBeenCalledWith({
      conversationMetadata: expect.objectContaining({
        automationRoute: "ticket_concierge",
        conciergeAllowed: true,
        scenarioKey: "zamora_arjona_miami_v1",
      }),
      intent: {
        maxTotalCents: 30000,
        preferences: [],
        quantity: 2,
      },
    });
    expect(result).toMatchObject({
      introText: expect.stringContaining("opciones nuevas"),
      kind: "prepared_options",
    });
    expect(result.kind === "prepared_options" ? result.options : []).toHaveLength(3);
  });

  it("injects a turn-level state refresh when resuming without active options", async () => {
    const deps = buildDeps({
      querySellerAgent: vi.fn(async (input) => {
        expect(input.resumeSessionId).toBe("sess_existing");
        expect(input.prompt).toContain("[State refresh for this turn]");
        expect(input.prompt).toContain("There are currently no active prepared options.");
        expect(input.prompt).toContain("Any earlier quoted option, section, or price is expired and invalid");
        expect(input.prompt).toContain("You must call prepare_options on this turn before answering.");
        expect(input.prompt).toContain("[Customer message]");
        expect(input.prompt).toContain("Necesito 2 tickets para Arjona por menos de 300 total");
        return {
          sessionId: "sess_existing",
          text: "Claro, voy a buscar opciones nuevas ahora mismo.",
        };
      }),
    });

    const result = await runTicketConciergeSellerTurn(
      {
        contact,
        conversation: {
          id: "conv_1",
          metadata: {
            automationRoute: "ticket_concierge",
            conciergeAllowed: true,
            scenarioKey: "zamora_arjona_miami_v1",
            ticketConciergeSeller: {
              claudeSessionId: "sess_existing",
            },
          },
        },
        latestInboundMessageId: "db_msg_3",
        message: {
          messageId: "provider_msg_3",
          textBody: "Necesito 2 tickets para Arjona por menos de 300 total",
        },
      },
      deps,
    );

    expect(result).toMatchObject({
      body: "Claro, voy a buscar opciones nuevas ahora mismo.",
      kind: "text",
    });
  });

  it("switches the stored seller language to English when the customer clearly switches languages", async () => {
    const deps = buildDeps({
      querySellerAgent: vi.fn(async () => ({
        sessionId: "sess_existing",
        text: "I can pull three fresh options for you right now.",
      })),
    });

    await runTicketConciergeSellerTurn(
      {
        contact,
        conversation: {
          id: "conv_1",
          metadata: {
            automationRoute: "ticket_concierge",
            conciergeAllowed: true,
            scenarioKey: "zamora_arjona_miami_v1",
            ticketConciergeSeller: {
              claudeSessionId: "sess_existing",
              language: "es",
            },
          },
        },
        latestInboundMessageId: "db_msg_4",
        message: {
          messageId: "provider_msg_4",
          textBody: "I need 2 tickets for Arjona under $300 total",
        },
      },
      deps,
    );

    expect(deps.updateConversationMetadata).toHaveBeenCalledWith(
      "conv_1",
      expect.objectContaining({
        ticketConciergeSeller: expect.objectContaining({
          claudeSessionId: "sess_existing",
          language: "en",
        }),
      }),
    );
  });
});
