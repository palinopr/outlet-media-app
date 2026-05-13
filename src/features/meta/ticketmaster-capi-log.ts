import { randomUUID } from "node:crypto";
import type { MetaCapiSendResult, TicketmasterCapiLogFields } from "@/features/meta/conversions-api";
import {
  attributionFromUrlString,
  mergeAttribution,
  rowFromAttribution,
  type MarketingAttribution,
} from "@/features/meta/attribution";
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

type AttributionMatch = {
  attribution: MarketingAttribution;
  clickId?: string;
  sessionId?: string;
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

function hasDeterministicAttribution(input: RecordTicketmasterCapiEventInput) {
  return Boolean(
    input.log.omClickId ||
    input.log.attribution?.metaAdId ||
    input.log.attribution?.metaAdsetId ||
    input.log.attribution?.metaCampaignId,
  );
}

async function findRecentAttributionMatch(input: RecordTicketmasterCapiEventInput, now: string): Promise<AttributionMatch | null> {
  if (
    input.log.eventName !== "Purchase" ||
    hasDeterministicAttribution(input) ||
    !input.log.requestIpHash ||
    !input.log.userAgentHash
  ) {
    return null;
  }

  const sevenDaysAgo = new Date(new Date(now).getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const match = await supabaseAdmin
    ?.from("marketing_attribution_events")
    .select("click_id, session_id, fbclid, fbc, fbp, meta_ad_id, meta_ad_name, meta_adset_id, meta_adset_name, meta_campaign_id, meta_campaign_name, placement, site_source, utm_campaign, utm_content, utm_medium, utm_source, utm_term")
    .eq("request_ip_hash", input.log.requestIpHash)
    .eq("user_agent_hash", input.log.userAgentHash)
    .in("event_name", ["ticket_redirect", "ticket_click"])
    .gte("created_at", sevenDaysAgo)
    .lte("created_at", now)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (match?.error) {
    console.error("[meta:capi] failed to match attribution event:", match.error.message);
    return null;
  }

  const data = match?.data as Record<string, string | null> | null;
  if (!data) return null;

  return {
    attribution: {
      fbclid: data.fbclid ?? undefined,
      fbc: data.fbc ?? undefined,
      fbp: data.fbp ?? undefined,
      metaAdId: data.meta_ad_id ?? undefined,
      metaAdName: data.meta_ad_name ?? undefined,
      metaAdsetId: data.meta_adset_id ?? undefined,
      metaAdsetName: data.meta_adset_name ?? undefined,
      metaCampaignId: data.meta_campaign_id ?? undefined,
      metaCampaignName: data.meta_campaign_name ?? undefined,
      placement: data.placement ?? undefined,
      siteSource: data.site_source ?? undefined,
      utmCampaign: data.utm_campaign ?? undefined,
      utmContent: data.utm_content ?? undefined,
      utmMedium: data.utm_medium ?? undefined,
      utmSource: data.utm_source ?? undefined,
      utmTerm: data.utm_term ?? undefined,
    },
    clickId: data.click_id ?? undefined,
    sessionId: data.session_id ?? undefined,
  };
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

  const recentAttributionMatch = await findRecentAttributionMatch(input, now);
  const attribution = mergeAttribution(
    recentAttributionMatch?.attribution,
    attributionFromUrlString(input.log.sourceUrl),
    input.log.attribution,
  );
  const omClickId = input.log.omClickId ?? recentAttributionMatch?.clickId;
  const omSessionId = input.log.omSessionId ?? recentAttributionMatch?.sessionId;

  const row: TicketmasterCapiEventRow = {
    ...rowFromAttribution(attribution),
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
    om_click_id: omClickId ?? null,
    om_session_id: omSessionId ?? null,
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
