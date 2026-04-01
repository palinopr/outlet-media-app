import { randomUUID } from "node:crypto";

import { supabaseAdmin } from "@/lib/supabase";

import type {
  TicketConciergeIntent,
  TicketConciergePreparedOption,
  TicketConciergePreparedOptionSet,
} from "./types";

export interface ConciergeRunInput {
  contactId?: string | null;
  conversationId: string;
  customerMessage: string;
  eventContext: Record<string, unknown>;
  intent: TicketConciergeIntent;
  latestInboundMessageId?: string | null;
  scenarioKey: string;
}

type TicketConciergeOptionSetStatus = TicketConciergePreparedOptionSet["status"];

export interface CreateOptionSetInput {
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

export interface ReplaceActiveOptionSetInput extends CreateOptionSetInput {
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

type ConciergeRunStatus =
  | "pending_options"
  | "options_sent"
  | "checkout_ready"
  | "inventory_changed"
  | "no_inventory"
  | "lookup_failed"
  | "expired";

interface ConciergeRunRow {
  active_option_set_id?: string | null;
  contact_id?: string | null;
  conversation_id: string;
  created_at?: string;
  customer_message: string;
  event_context: Record<string, unknown>;
  id: string;
  intent: TicketConciergeIntent;
  last_checkout_url?: string | null;
  last_error?: string | null;
  latest_inbound_message_id?: string | null;
  scenario_key: string;
  status: ConciergeRunStatus;
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

interface ConciergeOptionRow {
  execution: Record<string, unknown>;
  id: string;
  is_under_budget: boolean;
  label: string;
  map_svg: string;
  map_token: string;
  note: string;
  option_set_id: string;
  ordinal: 1 | 2 | 3;
  quantity: number;
  quote_source: "exact";
  row: string | null;
  seat_labels: string[];
  section: string;
  total_cents: number;
}

export interface ActiveOptionSetSelectionSnapshot {
  optionSet: {
    conversationId: string;
    expiresAt: string;
    id: string;
    runId: string;
    selectedOptionId: string | null;
    status: TicketConciergePreparedOptionSet["status"];
  };
  options: TicketConciergePreparedOption[];
  run: {
    customerMessage: string;
    eventContext: Record<string, unknown>;
    id: string;
    intent: TicketConciergeIntent;
    scenarioKey: string;
    status: ConciergeRunStatus;
  };
}

export interface UpdateRunStateInput {
  activeOptionSetId?: string | null;
  lastCheckoutUrl?: string | null;
  lastError?: string | null;
  latestInboundMessageId?: string | null;
  runId: string;
  status?: ConciergeRunStatus;
}

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

function toPreparedOptionFromRow(row: ConciergeOptionRow): TicketConciergePreparedOption {
  return {
    execution: row.execution,
    id: row.id,
    isUnderBudget: row.is_under_budget,
    label: row.label,
    mapSvg: row.map_svg,
    mapToken: row.map_token,
    note: row.note,
    ordinal: row.ordinal,
    quantity: row.quantity,
    quoteSource: row.quote_source,
    row: row.row,
    seatLabels: row.seat_labels,
    section: row.section,
    totalCents: row.total_cents,
  };
}

async function deleteOptionSet(optionSetId: string) {
  const db = requireSupabaseAdmin();
  const { error } = await db
    .from("whatsapp_ticket_concierge_option_sets")
    .delete()
    .eq("id", optionSetId);

  if (error) {
    throw new Error(`[concierge] option set cleanup failed: ${error.message}`);
  }
}

async function updateRunActiveOptionSet(runId: string, optionSetId: string | null) {
  const db = requireSupabaseAdmin();
  const { error } = await db
    .from("whatsapp_ticket_concierge_runs")
    .update({ active_option_set_id: optionSetId, updated_at: new Date().toISOString() })
    .eq("id", runId);

  if (error) {
    throw new Error(`[concierge] run active option set update failed: ${error.message}`);
  }
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

  const optionRows = preparedOptions.map((option) => ({
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
  }));

  const { error: optionInsertError } = await db
    .from("whatsapp_ticket_concierge_options")
    .insert(optionRows);

  if (optionInsertError) {
    await deleteOptionSet(optionSetId);
    throw new Error(`[concierge] option insert failed: ${optionInsertError.message}`);
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
  const created = await persistOptionSet(input);
  try {
    await updateRunActiveOptionSet(input.runId, created.id);
  } catch (error) {
    await deleteOptionSet(created.id);
    throw error;
  }

  return created;
}

export async function replaceActiveOptionSet(input: ReplaceActiveOptionSetInput) {
  const created = await persistOptionSet({
    conversationId: input.conversationId,
    eventContext: input.eventContext,
    refreshOfOptionSetId: input.previousOptionSetId ?? null,
    intent: input.intent,
    options: input.options,
    runId: input.runId,
    status: input.status ?? "active",
  });

  try {
    await updateRunActiveOptionSet(input.runId, created.id);
  } catch (error) {
    await deleteOptionSet(created.id);
    throw error;
  }

  if (input.previousOptionSetId) {
    const db = requireSupabaseAdmin();
    const { error } = await db
      .from("whatsapp_ticket_concierge_option_sets")
      .update({ status: "replaced" })
      .eq("id", input.previousOptionSetId);

    if (error) {
      await updateRunActiveOptionSet(input.runId, input.previousOptionSetId);
      await deleteOptionSet(created.id);
      throw new Error(`[concierge] option set replace failed: ${error.message}`);
    }
  }

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

  if (data && Date.parse(data.expires_at) <= Date.now()) {
    await expireOptionSet(data.id);
    return null;
  }

  return data as ActiveOptionSetRow | null;
}

export async function getActiveOptionSetSelectionSnapshot(
  conversationId: string,
): Promise<ActiveOptionSetSelectionSnapshot | null> {
  const optionSet = await getActiveOptionSet(conversationId);
  if (!optionSet) {
    return null;
  }

  const db = requireSupabaseAdmin();
  const [{ data: optionRows, error: optionError }, { data: runRow, error: runError }] =
    await Promise.all([
      db
        .from("whatsapp_ticket_concierge_options")
        .select(
          "execution, id, is_under_budget, label, map_svg, map_token, note, option_set_id, ordinal, quantity, quote_source, row, seat_labels, section, total_cents",
        )
        .eq("option_set_id", optionSet.id)
        .order("ordinal"),
      db
        .from("whatsapp_ticket_concierge_runs")
        .select(
          "conversation_id, customer_message, event_context, id, intent, scenario_key, status, updated_at",
        )
        .eq("id", optionSet.run_id)
        .maybeSingle(),
    ]);

  if (optionError) {
    throw new Error(`[concierge] option lookup failed: ${optionError.message}`);
  }

  if (runError) {
    throw new Error(`[concierge] run lookup failed: ${runError.message}`);
  }

  if (!runRow) {
    return null;
  }

  return {
    optionSet: {
      conversationId: optionSet.conversation_id,
      expiresAt: optionSet.expires_at,
      id: optionSet.id,
      runId: optionSet.run_id,
      selectedOptionId: optionSet.selected_option_id,
      status: optionSet.status,
    },
    options: ((optionRows ?? []) as ConciergeOptionRow[])
      .map(toPreparedOptionFromRow)
      .sort((left, right) => left.ordinal - right.ordinal),
    run: {
      customerMessage: (runRow as ConciergeRunRow).customer_message,
      eventContext: (runRow as ConciergeRunRow).event_context,
      id: (runRow as ConciergeRunRow).id,
      intent: (runRow as ConciergeRunRow).intent,
      scenarioKey: (runRow as ConciergeRunRow).scenario_key,
      status: (runRow as ConciergeRunRow).status,
    },
  };
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

export async function selectConciergeOption(input: { optionId: string; optionSetId: string }) {
  const db = requireSupabaseAdmin();
  const { error } = await db
    .from("whatsapp_ticket_concierge_option_sets")
    .update({
      selected_option_id: input.optionId,
      status: "selected",
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.optionSetId);

  if (error) {
    throw new Error(`[concierge] option selection update failed: ${error.message}`);
  }
}

export async function updateRunState(input: UpdateRunStateInput) {
  const db = requireSupabaseAdmin();
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if ("activeOptionSetId" in input) {
    payload.active_option_set_id = input.activeOptionSetId ?? null;
  }
  if ("lastCheckoutUrl" in input) {
    payload.last_checkout_url = input.lastCheckoutUrl ?? null;
  }
  if ("lastError" in input) {
    payload.last_error = input.lastError ?? null;
  }
  if ("latestInboundMessageId" in input) {
    payload.latest_inbound_message_id = input.latestInboundMessageId ?? null;
  }
  if (input.status) {
    payload.status = input.status;
  }

  const { error } = await db
    .from("whatsapp_ticket_concierge_runs")
    .update(payload)
    .eq("id", input.runId);

  if (error) {
    throw new Error(`[concierge] run update failed: ${error.message}`);
  }
}

export async function getLatestRunForConversation(conversationId: string) {
  const db = requireSupabaseAdmin();
  const { data, error } = await db
    .from("whatsapp_ticket_concierge_runs")
    .select(
      "conversation_id, customer_message, event_context, id, intent, scenario_key, status, updated_at",
    )
    .eq("conversation_id", conversationId);

  if (error) {
    throw new Error(`[concierge] latest run lookup failed: ${error.message}`);
  }

  const rows = (Array.isArray(data) ? data : []) as ConciergeRunRow[];
  const latest = [...rows].sort((left, right) =>
    (right.updated_at ?? "").localeCompare(left.updated_at ?? ""),
  )[0];

  if (!latest) {
    return null;
  }

  return {
    customerMessage: latest.customer_message,
    eventContext: latest.event_context,
    id: latest.id,
    intent: latest.intent,
    scenarioKey: latest.scenario_key,
    status: latest.status,
  };
}

export type {
  ConciergeRunStatus,
  CheckoutAttemptInput,
};
