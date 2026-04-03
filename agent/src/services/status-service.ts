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
 * Stop the status service.
 */
export function stopStatus(): void {
  if (presenceInterval) {
    clearInterval(presenceInterval);
    presenceInterval = null;
  }
}
