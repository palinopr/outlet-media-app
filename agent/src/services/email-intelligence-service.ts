import { readFileSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { google, gmail_v1 } from "googleapis";
import { fileURLToPath } from "node:url";
import { runClaude } from "../runner.js";
import { getServiceSupabase } from "./supabase-service.js";

const SERVICE_ACCOUNT_PATH = fileURLToPath(new URL("../../service-account.json", import.meta.url));
const MANAGED_LABELS_PATH = fileURLToPath(new URL("../../config/gmail-managed-labels.json", import.meta.url));
const OWNER_CORRECTIONS_PATH = fileURLToPath(new URL("../../session/email-owner-corrections.json", import.meta.url));
const GMAIL_IMPERSONATE_USER = process.env.GMAIL_IMPERSONATE_USER ?? "jaime@outletmedia.net";
const MY_EMAIL = GMAIL_IMPERSONATE_USER.toLowerCase();
const MAX_BODY_CHARS = 8_000;
const MAX_STYLE_EXAMPLES = 3;
const MAX_THREAD_MESSAGES = 5;
const MAX_ACTIVITY_ENTRIES = 5;
const MANUAL_SWEEP_LIMIT = 5;
const PUSH_RECOVERY_LIMIT = 20;
const WATCHED_MAILBOX_LABELS = new Set(
  (process.env.GMAIL_PUSH_LABEL_IDS ?? "INBOX,SENT")
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean),
);

type EmailDirection = "inbound" | "outbound";
type EmailClassification =
  | "vip"
  | "team"
  | "client"
  | "vendor"
  | "finance"
  | "meeting"
  | "notification"
  | "junk"
  | "routine";
type EmailImportance = "urgent" | "high" | "normal" | "low";

const IMPORTANCE_RANK: Record<EmailImportance, number> = {
  low: 0,
  normal: 1,
  high: 2,
  urgent: 3,
};

interface EmailAddress {
  name: string | null;
  email: string;
}

interface EmailMessageDetail {
  id: string;
  threadId: string;
  subject: string;
  snippet: string;
  bodyText: string;
  date: string | null;
  receivedAtIso: string | null;
  from: EmailAddress | null;
  to: EmailAddress[];
  cc: EmailAddress[];
  labelIds: string[];
  attachmentNames: string[];
  headers: Record<string, string>;
  direction: EmailDirection;
}

interface ActivityEntry {
  ts?: string;
  channel?: string;
  user?: string;
  message?: string;
  agent?: string;
  responseSummary?: string;
}

interface CampaignSnapshot {
  name: string;
  status: string;
  roas: number | null;
  spend: number | null;
  daily_budget: number | null;
  start_time: string | null;
}

interface EventSnapshot {
  name: string;
  date: string | null;
  tickets_sold: number | null;
  gross: number | null;
}

interface StyleExample {
  subject: string | null;
  body_text: string;
  created_at: string;
  contact_email: string | null;
}

interface OwnerEmailCorrection {
  created_at: string;
  message_id: string;
  sender_email: string | null;
  sender_domain: string | null;
  subject: string | null;
  topic: string | null;
  note: string;
}

interface BusinessContext {
  clientSlug: string | null;
  campaigns: string[];
  events: string[];
}

interface EmailTriageDecision {
  classification: EmailClassification;
  importance: EmailImportance;
  clientSlug: string | null;
  contactEmail: string | null;
  suggestedLabels: string[];
  shouldNotifyOwner: boolean;
  shouldArchive: boolean;
  needsReply: boolean;
  topic: string | null;
}

interface EmailDraftPlan {
  why_it_matters: string;
  suggested_reply_subject: string | null;
  suggested_reply_body: string | null;
  rationale: string | null;
  classification: EmailClassification;
  importance: EmailImportance;
  suggested_labels: string[];
  should_archive: boolean;
  needs_reply: boolean;
  language: string | null;
  confidence: string | null;
  topic: string | null;
  meeting_details: {
    title: string;
    start_iso: string;
    duration_minutes: number;
    location: string | null;
    attendee_emails: string[];
    meeting_link: string | null;
  } | null;
}

export interface EmailProcessResult {
  direction: EmailDirection;
  messageId: string;
  threadId: string;
  notifiedOwner: boolean;
  summary: string;
  ownerAlert?: {
    messageId: string;
    threadId: string;
    sender: string;
    subject: string;
    classification: EmailClassification;
    importance: EmailImportance;
    needsOwnerAttention: boolean;
    needsReply: boolean;
    whyItMatters: string;
    clientSlug: string | null;
    appliedLabels: string[];
    archived: boolean;
    draftedReply: boolean;
  };
}

export interface EmailSweepResult {
  summary: string;
  results: EmailProcessResult[];
  reviewedCount: number;
  inboundCount: number;
  outboundCount: number;
  notifiedCount: number;
  skippedCount: number;
}

interface ManagedLabel {
  name: string;
  backgroundColor?: string;
  textColor?: string;
}

let managedLabelsCache: ManagedLabel[] | null = null;

const TEAM_DOMAINS = new Set(["outletmedia.net"]);
const CLIENT_DOMAINS = new Set([
  "zamorausa.com",
  "touringco.com",
  "eoentertainment.com",
  "atgentertainment.com",
  "thepg.com",
  "seminolehardrock.com",
  "shrss.com",
  "aegpresents.com",
]);
const VENUE_DOMAINS = new Set([
  "goldenstate.com",
  "acrisurearena.com",
  "ocvibe.com",
  "maverikcenter.com",
  "pechangaarenasd.com",
  "cvfirebirds.com",
  "cajinapro.com",
  "ticketera.com",
]);
const FINANCE_DOMAINS = new Set(["brodriguezcpa.com"]);
const TECH_ALERT_DOMAINS = new Set([
  "github.com",
  "vercel.com",
  "railway.app",
  "render.com",
  "supabase.co",
  "sentry.io",
  "discord.com",
  "google.com",
]);
const VIP_SENDERS = new Set([
  "mirna@zamorausa.com",
  "ivan.gonzalez@zamorausa.com",
  "lida@zamorausa.com",
  "jesus.guzman@zamorausa.com",
  "omar.rodriguez@zamorausa.com",
  "alexandra@outletmedia.net",
  "isabel@outletmedia.net",
  "natalie@outletmedia.net",
]);

function getManagedLabels(): ManagedLabel[] {
  if (managedLabelsCache) {
    return managedLabelsCache;
  }

  const raw = JSON.parse(readFileSync(MANAGED_LABELS_PATH, "utf-8")) as ManagedLabel[];
  managedLabelsCache = raw;
  return raw;
}

function getDomain(email: string | null | undefined): string {
  const value = (email ?? "").trim().toLowerCase();
  return value.includes("@") ? value.split("@").pop() ?? "" : "";
}

function uniqueStrings(values: Array<string | null | undefined>): string[] {
  return [...new Set(values.map((value) => value?.trim()).filter((value): value is string => Boolean(value)))];
}

function clip(text: string, limit: number): string {
  return text.length <= limit ? text : `${text.slice(0, limit - 1)}…`;
}

function stripHtml(html: string): string {
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

function decodeBody(part: { body?: { data?: string | null } }): string {
  if (!part.body?.data) return "";
  return Buffer.from(part.body.data, "base64url").toString("utf-8");
}

function extractText(payload: gmail_v1.Schema$MessagePart | undefined): string {
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

function collectAttachmentNames(
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

function headerValue(
  headers: gmail_v1.Schema$MessagePartHeader[] | undefined,
  name: string,
): string {
  return headers?.find((header) => header.name?.toLowerCase() === name.toLowerCase())?.value ?? "";
}

function parseAddress(token: string): EmailAddress | null {
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

function parseAddressList(raw: string): EmailAddress[] {
  return raw
    .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
    .map((part) => parseAddress(part))
    .filter((value): value is EmailAddress => value !== null);
}

function parseDateToIso(value: string | null): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function classifyTopic(message: EmailMessageDetail): string | null {
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

function inferClientSlug(message: EmailMessageDetail): string | null {
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

function inferTourLabel(message: EmailMessageDetail, clientSlug: string | null): string | null {
  const haystack = `${message.subject}\n${message.bodyText}`.toLowerCase();
  if (clientSlug === "don_omar_bcn" || haystack.includes("don omar")) return "Tours/Don Omar";
  if (haystack.includes("camila")) return "Tours/Camila";
  if (haystack.includes("arjona")) return "Tours/Arjona";
  if (clientSlug === "zamora") return "Tours/Other";
  return null;
}

function classifyInboundMessage(message: EmailMessageDetail): EmailTriageDecision {
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

function classifyOutboundMessage(message: EmailMessageDetail): EmailTriageDecision {
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

function formatRecipients(addresses: EmailAddress[]): string[] {
  return addresses.map((entry) => entry.email);
}

function detectLanguage(text: string): string {
  const lower = text.toLowerCase();
  const spanishHints = [" hola ", " gracias ", " por favor", " envio", " adjunto", "venue", "meta pixel id"];
  return spanishHints.some((hint) => lower.includes(hint.trim())) ? "es" : "en";
}

function extractJsonObject(text: string): string | null {
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

function normalizeImportance(value: unknown, fallback: EmailImportance): EmailImportance {
  const parsed = value === "urgent" || value === "high" || value === "normal" || value === "low"
    ? value
    : fallback;
  return IMPORTANCE_RANK[parsed] >= IMPORTANCE_RANK[fallback] ? parsed : fallback;
}

function stripLegacyCodeFormatting(value: string): string {
  return value
    .replace(/```[\w-]*\n?([\s\S]*?)```/g, "$1")
    .replace(/`([^`]+?)`/g, "$1")
    .trim();
}

function coerceDraftPlan(
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

function readServiceAccount() {
  return JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, "utf-8")) as {
    client_email: string;
    private_key: string;
  };
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

async function findExistingEmailEvent(messageId: string): Promise<{
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

function toMessageDetail(
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

async function readMessageDetail(messageId: string): Promise<EmailMessageDetail> {
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
  const pending: string[] = [];

  for (const messageId of messageIds) {
    const existing = await findExistingEmailEvent(messageId);
    if (!existing || existing.status === "received") {
      pending.push(messageId);
    }
  }

  return pending;
}

export function getPushRecoveryLimit(): number {
  return PUSH_RECOVERY_LIMIT;
}

async function readThreadMessages(threadId: string): Promise<EmailMessageDetail[]> {
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

async function applyLabels(messageId: string, labelNames: string[]): Promise<string[]> {
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

interface EmailThreadActionResult {
  messageId: string;
  threadId: string | null;
  appliedLabels: string[];
  archived: boolean;
  markedRead: boolean;
}

interface EmailLogRecord {
  sender: string;
  subject: string;
  classification?: EmailClassification;
  importance?: EmailImportance;
  appliedLabels?: string[];
  archived?: boolean;
  markedRead?: boolean;
  draftedReply?: boolean;
  needsReply?: boolean;
  ownerAttention?: boolean;
  ownerDelivery?: "action-alert" | "quick-fyi" | "quiet";
  why?: string | null;
  note?: string | null;
  topic?: string | null;
  clientSlug?: string | null;
}

function formatEmailParty(name: string | null | undefined, email: string | null | undefined): string {
  if (name && email) return `${name} <${email}>`;
  return email ?? name ?? "unknown sender";
}

function formatEmailLog(recordType: string, record: EmailLogRecord): string {
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

async function postEmailLog(text: string): Promise<void> {
  try {
    const { notifyChannel } = await import("../discord/core/entry.js");
    await notifyChannel("email-log", text);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("[email-agent] Failed to write #email-log entry:", message);
  }
}

async function readEmailEventRecord(messageId: string): Promise<{
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

async function archiveMessage(messageId: string): Promise<void> {
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

async function readActivityContext(clientSlug: string | null, senderEmail: string | null): Promise<string[]> {
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

async function readBusinessContext(clientSlug: string | null): Promise<BusinessContext> {
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

async function readStyleExamples(contactEmail: string | null, clientSlug: string | null): Promise<StyleExample[]> {
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

async function loadOwnerCorrections(): Promise<OwnerEmailCorrection[]> {
  try {
    const raw = await readFile(OWNER_CORRECTIONS_PATH, "utf-8");
    const parsed = JSON.parse(raw) as OwnerEmailCorrection[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function saveOwnerCorrections(corrections: OwnerEmailCorrection[]): Promise<void> {
  await writeFile(OWNER_CORRECTIONS_PATH, `${JSON.stringify(corrections, null, 2)}\n`, "utf-8");
}

async function readOwnerCorrections(contactEmail: string | null, topic: string | null): Promise<string[]> {
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

function formatThreadContext(threadMessages: EmailMessageDetail[], currentMessageId: string): string {
  return threadMessages
    .filter((message) => message.id !== currentMessageId)
    .map((message) => {
      const who = message.direction === "outbound" ? "Jaime" : (message.from?.email ?? "unknown sender");
      return `${who} | ${message.subject}\n${clip(message.bodyText, 600)}`;
    })
    .join("\n\n");
}

function formatBusinessContext(context: BusinessContext): string {
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

function formatStyleExamples(examples: StyleExample[]): string {
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

function buildInboundPrompt(
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

function formatOwnerNotification(
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

function buildOwnerAlertCard(
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

function looksLikeBulkPromo(message: EmailMessageDetail, plan: EmailDraftPlan): boolean {
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

function shouldPushOwnerAlert(
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

async function upsertEmailEvent(
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

async function insertSuggestedDraft(
  message: EmailMessageDetail,
  plan: EmailDraftPlan,
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

async function storeSentExample(
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
      const msg = err instanceof Error ? err.message : String(err);
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
