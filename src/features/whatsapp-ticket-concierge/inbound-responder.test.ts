import { beforeEach, describe, expect, it, vi } from "vitest";

import type { TicketConciergePreparedOption } from "./types";
import {
  handleTicketConciergeInbound,
  type TicketConciergeResponderDeps,
} from "./inbound-responder";

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
  overrides: Partial<TicketConciergeResponderDeps> = {},
): TicketConciergeResponderDeps {
  return {
    getSecurityDisposition: vi.fn(async () => ({ allowed: true, banned: false })),
    runSellerTurn: vi.fn(async () => ({
      body: "Default reply",
      kind: "text" as const,
    })),
    sendText: vi.fn(async () => ({ conversationId: "conv_1", messageId: "out_1" })),
    ...overrides,
  };
}

describe("handleTicketConciergeInbound", () => {
  const conversation = {
    id: "conv_1",
    metadata: {
      automationRoute: "ticket_concierge",
      conciergeAllowed: true,
      scenarioKey: "zamora_arjona_miami_v1",
    },
  };

  const contact = {
    id: "contact_1",
    profile_name: "Jaime",
    wa_id: "13055551212",
  };

  const message = {
    messageId: "provider_msg_1",
    textBody: "[zamora-miami] I need 2 tickets for Arjona under $300",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("delivers prepared options as WhatsApp media messages plus the reply hint", async () => {
    const deps = buildDeps({
      runSellerTurn: vi.fn(async () => ({
        introText: "Perfecto, te paso tres opciones para Ricardo Arjona en Miami.",
        kind: "prepared_options" as const,
        options: [
          buildOption({ id: "opt_1", label: "Option 1", mapToken: "map_1", ordinal: 1, totalCents: 28600 }),
          buildOption({
            id: "opt_2",
            label: "Option 2",
            mapToken: "map_2",
            note: "Closer to stage",
            ordinal: 2,
            row: "L",
            section: "115",
            totalCents: 29400,
          }),
          buildOption({
            id: "opt_3",
            isUnderBudget: false,
            label: "Option 3",
            mapToken: "map_3",
            note: "Closest over budget",
            ordinal: 3,
            row: "A",
            section: "209",
            totalCents: 30600,
          }),
        ],
      })),
    });

    await expect(
      handleTicketConciergeInbound(
        {
          appBaseUrl: "https://app.test",
          contact,
          conversation,
          latestInboundMessageId: "db_msg_1",
          message,
        },
        deps,
      ),
    ).resolves.toEqual({ handled: true });

    expect(deps.runSellerTurn).toHaveBeenCalledWith({
      contact,
      conversation,
      latestInboundMessageId: "db_msg_1",
      message,
    });
    expect(deps.sendText).toHaveBeenCalledTimes(5);
    expect(vi.mocked(deps.sendText).mock.calls[0]?.[0]).toMatchObject({
      body: "Perfecto, te paso tres opciones para Ricardo Arjona en Miami.",
      conversationId: "conv_1",
      replyToMessageId: "provider_msg_1",
    });
    expect(vi.mocked(deps.sendText).mock.calls[1]?.[0]).toMatchObject({
      body: expect.stringContaining("Option 1"),
      conversationId: "conv_1",
      mediaUrl: "https://app.test/api/whatsapp/concierge/maps/map_1",
    });
    expect(vi.mocked(deps.sendText).mock.calls[1]?.[0]?.body).not.toContain("Perfecto, te paso tres opciones");
    expect(vi.mocked(deps.sendText).mock.calls[1]?.[0]?.body).not.toContain("Map:");
    expect(vi.mocked(deps.sendText).mock.calls[4]?.[0]?.body).toContain("Reply 1, 2, or 3");
  });

  it("sends a plain text checkout response when the seller turn returns text", async () => {
    const deps = buildDeps({
      runSellerTurn: vi.fn(async () => ({
        body: "Aqui tienes tu link para pagar: https://auth.ticketmaster.com/as/authorization.oauth2?TMUO=abc",
        kind: "text" as const,
      })),
    });

    await expect(
      handleTicketConciergeInbound(
        {
          appBaseUrl: "https://app.test",
          contact,
          conversation,
          latestInboundMessageId: "db_msg_2",
          message: {
            messageId: "provider_msg_2",
            textBody: "2",
          },
        },
        deps,
      ),
    ).resolves.toEqual({ handled: true });

    expect(deps.sendText).toHaveBeenCalledTimes(1);
    expect(deps.sendText).toHaveBeenCalledWith({
      approved: true,
      body: "Aqui tienes tu link para pagar: https://auth.ticketmaster.com/as/authorization.oauth2?TMUO=abc",
      conversationId: "conv_1",
      replyToMessageId: "provider_msg_2",
    });
  });

  it("hard-blocks already banned numbers without sending a response", async () => {
    const deps = buildDeps({
      getSecurityDisposition: vi.fn(async () => ({ allowed: false, banned: true })),
    });

    await expect(
      handleTicketConciergeInbound(
        {
          appBaseUrl: "https://app.test",
          contact,
          conversation,
          latestInboundMessageId: "db_msg_4",
          message,
        },
        deps,
      ),
    ).resolves.toEqual({ handled: true });

    expect(deps.runSellerTurn).not.toHaveBeenCalled();
    expect(deps.sendText).not.toHaveBeenCalled();
  });
});
