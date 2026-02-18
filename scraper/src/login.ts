/**
 * Run this ONCE to log in and save your session.
 * After this, the scraper uses the saved session and won't ask for login again.
 *
 * Usage: npm run login
 */
import { launchBrowser, saveSession } from "./browser.js";
import { config } from "./config.js";

async function login() {
  console.log("Opening Ticketmaster login...");
  console.log("HEADLESS=false so you will see the browser window.");
  console.log("If 2FA appears, complete it in the browser - the script will wait.");

  const { browser, context, page } = await launchBrowser();

  try {
    await page.goto(config.tm.baseUrl, { waitUntil: "domcontentloaded" });

    // If already redirected to login page, fill credentials
    if (page.url().includes("auth.ticketmaster") || page.url().includes("login")) {
      console.log("Filling login credentials...");

      // Ticketmaster login form
      await page.fill('input[name="email"], input[type="email"], #email', config.tm.email);
      await page.click('button[type="submit"], input[type="submit"]');
      await page.waitForTimeout(1500);

      await page.fill('input[name="password"], input[type="password"], #password', config.tm.password);
      await page.click('button[type="submit"], input[type="submit"]');

      console.log("Credentials submitted. Waiting for login to complete...");
      console.log("If you see a 2FA prompt, complete it in the browser now.");
    }

    // Wait for successful login - TM One dashboard should load
    await page.waitForURL((url) => !url.href.includes("auth.ticketmaster"), {
      timeout: 120_000, // 2 minutes to handle 2FA
    });

    console.log("Logged in successfully!");
    await saveSession(context);
    console.log("Session saved. You can now run: npm run scrape");
  } catch (err) {
    console.error("Login failed:", err);
    console.log("Try running with HEADLESS=false in .env and logging in manually.");
  } finally {
    await browser.close();
  }
}

login();
