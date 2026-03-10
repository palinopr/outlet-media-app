/**
 * discord.ts -- Thin Discord entry point.
 *
 * Wires all services on startup:
 * - Webhooks (agent identities)
 * - Queue (per-agent slots)
 * - Approvals (three-tier)
 * - Buttons, slash commands
 * - Message routing (delegates to command-router.ts)
 */

import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  MessageFlags,
  Partials,
  type TextChannel,
} from "discord.js";
import { initScheduleJobs } from "../commands/schedule.js";
import { initWebhooks } from "../../services/webhook-service.js";
import { initQueue } from "../../services/queue-service.js";
import { initApprovals } from "../../services/approval-service.js";
import { releaseChannelLock, cleanForDiscord, chunkText } from "../../events/message-handler.js";
import { routeMessage } from "./command-router.js";

const token = process.env.DISCORD_TOKEN;
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
export function checkAndReleaseStaleLock(channelId: string): boolean {
  const acquiredAt = channelLockTimestamps.get(channelId);
  if (acquiredAt === undefined) return false;

  const heldMs = Date.now() - acquiredAt;
  if (heldMs <= CHANNEL_LOCK_MAX_AGE_MS) return false;

  const heldSec = Math.round(heldMs / 1000);
  console.warn(
    `[discord] Stale channel lock on ${channelId} -- held for ${heldSec}s (max ${CHANNEL_LOCK_MAX_AGE_MS / 1000}s). Force-releasing.`,
  );
  channelLockTimestamps.delete(channelId);
  releaseChannelLock(channelId);
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

export function startDiscordBot(): void {
  if (!discordClient) {
    console.warn("[discord] DISCORD_TOKEN not set -- Discord bot disabled");
    return;
  }

  discordClient.once("ready", async (c) => {
    console.log(`Discord bot online: ${c.user.tag}`);

    // Initialize core services
    const { bindDelegationTaskExecutor } = await import("../../agents/delegate.js");
    bindDelegationTaskExecutor(discordClient!);

    await initQueue();
    console.log("[discord] Queue initialized");

    const { startExternalTaskDispatcher } = await import("../../services/external-task-dispatcher.js");
    startExternalTaskDispatcher();
    console.log("[discord] External task dispatcher initialized");

    void initWebhooks(discordClient!)
      .then(() => {
        console.log("[discord] Webhook service initialized");
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : String(error);
        console.error("[discord] Webhook init failed -- agent identities degraded:", message);
      });

    void initApprovals(discordClient!)
      .then(() => {
        console.log("[discord] Approval service initialized");
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : String(error);
        console.error("[discord] Approval init failed -- approval workflow degraded:", message);
      });

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

  discordClient.on("messageCreate", (msg) => routeMessage(msg, discordClient));

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
  "meetings":      "meetings",
  "zamora":        "zamora",
  "kybba":         "kybba",
  "don-omar-tickets": "don-omar-tickets",
  "agent-feed":    "agent-feed",
  "email-log":     "email-log",
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
  "email-logs":    "email-log",
  "active-jobs":   "agent-feed",
  "agent-alerts":  "agent-feed",
  "agent-logs":    "agent-feed",
  "bot-logs":      "agent-feed",
  "meta-api":      "media-buyer",
  "calendar":      "meetings",
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

/**
 * Send a message to a specific channel by route name.
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
        await (channel as TextChannel).send(
          { content: chunk, flags: [MessageFlags.SuppressNotifications] }
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
