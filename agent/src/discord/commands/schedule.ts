/**
 * discord-schedule.ts -- Schedule channel management.
 *
 * Commands for viewing, enabling, and disabling scheduled jobs
 * from the #schedule channel in Discord.
 *
 * Jobs can be individually toggled. When enabled, they use cron.
 * When disabled, they can still be triggered manually from agent channels.
 */

import cron, { type ScheduledTask } from "node-cron";
import { EmbedBuilder, type Client } from "discord.js";

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
};

/**
 * Wire up job runners from scheduler.ts.
 * Called once during initialization.
 */
export function initScheduleJobs(runners: Record<string, () => void>): void {
  for (const [key, fn] of Object.entries(runners)) {
    if (JOBS[key]) {
      JOBS[key].runner = fn;
    }
  }
}

// --- Job Control ----------------------------------------------------------

function enableJob(jobKey: string): string {
  const job = JOBS[jobKey];
  if (!job) return `Unknown job: ${jobKey}`;
  if (job.enabled) return `${job.name} is already enabled.`;

  job.enabled = true;
  job.task = cron.schedule(job.cron, () => {
    job.lastRun = new Date();
    job.runner();
  });
  postToFeed(`Schedule: enabled **${job.name}** (${job.cron})`).catch(() => {});
  return `Enabled **${job.name}** (${job.cron})`;
}

function disableJob(jobKey: string): string {
  const job = JOBS[jobKey];
  if (!job) return `Unknown job: ${jobKey}`;
  if (!job.enabled) return `${job.name} is already disabled.`;

  job.enabled = false;
  if (job.task) {
    job.task.stop();
    job.task = null;
  }
  postToFeed(`Schedule: disabled **${job.name}**`).catch(() => {});
  return `Disabled **${job.name}**`;
}

function enableAll(): string {
  const results: string[] = [];
  for (const key of Object.keys(JOBS)) {
    results.push(enableJob(key));
  }
  return results.join("\n");
}

function disableAll(): string {
  const results: string[] = [];
  for (const key of Object.keys(JOBS)) {
    results.push(disableJob(key));
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
      "`!enable <job>` -- enable a job\n" +
      "`!disable <job>` -- disable a job\n" +
      "`!enable-all` -- enable all jobs\n" +
      "`!disable-all` -- disable all jobs"
    )
    .setTimestamp();

  for (const [key, job] of Object.entries(JOBS)) {
    const status = job.enabled ? "ON" : "OFF";
    const lastRun = job.lastRun
      ? job.lastRun.toISOString().replace("T", " ").slice(0, 19) + " UTC"
      : "never";
    embed.addFields({
      name: `${status === "ON" ? "🟢" : "🔴"} ${job.name} (\`${key}\`)`,
      value: `${job.description}\nCron: \`${job.cron}\` | Last run: ${lastRun}`,
      inline: false,
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
    text: "Schedule commands: `!schedule list`, `!enable <job>`, `!disable <job>`, `!enable-all`, `!disable-all`",
  };
}
