#!/usr/bin/env node
/**
 * Outlet Media - Ticketmaster Local Scraper Agent
 *
 * Runs on your Mac, logs into Ticketmaster One (promoter portal),
 * scrapes your event data, and syncs it to the live dashboard.
 *
 * First time: npm run login    (saves your session)
 * Every time: npm run scrape   (uses saved session)
 */
import { launchBrowser, isLoggedIn, saveSession } from "./browser.js";
import { scrapeEvents } from "./scrape-events.js";
import { saveToCache, sendToApp } from "./send.js";
import { config } from "./config.js";
import type { ScrapeResult } from "./types.js";

async function main() {
  const args = process.argv.slice(2);
  const target = args.find((a) => a.startsWith("--target="))?.split("=")[1] ?? "events";

  console.log("=== Outlet Media Ticketmaster Scraper ===");
  console.log(`Target: ${target}`);
  console.log(`Headless: ${config.headless}`);
  console.log(`Sending to: ${config.ingest.url}`);
  console.log("");

  const { browser, context, page } = await launchBrowser();

  try {
    // Check if session is still valid
    const loggedIn = await isLoggedIn(page);

    if (!loggedIn) {
      console.log("Session expired or not found. Run: npm run login");
      console.log("Opening login page...");
      await page.goto(config.tm.baseUrl);
      console.log("Log in manually in the browser, then press Enter here to continue...");
      await new Promise<void>((resolve) => {
        process.stdin.once("data", () => resolve());
      });
      await saveSession(context);
    }

    const now = new Date().toISOString();
    let result: ScrapeResult;

    if (target === "events" || target === "all") {
      const events = await scrapeEvents(page);

      result = {
        events,
        scraped_at: now,
        source: "ticketmaster_one",
      };

      // Always save locally first (backup)
      saveToCache(result);

      if (events.length === 0) {
        console.warn("No events found. The page selectors may need updating.");
        console.log("Run with HEADLESS=false to see what the page looks like.");
        console.log("Check scraper/src/scrape-events.ts to update the selectors.");
      } else {
        // Send to live app
        await sendToApp(result);
      }
    } else {
      console.log(`Unknown target: ${target}. Use --target=events`);
    }
  } catch (err) {
    console.error("Scrape failed:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
