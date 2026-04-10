import "dotenv/config";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { discordClient, startDiscordBot, stopDiscordRuntimeState } from "./discord/core/entry.js";
import { killAllClaude } from "./runner.js";
import { toErrorMessage } from "./utils/error-helpers.js";

// Ensure session directory exists for TM One browser state
const agentRootDir = new URL("..", import.meta.url).pathname;
const sessionDir = new URL("../session", import.meta.url).pathname;
if (!existsSync(sessionDir)) mkdirSync(sessionDir, { recursive: true });
const runtimePidFile = new URL("../session/runtime.pid", import.meta.url).pathname;

function readCommandForPid(pid: number): string | null {
  try {
    return execFileSync("ps", ["-p", String(pid), "-o", "command="], {
      encoding: "utf-8",
    }).trim();
  } catch {
    return null;
  }
}

function registerRuntimePid(): void {
  try {
    if (existsSync(runtimePidFile)) {
      const previousPid = Number.parseInt(readFileSync(runtimePidFile, "utf-8").trim(), 10);
      if (Number.isInteger(previousPid) && previousPid !== process.pid) {
        const command = readCommandForPid(previousPid);
        if (command?.includes(agentRootDir)) {
          console.error(`[startup] Another Outlet agent runtime is already active (pid ${previousPid}).`);
          process.exit(1);
        }
      }
    }

    writeFileSync(runtimePidFile, String(process.pid));
  } catch (error) {
    console.warn("[startup] Failed to register runtime pid:", toErrorMessage(error));
  }
}

function cleanupRuntimePid(): void {
  try {
    if (!existsSync(runtimePidFile)) return;
    const registeredPid = Number.parseInt(readFileSync(runtimePidFile, "utf-8").trim(), 10);
    if (registeredPid === process.pid) {
      unlinkSync(runtimePidFile);
    }
  } catch (error) {
    console.warn("[startup] Failed to clear runtime pid:", toErrorMessage(error));
  }
}

registerRuntimePid();

// Validate required env vars -- fail fast with a clear error
function validateEnv(): void {
  const required = [
    "DISCORD_TOKEN",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "CLAUDE_PATH",
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(`[startup] Missing required env vars: ${missing.join(", ")}`);
    process.exit(1);
  }
}

validateEnv();

console.log("=== Outlet Media Agent ===");
console.log("Powered by Claude Code CLI + Playwright MCP");
console.log("");

// Start Discord bot (if token configured)
startDiscordBot();

// Graceful shutdown -- kill child Claude processes to prevent orphaned ghosts
async function shutdown(): Promise<void> {
  await stopDiscordRuntimeState();
  killAllClaude();
  discordClient?.destroy();
  cleanupRuntimePid();
}

async function gracefulExit(signal: string): Promise<void> {
  console.log(`${signal} received, shutting down...`);
  // Force exit after 10s if cleanup stalls
  setTimeout(() => process.exit(1), 10_000).unref();
  await shutdown();
  process.exit(0);
}

process.once("SIGINT", () => { void gracefulExit("SIGINT"); });
process.once("SIGTERM", () => { void gracefulExit("SIGTERM"); });
process.once("SIGHUP", () => { void gracefulExit("SIGHUP"); });

// Suppress unhandled Discord WS close errors on shutdown
process.on("unhandledRejection", (reason) => {
  const msg = toErrorMessage(reason);
  if (msg.includes("1000") || msg.includes("WebSocket")) return;
  console.error("[unhandled]", msg);
});
