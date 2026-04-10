/**
 * message-handler.ts -- Routes Discord messages to the agent.
 *
 * Handles:
 * - Conversation context building (last N messages)
 * - Claude CLI execution with streaming updates
 * - Response delivery via webhook with fallback
 */

import {
  type Client,
  type Message,
  type TextChannel,
} from "discord.js";
import { runClaude } from "../runner.js";
import {
  channelSessions,
  markChannelLockAcquired,
  markChannelLockHeartbeat,
  markChannelLockReleased,
} from "../discord/core/entry.js";
import { getAgentForChannel } from "../discord/core/router.js";
import { sendAsAgent } from "../services/webhook-service.js";
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
 * Route a message to the agent and handle the response.
 */
export async function handleMessage(
  msg: Message,
  prompt: string,
  channelName: string,
  _discordClient: Client | null,
): Promise<void> {
  const agent = getAgentForChannel(channelName);
  if (agent.readOnly) return;
  if (!acquireChannelLock(msg.channelId)) return;

  const agentKey = agent.promptFile;
  const resumeSessionId = channelSessions.get(msg.channelId);

  let typingInterval: ReturnType<typeof setInterval> | undefined;
  let working: Message | undefined;

  try {
    markChannelLockAcquired(msg.channelId);
    markChannelLockHeartbeat(msg.channelId);

    const ch = msg.channel;
    if ("sendTyping" in ch) await (ch as TextChannel).sendTyping().catch(() => {});
    typingInterval = setInterval(() => {
      markChannelLockHeartbeat(msg.channelId);
      if ("sendTyping" in ch) (ch as TextChannel).sendTyping().catch(() => {});
    }, 8000);

    working = await msg.reply("Working on it...");
    const contextualPrompt = resumeSessionId
      ? prompt
      : await buildConversationContext(msg, prompt);

    let buffer = "";
    let lastEdit = Date.now();
    const result = await runClaude({
      prompt: contextualPrompt,
      systemPromptName: agent.promptFile,
      maxTurns: agent.maxTurns,
      onActivity: () => {
        markChannelLockHeartbeat(msg.channelId);
      },
      onChunk: async (chunk: string) => {
        markChannelLockHeartbeat(msg.channelId);
        buffer += chunk;
        if (Date.now() - lastEdit > 1500 && buffer.trim()) {
          const preview = cleanForDiscord(buffer.slice(-1900));
          await working?.edit(preview || "...").catch((e) => console.warn("[message-handler] edit failed:", toErrorMessage(e)));
          lastEdit = Date.now();
        }
      },
      resumeSessionId,
    });

    if (result.sessionId) {
      channelSessions.set(msg.channelId, result.sessionId);
    }

    const responseText = result.text || "Done.";
    const chunks = chunkText(cleanForDiscord(responseText), 1900);
    await deliverResponse(agentKey, channelName, chunks, working, msg);
  } catch (err) {
    const errMsg = toErrorMessage(err);
    if (working) {
      await working.edit(`Something went wrong: ${errMsg}`).catch((e) => console.warn("[message-handler] edit failed:", toErrorMessage(e)));
    }
  } finally {
    if (typingInterval) clearInterval(typingInterval);
    releaseChannelLock(msg.channelId);
    markChannelLockReleased(msg.channelId);
  }
}
