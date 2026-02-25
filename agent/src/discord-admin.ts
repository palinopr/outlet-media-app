/**
 * discord-admin.ts — Full autonomous Discord server management.
 *
 * Fast path: Auto-moderation, spam detection, welcome flow (no Claude needed).
 * Smart path: Channel optimization, analytics reports, complex decisions (Claude-powered).
 */

import {
  type Client,
  type Message,
  type GuildMember,
  type TextChannel,
  type Guild,
  type CategoryChannel,
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
  REST,
  Routes,
  type Interaction,
  EmbedBuilder,
} from "discord.js";
import { runClaude } from "./runner.js";
import { state } from "./state.js";
import { runServerRestructure as _runServerRestructure } from "./discord-restructure.js";
import {
  initCommandHandlers,
  setGuild,
  handleReport,
  handleOptimize,
  handleCleanup,
  handleRoles,
  handleChannelCommand,
  handleAsk,
  handleRestructure,
} from "./discord-commands.js";

// ─── Config ────────────────────────────────────────────────────────────────

const GUILD_ID = process.env.DISCORD_GUILD_ID ?? "";
let logChannelId = process.env.DISCORD_LOG_CHANNEL_ID ?? "";
let welcomeChannelId = process.env.DISCORD_WELCOME_CHANNEL_ID ?? "";
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN ?? "";
const CLIENT_ID = process.env.DISCORD_CLIENT_ID ?? "";

// Channels the bot ignores for auto-mod (e.g. admin channels)
const EXEMPT_CHANNELS = new Set(
  (process.env.DISCORD_EXEMPT_CHANNELS ?? "").split(",").filter(Boolean)
);

// ─── Auto-Moderation Rules (fast path, no Claude) ──────────────────────────

const SPAM_PATTERNS = [
  /discord\.gift/i,
  /free\s*nitro/i,
  /claim\s*your?\s*gift/i,
  /steam\s*community\s*gift/i,
  /@everyone\s*http/i,
  /https?:\/\/dis[ck]ord[^.]*\.[a-z]{2,}/i, // phishing discord lookalikes
];

const BANNED_WORDS = (process.env.DISCORD_BANNED_WORDS ?? "").split(",").filter(Boolean);

// Max messages per user per 10 seconds before rate-limiting
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10_000;

// Track message rates per user
const messageRates = new Map<string, { count: number; firstAt: number }>();

// Track channel activity for analytics
const channelActivity = new Map<string, { messages: number; lastActive: number }>();

// Track user warnings
const userWarnings = new Map<string, number>();

/**
 * Shared session map per Discord channel.
 * Stores Claude session IDs so follow-up messages continue the conversation.
 */
export const channelSessions = new Map<string, string>();

/** The channel ID where the admin bot listens. Messages here use discord-admin prompt. */
let adminChannelId = process.env.DISCORD_ADMIN_CHANNEL_ID ?? "";

let client: Client | null = null;
let guild: Guild | null = null;

// ─── Initialization ────────────────────────────────────────────────────────

export async function initDiscordAdmin(c: Client): Promise<void> {
  client = c;

  // Auto-detect guild if not set -- use the first guild the bot is in
  let guildId = GUILD_ID;
  if (!guildId) {
    const firstGuild = c.guilds.cache.first();
    if (firstGuild) {
      guildId = firstGuild.id;
      console.log(`[discord-admin] Auto-detected guild: ${firstGuild.name} (${guildId})`);
    } else {
      console.warn("[discord-admin] Bot is not in any server — admin features disabled");
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

  // Wire up slash command handlers with dependencies
  initCommandHandlers({
    guild,
    channelActivity,
    getServerSnapshot,
    runClaudeForDiscord,
    runServerRestructure,
    logAction,
    chunkText,
  });

  // Auto-create bot infrastructure channels
  await ensureBotChannels(guild);

  // Register event listeners
  c.on("guildMemberAdd", handleMemberJoin);
  c.on("interactionCreate", handleSlashCommand);

  // Register slash commands -- use auto-detected guild ID if needed
  await registerSlashCommands(guildId);

  await logAction("Server admin online. Auto-mod active, slash commands registered.");
}

/**
 * Find or create the channels the bot needs to operate.
 * Creates a "Bot" category with #bot-logs if none exists.
 * Uses the first text channel as welcome if none is configured.
 */
async function ensureBotChannels(g: Guild): Promise<void> {
  // Find or create #bot-logs
  if (!logChannelId) {
    const existing = g.channels.cache.find(
      c => c.name === "bot-logs" && c.type === ChannelType.GuildText
    );
    if (existing) {
      logChannelId = existing.id;
      console.log(`[discord-admin] Found existing #bot-logs (${logChannelId})`);
    } else {
      // Find or create a Bot category
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

  // Find or create #bot-admin (the dedicated channel for server management commands)
  if (!adminChannelId) {
    const existing = g.channels.cache.find(
      c => c.name === "bot-admin" && c.type === ChannelType.GuildText
    );
    if (existing) {
      adminChannelId = existing.id;
      console.log(`[discord-admin] Found existing #bot-admin (${adminChannelId})`);
    } else {
      // Find the Bot category (created above for bot-logs)
      const botCategory = g.channels.cache.find(
        c => c.name === "Bot" && c.type === ChannelType.GuildCategory
      ) as CategoryChannel | undefined;

      const adminCh = await g.channels.create({
        name: "bot-admin",
        type: ChannelType.GuildText,
        parent: botCategory?.id,
        topic: "Talk to the server admin bot here. Everything you say goes to the AI admin.",
      });
      adminChannelId = adminCh.id;
      console.log(`[discord-admin] Created #bot-admin (${adminChannelId})`);
    }
  }

  // Find or default welcome channel
  if (!welcomeChannelId) {
    // Look for common welcome channel names
    const welcomeNames = ["welcome", "general", "introductions", "lobby"];
    const existing = g.channels.cache.find(
      c => c.type === ChannelType.GuildText && welcomeNames.includes(c.name)
    );
    if (existing) {
      welcomeChannelId = existing.id;
      console.log(`[discord-admin] Using #${existing.name} as welcome channel`);
    } else {
      // Use the first text channel
      const first = g.channels.cache.find(c => c.type === ChannelType.GuildText);
      if (first) {
        welcomeChannelId = first.id;
        console.log(`[discord-admin] Using #${first.name} as welcome channel (fallback)`);
      }
    }
  }
}

/**
 * Returns true if this channel is the dedicated admin channel.
 * Messages here should use the discord-admin prompt instead of chat.
 */
export function isAdminChannel(channelId: string): boolean {
  return adminChannelId !== "" && channelId === adminChannelId;
}

// ─── Auto-Moderation (fast path) ───────────────────────────────────────────

/**
 * Check a message against auto-mod rules. Returns true if the message was blocked.
 * This runs on EVERY message before anything else -- must be fast.
 */
export async function checkAutoMod(msg: Message): Promise<boolean> {
  if (!guild || !msg.guild || msg.guild.id !== guild.id) return false;
  if (EXEMPT_CHANNELS.has(msg.channelId)) return false;

  // Track channel activity
  const activity = channelActivity.get(msg.channelId) ?? { messages: 0, lastActive: 0 };
  activity.messages++;
  activity.lastActive = Date.now();
  channelActivity.set(msg.channelId, activity);

  const userId = msg.author.id;
  const content = msg.content;

  // 1. Spam link detection
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(content)) {
      await msg.delete().catch(() => {});
      await warnUser(msg, "Spam/phishing link detected.");
      await logAction(`Deleted spam from ${msg.author.tag} in #${(msg.channel as TextChannel).name}: ${content.slice(0, 100)}`);
      return true;
    }
  }

  // 2. Banned words
  const lowerContent = content.toLowerCase();
  for (const word of BANNED_WORDS) {
    if (word && lowerContent.includes(word.toLowerCase())) {
      await msg.delete().catch(() => {});
      await warnUser(msg, "Message removed — contains restricted content.");
      await logAction(`Removed message from ${msg.author.tag} (banned word: ${word})`);
      return true;
    }
  }

  // 3. Rate limiting (anti-flood)
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
      if (msg.channel.isTextBased() && "send" in msg.channel) await (msg.channel as TextChannel).send(`${msg.author}, slow down. You're sending messages too fast.`).catch(() => {});
      await logAction(`Rate-limited ${msg.author.tag} in #${(msg.channel as TextChannel).name}`);
    }
    return true;
  }

  // 4. Mass mention detection (5+ mentions = suspicious)
  if (msg.mentions.users.size >= 5 || msg.mentions.roles.size >= 3) {
    await msg.delete().catch(() => {});
    await warnUser(msg, "Mass mentions are not allowed.");
    await logAction(`Blocked mass mention from ${msg.author.tag} (${msg.mentions.users.size} users, ${msg.mentions.roles.size} roles)`);
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
    // Can't DM user — send in channel
    if (msg.channel.isTextBased() && "send" in msg.channel) await (msg.channel as TextChannel).send(`${msg.author} Warning (${warnings}/3): ${reason}`).catch(() => {});
  }

  // Auto-timeout at 3 warnings (10 minute mute)
  if (warnings >= 3 && msg.member) {
    const tenMinutes = 10 * 60 * 1000;
    await msg.member.timeout(tenMinutes, `Auto-mod: ${warnings} warnings`).catch(() => {});
    await logAction(`Timed out ${msg.author.tag} for 10 minutes (${warnings} warnings)`);
    userWarnings.delete(userId);
  }
}

// ─── Welcome Flow ──────────────────────────────────────────────────────────

async function handleMemberJoin(member: GuildMember): Promise<void> {
  if (!guild || member.guild.id !== guild.id) return;

  // Send welcome in the welcome channel
  const welcomeChannel = welcomeChannelId
    ? guild.channels.cache.get(welcomeChannelId) as TextChannel | undefined
    : null;

  const embed = new EmbedBuilder()
    .setTitle(`Welcome to ${guild.name}!`)
    .setDescription(`Hey ${member}, welcome to the team. Here's what you need to know:`)
    .addFields(
      { name: "Who we are", value: "Outlet Media -- we buy ads for music promoters.", inline: false },
      { name: "Need help?", value: "Ask in any channel or DM an admin.", inline: false },
    )
    .setColor(0x5865f2)
    .setTimestamp();

  if (welcomeChannel) {
    await welcomeChannel.send({ embeds: [embed] }).catch(() => {});
  }

  // DM the new member
  try {
    await member.send(
      `Welcome to **${guild.name}**! You've been added to the team. ` +
      `Check the channels and let us know if you need anything.`
    );
  } catch {
    // User has DMs disabled
  }

  // Assign default role if configured
  const defaultRoleId = process.env.DISCORD_DEFAULT_ROLE_ID;
  if (defaultRoleId) {
    await member.roles.add(defaultRoleId).catch((err) => {
      console.warn("[discord-admin] Could not assign default role:", err.message);
    });
  }

  await logAction(`New member joined: ${member.user.tag} — assigned default role, sent welcome.`);
}

// ─── Slash Commands ────────────────────────────────────────────────────────

const commands = [
  new SlashCommandBuilder()
    .setName("report")
    .setDescription("Get a server health report -- channel activity, member stats, moderation summary"),

  new SlashCommandBuilder()
    .setName("optimize")
    .setDescription("Let the AI analyze the server and suggest/make improvements"),

  new SlashCommandBuilder()
    .setName("cleanup")
    .setDescription("Archive dead channels and clean up the server")
    .addIntegerOption(opt =>
      opt.setName("days")
        .setDescription("Archive channels inactive for this many days (default: 30)")
        .setRequired(false)),

  new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Show role distribution and let AI optimize role structure"),

  new SlashCommandBuilder()
    .setName("channel")
    .setDescription("Create, archive, or reorganize a channel")
    .addStringOption(opt =>
      opt.setName("action")
        .setDescription("What to do")
        .setRequired(true)
        .addChoices(
          { name: "create", value: "create" },
          { name: "archive", value: "archive" },
          { name: "rename", value: "rename" },
        ))
    .addStringOption(opt =>
      opt.setName("name")
        .setDescription("Channel name")
        .setRequired(true)),

  new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Ask the AI anything about the server")
    .addStringOption(opt =>
      opt.setName("question")
        .setDescription("Your question")
        .setRequired(true)),

  new SlashCommandBuilder()
    .setName("restructure")
    .setDescription("Execute full server restructure — archive dead channels, create new structure, new roles"),
];

async function registerSlashCommands(guildId?: string): Promise<void> {
  // Auto-detect client ID from the bot user if not set in env
  const clientId = CLIENT_ID || client?.user?.id;
  if (!clientId || !BOT_TOKEN) {
    console.warn("[discord-admin] Cannot determine client ID — slash commands disabled");
    return;
  }

  const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);
  const resolvedGuildId = guildId || GUILD_ID;

  try {
    const body = commands.map(c => c.toJSON());
    if (resolvedGuildId) {
      // Guild commands register instantly (global takes up to 1 hour)
      await rest.put(Routes.applicationGuildCommands(clientId, resolvedGuildId), { body });
    } else {
      await rest.put(Routes.applicationCommands(clientId), { body });
    }
    console.log(`[discord-admin] Registered ${commands.length} slash commands`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[discord-admin] Failed to register slash commands:", msg);
  }
}

async function handleSlashCommand(interaction: Interaction): Promise<void> {
  if (!interaction.isChatInputCommand()) return;
  if (!guild) return;

  const { commandName } = interaction;

  switch (commandName) {
    case "report":
      await interaction.deferReply();
      await handleReport(interaction);
      break;

    case "optimize":
      await interaction.deferReply();
      await handleOptimize(interaction);
      break;

    case "cleanup":
      await interaction.deferReply();
      await handleCleanup(interaction);
      break;

    case "roles":
      await interaction.deferReply();
      await handleRoles(interaction);
      break;

    case "channel":
      await interaction.deferReply();
      await handleChannelCommand(interaction);
      break;

    case "ask":
      await interaction.deferReply();
      await handleAsk(interaction);
      break;

    case "restructure":
      await interaction.deferReply();
      await handleRestructure(interaction);
      break;

    default:
      await interaction.reply("Unknown command.");
  }
}

// ─── Server Snapshot (for Claude context) ──────────────────────────────────

async function getServerSnapshot(): Promise<Record<string, unknown>> {
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

// ─── Server Restructure ─────────────────────────────────────────────────────

/**
 * Thin wrapper around the restructure module.
 * Logs the result to the bot-logs channel.
 */
export async function runServerRestructure(): Promise<string> {
  if (!guild) return "Guild not available.";
  const result = await _runServerRestructure(guild);
  if (result.startsWith("**Server Restructure Complete**")) {
    await logAction(result);
  }
  return result;
}

// ─── Scheduled Tasks ───────────────────────────────────────────────────────

/**
 * Run daily server analytics. Called from scheduler.ts.
 * Posts a summary to the log channel.
 */
export async function runDailyServerReport(): Promise<void> {
  if (!guild) return;

  const snapshot = await getServerSnapshot();
  const prompt =
    `Generate a brief daily report for this Discord server. Include:\n` +
    `1. Member activity summary\n` +
    `2. Most/least active channels\n` +
    `3. Any concerns or suggestions\n` +
    `Keep it under 500 words.\n\n` +
    `Server data:\n${JSON.stringify(snapshot, null, 2)}`;

  const result = await runClaudeForDiscord(prompt);
  await logAction(`**Daily Report**\n\n${result}`);

  // Reset activity counters for the new day
  channelActivity.clear();
}

/**
 * Check for channels that need attention. Called periodically.
 */
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
      staleChannels.map(n => `- #${n}`).join("\n") +
      `\n\nUse \`/cleanup\` to archive them.`
    );
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * Build the admin system prompt with a live server snapshot injected.
 * Reads the prompt template and replaces {{SERVER_SNAPSHOT}} with real data.
 */
export async function buildAdminPrompt(): Promise<string> {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const promptPath = path.join(process.cwd(), "prompts", "discord-admin.txt");

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

async function runClaudeForDiscord(prompt: string, forChannelId?: string): Promise<string> {
  if (state.jobRunning || state.thinkRunning || state.discordAdminRunning) {
    return "Agent is currently busy with another task. Try again in a moment.";
  }

  state.discordAdminRunning = true;
  const existingSession = forChannelId ? channelSessions.get(forChannelId) : undefined;

  try {
    // Build system prompt with live server snapshot on each call
    const systemPrompt = await buildAdminPrompt();

    const result = await runClaude({
      prompt,
      systemPrompt,
      systemPromptName: "discord-admin",
      maxTurns: 25,
      resumeSessionId: existingSession,
    });

    // Save session so follow-up messages continue the conversation
    if (forChannelId && result.sessionId) {
      channelSessions.set(forChannelId, result.sessionId);
    }

    return result.text || "Done.";
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return `Error: ${msg}`;
  } finally {
    state.discordAdminRunning = false;
  }
}

async function logAction(text: string): Promise<void> {
  if (!client || !logChannelId) {
    console.log(`[discord-admin] ${text}`);
    return;
  }

  try {
    const channel = await client.channels.fetch(logChannelId);
    if (channel?.isTextBased()) {
      // Split long messages
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
