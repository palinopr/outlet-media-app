/**
 * status-service.ts -- Bot presence and agent status embeds.
 *
 * Rotates bot presence through active tasks.
 * Creates/updates pinned status embeds in agent work channels.
 */

import {
  type Client,
  ActivityType,
  EmbedBuilder,
  type TextChannel,
  ChannelType,
} from "discord.js";
import { toErrorMessage } from "../utils/error-helpers.js";
import { getActiveTasks, getQueueDepth } from "./queue-service.js";
import { getAgentKeys, getAgentProfile } from "./webhook-service.js";

let discordClient: Client | null = null;
let presenceInterval: ReturnType<typeof setInterval> | null = null;

/** Pinned status message IDs per channel */
const statusMessageIds = new Map<string, string>();

/**
 * Initialize the status service.
 * Starts rotating bot presence through active tasks.
 */
export function initStatus(client: Client): void {
  discordClient = client;

  // Rotate presence every 15 seconds
  presenceInterval = setInterval(() => {
    updatePresence();
  }, 15_000);

  // Set initial presence
  updatePresence();

  console.log("[status] Bot presence rotation started (15s interval)");
}

/**
 * Update bot presence based on current activity.
 */
function updatePresence(): void {
  if (!discordClient) return;

  const activeTasks = getActiveTasks();

  if (activeTasks.length === 0) {
    discordClient.user?.setPresence({
      activities: [{
        name: "Idle -- waiting for tasks",
        type: ActivityType.Watching,
      }],
      status: "online",
    });
    return;
  }

  // Pick a random active task to display
  const task = activeTasks[Math.floor(Math.random() * activeTasks.length)];
  const elapsed = Math.round((Date.now() - task.createdAt.getTime()) / 1000);

  discordClient.user?.setPresence({
    activities: [{
      name: `${task.action} (${task.to}) -- ${elapsed}s`,
      type: ActivityType.Playing,
    }],
    status: "dnd",
  });
}

/**
 * Update or create a pinned status embed in an agent's work channel.
 * Shows: current task, queue depth, last active, memory size.
 */
export async function updateAgentStatus(channelName: string): Promise<void> {
  if (!discordClient) return;

  const guild = discordClient.guilds.cache.first();
  if (!guild) return;

  const channel = guild.channels.cache.find(
    c => c.name === channelName && c.type === ChannelType.GuildText
  ) as TextChannel | undefined;

  if (!channel) return;

  const agentKeys = getAgentKeys();
  const agentKey = agentKeys.find(k => {
    const profile = getAgentProfile(k);
    return profile?.channels.includes(channelName);
  });

  if (!agentKey) return;
  const profile = getAgentProfile(agentKey);
  if (!profile) return;

  const activeTasks = getActiveTasks().filter(t => t.to === agentKey);
  const queueDepth = getQueueDepth(agentKey);
  const currentTask = activeTasks[0];

  const embed = new EmbedBuilder()
    .setTitle(`${profile.name} Status`)
    .setColor(currentTask ? 0xffa726 : 0x4caf50)
    .addFields(
      {
        name: "Status",
        value: currentTask ? `Working: ${currentTask.action}` : "Idle",
        inline: true,
      },
      {
        name: "Queue",
        value: `${queueDepth} pending`,
        inline: true,
      },
    )
    .setTimestamp()
    .setFooter({ text: `Agent: ${agentKey}` });

  // Try to update existing pinned status message
  const existingId = statusMessageIds.get(channelName);
  if (existingId) {
    try {
      const msg = await channel.messages.fetch(existingId);
      await msg.edit({ embeds: [embed] });
      return;
    } catch {
      // Message no longer exists, create new one
      statusMessageIds.delete(channelName);
    }
  }

  // Create new status message and pin it
  try {
    const msg = await channel.send({ embeds: [embed] });
    await msg.pin().catch((e) => console.warn("[status] pin failed:", toErrorMessage(e)));
    statusMessageIds.set(channelName, msg.id);
  } catch (err) {
    const errMsg = toErrorMessage(err);
    console.warn(`[status] Failed to post status in #${channelName}: ${errMsg}`);
  }
}

/**
 * Update status embeds for all agent channels.
 */
export async function updateAllStatuses(): Promise<void> {
  const agentKeys = getAgentKeys();
  for (const key of agentKeys) {
    const profile = getAgentProfile(key);
    if (profile) {
      for (const channelName of profile.channels) {
        await updateAgentStatus(channelName);
      }
    }
  }
}

/**
 * Stop the status service.
 */
export function stopStatus(): void {
  if (presenceInterval) {
    clearInterval(presenceInterval);
    presenceInterval = null;
  }
}
