import type { AgentTask } from "./queue-service.js";

const GMAIL_INBOX_RESOURCE = "gmail-inbox";
const OWNER_CALENDAR_RESOURCE = "owner-calendar";
const META_ADS_WRITE_RESOURCE = "meta-ads-write";
const WHATSAPP_SEND_RESOURCE = "whatsapp-send";
const DISCORD_OWNER_ACTIONS_RESOURCE = "discord-owner-actions";

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => readString(entry))
    .filter((entry): entry is string => entry != null);
}

function dedupe(resources: string[]): string[] {
  return [...new Set(resources)];
}

export function getInteractiveRouteResources(
  channelName: string,
  promptFile: string,
): string[] {
  const resources: string[] = [];

  if (promptFile === "email-agent" || channelName === "email") {
    resources.push(GMAIL_INBOX_RESOURCE);
  }

  if (promptFile === "meeting-agent" || channelName === "meetings") {
    resources.push(OWNER_CALENDAR_RESOURCE);
  }

  return dedupe(resources);
}

export function getDelegatedTaskResources(
  task: Pick<AgentTask, "action" | "params" | "to">,
  targetChannel: string,
): string[] {
  const resources = readStringArray(task.params._resourceLocks);

  if (
    task.action === "scheduled-copy-swap" ||
    task.action === "change-budget" ||
    task.action === "swap-creative"
  ) {
    resources.push(META_ADS_WRITE_RESOURCE);
  }

  if (task.to === "email-agent" || targetChannel === "email") {
    resources.push(GMAIL_INBOX_RESOURCE);
  }

  if (task.to === "meeting-agent" || targetChannel === "meetings") {
    resources.push(OWNER_CALENDAR_RESOURCE);
  }

  const conversationId = readString(task.params.conversationId);
  if (conversationId) {
    resources.push(`whatsapp-conversation:${conversationId}`);
  } else if (task.to === "customer-whatsapp-agent") {
    resources.push(WHATSAPP_SEND_RESOURCE);
  }

  if (task.to === "boss" && task.action === "channel-handoff") {
    resources.push(DISCORD_OWNER_ACTIONS_RESOURCE);
  }

  return dedupe(resources);
}
