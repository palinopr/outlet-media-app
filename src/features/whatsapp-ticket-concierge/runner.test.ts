import { describe, expect, it, vi } from "vitest";

vi.mock("./ticketmaster-browser", () => ({
  collectTicketmasterBrowserCandidates: vi.fn(async () => []),
}));

vi.mock("./option-preparer", () => ({
  prepareTicketConciergeOptions: vi.fn(() => []),
}));

vi.mock("./checkout-executor", () => ({
  executeConciergeCheckout: vi.fn(async () => ({
    checkoutUrl: "https://auth.ticketmaster.com/as/authorization.oauth2?TMUO=abc",
    status: "checkout_ready",
  })),
}));

import { executeConciergeCheckout } from "./checkout-executor";
import { prepareTicketConciergeOptions } from "./option-preparer";
import { collectTicketmasterBrowserCandidates } from "./ticketmaster-browser";
import { prepareConciergeSelection, runPreparedConciergeCheckout } from "./runner";

describe("prepareConciergeSelection", () => {
  it("resolves context, parses intent, and returns prepared options", async () => {
    vi.mocked(collectTicketmasterBrowserCandidates).mockResolvedValueOnce([
      {
        execution: {
          eventUrl:
            "https://www.ticketmaster.com/ricardo-arjona-lo-que-el-seco-miami-florida-04-02-2026/event/0D0062FF195A626B",
          quantity: 2,
          source: "ticketmaster_browser",
          ticketListLabel: "Sec 114 • Row K Standard Admission $149.00",
        },
        perTicketTotalCents: 14900,
        quantity: 2,
        rawLabel: "Sec 114 • Row K Standard Admission $149.00",
        row: "K",
        section: "114",
        ticketType: "Standard Admission",
        totalCents: 29800,
      },
    ]);
    vi.mocked(prepareTicketConciergeOptions).mockReturnValueOnce([
      {
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
        seatLabels: [],
        section: "114",
        totalCents: 29800,
      },
    ]);

    await expect(
      prepareConciergeSelection({
        body: "[zamora-miami] I need 2 tickets for Zamora under $300",
        conversationMetadata: {},
      }),
    ).resolves.toMatchObject({
      eventContext: {
        artist: "Ricardo Arjona",
        city: "Miami",
        eventId: "0D0062FF195A626B",
      },
      intent: {
        maxTotalCents: 30000,
        preferences: [],
        quantity: 2,
      },
      options: [
        expect.objectContaining({
          id: "opt_1",
          label: "Option 1",
        }),
      ],
      scenarioKey: "zamora_arjona_miami_v1",
      status: "options_ready",
    });
  });

  it("returns needs_clarification when the message does not specify quantity", async () => {
    await expect(
      prepareConciergeSelection({
        body: "[zamora-miami] need tickets under $300",
        conversationMetadata: {},
      }),
    ).resolves.toEqual({
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
      },
      missing: ["quantity"],
      scenarioKey: "zamora_arjona_miami_v1",
      status: "needs_clarification",
    });
  });

  it("returns no_inventory when the browser collector finds no viable candidates", async () => {
    vi.mocked(collectTicketmasterBrowserCandidates).mockResolvedValueOnce([]);

    await expect(
      prepareConciergeSelection({
        body: "[zamora-miami] I need 2 tickets for Zamora under $300",
        conversationMetadata: {},
      }),
    ).resolves.toMatchObject({
      reason: "no_viable_options",
      status: "no_inventory",
    });
  });
});

describe("runPreparedConciergeCheckout", () => {
  it("delegates the prepared option to the checkout executor", async () => {
    await expect(
      runPreparedConciergeCheckout({
        option: {
          execution: {
            eventUrl: "https://www.ticketmaster.com/example-event",
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
          seatLabels: [],
          section: "114",
          totalCents: 29800,
        },
      }),
    ).resolves.toEqual({
      checkoutUrl: "https://auth.ticketmaster.com/as/authorization.oauth2?TMUO=abc",
      status: "checkout_ready",
    });

    expect(vi.mocked(executeConciergeCheckout)).toHaveBeenCalledWith({
      chromeDebugUrl: "http://127.0.0.1:9222",
      option: expect.objectContaining({ id: "opt_1" }),
    });
  });
});
