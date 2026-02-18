import cron from "node-cron";
import { runAgent } from "./agent.js";
import { notifyOwner } from "./bot.js";

const CHECK_CRON = process.env.CHECK_CRON ?? "0 */2 * * *"; // every 2 hours

const CHECK_PROMPT = `
Check Ticketmaster One for event updates.

1. Go to one.ticketmaster.com and log in if needed
2. Find the events list / dashboard
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

let schedulerRunning = false;

export function startScheduler(): void {
  if (!cron.validate(CHECK_CRON)) {
    console.error(`[scheduler] Invalid cron expression: ${CHECK_CRON}`);
    return;
  }

  console.log(`[scheduler] Scheduled TM One checks: ${CHECK_CRON}`);

  cron.schedule(CHECK_CRON, async () => {
    if (schedulerRunning) {
      console.log("[scheduler] Previous check still running, skipping");
      return;
    }

    schedulerRunning = true;
    console.log("[scheduler] Running scheduled TM One check...");

    try {
      const result = await runAgent({ prompt: CHECK_PROMPT, silent: true });

      if (result.text && result.text.trim()) {
        await notifyOwner(`[Auto-check]\n\n${result.text}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[scheduler] Check failed:", msg);
      await notifyOwner(`[Auto-check failed]\n${msg}`).catch(() => {});
    } finally {
      schedulerRunning = false;
    }
  });
}
