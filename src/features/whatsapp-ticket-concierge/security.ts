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

const DEFAULT_TAMPER_THRESHOLD = 3;

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
  const banned = Boolean(row && row.strike_count >= DEFAULT_TAMPER_THRESHOLD);
  return {
    allowed: !banned,
    banned,
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
      strike_count: DEFAULT_TAMPER_THRESHOLD,
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

  const threshold = input.threshold ?? DEFAULT_TAMPER_THRESHOLD;
  const { data, error } = await db.rpc("record_whatsapp_ticket_concierge_tamper_strike", {
    p_conversation_id: input.conversationId,
    p_last_inbound_message_id: input.lastInboundMessageId ?? null,
    p_reason: input.reason,
    p_threshold: threshold,
    p_wa_id: input.waId,
  });

  if (error) {
    throw new Error(`[concierge] strike upsert failed: ${error.message}`);
  }

  const row = Array.isArray(data) ? data[0] ?? null : data;
  return {
    banned: row?.banned ?? false,
    reason: row?.reason ?? input.reason,
    strikeCount: row?.strike_count ?? 0,
    waId: row?.wa_id ?? input.waId,
  };
}

export type { SecurityDispositionInput, TamperStrikeInput, BanInput };
