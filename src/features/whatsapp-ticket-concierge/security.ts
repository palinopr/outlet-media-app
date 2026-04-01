import { supabaseAdmin } from "@/lib/supabase";

interface SecurityDispositionInput {
  conversationId: string;
  waId: string;
}

interface TamperStrikeInput extends SecurityDispositionInput {
  lastInboundMessageId?: string | null;
  reason:
    | "stale_option_replay"
    | "forged_option_id"
    | "rapid_fire_retry"
    | "expired_selection_reuse"
    | "other";
  threshold?: number;
}

interface BanInput extends SecurityDispositionInput {
  lastInboundMessageId?: string | null;
  reason: string;
}

export interface TicketConciergeSecurityDisposition {
  allowed: boolean;
  banned: boolean;
}

export interface TicketConciergeTamperStrikeResult {
  banned: boolean;
  strikeCount: number;
  reason: string;
  waId: string;
}

const COUNTABLE_TAMPER_REASONS = new Set<TamperStrikeInput["reason"]>([
  "stale_option_replay",
  "forged_option_id",
  "rapid_fire_retry",
  "expired_selection_reuse",
]);

function requireSupabaseAdmin() {
  if (!supabaseAdmin) {
    throw new Error("Database not configured. Set SUPABASE_SERVICE_ROLE_KEY.");
  }

  return supabaseAdmin;
}

async function loadBanRow(waId: string) {
  const db = requireSupabaseAdmin();
  const { data, error } = await db
    .from("whatsapp_ticket_concierge_bans")
    .select("banned_at, conversation_id, created_at, last_inbound_message_id, reason, strike_count, updated_at, wa_id")
    .eq("wa_id", waId)
    .maybeSingle();

  if (error) {
    throw new Error(`[concierge] ban lookup failed: ${error.message}`);
  }

  return data as
    | {
        banned_at: string;
        conversation_id: string | null;
        created_at: string;
        last_inbound_message_id: string | null;
        reason: string;
        strike_count: number;
        updated_at: string;
        wa_id: string;
      }
    | null;
}

export async function getTicketConciergeSecurityDisposition(
  input: SecurityDispositionInput,
): Promise<TicketConciergeSecurityDisposition> {
  const row = await loadBanRow(input.waId);
  return {
    allowed: !row,
    banned: Boolean(row),
  };
}

export async function banTicketConciergeWaId(input: BanInput) {
  const db = requireSupabaseAdmin();
  const now = new Date().toISOString();
  const { data, error } = await db
    .from("whatsapp_ticket_concierge_bans")
    .upsert({
      banned_at: now,
      conversation_id: input.conversationId,
      created_at: now,
      last_inbound_message_id: input.lastInboundMessageId ?? null,
      reason: input.reason,
      strike_count: 3,
      updated_at: now,
      wa_id: input.waId,
    })
    .select("banned_at, conversation_id, created_at, last_inbound_message_id, reason, strike_count, updated_at, wa_id")
    .maybeSingle();

  if (error) {
    throw new Error(`[concierge] ban upsert failed: ${error.message}`);
  }

  return data;
}

export async function recordConciergeTamperStrike(input: TamperStrikeInput) {
  const db = requireSupabaseAdmin();

  if (!COUNTABLE_TAMPER_REASONS.has(input.reason)) {
    return {
      banned: false,
      reason: input.reason,
      strikeCount: 0,
      waId: input.waId,
    };
  }

  const existing = await loadBanRow(input.waId);
  const threshold = input.threshold ?? 3;
  const nextStrikeCount = (existing?.strike_count ?? 0) + 1;
  const shouldBan = nextStrikeCount >= threshold;
  const now = new Date().toISOString();

  if (shouldBan) {
    const { data, error } = await db
      .from("whatsapp_ticket_concierge_bans")
      .upsert({
        banned_at: existing?.banned_at ?? now,
        conversation_id: input.conversationId,
        created_at: existing?.created_at ?? now,
        last_inbound_message_id: input.lastInboundMessageId ?? existing?.last_inbound_message_id ?? null,
        reason: input.reason,
        strike_count: nextStrikeCount,
        updated_at: now,
        wa_id: input.waId,
      })
      .select("banned_at, conversation_id, created_at, last_inbound_message_id, reason, strike_count, updated_at, wa_id")
      .maybeSingle();

    if (error) {
      throw new Error(`[concierge] ban threshold update failed: ${error.message}`);
    }

    return {
      banned: true,
      reason: data?.reason ?? input.reason,
      strikeCount: data?.strike_count ?? nextStrikeCount,
      waId: input.waId,
    };
  }

  const { error } = await db.from("whatsapp_ticket_concierge_bans").upsert({
    banned_at: existing?.banned_at ?? now,
    conversation_id: input.conversationId,
    created_at: existing?.created_at ?? now,
    last_inbound_message_id: input.lastInboundMessageId ?? existing?.last_inbound_message_id ?? null,
    reason: input.reason,
    strike_count: nextStrikeCount,
    updated_at: now,
    wa_id: input.waId,
  });

  if (error) {
    throw new Error(`[concierge] strike upsert failed: ${error.message}`);
  }

  return {
    banned: false,
    reason: input.reason,
    strikeCount: nextStrikeCount,
    waId: input.waId,
  };
}

export type { SecurityDispositionInput, TamperStrikeInput, BanInput };
