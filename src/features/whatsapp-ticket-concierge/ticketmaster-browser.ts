import { readFile } from "node:fs/promises";
import path from "node:path";
import { chromium, type Browser, type Page } from "playwright-core";

export interface TicketmasterBrowserCandidate {
  execution: {
    eventUrl: string;
    quantity: number;
    source: "ticketmaster_browser";
    ticketListLabel: string;
  };
  perTicketTotalCents: number;
  quantity: number;
  rawLabel: string;
  row: string | null;
  section: string;
  ticketType: string;
  totalCents: number;
}

export type TicketmasterCheckoutResult =
  | {
      checkoutUrl: string;
      status: "checkout_ready";
    }
  | {
      reason: "selected_seats_unavailable";
      status: "inventory_changed";
    }
  | {
      reason: string;
      status: "lookup_failed";
    };

function parseUsdToCents(value: string): number {
  const normalized = value.replace(/[$,]/g, "");
  const parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid USD value: ${value}`);
  }

  return Math.round(parsed * 100);
}

function formatQuantityLabel(quantity: number): string {
  return quantity === 1 ? "1 Ticket" : `${quantity} Tickets`;
}

function defaultDevToolsActivePortPath(): string {
  return path.join(
    process.env.HOME ?? "",
    "Library",
    "Application Support",
    "Google",
    "Chrome",
    "DevToolsActivePort",
  );
}

function shouldRetryWithWebSocket(endpoint: string, error: unknown): boolean {
  return (
    endpoint.startsWith("http://") &&
    error instanceof Error &&
    error.message.includes("Unexpected status 404")
  );
}

async function resolveWebSocketEndpoint(httpEndpoint: string): Promise<string> {
  const activePortPath =
    process.env.CHROME_DEVTOOLS_ACTIVE_PORT_FILE ?? defaultDevToolsActivePortPath();
  const fileContents = await readFile(activePortPath, "utf8");
  const [port, browserPath] = fileContents
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!port || !browserPath) {
    throw new Error(`DevToolsActivePort did not contain a usable websocket path: ${activePortPath}`);
  }

  const url = new URL(httpEndpoint);
  url.protocol = "ws:";
  url.port = port;
  url.pathname = browserPath;
  url.search = "";

  return url.toString();
}

async function connectToBrowser(chromeDebugUrl: string): Promise<Browser> {
  try {
    return await chromium.connectOverCDP(chromeDebugUrl);
  } catch (error) {
    if (!shouldRetryWithWebSocket(chromeDebugUrl, error)) {
      throw error;
    }

    const webSocketEndpoint = await resolveWebSocketEndpoint(chromeDebugUrl);
    return chromium.connectOverCDP(webSocketEndpoint);
  }
}

async function openEventPage(input: {
  chromeDebugUrl: string;
  eventUrl: string;
  quantity: number;
}) {
  const browser = await connectToBrowser(input.chromeDebugUrl);
  const context = browser.contexts()[0];
  if (!context) {
    await browser.close();
    throw new Error("No Chromium browser context was available over CDP.");
  }

  const page = await context.newPage();
  await page.goto(input.eventUrl);
  await page
    .getByRole("combobox", { name: "Quantity" })
    .selectOption({ label: formatQuantityLabel(input.quantity) });
  await page.waitForFunction(() => {
    const menuItems = Array.from(document.querySelectorAll('[role="menuitem"]'));
    return menuItems.some((menuItem) => {
      const innerTextCandidate = (menuItem as HTMLElement).innerText;
      const rawLabel =
        typeof innerTextCandidate === "string" && innerTextCandidate.trim().length > 0
          ? innerTextCandidate
          : menuItem.getAttribute("aria-label") ?? menuItem.textContent ?? "";

      return /\$\d/.test(rawLabel);
    });
  });

  return { browser, page };
}

async function readMenuItemLabels(page: Page): Promise<string[]> {
  const labels = await page
    .locator('[role="menuitem"]')
    .evaluateAll((elements: Element[]) =>
      elements
        .map((element: Element) => {
          const innerTextCandidate = (element as { innerText?: unknown }).innerText;
          const rawLabel =
            typeof innerTextCandidate === "string" && innerTextCandidate.trim().length > 0
              ? innerTextCandidate
              : element.getAttribute("aria-label") ?? element.textContent ?? "";

          return rawLabel.replace(/\s+/g, " ").trim();
        })
        .filter(Boolean),
    );

  return labels;
}

export function parseTicketListLabel(
  label: string,
  quantity: number,
): TicketmasterBrowserCandidate | null {
  const seatedMatch = label.match(/^Sec\s+(.+?)\s+•\s+Row\s+(.+?)\s+(.+?)\s+\$([\d,]+(?:\.\d{2})?)$/);
  if (seatedMatch) {
    const [, section, row, ticketType, price] = seatedMatch;
    const perTicketTotalCents = parseUsdToCents(price);

    return {
      execution: {
        eventUrl: "",
        quantity,
        source: "ticketmaster_browser",
        ticketListLabel: label,
      },
      perTicketTotalCents,
      quantity,
      rawLabel: label,
      row,
      section,
      ticketType,
      totalCents: perTicketTotalCents * quantity,
    };
  }

  const gaMatch = label.match(/^General Admission\s+(.+?)\s+\$([\d,]+(?:\.\d{2})?)$/);
  if (gaMatch) {
    const [, ticketType, price] = gaMatch;
    const perTicketTotalCents = parseUsdToCents(price);

    return {
      execution: {
        eventUrl: "",
        quantity,
        source: "ticketmaster_browser",
        ticketListLabel: label,
      },
      perTicketTotalCents,
      quantity,
      rawLabel: label,
      row: null,
      section: "General Admission",
      ticketType,
      totalCents: perTicketTotalCents * quantity,
    };
  }

  return null;
}

export function parseSubtotalLabel(label: string): { quantity: number; subtotalCents: number } | null {
  const match = label.match(/^SUBTOTAL\s+\$([\d,]+(?:\.\d{2})?)\s+(\d+)\s+Tickets?$/);
  if (!match) {
    return null;
  }

  return {
    quantity: Number.parseInt(match[2], 10),
    subtotalCents: parseUsdToCents(match[1]),
  };
}

export async function collectTicketmasterBrowserCandidates(input: {
  chromeDebugUrl: string;
  eventUrl: string;
  quantity: number;
}): Promise<TicketmasterBrowserCandidate[]> {
  const { browser, page } = await openEventPage(input);

  try {
    const labels = await readMenuItemLabels(page);
    return labels
      .map((label) => parseTicketListLabel(label, input.quantity))
      .filter((candidate): candidate is TicketmasterBrowserCandidate => candidate !== null)
      .map((candidate) => ({
        ...candidate,
        execution: {
          ...candidate.execution,
          eventUrl: input.eventUrl,
        },
      }));
  } finally {
    await browser.close();
  }
}

export async function captureTicketmasterCheckout(input: {
  chromeDebugUrl: string;
  eventUrl: string;
  quantity: number;
  ticketListLabel: string;
}): Promise<TicketmasterCheckoutResult> {
  const { browser, page } = await openEventPage(input);

  try {
    const labels = await readMenuItemLabels(page);
    if (!labels.includes(input.ticketListLabel)) {
      return {
        reason: "selected_seats_unavailable",
        status: "inventory_changed",
      };
    }

    await page.getByRole("menuitem", { name: input.ticketListLabel }).click();

    const nextButton = page.getByRole("button", { name: "Next" });
    await nextButton.waitFor();
    await nextButton.click();
    await page.waitForURL(/auth\.ticketmaster\.com/);

    return {
      checkoutUrl: page.url(),
      status: "checkout_ready",
    };
  } catch (error) {
    return {
      reason: error instanceof Error ? error.message : "ticketmaster_checkout_failed",
      status: "lookup_failed",
    };
  } finally {
    await browser.close();
  }
}
