/**
 * discord-supervisor.ts -- Boss supervision loop.
 *
 * Reads recent durable agent activity from system_events, sends it to Claude
 * CLI with the boss.txt prompt to generate a summary + directives across all
 * agent channels.
 * Posts the result as a rich embed to #boss.
 *
 * Triggered by `!supervise` command in #boss.
 */

import { EmbedBuilder, type Client } from "discord.js";
import { runClaude } from "../../runner.js";
import { listRecentAgentActivity } from "../../services/system-events-service.js";
import { isAgentBusy, setAgentBusy, clearAgentBusy } from "../../state.js";

/**
 * Read recent durable activity and build a context string for Boss.
 */
async function loadActivitySummary(): Promise<string> {
  const events = await listRecentAgentActivity({ limit: 40, visibility: "admin_only" });
  if (events.length === 0) {
    return "No recent activity recorded in system_events.";
  }

  const byChannel = new Map<string, string[]>();
  const taskLines: string[] = [];

  for (const event of events) {
    const ts = event.occurredAt.slice(0, 16);
    if (event.eventName === "discord_agent_turn_logged") {
      const channel = typeof event.metadata.channel === "string" ? event.metadata.channel : (event.entityId ?? "unknown");
      const user = typeof event.metadata.user === "string" ? event.metadata.user : "unknown";
      const responseSummary =
        typeof event.metadata.responseSummary === "string"
          ? event.metadata.responseSummary
          : event.summary;
      const lines = byChannel.get(channel) ?? [];
      lines.push(`[${ts}] ${user}: "${responseSummary.slice(0, 180)}"`);
      byChannel.set(channel, lines);
      continue;
    }

    taskLines.push(`[${ts}] ${event.summary}`);
  }

  const lines: string[] = [`Recent durable activity (${events.length} events):\n`];
  for (const [channel, items] of byChannel) {
    lines.push(`## #${channel} (${items.length} turns)`);
    for (const item of items.slice(0, 5)) {
      lines.push(`  ${item}`);
    }
    lines.push("");
  }

  if (taskLines.length > 0) {
    lines.push("## Task lifecycle");
    for (const item of taskLines.slice(0, 12)) {
      lines.push(`  ${item}`);
    }
  }

  return lines.join("\n");
}

/**
 * Run the Boss supervision cycle.
 * Returns the supervision report text.
 */
export async function runSupervision(): Promise<string> {
  const activityContext = await loadActivitySummary();

  const supervisePrompt = [
    "You are running a SUPERVISION CYCLE. Review all agent activity below and produce:",
    "1. A brief status summary of each agent channel (1-2 sentences each)",
    "2. Any concerns or issues you notice (stale channels, errors, unusual patterns)",
    "3. Directives for agents that need attention",
    "4. Overall team health assessment (green/yellow/red)",
    "",
    "Keep it concise -- this goes into a Discord embed.",
    "",
    "--- DURABLE ACTIVITY TIMELINE ---",
    activityContext,
    "--- END TIMELINE ---",
  ].join("\n");

  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("Supervisor timed out after 3 minutes")), 180_000);
  });
  const result = await Promise.race([
    runClaude({
      prompt: supervisePrompt,
      systemPromptName: "boss",
      maxTurns: 5,
    }).then((v) => { clearTimeout(timer!); return v; }),
    timeout,
  ]);

  return result.text || "Supervision cycle completed with no output.";
}

/**
 * Build a supervision embed from the Boss response.
 */
function buildSupervisionEmbed(report: string): EmbedBuilder {
  // Try to extract health status from the report
  let color = 0x4caf50; // green default
  const lower = report.toLowerCase();
  if (lower.includes("red") && lower.includes("health")) color = 0xf44336;
  else if (lower.includes("yellow") && lower.includes("health")) color = 0xff9800;

  const embed = new EmbedBuilder()
    .setTitle("Boss Supervision Report")
    .setColor(color)
    .setDescription(report.slice(0, 4000)) // embed description max is 4096
    .setTimestamp()
    .setFooter({ text: "Triggered by !supervise" });

  return embed;
}

/**
 * Handle the !supervise command. Posts supervision report to #boss.
 */
export async function handleSuperviseCommand(
  _client: Client,
): Promise<{ text: string; embed: EmbedBuilder }> {
  if (isAgentBusy("discord-admin")) {
    return {
      text: "Another admin task is already running. Try again shortly.",
      embed: new EmbedBuilder()
        .setTitle("Supervision Skipped")
        .setColor(0x9e9e9e)
        .setDescription("Another admin task is running. Retry in a moment."),
    };
  }

  setAgentBusy("discord-admin");
  try {
    const report = await runSupervision();
    const embed = buildSupervisionEmbed(report);
    return { text: "", embed };
  } finally {
    clearAgentBusy("discord-admin");
  }
}
