import { sha256 } from "@/lib/hash";
import { supabaseAdmin } from "@/lib/supabase";

export type MarketingAttribution = {
  fbclid?: string;
  fbp?: string;
  fbc?: string;
  metaAdId?: string;
  metaAdName?: string;
  metaAdsetId?: string;
  metaAdsetName?: string;
  metaCampaignId?: string;
  metaCampaignName?: string;
  placement?: string;
  siteSource?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmMedium?: string;
  utmSource?: string;
  utmTerm?: string;
};

export type MarketingAttributionEventInput = {
  attribution?: MarketingAttribution;
  clickId?: string;
  cta?: string;
  eventName: string;
  funnel: string;
  landingUrl?: string;
  market?: string;
  metadata?: Record<string, unknown>;
  pagePath?: string;
  referrer?: string;
  sessionId?: string;
  sourceUrl?: string;
};

type MarketingAttributionEventRow = {
  click_id?: string | null;
  created_at?: string;
  cta?: string | null;
  event_name: string;
  fbclid?: string | null;
  fbc?: string | null;
  fbp?: string | null;
  funnel: string;
  id?: string;
  landing_url?: string | null;
  market?: string | null;
  meta_ad_id?: string | null;
  meta_ad_name?: string | null;
  meta_adset_id?: string | null;
  meta_adset_name?: string | null;
  meta_campaign_id?: string | null;
  meta_campaign_name?: string | null;
  metadata?: Record<string, unknown>;
  page_path?: string | null;
  placement?: string | null;
  referrer?: string | null;
  request_ip_hash?: string | null;
  session_id?: string | null;
  site_source?: string | null;
  source_url?: string | null;
  user_agent_hash?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_medium?: string | null;
  utm_source?: string | null;
  utm_term?: string | null;
};

export const ATTRIBUTION_QUERY_KEYS = [
  "campaign_id",
  "campaign_name",
  "adset_id",
  "adset_name",
  "ad_id",
  "ad_name",
  "placement",
  "site_source",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "fbp",
  "fbc",
] as const;

const EVENT_NAME_ALLOWLIST = new Set([
  "page_view",
  "qualified_view",
  "scroll_depth",
  "ticket_click",
  "ticket_redirect",
]);

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

function firstParam(params: URLSearchParams, names: string[]) {
  for (const name of names) {
    const value = cleanText(params.get(name), 500);
    if (value) return value;
  }
  return undefined;
}

function safeMetadata(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const text = JSON.stringify(value);
  if (text.length > 4000) return { truncated: true };
  return JSON.parse(text) as Record<string, unknown>;
}

export function normalizeMarketingEventName(value: unknown) {
  const eventName = cleanText(value, 80);
  if (!eventName || !EVENT_NAME_ALLOWLIST.has(eventName)) return undefined;
  return eventName;
}

export function attributionFromSearchParams(params: URLSearchParams): MarketingAttribution {
  return {
    fbclid: firstParam(params, ["fbclid"]),
    fbc: firstParam(params, ["fbc"]),
    fbp: firstParam(params, ["fbp"]),
    metaAdId: firstParam(params, ["ad_id", "meta_ad_id"]),
    metaAdName: firstParam(params, ["ad_name", "meta_ad_name"]),
    metaAdsetId: firstParam(params, ["adset_id", "meta_adset_id"]),
    metaAdsetName: firstParam(params, ["adset_name", "meta_adset_name"]),
    metaCampaignId: firstParam(params, ["campaign_id", "meta_campaign_id"]),
    metaCampaignName: firstParam(params, ["campaign_name", "meta_campaign_name"]),
    placement: firstParam(params, ["placement"]),
    siteSource: firstParam(params, ["site_source", "site_source_name"]),
    utmCampaign: firstParam(params, ["utm_campaign"]),
    utmContent: firstParam(params, ["utm_content"]),
    utmMedium: firstParam(params, ["utm_medium"]),
    utmSource: firstParam(params, ["utm_source"]),
    utmTerm: firstParam(params, ["utm_term"]),
  };
}

const NESTED_URL_PARAM_KEYS = ["edp", "source_url", "event_source_url", "page_url"];

function nestedUrlValues(params: URLSearchParams) {
  return NESTED_URL_PARAM_KEYS
    .map((key) => cleanText(params.get(key), 2000))
    .filter((value): value is string => Boolean(value?.startsWith("http://") || value?.startsWith("https://")));
}

function attributionFromUrlStringWithDepth(value: string | undefined, depth: number): MarketingAttribution {
  if (!value || depth > 2) return {};
  try {
    const parsed = new URL(value);
    const nested = nestedUrlValues(parsed.searchParams).map((nestedValue) => attributionFromUrlStringWithDepth(nestedValue, depth + 1));
    return mergeAttribution(...nested, attributionFromSearchParams(parsed.searchParams));
  } catch {
    return {};
  }
}

function firstParamFromUrlString(value: string | undefined, names: string[], depth = 0): string | undefined {
  if (!value || depth > 2) return undefined;
  try {
    const parsed = new URL(value);
    const direct = firstParam(parsed.searchParams, names);
    if (direct) return direct;
    for (const nestedValue of nestedUrlValues(parsed.searchParams)) {
      const nested = firstParamFromUrlString(nestedValue, names, depth + 1);
      if (nested) return nested;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export function attributionFromUrlString(value: string | undefined) {
  return attributionFromUrlStringWithDepth(value, 0);
}

export function clickIdFromParamsOrUrl(params: URLSearchParams, sourceUrl: string | undefined) {
  return firstParam(params, ["om_click_id", "click_id", "omc"]) ?? firstParamFromUrlString(sourceUrl, ["om_click_id", "click_id", "omc"]);
}

export function sessionIdFromParamsOrUrl(params: URLSearchParams, sourceUrl: string | undefined) {
  return firstParam(params, ["om_session_id", "session_id", "oms"]) ?? firstParamFromUrlString(sourceUrl, ["om_session_id", "session_id", "oms"]);
}

export function mergeAttribution(...items: Array<MarketingAttribution | undefined>): MarketingAttribution {
  const merged: MarketingAttribution = {};
  for (const item of items) {
    if (!item) continue;
    for (const [key, value] of Object.entries(item)) {
      if (value !== undefined) {
        (merged as Record<string, string>)[key] = value;
      }
    }
  }
  return merged;
}

export function rowFromAttribution(attribution: MarketingAttribution | undefined) {
  return {
    fbclid: attribution?.fbclid ?? null,
    fbc: attribution?.fbc ?? null,
    fbp: attribution?.fbp ?? null,
    meta_ad_id: attribution?.metaAdId ?? null,
    meta_ad_name: attribution?.metaAdName ?? null,
    meta_adset_id: attribution?.metaAdsetId ?? null,
    meta_adset_name: attribution?.metaAdsetName ?? null,
    meta_campaign_id: attribution?.metaCampaignId ?? null,
    meta_campaign_name: attribution?.metaCampaignName ?? null,
    placement: attribution?.placement ?? null,
    site_source: attribution?.siteSource ?? null,
    utm_campaign: attribution?.utmCampaign ?? null,
    utm_content: attribution?.utmContent ?? null,
    utm_medium: attribution?.utmMedium ?? null,
    utm_source: attribution?.utmSource ?? null,
    utm_term: attribution?.utmTerm ?? null,
  };
}

export async function recordMarketingAttributionEvent(input: MarketingAttributionEventInput, headers: Headers) {
  if (!supabaseAdmin) return;

  const clientIp = getClientIp(headers);
  const userAgent = cleanText(headers.get("user-agent"), 500);
  const row: MarketingAttributionEventRow = {
    ...rowFromAttribution(input.attribution),
    click_id: cleanText(input.clickId, 160) ?? null,
    cta: cleanText(input.cta, 120) ?? null,
    event_name: input.eventName,
    funnel: cleanText(input.funnel, 120) ?? "unknown",
    landing_url: cleanText(input.landingUrl, 1000) ?? null,
    market: cleanText(input.market, 120) ?? null,
    metadata: safeMetadata(input.metadata),
    page_path: cleanText(input.pagePath, 500) ?? null,
    referrer: cleanText(input.referrer, 1000) ?? null,
    request_ip_hash: clientIp ? sha256(clientIp) : null,
    session_id: cleanText(input.sessionId, 160) ?? null,
    source_url: cleanText(input.sourceUrl, 1000) ?? null,
    user_agent_hash: userAgent ? sha256(userAgent) : null,
  };

  const { error } = await supabaseAdmin
    .from("marketing_attribution_events")
    .insert(row);

  if (error) {
    console.error("[attribution] failed to record event:", error.message);
  }
}
