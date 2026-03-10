// Barrel re-exports -- consumers import from this file, sub-modules do the work.
export type { EmailProcessResult, EmailSweepResult } from "./email-types.js";
export {
  getPushRecoveryLimit,
  ensureManagedEmailLabels,
  listUnhandledUnreadInboxMessageIds,
  listWatchedHistoryMessageIds,
  getLatestMailboxHistoryId,
  markEmailThreadRead,
  archiveEmailThread,
  getSuggestedDraftForMessage,
} from "./email-gmail.js";

import { runClaude } from "../runner.js";
import type {
  EmailMessageDetail,
  EmailProcessResult,
  EmailSweepResult,
  EmailLogRecord,
} from "./email-types.js";
import { MANUAL_SWEEP_LIMIT } from "./email-types.js";
import {
  clip,
  uniqueStrings,
  getDomain,
  classifyInboundMessage,
  classifyOutboundMessage,
  coerceDraftPlan,
  formatRecipients,
  formatEmailParty,
  formatEmailLog,
  postEmailLog,
  formatThreadContext,
  formatOwnerNotification,
  buildOwnerAlertCard,
  buildInboundPrompt,
  shouldPushOwnerAlert,
} from "./email-classify.js";
import {
  findExistingEmailEvent,
  readMessageDetail,
  readThreadMessages,
  applyLabels,
  archiveMessage,
  readActivityContext,
  readBusinessContext,
  readStyleExamples,
  readOwnerCorrections,
  loadOwnerCorrections,
  saveOwnerCorrections,
  upsertEmailEvent,
  insertSuggestedDraft,
  storeSentExample,
  listUnreadInboxMessageIds,
} from "./email-gmail.js";
import { getServiceSupabase } from "./supabase-service.js";
import { toErrorMessage } from "../utils/error-helpers.js";

// ---------------------------------------------------------------------------
// Processing
// ---------------------------------------------------------------------------

async function processInboundMessage(message: EmailMessageDetail): Promise<EmailProcessResult> {
  const triage = classifyInboundMessage(message);
  const [threadMessages, businessContext, activityContext, styleExamples, ownerCorrections] = await Promise.all([
    readThreadMessages(message.threadId),
    readBusinessContext(triage.clientSlug),
    readActivityContext(triage.clientSlug, triage.contactEmail),
    readStyleExamples(triage.contactEmail, triage.clientSlug),
    readOwnerCorrections(triage.contactEmail, triage.topic),
  ]);

  const threadSummary = formatThreadContext(threadMessages, message.id);
  const prompt = buildInboundPrompt(message, triage, threadSummary, businessContext, activityContext, styleExamples, ownerCorrections);
  const result = await runClaude({
    prompt,
    systemPromptName: "email-agent",
    maxTurns: 12,
  });
  const plan = coerceDraftPlan(result.text, triage);
  const finalLabels = uniqueStrings([...triage.suggestedLabels, ...plan.suggested_labels]);
  const appliedLabels = await applyLabels(message.id, finalLabels);

  if (plan.should_archive && (plan.classification === "junk" || plan.classification === "notification")) {
    await archiveMessage(message.id);
  }

  let calendarEventCreated = false;
  if (plan.meeting_details?.title && plan.meeting_details?.start_iso) {
    try {
      const { createCalendarEvent } = await import("./calendar-service.js");
      const calEvent = await createCalendarEvent({
        title: plan.meeting_details.title,
        startIso: plan.meeting_details.start_iso,
        durationMinutes: plan.meeting_details.duration_minutes || 30,
        location: plan.meeting_details.location ?? plan.meeting_details.meeting_link ?? undefined,
        attendeeEmails: plan.meeting_details.attendee_emails?.filter(Boolean),
        description: plan.meeting_details.meeting_link
          ? `Meeting link: ${plan.meeting_details.meeting_link}`
          : undefined,
        noMeet: Boolean(plan.meeting_details.meeting_link),
      });
      calendarEventCreated = true;
      console.log(`[email-agent] Created calendar event: ${calEvent.summary} (${calEvent.eventId})`);
    } catch (err) {
      const msg = toErrorMessage(err);
      console.error("[email-agent] Failed to create calendar event:", msg);
    }
  }

  const metadata = {
    attachment_names: message.attachmentNames,
    headers: message.headers,
    rationale: plan.rationale,
    confidence: plan.confidence,
    topic: plan.topic,
    calendar_event_created: calendarEventCreated,
  };

  const needsOwnerAttention = shouldPushOwnerAlert(message, plan, triage);
  const shouldDeliverOwnerAlert = true;

  await upsertEmailEvent(
    message,
    {
      ...triage,
      classification: plan.classification,
      importance: plan.importance,
      suggestedLabels: finalLabels,
      shouldArchive: plan.should_archive,
      needsReply: plan.needs_reply,
      topic: plan.topic,
    },
    threadSummary,
    businessContext,
    activityContext,
    appliedLabels,
    metadata,
    needsOwnerAttention,
  );
  await insertSuggestedDraft(message, plan);

  const summary = formatOwnerNotification(
    message,
    plan,
    needsOwnerAttention,
    businessContext,
    appliedLabels,
  );
  const ownerDelivery: EmailLogRecord["ownerDelivery"] = needsOwnerAttention ? "action-alert" : "quick-fyi";

  await postEmailLog(formatEmailLog("inbound-handled", {
    sender: formatEmailParty(message.from?.name, message.from?.email),
    subject: message.subject || "(no subject)",
    classification: plan.classification,
    importance: plan.importance,
    appliedLabels,
    archived: plan.should_archive,
    draftedReply: Boolean(plan.suggested_reply_body),
    needsReply: plan.needs_reply,
    ownerAttention: needsOwnerAttention,
    ownerDelivery,
    why: plan.why_it_matters,
    topic: plan.topic,
    clientSlug: businessContext.clientSlug,
  }));

  return {
    direction: "inbound",
    messageId: message.id,
    threadId: message.threadId,
    notifiedOwner: shouldDeliverOwnerAlert,
    summary,
    ownerAlert: buildOwnerAlertCard(
      message,
      plan,
      needsOwnerAttention,
      businessContext,
      appliedLabels,
    ),
  };
}

async function processOutboundMessage(message: EmailMessageDetail): Promise<EmailProcessResult> {
  const triage = classifyOutboundMessage(message);
  await upsertEmailEvent(
    message,
    triage,
    "",
    { clientSlug: triage.clientSlug, campaigns: [], events: [] },
    [],
    [],
    {
      attachment_names: message.attachmentNames,
      headers: message.headers,
    },
    false,
  );
  await storeSentExample(message, triage);
  await postEmailLog(formatEmailLog("outbound-learned", {
    sender: formatEmailParty(message.from?.name, message.from?.email),
    subject: message.subject || "(no subject)",
    classification: triage.classification,
    importance: triage.importance,
    appliedLabels: [],
    archived: false,
    markedRead: false,
    draftedReply: false,
    note: "Stored sent email as a writing example for future drafts.",
    topic: triage.topic,
    clientSlug: triage.clientSlug,
  }));

  return {
    direction: "outbound",
    messageId: message.id,
    threadId: message.threadId,
    notifiedOwner: false,
    summary: `Learned from sent email ${message.id}.`,
  };
}

export async function processWatchedMessage(messageId: string): Promise<EmailProcessResult> {
  const message = await readMessageDetail(messageId);
  if (!message.id) {
    throw new Error(`Failed to read Gmail message ${messageId}`);
  }

  if (message.labelIds.includes("DRAFT") || message.labelIds.includes("TRASH") || message.labelIds.includes("SPAM")) {
    return {
      direction: message.direction,
      messageId: message.id,
      threadId: message.threadId,
      notifiedOwner: false,
      summary: `Ignored Gmail message ${message.id} because it is ${message.labelIds.join(", ")}.`,
    };
  }

  const existing = await findExistingEmailEvent(message.id);
  if (existing && existing.status !== "received") {
    return {
      direction: existing.direction,
      messageId: message.id,
      threadId: message.threadId,
      notifiedOwner: false,
      summary: `Skipped already-processed Gmail message ${message.id}.`,
    };
  }

  if (message.direction === "outbound") {
    return await processOutboundMessage(message);
  }

  return await processInboundMessage(message);
}

// ---------------------------------------------------------------------------
// Owner corrections
// ---------------------------------------------------------------------------

export async function recordOwnerEmailCorrection(messageId: string, note: string): Promise<{
  sender: string;
  subject: string;
}> {
  const normalizedNote = note.trim();
  if (!normalizedNote) {
    throw new Error("Correction note cannot be empty.");
  }

  const supabase = getServiceSupabase();
  const { data, error } = supabase
    ? await supabase
      .from("email_events")
      .select("sender_name, sender_email, subject, contact_email, metadata")
      .eq("message_id", messageId)
      .maybeSingle()
    : { data: null, error: null };

  if (error) {
    throw new Error(`Failed to load email context: ${error.message}`);
  }

  const senderEmail = data?.contact_email ?? data?.sender_email ?? null;
  const sender = data?.sender_name
    ? `${data.sender_name}${senderEmail ? ` <${senderEmail}>` : ""}`
    : (senderEmail ?? "unknown sender");
  const subject = data?.subject ?? "(no subject)";
  const metadata = typeof data?.metadata === "object" && data.metadata !== null
    ? data.metadata as Record<string, unknown>
    : {};
  const topic = typeof metadata.topic === "string" ? metadata.topic : null;

  const corrections = await loadOwnerCorrections();
  corrections.unshift({
    created_at: new Date().toISOString(),
    message_id: messageId,
    sender_email: senderEmail,
    sender_domain: getDomain(senderEmail),
    subject,
    topic,
    note: normalizedNote,
  });

  await saveOwnerCorrections(corrections.slice(0, 200));
  await postEmailLog(formatEmailLog("owner-correction", {
    sender,
    subject,
    note: normalizedNote,
    topic,
  }));

  return { sender, subject };
}

// ---------------------------------------------------------------------------
// Sweep operations
// ---------------------------------------------------------------------------

export async function sweepUnreadInboxDetailed(maxMessages = MANUAL_SWEEP_LIMIT): Promise<EmailSweepResult> {
  const messageIds = await listUnreadInboxMessageIds(maxMessages);
  if (messageIds.length === 0) {
    return {
      summary: "No unread inbox messages.",
      results: [],
      reviewedCount: 0,
      inboundCount: 0,
      outboundCount: 0,
      notifiedCount: 0,
      skippedCount: 0,
    };
  }

  const lines: string[] = [];
  const results: EmailProcessResult[] = [];
  let inboundCount = 0;
  let outboundCount = 0;
  let notifiedCount = 0;
  let skippedCount = 0;

  for (const messageId of messageIds) {
    const result = await processWatchedMessage(messageId);
    results.push(result);
    if (result.summary.startsWith("Skipped already-processed")) {
      skippedCount += 1;
      continue;
    }
    if (result.direction === "inbound") {
      inboundCount += 1;
      if (result.notifiedOwner) {
        notifiedCount += 1;
      }
    } else {
      outboundCount += 1;
    }
    lines.push(`- ${clip(result.summary.replace(/\s+/g, " ").trim(), 240)}`);
  }

  return {
    summary: [
      `Swept ${messageIds.length} unread inbox message(s): ${inboundCount} inbound, ${outboundCount} outbound-learned, ${notifiedCount} owner updates sent, ${skippedCount} already-known.`,
      ...lines,
    ].join("\n"),
    results,
    reviewedCount: messageIds.length,
    inboundCount,
    outboundCount,
    notifiedCount,
    skippedCount,
  };
}

export async function sweepUnreadInbox(maxMessages = MANUAL_SWEEP_LIMIT): Promise<string> {
  const result = await sweepUnreadInboxDetailed(maxMessages);
  return result.summary;
}
