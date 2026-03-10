/**
 * discord-schedule.ts -- Schedule channel management.
 *
 * Commands for viewing, enabling, and disabling scheduled jobs
 * from the #schedule channel in Discord.
 *
 * Optional jobs can be toggled here. Core jobs are runtime-managed
 * by env-backed scheduler settings and are shown as AUTO or MANUAL.
 */

import cron, { type ScheduledTask } from "node-cron";
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { EmbedBuilder, type Client } from "discord.js";

const __dirname = import.meta.dirname ?? dirname(fileURLToPath(import.meta.url));
const SWEEP_STATE_PATH = join(__dirname, "..", "..", "..", "session", "sweep-state.json");

const SCHEDULED_OWNER_NOTIFICATIONS = (process.env.SCHEDULED_OWNER_NOTIFICATIONS ?? "false").toLowerCase() === "true";
const TM_SCHEDULER_ENABLED = (process.env.TM_SCHEDULER_ENABLED ?? "false").toLowerCase() === "true";
const EATA_SCHEDULER_ENABLED = (process.env.EATA_SCHEDULER_ENABLED ?? "false").toLowerCase() === "true";

/** Lazy import to avoid circular dependency with discord.ts */
async function postToFeed(text: string): Promise<void> {
  const { notifyChannel } = await import("../core/entry.js");
  await notifyChannel("agent-feed", text);
}

// --- Job Definitions ------------------------------------------------------

interface ScheduleJob {
  name: string;
  description: string;
  cron: string;
  enabled: boolean;
  task: ScheduledTask | null;
  lastRun: Date | null;
  runner: () => void;
}

const JOBS: Record<string, ScheduleJob> = {
  "meta-sync": {
    name: "Meta Ads Sync",
    description: "Pull active campaigns + insights from Meta Graph API",
    cron: "0 */6 * * *",
    enabled: false,
    task: null,
    lastRun: null,
    runner: () => {},
  },
  "tm-sync": {
    name: "TM One Sync",
    description: "Scrape Ticketmaster One for event data",
    cron: "0 */2 * * *",
    enabled: false,
    task: null,
    lastRun: null,
    runner: () => {},
  },
  "think": {
    name: "Think Loop",
    description: "Proactive self-improvement cycle (reads LEARNINGS.md)",
    cron: "*/30 8-22 * * *",
    enabled: false,
    task: null,
    lastRun: null,
    runner: () => {},
  },
  "heartbeat": {
    name: "Heartbeat",
    description: "Ping ingest endpoint to confirm agent is alive",
    cron: "*/1 * * * *",
    enabled: false,
    task: null,
    lastRun: null,
    runner: () => {},
  },
  "health-check": {
    name: "Discord Health Check",
    description: "Check for stale channels with no activity",
    cron: "0 */12 * * *",
    enabled: false,
    task: null,
    lastRun: null,
    runner: () => {},
  },

  // --- EATA / Don Omar ---
  "eata-sync": {
    name: "EATA Sync",
    description: "Sync Don Omar BCN ticket data from Vivaticket",
    cron: "0 */2 * * *",
    enabled: false,
    task: null,
    lastRun: null,
    runner: () => {},
  },
  "eata-cookie-refresh": {
    name: "EATA Cookie Refresh",
    description: "Refresh OAuth2 token for Vivaticket API",
    cron: "0 */6 * * *",
    enabled: false,
    task: null,
    lastRun: null,
    runner: () => {},
  },
  "tm-cookie-refresh": {
    name: "TM Cookie Refresh",
    description: "Refresh TM One authentication cookies via Playwright",
    cron: "0 */6 * * *",
    enabled: false,
    task: null,
    lastRun: null,
    runner: () => {},
  },
  "email-check": {
    name: "Email Check",
    description: "Sweep unread Gmail inbox, auto-draft replies, alert on important mail",
    cron: "*/15 8-22 * * *",
    enabled: false,
    task: null,
    lastRun: null,
    runner: () => {},
  },

  // --- Autonomous Routines (from discord-routines.ts) ---
  "morning-briefing": {
    name: "Morning Briefing",
    description: "Daily summary: shows, campaigns, action items -> #boss (8am CST)",
    cron: "0 13 * * *",  // 8am CST = 1pm UTC
    enabled: false,
    task: null,
    lastRun: null,
    runner: () => {},
  },
  "show-day-check": {
    name: "Show-Day Automation",
    description: "Max budgets + urgency creative for today's shows (9am CST)",
    cron: "0 14 * * *",  // 9am CST = 2pm UTC
    enabled: false,
    task: null,
    lastRun: null,
    runner: () => {},
  },
  "show-day-monitor": {
    name: "Show-Day Monitor",
    description: "Check spend pace on show-day campaigns (every 2h, show days only)",
    cron: "0 */2 * * *",
    enabled: false,
    task: null,
    lastRun: null,
    runner: () => {},
  },
  "post-show-recap": {
    name: "Post-Show Recap",
    description: "Final spend, tickets, ROAS for yesterday's shows + pause campaigns (9am CST)",
    cron: "0 14 * * *",  // 9am CST = 2pm UTC
    enabled: false,
    task: null,
    lastRun: null,
    runner: () => {},
  },
  "weekly-report": {
    name: "Weekly Report",
    description: "Per-client weekly performance summary (Monday 9am CST)",
    cron: "0 14 * * 1",  // Monday 9am CST = 2pm UTC
    enabled: false,
    task: null,
    lastRun: null,
    runner: () => {},
  },
  "creative-fatigue": {
    name: "Creative Fatigue Check",
    description: "CTR/frequency trends on active ads, flag refresh needs (every 6h)",
    cron: "0 */6 * * *",
    enabled: false,
    task: null,
    lastRun: null,
    runner: () => {},
  },
  "budget-pacing": {
    name: "Budget Pacing",
    description: "Daily spend vs budget for active campaigns, flag under/overpacing (every 4h)",
    cron: "0 */4 * * *",
    enabled: false,
    task: null,
    lastRun: null,
    runner: () => {},
  },
  "ticket-velocity": {
    name: "Ticket Velocity",
    description: "TM ticket velocity check for upcoming events (every 4h)",
    cron: "0 */4 * * *",
    enabled: false,
    task: null,
    lastRun: null,
    runner: () => {},
  },
  "client-pulse": {
    name: "Client Pulse",
    description: "Daily client health check across all clients (9am CST)",
    cron: "0 14 * * *",
    enabled: false,
    task: null,
    lastRun: null,
    runner: () => {},
  },
  "boss-supervision": {
    name: "Boss Supervision",
    description: "Boss reviews all agent activity and coordination (every 4h)",
    cron: "0 */4 * * *",
    enabled: false,
    task: null,
    lastRun: null,
    runner: () => {},
  },
  "creative-classify": {
    name: "Creative Classify",
    description: "Classify newly uploaded ad assets by type and placement",
    cron: "0 */6 * * *",
    enabled: false,
    task: null,
    lastRun: null,
    runner: () => {},
  },
};

function saveSweepState(): void {
  const state: Record<string, boolean> = {};
  for (const [key, job] of Object.entries(JOBS)) {
    if (!CORE_JOB_KEYS.has(key)) state[key] = job.enabled;
  }
  try { writeFileSync(SWEEP_STATE_PATH, JSON.stringify(state, null, 2)); } catch { /* ignore */ }
}

function loadSweepState(): Record<string, boolean> {
  try { return JSON.parse(readFileSync(SWEEP_STATE_PATH, "utf8")) as Record<string, boolean>; } catch { return {}; }
}

/**
 * Wire up job runners from scheduler.ts.
 * Called once during initialization.
 * Restores previously-enabled sweep jobs from disk.
 */
export function initScheduleJobs(runners: Record<string, () => void>): void {
  for (const [key, fn] of Object.entries(runners)) {
    if (JOBS[key]) {
      JOBS[key].runner = fn;
    }
  }

  const saved = loadSweepState();
  for (const [key, enabled] of Object.entries(saved)) {
    if (enabled && JOBS[key] && !CORE_JOB_KEYS.has(key)) {
      enableJob(key);
    }
  }
}

// --- Job Control ----------------------------------------------------------

/** Core jobs started unconditionally by scheduler.ts -- cannot be toggled via the schedule UI. */
const CORE_JOB_KEYS = new Set(["heartbeat", "tm-sync", "meta-sync", "think", "health-check", "eata-sync", "eata-cookie-refresh", "tm-cookie-refresh", "email-check"]);

function isCoreJob(jobKey: string): boolean {
  return CORE_JOB_KEYS.has(jobKey);
}

type RuntimeMode = "auto" | "manual" | "optional-on" | "optional-off";

interface JobStatusView {
  mode: RuntimeMode;
  icon: string;
  label: string;
  note: string;
  lastRunLabel: string;
}

function buildRuntimeManagedNote(jobKey: string): string {
  switch (jobKey) {
    case "tm-sync":
    case "tm-cookie-refresh":
      return TM_SCHEDULER_ENABLED
        ? "Runtime-managed core cron is active."
        : "Runtime-managed core cron is paused by env; this job is manual-only.";
    case "eata-sync":
    case "eata-cookie-refresh":
      return EATA_SCHEDULER_ENABLED
        ? "Runtime-managed core cron is active."
        : "Runtime-managed core cron is paused by env; this job is manual-only.";
    case "meta-sync":
    case "think":
      return SCHEDULED_OWNER_NOTIFICATIONS
        ? "Runtime-managed core cron is active and owner notifications are enabled."
        : "Runtime-managed core cron is active; owner notifications are muted unless run manually.";
    default:
      return "Runtime-managed core cron is active.";
  }
}

function getJobStatusView(jobKey: string, job: ScheduleJob): JobStatusView {
  if (!isCoreJob(jobKey)) {
    return job.enabled
      ? {
          mode: "optional-on",
          icon: "🟢",
          label: "ON",
          note: "Optional cron is enabled from the schedule panel.",
          lastRunLabel: job.lastRun
            ? job.lastRun.toISOString().replace("T", " ").slice(0, 19) + " UTC"
            : "never",
        }
      : {
          mode: "optional-off",
          icon: "🔴",
          label: "OFF",
          note: "Optional cron is disabled, but you can still trigger it manually.",
          lastRunLabel: job.lastRun
            ? job.lastRun.toISOString().replace("T", " ").slice(0, 19) + " UTC"
            : "never",
        };
  }

  const runtimeActive = (() => {
    if (jobKey === "tm-sync" || jobKey === "tm-cookie-refresh") return TM_SCHEDULER_ENABLED;
    if (jobKey === "eata-sync" || jobKey === "eata-cookie-refresh") return EATA_SCHEDULER_ENABLED;
    return true;
  })();

  return runtimeActive
    ? {
        mode: "auto",
        icon: "🔵",
        label: "AUTO",
        note: buildRuntimeManagedNote(jobKey),
        lastRunLabel: "runtime-managed",
      }
    : {
        mode: "manual",
        icon: "🟡",
        label: "MANUAL",
        note: buildRuntimeManagedNote(jobKey),
        lastRunLabel: "manual-only",
      };
}

function describeCoreJobState(jobKey: string, job: ScheduleJob): string {
  const status = getJobStatusView(jobKey, job);
  if (status.mode === "auto") {
    return `**${job.name}** is runtime-managed and currently AUTO. ${status.note}`;
  }

  return `**${job.name}** is runtime-managed and currently MANUAL. ${status.note}`;
}

function enableJob(jobKey: string): string {
  const job = JOBS[jobKey];
  if (!job) return `Unknown job: ${jobKey}`;
  if (isCoreJob(jobKey)) return describeCoreJobState(jobKey, job);
  if (job.enabled) return `${job.name} is already enabled.`;

  job.enabled = true;
  job.task = cron.schedule(job.cron, () => {
    job.lastRun = new Date();
    job.runner();
  });
  saveSweepState();
  postToFeed(`Schedule: enabled **${job.name}** (${job.cron})`);
  return `Enabled **${job.name}** (${job.cron})`;
}

function disableJob(jobKey: string): string {
  const job = JOBS[jobKey];
  if (!job) return `Unknown job: ${jobKey}`;
  if (isCoreJob(jobKey)) return describeCoreJobState(jobKey, job);
  if (!job.enabled) return `${job.name} is already disabled.`;

  job.enabled = false;
  if (job.task) {
    job.task.stop();
    job.task = null;
  }
  saveSweepState();
  postToFeed(`Schedule: disabled **${job.name}**`);
  return `Disabled **${job.name}**`;
}

function enableAll(): string {
  const results: string[] = [];
  for (const key of Object.keys(JOBS)) {
    if (!isCoreJob(key)) results.push(enableJob(key));
  }
  return results.join("\n");
}

function disableAll(): string {
  const results: string[] = [];
  for (const key of Object.keys(JOBS)) {
    if (!isCoreJob(key)) results.push(disableJob(key));
  }
  return results.join("\n");
}

// --- Schedule Embed -------------------------------------------------------

function buildScheduleEmbed(): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle("Scheduled Jobs")
    .setColor(0xffa726)
    .setDescription(
      "Use these commands in #schedule:\n" +
      "`!schedule list` -- show this panel\n" +
      "`!enable <job>` -- enable an optional job\n" +
      "`!disable <job>` -- disable an optional job\n" +
      "`!enable-all` -- enable all optional jobs\n" +
      "`!disable-all` -- disable all optional jobs\n\n" +
      "Core jobs are runtime-managed and show as `AUTO` or `MANUAL` here."
    )
    .setTimestamp();

  for (const [key, job] of Object.entries(JOBS)) {
    const status = getJobStatusView(key, job);
    embed.addFields({
      name: `${status.icon} ${job.name} [${status.label}] (\`${key}\`)`,
      value: `${job.description}\nCron: \`${job.cron}\` | Last run: ${status.lastRunLabel}\n${status.note}`,
      inline: false,
    });
  }

  if (!SCHEDULED_OWNER_NOTIFICATIONS) {
    embed.setFooter({
      text: "Background scheduler owner notifications are muted. Manual runs still notify.",
    });
  }

  return embed;
}

// --- Command Handler ------------------------------------------------------

/**
 * Handle schedule commands in #schedule channel.
 * Returns response text, or null if the message wasn't a schedule command.
 */
export async function handleScheduleCommand(
  content: string,
  client: Client,
  channelName: string,
): Promise<{ text?: string; embed?: EmbedBuilder; buttons?: boolean } | null> {
  // Only respond in #schedule
  if (channelName !== "schedule") return null;

  const lower = content.toLowerCase().trim();

  if (lower === "!schedule" || lower === "!schedule list") {
    return { embed: buildScheduleEmbed(), buttons: true };
  }

  if (lower.startsWith("!enable-all")) {
    const result = enableAll();
    return { text: result, embed: buildScheduleEmbed(), buttons: true };
  }

  if (lower.startsWith("!disable-all")) {
    const result = disableAll();
    return { text: result, embed: buildScheduleEmbed(), buttons: true };
  }

  const enableMatch = lower.match(/^!enable\s+(.+)$/);
  if (enableMatch) {
    const jobKey = enableMatch[1].trim();
    const result = enableJob(jobKey);
    return { text: result };
  }

  const disableMatch = lower.match(/^!disable\s+(.+)$/);
  if (disableMatch) {
    const jobKey = disableMatch[1].trim();
    const result = disableJob(jobKey);
    return { text: result };
  }

  // Not a schedule command -- show help
  return {
    text: "Schedule commands: `!schedule list`, `!enable <job>`, `!disable <job>`, `!enable-all`, `!disable-all` (optional jobs only; core jobs are runtime-managed).",
  };
}
