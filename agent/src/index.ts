import "dotenv/config";
import { existsSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { bot } from "./bot.js";
import { startDiscordBot } from "./discord/core/entry.js";
import { startScheduler } from "./scheduler.js";
import { killAllClaude } from "./runner.js";

// Ensure session directory exists for TM One browser state
const sessionDir = new URL("../session", import.meta.url).pathname;
if (!existsSync(sessionDir)) mkdirSync(sessionDir, { recursive: true });

// Kill orphaned processes from previous bot runs to prevent double responses.
// Two sources of ghosts:
// 1. Claude CLI children that outlive the parent Node process
// 2. Stale tsx dev-mode instances that stay connected to Discord
try {
  const myPid = process.pid;

  // Kill orphaned Claude CLI processes spawned by previous bot runs
  const staleClaude = execSync(
    `pgrep -f "claude.*--dangerously-skip-permissions.*--setting-sources local" || true`,
    { encoding: "utf-8" },
  ).trim();
  if (staleClaude) {
    const pids = staleClaude.split("\n").filter(Boolean);
    console.log(`[startup] Killing ${pids.length} orphaned Claude CLI process(es): ${pids.join(", ")}`);
    execSync(`kill ${pids.join(" ")} 2>/dev/null || true`);
  }

  // Kill stale tsx/node bot instances (from `npm exec tsx src/index.ts`)
  const staleTsx = execSync(
    `pgrep -f "tsx.*src/index.ts|node.*src/index.ts" || true`,
    { encoding: "utf-8" },
  ).trim();
  if (staleTsx) {
    const pids = staleTsx.split("\n").filter(Boolean).filter(p => p !== String(myPid));
    if (pids.length > 0) {
      console.log(`[startup] Killing ${pids.length} stale tsx bot instance(s): ${pids.join(", ")}`);
      execSync(`kill -9 ${pids.join(" ")} 2>/dev/null || true`);
    }
  }

  // Kill stale compiled bot instances (from `node dist/index.js`)
  const staleNode = execSync(
    `pgrep -f "node dist/index.js" || true`,
    { encoding: "utf-8" },
  ).trim();
  if (staleNode) {
    const pids = staleNode.split("\n").filter(Boolean).filter(p => p !== String(myPid));
    if (pids.length > 0) {
      console.log(`[startup] Killing ${pids.length} stale bot instance(s): ${pids.join(", ")}`);
      execSync(`kill ${pids.join(" ")} 2>/dev/null || true`);
    }
  }
} catch {
  // pgrep not found or no matches -- safe to ignore
}

console.log("=== Outlet Media Agent ===");
console.log("Powered by Claude Code CLI + Playwright MCP");
console.log("");

// Start Discord bot (if token configured)
startDiscordBot();

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

// Graceful shutdown -- kill child Claude processes to prevent orphaned ghosts
process.once("SIGINT", () => {
  console.log("\nShutting down...");
  killAllClaude();
  bot.stop();
  process.exit(0);
});

process.once("SIGTERM", () => {
  console.log("SIGTERM received, killing child processes...");
  killAllClaude();
  bot.stop();
  process.exit(0);
});

// Suppress unhandled Discord WS close errors on shutdown
process.on("unhandledRejection", (reason) => {
  const msg = reason instanceof Error ? reason.message : String(reason);
  if (msg.includes("1000") || msg.includes("WebSocket")) return;
  console.error("[unhandled]", msg);
});
