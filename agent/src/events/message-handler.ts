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
import { getAgentForChannel } from "../discord/core/router.js";
import { isAgentFree } from "../services/queue-service.js";
import { sendAsAgent } from "../services/webhook-service.js";
import { loadAgentMemory } from "../discord/features/memory.js";

/** Per-channel processing lock to prevent concurrent agent calls */
const channelLocks = new Set<string>();

/** How many recent messages to fetch for conversation context */
const HISTORY_DEPTH = 10;

/** Convert Telegram HTML + markdown to Discord-compatible markdown */
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

/**
 * Check if a channel is currently locked for processing.
 */
export function isChannelLocked(channelId: string): boolean {
  return channelLocks.has(channelId);
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
      const name = m.author.bot ? "META AGENT" : m.author.username;
      const text = m.content.slice(0, 500);
      return `${name}: ${text}`;
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

// --- Activity Logging for Boss Supervisor ---

interface ActivityEntry {
  ts: string;
  channel: string;
  user: string;
  message: string;
  agent: string;
  responseSummary: string;
}

const ACTIVITY_LOG = "session/activity-log.json";
const MAX_LOG_ENTRIES = 200;

async function logActivity(
  channel: string,
  user: string,
  message: string,
  agent: string,
  response: string,
): Promise<void> {
  const fs = await import("node:fs/promises");
  const { notifyChannel } = await import("../discord/core/entry.js");

  const entry: ActivityEntry = {
    ts: new Date().toISOString(),
    channel,
    user,
    message: message.slice(0, 200),
    agent,
    responseSummary: response.slice(0, 300),
  };

  let log: ActivityEntry[] = [];
  try {
    const raw = await fs.readFile(ACTIVITY_LOG, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) log = parsed as ActivityEntry[];
  } catch {
    // File doesn't exist yet
  }

  log.push(entry);
  if (log.length > MAX_LOG_ENTRIES) {
    log = log.slice(-MAX_LOG_ENTRIES);
  }

  await fs.writeFile(ACTIVITY_LOG, JSON.stringify(log, null, 2));

  const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
  const feedMsg = `\`${timestamp}\` **#${channel}** (${agent}) -- ${user}: "${message.slice(0, 80)}"`;
  notifyChannel("agent-feed", feedMsg).catch(() => {});
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

  // Read-only channels don't get agent responses
  if (agent.readOnly) return;

  // Check per-agent slot availability
  const agentKey = agent.promptFile;
  if (!isAgentFree(agentKey)) {
    await msg.reply("This agent is currently busy — please try again in a moment.");
    return;
  }

  channelLocks.add(msg.channelId);
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

    let buffer = "";
    let lastEdit = Date.now();
    // Build system prompt with optional snapshot and memory
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

    const result = await runClaude({
      prompt: contextualPrompt,
      systemPromptName: agent.promptFile,
      systemPrompt,
      maxTurns: agent.maxTurns,
      onChunk: async (chunk: string) => {
        buffer += chunk;
        if (Date.now() - lastEdit > 1500 && buffer.trim()) {
          const preview = cleanForDiscord(buffer.slice(-1900));
          await working?.edit(preview || "...").catch(() => {});
          lastEdit = Date.now();
        }
      },
    });

    const responseText = result.text || "Done.";
    const full = cleanForDiscord(responseText);
    const chunks = chunkText(full, 1900);

    // Try to send via webhook (agent identity), fall back to edit
    try {
      await sendAsAgent(agentKey, channelName, chunks[0] || "Done.");
      await working.delete().catch(() => {});
      for (const chunk of chunks.slice(1)) {
        await sendAsAgent(agentKey, channelName, chunk);
      }
    } catch {
      // Fallback: edit the "Working on it..." message
      await working.edit(chunks[0] || "Done.").catch(() => {});
      for (const chunk of chunks.slice(1)) {
        if ("send" in msg.channel) await (msg.channel as TextChannel).send(chunk);
      }
    }

    // Fire-and-forget post-processing
    logActivity(channelName, msg.author.username, prompt, agent.description, responseText).catch(() => {});

    import("../discord/features/memory.js")
      .then(({ maybeUpdateMemory }) => maybeUpdateMemory(agent.promptFile, prompt, responseText))
      .catch(() => {});

    import("../discord/features/skills.js")
      .then(({ maybeCreateSkill }) => maybeCreateSkill(agent.promptFile, prompt, responseText))
      .catch(() => {});

    // Structured delegation: scan for JSON delegate blocks
    if (discordClient && agent.promptFile !== "chat") {
      import("../agents/delegate.js")
        .then(({ processDelegations }) => processDelegations(discordClient!, responseText, channelName))
        .catch(() => {});
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    if (working) {
      await working.edit(`Something went wrong: ${errMsg}`).catch(() => {});
    }
  } finally {
    if (typingInterval) clearInterval(typingInterval);
    channelLocks.delete(msg.channelId);
  }
}
