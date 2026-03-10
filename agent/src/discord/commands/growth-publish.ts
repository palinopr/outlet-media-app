import { updateGrowthPublishAttempt } from "../../services/growth-ledger-service.js";
import { sendAsAgent } from "../../services/webhook-service.js";
import { notifyChannel } from "../core/entry.js";

export const TIKTOK_PUBLISH_CHANNEL = "tiktok-publish";

interface ConfirmGrowthPublishInput {
  actorName: string;
  attemptRef: string;
  channelName: string;
  note?: string | null;
  platformPostId?: string | null;
  publishUrl: string;
}

interface FailGrowthPublishInput {
  actorName: string;
  attemptRef: string;
  channelName: string;
  errorMessage: string;
  note?: string | null;
}

function normalizeOptionalText(value?: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function assertTikTokPublishUrl(publishUrl: string): void {
  let parsed: URL;

  try {
    parsed = new URL(publishUrl);
  } catch {
    throw new Error("Publish URL must be a valid absolute TikTok URL.");
  }

  const hostname = parsed.hostname.toLowerCase();
  if (hostname !== "tiktok.com" && !hostname.endsWith(".tiktok.com")) {
    throw new Error("Publish URL must point to TikTok.");
  }
}

export function canConfirmGrowthPublishInChannel(channelName: string): boolean {
  return channelName === TIKTOK_PUBLISH_CHANNEL;
}

export async function confirmGrowthPublish(
  input: ConfirmGrowthPublishInput,
): Promise<{ attemptId: string; reply: string }> {
  const note = normalizeOptionalText(input.note);
  const platformPostId = normalizeOptionalText(input.platformPostId);
  assertTikTokPublishUrl(input.publishUrl);

  const updated = await updateGrowthPublishAttempt({
    actorName: input.actorName,
    attemptRef: input.attemptRef,
    note,
    platformPostId,
    publishUrl: input.publishUrl,
    source: "discord-slash",
    status: "published",
  });

  const channelMessage = [
    "Manual TikTok publish confirmed.",
    `Attempt: \`${updated.id}\``,
    `URL: ${input.publishUrl}`,
    platformPostId ? `Platform post id: \`${platformPostId}\`` : null,
    note ? `Note: ${note}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const dashboardMessage = [
    "**TikTok publish live**",
    `Attempt: \`${updated.id}\``,
    `URL: ${input.publishUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  await sendAsAgent("publisher-tiktok", input.channelName, channelMessage);
  await notifyChannel("dashboard", dashboardMessage);

  return {
    attemptId: updated.id,
    reply: `Marked publish attempt \`${updated.id}\` as published.`,
  };
}

export async function failGrowthPublish(
  input: FailGrowthPublishInput,
): Promise<{ attemptId: string; reply: string }> {
  const note = normalizeOptionalText(input.note);

  const updated = await updateGrowthPublishAttempt({
    actorName: input.actorName,
    attemptRef: input.attemptRef,
    errorMessage: input.errorMessage,
    note,
    source: "discord-slash",
    status: "failed",
  });

  const channelMessage = [
    "TikTok publish attempt failed.",
    `Attempt: \`${updated.id}\``,
    `Error: ${input.errorMessage}`,
    note ? `Note: ${note}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const dashboardMessage = [
    "**TikTok publish failed**",
    `Attempt: \`${updated.id}\``,
    `Error: ${input.errorMessage}`,
  ]
    .filter(Boolean)
    .join("\n");

  await sendAsAgent("publisher-tiktok", input.channelName, channelMessage);
  await notifyChannel("dashboard", dashboardMessage);

  return {
    attemptId: updated.id,
    reply: `Marked publish attempt \`${updated.id}\` as failed.`,
  };
}
