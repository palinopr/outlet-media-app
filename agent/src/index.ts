import "dotenv/config";
import { existsSync, mkdirSync } from "node:fs";
import { bot } from "./bot.js";
import { startScheduler } from "./scheduler.js";

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
});

// Start autonomous scheduler
startScheduler();

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
