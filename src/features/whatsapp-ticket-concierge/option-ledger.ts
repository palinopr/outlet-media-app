import { randomUUID } from "node:crypto";

import { supabaseAdmin } from "@/lib/supabase";

import type {
  TicketConciergeIntent,
  TicketConciergePreparedOption,
  TicketConciergePreparedOptionSet,
} from "./types";

interface ConciergeRunInput {
  contactId?: string | null;
  conversationId: string;
  customerMessage: string;
  eventContext: Record<string, unknown>;
  intent: TicketConciergeIntent;
  latestInboundMessageId?: string | null;
  scenarioKey: string;
}

type TicketConciergeOptionSetStatus = TicketConciergePreparedOptionSet["status"];

interface CreateOptionSetInput {
  conversationId: string;
  eventContext: Record<string, unknown>;
  intent: TicketConciergeIntent;
  options: TicketConciergePreparedOptionInput[];
  runId: string;
  status?: TicketConciergeOptionSetStatus;
}

interface TicketConciergePreparedOptionInput extends Omit<TicketConciergePreparedOption, "id"> {
  id?: string;
}

interface ReplaceActiveOptionSetInput extends CreateOptionSetInput {
  previousOptionSetId?: string | null;
}

interface CheckoutAttemptInput {
  checkoutUrl?: string | null;
  failureReason?: string | null;
  optionId: string;
  status: "pending" | "checkout_ready" | "inventory_changed" | "failed";
}

interface CheckoutAttemptRow extends CheckoutAttemptInput {
  created_at?: string;
  updated_at?: string;
}

type ActiveOptionSetRow = {
  conversation_id: string;
  created_at: string;
  expires_at: string;
  id: string;
  refresh_of_option_set_id: string | null;
  run_id: string;
  selected_option_id: string | null;
  status: TicketConciergePreparedOptionSet["status"];
  updated_at: string;
};

function requireSupabaseAdmin() {
  if (!supabaseAdmin) {
    throw new Error("Database not configured. Set SUPABASE_SERVICE_ROLE_KEY.");
  }

  return supabaseAdmin;
}

function toPreparedOption(row: TicketConciergePreparedOptionInput): TicketConciergePreparedOption {
  return {
    execution: row.execution,
    id: row.id ?? randomUUID(),
    isUnderBudget: row.isUnderBudget,
    label: row.label,
    mapSvg: row.mapSvg,
    mapToken: row.mapToken ?? randomUUID(),
    note: row.note,
    ordinal: row.ordinal,
    quantity: row.quantity,
    quoteSource: row.quoteSource,
    row: row.row ?? null,
    seatLabels: row.seatLabels,
    section: row.section,
    totalCents: row.totalCents,
  };
}

async function persistOptionSet(
  input: CreateOptionSetInput & { refreshOfOptionSetId?: string | null },
): Promise<TicketConciergePreparedOptionSet> {
  const db = requireSupabaseAdmin();
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  const optionSetId = randomUUID();
  const preparedOptions = input.options.map(toPreparedOption);

  const optionSetRow = {
    conversation_id: input.conversationId,
    created_at: now,
    expires_at: expiresAt,
    id: optionSetId,
    refresh_of_option_set_id: input.refreshOfOptionSetId ?? null,
    run_id: input.runId,
    selected_option_id: null,
    status: input.status ?? "active",
    updated_at: now,
  };

  const { error: optionSetError } = await db.from("whatsapp_ticket_concierge_option_sets").insert(
    optionSetRow,
  );
  if (optionSetError) {
    throw new Error(`[concierge] option set insert failed: ${optionSetError.message}`);
  }

  for (const option of preparedOptions) {
    const { error } = await db.from("whatsapp_ticket_concierge_options").insert({
      created_at: now,
      execution: option.execution,
      id: option.id,
      is_under_budget: option.isUnderBudget,
      label: option.label,
      map_svg: option.mapSvg,
      map_token: option.mapToken,
      note: option.note,
      option_set_id: optionSetId,
      ordinal: option.ordinal,
      quantity: option.quantity,
      quote_source: option.quoteSource,
      row: option.row,
      seat_labels: option.seatLabels,
      section: option.section,
      total_cents: option.totalCents,
    });

    if (error) {
      throw new Error(`[concierge] option insert failed: ${error.message}`);
    }
  }

  return {
    id: optionSetId,
    options: preparedOptions,
    status: optionSetRow.status,
  };
}

export async function createConciergeRun(input: ConciergeRunInput) {
  const db = requireSupabaseAdmin();
  const now = new Date().toISOString();

  const { data, error } = await db
    .from("whatsapp_ticket_concierge_runs")
    .insert({
      contact_id: input.contactId ?? null,
      conversation_id: input.conversationId,
      created_at: now,
      customer_message: input.customerMessage,
      event_context: input.eventContext,
      id: randomUUID(),
      intent: input.intent,
      latest_inbound_message_id: input.latestInboundMessageId ?? null,
      scenario_key: input.scenarioKey,
      status: "pending_options",
      updated_at: now,
    })
    .select(
      "active_option_set_id, contact_id, conversation_id, created_at, customer_message, event_context, id, intent, last_checkout_url, last_error, latest_inbound_message_id, scenario_key, status, updated_at",
    )
    .maybeSingle();

  if (error) {
    throw new Error(`[concierge] run insert failed: ${error.message}`);
  }

  return data;
}

export async function createOptionSet(input: CreateOptionSetInput) {
  return persistOptionSet(input);
}

export async function replaceActiveOptionSet(input: ReplaceActiveOptionSetInput) {
  const db = requireSupabaseAdmin();
  if (input.previousOptionSetId) {
    await db
      .from("whatsapp_ticket_concierge_option_sets")
      .update({ status: "replaced" })
      .eq("id", input.previousOptionSetId);
  }

  const created = await persistOptionSet({
    conversationId: input.conversationId,
    eventContext: input.eventContext,
    intent: input.intent,
    options: input.options,
    runId: input.runId,
    status: input.status ?? "active",
  });

  await db
    .from("whatsapp_ticket_concierge_runs")
    .update({ active_option_set_id: created.id, updated_at: new Date().toISOString() })
    .eq("id", input.runId);

  return created;
}

export async function getActiveOptionSet(conversationId: string) {
  const db = requireSupabaseAdmin();
  const { data, error } = await db
    .from("whatsapp_ticket_concierge_option_sets")
    .select(
      "conversation_id, created_at, expires_at, id, refresh_of_option_set_id, run_id, selected_option_id, status, updated_at",
    )
    .eq("conversation_id", conversationId)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    throw new Error(`[concierge] option set lookup failed: ${error.message}`);
  }

  return data as ActiveOptionSetRow | null;
}

export async function expireOptionSet(optionSetId: string) {
  const db = requireSupabaseAdmin();
  const { error } = await db
    .from("whatsapp_ticket_concierge_option_sets")
    .update({ status: "expired", updated_at: new Date().toISOString() })
    .eq("id", optionSetId);

  if (error) {
    throw new Error(`[concierge] option set expire failed: ${error.message}`);
  }
}

export async function recordCheckoutAttempt(input: CheckoutAttemptInput) {
  const db = requireSupabaseAdmin();
  const now = new Date().toISOString();
  const payload: CheckoutAttemptRow = {
    checkoutUrl: input.checkoutUrl,
    created_at: now,
    failureReason: input.failureReason,
    optionId: input.optionId,
    status: input.status,
    updated_at: now,
  };

  const { data, error } = await db
    .from("whatsapp_ticket_concierge_checkout_attempts")
    .upsert({
      checkout_url: payload.checkoutUrl ?? null,
      created_at: payload.created_at,
      failure_reason: payload.failureReason ?? null,
      option_id: payload.optionId,
      status: payload.status,
      updated_at: payload.updated_at,
    })
    .select("checkout_url, created_at, failure_reason, option_id, status, updated_at")
    .maybeSingle();

  if (error) {
    throw new Error(`[concierge] checkout attempt upsert failed: ${error.message}`);
  }

  return data;
}

export async function getReusableCheckoutAttempt(optionId: string) {
  const db = requireSupabaseAdmin();
  const { data, error } = await db
    .from("whatsapp_ticket_concierge_checkout_attempts")
    .select("checkout_url, created_at, failure_reason, option_id, status, updated_at")
    .eq("option_id", optionId)
    .eq("status", "checkout_ready")
    .maybeSingle();

  if (error) {
    throw new Error(`[concierge] reusable checkout lookup failed: ${error.message}`);
  }

  return data;
}

export type {
  ConciergeRunInput,
  CreateOptionSetInput,
  CheckoutAttemptInput,
  ReplaceActiveOptionSetInput,
};
