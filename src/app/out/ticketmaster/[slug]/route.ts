import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  ATTRIBUTION_QUERY_KEYS,
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
  const referrer = cleanText(request.headers.get("referer"), 1000);

  const target = new URL(destination.ticketmasterUrl);
  for (const key of ATTRIBUTION_QUERY_KEYS) {
    const value = cleanAttributionQueryValue(key, firstParam(incoming, [key]));
    if (value) target.searchParams.set(key, value);
  }

  target.searchParams.set("om_click_id", clickId);
  if (sessionId) target.searchParams.set("om_session_id", sessionId);
  if (cta) target.searchParams.set("om_cta", cta);
  target.searchParams.set("om_funnel", destination.funnel);
  target.searchParams.set("om_market", destination.market);
  target.searchParams.set("utm_source", cleanAttributionQueryValue("utm_source", firstParam(incoming, ["utm_source"])) ?? "meta");
  target.searchParams.set("utm_medium", cleanAttributionQueryValue("utm_medium", firstParam(incoming, ["utm_medium"])) ?? "paid_social");
  target.searchParams.set("utm_campaign", cleanAttributionQueryValue("utm_campaign", firstParam(incoming, ["utm_campaign"])) ?? destination.defaultUtmCampaign);
  target.searchParams.set("utm_content", cleanAttributionQueryValue("utm_content", firstParam(incoming, ["utm_content"])) ?? cta ?? "lp_default");

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
