import { notifyChannel } from "../discord/core/entry.js";

const OWNER_USER_IDS = (process.env.DISCORD_OWNER_USER_IDS ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

function ownerMentions(): string {
  return OWNER_USER_IDS.map((id) => `<@${id}>`).join(" ");
}

function toTitleCase(value: string): string {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function summarizeEmailActions(alert: {
  appliedLabels: string[];
  archived: boolean;
  draftedReply: boolean;
}): string {
  const parts: string[] = [];
  if (alert.appliedLabels.length > 0) {
    parts.push(`Filed under ${alert.appliedLabels.slice(0, 2).join(", ")}`);
  }
  if (alert.archived) {
    parts.push("archived it");
  }
  if (alert.draftedReply) {
    parts.push("prepared a draft");
  }
  if (parts.length === 0) {
    return "Logged it for reference.";
  }
  return `${parts.join(". ")}.`;
}

function clipText(text: string, limit = 1600): string {
  if (text.length <= limit) return text;
  return `${text.slice(0, Math.max(0, limit - 16)).trimEnd()}\n\n[truncated]`;
}

function formatEmailAlert(alert: OwnerEmailAlert): string {
  const nextStep = alert.needsReply
    ? "Reply needed."
    : alert.needsOwnerAttention
      ? "Review recommended."
      : "No action needed.";

  return clipText([
    `**${alert.needsOwnerAttention ? "Review email" : "Handled email"}**`,
    `**From:** ${alert.sender}`,
    `**Subject:** ${alert.subject}`,
    `**Type:** ${toTitleCase(alert.classification)} · ${toTitleCase(alert.importance)}`,
    alert.clientSlug ? `**Client:** ${alert.clientSlug}` : null,
    `**Why:** ${alert.whyItMatters}`,
    `**Did:** ${summarizeEmailActions(alert)}`,
    `**Next:** ${nextStep}`,
  ].filter(Boolean).join("\n"));
}

function formatImportantText(text: string): string {
  const mentions = ownerMentions();
  return mentions ? `${mentions}\n${text}` : text;
}

export interface OwnerEmailAlert {
  messageId: string;
  sender: string;
  subject: string;
  classification: string;
  importance: string;
  needsOwnerAttention: boolean;
  needsReply: boolean;
  whyItMatters: string;
  clientSlug: string | null;
  appliedLabels: string[];
  archived: boolean;
  draftedReply: boolean;
}

export async function notifyOwner(
  text: string,
  options?: {
    channel?: string;
    mention?: boolean;
  },
): Promise<void> {
  const channel = options?.channel ?? "boss";
  const payload = options?.mention ? formatImportantText(text) : text;
  await notifyChannel(channel, payload);
}

export async function notifyOwnerImportant(
  text: string,
  options?: {
    channel?: string;
  },
): Promise<void> {
  await notifyOwner(text, {
    channel: options?.channel,
    mention: true,
  });
}

export async function notifyOwnerEmailAlert(alert: OwnerEmailAlert): Promise<void> {
  const important =
    alert.needsOwnerAttention ||
    alert.needsReply ||
    alert.importance === "high" ||
    alert.importance === "urgent";

  await notifyOwner(formatEmailAlert(alert), {
    channel: "email",
    mention: important,
  });
}
