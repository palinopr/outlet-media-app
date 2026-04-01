import { describe, expect, it } from "vitest";

import { getTicketConciergeConfig } from "./config";

describe("getTicketConciergeConfig", () => {
  it("returns the concierge contract with chrome debug injection", () => {
    expect(getTicketConciergeConfig()).toMatchObject({
      enabled: false,
      optionTtlSeconds: 300,
      chromeDebugUrl: "http://127.0.0.1:9222",
      scenarios: [
        expect.objectContaining({
          key: "zamora_arjona_miami_v1",
          clientSlug: "zamora",
          entryTokens: ["[zamora-miami]"],
          allowlist: {
            conversationIds: [],
            waIds: [],
          },
          eventContext: expect.objectContaining({
            artist: "Ricardo Arjona",
            city: "Miami",
          }),
        }),
      ],
    });
  });
});
