/**
 * discord-admin.ts -- Discord server initialization and auto-moderation.
 *
 * Handles:
 * - Bot startup: auto-detect guild, ensure bot channels exist
 * - Auto-moderation: banned words, rate limiting, mass mentions
 * - Welcome flow for new members
 * - Server snapshot for agent context injection
 * - buildAdminPrompt() for agents that need live server snapshot injection
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
import { chunkText } from "../../events/message-handler.js";
import { toErrorMessage } from "../../utils/error-helpers.js";

// --- Config ---

const GUILD_ID = process.env.DISCORD_GUILD_ID ?? "";
let logChannelId = process.env.DISCORD_LOG_CHANNEL_ID ?? "";
let welcomeChannelId = process.env.DISCORD_WELCOME_CHANNEL_ID ?? "";

const EXEMPT_CHANNELS = new Set(
  (process.env.DISCORD_EXEMPT_CHANNELS ?? "").split(",").filter(Boolean)
);

// --- Auto-Moderation Rules ---

const BANNED_WORDS = (process.env.DISCORD_BANNED_WORDS ?? "").split(",").filter(Boolean);

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10_000;

/**
 * Per-USER rate limiter: tracks message count within a sliding window.
 * Used by checkAutoMod() to detect spam from a single user (>5 msgs in 10s).
 * Keyed by user ID.
 */
const messageRates = new Map<string, { count: number; firstAt: number }>();

/**
 * Per-CHANNEL activity tracker: counts total messages and last-active timestamp.
 * NOT a rate limiter -- used by getServerSnapshot() and runChannelHealthCheck()
 * to identify stale channels. Keyed by channel ID.
 * These serve different purposes: messageRates enforces spam limits,
 * channelActivity provides analytics data for health checks.
 */
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
 * Ensure #agent-feed and #boss channels exist.
 */
async function ensureBotChannels(g: Guild): Promise<void> {
  if (!logChannelId) {
    const existing = g.channels.cache.find(
      c => c.name === "agent-feed" && c.type === ChannelType.GuildText
    );
    if (existing) {
      logChannelId = existing.id;
      console.log(`[discord-admin] Found existing #agent-feed (${logChannelId})`);
    } else {
      let feedCategory = g.channels.cache.find(
        c => c.name === "Feed" && c.type === ChannelType.GuildCategory
      ) as CategoryChannel | undefined;

      if (!feedCategory) {
        feedCategory = await g.channels.create({
          name: "Feed",
          type: ChannelType.GuildCategory,
        }) as CategoryChannel;
        console.log("[discord-admin] Created 'Feed' category");
      }

      const logCh = await g.channels.create({
        name: "agent-feed",
        type: ChannelType.GuildText,
        parent: feedCategory.id,
        topic: "All bot output: syncs, alerts, jobs, reports -- unified log",
      });
      logChannelId = logCh.id;
      console.log(`[discord-admin] Created #agent-feed (${logChannelId})`);
    }
  }

  if (!adminChannelId) {
    const existing = g.channels.cache.find(
      c => c.name === "boss" && c.type === ChannelType.GuildText
    );
    if (existing) {
      adminChannelId = existing.id;
      console.log(`[discord-admin] Found existing #boss (${adminChannelId})`);
    } else {
      const agentsCategory = g.channels.cache.find(
        c => c.name === "Agents" && c.type === ChannelType.GuildCategory
      ) as CategoryChannel | undefined;

      const adminCh = await g.channels.create({
        name: "boss",
        type: ChannelType.GuildText,
        parent: agentsCategory?.id,
        topic: "Talk to the Boss -- big picture, multi-agent tasks, server management",
      });
      adminChannelId = adminCh.id;
      console.log(`[discord-admin] Created #boss (${adminChannelId})`);
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

  // Banned words
  const lowerContent = content.toLowerCase();
  for (const word of BANNED_WORDS) {
    if (word && lowerContent.includes(word.toLowerCase())) {
      await msg.delete().catch((e) => console.warn("[admin] delete failed:", toErrorMessage(e)));
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
    await msg.delete().catch((e) => console.warn("[admin] delete failed:", toErrorMessage(e)));
    if (rate.count === RATE_LIMIT_MAX + 1) {
      if (msg.channel.isTextBased() && "send" in msg.channel) {
        await (msg.channel as TextChannel).send(
          `${msg.author}, slow down. You're sending messages too fast.`
        ).catch((e) => console.warn("[admin] send failed:", toErrorMessage(e)));
      }
      await logAction(`Rate-limited ${msg.author.tag} in #${(msg.channel as TextChannel).name}`);
    }
    return true;
  }

  // Mass mention detection
  if (msg.mentions.users.size >= 5 || msg.mentions.roles.size >= 3) {
    await msg.delete().catch((e) => console.warn("[admin] delete failed:", toErrorMessage(e)));
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
    await msg.author.send(`Warning (${warnings}/3): ${reason}`).catch((e) => console.warn("[admin] DM failed:", toErrorMessage(e)));
  } catch {
    if (msg.channel.isTextBased() && "send" in msg.channel) {
      await (msg.channel as TextChannel).send(
        `${msg.author} Warning (${warnings}/3): ${reason}`
      ).catch((e) => console.warn("[admin] send failed:", toErrorMessage(e)));
    }
  }

  if (warnings >= 3 && msg.member) {
    const tenMinutes = 10 * 60 * 1000;
    await msg.member.timeout(tenMinutes, `Auto-mod: ${warnings} warnings`).catch((e) => console.warn("[admin] timeout failed:", toErrorMessage(e)));
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
    .setDescription(`Hey ${member}, welcome to the Outlet Media team.`)
    .addFields(
      { name: "What we do", value: "We buy ads for music promoters. Every channel here is powered by an AI agent.", inline: false },
      { name: "#general", value: "Team chat and announcements", inline: true },
      { name: "#media-buyer", value: "Meta Ads -- budgets, ROAS, campaigns", inline: true },
      { name: "#tm-data", value: "Ticketmaster -- events, tickets, demographics", inline: true },
      { name: "#creative", value: "Ad creative -- images, video, copy review", inline: true },
      { name: "#dashboard", value: "Reporting -- analytics, trends, data", inline: true },
      { name: "#zamora / #kybba", value: "Client channels -- per-client conversations", inline: true },
      { name: "#agent-feed", value: "Quiet activity log (muted by default)", inline: true },
      { name: "Private surfaces", value: "Owner-only channels like #boss, #email, #meetings, #email-log, #schedule, and #ops are restricted.", inline: false },
      { name: "Quick start", value: "Type `!help` in a team channel for available commands. Just chat naturally -- the agents understand plain language.", inline: false },
    )
    .setColor(0x5865f2)
    .setTimestamp();

  if (welcomeChannel) {
    await welcomeChannel.send({ embeds: [embed] }).catch((e) => console.warn("[admin] send failed:", toErrorMessage(e)));
  }

  // DM the new member with the same guide
  try {
    await member.send({ embeds: [embed] });
  } catch {
    // User has DMs disabled
  }

  // Auto-assign Team role unless an explicit default role is configured
  const teamRole = guild.roles.cache.find(r => r.name === (process.env.DISCORD_TEAM_ROLE_NAME ?? "Team"));
  const defaultRoleId = process.env.DISCORD_DEFAULT_ROLE_ID ?? teamRole?.id;
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
 * Build a system prompt with live server snapshot injected.
 * Replaces {{SERVER_SNAPSHOT}} in the prompt file with live JSON.
 *
 * @param promptFile - prompt filename without extension (e.g. "boss", "discord-agent")
 */
export async function buildAdminPrompt(promptFile = "boss"): Promise<string> {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const promptPath = path.join(process.cwd(), "prompts", `${promptFile}.txt`);

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

// --- Channel Health Check (called from scheduler) ---

export async function runChannelHealthCheck(): Promise<void> {
  // Clean up stale rate limit entries
  const now = Date.now();
  for (const [userId, rate] of messageRates) {
    if (now - rate.firstAt > RATE_LIMIT_WINDOW_MS) {
      messageRates.delete(userId);
    }
  }

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
    const msg = toErrorMessage(err);
    console.warn("[discord-admin] Could not log to channel:", msg);
  }
}
