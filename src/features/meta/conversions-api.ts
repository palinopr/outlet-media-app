import { createHash } from "node:crypto";
import { META_API_VERSION } from "@/lib/constants";

const DEFAULT_ATACA_SERGIO_PIXEL_ID = "1553637492361321";
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
  eventId?: string;
  eventName: string;
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

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
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
    firstParam(url.searchParams, ["source_url", "event_source_url", "page_url"]) ??
    cleanText(headers.get("referer"), 500) ??
    `${url.origin}${url.pathname}`
  );
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
  const ticketmasterEventId = firstParam(params, ["tm_event_id", "eventid", "ticketmaster_event_id"]);
  const ticketmasterEventName = firstParam(params, ["tm_event_name", "eventname", "ticketmaster_event_name"]);
  const ticketmasterEventDate = firstParam(params, ["tm_event_date", "eventdate", "ticketmaster_event_date"]);
  const contentId = ticketmasterEventId ?? DEFAULT_ATACA_SERGIO_CONTENT_ID;
  const contentName = ticketmasterEventName ?? DEFAULT_CONTENT_NAME;
  const sourceUrl = sourceUrlFromRequest(url, headers);
  const clientIp = getClientIp(headers);
  const clientUserAgent = cleanText(headers.get("user-agent"), 500);
  const logBase: TicketmasterCapiLogFields = {
    billingState: firstParam(params, ["state", "st", "billing_state"]),
    billingZip: firstParam(params, ["zip", "zp", "zipcode", "postal_code", "billing_zip"]),
    country: firstParam(params, ["country", "country_code"]),
    currency,
    eventName,
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

  const fbclid = fbclidFrom(url, headers);
  const providedFbc = firstParam(params, ["fbc"]);
  const providedFbp = firstParam(params, ["fbp"]);
  const userData: MetaUserData = {
    client_ip_address: clientIp,
    client_user_agent: clientUserAgent,
    fbc: providedFbc ?? (fbclid ? `fb.1.${now.getTime()}.${fbclid}` : undefined),
    fbp: providedFbp,
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

  const explicitEventId = firstParam(params, ["meta_event_id", "dedupe_event_id"]);
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
