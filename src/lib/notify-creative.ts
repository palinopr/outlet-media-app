/**
 * Discord notification to #creative via webhook when asset import fails
 * after all fallback methods are exhausted. Posts as a styled agent
 * with custom avatar and embed.
 */

const GUILD_ID = "1340092028280770693";
const AGENT_NAME = "Asset Agent";
const AGENT_AVATAR = "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f916.png";

let cachedWebhook: { id: string; token: string } | null = null;
let cachedChannelId: string | null = null;

interface NotifyPayload {
  clientSlug: string;
  folderUrl: string;
  provider: string;
  error: string;
}

async function getChannelId(botToken: string): Promise<string | null> {
  if (cachedChannelId) return cachedChannelId;
  const res = await fetch(
    `https://discord.com/api/v10/guilds/${GUILD_ID}/channels`,
    { headers: { Authorization: `Bot ${botToken}` } },
  );
  if (!res.ok) return null;
  const channels: { id: string; name: string }[] = await res.json();
  const ch = channels.find((c) => c.name === "creative");
  if (ch) cachedChannelId = ch.id;
  return cachedChannelId;
}

async function getOrCreateWebhook(botToken: string, channelId: string): Promise<{ id: string; token: string } | null> {
  if (cachedWebhook) return cachedWebhook;

  // Check for existing webhook we created
  const listRes = await fetch(
    `https://discord.com/api/v10/channels/${channelId}/webhooks`,
    { headers: { Authorization: `Bot ${botToken}` } },
  );
  if (listRes.ok) {
    const hooks: { id: string; token: string; name: string }[] = await listRes.json();
    const ours = hooks.find((h) => h.name === AGENT_NAME);
    if (ours) {
      cachedWebhook = { id: ours.id, token: ours.token };
      return cachedWebhook;
    }
  }

  // Create a new webhook
  const createRes = await fetch(
    `https://discord.com/api/v10/channels/${channelId}/webhooks`,
    {
      method: "POST",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: AGENT_NAME }),
    },
  );
  if (!createRes.ok) return null;
  const hook: { id: string; token: string } = await createRes.json();
  cachedWebhook = { id: hook.id, token: hook.token };
  return cachedWebhook;
}

/** Invalidate cached webhook (call on 404/401 from Discord). */
function invalidateWebhookCache() {
  cachedWebhook = null;
}

/**
 * Notify #creative that new assets were imported and need classification.
 * The creative agent picks these up on its next sweep.
 */
export function notifyCreativeNewAssets(clientSlug: string, count: number): void {
  const botToken = process.env.DISCORD_TOKEN;
  if (!botToken) return;

  getChannelId(botToken)
    .then((channelId) => {
      if (!channelId) return;
      return getOrCreateWebhook(botToken, channelId);
    })
    .then(async (webhook) => {
      if (!webhook) return;
      const res = await fetch(
        `https://discord.com/api/v10/webhooks/${webhook.id}/${webhook.token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: AGENT_NAME,
            avatar_url: AGENT_AVATAR,
            embeds: [{
              color: 0x4CAF50,
              title: `${count} new asset${count !== 1 ? "s" : ""} imported`,
              description: `**Client:** \`${clientSlug}\`\nReady for classification. Run \`run creative-classify\` or wait for the next sweep.`,
              footer: { text: "Asset Agent" },
              timestamp: new Date().toISOString(),
            }],
          }),
        },
      );
      if (res.status === 401 || res.status === 404) invalidateWebhookCache();
    })
    .catch((e) => console.warn("[notify-creative] webhook post failed:", e instanceof Error ? e.message : String(e)));
}

export function notifyCreative(payload: NotifyPayload): void {
  const botToken = process.env.DISCORD_TOKEN;
  if (!botToken) return;

  const providerLabel = payload.provider === "gdrive" ? "Google Drive" : "Dropbox";

  getChannelId(botToken)
    .then((channelId) => {
      if (!channelId) return;
      return getOrCreateWebhook(botToken, channelId);
    })
    .then(async (webhook) => {
      if (!webhook) return;
      const res = await fetch(
        `https://discord.com/api/v10/webhooks/${webhook.id}/${webhook.token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: AGENT_NAME,
            avatar_url: AGENT_AVATAR,
            embeds: [{
              color: 0xFF6B35,
              author: {
                name: "Asset Import System",
                icon_url: AGENT_AVATAR,
              },
              title: "Import failed -- needs manual fix",
              description: [
                `I tried all available methods to access this folder but couldn't get through.`,
                ``,
                `**Client:** \`${payload.clientSlug}\``,
                `**Provider:** ${providerLabel}`,
                `**Folder:** [link](${payload.folderUrl})`,
              ].join("\n"),
              fields: [
                {
                  name: "What I tried",
                  value: payload.provider === "gdrive"
                    ? "1. OAuth access token\n2. API key (public folders)"
                    : "1. Dropbox API token",
                },
                {
                  name: "Error",
                  value: `\`\`\`${payload.error.slice(0, 200)}\`\`\``,
                },
                {
                  name: "How to fix",
                  value: payload.provider === "gdrive"
                    ? "`node agent/session/gdrive-token-refresh.mjs`\nor check if the folder is shared"
                    : "Check `DROPBOX_ACCESS_TOKEN` in env vars",
                },
              ],
              footer: {
                text: "Asset Agent -- all fallbacks exhausted",
              },
              timestamp: new Date().toISOString(),
            }],
          }),
        },
      );
      if (res.status === 401 || res.status === 404) invalidateWebhookCache();
    })
    .catch((e) => console.warn("[notify-creative] webhook post failed:", e instanceof Error ? e.message : String(e)));
}
