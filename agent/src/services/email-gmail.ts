import { readFileSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { google, gmail_v1 } from "googleapis";
import { getServiceSupabase } from "./supabase-service.js";
import type {
  EmailClassification,
  EmailDirection,
  EmailImportance,
  EmailMessageDetail,
  EmailTriageDecision,
  EmailThreadActionResult,
  ActivityEntry,
  BusinessContext,
  CampaignSnapshot,
  EventSnapshot,
  StyleExample,
  OwnerEmailCorrection,
} from "./email-types.js";
import {
  SERVICE_ACCOUNT_PATH,
  OWNER_CORRECTIONS_PATH,
  GMAIL_IMPERSONATE_USER,
  MY_EMAIL,
  MAX_BODY_CHARS,
  MAX_STYLE_EXAMPLES,
  MAX_THREAD_MESSAGES,
  MAX_ACTIVITY_ENTRIES,
  MANUAL_SWEEP_LIMIT,
  PUSH_RECOVERY_LIMIT,
  WATCHED_MAILBOX_LABELS,
  getManagedLabels,
} from "./email-types.js";
import {
  clip,
  uniqueStrings,
  getDomain,
  extractText,
  collectAttachmentNames,
  headerValue,
  parseAddress,
  parseAddressList,
  parseDateToIso,
  formatRecipients,
  detectLanguage,
  formatEmailParty,
  formatEmailLog,
  postEmailLog,
} from "./email-classify.js";

// ---------------------------------------------------------------------------
// Gmail auth
// ---------------------------------------------------------------------------

function readServiceAccount() {
  try {
    return JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, "utf-8")) as {
      client_email: string;
      private_key: string;
    };
  } catch (err) {
    throw new Error(`Service account key not found at ${SERVICE_ACCOUNT_PATH}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

function getGmailAuth() {
  const key = readServiceAccount();
  return new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: [
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.labels",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.settings.basic",
    ],
    subject: GMAIL_IMPERSONATE_USER,
  });
}

function getGmailClient() {
  return google.gmail({ version: "v1", auth: getGmailAuth() });
}

// ---------------------------------------------------------------------------
// Message reading
// ---------------------------------------------------------------------------

export async function findExistingEmailEvent(messageId: string): Promise<{
  direction: EmailDirection;
  status: string;
  should_notify: boolean;
} | null> {
  const supabase = getServiceSupabase();
  if (!supabase) return null;

  const { data } = await supabase
    .from("email_events")
    .select("direction,status,should_notify")
    .eq("message_id", messageId)
    .maybeSingle();

  if (!data) return null;

  return {
    direction: data.direction as EmailDirection,
    status: String(data.status ?? "received"),
    should_notify: Boolean(data.should_notify),
  };
}

export function toMessageDetail(
  data: gmail_v1.Schema$Message,
): EmailMessageDetail {
  const payload = data.payload;
  const headers = payload?.headers ?? [];
  const from = parseAddress(headerValue(headers, "From"));
  const to = parseAddressList(headerValue(headers, "To"));
  const cc = parseAddressList(headerValue(headers, "Cc"));
  const labelIds = data.labelIds ?? [];
  const bodyText = clip(extractText(payload), MAX_BODY_CHARS);
  const attachmentNames = collectAttachmentNames(payload).slice(0, 10);
  const headerMap = Object.fromEntries(
    headers
      .filter((header) => header.name && header.value)
      .map((header) => [header.name!.toLowerCase(), header.value!]),
  );
  const direction: EmailDirection = labelIds.includes("SENT") || from?.email === MY_EMAIL ? "outbound" : "inbound";

  return {
    id: data.id ?? "",
    threadId: data.threadId ?? "",
    subject: headerValue(headers, "Subject"),
    snippet: data.snippet ?? "",
    bodyText,
    date: headerValue(headers, "Date") || null,
    receivedAtIso: data.internalDate ? new Date(Number(data.internalDate)).toISOString() : parseDateToIso(headerValue(headers, "Date")),
    from,
    to,
    cc,
    labelIds,
    attachmentNames,
    headers: headerMap,
    direction,
  };
}

export async function readMessageDetail(messageId: string): Promise<EmailMessageDetail> {
  const gmail = getGmailClient();
  const response = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
    format: "full",
  });
  return toMessageDetail(response.data);
}

async function listUnreadInboxMessageIds(maxResults = MANUAL_SWEEP_LIMIT): Promise<string[]> {
  const gmail = getGmailClient();
  const response = await gmail.users.messages.list({
    userId: "me",
    q: "is:unread in:inbox",
    maxResults,
  });

  return (response.data.messages ?? [])
    .map((message) => message.id)
    .filter((value): value is string => Boolean(value));
}

export async function listUnhandledUnreadInboxMessageIds(maxResults = MANUAL_SWEEP_LIMIT): Promise<string[]> {
  const messageIds = await listUnreadInboxMessageIds(maxResults);
  if (messageIds.length === 0) return [];

  const supabase = getServiceSupabase();
  if (!supabase) return messageIds;

  const { data } = await supabase
    .from("email_events")
    .select("message_id,status")
    .in("message_id", messageIds);

  const known = new Map((data ?? []).map((r: { message_id: string; status: string }) => [r.message_id, r.status]));

  return messageIds.filter(id => {
    const status = known.get(id);
    return !status || status === "received";
  });
}

export function getPushRecoveryLimit(): number {
  return PUSH_RECOVERY_LIMIT;
}

export async function readThreadMessages(threadId: string): Promise<EmailMessageDetail[]> {
  const gmail = getGmailClient();
  const response = await gmail.users.threads.get({
    userId: "me",
    id: threadId,
    format: "full",
  });

  return (response.data.messages ?? [])
    .map((message) => toMessageDetail(message))
    .sort((a, b) => (a.receivedAtIso ?? "").localeCompare(b.receivedAtIso ?? ""))
    .slice(-MAX_THREAD_MESSAGES);
}

// ---------------------------------------------------------------------------
// Label management
// ---------------------------------------------------------------------------

async function ensureManagedLabels(): Promise<Map<string, string>> {
  const gmail = getGmailClient();
  const response = await gmail.users.labels.list({ userId: "me" });
  const managedLabels = getManagedLabels();
  const existing = new Map(
    (response.data.labels ?? [])
      .filter((label) => label.name && label.id)
      .map((label) => [label.name!, label.id!]),
  );

  for (const definition of managedLabels) {
    if (existing.has(definition.name)) continue;
    const created = await gmail.users.labels.create({
      userId: "me",
      requestBody: {
        name: definition.name,
        labelListVisibility: "labelShow",
        messageListVisibility: "show",
        color: definition.backgroundColor && definition.textColor
          ? {
              backgroundColor: definition.backgroundColor,
              textColor: definition.textColor,
            }
          : undefined,
      },
    });
    if (created.data.id && created.data.name) {
      existing.set(created.data.name, created.data.id);
    }
  }

  return existing;
}

export async function ensureManagedEmailLabels(): Promise<string[]> {
  const labels = await ensureManagedLabels();
  return [...labels.keys()].sort((left, right) => left.localeCompare(right));
}

export async function applyLabels(messageId: string, labelNames: string[]): Promise<string[]> {
  const finalLabels = uniqueStrings(labelNames);
  if (finalLabels.length === 0) return [];

  const labels = await ensureManagedLabels();
  const addLabelIds = finalLabels
    .map((name) => labels.get(name) ?? null)
    .filter((value): value is string => Boolean(value));

  if (addLabelIds.length === 0) return [];

  const gmail = getGmailClient();
  await gmail.users.messages.modify({
    userId: "me",
    id: messageId,
    requestBody: { addLabelIds },
  });

  return finalLabels;
}

// ---------------------------------------------------------------------------
// Email record queries
// ---------------------------------------------------------------------------

export async function readEmailEventRecord(messageId: string): Promise<{
  threadId: string | null;
  appliedLabels: string[];
  senderName: string | null;
  senderEmail: string | null;
  subject: string | null;
  classification: EmailClassification | null;
  importance: EmailImportance | null;
  clientSlug: string | null;
  topic: string | null;
} | null> {
  const supabase = getServiceSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("email_events")
    .select("thread_id, applied_labels, sender_name, sender_email, subject, classification, importance, client_slug, metadata")
    .eq("message_id", messageId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    threadId: data.thread_id ?? null,
    appliedLabels: Array.isArray(data.applied_labels)
      ? data.applied_labels.filter((value): value is string => typeof value === "string" && value.trim().length > 0)
      : [],
    senderName: data.sender_name ?? null,
    senderEmail: data.sender_email ?? null,
    subject: data.subject ?? null,
    classification: (data.classification as EmailClassification | null) ?? null,
    importance: (data.importance as EmailImportance | null) ?? null,
    clientSlug: data.client_slug ?? null,
    topic: typeof data.metadata === "object" && data.metadata !== null && typeof (data.metadata as Record<string, unknown>).topic === "string"
      ? (data.metadata as Record<string, string>).topic
      : null,
  };
}

async function resolveThreadId(messageId: string): Promise<string | null> {
  const existing = await readEmailEventRecord(messageId);
  if (existing?.threadId) return existing.threadId;

  const gmail = getGmailClient();
  const response = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
    format: "metadata",
  });

  return response.data.threadId ?? null;
}

async function modifyThreadLabels(
  messageId: string,
  removeLabelIds: string[],
): Promise<{ threadId: string | null; removedLabelIds: string[] }> {
  const finalRemoveLabelIds = uniqueStrings(removeLabelIds);
  const threadId = await resolveThreadId(messageId);
  const gmail = getGmailClient();

  if (threadId) {
    await gmail.users.threads.modify({
      userId: "me",
      id: threadId,
      requestBody: {
        removeLabelIds: finalRemoveLabelIds,
      },
    });

    return { threadId, removedLabelIds: finalRemoveLabelIds };
  }

  await gmail.users.messages.modify({
    userId: "me",
    id: messageId,
    requestBody: {
      removeLabelIds: finalRemoveLabelIds,
    },
  });

  return { threadId: null, removedLabelIds: finalRemoveLabelIds };
}

// ---------------------------------------------------------------------------
// Thread actions
// ---------------------------------------------------------------------------

export async function archiveMessage(messageId: string): Promise<void> {
  await modifyThreadLabels(messageId, ["INBOX", "UNREAD"]);
}

export async function markEmailThreadRead(messageId: string): Promise<EmailThreadActionResult> {
  const eventRecord = await readEmailEventRecord(messageId);
  const { threadId } = await modifyThreadLabels(messageId, ["UNREAD"]);

  await postEmailLog(formatEmailLog("manual-read", {
    sender: formatEmailParty(eventRecord?.senderName, eventRecord?.senderEmail),
    subject: eventRecord?.subject ?? "(email updated)",
    classification: eventRecord?.classification ?? undefined,
    importance: eventRecord?.importance ?? undefined,
    appliedLabels: eventRecord?.appliedLabels ?? [],
    archived: false,
    markedRead: true,
    draftedReply: false,
    note: "Owner marked the thread read.",
    topic: eventRecord?.topic ?? undefined,
    clientSlug: eventRecord?.clientSlug ?? undefined,
  }));

  return {
    messageId,
    threadId,
    appliedLabels: eventRecord?.appliedLabels ?? [],
    archived: false,
    markedRead: true,
  };
}

export async function archiveEmailThread(messageId: string): Promise<EmailThreadActionResult> {
  const eventRecord = await readEmailEventRecord(messageId);
  const { threadId } = await modifyThreadLabels(messageId, ["INBOX", "UNREAD"]);

  const supabase = getServiceSupabase();
  if (supabase) {
    const timestamp = new Date().toISOString();
    const inboundScope = threadId
      ? supabase
        .from("email_events")
        .update({
          status: "archived",
          needs_reply: false,
          should_notify: false,
          should_archive: true,
          updated_at: timestamp,
        })
        .eq("thread_id", threadId)
        .eq("direction", "inbound")
      : supabase
        .from("email_events")
        .update({
          status: "archived",
          needs_reply: false,
          should_notify: false,
          should_archive: true,
          updated_at: timestamp,
        })
        .eq("message_id", messageId);

    const draftScope = threadId
      ? supabase
        .from("email_drafts")
        .update({
          status: "discarded",
          updated_at: timestamp,
        })
        .eq("thread_id", threadId)
        .eq("status", "suggested")
      : supabase
        .from("email_drafts")
        .update({
          status: "discarded",
          updated_at: timestamp,
        })
        .eq("message_id", messageId)
        .eq("status", "suggested");

    await Promise.all([inboundScope, draftScope]);
  }

  await postEmailLog(formatEmailLog("manual-no-reply", {
    sender: formatEmailParty(eventRecord?.senderName, eventRecord?.senderEmail),
    subject: eventRecord?.subject ?? "(email updated)",
    classification: eventRecord?.classification ?? undefined,
    importance: eventRecord?.importance ?? undefined,
    appliedLabels: eventRecord?.appliedLabels ?? [],
    archived: true,
    markedRead: true,
    draftedReply: false,
    needsReply: false,
    note: "Owner set no reply. Thread archived and marked read.",
    topic: eventRecord?.topic ?? undefined,
    clientSlug: eventRecord?.clientSlug ?? undefined,
  }));

  return {
    messageId,
    threadId,
    appliedLabels: eventRecord?.appliedLabels ?? [],
    archived: true,
    markedRead: true,
  };
}

export async function getSuggestedDraftForMessage(messageId: string): Promise<{
  subject: string | null;
  body: string;
  status: string;
} | null> {
  const supabase = getServiceSupabase();
  if (!supabase) return null;

  const { data } = await supabase
    .from("email_drafts")
    .select("subject, body_text, status")
    .eq("message_id", messageId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data?.body_text) return null;

  return {
    subject: data.subject ?? null,
    body: String(data.body_text),
    status: String(data.status ?? "suggested"),
  };
}

// ---------------------------------------------------------------------------
// Context data loaders
// ---------------------------------------------------------------------------

export async function readActivityContext(clientSlug: string | null, senderEmail: string | null): Promise<string[]> {
  const path = fileURLToPath(new URL("../../session/activity-log.json", import.meta.url));
  try {
    const raw = await readFile(path, "utf-8");
    const parsed = JSON.parse(raw) as ActivityEntry[];
    const keywords = uniqueStrings([
      clientSlug,
      senderEmail?.split("@")[0],
      senderEmail?.split("@")[1],
    ]).map((value) => value.toLowerCase());

    return parsed
      .filter((entry) => {
        const haystack = JSON.stringify(entry).toLowerCase();
        return keywords.some((keyword) => keyword && haystack.includes(keyword));
      })
      .slice(-MAX_ACTIVITY_ENTRIES)
      .map((entry) => {
        const ts = entry.ts?.slice(0, 16) ?? "";
        const channel = entry.channel ?? "unknown";
        const summary = entry.responseSummary ?? entry.message ?? "";
        return `${ts} #${channel}: ${clip(summary, 180)}`;
      });
  } catch {
    return [];
  }
}

export async function readBusinessContext(clientSlug: string | null): Promise<BusinessContext> {
  if (!clientSlug) {
    return { clientSlug: null, campaigns: [], events: [] };
  }

  const supabase = getServiceSupabase();
  if (!supabase) {
    return { clientSlug, campaigns: [], events: [] };
  }

  const [{ data: campaigns }, { data: events }] = await Promise.all([
    supabase
      .from("meta_campaigns")
      .select("name,status,roas,spend,daily_budget,start_time")
      .eq("client_slug", clientSlug)
      .order("status", { ascending: true })
      .limit(5),
    supabase
      .from("tm_events")
      .select("name,date,tickets_sold,gross")
      .eq("client_slug", clientSlug)
      .order("date", { ascending: true })
      .limit(3),
  ]);

  const campaignLines = ((campaigns ?? []) as CampaignSnapshot[]).map((campaign) => {
    const spend = typeof campaign.spend === "number" ? `$${(campaign.spend / 100).toFixed(0)} spend` : "no spend";
    const roas = typeof campaign.roas === "number" ? `${campaign.roas.toFixed(2)}x ROAS` : "no ROAS";
    return `${campaign.name} (${campaign.status}, ${spend}, ${roas})`;
  });

  const eventLines = ((events ?? []) as EventSnapshot[]).map((event) => {
    const sold = typeof event.tickets_sold === "number" ? `${event.tickets_sold} sold` : "sales unknown";
    return `${event.name} (${event.date ?? "date tbd"}, ${sold})`;
  });

  return {
    clientSlug,
    campaigns: campaignLines,
    events: eventLines,
  };
}

export async function readStyleExamples(contactEmail: string | null, clientSlug: string | null): Promise<StyleExample[]> {
  const supabase = getServiceSupabase();
  if (!supabase) return [];

  const examples: StyleExample[] = [];

  if (contactEmail) {
    const { data } = await supabase
      .from("email_reply_examples")
      .select("subject,body_text,created_at,contact_email")
      .eq("contact_email", contactEmail)
      .order("created_at", { ascending: false })
      .limit(MAX_STYLE_EXAMPLES);
    examples.push(...((data ?? []) as StyleExample[]));
  }

  if (examples.length < MAX_STYLE_EXAMPLES && clientSlug) {
    const { data } = await supabase
      .from("email_reply_examples")
      .select("subject,body_text,created_at,contact_email")
      .eq("client_slug", clientSlug)
      .order("created_at", { ascending: false })
      .limit(MAX_STYLE_EXAMPLES - examples.length);
    examples.push(...((data ?? []) as StyleExample[]));
  }

  return examples.slice(0, MAX_STYLE_EXAMPLES);
}

export async function loadOwnerCorrections(): Promise<OwnerEmailCorrection[]> {
  try {
    const raw = await readFile(OWNER_CORRECTIONS_PATH, "utf-8");
    const parsed = JSON.parse(raw) as OwnerEmailCorrection[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveOwnerCorrections(corrections: OwnerEmailCorrection[]): Promise<void> {
  await writeFile(OWNER_CORRECTIONS_PATH, `${JSON.stringify(corrections, null, 2)}\n`, "utf-8");
}

export async function readOwnerCorrections(contactEmail: string | null, topic: string | null): Promise<string[]> {
  const corrections = await loadOwnerCorrections();
  const senderDomain = getDomain(contactEmail);

  return corrections
    .filter((entry) => {
      if (contactEmail && entry.sender_email === contactEmail) return true;
      if (senderDomain && entry.sender_domain === senderDomain) return true;
      if (topic && entry.topic === topic) return true;
      return false;
    })
    .slice(0, 5)
    .map((entry) => {
      const scope = entry.sender_email ?? entry.sender_domain ?? entry.topic ?? "general";
      return `${entry.created_at.slice(0, 10)} ${scope}: ${entry.note}`;
    });
}

// ---------------------------------------------------------------------------
// DB writes
// ---------------------------------------------------------------------------

export async function upsertEmailEvent(
  message: EmailMessageDetail,
  triage: EmailTriageDecision,
  threadSummary: string,
  businessContext: BusinessContext,
  activityContext: string[],
  appliedLabels: string[],
  metadata: Record<string, unknown>,
  shouldNotifyOwner: boolean,
): Promise<void> {
  const supabase = getServiceSupabase();
  if (!supabase) return;

  await supabase
    .from("email_events")
    .upsert({
      message_id: message.id,
      thread_id: message.threadId,
      direction: message.direction,
      sender_email: message.from?.email ?? null,
      sender_name: message.from?.name ?? null,
      recipient_emails: formatRecipients(message.to),
      cc_emails: formatRecipients(message.cc),
      subject: message.subject || null,
      snippet: message.snippet || null,
      body_text: message.bodyText || null,
      received_at: message.receivedAtIso,
      gmail_label_ids: message.labelIds,
      applied_labels: appliedLabels,
      classification: triage.classification,
      importance: triage.importance,
      client_slug: triage.clientSlug,
      contact_email: triage.contactEmail,
      status: message.direction === "outbound"
        ? "sent"
        : (triage.shouldArchive ? "archived" : (triage.needsReply ? "drafted" : "triaged")),
      needs_reply: triage.needsReply,
      should_notify: shouldNotifyOwner,
      should_archive: triage.shouldArchive,
      thread_summary: threadSummary || null,
      business_context: businessContext,
      activity_context: activityContext,
      metadata,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "message_id",
      ignoreDuplicates: false,
    });
}

export async function insertSuggestedDraft(
  message: EmailMessageDetail,
  plan: { suggested_reply_body: string | null; suggested_reply_subject: string | null; rationale: string | null; language: string | null; confidence: string | null; classification: string; importance: string; topic: string | null },
): Promise<void> {
  if (!plan.suggested_reply_body) return;
  const supabase = getServiceSupabase();
  if (!supabase) return;

  await supabase
    .from("email_drafts")
    .insert({
      message_id: message.id,
      thread_id: message.threadId,
      to_emails: formatRecipients(message.from ? [message.from] : []),
      cc_emails: formatRecipients(message.cc),
      subject: plan.suggested_reply_subject,
      body_text: plan.suggested_reply_body,
      rationale: plan.rationale,
      language: plan.language,
      confidence: plan.confidence,
      metadata: {
        classification: plan.classification,
        importance: plan.importance,
        topic: plan.topic,
      },
    });
}

export async function storeSentExample(
  message: EmailMessageDetail,
  triage: EmailTriageDecision,
): Promise<void> {
  const supabase = getServiceSupabase();
  if (!supabase) return;

  const contactEmail = triage.contactEmail ?? message.to.find((entry) => entry.email !== MY_EMAIL)?.email ?? null;
  const language = detectLanguage(message.bodyText);

  await supabase
    .from("email_reply_examples")
    .upsert({
      message_id: message.id,
      thread_id: message.threadId,
      contact_email: contactEmail,
      client_slug: triage.clientSlug,
      language,
      topic: triage.topic,
      subject: message.subject || null,
      body_text: clip(message.bodyText, 6000),
      metadata: {
        to: formatRecipients(message.to),
        cc: formatRecipients(message.cc),
      },
    }, {
      onConflict: "message_id",
      ignoreDuplicates: false,
    });

  const { data: draft } = await supabase
    .from("email_drafts")
    .select("id")
    .eq("thread_id", message.threadId)
    .eq("status", "suggested")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (draft?.id) {
    await supabase
      .from("email_drafts")
      .update({
        status: "sent",
        sent_message_id: message.id,
        sent_at: message.receivedAtIso,
        updated_at: new Date().toISOString(),
      })
      .eq("id", draft.id);
  }
}

// ---------------------------------------------------------------------------
// History API
// ---------------------------------------------------------------------------

export async function listWatchedHistoryMessageIds(startHistoryId: string): Promise<{
  messageIds: string[];
  latestHistoryId: string;
}> {
  const gmail = getGmailClient();

  let pageToken: string | undefined;
  const ids = new Set<string>();
  let latestHistoryId = startHistoryId;

  const hasWatchedMailboxLabel = (labelIds: string[] | null | undefined): boolean => {
    if (WATCHED_MAILBOX_LABELS.size === 0) return true;
    return (labelIds ?? []).some((labelId) => WATCHED_MAILBOX_LABELS.has(labelId));
  };

  do {
    const response = await gmail.users.history.list({
      userId: "me",
      startHistoryId,
      historyTypes: ["messageAdded", "labelAdded"],
      pageToken,
      maxResults: 100,
    });

    for (const entry of response.data.history ?? []) {
      if (entry.id && BigInt(entry.id) > BigInt(latestHistoryId)) {
        latestHistoryId = entry.id;
      }

      for (const added of entry.messagesAdded ?? []) {
        const messageId = added.message?.id;
        if (messageId && hasWatchedMailboxLabel(added.message?.labelIds)) {
          ids.add(messageId);
        }
      }

      for (const labeled of entry.labelsAdded ?? []) {
        const messageId = labeled.message?.id;
        if (messageId && (hasWatchedMailboxLabel(labeled.labelIds) || hasWatchedMailboxLabel(labeled.message?.labelIds))) {
          ids.add(messageId);
        }
      }
    }

    pageToken = response.data.nextPageToken ?? undefined;
  } while (pageToken);

  return {
    messageIds: [...ids],
    latestHistoryId,
  };
}

export async function getLatestMailboxHistoryId(): Promise<string> {
  const gmail = getGmailClient();
  const response = await gmail.users.getProfile({ userId: "me" });
  const historyId = response.data.historyId;

  if (!historyId) {
    throw new Error("Gmail profile did not include a historyId");
  }

  return historyId;
}

// Re-export listUnreadInboxMessageIds for use in the barrel
export { listUnreadInboxMessageIds };
