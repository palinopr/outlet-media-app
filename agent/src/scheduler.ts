import cron from "node-cron";
import { readFileSync, existsSync, unlinkSync } from "node:fs";
import { runAgent } from "./agent.js";
import { notifyOwner } from "./bot.js";
import { THINK_PROMPT } from "./think.js";

const CHECK_CRON      = process.env.CHECK_CRON ?? "0 */2 * * *";  // every 2 hours
const META_CRON       = "0 */6 * * *";                              // every 6 hours
const THINK_CRON      = "*/30 8-22 * * *";                          // every 30 min, 8am-10pm
const HEARTBEAT_CRON  = "*/1 * * * *";                              // every minute
const INGEST_URL      = process.env.INGEST_URL?.replace("/api/ingest", "") ?? "http://localhost:3000";

const TM_PROMPT = `
Check Ticketmaster One for event updates.

Read MEMORY.md first for context on what we're monitoring.

1. Go to one.ticketmaster.com and log in (use TM_EMAIL and TM_PASSWORD from environment or files)
2. Find the events list / promoter dashboard
3. Extract all events with: name, TM1 number, venue, city, date, status, tickets sold, tickets available, gross
4. Compare to ./session/last-events.json (the previous state)
5. Save the new data to ./session/last-events.json
6. POST all events to the ingest endpoint so the dashboard stays current
7. Report:
   - How many events you found
   - What changed since last check (new events, ticket count changes, status changes)
   - If nothing changed, say so briefly

Keep the report short and factual.
`.trim();

const META_PROMPT = `
Pull the latest Meta Ads performance data.

Read MEMORY.md first for context on the ad account and client.

1. Find META_ACCESS_TOKEN and META_AD_ACCOUNT_ID from environment or ../.env.local
2. Get all campaigns: GET /v21.0/{AD_ACCOUNT_ID}/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget
3. For each ACTIVE campaign get insights (last 30 days):
   GET /v21.0/{campaign_id}/insights?fields=spend,impressions,clicks,reach,cpm,cpc,ctr,purchase_roas&date_preset=last_30d
4. Save raw results to ./session/last-campaigns.json
5. POST to ingest endpoint with source: "meta"
6. Report:
   - Number of campaigns synced
   - Total spend, average ROAS
   - Any campaign with ROAS < 2.0 (flag it)

roas comes from purchase_roas[0].value — it's a string, convert to float.
`.trim();

// Busy flags — prevent overlapping runs
let tmRunning    = false;
let metaRunning  = false;
let thinkRunning = false;

export function startScheduler(): void {
  // ─── Heartbeat ───────────────────────────────────────────────────────────
  cron.schedule(HEARTBEAT_CRON, () => pingHeartbeat());
  pingHeartbeat(); // ping immediately on start

  // ─── TM One check ────────────────────────────────────────────────────────
  if (!cron.validate(CHECK_CRON)) {
    console.error(`[scheduler] Invalid CHECK_CRON: ${CHECK_CRON}`);
  } else {
    console.log(`[scheduler] Scheduled TM One checks: ${CHECK_CRON}`);
    cron.schedule(CHECK_CRON, () => runTmCheck());
  }

  // ─── Meta sync ───────────────────────────────────────────────────────────
  console.log(`[scheduler] Scheduled Meta syncs: ${META_CRON}`);
  cron.schedule(META_CRON, () => runMetaSync());

  // ─── Proactive think loop ─────────────────────────────────────────────────
  console.log(`[scheduler] Scheduled think loop: ${THINK_CRON}`);
  cron.schedule(THINK_CRON, () => runThinkCycle());
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
    const result = await runAgent({ prompt: TM_PROMPT, silent: true });
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
    const result = await runAgent({ prompt: META_PROMPT, silent: true });
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
  // Don't think while another task is running (would compete for Claude CLI)
  if (thinkRunning || tmRunning || metaRunning) {
    console.log("[think] Skipping — another task is running");
    return;
  }

  thinkRunning = true;
  console.log("[think] Starting proactive think cycle...");

  try {
    const result = await runAgent({ prompt: THINK_PROMPT, silent: true });

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

    // Log cycle completion (silent — don't message unless there's a draft)
    if (result.text?.includes("THINK_CYCLE_COMPLETE")) {
      console.log("[think] Cycle complete");
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[think] Cycle failed:", msg);
  } finally {
    thinkRunning = false;
  }
}
