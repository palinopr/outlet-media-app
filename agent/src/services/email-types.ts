import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const SERVICE_ACCOUNT_PATH = fileURLToPath(new URL("../../service-account.json", import.meta.url));
export const MANAGED_LABELS_PATH = fileURLToPath(new URL("../../config/gmail-managed-labels.json", import.meta.url));
export const OWNER_CORRECTIONS_PATH = fileURLToPath(new URL("../../session/email-owner-corrections.json", import.meta.url));
export const GMAIL_IMPERSONATE_USER = process.env.GMAIL_IMPERSONATE_USER ?? "jaime@outletmedia.net";
export const MY_EMAIL = GMAIL_IMPERSONATE_USER.toLowerCase();
export const MAX_BODY_CHARS = 8_000;
export const MAX_STYLE_EXAMPLES = 3;
export const MAX_THREAD_MESSAGES = 5;
export const MAX_ACTIVITY_ENTRIES = 5;
export const MANUAL_SWEEP_LIMIT = 5;
export const PUSH_RECOVERY_LIMIT = 20;
export const WATCHED_MAILBOX_LABELS = new Set(
  (process.env.GMAIL_PUSH_LABEL_IDS ?? "INBOX,SENT")
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean),
);

export type EmailDirection = "inbound" | "outbound";
export type EmailClassification =
  | "vip"
  | "team"
  | "client"
  | "vendor"
  | "finance"
  | "meeting"
  | "notification"
  | "junk"
  | "routine";
export type EmailImportance = "urgent" | "high" | "normal" | "low";

export const IMPORTANCE_RANK: Record<EmailImportance, number> = {
  low: 0,
  normal: 1,
  high: 2,
  urgent: 3,
};

export interface EmailAddress {
  name: string | null;
  email: string;
}

export interface EmailMessageDetail {
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

export interface CampaignSnapshot {
  name: string;
  status: string;
  roas: number | null;
  spend: number | null;
  daily_budget: number | null;
  start_time: string | null;
}

export interface EventSnapshot {
  name: string;
  date: string | null;
  tickets_sold: number | null;
  gross: number | null;
}

export interface StyleExample {
  subject: string | null;
  body_text: string;
  created_at: string;
  contact_email: string | null;
}

export interface OwnerEmailCorrection {
  created_at: string;
  message_id: string;
  sender_email: string | null;
  sender_domain: string | null;
  subject: string | null;
  topic: string | null;
  note: string;
}

export interface BusinessContext {
  clientSlug: string | null;
  campaigns: string[];
  events: string[];
}

export interface EmailTriageDecision {
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

export interface EmailDraftPlan {
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

export interface ManagedLabel {
  name: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface EmailThreadActionResult {
  messageId: string;
  threadId: string | null;
  appliedLabels: string[];
  archived: boolean;
  markedRead: boolean;
}

export interface EmailLogRecord {
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

export const TEAM_DOMAINS = new Set(["outletmedia.net"]);
export const CLIENT_DOMAINS = new Set([
  "zamorausa.com",
  "touringco.com",
  "eoentertainment.com",
  "atgentertainment.com",
  "thepg.com",
  "seminolehardrock.com",
  "shrss.com",
  "aegpresents.com",
]);
export const VENUE_DOMAINS = new Set([
  "goldenstate.com",
  "acrisurearena.com",
  "ocvibe.com",
  "maverikcenter.com",
  "pechangaarenasd.com",
  "cvfirebirds.com",
  "cajinapro.com",
  "ticketera.com",
]);
export const FINANCE_DOMAINS = new Set(["brodriguezcpa.com"]);
export const TECH_ALERT_DOMAINS = new Set([
  "github.com",
  "vercel.com",
  "railway.app",
  "render.com",
  "supabase.co",
  "sentry.io",
  "discord.com",
  "google.com",
]);
export const VIP_SENDERS = new Set([
  "mirna@zamorausa.com",
  "ivan.gonzalez@zamorausa.com",
  "lida@zamorausa.com",
  "jesus.guzman@zamorausa.com",
  "omar.rodriguez@zamorausa.com",
  "alexandra@outletmedia.net",
  "isabel@outletmedia.net",
  "natalie@outletmedia.net",
]);

let managedLabelsCache: ManagedLabel[] | null = null;

export function getManagedLabels(): ManagedLabel[] {
  if (managedLabelsCache) {
    return managedLabelsCache;
  }

  const raw = JSON.parse(readFileSync(MANAGED_LABELS_PATH, "utf-8")) as ManagedLabel[];
  managedLabelsCache = raw;
  return raw;
}
