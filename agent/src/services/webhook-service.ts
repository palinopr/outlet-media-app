/**
 * webhook-service.ts -- Single-identity webhook management.
 *
 * All agent messages are sent as "Outlet Agent".
 * Creates/finds a webhook per channel on startup.
 * Caches webhook ID + token. Falls back to bot message if webhook unavailable.
 */

import {
  type Client,
  type TextChannel,
  WebhookClient,
  type WebhookMessageCreateOptions,
  ChannelType,
  MessageFlags,
} from "discord.js";
import { toErrorMessage } from "../utils/error-helpers.js";

const WEBHOOK_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const WEBHOOK_INIT_TIMEOUT_MS = 8_000;
const WEBHOOK_NAME = "agent-outlet";
const AGENT_DISPLAY_NAME = "Outlet Agent";
const AGENT_AVATAR_URL =
  "https://cdn.discordapp.com/avatars/1476648616188968991/caf49673430a14325a2e65ebbe81c702.png?size=512";

interface CachedWebhook {
  id: string;
  token: string;
  client: WebhookClient;
  cachedAt: number;
}

/** channelName -> CachedWebhook */
const webhookCache = new Map<string, CachedWebhook>();

let discordClient: Client | null = null;

async function withWebhookInitTimeout<T>(
  promise: Promise<T>,
  context: string,
): Promise<T | null> {
  let timer: ReturnType<typeof setTimeout>;
  return await Promise.race([
    promise.then((v) => { clearTimeout(timer); return v; }),
    new Promise<null>((resolve) => {
      timer = setTimeout(() => {
        console.warn(`[webhooks] Timed out during ${context}; continuing startup`);
        resolve(null);
      }, WEBHOOK_INIT_TIMEOUT_MS);
    }),
  ]);
}

/**
 * Initialize webhooks for all text channels on startup.
 * Call once on bot startup after "ready" event.
 */
export async function initWebhooks(client: Client): Promise<void> {
  discordClient = client;
  const guild = client.guilds.cache.first();
  if (!guild) {
    console.warn("[webhooks] No guild found -- skipping webhook init");
    return;
  }

  const textChannels = guild.channels.cache.filter(
    (c) => c.type === ChannelType.GuildText,
  ) as Map<string, TextChannel>;

  for (const channel of textChannels.values()) {
    await withWebhookInitTimeout(
      ensureWebhook(channel),
      `#${channel.name}`,
    );
  }

  console.log(`[webhooks] Initialized ${webhookCache.size} channel webhook caches`);
}

/**
 * Find or create the Outlet Agent webhook in a channel.
 */
async function ensureWebhook(channel: TextChannel): Promise<CachedWebhook | null> {
  try {
    const webhooks = await channel.fetchWebhooks();
    const existing = webhooks.find((wh) => wh.name === WEBHOOK_NAME && wh.token);

    let id: string;
    let token: string;

    if (existing && existing.token) {
      id = existing.id;
      token = existing.token;
    } else {
      const created = await channel.createWebhook({
        name: WEBHOOK_NAME,
        reason: "Outlet Agent webhook",
      });
      if (!created.token) return null;
      id = created.id;
      token = created.token;
    }

    const wh: CachedWebhook = {
      id,
      token,
      client: new WebhookClient({ id, token }),
      cachedAt: Date.now(),
    };

    webhookCache.set(channel.name, wh);
    return wh;
  } catch (err) {
    console.error(
      `[webhooks] Failed to init webhook in #${channel.name}: ${toErrorMessage(err)}`,
    );
    return null;
  }
}

/**
 * Send a message as Outlet Agent to a channel.
 * The agentKey parameter is accepted for API compatibility but ignored.
 * Falls back to regular bot message if webhook unavailable.
 */
export async function sendAsAgent(
  _agentKey: string,
  channelName: string,
  options: string | WebhookMessageCreateOptions,
): Promise<void> {
  let wh = webhookCache.get(channelName) ?? null;

  // Evict stale cache entries
  if (wh && Date.now() - wh.cachedAt > WEBHOOK_CACHE_TTL_MS) {
    webhookCache.delete(channelName);
    wh = null;
  }

  const content: WebhookMessageCreateOptions = typeof options === "string"
    ? { content: options, flags: [MessageFlags.SuppressNotifications] }
    : { ...options, flags: [MessageFlags.SuppressNotifications] };

  if (wh) {
    try {
      await wh.client.send({
        ...content,
        username: AGENT_DISPLAY_NAME,
        avatarURL: AGENT_AVATAR_URL,
      });
      return;
    } catch (err) {
      console.warn(
        `[webhooks] Webhook send failed in #${channelName}: ${toErrorMessage(err)}`,
      );
      webhookCache.delete(channelName);
    }
  }

  // Fallback: create webhook on the fly
  if (discordClient) {
    const guild = discordClient.guilds.cache.first();
    const channel = guild?.channels.cache.find(
      (c) => c.name === channelName && c.type === ChannelType.GuildText,
    ) as TextChannel | undefined;

    if (channel) {
      const newWh = await ensureWebhook(channel);
      if (newWh) {
        await newWh.client.send({
          ...content,
          username: AGENT_DISPLAY_NAME,
          avatarURL: AGENT_AVATAR_URL,
        });
        return;
      }

      // Last resort: send as bot
      await channel
        .send(content)
        .catch((e) => console.warn("[webhooks] fallback send failed:", toErrorMessage(e)));
    }
  }
}
