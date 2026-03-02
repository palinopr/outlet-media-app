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

/** Agent names that can receive delegations, mapped to channel names */
const DELEGATE_TARGETS: Record<string, string> = {
  "boss": "boss",
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
      const parsed = JSON.parse(match[1]) as DelegationBlock;
      if (parsed.delegate && parsed.action) {
        blocks.push(parsed);
        cleanText = cleanText.replace(match[0], "").trim();
      }
    } catch {
      // Invalid JSON, skip
    }
  }

  // Also match inline JSON (no fences) as fallback
  const inlinePattern = /\{[^{}]*?"delegate"\s*:\s*"[^"]+?"[^{}]*?"action"\s*:\s*"[^"]+?"[^{}]*?\}/g;
  while ((match = inlinePattern.exec(text)) !== null) {
    // Skip if already captured by fenced pattern
    if (blocks.some(b => JSON.stringify(b) === match![1])) continue;
    try {
      const parsed = JSON.parse(match[0]) as DelegationBlock;
      if (parsed.delegate && parsed.action && !blocks.some(b => b.delegate === parsed.delegate && b.action === parsed.action)) {
        blocks.push(parsed);
        cleanText = cleanText.replace(match[0], "").trim();
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
 * Process delegation blocks from an agent response.
 * Enqueues tasks via queue-service, posts notifications.
 */
export async function processDelegations(
  client: Client,
  agentResponse: string,
  sourceChannel: string = "boss",
  depth: number = 0,
): Promise<{ cleanText: string; delegated: number }> {
  if (depth >= MAX_DELEGATION_DEPTH) {
    return { cleanText: agentResponse, delegated: 0 };
  }

  const { blocks, cleanText } = parseDelegationBlocks(agentResponse);
  if (blocks.length === 0) {
    return { cleanText: agentResponse, delegated: 0 };
  }

  // Determine source agent from channel
  const sourceAgent = getAgentForChannel(sourceChannel);
  const fromAgent = sourceAgent.promptFile;

  const guild = client.guilds.cache.first();

  for (const block of blocks) {
    const targetChannel = DELEGATE_TARGETS[block.delegate];
    if (!targetChannel) {
      console.warn(`[delegate] Unknown target: ${block.delegate}`);
      continue;
    }

    // Don't delegate to self
    if (targetChannel === sourceChannel) continue;

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

  return { cleanText, delegated: blocks.length };
}

/**
 * Execute a delegated task by running Claude with the target agent's prompt.
 */
async function executeDelegatedTask(
  client: Client,
  task: AgentTask,
  sourceChannel: string,
  depth: number,
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

    const responseText = result.text || "No response.";

    // Check if the delegated agent also wants to delegate (recursive, depth-limited)
    const { cleanText } = await processDelegations(client, responseText, targetChannel, depth + 1);

    completeTask(task.id, { text: cleanText });

    // Post result to target channel via webhook
    const summary = cleanText.slice(0, 1900);
    await sendAsAgent(task.to, targetChannel, `**Task ${task.action} completed:**\n${summary}`).catch(() => {});

    // Notify source
    const shortSummary = cleanText.slice(0, 500);
    await notifyChannel(sourceChannel, `**${task.to} completed ${task.action}:**\n${shortSummary}`).catch(() => {});
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    failTask(task.id, errMsg);
    await notifyChannel(sourceChannel, `Delegation to ${task.to} failed: ${errMsg}`).catch(() => {});
  }
}
