import { randomUUID } from "node:crypto";
import type { MetaCapiSendResult, TicketmasterCapiLogFields } from "@/features/meta/conversions-api";
import { rowFromAttribution } from "@/features/meta/attribution";
import { sha256 } from "@/lib/hash";
import { supabaseAdmin } from "@/lib/supabase";

type RecordTicketmasterCapiEventInput = {
  errorMessage?: string;
  isTest?: boolean;
  log: TicketmasterCapiLogFields;
  metaPixelId?: string;
  metaResult?: MetaCapiSendResult;
  skipReason?: string;
};

type TicketmasterCapiEventRow = {
  attempt_count?: number;
  billing_state?: string | null;
  billing_zip?: string | null;
  country?: string | null;
  created_at?: string;
  currency?: string | null;
  error_message?: string | null;
  event_id: string;
  event_name: string;
  id?: string;
  is_test?: boolean;
  last_seen_at?: string;
  meta_ok?: boolean;
  meta_pixel_id?: string | null;
  meta_response?: unknown;
  meta_status?: number | null;
  om_click_id?: string | null;
  om_session_id?: string | null;
  order_hash?: string | null;
  order_id?: string | null;
  quantity?: number | null;
  request_ip_hash?: string | null;
  skip_reason?: string | null;
  fbclid?: string | null;
  fbc?: string | null;
  fbp?: string | null;
  meta_ad_id?: string | null;
  meta_ad_name?: string | null;
  meta_adset_id?: string | null;
  meta_adset_name?: string | null;
  meta_campaign_id?: string | null;
  meta_campaign_name?: string | null;
  placement?: string | null;
  site_source?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_medium?: string | null;
  utm_source?: string | null;
  utm_term?: string | null;
  source_url?: string | null;
  ticketmaster_event_date?: string | null;
  ticketmaster_event_id?: string | null;
  ticketmaster_event_name?: string | null;
  user_agent_hash?: string | null;
  value?: number | null;
};

function compactResponse(metaResult: MetaCapiSendResult | undefined) {
  if (!metaResult) return null;
  const body = metaResult.body;
  if (body && typeof body === "object") return body;
  if (typeof body === "string") return { raw: body.slice(0, 1000) };
  return body ?? null;
}

function generatedEventId(input: RecordTicketmasterCapiEventInput) {
  if (input.log.eventId) return input.log.eventId;
  const seed = [
    input.log.eventName,
    input.log.orderId ?? "no-order",
    input.log.ticketmasterEventId ?? "no-event",
    input.log.value ?? "no-value",
    input.skipReason ?? "no-skip",
    randomUUID(),
  ].join(":");
  return `tm_log_${sha256(seed).slice(0, 32)}`;
}

export async function recordTicketmasterCapiEvent(input: RecordTicketmasterCapiEventInput) {
  if (!supabaseAdmin) return;

  const eventId = generatedEventId(input);
  const now = new Date().toISOString();

  const existing = await supabaseAdmin
    .from("ticketmaster_capi_events")
    .select("id, attempt_count")
    .eq("event_id", eventId)
    .maybeSingle();

  if (existing.error) {
    console.error("[meta:capi] failed to read CAPI event log:", existing.error.message);
  }

  const row: TicketmasterCapiEventRow = {
    ...rowFromAttribution(input.log.attribution),
    attempt_count: ((existing.data as { attempt_count?: number } | null)?.attempt_count ?? 0) + 1,
    billing_state: input.log.billingState ?? null,
    billing_zip: input.log.billingZip ?? null,
    country: input.log.country ?? null,
    currency: input.log.currency ?? null,
    error_message: input.errorMessage?.slice(0, 1000) ?? null,
    event_id: eventId,
    event_name: input.log.eventName,
    is_test: input.isTest ?? false,
    last_seen_at: now,
    meta_ok: input.metaResult?.ok ?? false,
    meta_pixel_id: input.metaPixelId ?? null,
    meta_response: compactResponse(input.metaResult),
    meta_status: input.metaResult?.status ?? null,
    om_click_id: input.log.omClickId ?? null,
    om_session_id: input.log.omSessionId ?? null,
    order_hash: input.log.orderHash ?? null,
    order_id: input.log.orderId ?? null,
    quantity: input.log.quantity ?? null,
    request_ip_hash: input.log.requestIpHash ?? null,
    skip_reason: input.skipReason ?? null,
    source_url: input.log.sourceUrl ?? null,
    ticketmaster_event_date: input.log.ticketmasterEventDate ?? null,
    ticketmaster_event_id: input.log.ticketmasterEventId ?? null,
    ticketmaster_event_name: input.log.ticketmasterEventName ?? null,
    user_agent_hash: input.log.userAgentHash ?? null,
    value: input.log.value ?? null,
  };

  const write = existing.data
    ? await supabaseAdmin
      .from("ticketmaster_capi_events")
      .update(row)
      .eq("event_id", eventId)
    : await supabaseAdmin
      .from("ticketmaster_capi_events")
      .insert(row);

  if (write.error) {
    console.error("[meta:capi] failed to write CAPI event log:", write.error.message);
  }
}
