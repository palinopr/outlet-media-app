import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { google } from "googleapis";
import {
  getPushRecoveryLimit,
  getLatestMailboxHistoryId as getLatestWatchedMailboxHistoryId,
  listUnhandledUnreadInboxMessageIds,
  listWatchedHistoryMessageIds,
  processWatchedMessage,
  type EmailProcessResult,
} from "./email-intelligence-service.js";
import { notifyOwner, notifyOwnerEmailAlert } from "./owner-discord-service.js";
import { toErrorMessage } from "../utils/error-helpers.js";
import { getRuntimeState, setRuntimeState } from "./runtime-state.js";

const SERVICE_ACCOUNT_PATH = fileURLToPath(new URL("../../service-account.json", import.meta.url));
const GMAIL_IMPERSONATE_USER = process.env.GMAIL_IMPERSONATE_USER ?? "jaime@outletmedia.net";
const GMAIL_PUBSUB_TOPIC = process.env.GMAIL_PUBSUB_TOPIC ?? "";
const WATCH_STATE_KEY = "gmail_watch";
const WATCH_LABEL_IDS = (process.env.GMAIL_PUSH_LABEL_IDS ?? "INBOX,SENT")
  .split(",")
  .map((label) => label.trim())
  .filter(Boolean);

interface GmailWatchState {
  historyId: string | null;
  expiration: string | null;
  updatedAt: string;
  topic: string;
  labels: string[];
}

function getGmailAuth() {
  const key = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, "utf-8")) as {
    client_email: string;
    private_key: string;
  };

  return new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: [
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.settings.basic",
    ],
    subject: GMAIL_IMPERSONATE_USER,
  });
}

function toIsoExpiration(expiration?: string | null): string | null {
  if (!expiration) return null;
  const value = Number(expiration);
  if (!Number.isFinite(value)) return null;
  return new Date(value).toISOString();
}

function isSkippedResult(result: EmailProcessResult): boolean {
  return result.summary.startsWith("Skipped already-processed") || result.summary.startsWith("Ignored Gmail message");
}

async function sendOwnerNotifications(results: EmailProcessResult[]): Promise<number> {
  const notifications = results
    .filter((result) => result.direction === "inbound" && result.notifiedOwner);

  if (notifications.length === 0) {
    return 0;
  }

  for (const notification of notifications) {
    if (notification.ownerAlert) {
      await notifyOwnerEmailAlert(notification.ownerAlert);
    } else {
      await notifyOwner(notification.summary, { channel: "email" });
    }
  }

  return notifications.length;
}

function summarizeResults(
  messageIds: string[],
  results: EmailProcessResult[],
  failureMessages: string[],
  notifiedCount: number,
): string {
  const processedResults = results.filter((result) => !isSkippedResult(result));
  const inboundCount = processedResults.filter((result) => result.direction === "inbound").length;
  const outboundCount = processedResults.filter((result) => result.direction === "outbound").length;
  const skippedCount = results.length - processedResults.length;

  const lines = [
    `Processed ${messageIds.length} watched Gmail message(s): ${inboundCount} inbound, ${outboundCount} outbound-learned, ${notifiedCount} owner notifications, ${skippedCount} skipped.`,
  ];

  if (failureMessages.length > 0) {
    lines.push(`Failures: ${failureMessages.length}.`);
    for (const message of failureMessages.slice(0, 3)) {
      lines.push(`- ${message}`);
    }
  }

  return lines.join("\n");
}

export async function ensureGmailWatch(): Promise<string> {
  if (!GMAIL_PUBSUB_TOPIC) {
    return "Gmail push disabled: GMAIL_PUBSUB_TOPIC is not configured.";
  }

  const auth = getGmailAuth();
  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users.watch({
    userId: "me",
    requestBody: {
      topicName: GMAIL_PUBSUB_TOPIC,
      labelIds: WATCH_LABEL_IDS.length > 0 ? WATCH_LABEL_IDS : undefined,
      labelFilterAction: "include",
    },
  });

  const state: GmailWatchState = {
    historyId: response.data.historyId ?? null,
    expiration: toIsoExpiration(response.data.expiration),
    updatedAt: new Date().toISOString(),
    topic: GMAIL_PUBSUB_TOPIC,
    labels: WATCH_LABEL_IDS,
  };
  await setRuntimeState(WATCH_STATE_KEY, state);

  const expiresText = state.expiration ? ` until ${state.expiration}` : "";
  return `Gmail watch armed on ${state.labels.join(", ")}${expiresText}.`;
}

export async function processGmailHistoryPush(incomingHistoryId: string): Promise<string> {
  const state = await getRuntimeState<GmailWatchState>(WATCH_STATE_KEY);
  if (!state?.historyId) {
    await setRuntimeState(WATCH_STATE_KEY, {
      historyId: incomingHistoryId,
      expiration: state?.expiration ?? null,
      updatedAt: new Date().toISOString(),
      topic: GMAIL_PUBSUB_TOPIC,
      labels: WATCH_LABEL_IDS,
    } satisfies GmailWatchState);
    return "Initialized Gmail watch cursor from incoming push event.";
  }

  if (BigInt(incomingHistoryId) <= BigInt(state.historyId)) {
    return "Ignored duplicate Gmail push event.";
  }

  try {
    const [{ messageIds, latestHistoryId }, missedUnreadIds] = await Promise.all([
      listWatchedHistoryMessageIds(state.historyId),
      listUnhandledUnreadInboxMessageIds(getPushRecoveryLimit()),
    ]);
    await setRuntimeState(WATCH_STATE_KEY, {
      ...state,
      historyId: latestHistoryId || incomingHistoryId,
      updatedAt: new Date().toISOString(),
    } satisfies GmailWatchState);

    const candidateMessageIds = [...new Set([...messageIds, ...missedUnreadIds])];

    if (candidateMessageIds.length === 0) {
      return "No new watched Gmail messages matched the push event.";
    }

    const results: EmailProcessResult[] = [];
    const failureMessages: string[] = [];

    for (const messageId of candidateMessageIds) {
      try {
        results.push(await processWatchedMessage(messageId));
      } catch (err) {
        const message = toErrorMessage(err);
        failureMessages.push(`${messageId}: ${message}`);
      }
    }

    const notifiedCount = await sendOwnerNotifications(results);
    return summarizeResults(candidateMessageIds, results, failureMessages, notifiedCount);
  } catch (err) {
    const error = toErrorMessage(err);

    if (error.includes("404")) {
      await setRuntimeState(WATCH_STATE_KEY, {
        ...state,
        historyId: incomingHistoryId,
        updatedAt: new Date().toISOString(),
      } satisfies GmailWatchState);
      return "Gmail history cursor expired. Reset to the latest push event; run /email for a full sweep.";
    }

    throw err;
  }
}

export async function pollGmailHistory(): Promise<string> {
  const latestHistoryId = await getLatestWatchedMailboxHistoryId();
  const state = await getRuntimeState<GmailWatchState>(WATCH_STATE_KEY);

  if (!state?.historyId) {
    await setRuntimeState(WATCH_STATE_KEY, {
      historyId: latestHistoryId,
      expiration: state?.expiration ?? null,
      updatedAt: new Date().toISOString(),
      topic: GMAIL_PUBSUB_TOPIC || "poll",
      labels: WATCH_LABEL_IDS,
    } satisfies GmailWatchState);
    return "Initialized Gmail history cursor from mailbox profile.";
  }

  if (BigInt(latestHistoryId) <= BigInt(state.historyId)) {
    return "No new Gmail history since last poll.";
  }

  return await processGmailHistoryPush(latestHistoryId);
}
