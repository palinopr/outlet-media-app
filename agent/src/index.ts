import "dotenv/config";
import { existsSync, mkdirSync } from "node:fs";
import { bot } from "./bot.js";
import { startScheduler } from "./scheduler.js";
import { startJobPoller } from "./jobs.js";

// Ensure session directory exists for TM One browser state
const sessionDir = new URL("../session", import.meta.url).pathname;
if (!existsSync(sessionDir)) mkdirSync(sessionDir, { recursive: true });

console.log("=== Outlet Media Agent ===");
console.log("Powered by Claude Code CLI +  Playwright MCP");
console.log("");

// Start Telegram bot (long-polling)
bot.start({
  onStart: (info) => {
    console.log(`Telegram bot online: @${info.username}`);
    console.log("Send /start in Telegram to test it.");
  },
}).catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  // 409 means another instance is already polling - non-fatal
  if (msg.includes("409")) {
    console.warn("[bot] Another bot instance already running - Telegram polling disabled");
  } else {
    console.error("[bot] Fatal error:", msg);
  }
});

// Start autonomous scheduler
startScheduler();

// Poll Supabase for jobs queued from the web dashboard
startJobPoller();

// Graceful shutdown
process.once("SIGINT", () => {
  console.log("\nShutting down...");
  bot.stop();
  process.exit(0);
});

process.once("SIGTERM", () => {
  bot.stop();
  process.exit(0);
});
