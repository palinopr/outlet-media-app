/**
 * discord-delegate.ts -- Boss delegation system.
 *
 * After Boss responds, scan the response for delegation directives.
 * Pattern: @agent-name <task description>
 *
 * When found, send the task to the target agent's channel as a bot message,
 * then process it through that agent's prompt. Results post back to both
 * the target channel and #boss.
 */

import { type Client, type TextChannel, EmbedBuilder } from "discord.js";
import { getAgentForChannel } from "./discord-router.js";
import { runClaude } from "./runner.js";
import { state } from "./state.js";

const GUILD_ID = "1340092028280770693";

/** Agent names that Boss can delegate to, mapped to channel names */
const DELEGATE_TARGETS: Record<string, string> = {
  "media-buyer": "media-buyer",
  "tm-agent": "tm-data",
  "tm-data": "tm-data",
  "creative": "creative",
  "creative-agent": "creative",
  "reporting": "dashboard",
  "reporting-agent": "dashboard",
  "client-manager": "zamora",
  "zamora": "zamora",
  "kybba": "kybba",
};

interface Delegation {
  target: string;       // agent name as written
  channelName: string;  // resolved channel name
  task: string;         // the task to delegate
}

/**
 * Parse delegation directives from Boss's response.
 * Format: @agent-name task description (on its own line or inline)
 */
export function parseDelegations(text: string): Delegation[] {
  const delegations: Delegation[] = [];
  // Match @agent-name followed by task text
  const pattern = /@([\w-]+)\s+(.+?)(?:\n|$)/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const target = match[1].toLowerCase();
    const task = match[2].trim();
    const channelName = DELEGATE_TARGETS[target];

    if (channelName && task.length > 5) {
      delegations.push({ target, channelName, task });
    }
  }

  return delegations;
}

/**
 * Execute a delegation: send the task to the target agent, run it,
 * and post results to both the target channel and #boss.
 */
async function executeDelegation(
  client: Client,
  delegation: Delegation,
): Promise<string> {
  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) return "Guild not found";

  const targetChannel = guild.channels.cache.find(
    c => c.name === delegation.channelName && c.isTextBased()
  ) as TextChannel | undefined;

  if (!targetChannel) return `Channel #${delegation.channelName} not found`;

  // Post the delegated task to the target channel
  const taskEmbed = new EmbedBuilder()
    .setTitle("Delegated Task from Boss")
    .setColor(0xffa726)
    .setDescription(delegation.task)
    .setTimestamp();

  await targetChannel.send({ embeds: [taskEmbed] });

  // Run the task through the target agent
  const agent = getAgentForChannel(delegation.channelName);
  const result = await runClaude({
    prompt: `[DELEGATED FROM BOSS] ${delegation.task}`,
    systemPromptName: agent.promptFile,
    maxTurns: agent.maxTurns,
  });

  const responseText = result.text || "No response.";

  // Post result to target channel
  const resultPreview = responseText.slice(0, 1900);
  await targetChannel.send(`**Result:**\n${resultPreview}`);

  return responseText;
}

/** Prevent cascading delegations (agent A -> B -> C) */
let delegationActive = false;

/** Max delegations per response to prevent runaway chains */
const MAX_DELEGATIONS_PER_RESPONSE = 3;

/**
 * Process delegations from any agent response.
 * Any named agent can delegate to another with @agent-name.
 * Fire-and-forget -- runs delegations sequentially to avoid overload.
 *
 * @param sourceChannel - the channel where the delegating agent responded
 */
export async function processDelegations(
  client: Client,
  agentResponse: string,
  sourceChannel: string = "boss",
): Promise<void> {
  // Prevent cascading: if we're already inside a delegation, don't start another
  if (delegationActive) return;

  // Filter out self-delegation and cap count
  const delegations = parseDelegations(agentResponse)
    .filter(d => d.channelName !== sourceChannel)
    .slice(0, MAX_DELEGATIONS_PER_RESPONSE);

  if (delegations.length === 0) return;

  // Lazy import to avoid circular dependency
  const { notifyChannel } = await import("./discord.js");

  const sourceLabel = sourceChannel === "boss" ? "Boss" : `#${sourceChannel}`;
  await notifyChannel(
    "agent-feed",
    `${sourceLabel} delegating ${delegations.length} task(s): ${delegations.map(d => `@${d.target}`).join(", ")}`,
  );

  delegationActive = true;
  try {
    for (const delegation of delegations) {
      if (state.jobRunning || state.thinkRunning) {
        await notifyChannel(sourceChannel, `Skipped delegation to @${delegation.target} -- agent is busy.`);
        continue;
      }

      state.jobRunning = true;
      try {
        const result = await executeDelegation(client, delegation);

        // Report back to the source channel (not always #boss)
        const summary = result.slice(0, 500);
        await notifyChannel(sourceChannel, `**@${delegation.target} completed:**\n${summary}`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        await notifyChannel(sourceChannel, `Delegation to @${delegation.target} failed: ${msg}`);
      } finally {
        state.jobRunning = false;
      }
    }
  } finally {
    delegationActive = false;
  }
}
