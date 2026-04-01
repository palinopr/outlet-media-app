import { beforeEach, describe, expect, it, vi } from "vitest";

const ledgerState = vi.hoisted(() => ({
  recorded: [] as Array<Record<string, unknown>>,
  reusable: null as null | { checkout_url: string },
}));

const browserState = vi.hoisted(() => ({
  result: {
    checkoutUrl: "https://auth.ticketmaster.com/as/authorization.oauth2?TMUO=abc",
    status: "checkout_ready" as const,
  } as
    | {
        checkoutUrl: string;
        status: "checkout_ready";
      }
    | {
        reason: "selected_seats_unavailable";
        status: "inventory_changed";
      },
}));

vi.mock("./option-ledger", () => ({
  getReusableCheckoutAttempt: vi.fn(async () => ledgerState.reusable),
  recordCheckoutAttempt: vi.fn(async (payload: Record<string, unknown>) => {
    ledgerState.recorded.push(payload);
    return payload;
  }),
}));

vi.mock("./ticketmaster-browser", () => ({
  captureTicketmasterCheckout: vi.fn(async () => browserState.result),
}));

import { executeConciergeCheckout } from "./checkout-executor";

describe("executeConciergeCheckout", () => {
  beforeEach(() => {
    ledgerState.recorded = [];
    ledgerState.reusable = null;
    browserState.result = {
      checkoutUrl: "https://auth.ticketmaster.com/as/authorization.oauth2?TMUO=abc",
      status: "checkout_ready",
    };
  });

  const option = {
    execution: {
      eventUrl: "https://www.ticketmaster.com/example-event",
      quantity: 2,
      source: "ticketmaster_browser",
      ticketListLabel: "Sec 323 • Row 11 Verified Resale Ticket $196.35",
    },
    id: "opt_1",
    isUnderBudget: false,
    label: "Option 1",
    mapSvg: "<svg />",
    mapToken: "map_1",
    note: "Closest available",
    ordinal: 1 as const,
    quantity: 2,
    quoteSource: "exact" as const,
    row: "11",
    seatLabels: [],
    section: "323",
    totalCents: 39270,
  };

  it("reuses an existing checkout link before opening the browser again", async () => {
    ledgerState.reusable = {
      checkout_url: "https://auth.ticketmaster.com/as/authorization.oauth2?TMUO=reuse",
    };

    await expect(
      executeConciergeCheckout({
        chromeDebugUrl: "http://127.0.0.1:9222",
        option,
      }),
    ).resolves.toEqual({
      checkoutUrl: "https://auth.ticketmaster.com/as/authorization.oauth2?TMUO=reuse",
      status: "checkout_ready",
    });

    expect(ledgerState.recorded).toEqual([]);
  });

  it("records a successful checkout capture in the ledger", async () => {
    await expect(
      executeConciergeCheckout({
        chromeDebugUrl: "http://127.0.0.1:9222",
        option,
      }),
    ).resolves.toEqual({
      checkoutUrl: "https://auth.ticketmaster.com/as/authorization.oauth2?TMUO=abc",
      status: "checkout_ready",
    });

    expect(ledgerState.recorded).toEqual([
      {
        checkoutUrl: "https://auth.ticketmaster.com/as/authorization.oauth2?TMUO=abc",
        failureReason: null,
        optionId: "opt_1",
        status: "checkout_ready",
      },
    ]);
  });

  it("records inventory loss without pretending a checkout link exists", async () => {
    browserState.result = {
      reason: "selected_seats_unavailable",
      status: "inventory_changed",
    };

    await expect(
      executeConciergeCheckout({
        chromeDebugUrl: "http://127.0.0.1:9222",
        option,
      }),
    ).resolves.toEqual({
      reason: "selected_seats_unavailable",
      status: "inventory_changed",
    });

    expect(ledgerState.recorded).toEqual([
      {
        checkoutUrl: null,
        failureReason: "selected_seats_unavailable",
        optionId: "opt_1",
        status: "inventory_changed",
      },
    ]);
  });
});
