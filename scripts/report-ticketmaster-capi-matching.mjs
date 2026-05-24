import { createClient } from "@supabase/supabase-js";
import { isValidMetaEntityId } from "./backfill-ticketmaster-attribution-helpers.mjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("FAIL missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const nestedSourceUrlKeys = ["edp", "source_url", "event_source_url", "page_url"];

function argValue(name) {
  const prefix = `${name}=`;
  const value = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return value ? value.slice(prefix.length) : undefined;
}

function hasArg(name) {
  return process.argv.slice(2).includes(name);
}

function isoCutoff() {
  const since = argValue("--since");
  if (since) {
    const parsed = new Date(since);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
    console.error(`FAIL invalid --since value: ${since}`);
    process.exit(1);
  }

  const hoursInput = Number(argValue("--hours") ?? process.env.TICKETMASTER_CAPI_REPORT_HOURS ?? 24);
  const hours = Number.isFinite(hoursInput) && hoursInput > 0 ? hoursInput : 24;
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function numericValue(value) {
  if (value === null || value === undefined) return 0;
  const parsed = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(parsed) ? parsed : 0;
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

function coveredPurchase(row) {
  return row.event_name === "Purchase" && !row.is_test && !row.skip_reason && numericValue(row.value) > 0;
}

function increment(object, key) {
  object[key] = (object[key] ?? 0) + 1;
}

function summarize(rows) {
  const purchases = rows.filter(coveredPurchase);
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

  for (const row of purchases) {
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
  const ad_level_coverage_rate = purchases.length ? Math.round((direct_meta_object_rows / purchases.length) * 100) : 0;
  const status = purchases.length === 0
    ? "waiting_for_purchases"
    : accepted_rate < 90
      ? "acceptance_issue"
      : direct_meta_object_rows === 0
        ? "accepted_without_direct_matching"
        : "healthy";
  const next_action = status === "accepted_without_direct_matching"
    ? "Ticketmaster CAPI is accepted, but Ticketmaster is not returning numeric Meta object IDs or CFC ad IDs."
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

const cutoff = isoCutoff();
const limitInput = Number(argValue("--limit") ?? process.env.TICKETMASTER_CAPI_REPORT_LIMIT ?? 1000);
const limit = Number.isFinite(limitInput) && limitInput > 0 ? Math.min(limitInput, 5000) : 1000;
const funnel = argValue("--funnel");
const market = argValue("--market");
const ticketmasterEventId = argValue("--ticketmaster-event-id");

let query = supabase
  .from("ticketmaster_capi_events")
  .select("created_at, event_name, is_test, skip_reason, value, currency, quantity, meta_ok, meta_status, ticketmaster_event_id, ticketmaster_event_name, funnel, market, attribution_match_method, attribution_match_confidence, meta_campaign_id, meta_adset_id, meta_ad_id, utm_content, source_url")
  .gte("created_at", cutoff)
  .order("created_at", { ascending: false })
  .limit(limit);

if (funnel) query = query.eq("funnel", funnel);
if (market) query = query.eq("market", market);
if (ticketmasterEventId) query = query.eq("ticketmaster_event_id", ticketmasterEventId);

const { data, error } = await query;
if (error) throw new Error(`ticketmaster_capi_events: ${error.message}`);

const report = {
  cutoff,
  filters: {
    funnel: funnel ?? null,
    market: market ?? null,
    ticketmaster_event_id: ticketmasterEventId ?? null,
  },
  generated_at: new Date().toISOString(),
  row_limit: limit,
  rows_read: data?.length ?? 0,
  summary: summarize(data ?? []),
};

if (hasArg("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("Ticketmaster CAPI matching report");
  console.log(`generated_at: ${report.generated_at}`);
  console.log(`cutoff: ${report.cutoff}`);
  console.log(`rows_read: ${report.rows_read}`);
  console.log(`filters: ${JSON.stringify(report.filters)}`);
  console.log("");
  console.log(`purchases: ${report.summary.purchases}`);
  console.log(`accepted_purchases: ${report.summary.accepted_purchases} (${report.summary.accepted_rate}%)`);
  console.log(`revenue: $${report.summary.revenue}`);
  console.log(`tickets: ${report.summary.tickets}`);
  console.log(`direct_meta_object_rows: ${report.summary.direct_meta_object_rows} (${report.summary.ad_level_coverage_rate}%)`);
  console.log(`optimization_grade_rows: ${report.summary.optimization_grade_rows}`);
  console.log(`cfc_candidate_rows: ${report.summary.cfc_candidate_rows}`);
  console.log(`unknown_rows: ${report.summary.unknown_rows}`);
  console.log(`confidence_counts: ${JSON.stringify(report.summary.confidence_counts)}`);
  console.log(`method_counts: ${JSON.stringify(report.summary.method_counts)}`);
  console.log(`status: ${report.summary.status}`);
  console.log(`next_action: ${report.summary.next_action}`);
}
