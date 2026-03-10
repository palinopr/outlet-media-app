/**
 * message-handler.ts -- Routes Discord messages to agents.
 *
 * Extracted from discord.ts monolith. Handles:
 * - Conversation context building (last N messages)
 * - Agent routing via discord-router.ts
 * - Claude CLI execution with streaming updates
 * - Post-response fire-and-forget: memory, skills, delegation scan
 */

import {
  type Client,
  type Message,
  type TextChannel,
} from "discord.js";
import { runClaude } from "../runner.js";
import { getAgentForChannel, type AgentConfig } from "../discord/core/router.js";
import { sendAsAgent } from "../services/webhook-service.js";
import { loadAgentMemory } from "../discord/features/memory.js";
import { getInteractiveRouteResources } from "../services/agent-resource-locks.js";
import { logDiscordAgentTurn } from "../services/system-events-service.js";
import { ResourceBusyError, withResourceLocks } from "../state.js";
import { toErrorMessage } from "../utils/error-helpers.js";

/** Per-channel processing lock to prevent concurrent agent calls */
const channelLocks = new Set<string>();

/** How many recent messages to fetch for conversation context */
const HISTORY_DEPTH = 10;

/** Convert mixed HTML + markdown snippets into Discord-compatible markdown */
export function cleanForDiscord(text: string): string {
  return text
    .replace(/<b>([\s\S]*?)<\/b>/g, "**$1**")
    .replace(/<i>([\s\S]*?)<\/i>/g, "*$1*")
    .replace(/<pre>([\s\S]*?)<\/pre>/g, "```\n$1\n```")
    .replace(/<code>([\s\S]*?)<\/code>/g, "`$1`")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]+>/g, "")
    .replace(/^\|[-:| ]+\|$/gm, "")
    .replace(/^\|(.+)\|$/gm, (_m, row: string) =>
      row.split("|").map((c) => c.trim()).filter(Boolean).join(" - ")
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function chunkText(text: string, maxLen: number): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + maxLen));
    i += maxLen;
  }
  return chunks;
}

function summarizeHistoryAttachments(msg: Message): string {
  if (msg.attachments.size === 0) return "";

  const names = [...msg.attachments.values()]
    .slice(0, 3)
    .map((attachment) => attachment.name);

  const suffix = msg.attachments.size > 3 ? ", ..." : "";
  return `[attachments: ${names.join(", ")}${suffix}]`;
}

/**
 * Check if a channel is currently locked for processing.
 */
export function isChannelLocked(channelId: string): boolean {
  return channelLocks.has(channelId);
}

export function acquireChannelLock(channelId: string): boolean {
  if (channelLocks.has(channelId)) return false;
  channelLocks.add(channelId);
  return true;
}

export function releaseChannelLock(channelId: string): void {
  channelLocks.delete(channelId);
}

/**
 * Fetch recent channel messages and format as conversation context.
 */
async function buildConversationContext(
  msg: Message,
  currentPrompt: string,
): Promise<string> {
  try {
    const channel = msg.channel as TextChannel;
    const fetched = await channel.messages.fetch({ limit: HISTORY_DEPTH + 1 });
    const history = [...fetched.values()]
      .reverse()
      .filter(m => m.id !== msg.id)
      .slice(-HISTORY_DEPTH);

    if (history.length === 0) return currentPrompt;

    const lines = history.map(m => {
      const name = m.author.bot ? (m.author.username || "AGENT") : m.author.username;
      const text = m.content.trim().slice(0, 500);
      const attachmentSummary = summarizeHistoryAttachments(m);
      const body = [text, attachmentSummary].filter(Boolean).join(" ");
      return `${name}: ${body || "[no text]"}`;
    });

    return [
      "[conversation history -- use this for context on follow-up questions]",
      ...lines,
      "---",
      `${msg.author.username}: ${currentPrompt}`,
    ].join("\n");
  } catch {
    return currentPrompt;
  }
}

async function logActivity(
  agentKey: string,
  channel: string,
  user: string,
  message: string,
  agent: string,
  response: string,
  messageId: string,
): Promise<void> {
  const { notifyChannel } = await import("../discord/core/entry.js");
  await logDiscordAgentTurn({
    agentDescription: agent,
    agentKey,
    channel,
    message,
    messageId,
    response,
    user,
  });

  const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
  const feedMsg = `\`${timestamp}\` **#${channel}** (${agent}) -- ${user}: "${message.slice(0, 80)}"`;
  void notifyChannel("agent-feed", feedMsg);
}

/**
 * Build a system prompt with optional server snapshot and agent memory.
 */
async function buildSystemPrompt(agent: AgentConfig): Promise<string | undefined> {
  let systemPrompt: string | undefined;
  if (agent.injectSnapshot) {
    const { buildAdminPrompt } = await import("../discord/commands/admin.js");
    systemPrompt = await buildAdminPrompt(agent.promptFile);
  }

  const memory = await loadAgentMemory(agent.promptFile);
  if (memory) {
    if (systemPrompt) {
      systemPrompt += memory;
    } else {
      const fs = await import("node:fs/promises");
      const path = await import("node:path");
      try {
        const promptPath = path.join(process.cwd(), "prompts", `${agent.promptFile}.txt`);
        const base = await fs.readFile(promptPath, "utf-8");
        systemPrompt = base + memory;
      } catch {
        // Prompt file not found -- let runner handle the fallback
      }
    }
  }
  return systemPrompt;
}

/**
 * Deliver response chunks via webhook, falling back to message edit.
 */
async function deliverResponse(
  agentKey: string,
  channelName: string,
  chunks: string[],
  working: Message,
  msg: Message,
): Promise<void> {
  try {
    await sendAsAgent(agentKey, channelName, chunks[0] || "Done.");
    await working.delete().catch((e) => console.warn("[message-handler] delete failed:", toErrorMessage(e)));
    for (const chunk of chunks.slice(1)) {
      await sendAsAgent(agentKey, channelName, chunk);
    }
  } catch {
    await working.edit(chunks[0] || "Done.").catch((e) => console.warn("[message-handler] edit failed:", toErrorMessage(e)));
    for (const chunk of chunks.slice(1)) {
      if ("send" in msg.channel) await (msg.channel as TextChannel).send(chunk);
    }
  }
}

/**
 * Fire-and-forget post-processing: durable activity event, memory, skills.
 */
function postProcess(
  agentKey: string,
  agent: AgentConfig,
  channelName: string,
  username: string,
  prompt: string,
  responseText: string,
  messageId: string,
): void {
  logActivity(agentKey, channelName, username, prompt, agent.description, responseText, messageId).catch((e) => console.warn("[message-handler] log failed:", toErrorMessage(e)));
  import("../discord/features/memory.js")
    .then(({ maybeUpdateMemory }) => maybeUpdateMemory(agent.promptFile, prompt, responseText))
    .catch((e) => console.warn("[message-handler] memory update failed:", toErrorMessage(e)));
  import("../discord/features/skills.js")
    .then(({ maybeCreateSkill }) => maybeCreateSkill(agent.promptFile, prompt, responseText))
    .catch((e) => console.warn("[message-handler] skill creation failed:", toErrorMessage(e)));
}

/**
 * Route a message to the correct agent and handle the response.
 * Uses per-agent slots instead of global agentBusy lock.
 */
export async function handleMessage(
  msg: Message,
  prompt: string,
  channelName: string,
  discordClient: Client | null,
): Promise<void> {
  const agent = getAgentForChannel(channelName);
  if (agent.readOnly) return;

  const agentKey = agent.promptFile;

  let typingInterval: ReturnType<typeof setInterval> | undefined;
  let working: Message | undefined;

  try {
    const ch = msg.channel;
    if ("sendTyping" in ch) await (ch as TextChannel).sendTyping().catch(() => {});
    typingInterval = setInterval(() => {
      if ("sendTyping" in ch) (ch as TextChannel).sendTyping().catch(() => {});
    }, 8000);

    working = await msg.reply("Working on it...");
    const contextualPrompt = await buildConversationContext(msg, prompt);
    const systemPrompt = await buildSystemPrompt(agent);
    const interactiveResources = getInteractiveRouteResources(channelName, agent.promptFile);

    let buffer = "";
    let lastEdit = Date.now();
    const result = interactiveResources.length > 0
      ? await withResourceLocks(`discord-message:${msg.id}`, interactiveResources, async () => {
          return await runClaude({
            prompt: contextualPrompt,
            systemPromptName: agent.promptFile,
            systemPrompt,
            maxTurns: agent.maxTurns,
            onChunk: async (chunk: string) => {
              buffer += chunk;
              if (Date.now() - lastEdit > 1500 && buffer.trim()) {
                const preview = cleanForDiscord(buffer.slice(-1900));
                await working?.edit(preview || "...").catch((e) => console.warn("[message-handler] edit failed:", toErrorMessage(e)));
                lastEdit = Date.now();
              }
            },
          });
        })
      : await runClaude({
          prompt: contextualPrompt,
          systemPromptName: agent.promptFile,
          systemPrompt,
          maxTurns: agent.maxTurns,
          onChunk: async (chunk: string) => {
            buffer += chunk;
            if (Date.now() - lastEdit > 1500 && buffer.trim()) {
              const preview = cleanForDiscord(buffer.slice(-1900));
              await working?.edit(preview || "...").catch((e) => console.warn("[message-handler] edit failed:", toErrorMessage(e)));
              lastEdit = Date.now();
            }
          },
        });

    let responseText = result.text || "Done.";
    const actionNotes: string[] = [];

    if (discordClient && agent.promptFile !== "chat") {
      try {
        const { processChannelMessages, processDelegations, processWhatsAppSends } = await import("../agents/delegate.js");

        const whatsappSends = await processWhatsAppSends(responseText, channelName);
        responseText = whatsappSends.cleanText;
        if (whatsappSends.sent > 0) {
          actionNotes.push(
            `Sent ${whatsappSends.sent} WhatsApp message${whatsappSends.sent === 1 ? "" : "s"}.`,
          );
        }
        if (whatsappSends.errors.length > 0) {
          actionNotes.push(`WhatsApp send failed: ${whatsappSends.errors.join(" | ")}`.slice(0, 500));
        }

        const channelMessages = await processChannelMessages(discordClient, responseText, channelName);
        responseText = channelMessages.cleanText;
        if (channelMessages.posted > 0) {
          const targets = channelMessages.targets.map((target) => `#${target}`).join(", ");
          actionNotes.push(`Posted to ${targets}.`);
        }
        if (channelMessages.handedOff > 0) {
          const targets = channelMessages.handoffTargets.map((target) => `#${target}`).join(", ");
          actionNotes.push(`Handoff queued for ${targets}.`);
        }

        const delegations = await processDelegations(discordClient, responseText, channelName);
        responseText = delegations.cleanText;
        if (delegations.delegated > 0) {
          const targets = delegations.targets.map((target) => `#${target}`).join(", ");
          actionNotes.push(`Queued for ${targets}.`);
        }
      } catch (err) {
        const errMsg = toErrorMessage(err);
        console.warn(`[message-handler] action processing failed: ${errMsg}`);
      }
    }

    const deliveredText = [responseText.trim(), ...actionNotes.map((note) => `_${note}_`)]
      .filter(Boolean)
      .join("\n\n")
      .trim() || "Done.";

    const chunks = chunkText(cleanForDiscord(deliveredText), 1900);
    await deliverResponse(agentKey, channelName, chunks, working, msg);
    postProcess(agentKey, agent, channelName, msg.author.username, prompt, deliveredText, msg.id);
  } catch (err) {
    if (err instanceof ResourceBusyError) {
      const blockers = err.blockers.join(", ");
      const message = `That workflow is waiting on ${blockers}. Try again in a bit.`;
      if (working) {
        await working.edit(message).catch((e) => console.warn("[message-handler] edit failed:", toErrorMessage(e)));
      }
      return;
    }

    const errMsg = toErrorMessage(err);
    if (working) {
      await working.edit(`Something went wrong: ${errMsg}`).catch((e) => console.warn("[message-handler] edit failed:", toErrorMessage(e)));
    }
  } finally {
    if (typingInterval) clearInterval(typingInterval);
  }
}
