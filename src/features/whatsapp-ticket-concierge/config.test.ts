import { afterEach, describe, expect, it } from "vitest";

import { getTicketConciergeConfig } from "./config";

const ORIGINAL_ENV = { ...process.env };

describe("getTicketConciergeConfig", () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("applies environment overrides for enablement and allowlists", () => {
    process.env.WHATSAPP_TICKET_CONCIERGE_ENABLED = "true";
    process.env.WHATSAPP_TICKET_CONCIERGE_ALLOWLIST_CONVERSATION_IDS = "conv_1,conv_2";
    process.env.WHATSAPP_TICKET_CONCIERGE_ALLOWLIST_WA_IDS = "13055551212,13055550000";

    const config = getTicketConciergeConfig();

    expect(config.enabled).toBe(true);
    expect(config.scenarios[0]?.allowlist.conversationIds).toEqual(["conv_1", "conv_2"]);
    expect(config.scenarios[0]?.allowlist.waIds).toEqual([
      "13055551212",
      "13055550000",
    ]);
  });
});
