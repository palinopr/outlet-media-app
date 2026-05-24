import { randomUUID } from "node:crypto";
import { sanitizeTicketmasterCapiSourceUrl, type MetaCapiSendResult, type TicketmasterCapiLogFields } from "@/features/meta/conversions-api";
import {
  attributionFromUrlString,
  cleanAttributionQueryValue,
  cleanMarketingSlug,
  mergeAttribution,
  rowFromAttribution,
  sanitizeMarketingAttribution,
  sanitizeMarketingAttributionWithInferredMetaAdId,
  sanitizeMarketingTrackingToken,
  type MarketingAttribution,
} from "@/features/meta/attribution";
import {
  findTicketmasterAttributionMatch,
  type AttributionMatchConfidence,
} from "@/features/meta/ticketmaster-attribution-handoff";
import { enrichAttributionWithMetaAdHierarchy } from "@/features/meta/meta-ad-hierarchy";
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

type ExistingTicketmasterCapiEventRow = {
  attempt_count?: number;
  attribution_handoff_id?: string | null;
  attribution_match_confidence?: AttributionMatchConfidence | null;
  attribution_match_method?: string | null;
  attribution_matched_at?: string | null;
  created_at?: string;
  fbclid?: string | null;
  fbc?: string | null;
  fbp?: string | null;
  meta_ad_id?: string | null;
  meta_ad_name?: string | null;
  meta_adset_id?: string | null;
  meta_adset_name?: string | null;
  meta_campaign_id?: string | null;
  meta_campaign_name?: string | null;
  om_click_id?: string | null;
  om_session_id?: string | null;
  placement?: string | null;
  site_source?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_medium?: string | null;
  utm_source?: string | null;
  utm_term?: string | null;
};

type TicketmasterCapiEventRow = {
  attempt_count?: number;
  attribution_handoff_id?: string | null;
  attribution_match_confidence?: AttributionMatchConfidence | null;
  attribution_match_method?: string | null;
  attribution_matched_at?: string | null;
  billing_state?: string | null;
  billing_zip?: string | null;
  country?: string | null;
  created_at?: string;
  cta?: string | null;
  currency?: string | null;
  error_message?: string | null;
  event_id: string;
  event_name: string;
  funnel?: string | null;
  id?: string;
  is_test?: boolean;
  last_seen_at?: string;
  meta_ok?: boolean;
  meta_pixel_id?: string | null;
  meta_response?: unknown;
  meta_status?: number | null;
  market?: string | null;
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
  const explicitEventId = cleanAttributionQueryValue("meta_event_id", input.log.eventId);
  if (explicitEventId) return explicitEventId;
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

function hasMetaAttribution(attribution: MarketingAttribution | null | undefined) {
  return Boolean(attribution?.metaAdId || attribution?.metaAdsetId || attribution?.metaCampaignId);
}

function directAttributionFromInput(input: RecordTicketmasterCapiEventInput) {
  return sanitizeMarketingAttributionWithInferredMetaAdId(mergeAttribution(
    sanitizeMarketingAttributionWithInferredMetaAdId(attributionFromUrlString(input.log.sourceUrl)),
    sanitizeMarketingAttributionWithInferredMetaAdId(input.log.attribution),
  ));
}

function confidenceRank(value: AttributionMatchConfidence | null | undefined) {
  switch (value) {
    case "deterministic":
      return 4;
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
    case "unknown":
    default:
      return 0;
  }
}

function hasValidMetaAttribution(row: ExistingTicketmasterCapiEventRow | null | undefined) {
  return Boolean(
    cleanAttributionQueryValue("ad_id", row?.meta_ad_id)
      || cleanAttributionQueryValue("adset_id", row?.meta_adset_id)
      || cleanAttributionQueryValue("campaign_id", row?.meta_campaign_id),
  );
}

function isDirectTicketmasterAttribution(method: string | null | undefined) {
  return method === "direct_ticketmaster_params";
}

function existingAttributionRank(row: ExistingTicketmasterCapiEventRow | null | undefined) {
  const rank = confidenceRank(row?.attribution_match_confidence);
  if (!hasValidMetaAttribution(row)) return rank;
  return isDirectTicketmasterAttribution(row?.attribution_match_method)
    ? Math.max(rank, confidenceRank("deterministic"))
    : rank;
}

function shouldPreserveExistingAttribution(input: {
  existingRow: ExistingTicketmasterCapiEventRow | null;
  fillExistingHierarchy: boolean;
  newConfidence: AttributionMatchConfidence;
  newMethod: string | null | undefined;
}) {
  if (!input.existingRow || input.fillExistingHierarchy) return false;
  if (isDirectTicketmasterAttribution(input.newMethod) && !isDirectTicketmasterAttribution(input.existingRow.attribution_match_method)) {
    return false;
  }
  return existingAttributionRank(input.existingRow) >= confidenceRank(input.newConfidence);
}

function attributionFromExistingRow(row: ExistingTicketmasterCapiEventRow | null | undefined) {
  return {
    fbclid: row?.fbclid ?? undefined,
    fbc: row?.fbc ?? undefined,
    fbp: row?.fbp ?? undefined,
    metaAdId: row?.meta_ad_id ?? undefined,
    metaAdName: row?.meta_ad_name ?? undefined,
    metaAdsetId: row?.meta_adset_id ?? undefined,
    metaAdsetName: row?.meta_adset_name ?? undefined,
    metaCampaignId: row?.meta_campaign_id ?? undefined,
    metaCampaignName: row?.meta_campaign_name ?? undefined,
    placement: row?.placement ?? undefined,
    siteSource: row?.site_source ?? undefined,
    utmCampaign: row?.utm_campaign ?? undefined,
    utmContent: row?.utm_content ?? undefined,
    utmMedium: row?.utm_medium ?? undefined,
    utmSource: row?.utm_source ?? undefined,
    utmTerm: row?.utm_term ?? undefined,
  };
}

function attributionAddsMetaHierarchy(
  existingRow: ExistingTicketmasterCapiEventRow | null | undefined,
  attribution: MarketingAttribution,
) {
  const existingAdId = cleanAttributionQueryValue("ad_id", existingRow?.meta_ad_id);
  const newAdId = cleanAttributionQueryValue("ad_id", attribution.metaAdId);
  if (!existingAdId || existingAdId !== newAdId) return false;

  const existingMissingHierarchy = !cleanAttributionQueryValue("ad_name", existingRow?.meta_ad_name)
    || !cleanAttributionQueryValue("adset_id", existingRow?.meta_adset_id)
    || !cleanAttributionQueryValue("adset_name", existingRow?.meta_adset_name)
    || !cleanAttributionQueryValue("campaign_id", existingRow?.meta_campaign_id)
    || !cleanAttributionQueryValue("campaign_name", existingRow?.meta_campaign_name);
  if (!existingMissingHierarchy) return false;

  return Boolean(
    cleanAttributionQueryValue("ad_name", attribution.metaAdName)
      || cleanAttributionQueryValue("adset_id", attribution.metaAdsetId)
      || cleanAttributionQueryValue("adset_name", attribution.metaAdsetName)
      || cleanAttributionQueryValue("campaign_id", attribution.metaCampaignId)
      || cleanAttributionQueryValue("campaign_name", attribution.metaCampaignName),
  );
}

function fillMissingMetaHierarchy(existingAttribution: MarketingAttribution, newAttribution: MarketingAttribution) {
  return sanitizeMarketingAttribution({
    ...existingAttribution,
    metaAdName: existingAttribution.metaAdName ?? newAttribution.metaAdName,
    metaAdsetId: existingAttribution.metaAdsetId ?? newAttribution.metaAdsetId,
    metaAdsetName: existingAttribution.metaAdsetName ?? newAttribution.metaAdsetName,
    metaCampaignId: existingAttribution.metaCampaignId ?? newAttribution.metaCampaignId,
    metaCampaignName: existingAttribution.metaCampaignName ?? newAttribution.metaCampaignName,
  });
}

function existingHasMatchContext(row: ExistingTicketmasterCapiEventRow | null | undefined) {
  return Boolean(
    row?.om_click_id
      || row?.om_session_id
      || row?.attribution_handoff_id
      || row?.attribution_match_method
      || row?.attribution_matched_at
      || confidenceRank(row?.attribution_match_confidence) > 0,
  );
}

export async function recordTicketmasterCapiEvent(input: RecordTicketmasterCapiEventInput) {
  if (!supabaseAdmin) return;

  const eventId = generatedEventId(input);
  const now = new Date().toISOString();
  const receivedAt = input.log.hitAt ?? now;

  const existing = await supabaseAdmin
    .from("ticketmaster_capi_events")
    .select("id, created_at, attempt_count, attribution_handoff_id, attribution_match_confidence, attribution_match_method, attribution_matched_at, om_click_id, om_session_id, fbclid, fbc, fbp, meta_ad_id, meta_ad_name, meta_adset_id, meta_adset_name, meta_campaign_id, meta_campaign_name, placement, site_source, utm_campaign, utm_content, utm_medium, utm_source, utm_term")
    .eq("event_id", eventId)
    .maybeSingle();

  if (existing.error) {
    console.error("[meta:capi] failed to read CAPI event log:", existing.error.message);
  }

  const existingRow = existing.data as ExistingTicketmasterCapiEventRow | null;
  const matchCutoff = existingRow?.created_at ?? receivedAt;
  const attributionMatch = await findTicketmasterAttributionMatch(input.log, matchCutoff);
  const directAttribution = directAttributionFromInput(input);
  const effectiveAttributionMatch = hasMetaAttribution(directAttribution)
    ? {
      attribution: directAttribution,
      clickId: input.log.omClickId,
      confidence: "deterministic" as const,
      handoffId: undefined,
      method: "direct_ticketmaster_params",
      sessionId: input.log.omSessionId,
    }
    : attributionMatch;
  const newAttribution = await enrichAttributionWithMetaAdHierarchy(sanitizeMarketingAttributionWithInferredMetaAdId(mergeAttribution(
    directAttribution,
    sanitizeMarketingAttribution(effectiveAttributionMatch?.attribution),
  )));
  const newOmClickId = sanitizeMarketingTrackingToken(input.log.omClickId ?? effectiveAttributionMatch?.clickId);
  const newOmSessionId = sanitizeMarketingTrackingToken(input.log.omSessionId ?? effectiveAttributionMatch?.sessionId);
  const newAttributionMatchMethod = effectiveAttributionMatch?.method ?? null;
  const newAttributionMatchConfidence = effectiveAttributionMatch?.confidence ?? "unknown";
  const existingAttribution = attributionFromExistingRow(existingRow);
  const fillExistingHierarchy = Boolean(existingRow && attributionAddsMetaHierarchy(existingRow, newAttribution));
  const preserveExistingAttribution = shouldPreserveExistingAttribution({
    existingRow,
    fillExistingHierarchy,
    newConfidence: newAttributionMatchConfidence,
    newMethod: newAttributionMatchMethod,
  });
  const preserveExistingMatchFields = preserveExistingAttribution || (fillExistingHierarchy && existingHasMatchContext(existingRow));
  const attribution = preserveExistingAttribution
    ? existingAttribution
    : fillExistingHierarchy
      ? fillMissingMetaHierarchy(existingAttribution, newAttribution)
      : newAttribution;
  const omClickId = preserveExistingMatchFields ? existingRow?.om_click_id : newOmClickId;
  const omSessionId = preserveExistingMatchFields ? existingRow?.om_session_id : newOmSessionId;
  const attributionMatchMethod = preserveExistingMatchFields ? existingRow?.attribution_match_method : newAttributionMatchMethod;
  const attributionMatchConfidence = preserveExistingMatchFields ? existingRow?.attribution_match_confidence : newAttributionMatchConfidence;
  const attributionHandoffId = preserveExistingMatchFields ? existingRow?.attribution_handoff_id : effectiveAttributionMatch?.handoffId;
  const attributionMatchedAt = preserveExistingMatchFields ? existingRow?.attribution_matched_at : (attributionMatchMethod ? now : null);

  const row: TicketmasterCapiEventRow = {
    ...rowFromAttribution(attribution),
    attempt_count: (existingRow?.attempt_count ?? 0) + 1,
    attribution_handoff_id: attributionHandoffId ?? null,
    attribution_match_confidence: attributionMatchConfidence,
    attribution_match_method: attributionMatchMethod ?? null,
    attribution_matched_at: attributionMatchedAt ?? null,
    billing_state: null,
    billing_zip: null,
    country: null,
    created_at: existingRow?.created_at ?? receivedAt,
    cta: cleanMarketingSlug(input.log.cta, 120) ?? null,
    currency: input.log.currency ?? null,
    error_message: input.errorMessage?.slice(0, 1000) ?? null,
    event_id: eventId,
    event_name: input.log.eventName,
    funnel: cleanMarketingSlug(input.log.funnel, 120) ?? null,
    is_test: input.isTest ?? false,
    last_seen_at: now,
    meta_ok: input.metaResult?.ok ?? false,
    meta_pixel_id: input.metaPixelId ?? null,
    meta_response: compactResponse(input.metaResult),
    meta_status: input.metaResult?.status ?? null,
    market: cleanMarketingSlug(input.log.market, 120) ?? null,
    om_click_id: omClickId ?? null,
    om_session_id: omSessionId ?? null,
    order_hash: input.log.orderHash ?? null,
    order_id: input.log.orderId ?? null,
    quantity: input.log.quantity ?? null,
    request_ip_hash: input.log.requestIpHash ?? null,
    skip_reason: input.skipReason ?? null,
    source_url: sanitizeTicketmasterCapiSourceUrl(input.log.sourceUrl) ?? null,
    ticketmaster_event_date: cleanAttributionQueryValue("event_date", input.log.ticketmasterEventDate) ?? null,
    ticketmaster_event_id: cleanAttributionQueryValue("ticketmaster_event_id", input.log.ticketmasterEventId) ?? null,
    ticketmaster_event_name: cleanAttributionQueryValue("utm_content", input.log.ticketmasterEventName) ?? null,
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
