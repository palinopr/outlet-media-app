import {
  attributionFromSearchParams,
  attributionFromUrlString,
  cleanAttributionQueryValue,
  cleanMarketingSlug,
  clickIdFromParamsOrUrl,
  mergeAttribution,
  paramFromParamsOrUrl,
  sanitizeMarketingAttribution,
  sanitizeMarketingPathname,
  sanitizeMarketingTrackingToken,
  sessionIdFromParamsOrUrl,
  type MarketingAttribution,
} from "@/features/meta/attribution";
import { META_API_VERSION } from "@/lib/constants";
import { sha256 } from "@/lib/hash";

const DEFAULT_ATACA_SERGIO_PIXEL_ID = "1553637492361321";
const DEFAULT_ATACA_SERGIO_EVENT_ID = "02006478E042F9B1";
const DEFAULT_ATACA_SERGIO_CONTENT_ID = "ataca-sergio-newark-2026-05-30";
const DEFAULT_CONTENT_NAME = "Festival Ataca Sergio";

const ALLOWED_STANDARD_EVENTS = new Set([
  "Purchase",
  "InitiateCheckout",
  "ViewContent",
  "Lead",
  "AddToCart",
]);

type MetaUserData = {
  client_ip_address?: string;
  client_user_agent?: string;
  ct?: string[];
  country?: string[];
  em?: string[];
  fbc?: string;
  fbp?: string;
  fn?: string[];
  ln?: string[];
  ph?: string[];
  st?: string[];
  zp?: string[];
};

type MetaCustomData = {
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  contents?: Array<{ id: string; quantity?: number; item_price?: number }>;
  currency?: string;
  event_date?: string;
  num_items?: number;
  order_id?: string;
  value?: number;
};

export type MetaCapiEvent = {
  action_source: "website";
  custom_data?: MetaCustomData;
  event_id: string;
  event_name: string;
  event_source_url?: string;
  event_time: number;
  user_data: MetaUserData;
};

export type TicketmasterCapiLogFields = {
  billingState?: string;
  billingZip?: string;
  country?: string;
  currency?: string;
  attribution?: MarketingAttribution;
  cta?: string;
  eventId?: string;
  eventName: string;
  funnel?: string;
  hitAt?: string;
  market?: string;
  omClickId?: string;
  omSessionId?: string;
  orderHash?: string;
  orderId?: string;
  quantity?: number;
  requestIpHash?: string;
  sourceUrl?: string;
  ticketmasterEventDate?: string;
  ticketmasterEventId?: string;
  ticketmasterEventName?: string;
  userAgentHash?: string;
  value?: number;
};

type BuildTicketmasterCapiEventResult =
  | { event: MetaCapiEvent; log: TicketmasterCapiLogFields; skipReason: null }
  | { event: null; log: TicketmasterCapiLogFields; skipReason: string };

export type MetaCapiSendResult = {
  body: unknown;
  ok: boolean;
  status: number;
};

function cleanText(value: string | null | undefined, maxLength = 240) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLength);
}

function firstParam(params: URLSearchParams, names: string[]) {
  for (const name of names) {
    const value = cleanText(params.get(name));
    if (value) return value;
  }
  return undefined;
}

function parseAmount(value: string | undefined) {
  if (!value) return undefined;
  const normalized = value.replace(/[$,\s]/g, "");
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < 0) return undefined;
  return Math.round(parsed * 100) / 100;
}

function parsePositiveInteger(value: string | undefined) {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined;
  return parsed;
}

function normalizeForHash(value: string, kind: "email" | "phone" | "text") {
  const trimmed = value.trim().toLowerCase();
  if (kind === "phone") return trimmed.replace(/[^0-9]/g, "");
  return trimmed;
}

function hashedParam(params: URLSearchParams, names: string[], kind: "email" | "phone" | "text") {
  const value = firstParam(params, names);
  if (!value) return undefined;
  const normalized = normalizeForHash(value, kind);
  return normalized ? [sha256(normalized)] : undefined;
}

function getClientIp(headers: Headers) {
  const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = headers.get("x-real-ip")?.trim();
  const cfIp = headers.get("cf-connecting-ip")?.trim();
  return forwardedFor || realIp || cfIp || undefined;
}

function sourceUrlFromRequest(url: URL, headers: Headers) {
  return (
    cleanText(url.searchParams.get("source_url"), 1000) ??
    cleanText(url.searchParams.get("event_source_url"), 1000) ??
    cleanText(url.searchParams.get("page_url"), 1000) ??
    cleanText(headers.get("referer"), 1000) ??
    `${url.origin}${url.pathname}`
  );
}

const SAFE_CAPI_SOURCE_URL_QUERY_KEYS = new Set([
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
  "om_click_id",
  "om_session_id",
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

const NESTED_SAFE_SOURCE_URL_QUERY_KEYS = new Set(["edp", "source_url", "event_source_url", "page_url"]);
const STRICT_SLUG_SOURCE_URL_QUERY_KEYS = new Set([
  "campaign_id",
  "adset_id",
  "ad_id",
  "placement",
  "site_source",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "om_click_id",
  "om_session_id",
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
const MARKETING_TEXT_SOURCE_URL_QUERY_KEYS = new Set(["campaign_name", "adset_name", "ad_name", "utm_content"]);
const FACEBOOK_COOKIE_SOURCE_URL_QUERY_KEYS = new Set(["fbclid", "fbp", "fbc"]);

function safeCapiSourcePath(parsed: URL) {
  const hostname = parsed.hostname.toLowerCase();
  const pathname = parsed.pathname.toLowerCase();
  const isTicketmasterHost = hostname === "ticketmaster.com" || hostname.endsWith(".ticketmaster.com");
  const isCheckoutHost = hostname.startsWith("checkout.") || hostname.includes("checkout");
  const sensitivePath = pathname.match(/\/(order-confirmation|confirm(?:ation)?|confirmation|checkout|orders?|receipts?|receipt|purchase|payment)(?:[-_/]|$)/);

  if (sensitivePath) {
    const label = sensitivePath[1].startsWith("confirm") || sensitivePath[1] === "order-confirmation"
      ? "confirmation"
      : sensitivePath[1].replace(/s$/, "");
    return `/${label}`;
  }
  if (isTicketmasterHost && isCheckoutHost) return "/checkout";

  return sanitizeMarketingPathname(parsed.pathname);
}

function cleanSafeCapiSourceQueryValue(key: string, value: string | null) {
  if (key === "om_cta") return cleanAttributionQueryValue("cta", value);
  if (STRICT_SLUG_SOURCE_URL_QUERY_KEYS.has(key) || FACEBOOK_COOKIE_SOURCE_URL_QUERY_KEYS.has(key) || MARKETING_TEXT_SOURCE_URL_QUERY_KEYS.has(key)) {
    return cleanAttributionQueryValue(key, value);
  }
  return undefined;
}

export function sanitizeTicketmasterCapiSourceUrl(value: string | undefined, depth = 0): string | undefined {
  if (!value || depth > 2) return undefined;
  try {
    const parsed = new URL(value);
    const sanitized = new URL(safeCapiSourcePath(parsed), parsed.origin);

    for (const key of SAFE_CAPI_SOURCE_URL_QUERY_KEYS) {
      for (const paramValue of parsed.searchParams.getAll(key)) {
        const cleaned = cleanSafeCapiSourceQueryValue(key, paramValue);
        if (cleaned) sanitized.searchParams.append(key, cleaned);
      }
    }

    for (const key of NESTED_SAFE_SOURCE_URL_QUERY_KEYS) {
      for (const paramValue of parsed.searchParams.getAll(key)) {
        const nested = sanitizeTicketmasterCapiSourceUrl(cleanText(paramValue, 1000), depth + 1);
        if (nested) sanitized.searchParams.append(key, nested);
      }
    }

    return sanitized.toString().slice(0, 1000);
  } catch {
    return undefined;
  }
}

function fbclidFrom(url: URL, headers: Headers) {
  const direct = firstParam(url.searchParams, ["fbclid"]);
  if (direct) return direct;

  const referer = headers.get("referer");
  if (!referer) return undefined;

  try {
    return cleanText(new URL(referer).searchParams.get("fbclid"));
  } catch {
    return undefined;
  }
}

function eventNameFrom(params: URLSearchParams) {
  const requested = firstParam(params, ["meta_event_name", "meta_event", "ev"]);
  if (!requested) return "Purchase";
  return ALLOWED_STANDARD_EVENTS.has(requested) ? requested : "Purchase";
}

function attributionFromTicketmasterCfc(params: URLSearchParams, rawSourceUrl: string | undefined) {
  const baseAttribution = mergeAttribution(
    attributionFromUrlString(rawSourceUrl),
    attributionFromSearchParams(params),
  );
  const cfcAdId = cleanAttributionQueryValue("ad_id", paramFromParamsOrUrl(params, rawSourceUrl, ["utm_content"]));
  const existingAdId = cleanAttributionQueryValue("ad_id", baseAttribution.metaAdId);
  if (!cfcAdId || existingAdId) return baseAttribution;

  return mergeAttribution(baseAttribution, { metaAdId: cfcAdId });
}

function ticketmasterEventIdFromUrlString(value: string | undefined, depth = 0): string | undefined {
  if (!value || depth > 2) return undefined;
  try {
    const parsed = new URL(value);
    const pathMatch = parsed.pathname.match(/\/event\/([A-Za-z0-9_.:-]{8,240})/i);
    const pathId = cleanAttributionQueryValue("ticketmaster_event_id", pathMatch?.[1]);
    if (pathId) return pathId;
    for (const key of NESTED_SAFE_SOURCE_URL_QUERY_KEYS) {
      for (const nested of parsed.searchParams.getAll(key)) {
        const found = ticketmasterEventIdFromUrlString(cleanText(nested, 1000), depth + 1);
        if (found) return found;
      }
    }
  } catch {
    return undefined;
  }
  return undefined;
}

export function getMetaCapiConfig() {
  return {
    accessToken: process.env.META_CAPI_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN || "",
    pixelId:
      process.env.META_CAPI_PIXEL_ID ||
      process.env.META_PIXEL_ID ||
      process.env.NEXT_PUBLIC_META_PIXEL_ID ||
      DEFAULT_ATACA_SERGIO_PIXEL_ID,
    pixelSecret: process.env.TICKETMASTER_CAPI_PIXEL_SECRET || "",
    testEventCode: process.env.META_CAPI_TEST_EVENT_CODE || "",
  };
}

export function buildTicketmasterCapiEvent(url: URL, headers: Headers, now = new Date()): BuildTicketmasterCapiEventResult {
  const params = url.searchParams;
  const eventName = eventNameFrom(params);
  const eventTime = Math.floor(now.getTime() / 1000);
  const orderId = firstParam(params, ["order_id", "orderid", "order", "confirmation", "confirmation_code"]);
  const value = parseAmount(firstParam(params, ["value", "revenue", "face_value", "ordertotal", "order_total"]));
  const currency = (firstParam(params, ["currency"]) ?? "USD").slice(0, 3).toUpperCase();
  const quantity = parsePositiveInteger(firstParam(params, ["quantity", "qty", "num_items", "tickets"]));
  const rawSourceUrl = sourceUrlFromRequest(url, headers);
  const ticketmasterEventId = cleanAttributionQueryValue("ticketmaster_event_id", paramFromParamsOrUrl(params, rawSourceUrl, ["tm_event_id", "eventid", "ticketmaster_event_id"]))
    ?? ticketmasterEventIdFromUrlString(rawSourceUrl);
  const ticketmasterEventName = cleanAttributionQueryValue("utm_content", paramFromParamsOrUrl(params, rawSourceUrl, ["tm_event_name", "eventname", "ticketmaster_event_name"]));
  const ticketmasterEventDate = cleanAttributionQueryValue("event_date", paramFromParamsOrUrl(params, rawSourceUrl, ["tm_event_date", "eventdate", "ticketmaster_event_date"]));
  const contentId = ticketmasterEventId ?? DEFAULT_ATACA_SERGIO_CONTENT_ID;
  const contentName = ticketmasterEventName ?? DEFAULT_CONTENT_NAME;
  const sourceUrl = sanitizeTicketmasterCapiSourceUrl(rawSourceUrl) ?? `${url.origin}${url.pathname}`;
  const attribution = attributionFromTicketmasterCfc(params, rawSourceUrl);
  const omClickId = sanitizeMarketingTrackingToken(clickIdFromParamsOrUrl(params, rawSourceUrl));
  const omSessionId = sanitizeMarketingTrackingToken(sessionIdFromParamsOrUrl(params, rawSourceUrl));
  const funnel = cleanMarketingSlug(paramFromParamsOrUrl(params, rawSourceUrl, ["om_funnel", "funnel"]))
    ?? (ticketmasterEventId === DEFAULT_ATACA_SERGIO_EVENT_ID ? "ataca-sergio" : undefined);
  const market = cleanMarketingSlug(paramFromParamsOrUrl(params, rawSourceUrl, ["om_market", "market", "utm_city"]))
    ?? (ticketmasterEventId === DEFAULT_ATACA_SERGIO_EVENT_ID ? "newark" : undefined);
  const cta = cleanMarketingSlug(paramFromParamsOrUrl(params, rawSourceUrl, ["om_cta", "cta"]));
  const clientIp = getClientIp(headers);
  const clientUserAgent = cleanText(headers.get("user-agent"), 500);
  const logBase: TicketmasterCapiLogFields = {
    currency,
    attribution,
    cta,
    eventName,
    funnel,
    hitAt: now.toISOString(),
    market,
    omClickId,
    omSessionId,
    orderHash: orderId ? sha256(orderId) : undefined,
    orderId,
    quantity,
    requestIpHash: clientIp ? sha256(clientIp) : undefined,
    sourceUrl,
    ticketmasterEventDate,
    ticketmasterEventId,
    ticketmasterEventName: contentName,
    userAgentHash: clientUserAgent ? sha256(clientUserAgent) : undefined,
    value,
  };

  if (eventName === "Purchase" && !orderId) {
    return { event: null, log: logBase, skipReason: "missing_order_id" };
  }
  if (eventName === "Purchase" && value === undefined) {
    return { event: null, log: logBase, skipReason: "missing_value" };
  }

  const fbParams = sanitizeMarketingAttribution({
    fbclid: paramFromParamsOrUrl(params, rawSourceUrl, ["fbclid"]) ?? fbclidFrom(url, headers),
    fbc: paramFromParamsOrUrl(params, rawSourceUrl, ["fbc"]),
    fbp: paramFromParamsOrUrl(params, rawSourceUrl, ["fbp"]),
  });
  const userData: MetaUserData = {
    client_ip_address: clientIp,
    client_user_agent: clientUserAgent,
    fbc: fbParams.fbc ?? (fbParams.fbclid ? `fb.1.${now.getTime()}.${fbParams.fbclid}` : undefined),
    fbp: fbParams.fbp,
    em: hashedParam(params, ["em", "email"], "email"),
    ph: hashedParam(params, ["ph", "phone"], "phone"),
    fn: hashedParam(params, ["fn", "first_name", "firstname"], "text"),
    ln: hashedParam(params, ["ln", "last_name", "lastname"], "text"),
    ct: hashedParam(params, ["ct", "city"], "text"),
    st: hashedParam(params, ["st", "state"], "text"),
    zp: hashedParam(params, ["zp", "zip", "zipcode", "postal_code"], "text"),
    country: hashedParam(params, ["country", "country_code"], "text"),
  };

  const customData: MetaCustomData = {
    content_ids: [contentId],
    content_name: contentName,
    content_type: "product",
    contents: [
      {
        id: contentId,
        item_price: value,
        quantity,
      },
    ],
    currency,
    event_date: ticketmasterEventDate,
    num_items: quantity,
    order_id: orderId,
    value,
  };

  const explicitEventId = cleanAttributionQueryValue("meta_event_id", firstParam(params, ["meta_event_id", "dedupe_event_id"]));
  const eventId = explicitEventId ?? `tm_${sha256(`${eventName}:${orderId ?? "no-order"}:${contentId}:${value ?? "no-value"}`).slice(0, 32)}`;

  return {
    event: {
      action_source: "website",
      custom_data: JSON.parse(JSON.stringify(customData)) as MetaCustomData,
      event_id: eventId,
      event_name: eventName,
      event_source_url: sourceUrl,
      event_time: eventTime,
      user_data: JSON.parse(JSON.stringify(userData)) as MetaUserData,
    },
    log: { ...logBase, eventId },
    skipReason: null,
  };
}

export async function sendMetaCapiEvent(input: {
  accessToken: string;
  event: MetaCapiEvent;
  pixelId: string;
  testEventCode?: string;
}): Promise<MetaCapiSendResult> {
  const endpoint = new URL(`https://graph.facebook.com/${META_API_VERSION}/${input.pixelId}/events`);
  endpoint.searchParams.set("access_token", input.accessToken);

  const response = await fetch(endpoint.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: [input.event],
      ...(input.testEventCode ? { test_event_code: input.testEventCode } : {}),
    }),
  });

  const text = await response.text();
  let body: unknown = text;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!response.ok || (body && typeof body === "object" && "error" in body)) {
    const errorMessage = body && typeof body === "object" && "error" in body
      ? JSON.stringify((body as { error: unknown }).error)
      : text;
    console.error(`[meta:capi] HTTP ${response.status}${errorMessage ? ` ${errorMessage}` : ""}`);
  }

  return { body, ok: response.ok, status: response.status };
}
