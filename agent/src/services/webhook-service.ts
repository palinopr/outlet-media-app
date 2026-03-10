/**
 * webhook-service.ts -- Per-agent webhook management.
 *
 * Creates/finds webhooks per agent channel on startup.
 * Caches webhook ID + token. Sends messages with custom name/avatar.
 * Fallback: if cached webhook is invalid, creates a new one.
 */

import {
  type Client,
  type TextChannel,
  WebhookClient,
  type WebhookMessageCreateOptions,
  ChannelType,
  MessageFlags,
} from "discord.js";

const WEBHOOK_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const WEBHOOK_INIT_TIMEOUT_MS = 8_000;

interface AgentWebhook {
  id: string;
  token: string;
  client: WebhookClient;
  name: string;
  avatarURL: string;
  cachedAt: number;
}

/** Agent display config: name, avatar, primary channel */
const AGENT_PROFILES: Record<string, { name: string; avatar: string; channels: string[] }> = {
  boss:            { name: "Boss",           avatar: "https://cdn.discordapp.com/avatars/1476648616188968991/caf49673430a14325a2e65ebbe81c702.png?size=512", channels: ["boss", "whatsapp-boss"] },
  scheduler:       { name: "Boss",           avatar: "https://cdn.discordapp.com/avatars/1476648616188968991/caf49673430a14325a2e65ebbe81c702.png?size=512", channels: ["schedule", "media-buyer"] },
  "media-buyer":   { name: "Media Buyer",    avatar: "https://cdn.discordapp.com/avatars/1476648618441179177/befbaa786048534226b126f23e08b44a.png?size=512", channels: ["media-buyer"] },
  "tm-agent":      { name: "TM Data",        avatar: "https://cdn.discordapp.com/avatars/1476648620404248648/9605f0b209911b9683696681cf50da54.png?size=512", channels: ["tm-data"] },
  creative:        { name: "Creative",       avatar: "https://cdn.discordapp.com/avatars/1476648622236897361/a4bf1ab4d7c06b255a5338913d6e9e69.png?size=512", channels: ["creative"] },
  "creative-agent":{ name: "Creative",       avatar: "https://cdn.discordapp.com/avatars/1476648622236897361/a4bf1ab4d7c06b255a5338913d6e9e69.png?size=512", channels: ["creative"] },
  reporting:       { name: "Reporting",      avatar: "https://cdn.discordapp.com/avatars/1476648624342700084/bc1b26fa229e92f4d5f0c2b6a2957d84.png?size=512", channels: ["dashboard"] },
  "reporting-agent": { name: "Reporting",    avatar: "https://cdn.discordapp.com/avatars/1476648624342700084/bc1b26fa229e92f4d5f0c2b6a2957d84.png?size=512", channels: ["dashboard"] },
  "email-agent":   { name: "Email Agent",    avatar: "https://cdn.discordapp.com/avatars/1479514591859052574/b988bc7a284b9bee783ccd6f91122674.png?size=512", channels: ["email"] },
  "meeting-agent": { name: "Meeting Agent",  avatar: "https://cdn.discordapp.com/avatars/1479528327629770774/f8a2f2fd9ec1c59c841b2be82e3922bf.png?size=512", channels: ["meetings"] },
  "don-omar-agent":{ name: "Don Omar",       avatar: "https://cdn.discordapp.com/avatars/1479566420307087400/2f275dfb289ac4a08547b343e12bba3e.png?size=512", channels: ["don-omar-tickets"] },
  "customer-whatsapp-agent": {
    name: "Client Manager",
    avatar: "https://cdn.discordapp.com/avatars/1476648626007838894/a885030673dee1ac45739239f3cb1da7.png?size=512",
    channels: ["dashboard", "zamora", "kybba", "don-omar-tickets"],
  },
  "client-manager":{ name: "Client Manager", avatar: "https://cdn.discordapp.com/avatars/1476648626007838894/a885030673dee1ac45739239f3cb1da7.png?size=512", channels: ["zamora", "kybba"] },
  general: {
    name: "Outlet Agent",
    avatar: "https://cdn.discordapp.com/avatars/1476648616188968991/caf49673430a14325a2e65ebbe81c702.png?size=512",
    channels: ["general"],
  },
};

/** channelName -> agentKey -> AgentWebhook */
const webhookCache = new Map<string, Map<string, AgentWebhook>>();

let discordClient: Client | null = null;

async function withWebhookInitTimeout<T>(
  promise: Promise<T>,
  context: string,
): Promise<T | null> {
  return await Promise.race([
    promise,
    new Promise<null>((resolve) => {
      setTimeout(() => {
        console.warn(`[webhooks] Timed out during ${context}; continuing startup`);
        resolve(null);
      }, WEBHOOK_INIT_TIMEOUT_MS);
    }),
  ]);
}

/**
 * Initialize webhooks for all agents in their primary channels.
 * Call once on bot startup after "ready" event.
 */
export async function initWebhooks(client: Client): Promise<void> {
  discordClient = client;
  const guild = client.guilds.cache.first();
  if (!guild) {
    console.warn("[webhooks] No guild found -- skipping webhook init");
    return;
  }

  for (const [agentKey, profile] of Object.entries(AGENT_PROFILES)) {
    for (const channelName of profile.channels) {
      const channel = guild.channels.cache.find(
        c => c.name === channelName && c.type === ChannelType.GuildText
      ) as TextChannel | undefined;

      if (!channel) {
        console.warn(`[webhooks] Channel #${channelName} not found for ${agentKey}`);
        continue;
      }

      await withWebhookInitTimeout(
        ensureWebhook(channel, agentKey, profile.name, profile.avatar),
        `${agentKey} in #${channel.name}`,
      );
    }
  }

  console.log(`[webhooks] Initialized ${webhookCache.size} channel webhook caches`);
}

/**
 * Find or create a webhook for an agent in a channel.
 */
async function ensureWebhook(
  channel: TextChannel,
  agentKey: string,
  name: string,
  avatarURL: string,
): Promise<AgentWebhook | null> {
  try {
    const webhooks = await channel.fetchWebhooks();
    // Look for existing webhook with our naming convention
    const existing = webhooks.find(wh => wh.name === `agent-${agentKey}` && wh.token);

    let id: string;
    let token: string;

    if (existing && existing.token) {
      id = existing.id;
      token = existing.token;
    } else {
      const created = await channel.createWebhook({
        name: `agent-${agentKey}`,
        reason: `Agent webhook for ${name}`,
      });
      if (!created.token) return null;
      id = created.id;
      token = created.token;
    }

    const wh: AgentWebhook = {
      id,
      token,
      client: new WebhookClient({ id, token }),
      name,
      avatarURL,
      cachedAt: Date.now(),
    };

    // Cache by channel
    if (!webhookCache.has(channel.name)) {
      webhookCache.set(channel.name, new Map());
    }
    webhookCache.get(channel.name)!.set(agentKey, wh);

    return wh;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[webhooks] Failed to init webhook for ${agentKey} in #${channel.name}: ${msg}`);
    return null;
  }
}

/**
 * Send a message as a specific agent to a channel.
 * Falls back to regular bot message if webhook unavailable.
 */
export async function sendAsAgent(
  agentKey: string,
  channelName: string,
  options: string | WebhookMessageCreateOptions,
): Promise<void> {
  const channelWebhooks = webhookCache.get(channelName);
  let wh = channelWebhooks?.get(agentKey) ?? null;

  // Evict stale cache entries (older than 1 hour)
  if (wh && Date.now() - wh.cachedAt > WEBHOOK_CACHE_TTL_MS) {
    channelWebhooks?.delete(agentKey);
    wh = null;
  }

  const content: WebhookMessageCreateOptions = typeof options === "string"
    ? { content: options, flags: [MessageFlags.SuppressNotifications] }
    : {
        ...options,
        flags: [MessageFlags.SuppressNotifications],
      };

  if (wh) {
    try {
      await wh.client.send({
        ...content,
        username: wh.name,
        avatarURL: wh.avatarURL,
      });
      return;
    } catch {
      // Webhook invalid -- try to recreate
      channelWebhooks?.delete(agentKey);
    }
  }

  // Fallback: create webhook on the fly for this channel
  if (discordClient) {
    const guild = discordClient.guilds.cache.first();
    const channel = guild?.channels.cache.find(
      c => c.name === channelName && c.type === ChannelType.GuildText
    ) as TextChannel | undefined;

    if (channel) {
      const profile = AGENT_PROFILES[agentKey];
      if (profile) {
        const newWh = await ensureWebhook(channel, agentKey, profile.name, profile.avatar);
        if (newWh) {
          await newWh.client.send({
            ...content,
            username: newWh.name,
            avatarURL: newWh.avatarURL,
          });
          return;
        }
      }

      // Last resort: send as bot
      await channel.send(content).catch(() => {});
    }
  }
}

/**
 * Register a dynamic agent's webhook (for spawned agents).
 */
export async function registerAgentWebhook(
  agentKey: string,
  name: string,
  avatarURL: string,
  channelNames: string[],
): Promise<void> {
  AGENT_PROFILES[agentKey] = { name, avatar: avatarURL, channels: channelNames };

  if (!discordClient) return;
  const guild = discordClient.guilds.cache.first();
  if (!guild) return;

  for (const channelName of channelNames) {
    const channel = guild.channels.cache.find(
      c => c.name === channelName && c.type === ChannelType.GuildText
    ) as TextChannel | undefined;

    if (channel) {
      await ensureWebhook(channel, agentKey, name, avatarURL);
    }
  }
}

/** Get list of registered agent keys */
export function getAgentKeys(): string[] {
  return Object.keys(AGENT_PROFILES);
}

/** Get agent profile by key */
export function getAgentProfile(key: string) {
  return AGENT_PROFILES[key] ?? null;
}
