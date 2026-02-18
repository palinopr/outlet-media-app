import type { Page } from "playwright";
import type { TmEvent } from "./types.js";

/**
 * Scrape events from Ticketmaster One (promoter portal).
 * Navigates to the events list and extracts all visible events.
 */
export async function scrapeEvents(page: Page): Promise<TmEvent[]> {
  const events: TmEvent[] = [];
  const now = new Date().toISOString();

  console.log("Navigating to TM One events dashboard...");

  // TM One events page - adjust URL path if different in your account
  await page.goto("https://one.ticketmaster.com/events", {
    waitUntil: "networkidle",
    timeout: 30_000,
  });

  // Wait for the event table/grid to load
  // NOTE: These selectors need to be verified against the actual TM One UI
  // Run with HEADLESS=false first, then inspect the actual DOM to update selectors
  await page.waitForSelector('[data-testid="event-row"], .event-row, tr[class*="event"]', {
    timeout: 15_000,
  }).catch(() => {
    console.warn("Event rows not found with default selectors - may need selector update");
  });

  // Try to extract event data from the page
  // The actual selectors depend on TM One's current UI - update after inspecting
  const rawEvents = await page.evaluate(() => {
    const results: Array<{
      tm_id: string;
      tm1_number: string;
      name: string;
      artist: string;
      venue: string;
      city: string;
      date: string;
      status: string;
      url: string;
    }> = [];

    // Strategy 1: Look for rows in an events table
    const rows = document.querySelectorAll(
      'tr[class*="event"], [data-testid*="event"], [class*="EventRow"], [class*="event-row"]'
    );

    rows.forEach((row) => {
      const text = (sel: string) => row.querySelector(sel)?.textContent?.trim() ?? "";
      const attr = (sel: string, attr: string) => row.querySelector(sel)?.getAttribute(attr) ?? "";
      const link = row.querySelector("a");

      // Extract event URL to get TM ID
      const href = link?.href ?? "";
      const tmIdMatch = href.match(/\/events\/([A-Za-z0-9]+)/);
      const tm_id = tmIdMatch?.[1] ?? "";

      // Try common field selectors - update based on actual TM One DOM
      results.push({
        tm_id,
        tm1_number: text('[class*="tm1"], [data-field="tm1"], [class*="eventId"]') || tm_id,
        name: text('[class*="name"], [class*="title"], [class*="eventName"]'),
        artist: text('[class*="artist"], [class*="performer"], [class*="attraction"]'),
        venue: text('[class*="venue"]'),
        city: text('[class*="city"], [class*="location"]'),
        date: text('[class*="date"], [class*="eventDate"], time'),
        status: text('[class*="status"], [class*="saleStatus"]'),
        url: href,
      });
    });

    // Strategy 2: Look for JSON data embedded in the page (common in SPAs)
    const scripts = document.querySelectorAll('script[type="application/json"], script[id*="data"]');
    scripts.forEach((script) => {
      try {
        const data = JSON.parse(script.textContent ?? "");
        // Look for events array in embedded data
        const eventsList = data?.events ?? data?.data?.events ?? data?.results;
        if (Array.isArray(eventsList)) {
          eventsList.forEach((e: Record<string, unknown>) => {
            results.push({
              tm_id: String(e.id ?? e.eventId ?? e.tm_id ?? ""),
              tm1_number: String(e.tm1Number ?? e.promoterNumber ?? e.id ?? ""),
              name: String(e.name ?? e.eventName ?? ""),
              artist: String(e.artist ?? e.attraction ?? e.performer ?? ""),
              venue: String(e.venue ?? e.venueName ?? ""),
              city: String(e.city ?? e.location ?? ""),
              date: String(e.date ?? e.eventDate ?? e.startDate ?? ""),
              status: String(e.status ?? e.saleStatus ?? ""),
              url: String(e.url ?? ""),
            });
          });
        }
      } catch {
        // Script wasn't JSON, skip
      }
    });

    return results;
  });

  for (const raw of rawEvents) {
    if (!raw.tm_id && !raw.name) continue; // Skip empty rows
    events.push({
      ...raw,
      scraped_at: now,
    });
  }

  console.log(`Found ${events.length} events on current page`);

  // Handle pagination if present
  const hasNextPage = await page.$('[aria-label="Next page"], [class*="pagination"] a[rel="next"]');
  if (hasNextPage && events.length > 0) {
    console.log("Pagination detected - only scraping first page for now");
    // TODO: implement multi-page scraping
  }

  return events;
}

/**
 * Scrape a single event's detail page for more granular data (sales, TM1 number).
 */
export async function scrapeEventDetail(page: Page, eventUrl: string): Promise<Partial<TmEvent>> {
  await page.goto(eventUrl, { waitUntil: "networkidle", timeout: 20_000 });

  const detail = await page.evaluate(() => {
    const text = (sel: string) => document.querySelector(sel)?.textContent?.trim() ?? "";
    const ticketsSold = parseInt(text('[class*="ticketsSold"], [data-field="sold"]').replace(/\D/g, "") || "0");
    const gross = parseInt(text('[class*="gross"], [data-field="gross"]').replace(/[^0-9]/g, "") || "0");
    const available = parseInt(text('[class*="available"], [data-field="available"]').replace(/\D/g, "") || "0");

    return {
      tickets_sold: ticketsSold,
      gross,
      tickets_available: available,
    };
  });

  return detail;
}
