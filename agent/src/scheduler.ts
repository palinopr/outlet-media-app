import cron from "node-cron";
import { readFileSync, existsSync, unlinkSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { runClaude } from "./runner.js";
import { notifyOwner } from "./bot.js";
import { notifyChannel } from "./discord/core/entry.js";
import { isAgentBusy, setAgentBusy, clearAgentBusy, resetStaleLocks } from "./state.js";
import { getSweepRunners } from "./jobs/cron-sweeps.js";

const SESSION_DIR = join(import.meta.dirname ?? ".", "..", "session");
const TM_SYNC_SCRIPT = join(SESSION_DIR, "tm1-http-sync.mjs");
const TM_COOKIE_SCRIPT = join(SESSION_DIR, "tm1-cookie-refresh.mjs");

const CHECK_CRON     = process.env.CHECK_CRON ?? "0 */2 * * *"; // every 2 hours
const META_CRON      = "0 */6 * * *";                            // every 6 hours
const THINK_CRON     = "*/30 8-22 * * *";                        // every 30 min, 8am-10pm
const HEARTBEAT_CRON = "*/1 * * * *";                            // every minute
const DISCORD_HEALTH_CRON = "0 */12 * * *";                      // every 12 hours
const TM_COOKIE_CRON = "0 */6 * * *";                            // proactive cookie refresh

const INGEST_URL = process.env.INGEST_URL?.replace("/api/ingest", "");

const META_TASK = "Run the Meta Ads sync: pull all active campaigns and last-30-day insights for ad account act_787610255314938, save to session/last-campaigns.json, POST to the ingest endpoint. Report spend and ROAS summary.";
const THINK_TASK = "Run your proactive self-improvement cycle. Read LEARNINGS.md first to pick which priority to focus on this cycle.";


/**
 * Start the scheduler.
 *
 * IMPORTANT: These 5 core cron jobs start unconditionally on process startup
 * and are NOT managed by the Discord schedule UI (schedule.ts). The schedule
 * UI lists them with enabled: false, but that reflects the UI's toggle state,
 * not whether the jobs are actually running. Enabling a job in the schedule UI
 * will create a SECOND cron instance for the same job.
 *
 * The 10 sweep jobs in cron-sweeps.ts are the opposite: they start OFF and
 * are only activated through the schedule UI (!enable <job>).
 *
 * To unify these, startScheduler() would need to be removed and all 15 jobs
 * managed through schedule.ts exclusively. That requires ensuring schedule.ts
 * initializes early enough and auto-enables the 5 core jobs on startup.
 *
 * Jobs can also be triggered manually from Discord channels
 * via triggerManualJob() (e.g. "run meta sync" in #media-buyer).
 */
export function startScheduler(): void {
  // Core infra jobs -- always on, not toggled by schedule UI
  cron.schedule(HEARTBEAT_CRON, () => { pingHeartbeat(); });
  cron.schedule(CHECK_CRON, () => { runTmCheck(); });
  cron.schedule(META_CRON, () => { runMetaSync(); });
  cron.schedule(THINK_CRON, () => { runThinkCycle(); }, { timezone: "America/Los_Angeles" });
  cron.schedule(DISCORD_HEALTH_CRON, () => { runDiscordHealthCheck(); });
  cron.schedule(TM_COOKIE_CRON, () => { refreshTmCookies(); });

  console.log("[scheduler] 6 core cron jobs started (heartbeat, tm, meta, think, health-check, tm-cookie-refresh)");
}

/**
 * Trigger a job manually from a Discord message.
 * Called from discord.ts when a user types "run meta sync" etc.
 * Supports both the original infra jobs and the new autonomous routines.
 */
export function triggerManualJob(jobName: string): void {
  switch (jobName) {
    case "meta-sync":
      runMetaSync();
      break;
    case "tm-sync":
      runTmCheck();
      break;
    case "think":
      runThinkCycle();
      break;
    case "tm-cookie-refresh":
      refreshTmCookies();
      break;
    default: {
      const sweeps = getSweepRunners();
      if (sweeps[jobName]) {
        sweeps[jobName]();
      } else {
        console.warn(`[scheduler] Unknown manual trigger: ${jobName}`);
      }
      break;
    }
  }
}

async function pingHeartbeat() {
  if (!INGEST_URL) {
    console.error("[scheduler] INGEST_URL not set, skipping heartbeat");
    return;
  }
  try {
    await fetch(`${INGEST_URL}/api/agents/heartbeat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: process.env.INGEST_SECRET }),
    });
  } catch {
    // silently ignore
  }
}

async function runTmCheck() {
  if (isAgentBusy("tm-sync")) {
    console.log("[scheduler] TM check already running, skipping");
    return;
  }
  setAgentBusy("tm-sync");
  console.log("[scheduler] Running TM One HTTP sync...");
  await notifyChannel("active-jobs", ">> **TM One sync** started").catch(() => {});

  try {
    let output: string;
    try {
      output = execFileSync("node", [TM_SYNC_SCRIPT], {
        timeout: 60_000,
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      });
    } catch (execErr: unknown) {
      const err = execErr as { status?: number; stdout?: string; stderr?: string };
      if (err.status === 2) {
        // Cookies expired -- refresh and retry
        console.log("[scheduler] TM cookies expired, refreshing...");
        await notifyChannel("active-jobs", ">> **TM One sync** refreshing cookies...").catch(() => {});
        await refreshTmCookies();
        output = execFileSync("node", [TM_SYNC_SCRIPT], {
          timeout: 60_000,
          encoding: "utf-8",
          stdio: ["pipe", "pipe", "pipe"],
        });
      } else {
        throw new Error(err.stderr || err.stdout || "TM sync script failed");
      }
    }

    // Parse the JSON summary from the last line of stdout
    const lines = output.trim().split("\n");
    const lastLine = lines[lines.length - 1];
    let summary: Record<string, unknown> = {};
    try { summary = JSON.parse(lastLine); } catch { /* not JSON */ }

    const evtCount = summary.events_updated ?? 0;
    const demoCount = summary.demographics_updated ?? 0;
    const durationMs = summary.duration_ms ?? 0;
    const msg = `Updated ${evtCount} events, ${demoCount} demographics in ${durationMs}ms`;
    console.log(`[scheduler] TM sync done: ${msg}`);

    await notifyChannel("active-jobs", "ok **TM One sync** finished").catch(() => {});
    await Promise.all([
      notifyOwner(`[TM One]\n\n${msg}`),
      notifyChannel("tm-data", `**TM One Update**\n\n${msg}`),
    ]);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[scheduler] TM check failed:", msg);
    await notifyChannel("active-jobs", `x **TM One sync** failed: ${msg.slice(0, 200)}`).catch(() => {});
    await Promise.all([
      notifyOwner(`[TM One -- failed]\n${msg}`).catch(() => {}),
      notifyChannel("agent-alerts", `**TM One check failed**\n${msg}`).catch(() => {}),
    ]);
  } finally {
    clearAgentBusy("tm-sync");
  }
}

async function refreshTmCookies(): Promise<void> {
  console.log("[scheduler] Refreshing TM One cookies...");
  try {
    execFileSync("node", [TM_COOKIE_SCRIPT], {
      timeout: 120_000,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    console.log("[scheduler] TM cookie refresh complete");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[scheduler] TM cookie refresh failed:", msg);
    await notifyChannel("agent-alerts", `**TM cookie refresh failed**\n${msg.slice(0, 200)}`).catch(() => {});
  }
}

async function runMetaSync() {
  if (isAgentBusy("meta-sync")) {
    console.log("[scheduler] Meta sync already running, skipping");
    return;
  }
  setAgentBusy("meta-sync");
  console.log("[scheduler] Running scheduled Meta sync...");
  await notifyChannel("active-jobs", ">> **Meta Ads sync** started").catch(() => {});

  try {
    const result = await runClaude({ prompt: META_TASK, maxTurns: 20 });
    if (result.text?.trim()) {
      await notifyChannel("active-jobs", "ok **Meta Ads sync** finished").catch(() => {});
      await Promise.all([
        notifyOwner(`[Meta Ads]\n\n${result.text}`),
        notifyChannel("performance", `**Meta Ads Sync**\n\n${result.text}`),
      ]);

      // Auto-refresh dashboard after successful sync
      try {
        const { discordClient } = await import("./discord/core/entry.js");
        if (discordClient) {
          const { updateDashboard } = await import("./discord/commands/dashboard.js");
          await updateDashboard(discordClient);
        }
      } catch { /* dashboard update is best-effort */ }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[scheduler] Meta sync failed:", msg);
    await notifyChannel("active-jobs", `x **Meta Ads sync** failed: ${msg.slice(0, 200)}`).catch(() => {});
    await Promise.all([
      notifyOwner(`[Meta Ads -- failed]\n${msg}`).catch(() => {}),
      notifyChannel("agent-alerts", `**Meta sync failed**\n${msg}`).catch(() => {}),
    ]);
  } finally {
    clearAgentBusy("meta-sync");
  }
}

/**
 * Export runner functions for discord-schedule.ts to wire up cron toggles.
 * Keys must match the job keys in discord-schedule.ts JOBS record.
 * Includes both the original infra jobs and the new autonomous routines.
 */
export function getJobRunners(): Record<string, () => void> {
  const sweeps = getSweepRunners();
  return {
    "meta-sync": () => { runMetaSync(); },
    "tm-sync": () => { runTmCheck(); },
    "think": () => { runThinkCycle(); },
    "heartbeat": () => { pingHeartbeat(); },
    "health-check": () => { runDiscordHealthCheck(); },
    "tm-cookie-refresh": () => { refreshTmCookies(); },
    ...sweeps,
  };
}

async function runDiscordHealthCheck() {
  resetStaleLocks();

  try {
    const { runChannelHealthCheck } = await import("./discord/commands/admin.js");
    await runChannelHealthCheck();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[scheduler] Discord health check failed:", msg);
  }
}

async function runThinkCycle() {
  if (isAgentBusy("think")) {
    console.log("[think] Skipping -- already running");
    return;
  }

  setAgentBusy("think");
  console.log("[think] Starting proactive think cycle...");
  await notifyChannel("active-jobs", ">> **Think loop** started").catch(() => {});

  try {
    const result = await runClaude({
      prompt: THINK_TASK,
      systemPromptName: "think",
      maxTurns: 15,
    });

    // Signal file: the think cycle's Claude subprocess writes proactive alerts
    // to this path. We read + delete it here to forward the alert to Discord/Telegram.
    // Fragile (relies on a temp file convention), but changing it requires reworking
    // the runner<->scheduler communication boundary.
    const draftPath = "/tmp/outlet-media-proactive.txt";
    if (existsSync(draftPath)) {
      const draft = readFileSync(draftPath, "utf8").trim();
      if (draft) {
        console.log("[think] Sending proactive alert");
        await Promise.all([
          notifyOwner(`[Proactive]\n\n${draft}`),
          notifyChannel("agent-alerts", `**Proactive Alert**\n\n${draft}`),
        ]);
      }
      unlinkSync(draftPath);
    }

    if (result.text?.includes("THINK_CYCLE_COMPLETE")) {
      console.log("[think] Cycle complete");
    }
    await notifyChannel("active-jobs", "ok **Think loop** finished").catch(() => {});
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[think] Cycle failed:", msg);
    await notifyChannel("active-jobs", `x **Think loop** failed: ${msg.slice(0, 200)}`).catch(() => {});
  } finally {
    clearAgentBusy("think");
  }
}
