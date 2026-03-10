import { createHmac, timingSafeEqual } from "node:crypto";
import { logSystemEvent } from "@/features/system-events/server";
import { supabaseAdmin } from "@/lib/supabase";
import whatsappClientRouting from "../../../config/whatsapp-client-routing.json";

export const WHATSAPP_GRAPH_API_VERSION = process.env.WHATSAPP_CLOUD_API_VERSION ?? "v23.0";
const WHATSAPP_AGENT_KEY = "customer-whatsapp-agent";
const WHATSAPP_SYSTEM_ACTORS = {
  evolution: {
    actorId: "whatsapp-evolution",
    actorName: "Evolution WhatsApp",
    actorType: "system" as const,
  },
  "meta-cloud": {
    actorId: "whatsapp-cloud",
    actorName: "WhatsApp Cloud API",
    actorType: "system" as const,
  },
  twilio: {
    actorId: "whatsapp-twilio",
    actorName: "Twilio WhatsApp",
    actorType: "system" as const,
  },
};

type WhatsAppTransport = "meta-cloud" | "twilio" | "evolution";

interface WhatsAppClientRoute {
  agentKey?: string;
  clientSlug: string;
  discordChannel: string;
  threadPrefix?: string;
}

const ROUTES_BY_CLIENT_SLUG = new Map(
  (whatsappClientRouting as WhatsAppClientRoute[]).map((route) => [route.clientSlug, route]),
);

interface MetaWebhookContact {
  profile?: {
    name?: string;
  };
  wa_id?: string;
}

interface MetaWebhookMessage {
  context?: {
    id?: string;
  };
  document?: {
    caption?: string;
    filename?: string;
    id?: string;
  };
  errors?: Array<Record<string, unknown>>;
  from?: string;
  id?: string;
  image?: {
    caption?: string;
    id?: string;
  };
  interactive?: {
    button_reply?: {
      id?: string;
      title?: string;
    };
    list_reply?: {
      id?: string;
      title?: string;
    };
    type?: string;
  };
  location?: {
    address?: string;
    latitude?: number;
    longitude?: number;
    name?: string;
  };
  referral?: Record<string, unknown>;
  sticker?: {
    id?: string;
  };
  text?: {
    body?: string;
  };
  timestamp?: string;
  type?: string;
  video?: {
    caption?: string;
    id?: string;
  };
}

interface MetaWebhookStatus {
  conversation?: {
    expiration_timestamp?: string;
    id?: string;
    origin?: {
      type?: string;
    };
  };
  errors?: Array<Record<string, unknown>>;
  id?: string;
  pricing?: Record<string, unknown>;
  recipient_id?: string;
  status?: string;
  timestamp?: string;
}

interface MetaWebhookChangeValue {
  contacts?: MetaWebhookContact[];
  messages?: MetaWebhookMessage[];
  metadata?: {
    display_phone_number?: string;
    phone_number_id?: string;
  };
  messaging_product?: string;
  statuses?: MetaWebhookStatus[];
}

interface MetaWebhookChange {
  field?: string;
  value?: MetaWebhookChangeValue;
}

interface MetaWebhookEntry {
  changes?: MetaWebhookChange[];
  id?: string;
}

export interface WhatsAppWebhookPayload {
  entry?: MetaWebhookEntry[];
  object?: string;
}

interface NormalizedWebhookBatch {
  displayPhoneNumber: string | null;
  phoneNumberId: string;
  statuses: MetaWebhookStatus[];
  wabaId: string | null;
  contacts: Map<string, MetaWebhookContact>;
  messages: MetaWebhookMessage[];
}

interface AccountRow {
  id: string;
  business_display_name: string | null;
  default_agent_key: string;
  default_client_slug: string | null;
  default_discord_channel: string | null;
  display_phone_number: string | null;
  metadata?: Record<string, unknown> | null;
  mode: string;
  phone_number_id: string;
  waba_id?: string | null;
}

interface ContactRow {
  client_slug: string | null;
  id: string;
  profile_name: string | null;
  wa_id: string;
}

interface ConversationRow {
  agent_key: string;
  client_slug: string | null;
  discord_channel_name: string | null;
  discord_thread_id: string | null;
  id: string;
  last_outbound_message_at?: string | null;
  metadata?: Record<string, unknown> | null;
  mode: string;
  status: string;
}

interface MessageRow {
  id: string;
  message_id: string;
  mirrored_to_discord_at: string | null;
  triaged_at: string | null;
}

interface OpenConversationTaskRow {
  created_at: string;
  id: string;
  params: Record<string, unknown> | null;
  status: string;
}

type ConversationTaskPlan =
  | {
      kind: "insert";
      params: Record<string, unknown>;
      supersededTaskIds: string[];
      taskId: string;
    }
  | {
      kind: "noop";
      params: Record<string, unknown>;
      supersededTaskIds: string[];
      taskId: string;
    }
  | {
      kind: "update";
      params: Record<string, unknown>;
      supersededTaskIds: string[];
      taskId: string;
    };

interface EnsureAccountInput {
  businessDisplayName?: string | null;
  displayPhoneNumber?: string | null;
  metadata?: Record<string, unknown>;
  phoneNumberId: string;
  transport?: WhatsAppTransport;
  wabaId?: string | null;
}

interface NormalizedInboundMessage {
  contextMessageId?: string | null;
  fromWaId: string | null;
  metadata?: Record<string, unknown>;
  messageId: string;
  messageType: string;
  preview: string;
  profileName?: string | null;
  rawPayload: unknown;
  receivedAt: string | null;
  status?: string;
  textBody: string | null;
  toWaId: string | null;
}

interface NormalizedMessageStatus {
  errorMessage?: string | null;
  messageId: string;
  metadata?: Record<string, unknown>;
  preview: string;
  providerConversationId?: string | null;
  providerPricing?: Record<string, unknown>;
  rawPayload: unknown;
  recipientProfileName?: string | null;
  recipientWaId: string | null;
  sentAt: string | null;
  status: string;
}

interface TwilioWebhookPayload {
  accountSid?: string | null;
  body?: string | null;
  from?: string | null;
  mediaCount?: number;
  messageSid?: string | null;
  messageStatus?: string | null;
  profileName?: string | null;
  raw: Record<string, string>;
  to?: string | null;
  waId?: string | null;
}

export interface EvolutionWebhookPayload {
  apikey?: string | null;
  data?: {
    contextInfo?: Record<string, unknown> | null;
    key?: {
      fromMe?: boolean;
      id?: string;
      participant?: string;
      remoteJid?: string;
    };
    message?: Record<string, unknown> | null;
    messageTimestamp?: number | string | null;
    messageType?: string | null;
    pushName?: string | null;
    status?: string | null;
    subject?: string | null;
  } | null;
  date_time?: string | null;
  destination?: string | null;
  event?: string | null;
  instance?: string | null;
  sender?: string | null;
  server_url?: string | null;
}

export interface IngestWhatsAppWebhookResult {
  processedMessages: number;
  processedStatuses: number;
  taskIds: string[];
}

interface SendWhatsAppTextMessageInput {
  approved?: boolean;
  body: string;
  conversationId?: string;
  phoneNumberId?: string;
  previewUrl?: boolean;
  replyToMessageId?: string;
  toWaId?: string;
}

interface AutoAckPolicyInput {
  accessStatus?: string | null;
  chatKind?: string | null;
  lastOutboundMessageAt?: string | null;
  messageMetadata?: Record<string, unknown> | null;
  mode?: string | null;
  textBody?: string | null;
  waId?: string | null;
}

function normalizeDigits(value: string | null | undefined): string | null {
  if (!value) return null;
  const digits = value.replace(/\D/g, "");
  return digits.length > 0 ? digits : null;
}

function isGroupJid(value: string | null | undefined): boolean {
  return typeof value === "string" && value.endsWith("@g.us");
}

function toConversationChatKind(value: string | null | undefined): "direct" | "group" {
  return isGroupJid(value) ? "group" : "direct";
}

function buildConversationMetadata(
  existing: Record<string, unknown> | null | undefined,
  input: {
    clientSlug: string | null;
    contactLabel: string | null;
    waId: string;
  },
): Record<string, unknown> {
  const metadata = parseMetadataRecord(existing);
  const chat = parseMetadataRecord(metadata.chat);
  const group = parseMetadataRecord(metadata.group);
  const chatKind = toConversationChatKind(input.waId);

  const next: Record<string, unknown> = {
    ...metadata,
    chat: {
      ...chat,
      company: chat.company ?? input.clientSlug,
      kind: chatKind,
      label: chat.label ?? input.contactLabel ?? input.waId,
    },
  };

  if (chatKind === "group") {
    next.group = {
      ...group,
      policy: group.policy ?? "mention_only",
    };
  }

  return next;
}

function parseMetadataRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function parseMetadataStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function parseConversationAccessStatus(metadata: unknown): string | null {
  const access = parseMetadataRecord(parseMetadataRecord(metadata).access);
  return typeof access.status === "string" ? access.status : null;
}

function parseConversationChatKind(metadata: unknown): string | null {
  const chat = parseMetadataRecord(parseMetadataRecord(metadata).chat);
  return typeof chat.kind === "string" ? chat.kind : null;
}

function isOwnerNumber(waId: string | null | undefined): boolean {
  const normalized = normalizeDigits(waId);
  if (!normalized) return false;

  const configured = (process.env.WHATSAPP_OWNER_NUMBERS ?? "")
    .split(",")
    .map((value) => normalizeDigits(value))
    .filter((value): value is string => Boolean(value));

  return configured.includes(normalized);
}

function parseOwnerControlText(text: string | null | undefined): string | null {
  const trimmed = text?.trim();
  if (!trimmed) return null;

  const match = trimmed.match(/^(?:!|\/)(boss|whatsapp)\b[:\s-]*(.*)$/i);
  if (!match) return null;

  const command = match[2]?.trim();
  return command && command.length > 0 ? command : null;
}

function autoAckCooldownMs(): number {
  const raw = Number(process.env.WHATSAPP_AUTO_ACK_COOLDOWN_SECONDS ?? "45");
  const seconds = Number.isFinite(raw) && raw > 0 ? raw : 45;
  return seconds * 1000;
}

function autoAckDelayMs(): number {
  const raw = Number(process.env.WHATSAPP_AUTO_ACK_DELAY_MS ?? "1500");
  return Number.isFinite(raw) && raw >= 0 ? raw : 1500;
}

function shouldUseTwilioTypingIndicator(): boolean {
  return process.env.TWILIO_WHATSAPP_TYPING_INDICATOR === "true";
}

function hasExplicitGroupWakeSignal(
  textBody: string | null | undefined,
  messageMetadata: Record<string, unknown> | null | undefined,
): boolean {
  const metadata = parseMetadataRecord(messageMetadata);
  const mentionedJids = parseMetadataStringArray(metadata.mentionedJids);
  const mentionedWaIds = parseMetadataStringArray(metadata.mentionedWaIds);
  if (mentionedJids.length > 0 || mentionedWaIds.length > 0) {
    return true;
  }

  const body = (textBody ?? "").toLowerCase();
  return /@meta agent|@outlet media agent|meta agent|outlet media agent|client liaison/.test(body);
}

export function shouldAutoAcknowledgeWhatsAppInbound(input: AutoAckPolicyInput): boolean {
  if (input.mode !== "live") return false;
  if ((input.accessStatus ?? "pending") !== "approved") return false;
  const chatKind = input.chatKind ?? "direct";
  if (chatKind === "group" && !hasExplicitGroupWakeSignal(input.textBody, input.messageMetadata)) {
    return false;
  }
  if (chatKind !== "direct" && chatKind !== "group") return false;

  if (isOwnerNumber(input.waId) && parseOwnerControlText(input.textBody)) {
    return false;
  }

  if (input.lastOutboundMessageAt) {
    const lastOutbound = new Date(input.lastOutboundMessageAt).getTime();
    if (Number.isFinite(lastOutbound) && Date.now() - lastOutbound < autoAckCooldownMs()) {
      return false;
    }
  }

  return true;
}

function buildAutomaticAckText(): string {
  const configured = process.env.WHATSAPP_AUTO_ACK_TEXT?.trim();
  return configured && configured.length > 0
    ? configured
    : "Got it. Working on it now.";
}

export function normalizeWaId(value: string | null | undefined): string | null {
  return normalizeDigits(value);
}

function toIsoTimestamp(value: string | null | undefined): string | null {
  if (!value) return null;
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  return new Date(numeric * 1000).toISOString();
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

function normalizeE164(value: string | null | undefined): string | null {
  const digits = normalizeDigits(value);
  return digits ? `+${digits}` : null;
}

function normalizeWhatsAppAddress(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed.startsWith("whatsapp:")) {
    return normalizeE164(trimmed.slice("whatsapp:".length));
  }
  return normalizeE164(trimmed);
}

function toWhatsAppAddress(value: string | null | undefined): string {
  const e164 = normalizeWhatsAppAddress(value);
  if (!e164) {
    throw new Error("WhatsApp phone number is missing or invalid.");
  }
  return `whatsapp:${e164}`;
}

function transportMetadata(input: EnsureAccountInput): Record<string, unknown> {
  return {
    ...(input.metadata ?? {}),
    transport: input.transport ?? "meta-cloud",
  };
}

function getAccountTransport(account: AccountRow): WhatsAppTransport {
  const transport = account.metadata?.transport;
  if (transport === "twilio" || transport === "evolution") {
    return transport;
  }
  return "meta-cloud";
}

function getSystemActor(transport: WhatsAppTransport) {
  return WHATSAPP_SYSTEM_ACTORS[transport];
}

function buildTwilioValidationUrl(requestUrl: string): string {
  const publicBase = process.env.NEXT_PUBLIC_APP_URL;
  if (!publicBase) return requestUrl;

  const url = new URL(requestUrl);
  return new URL(`${url.pathname}${url.search}`, publicBase).toString();
}

function buildTwilioSignaturePayload(url: string, params: URLSearchParams): string {
  const entries = [...params.entries()].sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey));
  return entries.reduce((payload, [key, value]) => payload + key + value, url);
}

function firstJoinedRow(value: unknown): Record<string, unknown> {
  if (Array.isArray(value)) {
    const row = value[0];
    return row && typeof row === "object" ? (row as Record<string, unknown>) : {};
  }

  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

export function verifyWhatsAppWebhookSignature(
  body: string,
  signatureHeader: string | null,
): boolean {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret) return true;
  if (!signatureHeader) return false;

  const expected = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
  return safeEqual(expected, signatureHeader);
}

export function verifyTwilioWebhookSignature(
  requestUrl: string,
  params: URLSearchParams,
  signatureHeader: string | null,
): boolean {
  if (process.env.TWILIO_VALIDATE_SIGNATURE === "false") {
    return true;
  }
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) return true;
  if (!signatureHeader) return false;

  const payload = buildTwilioSignaturePayload(buildTwilioValidationUrl(requestUrl), params);
  const expected = createHmac("sha1", authToken).update(payload).digest("base64");
  return safeEqual(expected, signatureHeader);
}

function getTextFromMessage(message: MetaWebhookMessage): string | null {
  if (typeof message.text?.body === "string" && message.text.body.trim().length > 0) {
    return message.text.body.trim();
  }
  return null;
}

export function buildWhatsAppMessagePreview(message: MetaWebhookMessage): string {
  const directText = getTextFromMessage(message);
  if (directText) return directText;

  switch (message.type) {
    case "image":
      return message.image?.caption?.trim() || "[image]";
    case "video":
      return message.video?.caption?.trim() || "[video]";
    case "document":
      return message.document?.caption?.trim() || message.document?.filename?.trim() || "[document]";
    case "sticker":
      return "[sticker]";
    case "audio":
      return "[audio]";
    case "location": {
      const name = message.location?.name?.trim();
      const address = message.location?.address?.trim();
      if (name && address) return `[location] ${name} - ${address}`;
      if (name) return `[location] ${name}`;
      if (address) return `[location] ${address}`;
      return "[location]";
    }
    case "interactive": {
      const title =
        message.interactive?.button_reply?.title?.trim() ||
        message.interactive?.list_reply?.title?.trim();
      return title ? `[interactive] ${title}` : "[interactive]";
    }
    default:
      return `[${message.type ?? "message"}]`;
  }
}

function objectFromSearchParams(params: URLSearchParams): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    values[key] = value;
  }
  return values;
}

function parseTwilioMediaCount(value: string | null | undefined): number {
  if (!value) return 0;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function parseTwilioWebhookPayload(params: URLSearchParams): TwilioWebhookPayload {
  const raw = objectFromSearchParams(params);
  return {
    accountSid: raw.AccountSid ?? null,
    body: raw.Body?.trim() || null,
    from: raw.From ?? null,
    mediaCount: parseTwilioMediaCount(raw.NumMedia),
    messageSid: raw.MessageSid ?? raw.SmsMessageSid ?? null,
    messageStatus: raw.MessageStatus ?? raw.SmsStatus ?? null,
    profileName: raw.ProfileName?.trim() || null,
    raw,
    to: raw.To ?? null,
    waId: raw.WaId ?? null,
  };
}

function normalizeEvolutionEventName(value: string | null | undefined): string {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, ".");
}

function normalizeInboundMessageStatus(value: string | null | undefined): string {
  const normalized = (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, ".");

  if (!normalized) return "received";

  switch (normalized) {
    case "delivery.ack":
    case "server.ack":
    case "played":
    case "played.ack":
      return "received";
    default:
      return ["received", "queued", "sent", "delivered", "read", "failed", "ignored"].includes(
        normalized,
      )
        ? normalized
        : "received";
  }
}

function normalizeOutboundMessageStatus(value: string | null | undefined): string {
  const normalized = (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, ".");

  if (!normalized) return "sent";

  switch (normalized) {
    case "pending":
    case "server.ack":
      return "sent";
    case "delivery.ack":
      return "delivered";
    case "read":
    case "read.ack":
      return "read";
    case "failed":
    case "error":
      return "failed";
    default:
      return ["queued", "sent", "delivered", "read", "failed", "ignored"].includes(normalized)
        ? normalized
        : "sent";
  }
}

function normalizeEvolutionAccountKey(instanceName: string): string {
  return `evolution:${instanceName}`;
}

function normalizeEvolutionAddress(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (isGroupJid(trimmed)) return trimmed;

  const localPart = trimmed.includes("@") ? trimmed.split("@")[0] ?? trimmed : trimmed;
  return normalizeDigits(localPart) ?? localPart;
}

function evolutionMessageRecord(payload: EvolutionWebhookPayload): Record<string, unknown> {
  return payload.data?.message && typeof payload.data.message === "object"
    ? payload.data.message
    : {};
}

function getEvolutionMessageText(payload: EvolutionWebhookPayload): string | null {
  const message = evolutionMessageRecord(payload);

  const directText = typeof message.conversation === "string" ? message.conversation.trim() : null;
  if (directText) return directText;

  const extended = parseMetadataRecord(message.extendedTextMessage);
  if (typeof extended.text === "string" && extended.text.trim().length > 0) {
    return extended.text.trim();
  }

  const image = parseMetadataRecord(message.imageMessage);
  if (typeof image.caption === "string" && image.caption.trim().length > 0) {
    return image.caption.trim();
  }

  const video = parseMetadataRecord(message.videoMessage);
  if (typeof video.caption === "string" && video.caption.trim().length > 0) {
    return video.caption.trim();
  }

  const document = parseMetadataRecord(message.documentMessage);
  if (typeof document.caption === "string" && document.caption.trim().length > 0) {
    return document.caption.trim();
  }
  if (typeof document.fileName === "string" && document.fileName.trim().length > 0) {
    return document.fileName.trim();
  }

  const button = parseMetadataRecord(message.buttonsResponseMessage);
  if (typeof button.selectedDisplayText === "string" && button.selectedDisplayText.trim().length > 0) {
    return button.selectedDisplayText.trim();
  }

  const templateButton = parseMetadataRecord(message.templateButtonReplyMessage);
  if (
    typeof templateButton.selectedDisplayText === "string" &&
    templateButton.selectedDisplayText.trim().length > 0
  ) {
    return templateButton.selectedDisplayText.trim();
  }

  const listResponse = parseMetadataRecord(message.listResponseMessage);
  if (typeof listResponse.title === "string" && listResponse.title.trim().length > 0) {
    return listResponse.title.trim();
  }
  const singleSelect = parseMetadataRecord(listResponse.singleSelectReply);
  if (typeof singleSelect.title === "string" && singleSelect.title.trim().length > 0) {
    return singleSelect.title.trim();
  }

  return null;
}

export function buildEvolutionMessagePreview(payload: EvolutionWebhookPayload): string {
  const text = getEvolutionMessageText(payload);
  if (text) return text;

  const messageType = payload.data?.messageType ?? "message";
  switch (messageType) {
    case "imageMessage":
    case "image":
      return "[image]";
    case "videoMessage":
    case "video":
      return "[video]";
    case "audioMessage":
    case "audio":
      return "[audio]";
    case "documentMessage":
    case "document":
      return "[document]";
    case "stickerMessage":
    case "sticker":
      return "[sticker]";
    default:
      return `[${messageType}]`;
  }
}

export function verifyEvolutionWebhookRequest(
  headers: Headers,
  payload: EvolutionWebhookPayload,
): boolean {
  const configuredSecret = process.env.EVOLUTION_WEBHOOK_SECRET ?? process.env.INGEST_SECRET ?? null;
  const authHeader = headers.get("authorization")?.trim() ?? null;

  if (configuredSecret) {
    const bearer = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1] ?? null;
    if (!bearer) return false;
    return safeEqual(bearer, configuredSecret);
  }

  const configuredApiKey = process.env.EVOLUTION_API_KEY?.trim();
  if (!configuredApiKey) return false;

  const requestApiKey =
    headers.get("apikey")?.trim() ??
    headers.get("x-api-key")?.trim() ??
    payload.apikey?.trim() ??
    null;

  if (!requestApiKey) return false;
  return safeEqual(requestApiKey, configuredApiKey);
}

function buildTwilioMessagePreview(payload: TwilioWebhookPayload): string {
  if (payload.body) return payload.body;
  if ((payload.mediaCount ?? 0) > 0) {
    return payload.mediaCount === 1 ? "[media]" : `[media x${payload.mediaCount}]`;
  }
  return "[message]";
}

function isTwilioInboundMessage(payload: TwilioWebhookPayload): boolean {
  return Boolean(
    payload.messageSid &&
      payload.from &&
      payload.to &&
      (payload.waId || payload.profileName || payload.messageStatus === "received"),
  );
}

export function extractWhatsAppWebhookBatches(payload: WhatsAppWebhookPayload): NormalizedWebhookBatch[] {
  if (payload.object !== "whatsapp_business_account") {
    return [];
  }

  const batches: NormalizedWebhookBatch[] = [];

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "messages" || !change.value?.metadata?.phone_number_id) continue;

      const contacts = new Map<string, MetaWebhookContact>();
      for (const contact of change.value.contacts ?? []) {
        const waId = normalizeWaId(contact.wa_id);
        if (waId) contacts.set(waId, contact);
      }

      batches.push({
        contacts,
        displayPhoneNumber: change.value.metadata.display_phone_number ?? null,
        messages: change.value.messages ?? [],
        phoneNumberId: change.value.metadata.phone_number_id,
        statuses: change.value.statuses ?? [],
        wabaId: entry.id ?? null,
      });
    }
  }

  return batches;
}

async function guessClientSlugFromCrm(waId: string): Promise<string | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from("crm_contacts")
    .select("client_slug, phone")
    .not("phone", "is", null);

  if (error) {
    console.error("[whatsapp] CRM phone lookup failed:", error.message);
    return null;
  }

  const normalizedWaId = normalizeWaId(waId);
  if (!normalizedWaId) return null;

  for (const row of data ?? []) {
    const phone = normalizeDigits((row.phone as string | null) ?? null);
    if (phone && phone === normalizedWaId) {
      return (row.client_slug as string | null) ?? null;
    }
  }

  return null;
}

async function ensureAccount(input: EnsureAccountInput): Promise<AccountRow> {
  if (!supabaseAdmin) {
    throw new Error("Database not configured. Set SUPABASE_SERVICE_ROLE_KEY.");
  }

  const { data: existing, error } = await supabaseAdmin
    .from("whatsapp_accounts")
    .select(
      "id, business_display_name, default_agent_key, default_client_slug, default_discord_channel, display_phone_number, metadata, mode, phone_number_id, waba_id",
    )
    .eq("phone_number_id", input.phoneNumberId)
    .maybeSingle();

  if (error) {
    throw new Error(`[whatsapp] account lookup failed: ${error.message}`);
  }

  if (existing) {
    const updates: Record<string, unknown> = {};
    const currentMetadata = (existing.metadata ?? {}) as Record<string, unknown>;
    if (input.wabaId && (existing as Record<string, unknown>).waba_id !== input.wabaId) {
      updates.waba_id = input.wabaId;
    }
    if (input.displayPhoneNumber && existing.display_phone_number !== input.displayPhoneNumber) {
      updates.display_phone_number = input.displayPhoneNumber;
    }
    if (input.businessDisplayName && existing.business_display_name !== input.businessDisplayName) {
      updates.business_display_name = input.businessDisplayName;
    }

    const desiredMetadata = {
      ...currentMetadata,
      ...transportMetadata(input),
    };
    if (JSON.stringify(currentMetadata) !== JSON.stringify(desiredMetadata)) {
      updates.metadata = desiredMetadata;
    }

    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from("whatsapp_accounts")
        .update(updates)
        .eq("id", existing.id);
      if (updateError) {
        console.error("[whatsapp] account update failed:", updateError.message);
      }
    }

    return { ...(existing as AccountRow), ...updates } as AccountRow;
  }

  const insertPayload = {
    business_display_name: input.businessDisplayName ?? input.displayPhoneNumber ?? input.phoneNumberId,
    display_phone_number: input.displayPhoneNumber,
    metadata: transportMetadata(input),
    phone_number_id: input.phoneNumberId,
    waba_id: input.wabaId,
  };

  const { data: inserted, error: insertError } = await supabaseAdmin
    .from("whatsapp_accounts")
    .insert(insertPayload)
    .select(
      "id, business_display_name, default_agent_key, default_client_slug, default_discord_channel, display_phone_number, metadata, mode, phone_number_id, waba_id",
    )
    .single();

  if (insertError?.code === "23505") {
    const { data: conflicted, error: conflictLookupError } = await supabaseAdmin
      .from("whatsapp_accounts")
      .select(
        "id, business_display_name, default_agent_key, default_client_slug, default_discord_channel, display_phone_number, metadata, mode, phone_number_id, waba_id",
      )
      .eq("phone_number_id", input.phoneNumberId)
      .maybeSingle();

    if (conflictLookupError) {
      throw new Error(`[whatsapp] account conflict lookup failed: ${conflictLookupError.message}`);
    }

    if (conflicted) {
      return conflicted as AccountRow;
    }
  }

  if (insertError || !inserted) {
    throw new Error(`[whatsapp] account insert failed: ${insertError?.message ?? "unknown error"}`);
  }

  return inserted as AccountRow;
}

async function ensureContact(waId: string, profileNameInput?: string | null): Promise<ContactRow> {
  if (!supabaseAdmin) {
    throw new Error("Database not configured. Set SUPABASE_SERVICE_ROLE_KEY.");
  }

  const { data: existing, error } = await supabaseAdmin
    .from("whatsapp_contacts")
    .select("client_slug, id, profile_name, wa_id")
    .eq("wa_id", waId)
    .maybeSingle();

  if (error) {
    throw new Error(`[whatsapp] contact lookup failed: ${error.message}`);
  }

  const profileName = profileNameInput?.trim() || null;

  if (existing) {
    const updates: Record<string, unknown> = {};
    if (profileName && existing.profile_name !== profileName) {
      updates.profile_name = profileName;
    }

    if (!existing.client_slug) {
      const crmClientSlug = await guessClientSlugFromCrm(waId);
      if (crmClientSlug) {
        updates.client_slug = crmClientSlug;
      }
    }

    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from("whatsapp_contacts")
        .update(updates)
        .eq("id", existing.id);
      if (updateError) {
        console.error("[whatsapp] contact update failed:", updateError.message);
      }
      return { ...existing, ...updates } as ContactRow;
    }

    return existing as ContactRow;
  }

  const clientSlug = await guessClientSlugFromCrm(waId);
  const { data: inserted, error: insertError } = await supabaseAdmin
    .from("whatsapp_contacts")
    .insert({
      client_slug: clientSlug,
      phone_number: waId,
      profile_name: profileName,
      wa_id: waId,
    })
    .select("client_slug, id, profile_name, wa_id")
    .single();

  if (insertError?.code === "23505") {
    const { data: conflicted, error: conflictLookupError } = await supabaseAdmin
      .from("whatsapp_contacts")
      .select("client_slug, id, profile_name, wa_id")
      .eq("wa_id", waId)
      .maybeSingle();

    if (conflictLookupError) {
      throw new Error(`[whatsapp] contact conflict lookup failed: ${conflictLookupError.message}`);
    }

    if (conflicted) {
      return conflicted as ContactRow;
    }
  }

  if (insertError || !inserted) {
    throw new Error(`[whatsapp] contact insert failed: ${insertError?.message ?? "unknown error"}`);
  }

  return inserted as ContactRow;
}

async function ensureConversation(account: AccountRow, contact: ContactRow): Promise<ConversationRow> {
  if (!supabaseAdmin) {
    throw new Error("Database not configured. Set SUPABASE_SERVICE_ROLE_KEY.");
  }

  const { data: existing, error } = await supabaseAdmin
    .from("whatsapp_conversations")
    .select("agent_key, client_slug, discord_channel_name, discord_thread_id, id, last_outbound_message_at, metadata, mode, status")
    .eq("account_id", account.id)
    .eq("contact_id", contact.id)
    .maybeSingle();

  if (error) {
    throw new Error(`[whatsapp] conversation lookup failed: ${error.message}`);
  }

  const derivedClientSlug = existing?.client_slug ?? contact.client_slug ?? account.default_client_slug ?? null;
  const derivedRoute = derivedClientSlug ? ROUTES_BY_CLIENT_SLUG.get(derivedClientSlug) : null;
  const derivedChannel =
    existing?.discord_channel_name ??
    account.default_discord_channel ??
    derivedRoute?.discordChannel ??
    null;
  const derivedAgentKey =
    existing?.agent_key ??
    derivedRoute?.agentKey ??
    account.default_agent_key ??
    WHATSAPP_AGENT_KEY;
  const derivedMode = existing?.mode ?? account.mode ?? "shadow";
  const derivedMetadata = buildConversationMetadata(existing?.metadata, {
    clientSlug: derivedClientSlug,
    contactLabel: contact.profile_name,
    waId: contact.wa_id,
  });

  if (existing) {
    const updates: Record<string, unknown> = {};
    if (derivedClientSlug && existing.client_slug !== derivedClientSlug) {
      updates.client_slug = derivedClientSlug;
    }
    if (derivedChannel && existing.discord_channel_name !== derivedChannel) {
      updates.discord_channel_name = derivedChannel;
    }
    if (existing.agent_key !== derivedAgentKey) {
      updates.agent_key = derivedAgentKey;
    }
    if (existing.mode !== derivedMode) {
      updates.mode = derivedMode;
    }
    if (JSON.stringify(existing.metadata ?? {}) !== JSON.stringify(derivedMetadata)) {
      updates.metadata = derivedMetadata;
    }

    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from("whatsapp_conversations")
        .update(updates)
        .eq("id", existing.id);
      if (updateError) {
        console.error("[whatsapp] conversation update failed:", updateError.message);
      }
      return { ...existing, ...updates } as ConversationRow;
    }

    return existing as ConversationRow;
  }

  const { data: inserted, error: insertError } = await supabaseAdmin
    .from("whatsapp_conversations")
    .insert({
      account_id: account.id,
      agent_key: derivedAgentKey,
      client_slug: derivedClientSlug,
      contact_id: contact.id,
      discord_channel_name: derivedChannel,
      metadata: derivedMetadata,
      mode: derivedMode,
    })
    .select("agent_key, client_slug, discord_channel_name, discord_thread_id, id, last_outbound_message_at, metadata, mode, status")
    .single();

  if (insertError?.code === "23505") {
    const { data: conflicted, error: conflictLookupError } = await supabaseAdmin
      .from("whatsapp_conversations")
      .select("agent_key, client_slug, discord_channel_name, discord_thread_id, id, last_outbound_message_at, metadata, mode, status")
      .eq("account_id", account.id)
      .eq("contact_id", contact.id)
      .maybeSingle();

    if (conflictLookupError) {
      throw new Error(
        `[whatsapp] conversation conflict lookup failed: ${conflictLookupError.message}`,
      );
    }

    if (conflicted) {
      return conflicted as ConversationRow;
    }
  }

  if (insertError || !inserted) {
    throw new Error(
      `[whatsapp] conversation insert failed: ${insertError?.message ?? "unknown error"}`,
    );
  }

  return inserted as ConversationRow;
}

async function touchConversation(
  conversationId: string,
  direction: "inbound" | "outbound",
  preview: string,
  at: string | null,
): Promise<void> {
  if (!supabaseAdmin) return;

  const payload: Record<string, unknown> = {
    last_message_preview: preview,
  };

  if (direction === "inbound") {
    payload.last_inbound_message_at = at;
  } else {
    payload.last_outbound_message_at = at;
  }

  const { error } = await supabaseAdmin
    .from("whatsapp_conversations")
    .update(payload)
    .eq("id", conversationId);

  if (error) {
    console.error("[whatsapp] conversation touch failed:", error.message);
  }
}

async function upsertInboundMessage(
  account: AccountRow,
  contact: ContactRow,
  conversation: ConversationRow,
  message: NormalizedInboundMessage,
): Promise<MessageRow> {
  if (!supabaseAdmin || !message.messageId) {
    throw new Error("WhatsApp inbound message missing persistence requirements.");
  }

  const existingResult = await supabaseAdmin
    .from("whatsapp_messages")
    .select("id, message_id, mirrored_to_discord_at, triaged_at")
    .eq("message_id", message.messageId)
    .maybeSingle();

  if (existingResult.error) {
    throw new Error(`[whatsapp] message lookup failed: ${existingResult.error.message}`);
  }

  if (existingResult.data) {
    const { error: updateError } = await supabaseAdmin
      .from("whatsapp_messages")
      .update({
        account_id: account.id,
        contact_id: contact.id,
        context_message_id: message.contextMessageId ?? null,
        conversation_id: conversation.id,
        from_wa_id: message.fromWaId,
        metadata: message.metadata ?? {},
        message_type: message.messageType,
        raw_payload: message.rawPayload,
        received_at: message.receivedAt,
        status: message.status ?? "received",
        text_body: message.textBody,
        to_wa_id: message.toWaId,
      })
      .eq("id", existingResult.data.id);

    if (updateError) {
      console.error("[whatsapp] message update failed:", updateError.message);
    }

    await touchConversation(conversation.id, "inbound", message.preview, message.receivedAt);
    return existingResult.data as MessageRow;
  }

  const { data: inserted, error: insertError } = await supabaseAdmin
    .from("whatsapp_messages")
    .insert({
      account_id: account.id,
      contact_id: contact.id,
      context_message_id: message.contextMessageId ?? null,
      conversation_id: conversation.id,
      direction: "inbound",
      from_wa_id: message.fromWaId,
      metadata: message.metadata ?? {},
      message_id: message.messageId,
      message_type: message.messageType,
      raw_payload: message.rawPayload,
      received_at: message.receivedAt,
      status: message.status ?? "received",
      text_body: message.textBody,
      to_wa_id: message.toWaId,
    })
    .select("id, message_id, mirrored_to_discord_at, triaged_at")
    .single();

  if (insertError?.code === "23505") {
    const { data: conflicted, error: conflictLookupError } = await supabaseAdmin
      .from("whatsapp_messages")
      .select("id, message_id, mirrored_to_discord_at, triaged_at")
      .eq("message_id", message.messageId)
      .maybeSingle();

    if (conflictLookupError) {
      throw new Error(`[whatsapp] message conflict lookup failed: ${conflictLookupError.message}`);
    }

    if (conflicted) {
      await touchConversation(conversation.id, "inbound", message.preview, message.receivedAt);
      return conflicted as MessageRow;
    }
  }

  if (insertError || !inserted) {
    throw new Error(`[whatsapp] message insert failed: ${insertError?.message ?? "unknown error"}`);
  }

  await touchConversation(conversation.id, "inbound", message.preview, message.receivedAt);
  return inserted as MessageRow;
}

async function applyStatusUpdate(
  account: AccountRow,
  status: NormalizedMessageStatus,
): Promise<void> {
  if (!supabaseAdmin || !status.messageId) return;

  const existingResult = await supabaseAdmin
    .from("whatsapp_messages")
    .select("conversation_id, id")
    .eq("message_id", status.messageId)
    .maybeSingle();

  if (existingResult.error) {
    throw new Error(`[whatsapp] status lookup failed: ${existingResult.error.message}`);
  }

  if (existingResult.data) {
    const { error: updateError } = await supabaseAdmin
      .from("whatsapp_messages")
      .update({
        error_message: status.errorMessage ?? null,
        metadata: status.metadata ?? {},
        provider_conversation_id: status.providerConversationId ?? null,
        provider_pricing: status.providerPricing ?? {},
        raw_payload: status.rawPayload,
        sent_at: status.sentAt,
        status: status.status,
      })
      .eq("id", existingResult.data.id);

    if (updateError) {
      console.error("[whatsapp] status update failed:", updateError.message);
    }

    await touchConversation(
      existingResult.data.conversation_id as string,
      "outbound",
      status.preview,
      status.sentAt,
    );
    return;
  }

  const recipientWaId = normalizeWaId(status.recipientWaId);
  if (!recipientWaId) return;

  const contact = await ensureContact(recipientWaId, status.recipientProfileName ?? null);
  const conversation = await ensureConversation(account, contact);

  const { error: insertError } = await supabaseAdmin.from("whatsapp_messages").insert({
    account_id: account.id,
    contact_id: contact.id,
    conversation_id: conversation.id,
    direction: "outbound",
    error_message: status.errorMessage ?? null,
    from_wa_id: normalizeWaId(account.display_phone_number ?? account.phone_number_id),
    message_id: status.messageId,
    message_type: "status",
    metadata: status.metadata ?? {},
    provider_conversation_id: status.providerConversationId ?? null,
    provider_pricing: status.providerPricing ?? {},
    raw_payload: status.rawPayload,
    sent_at: status.sentAt,
    status: status.status,
    to_wa_id: recipientWaId,
  });

  if (insertError) {
    throw new Error(`[whatsapp] status insert failed: ${insertError.message}`);
  }

  await touchConversation(conversation.id, "outbound", status.preview, status.sentAt);
}

async function enqueueConversationTask(
  conversation: ConversationRow,
  message: MessageRow,
): Promise<string | null> {
  if (!supabaseAdmin) return null;

  const logConversationTaskRequested = async (taskId: string, params: Record<string, unknown>) => {
    await logSystemEvent({
      eventName: "agent_action_requested",
      actorId: "whatsapp-cloud",
      actorName: "WhatsApp Cloud API",
      actorType: "system",
      clientSlug: conversation.client_slug,
      entityType: "agent_task",
      entityId: taskId,
      visibility: "admin_only",
      source: "webhook",
      summary: `Queued WhatsApp triage task for conversation ${conversation.id}`,
      detail: "Customer WhatsApp traffic queued a triage task for the Discord-first control plane.",
      metadata: {
        action: "triage-conversation",
        conversationId: conversation.id,
        discordChannelName: conversation.discord_channel_name,
        fromAgent: "whatsapp-cloud",
        messageId: message.message_id,
        params,
        taskId,
        tier: "green",
        toAgent: conversation.agent_key || WHATSAPP_AGENT_KEY,
      },
    });
  };

  const { data: existingRows, error: fetchError } = await supabaseAdmin
    .from("agent_tasks")
    .select("id, status, params, created_at")
    .eq("from_agent", "whatsapp-cloud")
    .eq("action", "triage-conversation")
    .in("status", ["pending", "running"])
    .contains("params", { conversationId: conversation.id })
    .order("created_at", { ascending: true });

  if (fetchError) {
    console.error("[whatsapp] task lookup failed:", fetchError.message);
    return null;
  }

  const plan = planConversationTaskEnqueue(
    conversation.id,
    message.message_id,
    conversation.discord_channel_name,
    (existingRows ?? []) as OpenConversationTaskRow[],
  );

  if (plan.supersededTaskIds.length > 0) {
    const { error: supersedeError } = await supabaseAdmin
      .from("agent_tasks")
      .update({
        completed_at: new Date().toISOString(),
        result: {
          coalesced: true,
          text: `Superseded by ${plan.taskId}`,
        },
        status: "completed",
      })
      .in("id", plan.supersededTaskIds)
      .eq("status", "pending");

    if (supersedeError) {
      console.error("[whatsapp] task coalesce failed:", supersedeError.message);
    }
  }

  if (plan.kind === "noop") {
    return plan.taskId;
  }

  if (plan.kind === "update") {
    const { data: updatedTask, error: updateError } = await supabaseAdmin
      .from("agent_tasks")
      .update({
        params: plan.params,
        tier: "green",
        to_agent: conversation.agent_key || WHATSAPP_AGENT_KEY,
      })
      .eq("id", plan.taskId)
      .eq("status", "pending")
      .select("id")
      .maybeSingle();

    if (updateError) {
      console.error("[whatsapp] task update failed:", updateError.message);
      return null;
    }

    if (updatedTask) {
      await logConversationTaskRequested(plan.taskId, plan.params);
      return plan.taskId;
    }
  }

  const { error } = await supabaseAdmin.from("agent_tasks").upsert(
    {
      action: "triage-conversation",
      from_agent: "whatsapp-cloud",
      id: plan.taskId,
      params: plan.params,
      status: "pending",
      tier: "green",
      to_agent: conversation.agent_key || WHATSAPP_AGENT_KEY,
    },
    { onConflict: "id" },
  );

  if (error) {
    console.error("[whatsapp] task enqueue failed:", error.message);
    return null;
  }

  await logConversationTaskRequested(plan.taskId, plan.params);

  return plan.taskId;
}

function taskMessageId(value: OpenConversationTaskRow): string | null {
  const params = value.params && typeof value.params === "object" ? value.params : null;
  const messageId = params && typeof params.messageId === "string" ? params.messageId : null;
  return messageId;
}

function buildConversationTaskParams(
  conversationId: string,
  messageId: string,
  discordChannelName: string | null,
  existingParams?: Record<string, unknown> | null,
): Record<string, unknown> {
  return {
    ...(existingParams ?? {}),
    conversationId,
    discordChannelName,
    messageId,
  };
}

export function planConversationTaskEnqueue(
  conversationId: string,
  messageId: string,
  discordChannelName: string | null,
  existingTasks: OpenConversationTaskRow[],
): ConversationTaskPlan {
  const pendingTasks = existingTasks.filter((task) => task.status === "pending");
  const matchingTask =
    existingTasks.find((task) => taskMessageId(task) === messageId && task.status === "running") ??
    pendingTasks.find((task) => taskMessageId(task) === messageId) ??
    null;

  if (matchingTask) {
    const supersededTaskIds = pendingTasks
      .filter((task) => task.id !== matchingTask.id)
      .map((task) => task.id);

    if (matchingTask.status === "pending") {
      return {
        kind: "update",
        params: buildConversationTaskParams(
          conversationId,
          messageId,
          discordChannelName,
          matchingTask.params,
        ),
        supersededTaskIds,
        taskId: matchingTask.id,
      };
    }

    return {
      kind: "noop",
      params: buildConversationTaskParams(conversationId, messageId, discordChannelName, matchingTask.params),
      supersededTaskIds,
      taskId: matchingTask.id,
    };
  }

  if (pendingTasks.length > 0) {
    const [primaryPending, ...extraPending] = pendingTasks;
    return {
      kind: "update",
      params: buildConversationTaskParams(
        conversationId,
        messageId,
        discordChannelName,
        primaryPending.params,
      ),
      supersededTaskIds: extraPending.map((task) => task.id),
      taskId: primaryPending.id,
    };
  }

  return {
    kind: "insert",
    params: buildConversationTaskParams(conversationId, messageId, discordChannelName),
    supersededTaskIds: [],
    taskId: `whatsapp_${messageId}`,
  };
}

function toNormalizedMetaInboundMessage(message: MetaWebhookMessage, account: AccountRow): NormalizedInboundMessage | null {
  if (!message.id) return null;

  const preview = buildWhatsAppMessagePreview(message);
  return {
    contextMessageId: message.context?.id ?? null,
    fromWaId: normalizeWaId(message.from),
    messageId: message.id,
    messageType: message.type ?? "unknown",
    preview,
    rawPayload: message,
    receivedAt: toIsoTimestamp(message.timestamp),
    status: "received",
    textBody: getTextFromMessage(message) ?? preview,
    toWaId: normalizeWaId(account.display_phone_number ?? account.phone_number_id),
  };
}

function toNormalizedMetaStatus(status: MetaWebhookStatus): NormalizedMessageStatus | null {
  if (!status.id) return null;

  const statusValue = status.status ?? "sent";
  return {
    errorMessage: status.errors?.length ? JSON.stringify(status.errors) : null,
    messageId: status.id,
    metadata: {
      last_status: statusValue,
      last_status_payload: status,
      provider: "meta-cloud",
    },
    preview: `[status] ${statusValue}`,
    providerConversationId: status.conversation?.id ?? null,
    providerPricing: status.pricing ?? {},
    rawPayload: status,
    recipientWaId: normalizeWaId(status.recipient_id),
    sentAt: toIsoTimestamp(status.timestamp),
    status: statusValue,
  };
}

async function logInboundMessageEvent(
  transport: WhatsAppTransport,
  conversation: ConversationRow,
  contact: ContactRow,
  message: NormalizedInboundMessage,
  metadata: Record<string, unknown>,
): Promise<void> {
  try {
    await logSystemEvent({
      ...getSystemActor(transport),
      clientSlug: conversation.client_slug,
      detail: message.preview,
      entityId: conversation.id,
      entityType: "whatsapp_conversation",
      eventName: "whatsapp_message_received",
      metadata: {
        ...metadata,
        contactName: contact.profile_name,
        fromWaId: message.fromWaId,
        messageId: message.messageId,
        mode: conversation.mode,
      },
      summary: `WhatsApp message received from ${contact.profile_name ?? message.fromWaId ?? "unknown"}.`,
      visibility: "admin_only",
    });
  } catch (error) {
    const messageText = error instanceof Error ? error.message : String(error);
    console.error("[whatsapp] system event log failed:", messageText);
  }
}

export async function ingestWhatsAppWebhook(
  payload: WhatsAppWebhookPayload,
): Promise<IngestWhatsAppWebhookResult> {
  if (!supabaseAdmin) {
    throw new Error("Database not configured. Set SUPABASE_SERVICE_ROLE_KEY.");
  }

  const batches = extractWhatsAppWebhookBatches(payload);
  let processedMessages = 0;
  let processedStatuses = 0;
  const taskIds: string[] = [];

  for (const batch of batches) {
    const account = await ensureAccount({
      businessDisplayName: batch.displayPhoneNumber,
      displayPhoneNumber: batch.displayPhoneNumber,
      phoneNumberId: batch.phoneNumberId,
      transport: "meta-cloud",
      wabaId: batch.wabaId,
    });

    for (const message of batch.messages) {
      const waId = normalizeWaId(message.from);
      if (!waId || !message.id) continue;

      const normalized = toNormalizedMetaInboundMessage(message, account);
      if (!normalized) continue;

      const contact = await ensureContact(waId, batch.contacts.get(waId)?.profile?.name ?? null);
      const conversation = await ensureConversation(account, contact);
      const persistedMessage = await upsertInboundMessage(account, contact, conversation, normalized);

      await logInboundMessageEvent("meta-cloud", conversation, contact, normalized, {
        phoneNumberId: batch.phoneNumberId,
        provider: "meta-cloud",
      });

      const taskId = await enqueueConversationTask(conversation, persistedMessage);
      if (taskId) taskIds.push(taskId);
      processedMessages += 1;
    }

    for (const status of batch.statuses) {
      const normalizedStatus = toNormalizedMetaStatus(status);
      if (!normalizedStatus) continue;
      await applyStatusUpdate(account, normalizedStatus);
      processedStatuses += 1;
    }
  }

  return { processedMessages, processedStatuses, taskIds };
}

function buildTwilioErrorMessage(raw: Record<string, string>): string | null {
  const code = raw.ErrorCode?.trim();
  const message = raw.ErrorMessage?.trim() || raw.ChannelStatusMessage?.trim();

  if (code && message) return `${code}: ${message}`;
  if (code) return code;
  return message || null;
}

function buildTwilioAccountAddress(payload: TwilioWebhookPayload): string | null {
  return normalizeWhatsAppAddress(isTwilioInboundMessage(payload) ? payload.to : payload.from);
}

function buildTwilioInboundMessage(
  payload: TwilioWebhookPayload,
  account: AccountRow,
): NormalizedInboundMessage | null {
  if (!payload.messageSid) return null;

  const preview = buildTwilioMessagePreview(payload);
  const receivedAt = new Date().toISOString();
  return {
    fromWaId: normalizeWaId(payload.waId ?? payload.from),
    messageId: payload.messageSid,
    messageType: (payload.mediaCount ?? 0) > 0 ? "media" : "text",
    preview,
    profileName: payload.profileName ?? null,
    rawPayload: payload.raw,
    receivedAt,
    status: "received",
    textBody: payload.body ?? preview,
    toWaId: normalizeWaId(account.display_phone_number ?? account.phone_number_id),
  };
}

function buildTwilioStatus(payload: TwilioWebhookPayload): NormalizedMessageStatus | null {
  if (!payload.messageSid || !payload.messageStatus) return null;

  return {
    errorMessage: buildTwilioErrorMessage(payload.raw),
    messageId: payload.messageSid,
    metadata: {
      last_status: payload.messageStatus,
      last_status_payload: payload.raw,
      provider: "twilio",
    },
    preview: `[status] ${payload.messageStatus}`,
    providerConversationId: payload.raw.ConversationSid ?? null,
    providerPricing: {},
    rawPayload: payload.raw,
    recipientWaId: normalizeWaId(payload.to),
    sentAt: new Date().toISOString(),
    status: payload.messageStatus,
  };
}

function isEvolutionInboundMessage(payload: EvolutionWebhookPayload): boolean {
  return Boolean(
    normalizeEvolutionEventName(payload.event) === "messages.upsert" &&
      payload.data?.key?.id &&
      payload.data?.key?.remoteJid &&
      payload.data?.key?.fromMe === false,
  );
}

function toEvolutionTimestamp(payload: EvolutionWebhookPayload): string | null {
  const timestamp = payload.data?.messageTimestamp;
  if (typeof timestamp === "number" && Number.isFinite(timestamp) && timestamp > 0) {
    return new Date(timestamp * 1000).toISOString();
  }

  if (typeof timestamp === "string" && timestamp.trim().length > 0) {
    const numeric = Number(timestamp);
    if (Number.isFinite(numeric) && numeric > 0) {
      return new Date(numeric * 1000).toISOString();
    }

    const parsed = new Date(timestamp);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  if (payload.date_time) {
    const parsed = new Date(payload.date_time);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return new Date().toISOString();
}

function buildEvolutionInboundMessage(
  payload: EvolutionWebhookPayload,
  account: AccountRow,
): NormalizedInboundMessage | null {
  const key = payload.data?.key;
  const remoteJid = key?.remoteJid ?? null;
  const messageId = key?.id ?? null;
  if (!remoteJid || !messageId) return null;

  const chatKind = toConversationChatKind(remoteJid);
  const participantJid = chatKind === "group" ? key?.participant ?? null : null;
  const participantWaId = participantJid ? normalizeEvolutionAddress(participantJid) : null;
  const preview = buildEvolutionMessagePreview(payload);
  const message = evolutionMessageRecord(payload);
  const extended = parseMetadataRecord(message.extendedTextMessage);
  const contextInfo = {
    ...parseMetadataRecord(payload.data?.contextInfo),
    ...parseMetadataRecord(extended.contextInfo),
  };
  const mentionedJids = parseMetadataStringArray(contextInfo.mentionedJid);
  const mentionedWaIds = mentionedJids
    .map((jid) => normalizeEvolutionAddress(jid))
    .filter((value): value is string => Boolean(value));

  return {
    contextMessageId:
      typeof contextInfo.stanzaId === "string" && contextInfo.stanzaId.trim().length > 0
        ? contextInfo.stanzaId.trim()
        : null,
    fromWaId:
      chatKind === "group"
        ? participantWaId ?? normalizeEvolutionAddress(remoteJid)
        : normalizeEvolutionAddress(remoteJid),
    metadata: {
      chatKind,
      mentionedJids,
      mentionedWaIds,
      participantJid,
      participantName: chatKind === "group" ? payload.data?.pushName ?? null : null,
      participantWaId,
      provider: "evolution",
      providerStatus: payload.data?.status ?? null,
      remoteJid,
    },
    messageId,
    messageType: payload.data?.messageType ?? "conversation",
    preview,
    profileName: payload.data?.pushName ?? null,
    rawPayload: payload,
    receivedAt: toEvolutionTimestamp(payload),
    status: normalizeInboundMessageStatus(payload.data?.status),
    textBody: getEvolutionMessageText(payload) ?? preview,
    toWaId: normalizeEvolutionAddress(account.display_phone_number ?? account.phone_number_id),
  };
}

async function upsertEvolutionGroupRecord(account: AccountRow, payload: EvolutionWebhookPayload): Promise<void> {
  const eventName = normalizeEvolutionEventName(payload.event);
  if (eventName !== "groups.upsert" && eventName !== "group.update") {
    return;
  }

  const data = parseMetadataRecord(payload.data);
  const groupJid =
    (typeof data.id === "string" && data.id.endsWith("@g.us") ? data.id : null) ??
    (typeof data.groupJid === "string" && data.groupJid.endsWith("@g.us") ? data.groupJid : null);
  if (!groupJid) return;

  const subject =
    typeof data.subject === "string" && data.subject.trim().length > 0 ? data.subject.trim() : groupJid;
  const contact = await ensureContact(groupJid, subject);
  await ensureConversation(account, contact);
}

export async function ingestEvolutionWebhook(
  payload: EvolutionWebhookPayload,
): Promise<IngestWhatsAppWebhookResult> {
  if (!supabaseAdmin) {
    throw new Error("Database not configured. Set SUPABASE_SERVICE_ROLE_KEY.");
  }

  const instanceName = payload.instance?.trim();
  if (!instanceName) {
    throw new Error("Evolution webhook is missing the instance name.");
  }

  const account = await ensureAccount({
    businessDisplayName: instanceName,
    displayPhoneNumber: normalizeEvolutionAddress(payload.sender) ?? payload.sender ?? instanceName,
    metadata: {
      evolutionInstanceName: instanceName,
      evolutionSenderJid: payload.sender ?? null,
    },
    phoneNumberId: normalizeEvolutionAccountKey(instanceName),
    transport: "evolution",
  });

  await upsertEvolutionGroupRecord(account, payload);

  let processedMessages = 0;
  const taskIds: string[] = [];

  if (!isEvolutionInboundMessage(payload)) {
    return {
      processedMessages,
      processedStatuses: 0,
      taskIds,
    };
  }

  const remoteJid = payload.data?.key?.remoteJid ?? null;
  const contactWaId = normalizeEvolutionAddress(remoteJid);
  if (!remoteJid || !contactWaId) {
    throw new Error("Evolution webhook is missing the conversation target.");
  }

  const normalized = buildEvolutionInboundMessage(payload, account);
  if (!normalized) {
    return {
      processedMessages,
      processedStatuses: 0,
      taskIds,
    };
  }

  const contactLabel =
    isGroupJid(remoteJid)
      ? (payload.data?.subject?.trim() || remoteJid)
      : (payload.data?.pushName?.trim() || contactWaId);
  const contact = await ensureContact(contactWaId, contactLabel);
  const conversation = await ensureConversation(account, contact);
  const persistedMessage = await upsertInboundMessage(account, contact, conversation, normalized);
  await maybeSendAutomaticInboundFeedback(account, contact, conversation, normalized);

  await logInboundMessageEvent("evolution", conversation, contact, normalized, {
    instanceName,
    phoneNumberId: account.phone_number_id,
    provider: "evolution",
    remoteJid,
  });

  const taskId = await enqueueConversationTask(conversation, persistedMessage);
  if (taskId) taskIds.push(taskId);
  processedMessages += 1;

  return {
    processedMessages,
    processedStatuses: 0,
    taskIds,
  };
}

export async function ingestTwilioWebhook(
  params: URLSearchParams,
): Promise<IngestWhatsAppWebhookResult> {
  if (!supabaseAdmin) {
    throw new Error("Database not configured. Set SUPABASE_SERVICE_ROLE_KEY.");
  }

  const payload = parseTwilioWebhookPayload(params);
  const accountAddress = buildTwilioAccountAddress(payload);
  const accountKey = normalizeDigits(accountAddress);

  if (!accountAddress || !accountKey) {
    throw new Error("Twilio webhook is missing the Outlet WhatsApp sender number.");
  }

  const account = await ensureAccount({
    businessDisplayName: "Twilio WhatsApp",
    displayPhoneNumber: accountAddress,
    metadata: {
      twilioAccountSid: payload.accountSid,
      twilioFrom: accountAddress,
    },
    phoneNumberId: accountKey,
    transport: "twilio",
  });

  let processedMessages = 0;
  let processedStatuses = 0;
  const taskIds: string[] = [];

  if (isTwilioInboundMessage(payload)) {
    const waId = normalizeWaId(payload.waId ?? payload.from);
    const normalized = buildTwilioInboundMessage(payload, account);

    if (waId && normalized) {
      const contact = await ensureContact(waId, payload.profileName ?? null);
      const conversation = await ensureConversation(account, contact);
      const persistedMessage = await upsertInboundMessage(account, contact, conversation, normalized);
      await maybeSendAutomaticInboundFeedback(account, contact, conversation, normalized);

      await logInboundMessageEvent("twilio", conversation, contact, normalized, {
        phoneNumberId: account.phone_number_id,
        provider: "twilio",
        twilioAccountSid: payload.accountSid,
      });

      const taskId = await enqueueConversationTask(conversation, persistedMessage);
      if (taskId) taskIds.push(taskId);
      processedMessages += 1;
    }
  } else {
    const normalizedStatus = buildTwilioStatus(payload);
    if (normalizedStatus) {
      await applyStatusUpdate(account, normalizedStatus);
      processedStatuses += 1;
    }
  }

  return { processedMessages, processedStatuses, taskIds };
}

interface SendContext {
  account: AccountRow;
  conversation: ConversationRow | null;
  contact: ContactRow | null;
  phoneNumberId: string;
  toWaId: string;
}

async function resolveSendContext(input: SendWhatsAppTextMessageInput): Promise<SendContext> {
  if (!supabaseAdmin) {
    throw new Error("Database not configured. Set SUPABASE_SERVICE_ROLE_KEY.");
  }

  if (input.conversationId) {
    const { data, error } = await supabaseAdmin
      .from("whatsapp_conversations")
      .select(
        `
          id,
          agent_key,
          client_slug,
          discord_channel_name,
          discord_thread_id,
          mode,
          status,
          whatsapp_accounts!inner (
            id,
            business_display_name,
            default_agent_key,
            default_client_slug,
            default_discord_channel,
            display_phone_number,
            metadata,
            mode,
            phone_number_id
          ),
          whatsapp_contacts!inner (
            client_slug,
            id,
            profile_name,
            wa_id
          )
        `,
      )
      .eq("id", input.conversationId)
      .single();

    if (error || !data) {
      throw new Error(`[whatsapp] conversation lookup failed: ${error?.message ?? "not found"}`);
    }

    return {
      account: firstJoinedRow(data.whatsapp_accounts) as unknown as AccountRow,
      contact: firstJoinedRow(data.whatsapp_contacts) as unknown as ContactRow,
      conversation: {
        agent_key: data.agent_key as string,
        client_slug: data.client_slug as string | null,
        discord_channel_name: data.discord_channel_name as string | null,
        discord_thread_id: data.discord_thread_id as string | null,
        id: data.id as string,
        mode: data.mode as string,
        status: data.status as string,
      },
      phoneNumberId: (firstJoinedRow(data.whatsapp_accounts).phone_number_id as string) ?? "",
      toWaId: (firstJoinedRow(data.whatsapp_contacts).wa_id as string) ?? "",
    };
  }

  const toWaId = normalizeWaId(input.toWaId);
  const phoneNumberId = input.phoneNumberId?.trim();
  if (!toWaId || !phoneNumberId) {
    throw new Error("Either conversationId or both phoneNumberId and toWaId are required.");
  }

  const { data: account, error } = await supabaseAdmin
    .from("whatsapp_accounts")
    .select(
      "id, business_display_name, default_agent_key, default_client_slug, default_discord_channel, display_phone_number, metadata, mode, phone_number_id, waba_id",
    )
    .eq("phone_number_id", phoneNumberId)
    .single();

  if (error || !account) {
    throw new Error(`[whatsapp] account lookup failed: ${error?.message ?? "not found"}`);
  }

  const contact = await ensureContact(toWaId, undefined);
  const conversation = await ensureConversation(account as AccountRow, contact);

  return {
    account: account as AccountRow,
    contact,
    conversation,
    phoneNumberId,
    toWaId,
  };
}

function assertConversationSendMode(context: SendContext, input: SendWhatsAppTextMessageInput): void {
  const mode = context.conversation?.mode;
  if (!mode) return;

  if (mode === "shadow" || mode === "draft_only") {
    throw new Error(`WhatsApp conversation ${context.conversation?.id} is in ${mode} mode; outbound send blocked.`);
  }

  if (mode === "assisted" && !input.approved) {
    throw new Error(
      `WhatsApp conversation ${context.conversation?.id} is in assisted mode; outbound send requires approved=true.`,
    );
  }
}

function getTwilioStatusCallbackUrl(): string | null {
  const explicit = process.env.TWILIO_WHATSAPP_STATUS_CALLBACK_URL?.trim();
  if (explicit) return explicit;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!appUrl) return null;
  return new URL("/api/whatsapp/twilio/status", appUrl).toString();
}

function getEvolutionApiUrl(): string {
  const url = process.env.EVOLUTION_API_URL?.trim();
  if (!url) {
    throw new Error("EVOLUTION_API_URL is not configured.");
  }
  return url.replace(/\/$/, "");
}

function getEvolutionInstanceName(account: AccountRow, fallbackPhoneNumberId?: string | null): string {
  const fromMetadata =
    typeof account.metadata?.evolutionInstanceName === "string"
      ? account.metadata.evolutionInstanceName.trim()
      : "";
  if (fromMetadata) return fromMetadata;

  const candidates = [fallbackPhoneNumberId, account.phone_number_id];
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (candidate.startsWith("evolution:")) {
      return candidate.replace(/^evolution:/, "");
    }
  }

  const configured = process.env.EVOLUTION_INSTANCE_NAME?.trim();
  if (configured) return configured;

  throw new Error("Evolution instance name is not configured for this WhatsApp account.");
}

async function sendTwilioTypingIndicator(
  account: AccountRow,
  inboundMessageId: string,
): Promise<void> {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const accountSid =
    (typeof account.metadata?.twilioAccountSid === "string"
      ? account.metadata.twilioAccountSid
      : null) ??
    process.env.TWILIO_ACCOUNT_SID;

  if (!accountSid || !authToken || !inboundMessageId) {
    return;
  }

  const payload = new URLSearchParams({
    channel: "whatsapp",
    messageId: inboundMessageId,
  });

  const response = await fetch("https://messaging.twilio.com/v2/Indicators/Typing.json", {
    body: payload.toString(),
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  if (!response.ok) {
    const result = (await response.text().catch(() => "")) || `HTTP ${response.status}`;
    throw new Error(`Twilio typing indicator failed: ${result}`);
  }
}

async function maybeSendAutomaticInboundFeedback(
  account: AccountRow,
  contact: ContactRow,
  conversation: ConversationRow,
  message: NormalizedInboundMessage,
): Promise<void> {
  const accessStatus = parseConversationAccessStatus(conversation.metadata);
  const chatKind = parseConversationChatKind(conversation.metadata);

  if (!shouldAutoAcknowledgeWhatsAppInbound({
    accessStatus,
    chatKind,
    lastOutboundMessageAt: conversation.last_outbound_message_at ?? null,
    messageMetadata: message.metadata ?? null,
    mode: conversation.mode,
    textBody: message.textBody,
    waId: contact.wa_id,
  })) {
    return;
  }

  if (shouldUseTwilioTypingIndicator()) {
    try {
      await sendTwilioTypingIndicator(account, message.messageId);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      console.warn("[whatsapp] typing indicator failed:", detail);
    }
  }

  const delayMs = autoAckDelayMs();
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  try {
    await sendWhatsAppTextMessage({
      approved: true,
      body: buildAutomaticAckText(),
      conversationId: conversation.id,
      replyToMessageId: message.messageId,
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.warn("[whatsapp] automatic ack failed:", detail);
  }
}

async function sendMetaCloudTextMessage(
  context: SendContext,
  input: SendWhatsAppTextMessageInput,
  body: string,
): Promise<{ messageId: string; rawPayload: unknown; sentAt: string; status: string }> {
  const token = process.env.WHATSAPP_CLOUD_API_TOKEN;
  if (!token) {
    throw new Error("WHATSAPP_CLOUD_API_TOKEN is not configured.");
  }

  const payload: Record<string, unknown> = {
    messaging_product: "whatsapp",
    preview_url: input.previewUrl ?? false,
    recipient_type: "individual",
    text: {
      body,
    },
    to: context.toWaId,
    type: "text",
  };

  if (input.replyToMessageId) {
    payload.context = {
      message_id: input.replyToMessageId,
    };
  }

  const response = await fetch(
    `https://graph.facebook.com/${WHATSAPP_GRAPH_API_VERSION}/${context.phoneNumberId}/messages`,
    {
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );

  const result = (await response.json().catch(() => null)) as
    | {
        error?: {
          message?: string;
        };
        messages?: Array<{
          id?: string;
        }>;
      }
    | null;

  if (!response.ok) {
    throw new Error(result?.error?.message ?? `WhatsApp API request failed (${response.status})`);
  }

  const messageId = result?.messages?.[0]?.id;
  if (!messageId) {
    throw new Error("WhatsApp API response did not include a message id.");
  }

  return {
    messageId,
    rawPayload: {
      request: payload,
      response: result,
      transport: "meta-cloud",
    },
    sentAt: new Date().toISOString(),
    status: "sent",
  };
}

async function sendTwilioTextMessage(
  context: SendContext,
  input: SendWhatsAppTextMessageInput,
  body: string,
): Promise<{ messageId: string; rawPayload: unknown; sentAt: string; status: string }> {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const accountSid =
    (typeof context.account.metadata?.twilioAccountSid === "string"
      ? context.account.metadata.twilioAccountSid
      : null) ??
    process.env.TWILIO_ACCOUNT_SID;

  if (!accountSid || !authToken) {
    throw new Error("TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are required for Twilio WhatsApp sends.");
  }

  const fromAddress =
    (typeof context.account.metadata?.twilioFrom === "string"
      ? context.account.metadata.twilioFrom
      : null) ??
    context.account.display_phone_number ??
    process.env.TWILIO_WHATSAPP_FROM ??
    context.account.phone_number_id;

  const payload = new URLSearchParams({
    Body: body,
    From: toWhatsAppAddress(fromAddress),
    To: toWhatsAppAddress(context.toWaId),
  });

  const statusCallbackUrl = getTwilioStatusCallbackUrl();
  if (statusCallbackUrl) {
    payload.set("StatusCallback", statusCallbackUrl);
  }

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    body: payload.toString(),
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  const result = (await response.json().catch(() => null)) as
    | {
        code?: number;
        message?: string;
        sid?: string;
        status?: string;
      }
    | null;

  if (!response.ok) {
    throw new Error(result?.message ?? `Twilio WhatsApp request failed (${response.status})`);
  }

  const messageId = result?.sid;
  if (!messageId) {
    throw new Error("Twilio WhatsApp response did not include a message sid.");
  }

  return {
    messageId,
    rawPayload: {
      request: Object.fromEntries(payload.entries()),
      response: result,
      transport: "twilio",
    },
    sentAt: new Date().toISOString(),
    status: result?.status ?? "queued",
  };
}

async function sendEvolutionTextMessage(
  context: SendContext,
  input: SendWhatsAppTextMessageInput,
  body: string,
): Promise<{ messageId: string; rawPayload: unknown; sentAt: string; status: string }> {
  const apiKey = process.env.EVOLUTION_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("EVOLUTION_API_KEY is not configured.");
  }

  const instanceName = getEvolutionInstanceName(context.account, input.phoneNumberId ?? null);
  const payload: Record<string, unknown> = {
    delay: autoAckDelayMs(),
    linkPreview: input.previewUrl ?? false,
    number: context.toWaId,
    text: body,
  };

  const response = await fetch(`${getEvolutionApiUrl()}/message/sendText/${instanceName}`, {
    body: JSON.stringify(payload),
    headers: {
      apikey: apiKey,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const result = (await response.json().catch(() => null)) as
    | {
        key?: {
          id?: string;
          remoteJid?: string;
        };
        messageTimestamp?: number | string;
        status?: string;
      }
    | null;

  if (!response.ok) {
    throw new Error(`Evolution WhatsApp request failed (${response.status})`);
  }

  const messageId = result?.key?.id;
  if (!messageId) {
    throw new Error("Evolution WhatsApp response did not include a message id.");
  }

  return {
    messageId,
    rawPayload: {
      request: payload,
      response: result,
      transport: "evolution",
    },
    sentAt:
      typeof result?.messageTimestamp === "string" || typeof result?.messageTimestamp === "number"
        ? toEvolutionTimestamp({
            data: {
              messageTimestamp: result.messageTimestamp,
            },
          }) ?? new Date().toISOString()
        : new Date().toISOString(),
    status: normalizeOutboundMessageStatus(result?.status),
  };
}

export async function sendWhatsAppTextMessage(input: SendWhatsAppTextMessageInput): Promise<{
  conversationId: string | null;
  messageId: string;
}> {
  const context = await resolveSendContext(input);
  assertConversationSendMode(context, input);

  const body = input.body.trim();
  if (!body) {
    throw new Error("WhatsApp message body cannot be empty.");
  }
  const transport = getAccountTransport(context.account);
  const sent =
    transport === "twilio"
      ? await sendTwilioTextMessage(context, input, body)
      : transport === "evolution"
        ? await sendEvolutionTextMessage(context, input, body)
        : await sendMetaCloudTextMessage(context, input, body);

  if (supabaseAdmin) {
    const { error: insertError } = await supabaseAdmin.from("whatsapp_messages").insert({
      account_id: context.account.id,
      contact_id: context.contact?.id ?? null,
      context_message_id: input.replyToMessageId ?? null,
      conversation_id: context.conversation?.id ?? null,
      direction: "outbound",
      from_wa_id: normalizeWaId(context.account.display_phone_number ?? context.account.phone_number_id),
      message_id: sent.messageId,
      message_type: "text",
      metadata: {
        approved: input.approved ?? false,
        providerStatus: sent.status,
        transport,
      },
      raw_payload: sent.rawPayload,
      sent_at: sent.sentAt,
      status: normalizeOutboundMessageStatus(sent.status),
      text_body: body,
      to_wa_id: context.toWaId,
    });

    if (insertError) {
      throw new Error(`[whatsapp] outbound message insert failed: ${insertError.message}`);
    }

    if (context.conversation) {
      await touchConversation(context.conversation.id, "outbound", body, sent.sentAt);
      await logSystemEvent({
        ...getSystemActor(transport),
        clientSlug: context.conversation.client_slug,
        detail: body,
        entityId: context.conversation.id,
        entityType: "whatsapp_conversation",
        eventName: "whatsapp_message_sent",
        metadata: {
          messageId: sent.messageId,
          phoneNumberId: context.phoneNumberId,
          transport,
          toWaId: context.toWaId,
        },
        summary: `WhatsApp message sent to ${context.contact?.profile_name ?? context.toWaId}.`,
        visibility: "admin_only",
      });
    }
  }

  return {
    conversationId: context.conversation?.id ?? null,
    messageId: sent.messageId,
  };
}
