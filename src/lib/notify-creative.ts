/**
 * Fire-and-forget Discord notification to #creative when an asset import fails
 * due to a provider/config error that needs team attention.
 */

const GUILD_ID = "1340092028280770693";
let cachedChannelId: string | null = null;

interface NotifyPayload {
  clientSlug: string;
  folderUrl: string;
  provider: string;
  error: string;
}

async function resolveChannelId(token: string): Promise<string | null> {
  if (cachedChannelId) return cachedChannelId;
  const res = await fetch(
    `https://discord.com/api/v10/guilds/${GUILD_ID}/channels`,
    { headers: { Authorization: `Bot ${token}` } },
  );
  if (!res.ok) return null;
  const channels: { id: string; name: string }[] = await res.json();
  const creative = channels.find((c) => c.name === "creative");
  if (creative) cachedChannelId = creative.id;
  return cachedChannelId;
}

export function notifyCreative(payload: NotifyPayload): void {
  const token = process.env.DISCORD_TOKEN;
  if (!token) return;

  // Fire-and-forget -- don't await, don't block the response
  resolveChannelId(token)
    .then((channelId) => {
      if (!channelId) return;
      const content = [
        `**Asset Import Failed**`,
        `Client: \`${payload.clientSlug}\``,
        `Provider: ${payload.provider}`,
        `Folder: ${payload.folderUrl}`,
        `Error: ${payload.error}`,
        `Time: ${new Date().toISOString()}`,
      ].join("\n");
      return fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bot ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
    })
    .catch(() => {});
}
