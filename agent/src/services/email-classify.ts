import type { gmail_v1 } from "googleapis";
import type {
  EmailAddress,
  EmailClassification,
  EmailDraftPlan,
  EmailImportance,
  EmailLogRecord,
  EmailMessageDetail,
  EmailProcessResult,
  EmailTriageDecision,
  BusinessContext,
  StyleExample,
} from "./email-types.js";
import {
  MY_EMAIL,
  IMPORTANCE_RANK,
  TEAM_DOMAINS,
  CLIENT_DOMAINS,
  VENUE_DOMAINS,
  FINANCE_DOMAINS,
  TECH_ALERT_DOMAINS,
  VIP_SENDERS,
} from "./email-types.js";
import { toErrorMessage } from "../utils/error-helpers.js";

// ---------------------------------------------------------------------------
// String utilities
// ---------------------------------------------------------------------------

export function getDomain(email: string | null | undefined): string {
  const value = (email ?? "").trim().toLowerCase();
  return value.includes("@") ? value.split("@").pop() ?? "" : "";
}

export function uniqueStrings(values: Array<string | null | undefined>): string[] {
  return [...new Set(values.map((value) => value?.trim()).filter((value): value is string => Boolean(value)))];
}

export function clip(text: string, limit: number): string {
  return text.length <= limit ? text : `${text.slice(0, limit - 1)}…`;
}

export function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function decodeBody(part: { body?: { data?: string | null } }): string {
  if (!part.body?.data) return "";
  return Buffer.from(part.body.data, "base64url").toString("utf-8");
}

export function extractText(payload: gmail_v1.Schema$MessagePart | undefined): string {
  if (!payload) return "";

  if (payload.mimeType === "text/plain" && payload.body?.data) {
    return decodeBody(payload);
  }

  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return decodeBody(part);
      }
    }
    for (const part of payload.parts) {
      if (part.mimeType === "text/html" && part.body?.data) {
        return stripHtml(decodeBody(part));
      }
    }
    for (const part of payload.parts) {
      const nested = extractText(part);
      if (nested) return nested;
    }
  }

  if (payload.mimeType === "text/html" && payload.body?.data) {
    return stripHtml(decodeBody(payload));
  }

  return "";
}

// ---------------------------------------------------------------------------
// Email parsing
// ---------------------------------------------------------------------------

export function collectAttachmentNames(
  payload: gmail_v1.Schema$MessagePart | undefined,
  output: string[] = [],
): string[] {
  if (!payload) return output;
  if (payload.filename) {
    output.push(payload.filename);
  }
  for (const part of payload.parts ?? []) {
    collectAttachmentNames(part, output);
  }
  return output;
}

export function headerValue(
  headers: gmail_v1.Schema$MessagePartHeader[] | undefined,
  name: string,
): string {
  return headers?.find((header) => header.name?.toLowerCase() === name.toLowerCase())?.value ?? "";
}

export function parseAddress(token: string): EmailAddress | null {
  const cleaned = token.trim();
  if (!cleaned) return null;

  const angleMatch = cleaned.match(/^(.*?)(?:<([^>]+)>)$/);
  if (angleMatch) {
    const name = angleMatch[1].trim().replace(/^"|"$/g, "") || null;
    return {
      name,
      email: angleMatch[2].trim().toLowerCase(),
    };
  }

  const emailMatch = cleaned.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  if (!emailMatch) return null;
  const email = emailMatch[0].toLowerCase();
  const name = cleaned.replace(emailMatch[0], "").replace(/[<>"]/g, "").trim() || null;
  return { name, email };
}

export function parseAddressList(raw: string): EmailAddress[] {
  return raw
    .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
    .map((part) => parseAddress(part))
    .filter((value): value is EmailAddress => value !== null);
}

export function parseDateToIso(value: string | null): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

// ---------------------------------------------------------------------------
// Classification
// ---------------------------------------------------------------------------

export function classifyTopic(message: EmailMessageDetail): string | null {
  const haystack = `${message.subject}\n${message.bodyText}`.toLowerCase();
  if (haystack.includes("pixel")) return "pixel";
  if (haystack.includes("invoice") || haystack.includes("payment") || haystack.includes("billing")) return "finance";
  if (haystack.includes("meeting") || haystack.includes("calendar") || haystack.includes("invite")) return "meeting";
  if (
    haystack.includes("life insurance")
    || haystack.includes("term life")
    || haystack.includes("whole life")
    || haystack.includes("universal life")
    || haystack.includes("indexed universal life")
    || haystack.includes("iul")
    || haystack.includes("annuity")
    || haystack.includes("final expense")
    || haystack.includes("mortgage protection")
    || haystack.includes("underwriting")
    || haystack.includes("beneficiary")
  ) return "life_insurance";
  if (haystack.includes("insurance") || haystack.includes("certificate of insurance") || haystack.includes("coi")) return "insurance";
  if (haystack.includes("flight") || haystack.includes("hotel") || haystack.includes("airbnb") || haystack.includes("itinerary")) return "travel";
  if (haystack.includes("campaign") || haystack.includes("roas") || haystack.includes("budget")) return "campaign";
  if (haystack.includes("ticket") || haystack.includes("venue") || haystack.includes("show")) return "event";
  if (haystack.includes("access") || haystack.includes("permissions")) return "access";
  return null;
}

export function inferClientSlug(message: EmailMessageDetail): string | null {
  const subject = `${message.subject}\n${message.bodyText}\n${message.from?.email ?? ""}`.toLowerCase();
  if (subject.includes("don omar")) return "don_omar_bcn";
  if (subject.includes("kybba")) return "kybba";
  if (subject.includes("sienna") || subject.includes("peace in mind")) return "sienna";
  if (subject.includes("vaz vil") || subject.includes("kiko blade") || subject.includes("penetrado")) return "vaz_vil";
  if (subject.includes("beamina")) return "beamina";
  if (subject.includes("happy paws")) return "happy_paws";
  if (
    subject.includes("zamora")
    || subject.includes("arjona")
    || subject.includes("camila")
    || subject.includes("alofoke")
    || getDomain(message.from?.email) === "zamorausa.com"
  ) {
    return "zamora";
  }
  return null;
}

export function inferTourLabel(message: EmailMessageDetail, clientSlug: string | null): string | null {
  const haystack = `${message.subject}\n${message.bodyText}`.toLowerCase();
  if (clientSlug === "don_omar_bcn" || haystack.includes("don omar")) return "Tours/Don Omar";
  if (haystack.includes("camila")) return "Tours/Camila";
  if (haystack.includes("arjona")) return "Tours/Arjona";
  if (clientSlug === "zamora") return "Tours/Other";
  return null;
}

export function classifyInboundMessage(message: EmailMessageDetail): EmailTriageDecision {
  const senderEmail = message.from?.email ?? "";
  const senderDomain = getDomain(senderEmail);
  const clientSlug = inferClientSlug(message);
  const topic = classifyTopic(message);
  const subject = message.subject.toLowerCase();
  const body = message.bodyText.toLowerCase();
  const isTechAlert = TECH_ALERT_DOMAINS.has(senderDomain);
  const isCriticalTechAlert =
    isTechAlert
    && ["failed", "failure", "error", "incident", "outage", "rejected", "degraded"].some((term) => {
      return subject.includes(term) || body.includes(term);
    });
  const labels = new Set<string>();

  let classification: EmailClassification = "routine";
  let importance: EmailImportance = "normal";
  let shouldNotifyOwner = false;
  let shouldArchive = false;
  let needsReply = false;

  if (senderEmail === "ar@meta.com" || FINANCE_DOMAINS.has(senderDomain) || topic === "finance") {
    classification = "finance";
    importance = "high";
    labels.add("Outlet Media/Invoices");
    labels.add("Cuentas");
    shouldNotifyOwner = true;
  } else if (topic === "life_insurance") {
    classification = "client";
    importance = "high";
    labels.add("Life Insurance");
    labels.add("Importantes");
    shouldNotifyOwner = true;
  } else if (TEAM_DOMAINS.has(senderDomain)) {
    classification = "team";
    importance = "high";
    labels.add("Outlet Media/Team");
    shouldNotifyOwner = true;
  } else if (VIP_SENDERS.has(senderEmail) || VENUE_DOMAINS.has(senderDomain)) {
    classification = "vip";
    importance = "high";
    labels.add("Clients");
    shouldNotifyOwner = true;
  } else if (CLIENT_DOMAINS.has(senderDomain)) {
    classification = "client";
    importance = "high";
    labels.add("Clients");
    shouldNotifyOwner = true;
  } else if (subject.includes("invite") || subject.includes("calendar") || topic === "meeting") {
    classification = "meeting";
    importance = "normal";
    labels.add("Meetings");
    shouldNotifyOwner = true;
  } else if (
    senderEmail.includes("no-reply")
    || senderEmail.includes("noreply")
    || isTechAlert
    || body.includes("automated message")
  ) {
    classification = "notification";
    labels.add("Tech/Alerts");
    if (isCriticalTechAlert) {
      importance = "high";
      shouldNotifyOwner = true;
      labels.add("Importantes");
    } else {
      importance = "low";
      shouldArchive = true;
    }
  } else if (body.includes("unsubscribe") && body.includes("view in browser")) {
    classification = "junk";
    importance = "low";
    shouldArchive = true;
  } else {
    classification = senderDomain ? "vendor" : "routine";
    importance = "normal";
    shouldNotifyOwner = true;
  }

  if (clientSlug && classification !== "notification" && classification !== "junk") {
    labels.add("Clients");
    const tourLabel = inferTourLabel(message, clientSlug);
    if (tourLabel) labels.add(tourLabel);
  }

  if (topic === "insurance") {
    labels.add("Insurance");
  }

  if (topic === "life_insurance") {
    labels.add("Life Insurance");
  }

  if (topic === "travel") {
    labels.add("Viajes");
  }

  if (importance === "high") {
    labels.add("Importantes");
  }

  if (subject.includes("urgent") || body.includes("urgent") || body.includes("asap")) {
    importance = "urgent";
    shouldNotifyOwner = true;
    labels.add("Importantes");
  }

  if (topic === "pixel" || topic === "access" || classification === "vip" || classification === "client" || classification === "finance") {
    needsReply = true;
  }

  return {
    classification,
    importance,
    clientSlug,
    contactEmail: senderEmail || null,
    suggestedLabels: [...labels],
    shouldNotifyOwner,
    shouldArchive,
    needsReply,
    topic,
  };
}

export function classifyOutboundMessage(message: EmailMessageDetail): EmailTriageDecision {
  return {
    classification: "routine",
    importance: "normal",
    clientSlug: inferClientSlug(message),
    contactEmail: message.to.find((entry) => entry.email !== MY_EMAIL)?.email ?? null,
    suggestedLabels: [],
    shouldNotifyOwner: false,
    shouldArchive: false,
    needsReply: false,
    topic: classifyTopic(message),
  };
}

// ---------------------------------------------------------------------------
// Draft plan coercion
// ---------------------------------------------------------------------------

export function formatRecipients(addresses: EmailAddress[]): string[] {
  return addresses.map((entry) => entry.email);
}

export function detectLanguage(text: string): string {
  const lower = text.toLowerCase();
  const spanishHints = [" hola ", " gracias ", " por favor", " envio", " adjunto", "venue", "meta pixel id"];
  return spanishHints.some((hint) => lower.includes(hint.trim())) ? "es" : "en";
}

export function extractJsonObject(text: string): string | null {
  const start = text.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < text.length; index += 1) {
    const char = text[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return text.slice(start, index + 1);
      }
    }
  }

  return null;
}

export function normalizeImportance(value: unknown, fallback: EmailImportance): EmailImportance {
  const parsed = value === "urgent" || value === "high" || value === "normal" || value === "low"
    ? value
    : fallback;
  return IMPORTANCE_RANK[parsed] >= IMPORTANCE_RANK[fallback] ? parsed : fallback;
}

export function stripLegacyCodeFormatting(value: string): string {
  return value
    .replace(/```[\w-]*\n?([\s\S]*?)```/g, "$1")
    .replace(/`([^`]+?)`/g, "$1")
    .trim();
}

export function coerceDraftPlan(
  raw: string,
  fallback: EmailTriageDecision,
): EmailDraftPlan {
  const jsonText = extractJsonObject(raw);
  if (!jsonText) {
    return {
      why_it_matters: clip(stripLegacyCodeFormatting(raw), 1000),
      suggested_reply_subject: null,
      suggested_reply_body: null,
      rationale: null,
      classification: fallback.classification,
      importance: fallback.importance,
      suggested_labels: fallback.suggestedLabels,
      should_archive: fallback.shouldArchive,
      needs_reply: fallback.needsReply,
      language: null,
      confidence: null,
      topic: fallback.topic,
      meeting_details: null,
    };
  }

  try {
    const parsed = JSON.parse(jsonText) as Partial<EmailDraftPlan>;
    const rawMeeting = parsed.meeting_details;
    const meetingDetails = (
      rawMeeting &&
      typeof rawMeeting === "object" &&
      typeof rawMeeting.title === "string" &&
      typeof rawMeeting.start_iso === "string"
    )
      ? {
          title: rawMeeting.title,
          start_iso: rawMeeting.start_iso,
          duration_minutes: typeof rawMeeting.duration_minutes === "number" ? rawMeeting.duration_minutes : 30,
          location: typeof rawMeeting.location === "string" ? rawMeeting.location : null,
          attendee_emails: Array.isArray(rawMeeting.attendee_emails)
            ? (rawMeeting.attendee_emails as string[]).filter((e): e is string => typeof e === "string")
            : [],
          meeting_link: typeof rawMeeting.meeting_link === "string" ? rawMeeting.meeting_link : null,
        }
      : null;

    return {
      why_it_matters: typeof parsed.why_it_matters === "string"
        ? stripLegacyCodeFormatting(parsed.why_it_matters)
        : "New email received.",
      suggested_reply_subject:
        typeof parsed.suggested_reply_subject === "string" && parsed.suggested_reply_subject.trim()
          ? stripLegacyCodeFormatting(parsed.suggested_reply_subject)
          : null,
      suggested_reply_body:
        typeof parsed.suggested_reply_body === "string" && parsed.suggested_reply_body.trim()
          ? stripLegacyCodeFormatting(parsed.suggested_reply_body)
          : null,
      rationale: typeof parsed.rationale === "string" ? parsed.rationale : null,
      classification: (parsed.classification as EmailClassification | undefined) ?? fallback.classification,
      importance: normalizeImportance(parsed.importance, fallback.importance),
      suggested_labels: Array.isArray(parsed.suggested_labels)
        ? uniqueStrings(parsed.suggested_labels as string[])
        : fallback.suggestedLabels,
      should_archive: typeof parsed.should_archive === "boolean" ? parsed.should_archive : fallback.shouldArchive,
      needs_reply: typeof parsed.needs_reply === "boolean" ? parsed.needs_reply : fallback.needsReply,
      language: typeof parsed.language === "string" ? parsed.language : null,
      confidence: typeof parsed.confidence === "string" ? parsed.confidence : null,
      topic: typeof parsed.topic === "string" ? parsed.topic : fallback.topic,
      meeting_details: meetingDetails,
    };
  } catch {
    return {
      why_it_matters: clip(stripLegacyCodeFormatting(raw), 1000),
      suggested_reply_subject: null,
      suggested_reply_body: null,
      rationale: null,
      classification: fallback.classification,
      importance: fallback.importance,
      suggested_labels: fallback.suggestedLabels,
      should_archive: fallback.shouldArchive,
      needs_reply: fallback.needsReply,
      language: null,
      confidence: null,
      topic: fallback.topic,
      meeting_details: null,
    };
  }
}

// ---------------------------------------------------------------------------
// Logging
// ---------------------------------------------------------------------------

export function formatEmailParty(name: string | null | undefined, email: string | null | undefined): string {
  if (name && email) return `${name} <${email}>`;
  return email ?? name ?? "unknown sender";
}

export function formatEmailLog(recordType: string, record: EmailLogRecord): string {
  const actionBits = [
    record.appliedLabels && record.appliedLabels.length > 0
      ? `labels=${record.appliedLabels.join(", ")}`
      : "labels=(none)",
    record.archived != null ? `archived=${record.archived ? "yes" : "no"}` : null,
    record.markedRead != null ? `marked_read=${record.markedRead ? "yes" : "no"}` : null,
    record.draftedReply != null ? `drafted_reply=${record.draftedReply ? "yes" : "no"}` : null,
  ].filter(Boolean);

  const statusBits = [
    record.classification ? `type=${record.classification}` : null,
    record.importance ? `importance=${record.importance}` : null,
    record.needsReply != null ? `reply_needed=${record.needsReply ? "yes" : "no"}` : null,
    record.ownerAttention != null ? `owner_attention=${record.ownerAttention ? "yes" : "no"}` : null,
    record.ownerDelivery ? `owner_delivery=${record.ownerDelivery}` : null,
    record.clientSlug ? `client=${record.clientSlug}` : null,
    record.topic ? `topic=${record.topic}` : null,
  ].filter(Boolean);

  return [
    `[Email Log] ${recordType}`,
    `From: ${record.sender}`,
    `Subject: ${record.subject}`,
    statusBits.length > 0 ? `Status: ${statusBits.join(" | ")}` : null,
    actionBits.length > 0 ? `Actions: ${actionBits.join(" | ")}` : null,
    record.why ? `Why: ${clip(record.why, 280)}` : null,
    record.note ? `Note: ${clip(record.note, 280)}` : null,
  ].filter(Boolean).join("\n");
}

export async function postEmailLog(text: string): Promise<void> {
  try {
    const { notifyChannel } = await import("../discord/core/entry.js");
    await notifyChannel("email-log", text);
  } catch (err) {
    const message = toErrorMessage(err);
    console.warn("[email-agent] Failed to write #email-log entry:", message);
  }
}

// ---------------------------------------------------------------------------
// Context formatting / prompt building
// ---------------------------------------------------------------------------

export function formatThreadContext(threadMessages: EmailMessageDetail[], currentMessageId: string): string {
  return threadMessages
    .filter((message) => message.id !== currentMessageId)
    .map((message) => {
      const who = message.direction === "outbound" ? "Jaime" : (message.from?.email ?? "unknown sender");
      return `${who} | ${message.subject}\n${clip(message.bodyText, 600)}`;
    })
    .join("\n\n");
}

export function formatBusinessContext(context: BusinessContext): string {
  if (!context.clientSlug) return "No client match.";
  const sections = [`Client slug: ${context.clientSlug}`];
  if (context.campaigns.length > 0) {
    sections.push(`Campaigns:\n- ${context.campaigns.join("\n- ")}`);
  }
  if (context.events.length > 0) {
    sections.push(`Events:\n- ${context.events.join("\n- ")}`);
  }
  return sections.join("\n\n");
}

export function formatStyleExamples(examples: StyleExample[]): string {
  if (examples.length === 0) {
    return "No stored sent examples yet.";
  }

  return examples
    .map((example, index) => {
      return [
        `Example ${index + 1} (${example.created_at.slice(0, 10)}${example.contact_email ? `, ${example.contact_email}` : ""})`,
        example.subject ? `Subject: ${example.subject}` : "Subject: (none)",
        clip(example.body_text, 900),
      ].join("\n");
    })
    .join("\n\n");
}

export function buildInboundPrompt(
  message: EmailMessageDetail,
  triage: EmailTriageDecision,
  threadContext: string,
  businessContext: BusinessContext,
  activityContext: string[],
  styleExamples: StyleExample[],
  ownerCorrections: string[],
): string {
  const attachments = message.attachmentNames.length > 0 ? message.attachmentNames.join(", ") : "(none)";
  const activityBlock = activityContext.length > 0 ? activityContext.join("\n") : "No recent matching activity.";
  const ownerCorrectionBlock = ownerCorrections.length > 0 ? ownerCorrections.join("\n") : "No direct owner corrections for this sender/topic yet.";
  const replyAddress = message.from?.email ?? "(unknown)";

  return [
    "Read memory/email-agent.md first.",
    "This is a live inbound email event. Draft the best owner-facing briefing and a suggested reply if appropriate.",
    "",
    "Return ONLY valid JSON with this schema:",
    "{",
    '  "why_it_matters": string,',
    '  "suggested_reply_subject": string | null,',
    '  "suggested_reply_body": string | null,',
    '  "rationale": string | null,',
    '  "classification": "vip" | "team" | "client" | "vendor" | "finance" | "meeting" | "notification" | "junk" | "routine",',
    '  "importance": "urgent" | "high" | "normal" | "low",',
    '  "suggested_labels": string[],',
    '  "should_archive": boolean,',
    '  "needs_reply": boolean,',
    '  "language": string | null,',
    '  "confidence": string | null,',
    '  "topic": string | null,',
    '  "meeting_details": { "title": string, "start_iso": string (ISO-8601 with timezone), "duration_minutes": number, "location": string|null, "attendee_emails": [string], "meeting_link": string|null } | null',
    "}",
    "",
    `From: ${message.from?.name ? `${message.from.name} <${replyAddress}>` : replyAddress}`,
    `To: ${formatRecipients(message.to).join(", ") || "(none)"}`,
    `Cc: ${formatRecipients(message.cc).join(", ") || "(none)"}`,
    `Subject: ${message.subject || "(no subject)"}`,
    `Received: ${message.receivedAtIso ?? message.date ?? "unknown"}`,
    `Attachments: ${attachments}`,
    "",
    "Actual message:",
    clip(message.bodyText, 5000),
    "",
    "Thread context:",
    threadContext || "No prior thread context.",
    "",
    "Business context:",
    formatBusinessContext(businessContext),
    "",
    "Recent operational context:",
    activityBlock,
    "",
    "Stored sent examples from Jaime:",
    formatStyleExamples(styleExamples),
    "",
    "Direct owner corrections to learn from:",
    ownerCorrectionBlock,
    "",
    "Heuristic starting point:",
    JSON.stringify(triage, null, 2),
    "",
    "Keep Jaime's style short, direct, and low-fluff. Never mention internal systems. Only suggest replies if the ask is obvious and low-risk.",
    "If this email is about a meeting, calendar invite, or scheduling, extract the meeting details into meeting_details. Include all attendees you can identify. Use ISO-8601 format with timezone for start_iso (e.g. 2026-03-10T15:45:00-06:00). If no meeting details are identifiable, set meeting_details to null.",
    "If the right label, archive decision, or notify level is unclear, ask Jaime one short direct question instead of guessing silently.",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Owner notifications
// ---------------------------------------------------------------------------

export function formatOwnerNotification(
  message: EmailMessageDetail,
  plan: EmailDraftPlan,
  needsOwnerAttention: boolean,
  businessContext: BusinessContext,
  appliedLabels: string[],
): string {
  const heading = needsOwnerAttention ? "[Email - Action Needed]" : "[Email - Handled FYI]";
  const handledLabels = appliedLabels.length > 0 ? appliedLabels.join(", ") : "(none)";
  const draftedReply = plan.suggested_reply_body ? "yes" : "no";

  const sections = [
    heading,
    "",
    `From: ${message.from?.name ? `${message.from.name} <${message.from.email}>` : (message.from?.email ?? "unknown")}`,
    `Subject: ${message.subject || "(no subject)"}`,
    `Class: ${plan.classification} | Importance: ${plan.importance}`,
    `Needs you: ${needsOwnerAttention ? "yes" : "no"} | Reply needed: ${plan.needs_reply ? "yes" : "no"}`,
    `Agent actions: labels=${handledLabels} | archived=${plan.should_archive ? "yes" : "no"} | drafted_reply=${draftedReply}`,
    "",
    plan.why_it_matters,
  ];

  if (businessContext.clientSlug) {
    sections.push("", `Client: ${businessContext.clientSlug}`);
    if (businessContext.campaigns.length > 0) {
      sections.push(`Campaign context: ${businessContext.campaigns.slice(0, 2).join(" | ")}`);
    }
    if (businessContext.events.length > 0) {
      sections.push(`Event context: ${businessContext.events.slice(0, 2).join(" | ")}`);
    }
  }

  if (plan.suggested_reply_body) {
    sections.push("", "Suggested reply:");
    if (plan.suggested_reply_subject) {
      sections.push(`Subject: ${plan.suggested_reply_subject}`);
    }
    sections.push(plan.suggested_reply_body);
  }

  return clip(sections.join("\n"), 3500);
}

export function buildOwnerAlertCard(
  message: EmailMessageDetail,
  plan: EmailDraftPlan,
  needsOwnerAttention: boolean,
  businessContext: BusinessContext,
  appliedLabels: string[],
): NonNullable<EmailProcessResult["ownerAlert"]> {
  const sender = message.from?.name
    ? `${message.from.name} <${message.from.email}>`
    : (message.from?.email ?? "unknown");

  return {
    messageId: message.id,
    threadId: message.threadId,
    sender,
    subject: message.subject || "(no subject)",
    classification: plan.classification,
    importance: plan.importance,
    needsOwnerAttention,
    needsReply: plan.needs_reply,
    whyItMatters: clip(stripLegacyCodeFormatting(plan.why_it_matters), 240),
    clientSlug: businessContext.clientSlug,
    appliedLabels,
    archived: plan.should_archive,
    draftedReply: Boolean(plan.suggested_reply_body),
  };
}

export function looksLikeBulkPromo(message: EmailMessageDetail, plan: EmailDraftPlan): boolean {
  const haystack = [
    message.subject,
    message.bodyText,
    plan.why_it_matters,
    plan.rationale ?? "",
  ].join("\n").toLowerCase();

  const headerNames = Object.keys(message.headers ?? {}).map((name) => name.toLowerCase());
  const hasBulkHeaders = headerNames.some((name) =>
    name === "list-unsubscribe" || name === "list-id" || name === "precedence");

  const promoTerms = [
    "newsletter",
    "weekly digest",
    "daily digest",
    "digest",
    "unsubscribe",
    "view in browser",
    "promo",
    "promotion",
    "sale",
    "special offer",
  ];

  return hasBulkHeaders || promoTerms.some((term) => haystack.includes(term));
}

export function shouldPushOwnerAlert(
  message: EmailMessageDetail,
  plan: EmailDraftPlan,
  triage: EmailTriageDecision,
): boolean {
  if (plan.classification === "junk") return false;
  const bulkPromo = looksLikeBulkPromo(message, plan);

  const actionHaystack = [
    message.subject,
    message.bodyText,
    plan.why_it_matters,
    plan.rationale ?? "",
  ].join("\n").toLowerCase();
  const suggestsAction = [
    "action required",
    "needs review",
    "review recommended",
    "reply needed",
    "respond",
    "approval",
    "confirm",
    "unread chat",
    "deadline",
    "overdue",
    "failed",
    "error",
    "outage",
    "rejected",
    "expired",
    "suspended",
    "access request",
    "access needed",
  ].some((term) => actionHaystack.includes(term));

  if (plan.needs_reply) return true;
  if (triage.topic === "life_insurance") return true;
  if (triage.shouldNotifyOwner) return true;
  if (suggestsAction) return true;
  if (plan.should_archive) return !bulkPromo;

  switch (plan.classification) {
    case "notification":
      if (plan.importance === "low" && bulkPromo) return false;
      return !bulkPromo && plan.importance !== "low";
    case "finance":
      return true;
    case "vip":
    case "client":
    case "team":
      return true;
    case "meeting":
      return plan.importance !== "low";
    case "vendor":
    case "routine":
    default:
      if (bulkPromo) return false;
      return Boolean(triage.clientSlug) || plan.importance !== "low";
  }
}
