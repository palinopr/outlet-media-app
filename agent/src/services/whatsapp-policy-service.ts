import type { Message } from "discord.js";
import { getServiceSupabase } from "./supabase-service.js";

export type WhatsAppChatKind = "direct" | "group";
export type WhatsAppGroupPolicy = "mention_only" | "silent" | "live";
export type WhatsAppAccessStatus = "pending" | "approved" | "denied";

interface ConversationMetadata {
  access?: {
    decidedAt?: string | null;
    decidedBy?: string | null;
    requestedAt?: string | null;
    status?: WhatsAppAccessStatus;
  };
  chat?: {
    company?: string | null;
    kind?: WhatsAppChatKind;
    label?: string | null;
  };
  group?: {
    policy?: WhatsAppGroupPolicy;
  };
  [key: string]: unknown;
}

export interface WhatsAppConversationPolicy {
  accessStatus: WhatsAppAccessStatus;
  approvalRequestedAt: string | null;
  chatKind: WhatsAppChatKind;
  company: string | null;
  groupPolicy: WhatsAppGroupPolicy;
  label: string | null;
  metadata: ConversationMetadata;
}

function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export interface WhatsAppConversationRecord {
  clientSlug: string | null;
  contactName: string | null;
  discordChannelName: string | null;
  discordThreadId: string | null;
  id: string;
  mode: string | null;
  policy: WhatsAppConversationPolicy;
  waId: string | null;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asConversationMetadata(value: unknown): ConversationMetadata {
  return asRecord(value) as ConversationMetadata;
}

function ownerNameFromMessage(msg: Message): string {
  return msg.member?.displayName || msg.author.globalName || msg.author.username;
}

function normalizeDigits(value: string | null | undefined): string | null {
  if (!value) return null;
  const digits = value.replace(/\D/g, "");
  return digits.length > 0 ? digits : null;
}

function approvedConversationMode(): string {
  const configured = process.env.WHATSAPP_APPROVED_CONVERSATION_MODE?.trim().toLowerCase();
  if (configured === "assisted" || configured === "live") {
    return configured;
  }
  return "live";
}

export function isOwnerWhatsAppNumber(waId: string | null | undefined): boolean {
  const normalized = normalizeDigits(waId);
  if (!normalized) return false;

  const configured = (process.env.WHATSAPP_OWNER_NUMBERS ?? "")
    .split(",")
    .map((value) => normalizeDigits(value))
    .filter((value): value is string => Boolean(value));

  return configured.includes(normalized);
}

export function parseOwnerControlMessage(text: string | null | undefined): string | null {
  const trimmed = text?.trim();
  if (!trimmed) return null;

  const match = trimmed.match(/^(?:!|\/)(boss|whatsapp)\b[:\s-]*(.*)$/i);
  if (!match) return null;

  const command = match[2]?.trim();
  return command && command.length > 0 ? command : null;
}

export function parseConversationPolicy(
  metadata: unknown,
  fallback?: {
    clientSlug?: string | null;
    contactName?: string | null;
  },
): WhatsAppConversationPolicy {
  const parsed = asConversationMetadata(metadata);
  const access = asRecord(parsed.access);
  const chat = asRecord(parsed.chat);
  const group = asRecord(parsed.group);

  const chatKind = chat.kind === "group" ? "group" : "direct";
  const groupPolicy =
    group.policy === "live" || group.policy === "silent" ? group.policy : "mention_only";
  const accessStatus =
    access.status === "approved" || access.status === "denied" ? access.status : "pending";

  return {
    accessStatus,
    approvalRequestedAt: typeof access.requestedAt === "string" ? access.requestedAt : null,
    chatKind,
    company:
      typeof chat.company === "string"
        ? chat.company
        : fallback?.clientSlug ?? null,
    groupPolicy,
    label:
      typeof chat.label === "string"
        ? chat.label
        : fallback?.contactName ?? null,
    metadata: parsed,
  };
}

export function shouldWakeApprovedGroup(
  policy: WhatsAppConversationPolicy,
  text: string | null,
  metadata?: Record<string, unknown> | null,
): boolean {
  if (policy.chatKind !== "group") return true;
  if (policy.groupPolicy === "live") return true;
  if (policy.groupPolicy === "silent") return false;

  const messageMetadata = asRecord(metadata);
  const mentionedJids = parseStringArray(messageMetadata.mentionedJids);
  const mentionedWaIds = parseStringArray(messageMetadata.mentionedWaIds);
  if (mentionedJids.length > 0 || mentionedWaIds.length > 0) {
    return true;
  }

  const body = (text ?? "").toLowerCase();
  return /@meta agent|@outlet media agent|meta agent|outlet media agent|client liaison/.test(body);
}

export async function loadConversationRecord(
  conversationId: string,
): Promise<WhatsAppConversationRecord> {
  const supabase = getServiceSupabase();
  if (!supabase) {
    throw new Error("Supabase is not configured for the agent runtime.");
  }

  const { data, error } = await supabase
    .from("whatsapp_conversations")
    .select(
      `
        id,
        client_slug,
        discord_channel_name,
        discord_thread_id,
        metadata,
        mode,
        whatsapp_contacts!inner (
          profile_name,
          wa_id
        )
      `,
    )
    .eq("id", conversationId)
    .single();

  if (error || !data) {
    throw new Error(`[whatsapp-policy] conversation lookup failed: ${error?.message ?? "not found"}`);
  }

  const contact = asRecord(Array.isArray(data.whatsapp_contacts) ? data.whatsapp_contacts[0] : data.whatsapp_contacts);
  const contactName = typeof contact.profile_name === "string" ? contact.profile_name : null;
  const clientSlug = typeof data.client_slug === "string" ? data.client_slug : null;

  return {
    clientSlug,
    contactName,
    discordChannelName: typeof data.discord_channel_name === "string" ? data.discord_channel_name : null,
    discordThreadId: typeof data.discord_thread_id === "string" ? data.discord_thread_id : null,
    id: data.id as string,
    mode: typeof data.mode === "string" ? data.mode : null,
    policy: parseConversationPolicy(data.metadata, {
      clientSlug,
      contactName,
    }),
    waId: typeof contact.wa_id === "string" ? contact.wa_id : null,
  };
}

async function updateConversationMetadata(
  conversationId: string,
  metadata: ConversationMetadata,
  options?: {
    mode?: string | null;
  },
): Promise<void> {
  const supabase = getServiceSupabase();
  if (!supabase) {
    throw new Error("Supabase is not configured for the agent runtime.");
  }

  const { error } = await supabase
    .from("whatsapp_conversations")
    .update({
      metadata,
      ...(options?.mode ? { mode: options.mode } : {}),
    })
    .eq("id", conversationId);

  if (error) {
    throw new Error(`[whatsapp-policy] conversation update failed: ${error.message}`);
  }
}

export async function requestConversationApproval(
  conversationId: string,
): Promise<WhatsAppConversationRecord> {
  const record = await loadConversationRecord(conversationId);
  if (record.policy.accessStatus === "approved" || record.policy.accessStatus === "denied") {
    return record;
  }
  if (record.policy.accessStatus === "pending" && record.policy.approvalRequestedAt) {
    return record;
  }

  const now = new Date().toISOString();
  const metadata: ConversationMetadata = {
    ...record.policy.metadata,
    access: {
      ...asRecord(record.policy.metadata.access),
      requestedAt: now,
      status: "pending",
    },
    chat: {
      ...asRecord(record.policy.metadata.chat),
      kind: record.policy.chatKind,
      company: record.policy.company,
      label: record.policy.label,
    },
    group: {
      ...asRecord(record.policy.metadata.group),
      policy: record.policy.groupPolicy,
    },
  };

  await updateConversationMetadata(conversationId, metadata);
  return await loadConversationRecord(conversationId);
}

export async function setConversationAccessStatus(
  conversationId: string,
  status: WhatsAppAccessStatus,
  actorName: string,
): Promise<WhatsAppConversationRecord> {
  const record = await loadConversationRecord(conversationId);
  const now = new Date().toISOString();

  const metadata: ConversationMetadata = {
    ...record.policy.metadata,
    access: {
      ...asRecord(record.policy.metadata.access),
      decidedAt: now,
      decidedBy: actorName,
      requestedAt: record.policy.approvalRequestedAt ?? now,
      status,
    },
    chat: {
      ...asRecord(record.policy.metadata.chat),
      kind: record.policy.chatKind,
      company: record.policy.company,
      label: record.policy.label,
    },
    group: {
      ...asRecord(record.policy.metadata.group),
      policy:
        record.policy.chatKind === "group" && status === "approved"
          ? "mention_only"
          : record.policy.groupPolicy,
    },
  };

  await updateConversationMetadata(conversationId, metadata, {
    mode: status === "approved" ? approvedConversationMode() : "shadow",
  });
  return await loadConversationRecord(conversationId);
}

export async function resolveConversationIdForMessage(
  msg: Message,
  explicitConversationId?: string,
): Promise<string | null> {
  if (explicitConversationId) return explicitConversationId;
  if (!("isThread" in msg.channel) || !msg.channel.isThread()) return null;

  const supabase = getServiceSupabase();
  if (!supabase) {
    throw new Error("Supabase is not configured for the agent runtime.");
  }

  const { data, error } = await supabase
    .from("whatsapp_conversations")
    .select("id")
    .eq("discord_thread_id", msg.channel.id)
    .maybeSingle();

  if (error) {
    throw new Error(`[whatsapp-policy] thread lookup failed: ${error.message}`);
  }

  return data?.id ?? null;
}

export function formatConversationApprovalSummary(record: WhatsAppConversationRecord): string {
  const scope = record.policy.chatKind === "group" ? "group chat" : "direct chat";
  const target = record.policy.label ?? record.contactName ?? record.waId ?? record.id;
  const company = record.policy.company ? ` (${record.policy.company})` : "";
  return `${scope}: ${target}${company}`;
}

export function actorNameForApproval(msg: Message): string {
  return ownerNameFromMessage(msg);
}
