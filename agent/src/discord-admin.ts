/**
 * discord-admin.ts -- Discord server initialization and auto-moderation.
 *
 * Handles:
 * - Bot startup: auto-detect guild, ensure bot channels exist
 * - Auto-moderation: spam detection, banned words, rate limiting, mass mentions
 * - Welcome flow for new members
 * - Server snapshot for agent context injection
 * - buildAdminPrompt() for the server-admin agent
 *
 * Does NOT handle:
 * - Slash commands (removed -- use channel messages instead)
 * - ACTION blocks (removed -- Claude calls Discord REST API via curl)
 * - Claude-powered handlers (removed -- thin router in discord.ts handles all)
 */

import {
  type Client,
  type Message,
  type GuildMember,
  type TextChannel,
  type Guild,
  type CategoryChannel,
  ChannelType,
  EmbedBuilder,
} from "discord.js";
import { state } from "./state.js";

// --- Config ---

const GUILD_ID = process.env.DISCORD_GUILD_ID ?? "";
let logChannelId = process.env.DISCORD_LOG_CHANNEL_ID ?? "";
let welcomeChannelId = process.env.DISCORD_WELCOME_CHANNEL_ID ?? "";

const EXEMPT_CHANNELS = new Set(
  (process.env.DISCORD_EXEMPT_CHANNELS ?? "").split(",").filter(Boolean)
);

// --- Auto-Moderation Rules ---

const SPAM_PATTERNS = [
  /discord\.gift/i,
  /free\s*nitro/i,
  /claim\s*your?\s*gift/i,
  /steam\s*community\s*gift/i,
  /@everyone\s*http/i,
  /https?:\/\/dis[ck]ord[^.]*\.[a-z]{2,}/i,
];

const BANNED_WORDS = (process.env.DISCORD_BANNED_WORDS ?? "").split(",").filter(Boolean);

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10_000;

const messageRates = new Map<string, { count: number; firstAt: number }>();
const channelActivity = new Map<string, { messages: number; lastActive: number }>();
const userWarnings = new Map<string, number>();

/** The admin channel ID (auto-detected or from env) */
let adminChannelId = process.env.DISCORD_ADMIN_CHANNEL_ID ?? "";

let client: Client | null = null;
let guild: Guild | null = null;

// --- Initialization ---

export async function initDiscordAdmin(c: Client): Promise<void> {
  client = c;

  let guildId = GUILD_ID;
  if (!guildId) {
    const firstGuild = c.guilds.cache.first();
    if (firstGuild) {
      guildId = firstGuild.id;
      console.log(`[discord-admin] Auto-detected guild: ${firstGuild.name} (${guildId})`);
    } else {
      console.warn("[discord-admin] Bot is not in any server -- admin features disabled");
      return;
    }
  }

  guild = c.guilds.cache.get(guildId) ?? null;
  if (!guild) {
    try {
      guild = await c.guilds.fetch(guildId);
    } catch {
      console.error("[discord-admin] Could not fetch guild:", guildId);
      return;
    }
  }

  console.log(`[discord-admin] Managing server: ${guild.name} (${guild.memberCount} members)`);

  await ensureBotChannels(guild);
  c.on("guildMemberAdd", handleMemberJoin);

  await logAction("Server admin online. Auto-mod active.");
}

/**
 * Ensure #bot-logs and #bot-admin channels exist.
 */
async function ensureBotChannels(g: Guild): Promise<void> {
  if (!logChannelId) {
    const existing = g.channels.cache.find(
      c => c.name === "bot-logs" && c.type === ChannelType.GuildText
    );
    if (existing) {
      logChannelId = existing.id;
      console.log(`[discord-admin] Found existing #bot-logs (${logChannelId})`);
    } else {
      let botCategory = g.channels.cache.find(
        c => c.name === "Bot" && c.type === ChannelType.GuildCategory
      ) as CategoryChannel | undefined;

      if (!botCategory) {
        botCategory = await g.channels.create({
          name: "Bot",
          type: ChannelType.GuildCategory,
        }) as CategoryChannel;
        console.log("[discord-admin] Created 'Bot' category");
      }

      const logCh = await g.channels.create({
        name: "bot-logs",
        type: ChannelType.GuildText,
        parent: botCategory.id,
        topic: "Automated moderation logs, reports, and bot activity",
      });
      logChannelId = logCh.id;
      console.log(`[discord-admin] Created #bot-logs (${logChannelId})`);
    }
  }

  if (!adminChannelId) {
    const existing = g.channels.cache.find(
      c => c.name === "bot-admin" && c.type === ChannelType.GuildText
    );
    if (existing) {
      adminChannelId = existing.id;
      console.log(`[discord-admin] Found existing #bot-admin (${adminChannelId})`);
    } else {
      const botCategory = g.channels.cache.find(
        c => c.name === "Bot" && c.type === ChannelType.GuildCategory
      ) as CategoryChannel | undefined;

      const adminCh = await g.channels.create({
        name: "bot-admin",
        type: ChannelType.GuildText,
        parent: botCategory?.id,
        topic: "Talk to the server admin bot here.",
      });
      adminChannelId = adminCh.id;
      console.log(`[discord-admin] Created #bot-admin (${adminChannelId})`);
    }
  }

  if (!welcomeChannelId) {
    const welcomeNames = ["welcome", "general", "introductions", "lobby"];
    const existing = g.channels.cache.find(
      c => c.type === ChannelType.GuildText && welcomeNames.includes(c.name)
    );
    if (existing) {
      welcomeChannelId = existing.id;
      console.log(`[discord-admin] Using #${existing.name} as welcome channel`);
    } else {
      const first = g.channels.cache.find(c => c.type === ChannelType.GuildText);
      if (first) {
        welcomeChannelId = first.id;
        console.log(`[discord-admin] Using #${first.name} as welcome channel (fallback)`);
      }
    }
  }
}

// --- Auto-Moderation ---

/**
 * Check a message against auto-mod rules. Returns true if blocked.
 */
export async function checkAutoMod(msg: Message): Promise<boolean> {
  if (!guild || !msg.guild || msg.guild.id !== guild.id) return false;
  if (EXEMPT_CHANNELS.has(msg.channelId)) return false;

  const activity = channelActivity.get(msg.channelId) ?? { messages: 0, lastActive: 0 };
  activity.messages++;
  activity.lastActive = Date.now();
  channelActivity.set(msg.channelId, activity);

  const userId = msg.author.id;
  const content = msg.content;

  // Spam link detection
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(content)) {
      await msg.delete().catch(() => {});
      await warnUser(msg, "Spam/phishing link detected.");
      await logAction(`Deleted spam from ${msg.author.tag} in #${(msg.channel as TextChannel).name}: ${content.slice(0, 100)}`);
      return true;
    }
  }

  // Banned words
  const lowerContent = content.toLowerCase();
  for (const word of BANNED_WORDS) {
    if (word && lowerContent.includes(word.toLowerCase())) {
      await msg.delete().catch(() => {});
      await warnUser(msg, "Message removed -- contains restricted content.");
      await logAction(`Removed message from ${msg.author.tag} (banned word: ${word})`);
      return true;
    }
  }

  // Rate limiting
  const rate = messageRates.get(userId) ?? { count: 0, firstAt: Date.now() };
  const elapsed = Date.now() - rate.firstAt;

  if (elapsed > RATE_LIMIT_WINDOW_MS) {
    rate.count = 1;
    rate.firstAt = Date.now();
  } else {
    rate.count++;
  }
  messageRates.set(userId, rate);

  if (rate.count > RATE_LIMIT_MAX) {
    await msg.delete().catch(() => {});
    if (rate.count === RATE_LIMIT_MAX + 1) {
      if (msg.channel.isTextBased() && "send" in msg.channel) {
        await (msg.channel as TextChannel).send(
          `${msg.author}, slow down. You're sending messages too fast.`
        ).catch(() => {});
      }
      await logAction(`Rate-limited ${msg.author.tag} in #${(msg.channel as TextChannel).name}`);
    }
    return true;
  }

  // Mass mention detection
  if (msg.mentions.users.size >= 5 || msg.mentions.roles.size >= 3) {
    await msg.delete().catch(() => {});
    await warnUser(msg, "Mass mentions are not allowed.");
    await logAction(`Blocked mass mention from ${msg.author.tag}`);
    return true;
  }

  return false;
}

async function warnUser(msg: Message, reason: string): Promise<void> {
  const userId = msg.author.id;
  const warnings = (userWarnings.get(userId) ?? 0) + 1;
  userWarnings.set(userId, warnings);

  try {
    await msg.author.send(`Warning (${warnings}/3): ${reason}`).catch(() => {});
  } catch {
    if (msg.channel.isTextBased() && "send" in msg.channel) {
      await (msg.channel as TextChannel).send(
        `${msg.author} Warning (${warnings}/3): ${reason}`
      ).catch(() => {});
    }
  }

  if (warnings >= 3 && msg.member) {
    const tenMinutes = 10 * 60 * 1000;
    await msg.member.timeout(tenMinutes, `Auto-mod: ${warnings} warnings`).catch(() => {});
    await logAction(`Timed out ${msg.author.tag} for 10 minutes (${warnings} warnings)`);
    userWarnings.delete(userId);
  }
}

// --- Welcome Flow ---

async function handleMemberJoin(member: GuildMember): Promise<void> {
  if (!guild || member.guild.id !== guild.id) return;

  const welcomeChannel = welcomeChannelId
    ? guild.channels.cache.get(welcomeChannelId) as TextChannel | undefined
    : null;

  const embed = new EmbedBuilder()
    .setTitle(`Welcome to ${guild.name}!`)
    .setDescription(`Hey ${member}, welcome to the team.`)
    .addFields(
      { name: "Who we are", value: "Outlet Media -- we buy ads for music promoters.", inline: false },
      { name: "Need help?", value: "Ask in any channel or DM an admin.", inline: false },
    )
    .setColor(0x5865f2)
    .setTimestamp();

  if (welcomeChannel) {
    await welcomeChannel.send({ embeds: [embed] }).catch(() => {});
  }

  try {
    await member.send(
      `Welcome to **${guild.name}**! You've been added to the team. ` +
      `Check the channels and let us know if you need anything.`
    );
  } catch {
    // User has DMs disabled
  }

  const defaultRoleId = process.env.DISCORD_DEFAULT_ROLE_ID;
  if (defaultRoleId) {
    await member.roles.add(defaultRoleId).catch((err) => {
      console.warn("[discord-admin] Could not assign default role:", err.message);
    });
  }

  await logAction(`New member joined: ${member.user.tag}`);
}

// --- Server Snapshot ---

export async function getServerSnapshot(): Promise<Record<string, unknown>> {
  if (!guild) return { error: "Guild not available" };

  const channels = guild.channels.cache.map(c => ({
    id: c.id,
    name: c.name,
    type: ChannelType[c.type],
    parentName: c.parent?.name ?? null,
    activity: channelActivity.get(c.id) ?? null,
  }));

  const roles = guild.roles.cache
    .filter(r => r.name !== "@everyone")
    .map(r => ({
      name: r.name,
      members: r.members.size,
      color: r.hexColor,
    }));

  let memberCount = guild.memberCount;
  let onlineCount = 0;
  try {
    const members = await guild.members.fetch({ withPresences: true });
    onlineCount = members.filter(m => m.presence?.status === "online").size;
    memberCount = members.size;
  } catch {
    // Presences may not be available
  }

  return {
    name: guild.name,
    memberCount,
    onlineCount,
    channelCount: channels.length,
    channels,
    roles,
    createdAt: guild.createdAt.toISOString(),
  };
}

/**
 * Build the server-admin system prompt with live server snapshot injected.
 */
export async function buildAdminPrompt(): Promise<string> {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const promptPath = path.join(process.cwd(), "prompts", "server-admin.txt");

  let template: string;
  try {
    template = await fs.readFile(promptPath, "utf-8");
  } catch {
    template = "You are a Discord server admin. Help manage the server.";
  }

  const snapshot = await getServerSnapshot();
  const snapshotText = JSON.stringify(snapshot, null, 2);
  return template.replace("{{SERVER_SNAPSHOT}}", snapshotText);
}

// --- Server Restructure ---

export async function runServerRestructure(): Promise<string> {
  if (!guild) return "Guild not available.";
  const { runServerRestructure: _run } = await import("./discord-restructure.js");
  const result = await _run(guild);
  if (result.startsWith("**Server Restructure Complete**")) {
    await logAction(result);
  }
  return result;
}

// --- Channel Health Check (called from scheduler) ---

export async function runChannelHealthCheck(): Promise<void> {
  if (!guild) return;

  const staleChannels: string[] = [];
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  for (const [id, ch] of guild.channels.cache) {
    if (ch.type !== ChannelType.GuildText) continue;
    const activity = channelActivity.get(id);
    if (!activity || activity.lastActive < weekAgo) {
      staleChannels.push(ch.name);
    }
  }

  if (staleChannels.length > 0) {
    await logAction(
      `**Channel Health Check**\n` +
      `${staleChannels.length} channels with no activity in 7+ days:\n` +
      staleChannels.map(n => `- #${n}`).join("\n")
    );
  }
}

// --- Logging ---

async function logAction(text: string): Promise<void> {
  if (!client || !logChannelId) {
    console.log(`[discord-admin] ${text}`);
    return;
  }

  try {
    const channel = await client.channels.fetch(logChannelId);
    if (channel?.isTextBased()) {
      const chunks = chunkText(text, 1900);
      for (const chunk of chunks) {
        await (channel as TextChannel).send(chunk);
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("[discord-admin] Could not log to channel:", msg);
  }
}

function chunkText(text: string, maxLen: number): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + maxLen));
    i += maxLen;
  }
  return chunks;
}
