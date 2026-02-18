import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { runAgent } from "./agent.js";

const POLL_INTERVAL_MS = 30_000; // 30 seconds

// Agent-specific prompts when no custom prompt is provided
const DEFAULT_PROMPTS: Record<string, string> = {
  "tm-monitor": `
Check Ticketmaster One for event updates.
1. Go to one.ticketmaster.com and log in if needed
2. Find the events list and extract all events with: name, TM1 number, venue, city, date, status, tickets sold, tickets available, gross
3. Compare to ./session/last-events.json
4. Save new data to ./session/last-events.json
5. POST all events to the ingest endpoint
6. Report what changed (or that nothing changed)
`.trim(),

  "meta-ads": `
Pull the latest Meta Ads performance data.
Use the Meta Marketing API to fetch all active campaigns for the configured ad account.
For each campaign get: name, status, spend, impressions, clicks, CTR, ROAS.
POST the data to the ingest endpoint.
Report a summary of spend and performance.
`.trim(),

  "campaign-monitor": `
Cross-reference ticket sales with ad spend.
1. Read current tm_events and meta_campaigns from Supabase (GET the ingest endpoint or read from session cache)
2. Calculate true ROAS per show (ticket revenue / ad spend attributed to that show)
3. Flag any campaigns with ROAS below 2.0 as underperforming
4. Report findings: top performers, underperformers, and recommended actions.
`.trim(),

  "assistant": `Answer the question or complete the task described in the prompt. You have access to Meta Ads data and Ticketmaster One data. Be concise and direct.`.trim(),
};

function getSupabase() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

let polling = false;

async function pollOnce() {
  const sb = getSupabase();
  if (!sb) return; // Supabase not configured - skip silently

  // Claim the oldest pending job
  const { data: jobs, error } = await sb
    .from("agent_jobs")
    .select("id, agent_id, prompt")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(1);

  if (error) {
    console.error("[jobs] poll error:", error.message);
    return;
  }

  if (!jobs || jobs.length === 0) return; // nothing to do

  const job = jobs[0];
  console.log(`[jobs] Picked up job ${job.id} for agent: ${job.agent_id}`);

  // Mark running
  await sb
    .from("agent_jobs")
    .update({ status: "running", started_at: new Date().toISOString() })
    .eq("id", job.id);

  const prompt = job.prompt ?? DEFAULT_PROMPTS[job.agent_id] ?? `Run the ${job.agent_id} agent.`;

  const result = await runAgent({ prompt });

  if (result.success) {
    await sb
      .from("agent_jobs")
      .update({
        status: "done",
        result: result.text,
        finished_at: new Date().toISOString(),
      })
      .eq("id", job.id);
    console.log(`[jobs] Job ${job.id} done`);
  } else {
    await sb
      .from("agent_jobs")
      .update({
        status: "error",
        error: result.error ?? result.text,
        finished_at: new Date().toISOString(),
      })
      .eq("id", job.id);
    console.log(`[jobs] Job ${job.id} failed: ${result.error}`);
  }
}

export function startJobPoller(): void {
  const sb = getSupabase();
  if (!sb) {
    console.log("[jobs] Supabase not configured - job queue disabled");
    return;
  }

  console.log(`[jobs] Polling for queued jobs every ${POLL_INTERVAL_MS / 1000}s`);

  const tick = async () => {
    if (polling) return;
    polling = true;
    try {
      await pollOnce();
    } catch (err) {
      console.error("[jobs] Unhandled error:", err);
    } finally {
      polling = false;
    }
  };

  // Run immediately on start, then on interval
  tick();
  setInterval(tick, POLL_INTERVAL_MS);
}
