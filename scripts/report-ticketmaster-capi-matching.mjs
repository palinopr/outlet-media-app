import { createClient } from "@supabase/supabase-js";
import { buildTicketmasterCapiMatchingReport } from "./ticketmaster-capi-matching-report-helpers.mjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("FAIL missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

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

const cutoff = isoCutoff();
const limitInput = Number(argValue("--limit") ?? process.env.TICKETMASTER_CAPI_REPORT_LIMIT ?? 1000);
const limit = Number.isFinite(limitInput) && limitInput > 0 ? Math.min(limitInput, 5000) : 1000;
const breakdownLimitInput = Number(argValue("--breakdown-limit") ?? process.env.TICKETMASTER_CAPI_REPORT_BREAKDOWN_LIMIT ?? 12);
const breakdownLimit = Number.isFinite(breakdownLimitInput) && breakdownLimitInput > 0 ? Math.min(breakdownLimitInput, 50) : 12;
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

let handoffQuery = supabase
  .from("ticketmaster_attribution_handoffs")
  .select("created_at, ticketmaster_event_id, ticketmaster_event_name, funnel, market, click_id, session_id, fbclid, fbc, fbp, meta_campaign_id, meta_adset_id, meta_ad_id")
  .gte("created_at", cutoff)
  .order("created_at", { ascending: false })
  .limit(limit);

if (funnel) handoffQuery = handoffQuery.eq("funnel", funnel);
if (market) handoffQuery = handoffQuery.eq("market", market);
if (ticketmasterEventId) handoffQuery = handoffQuery.eq("ticketmaster_event_id", ticketmasterEventId);

const { data: handoffData, error: handoffError } = await handoffQuery;
if (handoffError) throw new Error(`ticketmaster_attribution_handoffs: ${handoffError.message}`);

const report = buildTicketmasterCapiMatchingReport({
  cutoff,
  breakdownLimit,
  filters: {
    funnel: funnel ?? null,
    market: market ?? null,
    ticketmaster_event_id: ticketmasterEventId ?? null,
  },
  generatedAt: new Date().toISOString(),
  handoffRows: handoffData ?? [],
  rowLimit: limit,
  rows: data ?? [],
});

if (hasArg("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("Ticketmaster CAPI matching report");
  console.log(`generated_at: ${report.generated_at}`);
  console.log(`cutoff: ${report.cutoff}`);
  console.log(`rows_read: ${report.rows_read}`);
  console.log(`handoff_rows_read: ${report.handoff_rows_read}`);
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
  console.log("");
  console.log("handoff_capture:");
  console.log(`handoff_rows: ${report.handoff_summary.rows}`);
  console.log(`handoff_meta_object_rows: ${report.handoff_summary.any_meta_object_rows} (${report.handoff_summary.meta_object_capture_rate}%)`);
  console.log(`handoff_meta_ad_rows: ${report.handoff_summary.meta_ad_rows}`);
  console.log(`handoff_meta_adset_rows: ${report.handoff_summary.meta_adset_rows}`);
  console.log(`handoff_meta_campaign_rows: ${report.handoff_summary.meta_campaign_rows}`);
  console.log(`handoff_click_id_rows: ${report.handoff_summary.click_id_rows}`);
  console.log(`handoff_session_id_rows: ${report.handoff_summary.session_id_rows}`);
  console.log(`handoff_fbclid_rows: ${report.handoff_summary.fbclid_rows}`);
  console.log(`handoff_fbc_rows: ${report.handoff_summary.fbc_rows}`);
  console.log(`handoff_fbp_rows: ${report.handoff_summary.fbp_rows}`);
  console.log("");
  console.log(`event_breakdown_top_${report.event_breakdown.length}:`);
  for (const event of report.event_breakdown) {
    console.log(`- ${event.name} | event_id=${event.event_id ?? "n/a"} | funnel=${event.funnel ?? "n/a"} | market=${event.market ?? "n/a"}`);
    console.log(`  purchases=${event.purchases} accepted=${event.accepted_purchases} revenue=$${event.revenue} tickets=${event.tickets}`);
    console.log(`  direct_meta_object_rows=${event.direct_meta_object_rows} optimization_grade_rows=${event.optimization_grade_rows} unknown_rows=${event.unknown_rows} cfc_candidate_rows=${event.cfc_candidate_rows}`);
    console.log(`  confidence_counts=${JSON.stringify(event.confidence_counts)} status=${event.status}`);
  }
  console.log("");
  console.log(`handoff_breakdown_top_${report.handoff_event_breakdown.length}:`);
  for (const event of report.handoff_event_breakdown) {
    console.log(`- ${event.name} | event_id=${event.event_id ?? "n/a"} | funnel=${event.funnel ?? "n/a"} | market=${event.market ?? "n/a"}`);
    console.log(`  handoff_rows=${event.rows} meta_object_rows=${event.any_meta_object_rows} (${event.meta_object_capture_rate}%) click_id_rows=${event.click_id_rows} session_id_rows=${event.session_id_rows}`);
    console.log(`  fbclid_rows=${event.fbclid_rows} fbc_rows=${event.fbc_rows} fbp_rows=${event.fbp_rows}`);
  }
}
