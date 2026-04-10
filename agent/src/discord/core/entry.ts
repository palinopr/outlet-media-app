/**
 * entry.ts -- Discord bot entry point.
 *
 * Wires core services on startup:
 * - Webhooks (agent identity)
 * - Queue (per-message slots)
 * - Slash commands
 * - Message routing (direct to handleMessage)
 */

import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  MessageFlags,
  Partials,
  type TextChannel,
} from "discord.js";
import { initWebhooks } from "../../services/webhook-service.js";
import { initQueue, setTaskExecutor, stopPersistedTaskPoller } from "../../services/queue-service.js";
import { startRuntimeHeartbeat, stopRuntimeHeartbeat } from "../../services/runtime-state-service.js";
import { createWebTaskExecutor } from "../../services/web-task-executor.js";
import { releaseChannelLock, cleanForDiscord, chunkText, handleMessage, isChannelLocked } from "../../events/message-handler.js";
import { getAgentForChannel } from "./router.js";
import { RUNNER_INACTIVITY_TIMEOUT_MS } from "../../runner.js";
import { toErrorMessage } from "../../utils/error-helpers.js";

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

/** Per-channel Claude sessions so /reset can clear runtime conversation state. */
export const channelSessions = new Map<string, string>();

/**
 * Per-channel lock timestamps. Tracks the latest heartbeat for each active
 * channel run so we only force-release locks after the runner has exceeded
 * its own inactivity timeout.
 */
const channelLockTimestamps = new Map<string, number>();
const CHANNEL_LOCK_MAX_AGE_MS = RUNNER_INACTIVITY_TIMEOUT_MS + 60_000;

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

export function markChannelLockAcquired(channelId: string): void {
  channelLockTimestamps.set(channelId, Date.now());
}

export function markChannelLockHeartbeat(channelId: string): void {
  if (!channelLockTimestamps.has(channelId)) return;
  channelLockTimestamps.set(channelId, Date.now());
}

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

    setTaskExecutor(createWebTaskExecutor());
    await initQueue();
    console.log("[discord] Queue initialized");
    startRuntimeHeartbeat();
    console.log("[discord] Runtime heartbeat started");

    void initWebhooks(discordClient!)
      .then(() => console.log("[discord] Webhook service initialized"))
      .catch((error) => {
        const message = toErrorMessage(error);
        console.error("[discord] Webhook init failed -- agent identities degraded:", message);
      });

    const { registerSlashCommands, registerSlashHandler } = await import("../commands/slash.js");
    await registerSlashCommands(token!);
    registerSlashHandler(discordClient!);
    console.log("[discord] Slash command handler registered");
  });

  discordClient.on("messageCreate", async (msg) => {
    if (msg.author.bot) return;
    const channelName = "name" in msg.channel ? (msg.channel as TextChannel).name : "dm";
    const agent = getAgentForChannel(channelName);
    if (agent.readOnly) return;
    if (isChannelLocked(msg.channelId)) {
      checkAndReleaseStaleLock(msg.channelId);
      if (isChannelLocked(msg.channelId)) return;
    }
    const content = msg.content.trim();
    if (!content) return;
    await handleMessage(msg, content, channelName, discordClient);
  });

  discordClient.login(token).catch((err: unknown) => {
    const m = toErrorMessage(err);
    console.error("[discord] Login failed:", m);
  });
}

export async function stopDiscordRuntimeState(): Promise<void> {
  stopPersistedTaskPoller();
  await stopRuntimeHeartbeat();
}

// --- Channel notifications (outbound) ---

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

export async function notifyChannel(target: string, text: string): Promise<void> {
  if (!discordClient) return;

  const resolvedId = await resolveChannelId(target);
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
    const m = toErrorMessage(err);
    console.warn(`[discord] Failed to send to #${target}:`, m);
  }
}
