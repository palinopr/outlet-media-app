import { beforeEach, describe, expect, it, vi } from "vitest";

const ledgerState = vi.hoisted(() => ({
  recorded: [] as Array<Record<string, unknown>>,
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
  recordCheckoutAttempt: vi.fn(async (payload: Record<string, unknown>) => {
    ledgerState.recorded.push(payload);
    return payload;
  }),
}));

vi.mock("./ticketmaster-browser", () => ({
  captureTicketmasterCheckout: vi.fn(async () => browserState.result),
}));

vi.mock("./bitly", () => ({
  shortenBitlyUrl: vi.fn(async (url: string) => `https://bit.ly/${url.includes("TMUO=abc") ? "abc123" : "other"}`),
}));

import { executeConciergeCheckout } from "./checkout-executor";

describe("executeConciergeCheckout", () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(() => {
    ledgerState.recorded = [];
    browserState.result = {
      checkoutUrl: "https://auth.ticketmaster.com/as/authorization.oauth2?TMUO=abc",
      status: "checkout_ready",
    };
    process.env = {
      ...ORIGINAL_ENV,
      INGEST_SECRET: "test-ingest-secret",
      NEXT_PUBLIC_APP_URL: "https://www.outletmedia.net",
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

  it("captures a fresh checkout even when a prior checkout attempt exists", async () => {
    const result = await executeConciergeCheckout({
      chromeDebugUrl: "http://127.0.0.1:9222",
      option,
    });

    expect(result.status).toBe("checkout_ready");
    if (result.status !== "checkout_ready") {
      throw new Error("expected checkout_ready");
    }
    expect(result.checkoutUrl).toMatch(/^https:\/\/www\.outletmedia\.net\/checkout\//);
    expect(ledgerState.recorded).toEqual([
      {
        checkoutUrl: "https://auth.ticketmaster.com/as/authorization.oauth2?TMUO=abc",
        failureReason: null,
        optionId: "opt_1",
        status: "checkout_ready",
      },
    ]);
  });

  it("records a successful checkout capture in the ledger", async () => {
    const result = await executeConciergeCheckout({
      chromeDebugUrl: "http://127.0.0.1:9222",
      option,
    });

    expect(result.status).toBe("checkout_ready");
    if (result.status !== "checkout_ready") {
      throw new Error("expected checkout_ready");
    }
    expect(result.checkoutUrl).toMatch(/^https:\/\/www\.outletmedia\.net\/checkout\//);

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
