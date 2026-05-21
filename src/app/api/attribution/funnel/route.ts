import { NextResponse } from "next/server";
import {
  attributionFromSearchParams,
  cleanMarketingSlug,
  mergeAttribution,
  normalizeMarketingEventName,
  normalizeScrollDepthPct,
  normalizeViewportDimension,
  normalizeVisibleRatio,
  recordMarketingAttributionEvent,
  sanitizeMarketingReferrerForStorage,
  sanitizeMarketingUrlForStorage,
  type MarketingAttribution,
} from "@/features/meta/attribution";
import { enforceContentLength, enforceRateLimit } from "@/lib/request-guards";

export const runtime = "nodejs";

const ACTIVE_FUNNEL_MARKETS = new Map([
  ["ataca-sergio", new Set(["newark"])],
  ["9am", new Set(["orlando", "philadelphia", "dc", "atlanta"])],
]);

function cleanText(value: unknown, maxLength = 500) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLength);
}

function firstValue(input: Record<string, unknown>, names: string[]) {
  for (const name of names) {
    const value = input[name];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function numberValue(input: Record<string, unknown>, names: string[]) {
  const value = firstValue(input, names);
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
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

function activeFunnelMarket(funnel: string | undefined, market: string | undefined) {
  if (!funnel || !market) return false;
  return ACTIVE_FUNNEL_MARKETS.get(funnel)?.has(market) ?? false;
}

function metadataScalar(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "boolean") return value;
  return cleanMarketingSlug(value, 120);
}

function safeFunnelMetadata(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const input = value as Record<string, unknown>;
  const output: Record<string, unknown> = {};
  for (const key of ["source", "destination", "reason"] as const) {
    const cleaned = metadataScalar(input[key]);
    if (cleaned !== undefined) output[key] = cleaned;
  }
  const depth = normalizeScrollDepthPct(input.depth);
  if (depth) output.depth = depth;
  return output;
}

export async function POST(request: Request) {
  const contentLengthError = enforceContentLength(request, 16_000);
  if (contentLengthError) return contentLengthError;

  const rateLimitError = enforceRateLimit(request, {
    limit: 300,
    scope: "attribution-funnel",
    windowMs: 60_000,
  });
  if (rateLimitError) return rateLimitError;

  let body: Record<string, unknown>;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > 16_000) {
      return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
    }
    body = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const eventName = normalizeMarketingEventName(body.event_name ?? body.eventName);
  if (!eventName || eventName === "ticket_redirect") {
    return NextResponse.json({ error: "invalid_event_name" }, { status: 400 });
  }

  const metadata = safeFunnelMetadata(body.metadata);
  const funnel = cleanMarketingSlug(body.funnel, 120);
  const market = cleanMarketingSlug(body.market, 120);
  if (!funnel || !market || !activeFunnelMarket(funnel, market)) {
    return NextResponse.json({ error: "invalid_funnel" }, { status: 400 });
  }

  const sourceUrlRaw = firstValue(body, ["source_url", "sourceUrl", "page_url", "pageUrl"]);
  const sourceUrl = sanitizeMarketingUrlForStorage(sourceUrlRaw);
  const landingUrl = sanitizeMarketingUrlForStorage(firstValue(body, ["landing_url", "landingUrl"])) ?? sourceUrl;
  const referrer = sanitizeMarketingReferrerForStorage(body.referrer);
  let sourceAttribution: MarketingAttribution = {};
  let pagePath: string | undefined;
  if (typeof sourceUrlRaw === "string") {
    try {
      const parsed = new URL(sourceUrlRaw);
      sourceAttribution = attributionFromSearchParams(parsed.searchParams);
      pagePath = parsed.pathname;
    } catch {
      // Ignore malformed source URLs. Sanitized storage will omit them.
    }
  }

  const scrollDepthPct = normalizeScrollDepthPct(
    numberValue(body, ["scroll_depth_pct", "scrollDepthPct", "scroll_depth", "scrollDepth"]) ?? metadata.depth,
  );

  await recordMarketingAttributionEvent(
    {
      attribution: mergeAttribution(sourceAttribution, attributionFromBody(body.attribution)),
      clickId: cleanText(firstValue(body, ["click_id", "clickId", "om_click_id"]), 160),
      clientEventId: cleanText(firstValue(body, ["client_event_id", "clientEventId"]), 160),
      cta: cleanMarketingSlug(firstValue(body, ["cta", "om_cta"]), 120),
      deviceType: cleanMarketingSlug(firstValue(body, ["device_type", "deviceType"]), 24),
      eventName,
      funnel,
      landingUrl,
      market,
      metadata,
      pagePath: cleanText(firstValue(body, ["page_path", "pagePath"]), 500) ?? pagePath,
      referrer,
      sampleRate: 1,
      scrollDepthPct,
      sectionId: cleanMarketingSlug(firstValue(body, ["section_id", "sectionId"]), 120),
      sessionId: cleanText(firstValue(body, ["session_id", "sessionId", "om_session_id"]), 160),
      sourceUrl,
      viewportHeight: normalizeViewportDimension(numberValue(body, ["viewport_height", "viewportHeight"])),
      viewportOrientation: cleanMarketingSlug(firstValue(body, ["viewport_orientation", "viewportOrientation"]), 24),
      viewportWidth: normalizeViewportDimension(numberValue(body, ["viewport_width", "viewportWidth"])),
      visibleRatio: normalizeVisibleRatio(numberValue(body, ["visible_ratio", "visibleRatio"])),
    },
    request.headers,
  );

  return new Response(null, {
    headers: { "Cache-Control": "no-store" },
    status: 204,
  });
}
