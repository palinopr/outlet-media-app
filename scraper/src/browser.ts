import { chromium, type Browser, type BrowserContext, type Page } from "playwright";
import { existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./config.js";

const SESSION_DIR = join(dirname(fileURLToPath(import.meta.url)), "../session");
const SESSION_FILE = join(SESSION_DIR, "auth.json");

/**
 * Launch browser. Uses a persistent session so you only log in once.
 * The session is saved to scraper/session/auth.json
 */
export async function launchBrowser(): Promise<{ browser: Browser; context: BrowserContext; page: Page }> {
  if (!existsSync(SESSION_DIR)) mkdirSync(SESSION_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: config.headless,
    // Use your system Chrome so TM doesn't flag as a bot
    channel: "chrome",
  });

  // Load saved session if it exists (avoids re-login every run)
  const context = await browser.newContext(
    existsSync(SESSION_FILE)
      ? { storageState: SESSION_FILE }
      : {
          viewport: { width: 1280, height: 900 },
          userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        }
  );

  const page = await context.newPage();
  return { browser, context, page };
}

/**
 * Save the current browser session to disk so next run skips login.
 */
export async function saveSession(context: BrowserContext): Promise<void> {
  await context.storageState({ path: SESSION_FILE });
  console.log(`Session saved to ${SESSION_FILE}`);
}

/**
 * Check if we're currently logged in to Ticketmaster.
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    await page.goto(config.tm.baseUrl, { waitUntil: "domcontentloaded", timeout: 15_000 });
    // If we get redirected to login, we're not logged in
    return !page.url().includes("auth.ticketmaster") && !page.url().includes("login");
  } catch {
    return false;
  }
}
