import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { runClaude, turnsForAgent } from "./runner.js";

const POLL_INTERVAL_MS = 5_000; // 5 seconds

// Short task descriptions — command.txt has all the API patterns and context
const DEFAULT_PROMPTS: Record<string, string> = {
  "tm-monitor": "Run the TM One monitor: log in to https://one.ticketmaster.com, extract all events, compare to session/last-events.json, POST changes to the ingest endpoint. Report what changed.",
  "meta-ads": "Run the Meta Ads sync: pull all active campaigns and their last-30-day insights, save to session/last-campaigns.json, POST to the ingest endpoint. Report spend and ROAS summary.",
  "campaign-monitor": "Cross-reference Meta spend against TM1 ticket sales. Read session/last-campaigns.json and session/last-events.json. Calculate ROAS per show. Flag any campaigns below 2.0. Report findings.",
  "assistant": "Answer the question or complete the task described below. Be concise and direct.",
};

// Debounce interval for streaming partial results to Supabase
const STREAM_DEBOUNCE_MS = 2_000;

function getSupabase() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

let polling = false;

// Exported so the scheduler can check before starting a think cycle
export let jobRunning = false;

async function pollOnce() {
  const sb = getSupabase();
  if (!sb) return;

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

  if (!jobs || jobs.length === 0) return;

  const job = jobs[0];
  console.log(`[jobs] Picked up job ${job.id} for agent: ${job.agent_id}`);

  // Mark running
  jobRunning = true;
  await sb
    .from("agent_jobs")
    .update({ status: "running", started_at: new Date().toISOString() })
    .eq("id", job.id);

  const taskPrompt = job.prompt ?? DEFAULT_PROMPTS[job.agent_id] ?? `Run the ${job.agent_id} agent.`;
  const fullPrompt = job.agent_id === "assistant" && job.prompt
    ? `${DEFAULT_PROMPTS["assistant"]}\n\n${job.prompt}`
    : taskPrompt;

  // Stream partial text to Supabase so the chat UI shows live typing
  let partialText = "";
  let lastStreamAt = Date.now();

  const result = await runClaude({
    prompt: fullPrompt,
    systemPromptName: "command",
    maxTurns: turnsForAgent(job.agent_id),
    onChunk: async (chunk) => {
      partialText += chunk;
      const now = Date.now();
      if (now - lastStreamAt > STREAM_DEBOUNCE_MS) {
        lastStreamAt = now;
        // Write partial result while still running — UI polls every 3s and shows it
        sb.from("agent_jobs")
          .update({ result: partialText })
          .eq("id", job.id)
          .then(() => {}, () => {}); // non-fatal — final write will come regardless
      }
    },
  });

  jobRunning = false;

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

  tick();
  setInterval(tick, POLL_INTERVAL_MS);
}
