import { randomUUID } from "node:crypto";
import {
  cleanAttributionQueryValue,
  cleanMarketingSlug,
  rowFromAttribution,
  sanitizeMarketingAttribution,
  sanitizeMarketingAttributionWithInferredMetaAdId,
  sanitizeMarketingReferrerForStorage,
  sanitizeMarketingTrackingToken,
  sanitizeMarketingUrlForStorage,
  type MarketingAttribution,
} from "@/features/meta/attribution";
import type { TicketmasterCapiLogFields } from "@/features/meta/conversions-api";
import { sha256 } from "@/lib/hash";
import { supabaseAdmin } from "@/lib/supabase";

export type AttributionMatchConfidence = "deterministic" | "high" | "medium" | "low" | "unknown";

export type TicketmasterAttributionMatch = {
  attribution: MarketingAttribution;
  clickId?: string;
  confidence: AttributionMatchConfidence;
  handoffId?: string;
  method: string;
  sessionId?: string;
};

type HandoffRow = {
  click_id?: string | null;
  created_at?: string;
  fbclid?: string | null;
  fbc?: string | null;
  fbp?: string | null;
  id?: string;
  meta_ad_id?: string | null;
  meta_ad_name?: string | null;
  meta_adset_id?: string | null;
  meta_adset_name?: string | null;
  meta_campaign_id?: string | null;
  meta_campaign_name?: string | null;
  placement?: string | null;
  session_id?: string | null;
  site_source?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_medium?: string | null;
  utm_source?: string | null;
  utm_term?: string | null;
};

type TicketmasterAttributionHandoffInput = {
  attribution?: MarketingAttribution;
  clickId: string;
  cta?: string;
  destinationUrl: string;
  funnel: string;
  market?: string;
  metadata?: Record<string, unknown>;
  referrer?: string;
  sessionId?: string;
  sourceUrl?: string;
  ticketmasterEventId?: string;
  ticketmasterEventName?: string;
};

type TicketmasterAttributionHandoffRow = {
  click_id: string;
  cta?: string | null;
  destination_url?: string | null;
  fbclid?: string | null;
  fbc?: string | null;
  fbp?: string | null;
  funnel: string;
  market?: string | null;
  meta_ad_id?: string | null;
  meta_ad_name?: string | null;
  meta_adset_id?: string | null;
  meta_adset_name?: string | null;
  meta_campaign_id?: string | null;
  meta_campaign_name?: string | null;
  metadata?: Record<string, unknown>;
  placement?: string | null;
  referrer?: string | null;
  request_ip_hash?: string | null;
  session_id?: string | null;
  site_source?: string | null;
  source_url?: string | null;
  ticketmaster_event_id?: string | null;
  ticketmaster_event_name?: string | null;
  user_agent_hash?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_medium?: string | null;
  utm_source?: string | null;
  utm_term?: string | null;
};

const HANDOFF_SELECT = [
  "id",
  "created_at",
  "click_id",
  "session_id",
  "fbclid",
  "fbc",
  "fbp",
  "meta_campaign_id",
  "meta_campaign_name",
  "meta_adset_id",
  "meta_adset_name",
  "meta_ad_id",
  "meta_ad_name",
  "placement",
  "site_source",
  "utm_campaign",
  "utm_content",
  "utm_medium",
  "utm_source",
  "utm_term",
].join(", ");

function cleanText(value: unknown, maxLength = 500) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLength);
}

function getClientIp(headers: Headers) {
  const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = headers.get("x-real-ip")?.trim();
  const cfIp = headers.get("cf-connecting-ip")?.trim();
  return forwardedFor || realIp || cfIp || undefined;
}

function safeMetadata(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const text = JSON.stringify(value);
  if (text.length > 4000) return { truncated: true };
  return JSON.parse(text) as Record<string, unknown>;
}

function sevenDaysBefore(now: string) {
  return new Date(new Date(now).getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
}

function minutesBefore(now: string, minutes: number) {
  return new Date(new Date(now).getTime() - minutes * 60 * 1000).toISOString();
}

function attributionFromHandoff(row: HandoffRow): MarketingAttribution {
  return {
    fbclid: row.fbclid ?? undefined,
    fbc: row.fbc ?? undefined,
    fbp: row.fbp ?? undefined,
    metaAdId: row.meta_ad_id ?? undefined,
    metaAdName: row.meta_ad_name ?? undefined,
    metaAdsetId: row.meta_adset_id ?? undefined,
    metaAdsetName: row.meta_adset_name ?? undefined,
    metaCampaignId: row.meta_campaign_id ?? undefined,
    metaCampaignName: row.meta_campaign_name ?? undefined,
    placement: row.placement ?? undefined,
    siteSource: row.site_source ?? undefined,
    utmCampaign: row.utm_campaign ?? undefined,
    utmContent: row.utm_content ?? undefined,
    utmMedium: row.utm_medium ?? undefined,
    utmSource: row.utm_source ?? undefined,
    utmTerm: row.utm_term ?? undefined,
  };
}

export function attributionMatchFromHandoffRow(
  row: HandoffRow,
  method: string,
  confidence: AttributionMatchConfidence,
): TicketmasterAttributionMatch {
  return {
    attribution: attributionFromHandoff(row),
    clickId: row.click_id ?? undefined,
    confidence,
    handoffId: row.id,
    method,
    sessionId: row.session_id ?? undefined,
  };
}

function contextForLog(log: TicketmasterCapiLogFields) {
  return {
    funnel: cleanMarketingSlug(log.funnel, 120),
    market: cleanMarketingSlug(log.market, 120),
    ticketmasterEventId: cleanAttributionQueryValue("ticketmaster_event_id", log.ticketmasterEventId),
  };
}

function hasStrongMatchContext(log: TicketmasterCapiLogFields) {
  const context = contextForLog(log);
  return Boolean(context.ticketmasterEventId && context.funnel && context.market);
}

function stableDirectAttribution(log: TicketmasterCapiLogFields) {
  const attribution = sanitizeMarketingAttributionWithInferredMetaAdId(log.attribution);
  return attribution.metaAdId || attribution.metaAdsetId || attribution.metaCampaignId ? attribution : null;
}

function applyMatchContext<T extends { eq: (column: string, value: string) => T }>(query: T, log: TicketmasterCapiLogFields) {
  const context = contextForLog(log);
  let scoped = query;
  if (context.ticketmasterEventId) scoped = scoped.eq("ticketmaster_event_id", context.ticketmasterEventId);
  if (context.funnel) scoped = scoped.eq("funnel", context.funnel);
  if (context.market) scoped = scoped.eq("market", context.market);
  return scoped;
}

async function latestHandoffByField(
  field: string,
  value: string | undefined,
  log: TicketmasterCapiLogFields,
  now: string,
): Promise<HandoffRow | null> {
  if (!supabaseAdmin || !value) return null;

  const result = await applyMatchContext(
    supabaseAdmin
      .from("ticketmaster_attribution_handoffs")
      .select(HANDOFF_SELECT)
      .eq(field, value)
      .gte("created_at", sevenDaysBefore(now))
      .lte("created_at", now)
      .order("created_at", { ascending: false })
      .limit(1),
    log,
  ).maybeSingle();

  if (result?.error) {
    console.error(`[ticketmaster:handoff] failed to match ${field}:`, result.error.message);
    return null;
  }

  return (result?.data as HandoffRow | null) ?? null;
}

async function uniqueHandoffByField(
  field: string,
  value: string | undefined,
  log: TicketmasterCapiLogFields,
  now: string,
): Promise<HandoffRow | null> {
  if (!supabaseAdmin || !value || !hasStrongMatchContext(log)) return null;

  const result = await applyMatchContext(
    supabaseAdmin
      .from("ticketmaster_attribution_handoffs")
      .select(HANDOFF_SELECT)
      .eq(field, value)
      .gte("created_at", sevenDaysBefore(now))
      .lte("created_at", now)
      .order("created_at", { ascending: false })
      .limit(2),
    log,
  );

  if (result?.error) {
    console.error(`[ticketmaster:handoff] failed to match unique ${field}:`, result.error.message);
    return null;
  }

  const rows = (result?.data ?? []) as HandoffRow[];
  return rows.length === 1 ? rows[0] : null;
}

async function latestHandoffByIpUa(log: TicketmasterCapiLogFields, now: string): Promise<HandoffRow | null> {
  if (!supabaseAdmin || !log.requestIpHash || !log.userAgentHash || !hasStrongMatchContext(log)) return null;

  const result = await applyMatchContext(
    supabaseAdmin
      .from("ticketmaster_attribution_handoffs")
      .select(HANDOFF_SELECT)
      .eq("request_ip_hash", log.requestIpHash)
      .eq("user_agent_hash", log.userAgentHash)
      .gte("created_at", sevenDaysBefore(now))
      .lte("created_at", now)
      .order("created_at", { ascending: false })
      .limit(2),
    log,
  );

  if (result?.error) {
    console.error("[ticketmaster:handoff] failed to match hashed IP+UA:", result.error.message);
    return null;
  }

  const rows = (result?.data ?? []) as HandoffRow[];
  return rows.length === 1 ? rows[0] : null;
}

async function uniqueRecentUaHandoff(log: TicketmasterCapiLogFields, now: string): Promise<HandoffRow | null> {
  if (!supabaseAdmin || !log.userAgentHash || !hasStrongMatchContext(log)) return null;

  const result = await applyMatchContext(
    supabaseAdmin
      .from("ticketmaster_attribution_handoffs")
      .select(HANDOFF_SELECT)
      .eq("user_agent_hash", log.userAgentHash)
      .gte("created_at", minutesBefore(now, 30))
      .lte("created_at", now)
      .order("created_at", { ascending: false })
      .limit(2),
    log,
  );

  if (result?.error) {
    console.error("[ticketmaster:handoff] failed to match unique UA handoff:", result.error.message);
    return null;
  }

  const rows = (result?.data ?? []) as HandoffRow[];
  return rows.length === 1 ? rows[0] : null;
}

async function recentRedirectByIpUa(log: TicketmasterCapiLogFields, now: string): Promise<TicketmasterAttributionMatch | null> {
  if (!supabaseAdmin || !log.requestIpHash || !log.userAgentHash || !hasStrongMatchContext(log)) return null;

  const context = contextForLog(log);
  let query = supabaseAdmin
    .from("marketing_attribution_events")
    .select("click_id, session_id, fbclid, fbc, fbp, meta_ad_id, meta_ad_name, meta_adset_id, meta_adset_name, meta_campaign_id, meta_campaign_name, placement, site_source, utm_campaign, utm_content, utm_medium, utm_source, utm_term")
    .eq("request_ip_hash", log.requestIpHash)
    .eq("user_agent_hash", log.userAgentHash)
    .eq("event_name", "ticket_redirect")
    .gte("created_at", sevenDaysBefore(now))
    .lte("created_at", now)
    .order("created_at", { ascending: false })
    .limit(2);
  if (context.funnel) query = query.eq("funnel", context.funnel);
  if (context.market) query = query.eq("market", context.market);
  if (context.ticketmasterEventId) query = query.eq("metadata->>ticketmaster_event_id", context.ticketmasterEventId);
  const result = await query;

  if (result?.error) {
    console.error("[ticketmaster:handoff] failed to match redirect attribution:", result.error.message);
    return null;
  }

  const rows = (result?.data ?? []) as HandoffRow[];
  return rows.length === 1 ? attributionMatchFromHandoffRow(rows[0], "exact_ip_ua_redirect", "medium") : null;
}

export async function recordTicketmasterAttributionHandoff(
  input: TicketmasterAttributionHandoffInput,
  headers: Headers,
) {
  if (!supabaseAdmin) return;

  const clientIp = getClientIp(headers);
  const userAgent = cleanText(headers.get("user-agent"), 500);
  const row: TicketmasterAttributionHandoffRow = {
    ...rowFromAttribution(input.attribution),
    click_id: sanitizeMarketingTrackingToken(input.clickId) ?? `omc_${randomUUID()}`,
    cta: cleanMarketingSlug(input.cta, 120) ?? null,
    destination_url: sanitizeMarketingUrlForStorage(input.destinationUrl) ?? null,
    funnel: cleanMarketingSlug(input.funnel, 120) ?? "unknown",
    market: cleanMarketingSlug(input.market, 120) ?? null,
    metadata: safeMetadata(input.metadata),
    referrer: sanitizeMarketingReferrerForStorage(input.referrer) ?? null,
    request_ip_hash: clientIp ? sha256(clientIp) : null,
    session_id: sanitizeMarketingTrackingToken(input.sessionId) ?? null,
    source_url: sanitizeMarketingUrlForStorage(input.sourceUrl) ?? null,
    ticketmaster_event_id: cleanAttributionQueryValue("ticketmaster_event_id", input.ticketmasterEventId) ?? null,
    ticketmaster_event_name: cleanAttributionQueryValue("utm_content", input.ticketmasterEventName) ?? null,
    user_agent_hash: userAgent ? sha256(userAgent) : null,
  };

  const { error } = await supabaseAdmin
    .from("ticketmaster_attribution_handoffs")
    .insert(row);

  if (error) {
    console.error("[ticketmaster:handoff] failed to record handoff:", error.message);
  }
}

export async function findTicketmasterAttributionMatch(
  log: TicketmasterCapiLogFields,
  now: string,
): Promise<TicketmasterAttributionMatch | null> {
  if (log.eventName !== "Purchase") return null;

  const directAttribution = stableDirectAttribution(log);
  if (directAttribution) {
    return {
      attribution: directAttribution,
      clickId: log.omClickId,
      confidence: "deterministic",
      method: "direct_ticketmaster_params",
      sessionId: log.omSessionId,
    };
  }

  const directClick = await latestHandoffByField("click_id", log.omClickId, log, now);
  if (directClick) return attributionMatchFromHandoffRow(directClick, "direct_click_id", "deterministic");

  const directSession = await latestHandoffByField("session_id", log.omSessionId, log, now);
  if (directSession) return attributionMatchFromHandoffRow(directSession, "direct_session_id", "deterministic");

  const browserAttribution = sanitizeMarketingAttribution(log.attribution);
  const fbcMatch = await uniqueHandoffByField("fbc", browserAttribution.fbc, log, now);
  if (fbcMatch) return attributionMatchFromHandoffRow(fbcMatch, "exact_fbc", "high");

  const fbclidMatch = await uniqueHandoffByField("fbclid", browserAttribution.fbclid, log, now);
  if (fbclidMatch) return attributionMatchFromHandoffRow(fbclidMatch, "exact_fbclid", "high");

  const fbpMatch = await uniqueHandoffByField("fbp", browserAttribution.fbp, log, now);
  if (fbpMatch) return attributionMatchFromHandoffRow(fbpMatch, "exact_fbp", "medium");

  const ipUaMatch = await latestHandoffByIpUa(log, now);
  if (ipUaMatch) return attributionMatchFromHandoffRow(ipUaMatch, "exact_ip_ua_handoff", "medium");

  const uniqueUaMatch = await uniqueRecentUaHandoff(log, now);
  if (uniqueUaMatch) return attributionMatchFromHandoffRow(uniqueUaMatch, "unique_recent_ua_handoff", "low");

  return recentRedirectByIpUa(log, now);
}
