import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  Partials,
  type Message,
  type TextChannel,
} from "discord.js";
import { runClaude } from "./runner.js";
import { state } from "./state.js";

const token = process.env.DISCORD_BOT_TOKEN;
const channelId = process.env.DISCORD_CHANNEL_ID;

export const discordClient = token
  ? new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        // Server management intents
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
      ],
      partials: [Partials.Channel, Partials.Message, Partials.GuildMember],
    })
  : null;

let agentBusy = false;

// Use shared session map from discord-admin so slash commands and
// follow-up messages share the same conversation context
import { channelSessions } from "./discord-admin.js";

function chunkText(text: string, maxLen: number): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + maxLen));
    i += maxLen;
  }
  return chunks;
}

/** Convert Telegram HTML + markdown to Discord-compatible markdown */
function cleanForDiscord(text: string): string {
  return text
    // HTML bold → Discord bold
    .replace(/<b>([\s\S]*?)<\/b>/g, "**$1**")
    // HTML italic
    .replace(/<i>([\s\S]*?)<\/i>/g, "*$1*")
    // HTML code blocks
    .replace(/<pre>([\s\S]*?)<\/pre>/g, "```\n$1\n```")
    // HTML inline code
    .replace(/<code>([\s\S]*?)<\/code>/g, "`$1`")
    // HTML entities
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    // Strip any remaining HTML tags
    .replace(/<[^>]+>/g, "")
    // Tables → plain text
    .replace(/^\|[-:| ]+\|$/gm, "")
    .replace(/^\|(.+)\|$/gm, (_m, row: string) =>
      row.split("|").map((c) => c.trim()).filter(Boolean).join(" · ")
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function handleMessage(msg: Message, prompt: string) {
  if (agentBusy || state.jobRunning || state.thinkRunning || state.discordAdminRunning) {
    await msg.reply("Agent is busy. Try again in a moment.");
    return;
  }

  agentBusy = true;

  // Show typing indicator (only on channels that support it)
  const ch = msg.channel;
  if ("sendTyping" in ch) await (ch as TextChannel).sendTyping().catch(() => {});
  const typingInterval = setInterval(() => {
    if ("sendTyping" in ch) (ch as TextChannel).sendTyping().catch(() => {});
  }, 8000);

  const working = await msg.reply("Working on it...");

  let buffer = "";
  let lastEdit = Date.now();

  const chId = msg.channelId;
  const existingSession = channelSessions.get(chId);

  // Use admin prompt in the dedicated admin channel, chat prompt everywhere else
  const { isAdminChannel, buildAdminPrompt } = await import("./discord-admin.js");
  const isAdmin = isAdminChannel(chId);

  try {
    // For admin channel: inject live server snapshot into the system prompt
    const adminSystemPrompt = isAdmin ? await buildAdminPrompt() : undefined;

    const result = await runClaude({
      prompt,
      systemPromptName: isAdmin ? "discord-admin" : "chat",
      systemPrompt: adminSystemPrompt,
      resumeSessionId: existingSession,
      onChunk: async (chunk: string) => {
        buffer += chunk;
        if (Date.now() - lastEdit > 1500 && buffer.trim()) {
          const preview = cleanForDiscord(buffer.slice(-1900));
          await working.edit(preview || "...").catch(() => {});
          lastEdit = Date.now();
        }
      },
    });

    if (result.sessionId) {
      channelSessions.set(chId, result.sessionId);
    }

    let responseText = result.text || "Done.";

    // In admin channel, parse and execute any action blocks Claude included
    if (isAdmin && responseText.includes("[ACTION:")) {
      const { parseActions, executeActions, stripActions, formatResults } =
        await import("./discord-actions.js");
      const actions = parseActions(responseText);
      if (actions.length > 0) {
        const guild = discordClient?.guilds.cache.first();
        if (guild) {
          await working.edit("Executing actions...").catch(() => {});
          const results = await executeActions(actions, guild);
          const resultText = formatResults(results);
          responseText = stripActions(responseText);
          if (resultText) {
            responseText += `\n\n**Actions executed:**\n${resultText}`;
          }
        }
      }
    }

    const full = cleanForDiscord(responseText);
    const chunks = chunkText(full, 1900);

    await working.edit(chunks[0] || "Done.").catch(() => {});
    for (const chunk of chunks.slice(1)) {
      if ("send" in msg.channel) await (msg.channel as TextChannel).send(chunk);
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    await working.edit(`Something went wrong: ${errMsg}`).catch(() => {});
  } finally {
    clearInterval(typingInterval);
    agentBusy = false;
  }
}

export function startDiscordBot(): void {
  if (!discordClient) {
    console.warn("[discord] DISCORD_BOT_TOKEN not set — Discord bot disabled");
    return;
  }

  discordClient.once("ready", async (c) => {
    console.log(`Discord bot online: ${c.user.tag}`);
    // Initialize admin module after client is ready
    const { initDiscordAdmin } = await import("./discord-admin.js");
    await initDiscordAdmin(discordClient);
  });

  discordClient.on("messageCreate", async (msg) => {
    if (msg.author.bot) return;

    const content = msg.content.trim();
    if (!content) return;

    // Run auto-moderation first (fast path, no Claude)
    const { checkAutoMod } = await import("./discord-admin.js");
    const blocked = await checkAutoMod(msg);
    if (blocked) return;

    // Simple commands
    if (content === "!status" || content === "/status") {
      const busy = agentBusy || state.jobRunning || state.thinkRunning || state.discordAdminRunning;
      await msg.reply(busy ? "Agent is busy running a task." : "Agent is idle and ready.");
      return;
    }

    if (content === "!reset" || content === "/reset") {
      channelSessions.delete(msg.channelId);
      await msg.reply("Conversation reset. Starting fresh.");
      return;
    }

    if (content === "!check" || content === "/check") {
      await handleMessage(
        msg,
        "Check TM One for any updates. Compare against the last saved state and report what changed."
      );
      return;
    }

    // Any other message → send to agent
    await handleMessage(msg, content);
  });

  discordClient.login(token).catch((err: unknown) => {
    const m = err instanceof Error ? err.message : String(err);
    console.error("[discord] Login failed:", m);
  });
}

// ─── Channel Router ──────────────────────────────────────────────────────────

/** Well-known routing targets. Map target name -> Discord channel name. */
const CHANNEL_ROUTES: Record<string, string> = {
  "general":       "general",
  "announcements": "announcements",
  "campaigns":     "campaign-updates",
  "performance":   "performance-reports",
  "creative":      "ad-creative",
  "tm-data":       "tm-one-data",
  "tm-events":     "event-updates",
  "agent-logs":    "agent-logs",
  "agent-alerts":  "agent-alerts",
  "meta-api":      "meta-api",
  "dev-logs":      "dev-logs",
  "billing":       "billing",
  "bot-logs":      "bot-logs",
};

/** Cache of channel name -> channel ID, populated on first lookup. */
const channelIdCache = new Map<string, string>();

/**
 * Resolve a channel name to its ID, using cache.
 * Falls back to DISCORD_CHANNEL_ID if channel not found.
 */
async function resolveChannelId(channelName: string): Promise<string | null> {
  if (channelIdCache.has(channelName)) return channelIdCache.get(channelName)!;
  if (!discordClient) return channelId || null;

  const guild = discordClient.guilds.cache.first();
  if (!guild) return channelId || null;

  const ch = guild.channels.cache.find(
    c => c.name === channelName && c.isTextBased()
  );
  if (ch) {
    channelIdCache.set(channelName, ch.id);
    return ch.id;
  }

  // Channel doesn't exist yet -- fall back to default
  return channelId || null;
}

/**
 * Send a message to a specific channel by route name.
 * Falls back to DISCORD_CHANNEL_ID if the target channel doesn't exist.
 *
 * Usage: notifyChannel("performance", "ROAS dropped below 2.0")
 *        notifyChannel("agent-alerts", "Meta token expires in 3 days")
 */
export async function notifyChannel(target: string, text: string): Promise<void> {
  if (!discordClient) return;

  const channelName = CHANNEL_ROUTES[target] || target;
  const resolvedId = await resolveChannelId(channelName);
  if (!resolvedId) return;

  try {
    const channel = await discordClient.channels.fetch(resolvedId);
    if (channel && channel.isTextBased()) {
      const chunks = chunkText(cleanForDiscord(text), 1900);
      for (const chunk of chunks) {
        await (channel as TextChannel).send(chunk);
      }
    }
  } catch (err) {
    const m = err instanceof Error ? err.message : String(err);
    console.warn(`[discord] Failed to send to #${channelName}:`, m);
  }
}

/** Send a proactive notification to the configured Discord channel (legacy). */
export async function notifyDiscord(text: string): Promise<void> {
  if (!discordClient || !channelId) return;
  try {
    const channel = await discordClient.channels.fetch(channelId);
    if (channel && channel.isTextBased()) {
      const chunks = chunkText(cleanForDiscord(text), 1900);
      for (const chunk of chunks) {
        await (channel as TextChannel).send(chunk);
      }
    }
  } catch (err) {
    const m = err instanceof Error ? err.message : String(err);
    console.warn("[discord] Failed to send notification:", m);
  }
}
