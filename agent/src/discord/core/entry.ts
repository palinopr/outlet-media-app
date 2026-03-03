/**
 * discord.ts -- Thin Discord entry point.
 *
 * Wires all services on startup:
 * - Webhooks (agent identities)
 * - Queue (per-agent slots)
 * - Approvals (three-tier)
 * - Buttons, slash commands
 * - Message routing (delegates to message-handler.ts)
 */

import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  MessageFlags,
  Partials,
  type TextChannel,
} from "discord.js";
import { isAnyAgentBusy } from "../../state.js";
import { matchManualTrigger, isConfigChannel, isInternalChannel } from "./router.js";
import { handleScheduleCommand, initScheduleJobs } from "../commands/schedule.js";
import { handleSuperviseCommand } from "../commands/supervisor.js";
import { handleDashboardCommand } from "../commands/dashboard.js";
import { handleMessage, isChannelLocked, cleanForDiscord, chunkText } from "../../events/message-handler.js";
import { initWebhooks } from "../../services/webhook-service.js";
import { initQueue } from "../../services/queue-service.js";
import { initApprovals } from "../../services/approval-service.js";

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
        GatewayIntentBits.GuildMembers,
      ],
      partials: [Partials.Channel, Partials.Message, Partials.GuildMember],
    })
  : null;

/** Per-channel Claude session IDs (kept for !reset command compatibility) */
export const channelSessions = new Map<string, string>();
const MAX_CHANNEL_SESSIONS = 100;

/** Evict the oldest entry when channelSessions exceeds its size limit.
 *  Call after any channelSessions.set() to cap memory usage. */
export function trimChannelSessions(): void {
  while (channelSessions.size > MAX_CHANNEL_SESSIONS) {
    const oldest = channelSessions.keys().next().value;
    if (oldest) channelSessions.delete(oldest);
    else break;
  }
}

/**
 * Per-channel lock timestamps. Tracks when each channel lock was acquired
 * so we can detect and force-release stale locks (e.g. Claude hangs > 5 min).
 */
const channelLockTimestamps = new Map<string, number>();
const CHANNEL_LOCK_MAX_AGE_MS = 300_000; // 5 minutes

/**
 * Check if a channel lock is stale and force-release it if so.
 * Returns true if a stale lock was detected and released.
 */
function checkAndReleaseStaleLock(channelId: string): boolean {
  const acquiredAt = channelLockTimestamps.get(channelId);
  if (acquiredAt === undefined) return false;

  const heldMs = Date.now() - acquiredAt;
  if (heldMs <= CHANNEL_LOCK_MAX_AGE_MS) return false;

  const heldSec = Math.round(heldMs / 1000);
  console.warn(
    `[discord] Stale channel lock on ${channelId} -- held for ${heldSec}s (max ${CHANNEL_LOCK_MAX_AGE_MS / 1000}s). Force-releasing.`,
  );
  channelLockTimestamps.delete(channelId);
  return true;
}

/**
 * Record when a channel lock is acquired. Called before handleMessage.
 */
export function markChannelLockAcquired(channelId: string): void {
  channelLockTimestamps.set(channelId, Date.now());
}

/**
 * Clear a channel lock timestamp. Called when handleMessage completes.
 */
export function markChannelLockReleased(channelId: string): void {
  channelLockTimestamps.delete(channelId);
}

/**
 * Dedup guard: prevent the same message from being processed twice.
 */
const processedMessages = new Set<string>();
const MAX_PROCESSED = 500;

function markProcessed(msgId: string): boolean {
  if (processedMessages.has(msgId)) return false;
  processedMessages.add(msgId);
  if (processedMessages.size > MAX_PROCESSED) {
    const first = processedMessages.values().next().value;
    if (first) processedMessages.delete(first);
  }
  return true;
}

export function startDiscordBot(): void {
  if (!discordClient) {
    console.warn("[discord] DISCORD_BOT_TOKEN not set -- Discord bot disabled");
    return;
  }

  discordClient.once("ready", async (c) => {
    console.log(`Discord bot online: ${c.user.tag}`);

    // Initialize core services
    initQueue();
    await initWebhooks(discordClient!);
    await initApprovals(discordClient!);
    console.log("[discord] Core services initialized (queue, webhooks, approvals)");

    // Initialize event-driven triggers and agent spawner
    const { initTriggers } = await import("../../events/trigger-handler.js");
    initTriggers();
    const { initSpawner } = await import("../../agents/spawner.js");
    initSpawner(discordClient!);
    console.log("[discord] Triggers and spawner initialized");

    // Start bot presence rotation
    const { initStatus } = await import("../../services/status-service.js");
    initStatus(discordClient!);
    console.log("[discord] Bot presence rotation started");

    const { initDiscordAdmin } = await import("../commands/admin.js");
    await initDiscordAdmin(discordClient);

    // Wire schedule job runners
    const { getJobRunners } = await import("../../scheduler.js");
    initScheduleJobs(getJobRunners());
    console.log("[discord] Schedule job runners initialized");

    // Register interactive button handler
    const { registerButtonHandler } = await import("../features/buttons.js");
    registerButtonHandler(discordClient!);
    console.log("[discord] Button interaction handler registered");

    // Register slash commands (guild-scoped, instant)
    const { registerSlashCommands, registerSlashHandler } = await import("../commands/slash.js");
    await registerSlashCommands(token!);
    registerSlashHandler(discordClient!);
    console.log("[discord] Slash command handler registered");
  });

  discordClient.on("messageCreate", async (msg) => {
    if (msg.author.bot) return;

    const content = msg.content.trim();
    if (!content) return;

    // Dedup
    if (!markProcessed(msg.id)) {
      console.log(`[discord] DEDUP blocked msg ${msg.id} from ${msg.author.username}`);
      return;
    }
    console.log(`[discord] Processing msg ${msg.id} from ${msg.author.username}: ${content.slice(0, 60)}`);

    // Run auto-moderation first (fast path, no Claude)
    const { checkAutoMod } = await import("../commands/admin.js");
    const blocked = await checkAutoMod(msg);
    if (blocked) return;

    // Resolve channel name for routing
    const channelName = "name" in msg.channel
      ? (msg.channel as TextChannel).name
      : "";

    // Simple built-in commands
    if (content === "!status" || content === "/status") {
      const busy = isAnyAgentBusy();
      await msg.reply(busy ? "Agent is busy running a task." : "Agent is idle and ready.");
      return;
    }

    if (content === "!help" || content === "/help") {
      const helpText = [
        "**META AGENT Commands** (use `/` or `!`)",
        "",
        "`!help` -- this message",
        "`!status` -- check if the agent is idle or busy",
        "`!reset` -- clear conversation context in this channel",
        "",
        "**Agent channels** -- just type naturally:",
        "  #boss -- orchestrator, delegation, supervision",
        "  #media-buyer -- Meta Ads, budgets, ROAS",
        "  #tm-data -- Ticketmaster events, demographics",
        "  #creative -- ad creative, copy, images",
        "  #dashboard -- reporting, analytics, trends",
        "  #zamora / #kybba -- client forums",
        "  #general -- team chat",
        "",
        "**Manual triggers:**",
        "  `run meta sync` (in #media-buyer)",
        "  `run tm sync` (in #tm-data)",
        "  `run think` (any channel)",
        "",
        "**Inspect** (in #agent-internals):",
        "  `inspect all` -- list all agents",
        "  `inspect <agent> memory|skills|prompt` -- view agent internals",
        "",
        "**Admin:**",
        "  `!supervise` -- Boss reviews all agent activity",
        "  `!dashboard` -- update campaign status panel",
        "  `!roles` -- ensure Admin/Team/Bot/Viewer roles",
        "  `!restructure` -- enforce full server layout",
        "",
        "**Schedule** (in #schedule):",
        "  `!schedule list` -- show all jobs with status + buttons",
        "  `!enable <job>` / `!disable <job>` -- toggle a job",
        "",
        "**Agents respond via webhooks with unique identities.**",
        "**Three-tier approval: Green (auto), Yellow (Boss checks), Red (you approve).**",
      ].join("\n");
      await msg.reply(helpText);
      return;
    }

    if (content === "!reset" || content === "/reset") {
      channelSessions.delete(msg.channelId);
      await msg.reply("Conversation reset. Starting fresh.");
      return;
    }

    if (content === "!restructure" || content === "/restructure") {
      const guild = discordClient?.guilds.cache.first();
      if (!guild) { await msg.reply("No guild found."); return; }
      await msg.reply("Running server restructure...");
      const { runServerRestructure } = await import("../features/restructure.js");
      const result = await runServerRestructure(guild);
      const chunks2 = chunkText(result, 1900);
      for (const chunk of chunks2) {
        if ("send" in msg.channel) await (msg.channel as TextChannel).send(chunk);
      }
      return;
    }

    if (content === "!roles" || content === "/roles") {
      const guild = discordClient?.guilds.cache.first();
      if (!guild) { await msg.reply("No guild found."); return; }
      const { ensureRoles } = await import("../features/restructure.js");
      const result = await ensureRoles(guild);
      await msg.reply(result);
      return;
    }

    if (content === "!supervise" || content === "/supervise") {
      if (!discordClient) { await msg.reply("Bot not connected."); return; }
      await msg.reply("Running Boss supervision cycle...");
      const result = await handleSuperviseCommand(discordClient);
      if (result.text) await (msg.channel as TextChannel).send(result.text);
      await (msg.channel as TextChannel).send({ embeds: [result.embed] });
      return;
    }

    if (content === "!dashboard" || content === "/dashboard") {
      if (!discordClient) { await msg.reply("Bot not connected."); return; }
      await msg.reply("Updating dashboard...");
      const result = await handleDashboardCommand(discordClient);
      if (result.text) await (msg.channel as TextChannel).send(result.text);
      if (result.embed) await (msg.channel as TextChannel).send({ embeds: [result.embed] });
      return;
    }

    // Schedule channel
    if (channelName === "schedule") {
      const schedResult = await handleScheduleCommand(content, discordClient!, channelName);
      if (schedResult) {
        if (schedResult.text) await msg.reply(schedResult.text);
        if (schedResult.embed) {
          const sendOpts: Record<string, unknown> = { embeds: [schedResult.embed] };
          if (schedResult.buttons) {
            const { scheduleButtons } = await import("../features/buttons.js");
            sendOpts.components = [scheduleButtons()];
          }
          await (msg.channel as TextChannel).send(sendOpts);
        }
      }
      return;
    }

    // Agent internals channel: inspect commands
    if (channelName === "agent-internals") {
      const { handleInspectCommand } = await import("../../events/inspect-handler.js");
      const handled = await handleInspectCommand(msg, content);
      if (handled) return;
    }

    // Internal channels (memory/skills): bot-managed, skip
    if (isInternalChannel(channelName)) return;
    if (isConfigChannel(channelName)) return;

    // Thread commands
    if (content === "!threads" || content === "/threads") {
      if ("threads" in msg.channel) {
        const { listThreads } = await import("../features/threads.js");
        const result = await listThreads(msg.channel as TextChannel);
        await msg.reply(result);
      } else {
        await msg.reply("Threads are only available in client channels (#zamora, #kybba).");
      }
      return;
    }

    if (content.toLowerCase().startsWith("thread:") || content.toLowerCase().startsWith("new thread:")) {
      const { maybeCreateThread } = await import("../features/threads.js");
      const thread = await maybeCreateThread(msg, channelName);
      if (thread) {
        await msg.reply(`Thread created: **${thread.threadName}** -- continue the conversation there.`);
        return;
      }
    }

    // Manual job triggers
    const trigger = matchManualTrigger(channelName, content);
    if (trigger) {
      const { triggerManualJob } = await import("../../scheduler.js");
      await msg.reply(`Triggering ${trigger}...`);
      triggerManualJob(trigger);
      return;
    }

    // Per-channel lock with stale lock detection
    if (isChannelLocked(msg.channelId)) {
      const wasStale = checkAndReleaseStaleLock(msg.channelId);
      if (!wasStale) {
        console.log(`[discord] Channel ${channelName} already processing, skipping msg ${msg.id}`);
        return;
      }
      // Stale lock was force-released, proceed with this message
    }

    // Track lock acquisition time and route to the correct agent
    markChannelLockAcquired(msg.channelId);
    try {
      await handleMessage(msg, content, channelName, discordClient);
    } finally {
      markChannelLockReleased(msg.channelId);
    }
  });

  discordClient.login(token).catch((err: unknown) => {
    const m = err instanceof Error ? err.message : String(err);
    console.error("[discord] Login failed:", m);
  });
}

// --- Channel Router (outbound notifications) ---

const CHANNEL_ROUTES: Record<string, string> = {
  "general":       "general",
  "dashboard":     "dashboard",
  "media-buyer":   "media-buyer",
  "tm-data":       "tm-data",
  "creative":      "creative",
  "boss":          "boss",
  "zamora":        "zamora",
  "kybba":         "kybba",
  "agent-feed":    "agent-feed",
  "schedule":      "schedule",
  "morning-briefing": "morning-briefing",
  "approvals":     "approvals",
  "war-room":      "war-room",
  "ops":           "ops",
  "audit-log":     "audit-log",

  // Aliases
  "performance":   "dashboard",
  "alerts":        "agent-feed",
  "logs":          "agent-feed",
  "active-jobs":   "agent-feed",
  "agent-alerts":  "agent-feed",
  "agent-logs":    "agent-feed",
  "bot-logs":      "agent-feed",
  "meta-api":      "media-buyer",
};

const channelIdCache = new Map<string, string>();

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

  return channelId || null;
}

/** Channels that send silent (no push/desktop notification) */
const SILENT_CHANNELS = new Set(["agent-feed", "audit-log"]);

/**
 * Send a message to a specific channel by route name.
 */
export async function notifyChannel(target: string, text: string): Promise<void> {
  if (!discordClient) return;

  const channelName = CHANNEL_ROUTES[target] || target;
  const resolvedId = await resolveChannelId(channelName);
  if (!resolvedId) return;

  const silent = SILENT_CHANNELS.has(channelName);

  try {
    const channel = await discordClient.channels.fetch(resolvedId);
    if (channel && channel.isTextBased()) {
      const chunks = chunkText(cleanForDiscord(text), 1900);
      for (const chunk of chunks) {
        await (channel as TextChannel).send(
          silent
            ? { content: chunk, flags: [MessageFlags.SuppressNotifications] }
            : chunk
        );
      }
    }
  } catch (err) {
    const m = err instanceof Error ? err.message : String(err);
    console.warn(`[discord] Failed to send to #${channelName}:`, m);
  }
}

/** Legacy: send to the configured default channel */
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
