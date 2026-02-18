import cron from "node-cron";
import { readFileSync, existsSync, unlinkSync } from "node:fs";
import { runClaude } from "./runner.js";
import { notifyOwner } from "./bot.js";
import { state } from "./state.js";

const CHECK_CRON     = process.env.CHECK_CRON ?? "0 */2 * * *"; // every 2 hours
const META_CRON      = "0 */6 * * *";                            // every 6 hours
const THINK_CRON     = "*/30 8-22 * * *";                        // every 30 min, 8am-10pm
const HEARTBEAT_CRON = "*/1 * * * *";                            // every minute

const INGEST_URL =
  process.env.INGEST_URL?.replace("/api/ingest", "") ?? "http://localhost:3000";

// Short task descriptions — command.txt provides all the API context
const TM_TASK = "Run the TM One monitor: log in to https://one.ticketmaster.com, extract all events, compare to session/last-events.json, POST changes to the ingest endpoint. Report what changed.";
const META_TASK = "Run the Meta Ads sync: pull all active campaigns and last-30-day insights for ad account act_787610255314938, save to session/last-campaigns.json, POST to the ingest endpoint. Report spend and ROAS summary.";
const THINK_TASK = "Run your proactive self-improvement cycle. Read LEARNINGS.md first to pick which priority to focus on this cycle.";

// Busy flags — prevent overlapping runs
let tmRunning    = false;
let metaRunning  = false;
let thinkRunning = false;

export function startScheduler(): void {
  // ─── Heartbeat ───────────────────────────────────────────────────────────
  cron.schedule(HEARTBEAT_CRON, () => { pingHeartbeat(); });
  pingHeartbeat();

  // ─── TM One check ────────────────────────────────────────────────────────
  if (!cron.validate(CHECK_CRON)) {
    console.error(`[scheduler] Invalid CHECK_CRON: ${CHECK_CRON}`);
  } else {
    console.log(`[scheduler] Scheduled TM One checks: ${CHECK_CRON}`);
    cron.schedule(CHECK_CRON, () => { runTmCheck(); });
  }

  // ─── Meta sync ───────────────────────────────────────────────────────────
  console.log(`[scheduler] Scheduled Meta syncs: ${META_CRON}`);
  cron.schedule(META_CRON, () => { runMetaSync(); });

  // ─── Proactive think loop ─────────────────────────────────────────────────
  console.log(`[scheduler] Scheduled think loop: ${THINK_CRON}`);
  cron.schedule(THINK_CRON, () => { runThinkCycle(); });
}

async function pingHeartbeat() {
  try {
    await fetch(`${INGEST_URL}/api/agents/heartbeat`, { method: "POST" });
  } catch {
    // silently ignore — network may be down
  }
}

async function runTmCheck() {
  if (tmRunning) {
    console.log("[scheduler] TM check already running, skipping");
    return;
  }
  tmRunning = true;
  console.log("[scheduler] Running scheduled TM One check...");

  try {
    const result = await runClaude({ prompt: TM_TASK, maxTurns: 50 });
    if (result.text?.trim()) {
      await notifyOwner(`[TM One]\n\n${result.text}`);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[scheduler] TM check failed:", msg);
    await notifyOwner(`[TM One — failed]\n${msg}`).catch(() => {});
  } finally {
    tmRunning = false;
  }
}

async function runMetaSync() {
  if (metaRunning) {
    console.log("[scheduler] Meta sync already running, skipping");
    return;
  }
  metaRunning = true;
  console.log("[scheduler] Running scheduled Meta sync...");

  try {
    const result = await runClaude({ prompt: META_TASK, maxTurns: 20 });
    if (result.text?.trim()) {
      await notifyOwner(`[Meta Ads]\n\n${result.text}`);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[scheduler] Meta sync failed:", msg);
    await notifyOwner(`[Meta Ads — failed]\n${msg}`).catch(() => {});
  } finally {
    metaRunning = false;
  }
}

async function runThinkCycle() {
  // Don't think while another task is running (would compete for the claude CLI)
  if (thinkRunning || tmRunning || metaRunning || state.jobRunning) {
    console.log("[think] Skipping — another task is running");
    return;
  }

  thinkRunning = true;
  state.thinkRunning = true;
  console.log("[think] Starting proactive think cycle...");

  try {
    const result = await runClaude({
      prompt: THINK_TASK,
      systemPromptName: "think",
      maxTurns: 15,
    });

    // Check if the think cycle drafted a proactive message
    const draftPath = "/tmp/outlet-media-proactive.txt";
    if (existsSync(draftPath)) {
      const draft = readFileSync(draftPath, "utf8").trim();
      if (draft) {
        console.log("[think] Sending proactive alert to Telegram");
        await notifyOwner(`[Proactive]\n\n${draft}`);
      }
      unlinkSync(draftPath);
    }

    if (result.text?.includes("THINK_CYCLE_COMPLETE")) {
      console.log("[think] Cycle complete");
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[think] Cycle failed:", msg);
  } finally {
    thinkRunning = false;
    state.thinkRunning = false;
  }
}
