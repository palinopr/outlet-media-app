/**
 * discord-supervisor.ts -- Boss supervision loop.
 *
 * Reads session/activity-log.json, sends it to Claude CLI with the boss.txt
 * prompt to generate a summary + directives across all agent channels.
 * Posts the result as a rich embed to #boss.
 *
 * Triggered by `!supervise` command in #boss.
 */

import { EmbedBuilder, type Client } from "discord.js";
import { readFile } from "node:fs/promises";
import { runClaude } from "../../runner.js";
import { isAgentBusy, setAgentBusy, clearAgentBusy } from "../../state.js";

const ACTIVITY_LOG = "session/activity-log.json";

interface ActivityEntry {
  ts: string;
  channel: string;
  user: string;
  message: string;
  agent: string;
  responseSummary: string;
}

/**
 * Read the activity log and build a context string for Boss.
 */
async function loadActivitySummary(): Promise<string> {
  try {
    const raw = await readFile(ACTIVITY_LOG, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    const entries = Array.isArray(parsed) ? (parsed as ActivityEntry[]) : [];

    if (entries.length === 0) return "No activity recorded yet.";

    // Group by channel for a clean summary
    const byChannel = new Map<string, ActivityEntry[]>();
    for (const e of entries) {
      const list = byChannel.get(e.channel) ?? [];
      list.push(e);
      byChannel.set(e.channel, list);
    }

    const lines: string[] = [`Activity log (${entries.length} entries):\n`];
    for (const [channel, items] of byChannel) {
      lines.push(`## #${channel} (${items.length} messages)`);
      // Show last 5 per channel to keep context reasonable
      for (const item of items.slice(-5)) {
        lines.push(
          `  [${item.ts}] ${item.user}: "${item.message}" -> ${item.agent}: "${item.responseSummary}"`
        );
      }
      lines.push("");
    }

    return lines.join("\n");
  } catch {
    return "No activity log found. Agents have not processed any messages yet.";
  }
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
    "--- ACTIVITY LOG ---",
    activityContext,
    "--- END LOG ---",
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
