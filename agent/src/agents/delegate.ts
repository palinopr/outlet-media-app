/**
 * delegate.ts -- Structured task delegation via JSON blocks.
 *
 * Replaces the regex-based @agent-name delegation system.
 * Agents output JSON blocks to delegate tasks:
 *
 * ```json
 * {"delegate": "media-buyer", "action": "check-roas", "params": {"threshold": 2.0}}
 * ```
 *
 * These blocks are parsed, stripped from display text, and enqueued
 * via queue-service for concurrent execution.
 */

import { type Client, EmbedBuilder, type TextChannel, ChannelType } from "discord.js";
import { enqueueTask, type AgentTask } from "../services/queue-service.js";
import { evaluateTier } from "../services/approval-service.js";
import { sendAsAgent } from "../services/webhook-service.js";
import { runClaude } from "../runner.js";
import { getAgentForChannel } from "../discord/core/router.js";
import { WHITELISTED_CHANNELS } from "../discord/features/restructure.js";

/** Max delegations per response to prevent runaway chains */
const MAX_DELEGATIONS_PER_RESPONSE = 5;

/** Max depth for cascading delegations (A -> B -> C) */
const MAX_DELEGATION_DEPTH = 2;

interface DelegationBlock {
  delegate: string;
  action: string;
  params?: Record<string, unknown>;
  tier?: "green" | "yellow" | "red";
}

interface ChannelMessageBlock {
  channel: string;
  message: string;
  handoff?: boolean;
  tier?: "green" | "yellow" | "red";
}

const CHANNEL_ALIASES: Record<string, string> = {
  "calendar": "meetings",
  "meeting": "meetings",
  "meeting-agent": "meetings",
  "hq-dashboard": "dashboard",
  "performance": "dashboard",
  "alerts": "agent-feed",
  "logs": "agent-feed",
  "email-logs": "email-log",
  "active-jobs": "agent-feed",
  "agent-alerts": "agent-feed",
  "agent-logs": "agent-feed",
  "bot-logs": "agent-feed",
  "meta-api": "media-buyer",
};

/** Agent names that can receive delegations, mapped to channel names */
const DELEGATE_TARGETS: Record<string, string> = {
  "boss": "boss",
  "media-buyer": "media-buyer",
  "tm-agent": "tm-data",
  "tm-data": "tm-data",
  "don-omar-agent": "don-omar-tickets",
  "don-omar-tickets": "don-omar-tickets",
  "creative": "creative",
  "creative-agent": "creative",
  "reporting": "dashboard",
  "reporting-agent": "dashboard",
  "client-manager": "zamora",
  "email-agent": "email",
  "email": "email",
  "meeting-agent": "meetings",
  "meetings": "meetings",
  "calendar": "meetings",
  "zamora": "zamora",
  "kybba": "kybba",
};

const CHANNEL_HANDOFF_TARGETS: Record<string, string> = {
  "boss": "boss",
  "media-buyer": "media-buyer",
  "tm-data": "tm-agent",
  "don-omar-tickets": "don-omar-agent",
  "creative": "creative",
  "dashboard": "reporting",
  "zamora": "client-manager",
  "kybba": "client-manager",
  "email": "email-agent",
  "meetings": "meeting-agent",
};

/**
 * Find inline JSON objects containing "delegate" and "action" keys using
 * balanced-braces walking. Handles nested objects that a flat regex cannot.
 */
function findInlineJsonBlocks(text: string): { match: string; index: number }[] {
  const results: { match: string; index: number }[] = [];
  let i = 0;
  while (i < text.length) {
    if (text[i] === "{") {
      let depth = 1;
      let j = i + 1;
      while (j < text.length && depth > 0) {
        if (text[j] === "{") depth++;
        else if (text[j] === "}") depth--;
        j++;
      }
      if (depth === 0) {
        const candidate = text.slice(i, j);
        if (candidate.includes('"delegate"') && candidate.includes('"action"')) {
          results.push({ match: candidate, index: i });
        }
      }
    }
    i++;
  }
  return results;
}

function normalizeChannelName(value: string): string {
  const normalized = value.trim().replace(/^#/, "").toLowerCase();
  return CHANNEL_ALIASES[normalized] ?? normalized;
}

function getReplyChannel(params: Record<string, unknown>): string | null {
  const raw = typeof params.replyChannel === "string"
    ? params.replyChannel
    : typeof params.reply_channel === "string"
    ? params.reply_channel
    : null;

  if (!raw) return null;
  const normalized = normalizeChannelName(raw);
  return WHITELISTED_CHANNELS.has(normalized) ? normalized : null;
}

/**
 * Parse JSON delegation blocks from Claude output.
 * Looks for ```json blocks containing a "delegate" key.
 */
export function parseDelegationBlocks(text: string): { blocks: DelegationBlock[]; cleanText: string } {
  const blocks: DelegationBlock[] = [];
  let cleanText = text;

  // Match fenced JSON code blocks
  const fencedPattern = /```json\s*\n?\s*(\{[^`]*?"delegate"[^`]*?\})\s*\n?\s*```/g;
  let match: RegExpExecArray | null;

  while ((match = fencedPattern.exec(text)) !== null) {
    try {
      const raw: unknown = JSON.parse(match[1]);
      if (raw && typeof raw === "object" && "delegate" in raw && "action" in raw) {
        const parsed = raw as DelegationBlock;
        blocks.push(parsed);
        cleanText = cleanText.replace(match[0], "").trim();
      }
    } catch {
      // Invalid JSON, skip
    }
  }

  // Also match inline JSON (no fences) as fallback, using balanced-braces walker
  for (const hit of findInlineJsonBlocks(text)) {
    try {
      const raw: unknown = JSON.parse(hit.match);
      if (raw && typeof raw === "object" && "delegate" in raw && "action" in raw) {
        const parsed = raw as DelegationBlock;
        if (!blocks.some(b => b.delegate === parsed.delegate && b.action === parsed.action)) {
          blocks.push(parsed);
          cleanText = cleanText.replace(hit.match, "").trim();
        }
      }
    } catch {
      // Invalid JSON, skip
    }
  }

  // Clean up extra newlines left by removal
  cleanText = cleanText.replace(/\n{3,}/g, "\n\n").trim();

  return { blocks: blocks.slice(0, MAX_DELEGATIONS_PER_RESPONSE), cleanText };
}

/**
 * Parse fenced or inline JSON channel-message blocks from Claude output.
 */
export function parseChannelMessageBlocks(text: string): {
  blocks: ChannelMessageBlock[];
  cleanText: string;
} {
  const blocks: ChannelMessageBlock[] = [];
  let cleanText = text;

  const fencedPattern = /```json\s*\n?\s*(\{[^`]*?"channel"[^`]*?"message"[^`]*?\})\s*\n?\s*```/g;
  let match: RegExpExecArray | null;

  while ((match = fencedPattern.exec(text)) !== null) {
    try {
      const raw: unknown = JSON.parse(match[1]);
      if (raw && typeof raw === "object" && "channel" in raw && "message" in raw) {
        const parsed = raw as ChannelMessageBlock;
        blocks.push(parsed);
        cleanText = cleanText.replace(match[0], "").trim();
      }
    } catch {
      // Invalid JSON, skip
    }
  }

  for (const hit of findInlineJsonBlocks(text)) {
    try {
      const raw: unknown = JSON.parse(hit.match);
      if (raw && typeof raw === "object" && "channel" in raw && "message" in raw) {
        const parsed = raw as ChannelMessageBlock;
        if (!blocks.some((block) => block.channel === parsed.channel && block.message === parsed.message)) {
          blocks.push(parsed);
          cleanText = cleanText.replace(hit.match, "").trim();
        }
      }
    } catch {
      // Invalid JSON, skip
    }
  }

  cleanText = cleanText.replace(/\n{3,}/g, "\n\n").trim();

  return { blocks: blocks.slice(0, MAX_DELEGATIONS_PER_RESPONSE), cleanText };
}

/**
 * Process delegation blocks from an agent response.
 * Enqueues tasks via queue-service, posts notifications.
 */
export async function processDelegations(
  client: Client,
  agentResponse: string,
  sourceChannel: string = "boss",
  depth: number = 0,
): Promise<{ cleanText: string; delegated: number; targets: string[] }> {
  if (depth >= MAX_DELEGATION_DEPTH) {
    return { cleanText: agentResponse, delegated: 0, targets: [] };
  }

  const { blocks, cleanText } = parseDelegationBlocks(agentResponse);
  if (blocks.length === 0) {
    return { cleanText: agentResponse, delegated: 0, targets: [] };
  }

  // Determine source agent from channel
  const sourceAgent = getAgentForChannel(sourceChannel);
  const fromAgent = sourceAgent.promptFile;

  const guild = client.guilds.cache.first();

  const delegatedTargets: string[] = [];

  for (const block of blocks) {
    const targetChannel = DELEGATE_TARGETS[block.delegate];
    if (!targetChannel) {
      console.warn(`[delegate] Unknown target: ${block.delegate}`);
      continue;
    }

    // Don't delegate to self
    if (targetChannel === sourceChannel) continue;
    delegatedTargets.push(targetChannel);

    const tier = block.tier ?? "green";
    const task = enqueueTask(
      fromAgent,
      block.delegate,
      block.action,
      block.params ?? {},
      tier,
    );

    // Post delegation notification to target channel
    if (guild) {
      const channel = guild.channels.cache.find(
        c => c.name === targetChannel && c.type === ChannelType.GuildText
      ) as TextChannel | undefined;

      if (channel) {
        const embed = new EmbedBuilder()
          .setTitle("Delegated Task")
          .setColor(tier === "red" ? 0xf44336 : tier === "yellow" ? 0xffa726 : 0x4caf50)
          .addFields(
            { name: "From", value: fromAgent, inline: true },
            { name: "Action", value: block.action, inline: true },
            { name: "Tier", value: tier.toUpperCase(), inline: true },
          )
          .setDescription(
            block.params ? JSON.stringify(block.params, null, 2).slice(0, 1000) : "No parameters"
          )
          .setFooter({ text: `Task: ${task.id}` })
          .setTimestamp();

        await sendAsAgent(fromAgent, targetChannel, { embeds: [embed] }).catch(() => {
          channel.send({ embeds: [embed] }).catch(() => {});
        });
      }
    }

    // Evaluate tier and execute if green
    const decision = evaluateTier(task);
    if (decision === "execute") {
      executeDelegatedTask(client, task, sourceChannel, depth).catch(err => {
        console.error(`[delegate] Task ${task.id} execution failed:`, err);
      });
    }
    // If "escalate", the approval service will handle it via taskEvents
  }

  // Notify agent-feed
  const { notifyChannel } = await import("../discord/core/entry.js");
  const targets = blocks.map(b => b.delegate).join(", ");
  await notifyChannel("agent-feed", `**${fromAgent}** delegated ${blocks.length} task(s) to: ${targets}`).catch(() => {});

  return { cleanText, delegated: blocks.length, targets: delegatedTargets };
}

/**
 * Process channel-message blocks from an agent response.
 * Posts the message into the requested Discord channel as the source agent.
 */
export async function processChannelMessages(
  client: Client,
  agentResponse: string,
  sourceChannel: string = "boss",
  depth: number = 0,
): Promise<{
  cleanText: string;
  posted: number;
  targets: string[];
  handedOff: number;
  handoffTargets: string[];
}> {
  const { blocks, cleanText } = parseChannelMessageBlocks(agentResponse);
  if (blocks.length === 0) {
    return {
      cleanText: agentResponse,
      posted: 0,
      targets: [],
      handedOff: 0,
      handoffTargets: [],
    };
  }

  if (!client.guilds.cache.first()) {
    return { cleanText, posted: 0, targets: [], handedOff: 0, handoffTargets: [] };
  }

  const sourceAgent = getAgentForChannel(sourceChannel);
  const fromAgent = sourceAgent.promptFile;
  const postedTargets: string[] = [];
  const handoffTargets: string[] = [];

  for (const block of blocks) {
    const targetChannel = normalizeChannelName(block.channel);
    if (!WHITELISTED_CHANNELS.has(targetChannel)) {
      console.warn(`[channel-action] Unknown target channel: ${block.channel}`);
      continue;
    }

    await sendAsAgent(fromAgent, targetChannel, block.message).catch(async () => {
      const { notifyChannel } = await import("../discord/core/entry.js");
      await notifyChannel(targetChannel, block.message);
    });
    postedTargets.push(targetChannel);

    if (block.handoff) {
      if (depth >= MAX_DELEGATION_DEPTH) {
        console.warn(`[channel-action] Max handoff depth reached for #${targetChannel}`);
        continue;
      }

      const delegateTarget = CHANNEL_HANDOFF_TARGETS[targetChannel];
      if (!delegateTarget) {
        console.warn(`[channel-action] No handoff target for channel: ${targetChannel}`);
        continue;
      }

      if (targetChannel === sourceChannel) {
        console.warn(`[channel-action] Ignoring self-handoff for #${targetChannel}`);
        continue;
      }

      const tier = block.tier ?? "green";
      const task = enqueueTask(
        fromAgent,
        delegateTarget,
        "channel-handoff",
        {
          message: block.message,
          sourceChannel,
          targetChannel,
        },
        tier,
      );

      handoffTargets.push(targetChannel);

      const decision = evaluateTier(task);
      if (decision === "execute") {
        executeDelegatedTask(client, task, sourceChannel, depth + 1, { notifySource: false }).catch((err) => {
          console.error(`[channel-action] Handoff ${task.id} execution failed:`, err);
        });
      }
    }
  }

  return {
    cleanText,
    posted: postedTargets.length,
    targets: postedTargets,
    handedOff: handoffTargets.length,
    handoffTargets,
  };
}

/**
 * Execute a delegated task by running Claude with the target agent's prompt.
 */
async function executeDelegatedTask(
  client: Client,
  task: AgentTask,
  sourceChannel: string,
  depth: number,
  options?: {
    notifySource?: boolean;
  },
): Promise<void> {
  const { completeTask, failTask } = await import("../services/queue-service.js");
  const { notifyChannel } = await import("../discord/core/entry.js");

  const targetChannel = DELEGATE_TARGETS[task.to];
  if (!targetChannel) {
    failTask(task.id, `Unknown target agent: ${task.to}`);
    return;
  }

  const agent = getAgentForChannel(targetChannel);

  try {
    const result = await runClaude({
      prompt: `[DELEGATED TASK from ${task.from}]\nAction: ${task.action}\nParameters: ${JSON.stringify(task.params)}`,
      systemPromptName: agent.promptFile,
      maxTurns: agent.maxTurns,
    });

    let responseText = result.text || "No response.";
    const actionNotes: string[] = [];

    const channelMessages = await processChannelMessages(client, responseText, targetChannel, depth + 1);
    responseText = channelMessages.cleanText;
    if (channelMessages.posted > 0) {
      const targets = channelMessages.targets.map((target) => `#${target}`).join(", ");
      actionNotes.push(`Posted to ${targets}.`);
    }
    if (channelMessages.handedOff > 0) {
      const targets = channelMessages.handoffTargets.map((target) => `#${target}`).join(", ");
      actionNotes.push(`Handoff queued for ${targets}.`);
    }

    // Check if the delegated agent also wants to delegate (recursive, depth-limited)
    const delegations = await processDelegations(client, responseText, targetChannel, depth + 1);
    responseText = delegations.cleanText;
    if (delegations.delegated > 0) {
      const targets = delegations.targets.map((target) => `#${target}`).join(", ");
      actionNotes.push(`Queued for ${targets}.`);
    }

    const deliveredText = [responseText.trim(), ...actionNotes.map((note) => `_${note}_`)]
      .filter(Boolean)
      .join("\n\n")
      .trim() || "No response.";

    completeTask(task.id, { text: deliveredText });

    // Post result to target channel via webhook
    const summary = deliveredText.slice(0, 1900);
    await sendAsAgent(task.to, targetChannel, `**Task ${task.action} completed:**\n${summary}`).catch(() => {});

    // Notify source
    if (options?.notifySource !== false) {
      const shortSummary = deliveredText.slice(0, 500);
      await notifyChannel(sourceChannel, `**${task.to} completed ${task.action}:**\n${shortSummary}`).catch(() => {});
    }

    const replyChannel = getReplyChannel(task.params);
    if (
      replyChannel &&
      replyChannel !== targetChannel &&
      (options?.notifySource === false || replyChannel !== sourceChannel)
    ) {
      const shortSummary = deliveredText.slice(0, 500);
      await notifyChannel(replyChannel, `**${task.to} completed ${task.action}:**\n${shortSummary}`).catch(() => {});
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    failTask(task.id, errMsg);
    const failureChannel = options?.notifySource === false ? targetChannel : sourceChannel;
    await notifyChannel(failureChannel, `Delegation to ${task.to} failed: ${errMsg}`).catch(() => {});
  }
}
