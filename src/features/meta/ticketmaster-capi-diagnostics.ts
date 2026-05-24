import { cleanAttributionQueryValue } from "./attribution";

type TicketmasterCapiDiagnosticEvent = {
  attribution_match_confidence: string | null;
  attribution_match_method: string | null;
  event_name: string;
  is_test: boolean;
  meta_ad_id: string | null;
  meta_adset_id: string | null;
  meta_campaign_id: string | null;
  meta_ok: boolean;
  funnel?: string | null;
  market?: string | null;
  quantity: number | null;
  skip_reason: string | null;
  source_url: string | null;
  ticketmaster_event_id?: string | null;
  ticketmaster_event_name?: string | null;
  utm_content?: string | null;
  value: number | string | null;
};

export type TicketmasterCapiMatchingSummary = {
  acceptedCount: number;
  acceptedRate: number;
  adLevelCoverageRate: number;
  cfcCandidateCount: number;
  confidenceCounts: Record<"deterministic" | "high" | "medium" | "low" | "unknown", number>;
  directMetaObjectCount: number;
  directTicketmasterParamCount: number;
  handoffDerivedCount: number;
  nextAction: string;
  optimizationGradeCount: number;
  purchaseCount: number;
  revenue: number;
  status: "healthy" | "accepted_without_direct_matching" | "accepted_without_optimization_grade_matching" | "acceptance_issue" | "waiting_for_purchases";
  tickets: number;
  unknownCount: number;
};

export type TicketmasterCapiEventMatchingBreakdown = TicketmasterCapiMatchingSummary & {
  eventId: string | null;
  funnel: string | null;
  key: string;
  market: string | null;
  name: string;
};

const NESTED_SOURCE_URL_KEYS = ["edp", "source_url", "event_source_url", "page_url"];

export function numericCapiValue(value: number | string | null) {
  if (value === null || value === undefined) return 0;
  const parsed = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(parsed) ? parsed : 0;
}

export function isValidMetaEntityId(value: string | null | undefined) {
  return typeof value === "string" && /^\d{12,30}$/.test(value);
}

function normalizedConfidence(value: string | null | undefined): keyof TicketmasterCapiMatchingSummary["confidenceCounts"] {
  if (value === "deterministic" || value === "high" || value === "medium" || value === "low") return value;
  return "unknown";
}

function isCoveredPurchase(event: TicketmasterCapiDiagnosticEvent) {
  return event.event_name === "Purchase" && !event.is_test && !event.skip_reason && numericCapiValue(event.value) > 0;
}

function firstValidMetaParamFromUrl(value: string | null | undefined, names: string[], depth = 0): string | null {
  if (!value || depth > 2) return null;
  try {
    const parsed = new URL(value);
    for (const name of names) {
      const candidate = parsed.searchParams.get(name);
      if (isValidMetaEntityId(candidate)) return candidate;
    }
    for (const key of NESTED_SOURCE_URL_KEYS) {
      for (const nested of parsed.searchParams.getAll(key)) {
        const found = firstValidMetaParamFromUrl(nested, names, depth + 1);
        if (found) return found;
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function hasDirectMetaObject(event: TicketmasterCapiDiagnosticEvent) {
  return Boolean(
    isValidMetaEntityId(event.meta_ad_id)
      || isValidMetaEntityId(event.meta_adset_id)
      || isValidMetaEntityId(event.meta_campaign_id),
  );
}

export function hasValidCfcCandidate(event: TicketmasterCapiDiagnosticEvent) {
  return Boolean(
    isValidMetaEntityId(event.utm_content)
      || firstValidMetaParamFromUrl(event.source_url, ["ad_id", "meta_ad_id"]),
  );
}

export function buildTicketmasterCapiMatchingSummary(events: TicketmasterCapiDiagnosticEvent[]): TicketmasterCapiMatchingSummary {
  const purchases = events.filter(isCoveredPurchase);
  const accepted = purchases.filter((event) => event.meta_ok);
  const confidenceCounts = {
    deterministic: 0,
    high: 0,
    medium: 0,
    low: 0,
    unknown: 0,
  };

  let directTicketmasterParamCount = 0;
  let directMetaObjectCount = 0;
  let cfcCandidateCount = 0;
  let handoffDerivedCount = 0;
  let optimizationGradeCount = 0;
  let revenue = 0;
  let tickets = 0;

  for (const event of accepted) {
    const confidence = normalizedConfidence(event.attribution_match_confidence);
    confidenceCounts[confidence] += 1;
    revenue += numericCapiValue(event.value);
    tickets += event.quantity ?? 0;

    const hasMetaObject = hasDirectMetaObject(event);
    const hasCfc = hasValidCfcCandidate(event);
    if (event.attribution_match_method === "direct_ticketmaster_params") directTicketmasterParamCount += 1;
    if (hasMetaObject) directMetaObjectCount += 1;
    if (hasCfc) cfcCandidateCount += 1;
    if (event.attribution_match_method && event.attribution_match_method !== "direct_ticketmaster_params") handoffDerivedCount += 1;
    if ((confidence === "deterministic" || confidence === "high") && hasMetaObject) optimizationGradeCount += 1;
  }

  const acceptedRate = purchases.length === 0 ? 0 : Math.round((accepted.length / purchases.length) * 100);
  const adLevelCoverageRate = accepted.length === 0 ? 0 : Math.round((directMetaObjectCount / accepted.length) * 100);
  const unknownCount = confidenceCounts.unknown;

  let status: TicketmasterCapiMatchingSummary["status"] = "healthy";
  let nextAction = "Use ad-level CAPI revenue for optimization-grade reads.";
  if (purchases.length === 0) {
    status = "waiting_for_purchases";
    nextAction = "Wait for a real non-test Ticketmaster purchase before judging matching quality.";
  } else if (acceptedRate < 90) {
    status = "acceptance_issue";
    nextAction = "Fix Meta CAPI acceptance before judging attribution matching.";
  } else if (directMetaObjectCount === 0) {
    status = "accepted_without_direct_matching";
    nextAction = "CAPI is accepted, but Ticketmaster is not returning numeric Meta object IDs or CFC ad IDs.";
  } else if (optimizationGradeCount === 0) {
    status = "accepted_without_optimization_grade_matching";
    nextAction = "Meta object IDs exist, but no deterministic/high-confidence rows are ready for optimization-grade reads.";
  }

  return {
    acceptedCount: accepted.length,
    acceptedRate,
    adLevelCoverageRate,
    cfcCandidateCount,
    confidenceCounts,
    directMetaObjectCount,
    directTicketmasterParamCount,
    handoffDerivedCount,
    nextAction,
    optimizationGradeCount,
    purchaseCount: purchases.length,
    revenue,
    status,
    tickets,
    unknownCount,
  };
}

function safeEventId(value: string | null | undefined) {
  return cleanAttributionQueryValue("ticketmaster_event_id", value, 160) ?? null;
}

function safeEventName(value: string | null | undefined) {
  return cleanAttributionQueryValue("utm_content", value, 160) ?? null;
}

function safeFunnel(value: string | null | undefined) {
  return cleanAttributionQueryValue("om_funnel", value, 120) ?? null;
}

function safeMarket(value: string | null | undefined) {
  return cleanAttributionQueryValue("om_market", value, 120) ?? null;
}

function eventBreakdownKey(event: TicketmasterCapiDiagnosticEvent) {
  const eventId = safeEventId(event.ticketmaster_event_id);
  const eventName = safeEventName(event.ticketmaster_event_name);
  const eventIdentity = eventId ? `id:${eventId.toLowerCase()}` : `name:${eventName?.toLowerCase() ?? "unknown-event"}`;
  return [
    eventIdentity,
    safeFunnel(event.funnel) ?? "no-funnel",
    safeMarket(event.market) ?? "no-market",
  ].join("|");
}

function firstSafeValue(
  events: TicketmasterCapiDiagnosticEvent[],
  selector: (event: TicketmasterCapiDiagnosticEvent) => string | null,
) {
  for (const event of events) {
    const value = selector(event);
    if (value) return value;
  }
  return null;
}

function eventBreakdownName(
  rows: TicketmasterCapiDiagnosticEvent[],
  eventId: string | null,
  funnel: string | null,
  market: string | null,
) {
  return firstSafeValue(rows, (event) => safeEventName(event.ticketmaster_event_name))
    || eventId
    || [funnel, market].filter(Boolean).join(" / ")
    || "Unknown event";
}

export function buildTicketmasterCapiEventMatchingBreakdown(
  events: TicketmasterCapiDiagnosticEvent[],
): TicketmasterCapiEventMatchingBreakdown[] {
  const groups = new Map<string, TicketmasterCapiDiagnosticEvent[]>();

  for (const event of events.filter(isCoveredPurchase)) {
    const key = eventBreakdownKey(event);
    groups.set(key, [...(groups.get(key) ?? []), event]);
  }

  return Array.from(groups.entries())
    .map(([key, rows]) => {
      const eventId = firstSafeValue(rows, (event) => safeEventId(event.ticketmaster_event_id));
      const funnel = firstSafeValue(rows, (event) => safeFunnel(event.funnel));
      const market = firstSafeValue(rows, (event) => safeMarket(event.market));
      return {
        ...buildTicketmasterCapiMatchingSummary(rows),
        eventId,
        funnel,
        key,
        market,
        name: eventBreakdownName(rows, eventId, funnel, market),
      };
    })
    .sort((a, b) => {
      if (b.purchaseCount !== a.purchaseCount) return b.purchaseCount - a.purchaseCount;
      if (b.revenue !== a.revenue) return b.revenue - a.revenue;
      return a.name.localeCompare(b.name);
    });
}
