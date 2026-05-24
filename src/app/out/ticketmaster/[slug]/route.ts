import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  attributionFromSearchParams,
  cleanAttributionQueryValue,
  cleanMarketingSlug,
  recordMarketingAttributionEvent,
  sanitizeMarketingTrackingToken,
} from "@/features/meta/attribution";
import { recordTicketmasterAttributionHandoff } from "@/features/meta/ticketmaster-attribution-handoff";

export const runtime = "nodejs";

const destinations = {
  "ataca-sergio-newark": {
    defaultUtmCampaign: "ataca_sergio_newark",
    eventId: "02006478E042F9B1",
    funnel: "ataca-sergio",
    market: "newark",
    ticketmasterUrl: "https://www.ticketmaster.com/event/02006478E042F9B1",
  },
} as const;

const REDIRECT_ATTRIBUTION_PARAMS: Array<[string, string[]]> = [
  ["campaign_id", ["campaign_id", "meta_campaign_id"]],
  ["campaign_name", ["campaign_name", "meta_campaign_name"]],
  ["adset_id", ["adset_id", "meta_adset_id"]],
  ["adset_name", ["adset_name", "meta_adset_name"]],
  ["ad_id", ["ad_id", "meta_ad_id"]],
  ["ad_name", ["ad_name", "meta_ad_name"]],
  ["placement", ["placement"]],
  ["site_source", ["site_source", "site_source_name"]],
  ["utm_source", ["utm_source"]],
  ["utm_medium", ["utm_medium"]],
  ["utm_campaign", ["utm_campaign"]],
  ["utm_content", ["utm_content"]],
  ["utm_term", ["utm_term"]],
  ["fbclid", ["fbclid"]],
  ["fbp", ["fbp"]],
  ["fbc", ["fbc"]],
];

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

function cleanText(value: string | null | undefined, maxLength = 500) {
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

function firstValidAttributionParam(params: URLSearchParams, key: string, names: string[]) {
  for (const name of names) {
    for (const rawValue of params.getAll(name)) {
      const value = cleanAttributionQueryValue(key, rawValue);
      if (value) return value;
    }
  }
  return undefined;
}

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const destination = destinations[slug as keyof typeof destinations];
  if (!destination) {
    return new Response("Not found", { status: 404 });
  }

  const requestUrl = new URL(request.url);
  const incoming = requestUrl.searchParams;
  const clickId = sanitizeMarketingTrackingToken(firstParam(incoming, ["om_click_id", "click_id", "omc"])) ?? `omc_${randomUUID()}`;
  const sessionId = sanitizeMarketingTrackingToken(firstParam(incoming, ["om_session_id", "session_id", "oms"]));
  const cta = cleanMarketingSlug(firstParam(incoming, ["cta"]));
  const attribution = attributionFromSearchParams(incoming);
  const metaAdIdForCfc = firstValidAttributionParam(incoming, "ad_id", ["ad_id", "meta_ad_id"]);
  const fallbackCfc = firstValidAttributionParam(incoming, "utm_content", ["utm_content"]);
  const referrer = cleanText(request.headers.get("referer"), 1000);

  const target = new URL(destination.ticketmasterUrl);
  for (const [key, names] of REDIRECT_ATTRIBUTION_PARAMS) {
    const value = firstValidAttributionParam(incoming, key, names);
    if (value) target.searchParams.set(key, value);
  }

  target.searchParams.set("om_click_id", clickId);
  if (sessionId) target.searchParams.set("om_session_id", sessionId);
  if (cta) target.searchParams.set("om_cta", cta);
  target.searchParams.set("om_funnel", destination.funnel);
  target.searchParams.set("om_market", destination.market);
  target.searchParams.set("eventid", destination.eventId);
  target.searchParams.set("tm_event_id", destination.eventId);
  target.searchParams.set("ticketmaster_event_id", destination.eventId);
  target.searchParams.set("utm_source", firstValidAttributionParam(incoming, "utm_source", ["utm_source"]) ?? "meta");
  target.searchParams.set("utm_medium", firstValidAttributionParam(incoming, "utm_medium", ["utm_medium"]) ?? "paid_social");
  target.searchParams.set("utm_campaign", firstValidAttributionParam(incoming, "utm_campaign", ["utm_campaign"]) ?? destination.defaultUtmCampaign);
  target.searchParams.set("utm_content", metaAdIdForCfc ?? fallbackCfc ?? cta ?? "lp_default");

  const attributionWrites = await Promise.allSettled([
    recordTicketmasterAttributionHandoff(
      {
        attribution,
        clickId,
        cta,
        destinationUrl: target.toString(),
        funnel: destination.funnel,
        market: destination.market,
        metadata: {
          destination: "ticketmaster",
          ticketmaster_event_id: destination.eventId,
        },
        referrer,
        sessionId,
        sourceUrl: requestUrl.toString(),
        ticketmasterEventId: destination.eventId,
      },
      request.headers,
    ),
    recordMarketingAttributionEvent(
      {
        attribution,
        clickId,
        cta,
        eventName: "ticket_redirect",
        funnel: destination.funnel,
        market: destination.market,
        metadata: {
          destination: "ticketmaster",
          ticketmaster_event_id: destination.eventId,
        },
        referrer,
        sessionId,
        sourceUrl: requestUrl.toString(),
      },
      request.headers,
    ),
  ]);

  for (const write of attributionWrites) {
    if (write.status === "rejected") console.error("[ticketmaster:redirect] attribution write failed", write.reason);
  }

  const response = NextResponse.redirect(target.toString(), { status: 302 });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
