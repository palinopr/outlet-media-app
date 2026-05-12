import { NextResponse } from "next/server";
import {
  attributionFromSearchParams,
  mergeAttribution,
  normalizeMarketingEventName,
  recordMarketingAttributionEvent,
  type MarketingAttribution,
} from "@/features/meta/attribution";

export const runtime = "nodejs";

function cleanText(value: unknown, maxLength = 500) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLength);
}

function attributionFromBody(value: unknown): MarketingAttribution {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const input = value as Record<string, unknown>;
  return {
    fbclid: cleanText(input.fbclid),
    fbc: cleanText(input.fbc),
    fbp: cleanText(input.fbp),
    metaAdId: cleanText(input.metaAdId ?? input.ad_id),
    metaAdName: cleanText(input.metaAdName ?? input.ad_name),
    metaAdsetId: cleanText(input.metaAdsetId ?? input.adset_id),
    metaAdsetName: cleanText(input.metaAdsetName ?? input.adset_name),
    metaCampaignId: cleanText(input.metaCampaignId ?? input.campaign_id),
    metaCampaignName: cleanText(input.metaCampaignName ?? input.campaign_name),
    placement: cleanText(input.placement),
    siteSource: cleanText(input.siteSource ?? input.site_source),
    utmCampaign: cleanText(input.utmCampaign ?? input.utm_campaign),
    utmContent: cleanText(input.utmContent ?? input.utm_content),
    utmMedium: cleanText(input.utmMedium ?? input.utm_medium),
    utmSource: cleanText(input.utmSource ?? input.utm_source),
    utmTerm: cleanText(input.utmTerm ?? input.utm_term),
  };
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 16_000) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const eventName = normalizeMarketingEventName(body.event_name ?? body.eventName);
  if (!eventName) {
    return NextResponse.json({ error: "invalid_event_name" }, { status: 400 });
  }

  const sourceUrl = cleanText(body.source_url ?? body.sourceUrl ?? body.page_url ?? body.pageUrl, 1000);
  let sourceAttribution: MarketingAttribution = {};
  let pagePath: string | undefined;
  if (sourceUrl) {
    try {
      const parsed = new URL(sourceUrl);
      sourceAttribution = attributionFromSearchParams(parsed.searchParams);
      pagePath = parsed.pathname;
    } catch {
      // Ignore malformed source URLs. The raw sanitized URL can still be stored.
    }
  }

  await recordMarketingAttributionEvent(
    {
      attribution: mergeAttribution(sourceAttribution, attributionFromBody(body.attribution)),
      clickId: cleanText(body.click_id ?? body.clickId ?? body.om_click_id, 160),
      cta: cleanText(body.cta, 120),
      eventName,
      funnel: cleanText(body.funnel, 120) ?? "unknown",
      landingUrl: cleanText(body.landing_url ?? body.landingUrl, 1000),
      market: cleanText(body.market, 120),
      metadata: body.metadata && typeof body.metadata === "object" ? body.metadata as Record<string, unknown> : {},
      pagePath: cleanText(body.page_path ?? body.pagePath, 500) ?? pagePath,
      referrer: cleanText(body.referrer, 1000),
      sessionId: cleanText(body.session_id ?? body.sessionId ?? body.om_session_id, 160),
      sourceUrl,
    },
    request.headers,
  );

  return new Response(null, {
    headers: { "Cache-Control": "no-store" },
    status: 204,
  });
}
