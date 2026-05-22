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

export type MarketingDeviceType = "mobile" | "tablet" | "desktop" | "unknown";
export type MarketingViewportOrientation = "portrait" | "landscape" | "unknown";

export type MarketingAttributionEventInput = {
  attribution?: MarketingAttribution;
  clickId?: string;
  clientEventId?: string;
  cta?: string;
  deviceType?: string;
  eventName: string;
  funnel: string;
  landingUrl?: string;
  market?: string;
  metadata?: Record<string, unknown>;
  pagePath?: string;
  referrer?: string;
  sampleRate?: number;
  scrollDepthPct?: number;
  sectionId?: string;
  sessionId?: string;
  sourceUrl?: string;
  viewportHeight?: number;
  viewportOrientation?: string;
  viewportWidth?: number;
  visibleRatio?: number;
};

type MarketingAttributionEventRow = {
  click_id?: string | null;
  client_event_id?: string | null;
  created_at?: string;
  cta?: string | null;
  device_type?: string | null;
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
  sample_rate?: number;
  scroll_depth_pct?: number | null;
  section_id?: string | null;
  session_id?: string | null;
  site_source?: string | null;
  source_url?: string | null;
  user_agent_hash?: string | null;
  viewport_height?: number | null;
  viewport_orientation?: string | null;
  viewport_width?: number | null;
  visible_ratio?: number | null;
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

const SAFE_MARKETING_URL_QUERY_KEYS = new Set<string>([
  ...ATTRIBUTION_QUERY_KEYS,
  "cta",
  "click_id",
  "om_click_id",
  "om_session_id",
  "session_id",
  "omc",
  "oms",
  "utm_city",
]);

const EVENT_NAME_ALLOWLIST = new Set([
  "page_view",
  "qualified_view",
  "scroll_depth",
  "section_visible",
  "cta_impression",
  "ticket_click",
  "ticket_redirect",
]);

const DEVICE_TYPES = new Set<MarketingDeviceType>(["mobile", "tablet", "desktop", "unknown"]);
const VIEWPORT_ORIENTATIONS = new Set<MarketingViewportOrientation>(["portrait", "landscape", "unknown"]);
const SCROLL_DEPTHS = new Set([25, 50, 75, 100]);
const ATTRIBUTION_SECRET_RE = /(sk_live|sk_test|xox[baprs]-|ghp_|ya29\.|access[_-]?token|api[_-]?key|secret|password|bearer)/i;
const ATTRIBUTION_EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const ATTRIBUTION_PHONE_RE = /(?:^|[^A-Za-z0-9])(?:\+?\d[\d\s().-]{7,}\d)(?=$|[^A-Za-z0-9])|\d{10,}/;

function hasUnsafeAttributionValue(value: string) {
  return ATTRIBUTION_SECRET_RE.test(value) || ATTRIBUTION_EMAIL_RE.test(value);
}

function cleanText(value: unknown, maxLength = 500) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLength);
}

const META_ENTITY_ID_QUERY_KEYS = new Set(["campaign_id", "adset_id", "ad_id"]);
const TICKETMASTER_EVENT_ID_QUERY_KEYS = new Set(["eventid", "tm_event_id", "ticketmaster_event_id"]);
const EVENT_ID_QUERY_KEYS = new Set(["meta_event_id", "dedupe_event_id"]);
const DATE_QUERY_KEYS = new Set(["event_date", "tm_event_date", "eventdate", "ticketmaster_event_date"]);
const FACEBOOK_COOKIE_QUERY_KEYS = new Set(["fbc", "fbp"]);
const CLICK_SESSION_QUERY_KEYS = new Set(["click_id", "om_click_id", "om_session_id", "session_id", "omc", "oms"]);
const TEXT_QUERY_KEYS = new Set(["campaign_name", "adset_name", "ad_name", "utm_content"]);
const SLUG_QUERY_KEYS = new Set([
  "cta",
  "placement",
  "site_source",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_city",
  "om_cta",
  "om_funnel",
  "om_market",
  "eventid",
  "tm_event_id",
  "ticketmaster_event_id",
  "event_date",
  "tm_event_date",
  "eventdate",
  "ticketmaster_event_date",
]);

function isSafeMetaEntityId(value: string) {
  return /^\d{12,30}$/.test(value);
}

function isSafeTicketmasterEventId(value: string) {
  return /^[A-Za-z0-9_.:-]{8,240}$/.test(value) && /[A-Za-z]/.test(value);
}

function isSafeFacebookClickId(value: string) {
  return /^[A-Za-z0-9_-]{12,500}$/.test(value) && /[A-Za-z]/.test(value);
}

function isSafeFacebookCookie(value: string) {
  return /^fb\.\d+\.\d{10,13}\.[A-Za-z0-9_.:-]{1,500}$/.test(value);
}

export function sanitizeMarketingTrackingToken(value: unknown, maxLength = 160) {
  const cleaned = cleanText(value, maxLength);
  if (!cleaned) return undefined;
  if (hasUnsafeAttributionValue(cleaned) || ATTRIBUTION_PHONE_RE.test(cleaned) || /^https?:\/\//i.test(cleaned)) return undefined;
  if (!/^[A-Za-z0-9_.:-]{8,160}$/.test(cleaned)) return undefined;
  if (!/[A-Za-z_:-]/.test(cleaned)) return undefined;
  return cleaned;
}

export function cleanAttributionQueryValue(key: string, value: unknown, maxLength = 500) {
  const cleaned = cleanText(value, maxLength);
  if (!cleaned) return undefined;
  if (hasUnsafeAttributionValue(cleaned) || /^https?:\/\//i.test(cleaned)) return undefined;

  if (key === "fbclid") return isSafeFacebookClickId(cleaned) ? cleaned : undefined;
  if (FACEBOOK_COOKIE_QUERY_KEYS.has(key)) return isSafeFacebookCookie(cleaned) ? cleaned : undefined;
  if (META_ENTITY_ID_QUERY_KEYS.has(key)) return isSafeMetaEntityId(cleaned) ? cleaned : undefined;
  if (TICKETMASTER_EVENT_ID_QUERY_KEYS.has(key)) return isSafeTicketmasterEventId(cleaned) ? cleaned : undefined;
  if (DATE_QUERY_KEYS.has(key)) return /^\d{4}-\d{2}-\d{2}(?:[T ][0-9:.-]+Z?)?$/.test(cleaned) ? cleaned.slice(0, 50) : undefined;
  if (EVENT_ID_QUERY_KEYS.has(key) || CLICK_SESSION_QUERY_KEYS.has(key)) return sanitizeMarketingTrackingToken(cleaned, maxLength);
  if (TEXT_QUERY_KEYS.has(key)) {
    if (ATTRIBUTION_PHONE_RE.test(cleaned)) return undefined;
    return cleaned.replace(/[<>]/g, "").slice(0, 240);
  }
  if (SLUG_QUERY_KEYS.has(key)) {
    if (ATTRIBUTION_PHONE_RE.test(cleaned)) return undefined;
    return /^[A-Za-z0-9_.:-]{1,240}$/.test(cleaned) ? cleaned : undefined;
  }
  return undefined;
}

function safeDecodePathSegment(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function sanitizeMarketingPathname(pathname: string) {
  const sanitized = pathname.split("/").map((segment) => {
    if (!segment) return "";
    const decoded = safeDecodePathSegment(segment);
    if (hasUnsafeAttributionValue(decoded) || ATTRIBUTION_PHONE_RE.test(decoded)) return "redacted";
    return decoded.replace(/[^A-Za-z0-9_.~:-]+/g, "-").slice(0, 120) || "redacted";
  }).join("/");
  return sanitized.startsWith("/") ? sanitized : `/${sanitized}`;
}

export function cleanMarketingSlug(value: unknown, maxLength = 120) {
  const raw = cleanText(value, maxLength);
  if (!raw || hasUnsafeAttributionValue(raw) || ATTRIBUTION_PHONE_RE.test(raw)) return undefined;
  const cleaned = raw.toLowerCase().replace(/[^a-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "");
  return cleaned || undefined;
}

export function sanitizeMarketingUrlForStorage(value: unknown) {
  const raw = cleanText(value, 2000);
  if (!raw) return undefined;
  try {
    const parsed = new URL(raw);
    const sanitized = new URL(sanitizeMarketingPathname(parsed.pathname), parsed.origin);
    for (const key of SAFE_MARKETING_URL_QUERY_KEYS) {
      for (const paramValue of parsed.searchParams.getAll(key)) {
        const cleaned = cleanAttributionQueryValue(key, paramValue);
        if (cleaned) sanitized.searchParams.append(key, cleaned);
      }
    }
    return sanitized.toString().slice(0, 1000);
  } catch {
    return undefined;
  }
}

export function sanitizeMarketingReferrerForStorage(value: unknown) {
  const raw = cleanText(value, 2000);
  if (!raw) return undefined;
  try {
    return new URL(raw).origin.slice(0, 500);
  } catch {
    return undefined;
  }
}

function finiteNumber(value: unknown) {
  const numberValue = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

export function normalizeScrollDepthPct(value: unknown) {
  const numberValue = finiteNumber(value);
  if (numberValue == null) return undefined;
  const rounded = Math.round(numberValue);
  return SCROLL_DEPTHS.has(rounded) ? rounded : undefined;
}

export function normalizeVisibleRatio(value: unknown) {
  const numberValue = finiteNumber(value);
  if (numberValue == null) return undefined;
  return Math.min(1, Math.max(0, Math.round(numberValue * 10_000) / 10_000));
}

export function normalizeViewportDimension(value: unknown) {
  const numberValue = finiteNumber(value);
  if (numberValue == null) return undefined;
  const rounded = Math.round(numberValue);
  if (rounded < 1 || rounded > 10_000) return undefined;
  return rounded;
}

export function normalizeSampleRate(value: unknown) {
  const numberValue = finiteNumber(value);
  if (numberValue == null) return undefined;
  if (numberValue <= 0 || numberValue > 1) return undefined;
  return Math.round(numberValue * 100_000) / 100_000;
}

export function normalizeDeviceType(value: unknown): MarketingDeviceType | undefined {
  const cleaned = cleanMarketingSlug(value, 24) as MarketingDeviceType | undefined;
  return cleaned && DEVICE_TYPES.has(cleaned) ? cleaned : undefined;
}

export function normalizeViewportOrientation(value: unknown): MarketingViewportOrientation | undefined {
  const cleaned = cleanMarketingSlug(value, 24) as MarketingViewportOrientation | undefined;
  return cleaned && VIEWPORT_ORIENTATIONS.has(cleaned) ? cleaned : undefined;
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

export function paramFromParamsOrUrl(params: URLSearchParams, sourceUrl: string | undefined, names: string[]) {
  return firstParam(params, names) ?? firstParamFromUrlString(sourceUrl, names);
}

export function clickIdFromParamsOrUrl(params: URLSearchParams, sourceUrl: string | undefined) {
  return paramFromParamsOrUrl(params, sourceUrl, ["om_click_id", "click_id", "omc"]);
}

export function sessionIdFromParamsOrUrl(params: URLSearchParams, sourceUrl: string | undefined) {
  return paramFromParamsOrUrl(params, sourceUrl, ["om_session_id", "session_id", "oms"]);
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

const ATTRIBUTION_META_ID_KEYS = new Set<keyof MarketingAttribution>([
  "metaAdId",
  "metaAdsetId",
  "metaCampaignId",
]);
const ATTRIBUTION_TOKEN_KEYS = new Set<keyof MarketingAttribution>([
  "fbclid",
  "fbp",
  "fbc",
]);
const ATTRIBUTION_SLUG_KEYS = new Set<keyof MarketingAttribution>([
  "placement",
  "siteSource",
  "utmCampaign",
  "utmMedium",
  "utmSource",
  "utmTerm",
]);

function cleanAttributionValue(key: keyof MarketingAttribution, value: string | undefined, maxLength = 500) {
  const cleaned = cleanText(value, maxLength);
  if (!cleaned) return null;
  if (hasUnsafeAttributionValue(cleaned) || /^https?:\/\//i.test(cleaned)) return null;
  if (key === "fbclid") return isSafeFacebookClickId(cleaned) ? cleaned : null;
  if (key === "fbc" || key === "fbp") return isSafeFacebookCookie(cleaned) ? cleaned : null;
  if (ATTRIBUTION_META_ID_KEYS.has(key)) return isSafeMetaEntityId(cleaned) ? cleaned : null;
  if (ATTRIBUTION_TOKEN_KEYS.has(key)) return /^[A-Za-z0-9_.:-]{12,500}$/.test(cleaned) ? cleaned : null;
  if (ATTRIBUTION_PHONE_RE.test(cleaned)) return null;
  if (ATTRIBUTION_SLUG_KEYS.has(key)) {
    return /^[A-Za-z0-9_.:-]{1,240}$/.test(cleaned) ? cleaned : null;
  }
  return cleaned.replace(/[<>]/g, "").slice(0, maxLength);
}

export function sanitizeMarketingAttribution(attribution: MarketingAttribution | undefined): MarketingAttribution {
  return {
    fbclid: cleanAttributionValue("fbclid", attribution?.fbclid) ?? undefined,
    fbc: cleanAttributionValue("fbc", attribution?.fbc) ?? undefined,
    fbp: cleanAttributionValue("fbp", attribution?.fbp) ?? undefined,
    metaAdId: cleanAttributionValue("metaAdId", attribution?.metaAdId) ?? undefined,
    metaAdName: cleanAttributionValue("metaAdName", attribution?.metaAdName) ?? undefined,
    metaAdsetId: cleanAttributionValue("metaAdsetId", attribution?.metaAdsetId) ?? undefined,
    metaAdsetName: cleanAttributionValue("metaAdsetName", attribution?.metaAdsetName) ?? undefined,
    metaCampaignId: cleanAttributionValue("metaCampaignId", attribution?.metaCampaignId) ?? undefined,
    metaCampaignName: cleanAttributionValue("metaCampaignName", attribution?.metaCampaignName) ?? undefined,
    placement: cleanAttributionValue("placement", attribution?.placement) ?? undefined,
    siteSource: cleanAttributionValue("siteSource", attribution?.siteSource) ?? undefined,
    utmCampaign: cleanAttributionValue("utmCampaign", attribution?.utmCampaign) ?? undefined,
    utmContent: cleanAttributionValue("utmContent", attribution?.utmContent) ?? undefined,
    utmMedium: cleanAttributionValue("utmMedium", attribution?.utmMedium) ?? undefined,
    utmSource: cleanAttributionValue("utmSource", attribution?.utmSource) ?? undefined,
    utmTerm: cleanAttributionValue("utmTerm", attribution?.utmTerm) ?? undefined,
  };
}

export function rowFromAttribution(attribution: MarketingAttribution | undefined) {
  const sanitized = sanitizeMarketingAttribution(attribution);
  return {
    fbclid: sanitized.fbclid ?? null,
    fbc: sanitized.fbc ?? null,
    fbp: sanitized.fbp ?? null,
    meta_ad_id: sanitized.metaAdId ?? null,
    meta_ad_name: sanitized.metaAdName ?? null,
    meta_adset_id: sanitized.metaAdsetId ?? null,
    meta_adset_name: sanitized.metaAdsetName ?? null,
    meta_campaign_id: sanitized.metaCampaignId ?? null,
    meta_campaign_name: sanitized.metaCampaignName ?? null,
    placement: sanitized.placement ?? null,
    site_source: sanitized.siteSource ?? null,
    utm_campaign: sanitized.utmCampaign ?? null,
    utm_content: sanitized.utmContent ?? null,
    utm_medium: sanitized.utmMedium ?? null,
    utm_source: sanitized.utmSource ?? null,
    utm_term: sanitized.utmTerm ?? null,
  };
}

export async function recordMarketingAttributionEvent(input: MarketingAttributionEventInput, headers: Headers) {
  if (!supabaseAdmin) return;

  const clientIp = getClientIp(headers);
  const userAgent = cleanText(headers.get("user-agent"), 500);
  const row: MarketingAttributionEventRow = {
    ...rowFromAttribution(input.attribution),
    click_id: sanitizeMarketingTrackingToken(input.clickId) ?? null,
    client_event_id: sanitizeMarketingTrackingToken(input.clientEventId) ?? null,
    cta: cleanMarketingSlug(input.cta, 120) ?? null,
    device_type: normalizeDeviceType(input.deviceType) ?? null,
    event_name: input.eventName,
    funnel: cleanMarketingSlug(input.funnel, 120) ?? "unknown",
    landing_url: sanitizeMarketingUrlForStorage(input.landingUrl) ?? null,
    market: cleanMarketingSlug(input.market, 120) ?? null,
    metadata: safeMetadata(input.metadata),
    page_path: input.pagePath ? sanitizeMarketingPathname(input.pagePath).slice(0, 500) : null,
    referrer: sanitizeMarketingReferrerForStorage(input.referrer) ?? null,
    request_ip_hash: clientIp ? sha256(clientIp) : null,
    sample_rate: normalizeSampleRate(input.sampleRate) ?? 1,
    scroll_depth_pct: normalizeScrollDepthPct(input.scrollDepthPct) ?? null,
    section_id: cleanMarketingSlug(input.sectionId, 120) ?? null,
    session_id: sanitizeMarketingTrackingToken(input.sessionId) ?? null,
    source_url: sanitizeMarketingUrlForStorage(input.sourceUrl) ?? null,
    user_agent_hash: userAgent ? sha256(userAgent) : null,
    viewport_height: normalizeViewportDimension(input.viewportHeight) ?? null,
    viewport_orientation: normalizeViewportOrientation(input.viewportOrientation) ?? null,
    viewport_width: normalizeViewportDimension(input.viewportWidth) ?? null,
    visible_ratio: normalizeVisibleRatio(input.visibleRatio) ?? null,
  };

  const { error } = await supabaseAdmin
    .from("marketing_attribution_events")
    .insert(row);

  if (error) {
    console.error("[attribution] failed to record event:", error.message);
  }
}
