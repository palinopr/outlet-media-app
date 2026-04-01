import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  clickedLabel: null as string | null,
  closed: false,
  connectEndpoints: [] as string[],
  currentUrl: "",
  devToolsActivePort: "9222\n/devtools/browser/test-browser-id\n",
  failHttpDiscovery: false,
  labels: [] as string[],
  lastGoto: null as string | null,
  nextUrl: "",
  selectedQuantityLabel: null as string | null,
}));

vi.mock("node:fs/promises", () => ({
  default: {
    readFile: vi.fn(async () => state.devToolsActivePort),
  },
  readFile: vi.fn(async () => state.devToolsActivePort),
}));

vi.mock("playwright-core", () => {
  const page = {
    async goto(url: string) {
      state.lastGoto = url;
      state.currentUrl = url;
    },
    getByRole(role: string, options?: { name?: string }) {
      if (role === "combobox" && options?.name === "Quantity") {
        return {
          async selectOption(value: { label?: string }) {
            state.selectedQuantityLabel = value.label ?? null;
          },
        };
      }

      if (role === "menuitem") {
        return {
          async click() {
            state.clickedLabel = options?.name ?? null;
          },
        };
      }

      if (role === "button" && options?.name === "Next") {
        return {
          async waitFor() {
            return;
          },
          async click() {
            state.currentUrl = state.nextUrl;
          },
        };
      }

      throw new Error(`Unexpected getByRole(${role}, ${JSON.stringify(options)})`);
    },
    locator(selector: string) {
      if (selector !== '[role="menuitem"]') {
        throw new Error(`Unexpected locator selector: ${selector}`);
      }

      return {
        async evaluateAll() {
          return state.labels;
        },
      };
    },
    async waitForURL(pattern: RegExp) {
      if (!pattern.test(state.currentUrl)) {
        throw new Error(`URL ${state.currentUrl} did not match ${pattern}`);
      }
    },
    url() {
      return state.currentUrl;
    },
  };

  const context = {
    async newPage() {
      return page;
    },
    pages() {
      return [];
    },
  };

  const browser = {
    close: vi.fn(async () => {
      state.closed = true;
    }),
    contexts() {
      return [context];
    },
  };

  return {
    chromium: {
      connectOverCDP: vi.fn(async (endpoint: string) => {
        state.connectEndpoints.push(endpoint);
        if (state.failHttpDiscovery && endpoint.startsWith("http://")) {
          throw new Error(
            "browserType.connectOverCDP: Unexpected status 404 when connecting to http://127.0.0.1:9222/json/version/.",
          );
        }

        return browser;
      }),
    },
  };
});

import {
  captureTicketmasterCheckout,
  collectTicketmasterBrowserCandidates,
  parseSubtotalLabel,
  parseTicketListLabel,
} from "./ticketmaster-browser";

describe("parseTicketListLabel", () => {
  it("parses seated ticket-list labels into fee-inclusive totals", () => {
    expect(parseTicketListLabel("Sec 323 • Row 11 Verified Resale Ticket $196.35", 2)).toMatchObject(
      {
        perTicketTotalCents: 19635,
        quantity: 2,
        row: "11",
        section: "323",
        ticketType: "Verified Resale Ticket",
        totalCents: 39270,
      },
    );
  });

  it("parses general admission ticket-list labels", () => {
    expect(parseTicketListLabel("General Admission Verified Resale Ticket $214.20", 2)).toMatchObject(
      {
        perTicketTotalCents: 21420,
        quantity: 2,
        row: null,
        section: "General Admission",
        ticketType: "Verified Resale Ticket",
        totalCents: 42840,
      },
    );
  });

  it("ignores informational menu items that are not tickets", () => {
    expect(parseTicketListLabel("We’re All In: Prices include fees (before taxes).", 2)).toBeNull();
  });
});

describe("parseSubtotalLabel", () => {
  it("parses the quantity-scoped subtotal button label", () => {
    expect(parseSubtotalLabel("SUBTOTAL $392.70 2 Tickets")).toEqual({
      quantity: 2,
      subtotalCents: 39270,
    });
  });
});

describe("ticketmaster browser adapter", () => {
  beforeEach(() => {
    state.clickedLabel = null;
    state.closed = false;
    state.connectEndpoints = [];
    state.currentUrl = "";
    state.devToolsActivePort = "9222\n/devtools/browser/test-browser-id\n";
    state.failHttpDiscovery = false;
    state.labels = [];
    state.lastGoto = null;
    state.nextUrl = "";
    state.selectedQuantityLabel = null;
  });

  it("collects ticket candidates from the consumer ticket list and ignores non-ticket rows", async () => {
    state.labels = [
      "We’re All In: Prices include fees (before taxes).",
      "Sec 323 • Row 11 Verified Resale Ticket $196.35",
      "Sec 108 • Row 8 Standard Admission $251.65",
    ];

    await expect(
      collectTicketmasterBrowserCandidates({
        chromeDebugUrl: "http://127.0.0.1:9222",
        eventUrl: "https://www.ticketmaster.com/example-event",
        quantity: 2,
      }),
    ).resolves.toEqual([
      expect.objectContaining({
        execution: expect.objectContaining({
          eventUrl: "https://www.ticketmaster.com/example-event",
          quantity: 2,
          ticketListLabel: "Sec 323 • Row 11 Verified Resale Ticket $196.35",
        }),
        perTicketTotalCents: 19635,
        row: "11",
        section: "323",
        totalCents: 39270,
      }),
      expect.objectContaining({
        perTicketTotalCents: 25165,
        row: "8",
        section: "108",
        totalCents: 50330,
      }),
    ]);

    expect(state.lastGoto).toBe("https://www.ticketmaster.com/example-event");
    expect(state.selectedQuantityLabel).toBe("2 Tickets");
    expect(state.closed).toBe(true);
  });

  it("captures a checkout URL for a chosen ticket-list option", async () => {
    state.labels = ["Sec 323 • Row 11 Verified Resale Ticket $196.35"];
    state.nextUrl = "https://auth.ticketmaster.com/as/authorization.oauth2?TMUO=abc";

    await expect(
      captureTicketmasterCheckout({
        chromeDebugUrl: "http://127.0.0.1:9222",
        eventUrl: "https://www.ticketmaster.com/example-event",
        quantity: 2,
        ticketListLabel: "Sec 323 • Row 11 Verified Resale Ticket $196.35",
      }),
    ).resolves.toEqual({
      checkoutUrl: "https://auth.ticketmaster.com/as/authorization.oauth2?TMUO=abc",
      status: "checkout_ready",
    });

    expect(state.clickedLabel).toBe("Sec 323 • Row 11 Verified Resale Ticket $196.35");
    expect(state.closed).toBe(true);
  });

  it("falls back to the DevToolsActivePort websocket when HTTP discovery is unavailable", async () => {
    state.failHttpDiscovery = true;
    state.labels = ["Sec 323 • Row 11 Verified Resale Ticket $196.35"];

    await collectTicketmasterBrowserCandidates({
      chromeDebugUrl: "http://127.0.0.1:9222",
      eventUrl: "https://www.ticketmaster.com/example-event",
      quantity: 2,
    });

    expect(state.connectEndpoints).toEqual([
      "http://127.0.0.1:9222",
      "ws://127.0.0.1:9222/devtools/browser/test-browser-id",
    ]);
  });

  it("returns inventory_changed when the chosen option is gone before checkout", async () => {
    state.labels = ["Sec 108 • Row 8 Standard Admission $251.65"];

    await expect(
      captureTicketmasterCheckout({
        chromeDebugUrl: "http://127.0.0.1:9222",
        eventUrl: "https://www.ticketmaster.com/example-event",
        quantity: 2,
        ticketListLabel: "Sec 323 • Row 11 Verified Resale Ticket $196.35",
      }),
    ).resolves.toEqual({
      reason: "selected_seats_unavailable",
      status: "inventory_changed",
    });
  });
});
