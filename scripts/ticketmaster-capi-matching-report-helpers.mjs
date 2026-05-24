import { isValidMetaEntityId } from "./backfill-ticketmaster-attribution-helpers.mjs";

const nestedSourceUrlKeys = ["edp", "source_url", "event_source_url", "page_url"];
const unsafeTokenRe = /(sk_live|sk_test|xox[baprs]-|ghp_|ya29\.|access[_-]?token|api[_-]?key|secret|password|bearer)/i;
const emailRe = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const phoneRe = /(?:^|[^A-Za-z0-9])(?:\+?\d[\d\s().-]{7,}\d)(?=$|[^A-Za-z0-9])|\d{10,}/;

export function numericValue(value) {
  if (value === null || value === undefined) return 0;
  const parsed = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(parsed) ? parsed : 0;
}

function cleanText(value, maxLength = 240) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed) || unsafeTokenRe.test(trimmed) || emailRe.test(trimmed) || phoneRe.test(trimmed)) return null;
  return trimmed.replace(/[<>]/g, "").slice(0, maxLength);
}

function safeTicketmasterEventId(value) {
  const cleaned = cleanText(value, 160);
  if (!cleaned) return null;
  return /^[A-Za-z0-9_.:-]{8,160}$/.test(cleaned) && /[A-Za-z]/.test(cleaned) ? cleaned : null;
}

function safeEventName(value) {
  return cleanText(value, 160);
}

function safeSlug(value) {
  const cleaned = cleanText(value, 120);
  if (!cleaned) return null;
  return /^[A-Za-z0-9_.:-]{1,120}$/.test(cleaned) ? cleaned : null;
}

function nestedUrlValues(params) {
  return nestedSourceUrlKeys
    .map((key) => params.get(key)?.trim())
    .filter((value) => value?.startsWith("http://") || value?.startsWith("https://"));
}

function validMetaParamFromUrl(value, names, depth = 0) {
  if (!value || depth > 2) return null;
  try {
    const parsed = new URL(value);
    for (const name of names) {
      const candidate = parsed.searchParams.get(name);
      if (isValidMetaEntityId(candidate)) return candidate;
    }
    for (const nested of nestedUrlValues(parsed.searchParams)) {
      const found = validMetaParamFromUrl(nested, names, depth + 1);
      if (found) return found;
    }
  } catch {
    return null;
  }
  return null;
}

function confidenceOf(row) {
  return ["deterministic", "high", "medium", "low"].includes(row.attribution_match_confidence)
    ? row.attribution_match_confidence
    : "unknown";
}

function hasDirectMetaObject(row) {
  return Boolean(
    isValidMetaEntityId(row.meta_ad_id)
      || isValidMetaEntityId(row.meta_adset_id)
      || isValidMetaEntityId(row.meta_campaign_id),
  );
}

function hasCfcCandidate(row) {
  return Boolean(
    isValidMetaEntityId(row.utm_content)
      || validMetaParamFromUrl(row.source_url, ["ad_id", "meta_ad_id"]),
  );
}

function isCoveredPurchase(row) {
  return row.event_name === "Purchase" && !row.is_test && !row.skip_reason && numericValue(row.value) > 0;
}

function isAcceptedCoveredPurchase(row) {
  return isCoveredPurchase(row) && row.meta_ok;
}

function increment(object, key) {
  object[key] = (object[key] ?? 0) + 1;
}

export function summarizeTicketmasterCapiRows(rows) {
  const purchases = rows.filter(isCoveredPurchase);
  const accepted = purchases.filter((row) => row.meta_ok);
  const confidence_counts = { deterministic: 0, high: 0, medium: 0, low: 0, unknown: 0 };
  const method_counts = {};
  let direct_meta_object_rows = 0;
  let direct_ticketmaster_param_rows = 0;
  let handoff_derived_rows = 0;
  let cfc_candidate_rows = 0;
  let optimization_grade_rows = 0;
  let revenue = 0;
  let tickets = 0;

  for (const row of accepted) {
    const confidence = confidenceOf(row);
    const hasMetaObject = hasDirectMetaObject(row);
    const method = row.attribution_match_method || "missing";
    increment(confidence_counts, confidence);
    increment(method_counts, method);
    revenue += numericValue(row.value);
    tickets += row.quantity ?? 0;
    if (hasMetaObject) direct_meta_object_rows += 1;
    if (hasCfcCandidate(row)) cfc_candidate_rows += 1;
    if (row.attribution_match_method === "direct_ticketmaster_params") direct_ticketmaster_param_rows += 1;
    if (row.attribution_match_method && row.attribution_match_method !== "direct_ticketmaster_params") handoff_derived_rows += 1;
    if ((confidence === "deterministic" || confidence === "high") && hasMetaObject) optimization_grade_rows += 1;
  }

  const accepted_rate = purchases.length ? Math.round((accepted.length / purchases.length) * 100) : 0;
  const ad_level_coverage_rate = accepted.length ? Math.round((direct_meta_object_rows / accepted.length) * 100) : 0;
  const status = purchases.length === 0
    ? "waiting_for_purchases"
    : accepted_rate < 90
      ? "acceptance_issue"
      : direct_meta_object_rows === 0
        ? "accepted_without_direct_matching"
        : optimization_grade_rows === 0
          ? "accepted_without_optimization_grade_matching"
          : "healthy";
  const next_action = status === "accepted_without_direct_matching"
    ? "Ticketmaster CAPI is accepted, but Ticketmaster is not returning numeric Meta object IDs or CFC ad IDs."
    : status === "accepted_without_optimization_grade_matching"
      ? "Meta object IDs exist, but no deterministic/high-confidence rows are ready for optimization-grade reads."
      : status === "acceptance_issue"
        ? "Fix Meta acceptance before judging attribution matching."
        : status === "waiting_for_purchases"
          ? "Wait for real non-test Ticketmaster purchases."
          : "Use optimization-grade rows for ad-level CAPI revenue reads.";

  return {
    accepted_purchases: accepted.length,
    accepted_rate,
    ad_level_coverage_rate,
    cfc_candidate_rows,
    confidence_counts,
    direct_meta_object_rows,
    direct_ticketmaster_param_rows,
    handoff_derived_rows,
    method_counts,
    next_action,
    optimization_grade_rows,
    purchases: purchases.length,
    revenue: Math.round(revenue * 100) / 100,
    status,
    tickets,
    unknown_rows: confidence_counts.unknown,
  };
}

function eventBreakdownKey(row) {
  const eventId = safeTicketmasterEventId(row.ticketmaster_event_id);
  const eventName = safeEventName(row.ticketmaster_event_name);
  const eventIdentity = eventId ? `id:${eventId.toLowerCase()}` : `name:${eventName?.toLowerCase() ?? "unknown-event"}`;
  return [
    eventIdentity,
    safeSlug(row.funnel) ?? "no-funnel",
    safeSlug(row.market) ?? "no-market",
  ].join("|");
}

function firstSafeValue(rows, selector) {
  for (const row of rows) {
    const value = selector(row);
    if (value) return value;
  }
  return null;
}

function eventBreakdownName(rows, event_id, funnel, market) {
  return firstSafeValue(rows, (row) => safeEventName(row.ticketmaster_event_name))
    || event_id
    || [funnel, market].filter(Boolean).join(" / ")
    || "Unknown event";
}

export function buildTicketmasterCapiEventBreakdown(rows, limit = 12) {
  const groups = new Map();

  for (const row of rows.filter(isAcceptedCoveredPurchase)) {
    const key = eventBreakdownKey(row);
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }

  return Array.from(groups.entries())
    .map(([key, groupRows]) => {
      const event_id = firstSafeValue(groupRows, (row) => safeTicketmasterEventId(row.ticketmaster_event_id));
      const funnel = firstSafeValue(groupRows, (row) => safeSlug(row.funnel));
      const market = firstSafeValue(groupRows, (row) => safeSlug(row.market));
      return {
        ...summarizeTicketmasterCapiRows(groupRows),
        event_id,
        funnel,
        key,
        market,
        name: eventBreakdownName(groupRows, event_id, funnel, market),
      };
    })
    .sort((a, b) => {
      if (b.purchases !== a.purchases) return b.purchases - a.purchases;
      if (b.revenue !== a.revenue) return b.revenue - a.revenue;
      return a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}

export function summarizeTicketmasterHandoffRows(rows) {
  let any_meta_object_rows = 0;
  let click_id_rows = 0;
  let fbclid_rows = 0;
  let fbc_rows = 0;
  let fbp_rows = 0;
  let meta_ad_rows = 0;
  let meta_adset_rows = 0;
  let meta_campaign_rows = 0;
  let session_id_rows = 0;

  for (const row of rows) {
    const hasMetaAd = isValidMetaEntityId(row.meta_ad_id);
    const hasMetaAdset = isValidMetaEntityId(row.meta_adset_id);
    const hasMetaCampaign = isValidMetaEntityId(row.meta_campaign_id);
    if (hasMetaAd) meta_ad_rows += 1;
    if (hasMetaAdset) meta_adset_rows += 1;
    if (hasMetaCampaign) meta_campaign_rows += 1;
    if (hasMetaAd || hasMetaAdset || hasMetaCampaign) any_meta_object_rows += 1;
    if (row.click_id) click_id_rows += 1;
    if (row.session_id) session_id_rows += 1;
    if (row.fbclid) fbclid_rows += 1;
    if (row.fbc) fbc_rows += 1;
    if (row.fbp) fbp_rows += 1;
  }

  const meta_object_capture_rate = rows.length ? Math.round((any_meta_object_rows / rows.length) * 100) : 0;
  return {
    any_meta_object_rows,
    click_id_rows,
    fbclid_rows,
    fbc_rows,
    fbp_rows,
    meta_ad_rows,
    meta_adset_rows,
    meta_campaign_rows,
    meta_object_capture_rate,
    rows: rows.length,
    session_id_rows,
  };
}

export function buildTicketmasterHandoffEventBreakdown(rows, limit = 12) {
  const groups = new Map();

  for (const row of rows) {
    const key = eventBreakdownKey(row);
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }

  return Array.from(groups.entries())
    .map(([key, groupRows]) => {
      const event_id = firstSafeValue(groupRows, (row) => safeTicketmasterEventId(row.ticketmaster_event_id));
      const funnel = firstSafeValue(groupRows, (row) => safeSlug(row.funnel));
      const market = firstSafeValue(groupRows, (row) => safeSlug(row.market));
      return {
        ...summarizeTicketmasterHandoffRows(groupRows),
        event_id,
        funnel,
        key,
        market,
        name: eventBreakdownName(groupRows, event_id, funnel, market),
      };
    })
    .sort((a, b) => {
      if (b.rows !== a.rows) return b.rows - a.rows;
      if (b.any_meta_object_rows !== a.any_meta_object_rows) return b.any_meta_object_rows - a.any_meta_object_rows;
      return a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}

export function buildTicketmasterCapiMatchingReport(input) {
  const breakdownLimit = Number.isFinite(input.breakdownLimit) && input.breakdownLimit > 0
    ? Math.min(input.breakdownLimit, 50)
    : 12;
  const handoffRows = input.handoffRows ?? [];

  return {
    cutoff: input.cutoff,
    event_breakdown: buildTicketmasterCapiEventBreakdown(input.rows, breakdownLimit),
    filters: input.filters,
    generated_at: input.generatedAt,
    handoff_event_breakdown: buildTicketmasterHandoffEventBreakdown(handoffRows, breakdownLimit),
    handoff_summary: summarizeTicketmasterHandoffRows(handoffRows),
    handoff_rows_read: handoffRows.length,
    row_limit: input.rowLimit,
    rows_read: input.rows.length,
    summary: summarizeTicketmasterCapiRows(input.rows),
  };
}
