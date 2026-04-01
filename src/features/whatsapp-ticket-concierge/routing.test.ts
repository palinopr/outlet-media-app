import { describe, expect, it } from "vitest";

import type { TicketConciergeScenario } from "./config";
import {
  applyTicketConciergeConversationMetadata,
  isAllowedTicketConciergeTarget,
  matchTicketConciergeScenario,
  shouldQueueDiscordTriage,
} from "./routing";

const scenario: TicketConciergeScenario = {
  allowlist: {
    conversationIds: ["conv_1"],
    waIds: ["13055551212"],
  },
  clientSlug: "zamora",
  entryTokens: ["[zamora-miami]"],
  eventContext: {
    artist: "Ricardo Arjona",
    city: "Miami",
    date: "2026-04-02",
    eventId: "0D0062FF195A626B",
    eventUrl: "",
  },
  key: "zamora_arjona_miami_v1",
};

describe("matchTicketConciergeScenario", () => {
  it("matches a scenario token in the inbound body", () => {
    expect(
      matchTicketConciergeScenario({
        body: "[zamora-miami] I need 2 tickets under $300",
        conversationMetadata: {},
        scenario,
      }),
    ).toMatchObject({ kind: "scenario", scenarioKey: "zamora_arjona_miami_v1" });
  });

  it("keeps routing an already tagged conversation", () => {
    expect(
      matchTicketConciergeScenario({
        body: "hi",
        conversationMetadata: {
          automationRoute: "ticket_concierge",
          scenarioKey: "zamora_arjona_miami_v1",
        },
        scenario,
      }),
    ).toMatchObject({ kind: "conversation", scenarioKey: "zamora_arjona_miami_v1" });
  });

  it("returns null when neither the token nor conversation tag matches", () => {
    expect(
      matchTicketConciergeScenario({
        body: "hello there",
        conversationMetadata: {},
        scenario,
      }),
    ).toBeNull();
  });
});

describe("isAllowedTicketConciergeTarget", () => {
  it("allows a conversation explicitly allowlisted by id", () => {
    expect(
      isAllowedTicketConciergeTarget({
        conversationId: "conv_1",
        scenario: {
          ...scenario,
          allowlist: { conversationIds: ["conv_1"], waIds: [] },
        },
        waId: "13055551212",
      }),
    ).toBe(true);
  });

  it("blocks a conversation outside both allowlists", () => {
    expect(
      isAllowedTicketConciergeTarget({
        conversationId: "conv_9",
        scenario,
        waId: "13055559999",
      }),
    ).toBe(false);
  });
});

describe("applyTicketConciergeConversationMetadata", () => {
  it("merges the concierge route metadata into the existing conversation metadata", () => {
    expect(
      applyTicketConciergeConversationMetadata(
        {
          chat: { kind: "direct" },
          existingKey: "keep-me",
        },
        {
          kind: "scenario",
          scenarioKey: "zamora_arjona_miami_v1",
        },
      ),
    ).toEqual({
      automationRoute: "ticket_concierge",
      chat: { kind: "direct" },
      conciergeAllowed: true,
      existingKey: "keep-me",
      scenarioKey: "zamora_arjona_miami_v1",
    });
  });
});

describe("shouldQueueDiscordTriage", () => {
  it("skips Discord triage for allowlisted concierge conversations", () => {
    expect(
      shouldQueueDiscordTriage({
        automationRoute: "ticket_concierge",
        conciergeAllowed: true,
      }),
    ).toBe(false);
  });

  it("keeps Discord triage enabled for all other conversations", () => {
    expect(
      shouldQueueDiscordTriage({
        automationRoute: "ticket_concierge",
        conciergeAllowed: false,
      }),
    ).toBe(true);
  });
});
