import cron from "node-cron";
import { readFileSync, existsSync, unlinkSync } from "node:fs";
import { runClaude } from "./runner.js";
import { notifyOwner } from "./bot.js";
import { notifyChannel } from "./discord/core/entry.js";
import { state } from "./state.js";
import { getSweepRunners } from "./jobs/cron-sweeps.js";

const CHECK_CRON     = process.env.CHECK_CRON ?? "0 */2 * * *"; // every 2 hours
const META_CRON      = "0 */6 * * *";                            // every 6 hours
const THINK_CRON     = "*/30 8-22 * * *";                        // every 30 min, 8am-10pm
const HEARTBEAT_CRON = "*/1 * * * *";                            // every minute
const DISCORD_HEALTH_CRON = "0 */12 * * *";                      // every 12 hours

const INGEST_URL = process.env.INGEST_URL?.replace("/api/ingest", "");

const TM_TASK = "Run the TM One monitor: log in to https://one.ticketmaster.com, extract all events, compare to session/last-events.json, POST changes to the ingest endpoint. Report what changed.";
const META_TASK = "Run the Meta Ads sync: pull all active campaigns and last-30-day insights for ad account act_787610255314938, save to session/last-campaigns.json, POST to the ingest endpoint. Report spend and ROAS summary.";
const THINK_TASK = "Run your proactive self-improvement cycle. Read LEARNINGS.md first to pick which priority to focus on this cycle.";


/**
 * Start the scheduler.
 *
 * Jobs can also be triggered manually from Discord channels
 * via triggerManualJob() (e.g. "run meta sync" in #media-buyer).
 */
export function startScheduler(): void {
  cron.schedule(HEARTBEAT_CRON, () => { pingHeartbeat(); });
  cron.schedule(CHECK_CRON, () => { runTmCheck(); });
  cron.schedule(META_CRON, () => { runMetaSync(); });
  cron.schedule(THINK_CRON, () => { runThinkCycle(); });
  cron.schedule(DISCORD_HEALTH_CRON, () => { runDiscordHealthCheck(); });

  console.log("[scheduler] All scheduled jobs started");
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
  if (state.tmRunning) {
    console.log("[scheduler] TM check already running, skipping");
    return;
  }
  state.tmRunning = true;
  console.log("[scheduler] Running scheduled TM One check...");
  await notifyChannel("active-jobs", ">> **TM One sync** started").catch(() => {});

  try {
    const result = await runClaude({ prompt: TM_TASK, maxTurns: 50 });
    if (result.text?.trim()) {
      await notifyChannel("active-jobs", "ok **TM One sync** finished").catch(() => {});
      await Promise.all([
        notifyOwner(`[TM One]\n\n${result.text}`),
        notifyChannel("tm-data", `**TM One Update**\n\n${result.text}`),
      ]);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[scheduler] TM check failed:", msg);
    await notifyChannel("active-jobs", `x **TM One sync** failed: ${msg.slice(0, 200)}`).catch(() => {});
    await Promise.all([
      notifyOwner(`[TM One -- failed]\n${msg}`).catch(() => {}),
      notifyChannel("agent-alerts", `**TM One check failed**\n${msg}`).catch(() => {}),
    ]);
  } finally {
    state.tmRunning = false;
  }
}

async function runMetaSync() {
  if (state.metaRunning) {
    console.log("[scheduler] Meta sync already running, skipping");
    return;
  }
  state.metaRunning = true;
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
    state.metaRunning = false;
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
    ...sweeps,
  };
}

async function runDiscordHealthCheck() {
  try {
    const { runChannelHealthCheck } = await import("./discord/commands/admin.js");
    await runChannelHealthCheck();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[scheduler] Discord health check failed:", msg);
  }
}

async function runThinkCycle() {
  if (state.thinkRunning || state.tmRunning || state.metaRunning || state.jobRunning || state.discordAdminRunning) {
    console.log("[think] Skipping -- another task is running");
    return;
  }

  state.thinkRunning = true;
  console.log("[think] Starting proactive think cycle...");
  await notifyChannel("active-jobs", ">> **Think loop** started").catch(() => {});

  try {
    const result = await runClaude({
      prompt: THINK_TASK,
      systemPromptName: "think",
      maxTurns: 15,
    });

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
    state.thinkRunning = false;
  }
}
