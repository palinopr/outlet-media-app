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

// ─── Command Handlers (Claude-powered) ─────────────────────────────────────

async function handleReport(interaction: Interaction & { editReply: Function; channelId: string }): Promise<void> {
  const serverSnapshot = await getServerSnapshot();
  const prompt = `Generate a server health report for this Discord server. Be concise and actionable.\n\nServer data:\n${JSON.stringify(serverSnapshot, null, 2)}`;

  const result = await runClaudeForDiscord(prompt, interaction.channelId);
  await interaction.editReply(result.slice(0, 2000));
}

async function handleOptimize(interaction: Interaction & { editReply: Function; channelId: string }): Promise<void> {
  const serverSnapshot = await getServerSnapshot();
  const prompt =
    `Analyze this Discord server and make improvements. You have full permission to act.\n\n` +
    `Server data:\n${JSON.stringify(serverSnapshot, null, 2)}\n\n` +
    `Suggest and describe what changes should be made. Focus on:\n` +
    `1. Dead channels that should be archived\n` +
    `2. Missing channels that would help the team\n` +
    `3. Role structure improvements\n` +
    `4. Channel organization (categories)\n` +
    `Be specific with channel names and actions.`;

  const result = await runClaudeForDiscord(prompt, interaction.channelId);
  await interaction.editReply(result.slice(0, 2000));
}

async function handleCleanup(interaction: Interaction & { editReply: Function; channelId: string; options: { getInteger: Function } }): Promise<void> {
  const days = interaction.options.getInteger("days") ?? 30;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

  if (!guild) {
    await interaction.editReply("Guild not found.");
    return;
  }

  const deadChannels: string[] = [];
  const textChannels = guild.channels.cache.filter(
    c => c.type === ChannelType.GuildText
  );

  for (const [, ch] of textChannels) {
    const textCh = ch as TextChannel;
    // Check channel activity from our tracking
    const activity = channelActivity.get(ch.id);
    if (activity && activity.lastActive < cutoff) {
      deadChannels.push(textCh.name);
    } else if (!activity) {
      // No tracked activity -- check last message
      try {
        const msgs = await textCh.messages.fetch({ limit: 1 });
        const lastMsg = msgs.first();
        if (!lastMsg || lastMsg.createdTimestamp < cutoff) {
          deadChannels.push(textCh.name);
        }
      } catch {
        // Can't fetch messages -- skip
      }
    }
  }

  if (deadChannels.length === 0) {
    await interaction.editReply(`No channels inactive for ${days}+ days. Server looks healthy.`);
    return;
  }

  // Ask Claude what to do with them
  const prompt =
    `These Discord channels have been inactive for ${days}+ days:\n` +
    deadChannels.map(n => `- #${n}`).join("\n") + "\n\n" +
    `For each channel, recommend: archive (move to Archive category), delete, or keep. ` +
    `Explain your reasoning briefly.`;

  const result = await runClaudeForDiscord(prompt, interaction.channelId);
  await interaction.editReply(result.slice(0, 2000));
}

async function handleRoles(interaction: Interaction & { editReply: Function; channelId: string }): Promise<void> {
  if (!guild) {
    await interaction.editReply("Guild not found.");
    return;
  }

  const roles = guild.roles.cache
    .filter(r => r.name !== "@everyone")
    .map(r => ({
      name: r.name,
      color: r.hexColor,
      members: r.members.size,
      permissions: r.permissions.toArray().slice(0, 5),
      position: r.position,
    }))
    .sort((a, b) => b.position - a.position);

  const prompt =
    `Analyze this Discord server's role structure and suggest improvements.\n\n` +
    `Roles:\n${JSON.stringify(roles, null, 2)}\n\n` +
    `Consider: Are there redundant roles? Missing roles? Should permissions be adjusted? ` +
    `Recommend specific changes.`;

  const result = await runClaudeForDiscord(prompt, interaction.channelId);
  await interaction.editReply(result.slice(0, 2000));
}

async function handleChannelCommand(
  interaction: Interaction & { editReply: Function; options: { getString: Function } }
): Promise<void> {
  if (!guild) {
    await interaction.editReply("Guild not found.");
    return;
  }

  const action = interaction.options.getString("action") as string;
  const name = interaction.options.getString("name") as string;

  switch (action) {
    case "create": {
      const channel = await guild.channels.create({
        name,
        type: ChannelType.GuildText,
      });
      await logAction(`Created channel #${name} (requested via /channel)`);
      await interaction.editReply(`Created #${channel.name}`);
      break;
    }
    case "archive": {
      const target = guild.channels.cache.find(
        c => c.name === name && c.type === ChannelType.GuildText
      );
      if (!target) {
        await interaction.editReply(`Channel #${name} not found.`);
        return;
      }
      // Find or create Archive category
      let archive = guild.channels.cache.find(
        c => c.name === "Archive" && c.type === ChannelType.GuildCategory
      ) as CategoryChannel | undefined;

      if (!archive) {
        archive = await guild.channels.create({
          name: "Archive",
          type: ChannelType.GuildCategory,
        }) as CategoryChannel;
      }

      await (target as TextChannel).setParent(archive.id);
      await (target as TextChannel).permissionOverwrites.create(guild.roles.everyone, {
        SendMessages: false,
      });
      await logAction(`Archived channel #${name} (requested via /channel)`);
      await interaction.editReply(`Archived #${name} — moved to Archive category, locked.`);
      break;
    }
    case "rename": {
      // Find the closest matching channel
      const target = guild.channels.cache.find(
        c => c.type === ChannelType.GuildText
      );
      if (!target) {
        await interaction.editReply("No text channel found to rename. Specify the current name.");
        return;
      }
      await interaction.editReply(
        `To rename a channel, use: \`/ask rename #old-name to ${name}\` and I'll handle it.`
      );
      break;
    }
  }
}

async function handleAsk(interaction: Interaction & { editReply: Function; channelId: string; options: { getString: Function } }): Promise<void> {
  const question = interaction.options.getString("question") as string;
  const serverSnapshot = await getServerSnapshot();

  const prompt =
    `The user asked about this Discord server: "${question}"\n\n` +
    `Server data:\n${JSON.stringify(serverSnapshot, null, 2)}\n\n` +
    `Answer concisely. If the question requires an action (create channel, change roles, etc.), ` +
    `describe exactly what you would do.`;

  const result = await runClaudeForDiscord(prompt, interaction.channelId);
  await interaction.editReply(result.slice(0, 2000));
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

async function handleRestructure(
  interaction: Interaction & { editReply: Function }
): Promise<void> {
  try {
    const result = await runServerRestructure();
    // Split long results across messages
    const chunks = chunkText(result, 1900);
    await interaction.editReply(chunks[0] || "Done — no changes needed.");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await interaction.editReply(`Restructure failed: ${msg}`);
  }
}

// ─── Server Restructure ─────────────────────────────────────────────────────

/**
 * Target server layout:
 *
 * GENERAL:              announcements, general, standup
 * CAMPAIGNS:            campaign-updates, performance-reports, ad-creative, copy-review
 * CLIENTS:              zamora, kybba, client-onboarding
 * AGENT & AUTOMATION:   agent-logs, agent-alerts, meta-api
 * TICKETMASTER:         tm-one-data, event-updates
 * OPS:                  billing, dev-logs, admin
 * BOT ADMIN:            bot-admin, bot-logs
 * ARCHIVE:              (everything else)
 *
 * Roles: Admin, Team, Bot, Viewer
 *
 * Idempotent -- safe to run multiple times. Skips anything that already exists.
 */
export async function runServerRestructure(): Promise<string> {
  if (!guild) return "Guild not available.";
  if (state.discordAdminRunning) return "Another admin task is already running.";

  state.discordAdminRunning = true;
  try {
  const g = guild;
  const log: string[] = [];

  // ─── Helpers ──────────────────────────────────────────
  async function findOrCreateCategory(name: string): Promise<CategoryChannel> {
    let cat = g.channels.cache.find(
      c => c.name === name && c.type === ChannelType.GuildCategory
    ) as CategoryChannel | undefined;
    if (!cat) {
      cat = (await g.channels.create({
        name,
        type: ChannelType.GuildCategory,
      })) as CategoryChannel;
      log.push(`Created category: ${name}`);
    }
    return cat;
  }

  async function ensureChannel(
    name: string,
    parent: CategoryChannel,
    topic?: string,
  ): Promise<void> {
    if (g.channels.cache.find(c => c.name === name)) return;
    await g.channels.create({
      name,
      type: ChannelType.GuildText,
      parent: parent.id,
      topic,
    });
    log.push(`Created #${name}`);
  }

  async function moveChannel(
    currentName: string,
    newName: string,
    parent: CategoryChannel,
  ): Promise<void> {
    const ch = g.channels.cache.find(
      c => c.name === currentName && c.type === ChannelType.GuildText
    );
    if (!ch) return;
    if (ch.name !== newName) await (ch as TextChannel).setName(newName);
    if (ch.parentId !== parent.id) await (ch as TextChannel).setParent(parent.id);
    log.push(`Moved #${currentName} -> #${newName}`);
  }

  const archiveCat = await findOrCreateCategory("Archive");

  async function archiveChannel(ch: TextChannel, prefix?: string): Promise<void> {
    if (ch.parentId === archiveCat.id) return;
    try {
      const newName = prefix ? `${prefix}-${ch.name}`.slice(0, 100) : ch.name;
      if (prefix && ch.name !== newName) await ch.setName(newName);
      await ch.setParent(archiveCat.id);
      await ch.permissionOverwrites.create(g.roles.everyone, { SendMessages: false });
      log.push(`Archived #${newName}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log.push(`Failed to archive #${ch.name}: ${msg}`);
    }
  }

  async function archiveCategoryChildren(catName: string, prefix?: string): Promise<void> {
    const cat = g.channels.cache.find(
      c => c.name === catName && c.type === ChannelType.GuildCategory
    );
    if (!cat) return;
    const children = [...g.channels.cache.filter(c => c.parentId === cat.id).values()];
    for (const ch of children) {
      if (ch.type === ChannelType.GuildText) {
        await archiveChannel(ch as TextChannel, prefix);
      }
    }
    // Delete empty category
    const remaining = g.channels.cache.filter(c => c.parentId === cat.id);
    if (remaining.size === 0) {
      await cat.delete().catch(() => {});
      log.push(`Deleted empty category: ${catName}`);
    }
  }

  // ─── Phase 1: Archive dead categories ─────────────────
  const deadCategories = [
    { name: "Don Omar", prefix: "do" },
    { name: "Tool", prefix: "tool" },
    { name: "Grupo Firme", prefix: "gf" },
    { name: "Marco antonio solis", prefix: "mas" },
    { name: "Vaqueros", prefix: "vaq" },
    { name: "Campañas", prefix: "camp" },
    { name: "AI", prefix: undefined },
    { name: "Amazon", prefix: undefined },
  ];
  for (const { name, prefix } of deadCategories) {
    await archiveCategoryChildren(name, prefix);
  }

  // ─── Phase 2: Archive individual dead channels ────────
  const channelsToArchive = [
    "tuplanta", "n8n-google-sheets-templates", "pdf-general",
    "optimización", "ideas-y-estrategias", "campañas-en-curso",
    "duars", "loggings",
    "reporte-house78", "reporte-duars-sports", "reporte-chente",
    "reporte-ericduars", "reporte-beamina", "reporte-musicvibe",
    "agentes-supervisor-de-host-whassap", "ai-outlet-media",
    "links-de-resultados-de-ventas",
  ];
  for (const name of channelsToArchive) {
    const ch = g.channels.cache.find(
      c => c.name === name && c.type === ChannelType.GuildText && c.parentId !== archiveCat.id
    );
    if (ch) await archiveChannel(ch as TextChannel);
  }

  // ─── Phase 3: Build target structure ──────────────────

  // GENERAL
  const generalCat = await findOrCreateCategory("General");
  // Rename "Text Channels" if it exists
  const textCat = g.channels.cache.find(
    c => c.name === "Text Channels" && c.type === ChannelType.GuildCategory
  );
  if (textCat) {
    await (textCat as CategoryChannel).setName("General");
    log.push('Renamed "Text Channels" -> "General"');
  }
  await ensureChannel("announcements", generalCat, "Team announcements -- Jaime posts, team reads");
  await ensureChannel("general", generalCat, "Day-to-day team chat");
  await ensureChannel("standup", generalCat, "Async daily updates: what you did, what is blocked");

  // CAMPAIGNS
  const campaignsCat = await findOrCreateCategory("Campaigns");
  await ensureChannel("campaign-updates", campaignsCat, "Campaign status changes, launches, pauses");
  await ensureChannel("performance-reports", campaignsCat, "ROAS, spend, daily performance numbers");
  await ensureChannel("ad-creative", campaignsCat, "Creative review, video/image approvals");
  await ensureChannel("copy-review", campaignsCat, "Ad copy drafts, headlines, CTAs");
  // Move existing channels into Campaigns if they exist
  await moveChannel("creativos", "ad-creative", campaignsCat);
  await moveChannel("reportes-y-analytics", "performance-reports", campaignsCat);

  // CLIENTS
  const clientsCat = await findOrCreateCategory("Clients");
  await ensureChannel("zamora", clientsCat, "Arjona, Alofoke, Camila campaigns");
  await ensureChannel("kybba", clientsCat, "KYBBA campaigns");
  await ensureChannel("client-onboarding", clientsCat, "New client setup checklists and docs");

  // AGENT & AUTOMATION
  const agentCat = await findOrCreateCategory("Agent & Automation");
  await ensureChannel("agent-logs", agentCat, "Think-loop output, sync results, session logs");
  await ensureChannel("agent-alerts", agentCat, "Critical/warning alerts from the agent");
  await ensureChannel("meta-api", agentCat, "Meta API issues, token refreshes, debugging");
  // Rename existing agent channels if they exist
  await moveChannel("agente-de-campañas", "agent-logs", agentCat);
  // Move existing agent-reports/alerts into this category
  const existingAlerts = g.channels.cache.find(c => c.name === "agent-alerts");
  if (existingAlerts && existingAlerts.parentId !== agentCat.id) {
    await (existingAlerts as TextChannel).setParent(agentCat.id).catch(() => {});
  }

  // TICKETMASTER
  const tmCat = await findOrCreateCategory("Ticketmaster");
  await ensureChannel("tm-one-data", tmCat, "Event snapshots, ticket metrics from TM One");
  await ensureChannel("event-updates", tmCat, "On-sale, off-sale, venue changes");

  // OPS
  const opsCat = await findOrCreateCategory("Ops");
  await ensureChannel("billing", opsCat, "Invoices, spend tracking");
  await ensureChannel("dev-logs", opsCat, "Deploys, Railway, code changes");
  await ensureChannel("admin", opsCat, "Internal ops, access requests");

  // BOT ADMIN (already exists from initDiscordAdmin, just ensure category)
  const botCat = await findOrCreateCategory("Bot Admin");
  const existingBotAdmin = g.channels.cache.find(c => c.name === "bot-admin");
  if (existingBotAdmin && existingBotAdmin.parentId !== botCat.id) {
    await (existingBotAdmin as TextChannel).setParent(botCat.id).catch(() => {});
    log.push("Moved #bot-admin into Bot Admin category");
  }
  const existingBotLogs = g.channels.cache.find(c => c.name === "bot-logs");
  if (existingBotLogs && existingBotLogs.parentId !== botCat.id) {
    await (existingBotLogs as TextChannel).setParent(botCat.id).catch(() => {});
    log.push("Moved #bot-logs into Bot Admin category");
  }

  // Clean up old Agentes/Resources categories if empty
  for (const oldCat of ["Agentes", "Resources"]) {
    const cat = g.channels.cache.find(
      c => c.name === oldCat && c.type === ChannelType.GuildCategory
    );
    if (!cat) continue;
    const remaining = g.channels.cache.filter(c => c.parentId === cat.id);
    if (remaining.size === 0) {
      await cat.delete().catch(() => {});
      log.push(`Deleted empty category: ${oldCat}`);
    }
  }

  // ─── Phase 4: Roles ──────────────────────────────────
  async function ensureRole(
    name: string,
    color: number,
    perms: bigint[],
  ): Promise<void> {
    if (g.roles.cache.find(r => r.name === name)) return;
    await g.roles.create({
      name,
      color,
      reason: "Server restructure",
      permissions: perms,
    });
    log.push(`Created ${name} role`);
  }

  await ensureRole("Admin", 0xe74c3c, [PermissionFlagsBits.Administrator]);
  await ensureRole("Team", 0x5865f2, [
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ReadMessageHistory,
    PermissionFlagsBits.AddReactions,
    PermissionFlagsBits.AttachFiles,
    PermissionFlagsBits.EmbedLinks,
    PermissionFlagsBits.UseExternalEmojis,
    PermissionFlagsBits.Connect,
    PermissionFlagsBits.Speak,
  ]);
  await ensureRole("Bot", 0x99aab5, [
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ReadMessageHistory,
    PermissionFlagsBits.EmbedLinks,
  ]);
  await ensureRole("Viewer", 0x95a5a6, [
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.ReadMessageHistory,
  ]);

  // ─── Summary ──────────────────────────────────────────
  if (log.length === 0) return "Server already matches target layout. No changes needed.";

  const summary =
    `**Server Restructure Complete**\n` +
    `${log.length} actions performed\n\n` +
    log.map(l => `- ${l}`).join("\n");

  await logAction(summary);
  return summary;
  } finally {
    state.discordAdminRunning = false;
  }
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

async function runClaudeForDiscord(prompt: string, forChannelId?: string): Promise<string> {
  if (state.jobRunning || state.thinkRunning || state.discordAdminRunning) {
    return "Agent is currently busy with another task. Try again in a moment.";
  }

  state.discordAdminRunning = true;
  const existingSession = forChannelId ? channelSessions.get(forChannelId) : undefined;

  try {
    const result = await runClaude({
      prompt,
      systemPromptName: "discord-admin",
      maxTurns: 10,
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
