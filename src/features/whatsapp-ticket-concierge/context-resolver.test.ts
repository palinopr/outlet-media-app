import { describe, expect, it } from "vitest";

import {
  MissingScenarioContextError,
  resolveTicketConciergeContext,
} from "./context-resolver";

describe("resolveTicketConciergeContext", () => {
  it("strips the entry token and resolves the configured scenario context", () => {
    expect(
      resolveTicketConciergeContext({
        body: "[zamora-miami] I need 2 tickets under $300",
        conversationMetadata: { scenarioKey: "zamora_arjona_miami_v1" },
      }),
    ).toMatchObject({
      eventContext: expect.objectContaining({ city: "Miami" }),
      scenarioKey: "zamora_arjona_miami_v1",
      strippedMessage: "I need 2 tickets under $300",
    });
  });

  it("throws a typed error when no configured scenario matches", () => {
    expect(() =>
      resolveTicketConciergeContext({
        body: "I need tickets",
        conversationMetadata: {},
      }),
    ).toThrow(MissingScenarioContextError);
  });

  it("returns an empty stripped message when the body only contains the entry token", () => {
    expect(
      resolveTicketConciergeContext({
        body: "[zamora-miami]",
        conversationMetadata: {},
      }),
    ).toMatchObject({
      scenarioKey: "zamora_arjona_miami_v1",
      strippedMessage: "",
    });
  });
});
