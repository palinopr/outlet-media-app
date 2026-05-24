import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const days = Number(process.env.TICKETMASTER_ATTRIBUTION_BACKFILL_DAYS ?? 30);
const cutoff = new Date(Date.now() - (Number.isFinite(days) ? days : 30) * 24 * 60 * 60 * 1000).toISOString();
const apply = process.env.TICKETMASTER_ATTRIBUTION_BACKFILL_APPLY === "1";
const allowMedium = process.env.TICKETMASTER_ATTRIBUTION_BACKFILL_ALLOW_MEDIUM === "1";
const metaAccessToken = process.env.META_ACCESS_TOKEN || process.env.META_CAPI_ACCESS_TOKEN;
const metaApiVersion = "v21.0";
const metaEntityCache = new Map();

if (!supabaseUrl || !supabaseKey) {
  console.error("FAIL missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const handoffSelect = [
  "id",
  "created_at",
  "click_id",
  "session_id",
  "funnel",
  "market",
  "fbclid",
  "fbc",
  "fbp",
  "meta_campaign_id",
  "meta_campaign_name",
  "meta_adset_id",
  "meta_adset_name",
  "meta_ad_id",
  "meta_ad_name",
  "placement",
  "site_source",
  "utm_campaign",
  "utm_content",
  "utm_medium",
  "utm_source",
  "utm_term",
].join(", ");

const nestedUrlKeys = ["edp", "source_url", "event_source_url", "page_url"];

function sevenDaysBefore(timestamp) {
  return new Date(new Date(timestamp).getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
}

function firstParam(params, names) {
  for (const name of names) {
    const value = params.get(name)?.trim();
    if (value) return value.slice(0, 500);
  }
  return undefined;
}

function nestedUrlValues(params) {
  return nestedUrlKeys
    .map((key) => params.get(key)?.trim())
    .filter((value) => value?.startsWith("http://") || value?.startsWith("https://"));
}

function firstParamFromUrl(value, names, depth = 0) {
  if (!value || depth > 2) return undefined;
  try {
    const parsed = new URL(value);
    const direct = firstParam(parsed.searchParams, names);
    if (direct) return direct;
    for (const nested of nestedUrlValues(parsed.searchParams)) {
      const found = firstParamFromUrl(nested, names, depth + 1);
      if (found) return found;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

function canApplyMatch(match) {
  return match.confidence === "deterministic" || match.confidence === "high" || (allowMedium && match.confidence === "medium");
}

const unsafeValuePattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\.|access[_-]?token|api[_-]?key|secret|password|bearer|(?:^|[^A-Za-z0-9])(?:\+?\d[\d\s().-]{7,}\d)(?=$|[^A-Za-z0-9])|\d{10,}/i;

function isValidMetaEntityId(value) {
  return typeof value === "string" && /^\d{12,30}$/.test(value);
}

function safeText(value, maxLength = 240) {
  if (typeof value !== "string") return null;
  const cleaned = value.trim().slice(0, maxLength);
  if (!cleaned || unsafeValuePattern.test(cleaned) || /^https?:\/\//i.test(cleaned)) return null;
  return cleaned.replace(/[<>]/g, "");
}

function safeSlug(value, maxLength = 120) {
  const cleaned = safeText(value, maxLength)?.toLowerCase().replace(/[^a-z0-9_.:-]+/g, "_").replace(/^_+|_+$/g, "");
  return cleaned || null;
}

function safeFbclid(value) {
  return typeof value === "string" && /^[A-Za-z0-9_-]{12,500}$/.test(value) && /[A-Za-z]/.test(value) ? value : null;
}

function safeFacebookCookie(value) {
  return typeof value === "string" && /^fb\.\d+\.\d{10,13}\.[A-Za-z0-9_.:-]{1,500}$/.test(value) ? value : null;
}

function validDirectMetaUpdate(purchase) {
  const meta_ad_id = isValidMetaEntityId(purchase.meta_ad_id) ? purchase.meta_ad_id : null;
  const meta_adset_id = isValidMetaEntityId(purchase.meta_adset_id) ? purchase.meta_adset_id : null;
  const meta_campaign_id = isValidMetaEntityId(purchase.meta_campaign_id) ? purchase.meta_campaign_id : null;
  return {
    meta_ad_id,
    meta_ad_name: safeText(purchase.meta_ad_name),
    meta_adset_id,
    meta_adset_name: safeText(purchase.meta_adset_name),
    meta_campaign_id,
    meta_campaign_name: safeText(purchase.meta_campaign_name),
  };
}

function hasInvalidDirectMetaIds(purchase) {
  return Boolean(
    (purchase.meta_ad_id && !isValidMetaEntityId(purchase.meta_ad_id))
      || (purchase.meta_adset_id && !isValidMetaEntityId(purchase.meta_adset_id))
      || (purchase.meta_campaign_id && !isValidMetaEntityId(purchase.meta_campaign_id)),
  );
}

function hasStrongBackfillContext(purchase) {
  return Boolean(purchase.ticketmaster_event_id && purchase.funnel && purchase.market);
}

function mergeMissingMetaHierarchy(base, enrichment) {
  return {
    ...base,
    meta_ad_id: base.meta_ad_id ?? enrichment.meta_ad_id ?? null,
    meta_ad_name: base.meta_ad_name ?? enrichment.meta_ad_name ?? null,
    meta_adset_id: base.meta_adset_id ?? enrichment.meta_adset_id ?? null,
    meta_adset_name: base.meta_adset_name ?? enrichment.meta_adset_name ?? null,
    meta_campaign_id: base.meta_campaign_id ?? enrichment.meta_campaign_id ?? null,
    meta_campaign_name: base.meta_campaign_name ?? enrichment.meta_campaign_name ?? null,
  };
}

function needsMetaHierarchy(update) {
  return Boolean(
    (update.meta_ad_id && (!update.meta_adset_id || !update.meta_campaign_id))
      || (update.meta_adset_id && !update.meta_campaign_id),
  );
}

async function fetchMetaEntity(path, fields) {
  if (!metaAccessToken) return {};
  const cacheKey = `${path}:${fields}`;
  if (metaEntityCache.has(cacheKey)) return metaEntityCache.get(cacheKey);

  const url = new URL(`https://graph.facebook.com/${metaApiVersion}/${path}`);
  url.searchParams.set("access_token", metaAccessToken);
  url.searchParams.set("fields", fields);

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error(`WARN Meta hierarchy lookup failed HTTP ${response.status}`);
      metaEntityCache.set(cacheKey, {});
      return {};
    }
    const json = await response.json();
    if (json?.error) {
      console.error("WARN Meta hierarchy lookup returned an API error");
      metaEntityCache.set(cacheKey, {});
      return {};
    }
    metaEntityCache.set(cacheKey, json);
    return json;
  } catch (error) {
    console.error(`WARN Meta hierarchy lookup failed: ${error instanceof Error ? error.message : String(error)}`);
    metaEntityCache.set(cacheKey, {});
    return {};
  }
}

async function enrichMetaHierarchy(update) {
  if (!needsMetaHierarchy(update)) return update;

  if (update.meta_ad_id) {
    const ad = await fetchMetaEntity(encodeURIComponent(update.meta_ad_id), "id,name,adset{id,name,campaign{id,name}}");
    return mergeMissingMetaHierarchy(update, {
      meta_ad_id: isValidMetaEntityId(ad?.id) ? ad.id : null,
      meta_ad_name: safeText(ad?.name),
      meta_adset_id: isValidMetaEntityId(ad?.adset?.id) ? ad.adset.id : null,
      meta_adset_name: safeText(ad?.adset?.name),
      meta_campaign_id: isValidMetaEntityId(ad?.adset?.campaign?.id) ? ad.adset.campaign.id : null,
      meta_campaign_name: safeText(ad?.adset?.campaign?.name),
    });
  }

  if (update.meta_adset_id) {
    const adset = await fetchMetaEntity(encodeURIComponent(update.meta_adset_id), "id,name,campaign{id,name}");
    return mergeMissingMetaHierarchy(update, {
      meta_adset_id: isValidMetaEntityId(adset?.id) ? adset.id : null,
      meta_adset_name: safeText(adset?.name),
      meta_campaign_id: isValidMetaEntityId(adset?.campaign?.id) ? adset.campaign.id : null,
      meta_campaign_name: safeText(adset?.campaign?.name),
    });
  }

  return update;
}

function hasHierarchyImprovement(purchase, update) {
  return Boolean(
    (!purchase.meta_adset_id && update.meta_adset_id)
      || (!purchase.meta_adset_name && update.meta_adset_name)
      || (!purchase.meta_campaign_id && update.meta_campaign_id)
      || (!purchase.meta_campaign_name && update.meta_campaign_name)
      || (!purchase.meta_ad_name && update.meta_ad_name),
  );
}

function handoffUpdate(row, method, confidence) {
  return {
    attribution_handoff_id: row.id,
    attribution_match_confidence: confidence,
    attribution_match_method: method,
    attribution_matched_at: new Date().toISOString(),
    fbclid: safeFbclid(row.fbclid),
    fbc: safeFacebookCookie(row.fbc),
    fbp: safeFacebookCookie(row.fbp),
    meta_ad_id: isValidMetaEntityId(row.meta_ad_id) ? row.meta_ad_id : null,
    meta_ad_name: safeText(row.meta_ad_name),
    meta_adset_id: isValidMetaEntityId(row.meta_adset_id) ? row.meta_adset_id : null,
    meta_adset_name: safeText(row.meta_adset_name),
    meta_campaign_id: isValidMetaEntityId(row.meta_campaign_id) ? row.meta_campaign_id : null,
    meta_campaign_name: safeText(row.meta_campaign_name),
    om_click_id: safeSlug(row.click_id, 160),
    om_session_id: safeSlug(row.session_id, 160),
    placement: safeSlug(row.placement),
    site_source: safeSlug(row.site_source),
    utm_campaign: safeSlug(row.utm_campaign, 240),
    utm_content: safeText(row.utm_content),
    utm_medium: safeSlug(row.utm_medium, 240),
    utm_source: safeSlug(row.utm_source, 240),
    utm_term: safeSlug(row.utm_term, 240),
  };
}

function scoped(query, purchase) {
  let scopedQuery = query;
  if (purchase.ticketmaster_event_id) scopedQuery = scopedQuery.eq("ticketmaster_event_id", purchase.ticketmaster_event_id);
  if (purchase.funnel) scopedQuery = scopedQuery.eq("funnel", purchase.funnel);
  if (purchase.market) scopedQuery = scopedQuery.eq("market", purchase.market);
  return scopedQuery;
}

async function latestHandoffBy(field, value, purchase, { requireEventContext = false } = {}) {
  if (!value) return null;
  if (requireEventContext && !purchase.ticketmaster_event_id) return null;
  const result = await scoped(
    supabase
      .from("ticketmaster_attribution_handoffs")
      .select(handoffSelect)
      .eq(field, value)
      .gte("created_at", sevenDaysBefore(purchase.created_at))
      .lte("created_at", purchase.created_at)
      .order("created_at", { ascending: false })
      .limit(1),
    purchase,
  ).maybeSingle();

  if (result.error) throw new Error(`handoff ${field}: ${result.error.message}`);
  return result.data ?? null;
}

async function uniqueHandoffBy(field, value, purchase) {
  if (!value || !hasStrongBackfillContext(purchase)) return null;
  const result = await scoped(
    supabase
      .from("ticketmaster_attribution_handoffs")
      .select(handoffSelect)
      .eq(field, value)
      .gte("created_at", sevenDaysBefore(purchase.created_at))
      .lte("created_at", purchase.created_at)
      .order("created_at", { ascending: false })
      .limit(2),
    purchase,
  );

  if (result.error) throw new Error(`unique handoff ${field}: ${result.error.message}`);
  return result.data?.length === 1 ? result.data[0] : null;
}

async function latestHandoffByIpUa(purchase) {
  if (!hasStrongBackfillContext(purchase) || !purchase.request_ip_hash || !purchase.user_agent_hash) return null;
  const result = await scoped(
    supabase
      .from("ticketmaster_attribution_handoffs")
      .select(handoffSelect)
      .eq("request_ip_hash", purchase.request_ip_hash)
      .eq("user_agent_hash", purchase.user_agent_hash)
      .gte("created_at", sevenDaysBefore(purchase.created_at))
      .lte("created_at", purchase.created_at)
      .order("created_at", { ascending: false })
      .limit(2),
    purchase,
  );

  if (result.error) throw new Error(`handoff ip+ua: ${result.error.message}`);
  return result.data?.length === 1 ? result.data[0] : null;
}

async function matchPurchase(purchase) {
  const clickId = purchase.om_click_id ?? firstParamFromUrl(purchase.source_url, ["om_click_id", "click_id", "omc"]);
  const sessionId = purchase.om_session_id ?? firstParamFromUrl(purchase.source_url, ["om_session_id", "session_id", "oms"]);
  const fbc = purchase.fbc ?? firstParamFromUrl(purchase.source_url, ["fbc"]);
  const fbclid = purchase.fbclid ?? firstParamFromUrl(purchase.source_url, ["fbclid"]);
  const fbp = purchase.fbp ?? firstParamFromUrl(purchase.source_url, ["fbp"]);

  const directClick = await latestHandoffBy("click_id", clickId, purchase);
  if (directClick) return { row: directClick, method: "direct_click_id", confidence: "deterministic" };

  const directSession = await latestHandoffBy("session_id", sessionId, purchase);
  if (directSession) return { row: directSession, method: "direct_session_id", confidence: "deterministic" };

  const fbcMatch = await uniqueHandoffBy("fbc", fbc, purchase);
  if (fbcMatch) return { row: fbcMatch, method: "exact_fbc", confidence: "high" };

  const fbclidMatch = await uniqueHandoffBy("fbclid", fbclid, purchase);
  if (fbclidMatch) return { row: fbclidMatch, method: "exact_fbclid", confidence: "high" };

  const fbpMatch = await uniqueHandoffBy("fbp", fbp, purchase);
  if (fbpMatch) return { row: fbpMatch, method: "exact_fbp", confidence: "medium" };

  const ipUaMatch = await latestHandoffByIpUa(purchase);
  if (ipUaMatch) return { row: ipUaMatch, method: "exact_ip_ua_handoff", confidence: "medium" };

  return null;
}

const { data: purchases, error } = await supabase
  .from("ticketmaster_capi_events")
  .select("id, created_at, event_id, ticketmaster_event_id, funnel, market, source_url, request_ip_hash, user_agent_hash, om_click_id, om_session_id, fbclid, fbc, fbp, meta_ad_id, meta_ad_name, meta_adset_id, meta_adset_name, meta_campaign_id, meta_campaign_name, attribution_match_confidence, is_test, order_hash, order_id")
  .eq("event_name", "Purchase")
  .eq("is_test", false)
  .is("skip_reason", null)
  .gt("value", 0)
  .or("order_hash.not.is.null,order_id.not.is.null")
  .gte("created_at", cutoff)
  .order("created_at", { ascending: false })
  .limit(1000);

if (error) throw new Error(`ticketmaster_capi_events: ${error.message}`);

let checked = 0;
let matched = 0;
let proposed = 0;
let skipped = 0;
let hierarchyEnriched = 0;
for (const purchase of purchases ?? []) {
  checked += 1;
  if (purchase.is_test || (!purchase.order_hash && !purchase.order_id)) {
    skipped += 1;
    continue;
  }
  const validDirectMeta = await enrichMetaHierarchy(validDirectMetaUpdate(purchase));
  const directHierarchyImproved = hasHierarchyImprovement(purchase, validDirectMeta);
  if (purchase.attribution_match_confidence && purchase.attribution_match_confidence !== "unknown") {
    if (directHierarchyImproved) {
      proposed += 1;
      hierarchyEnriched += 1;
      if (apply) {
        const update = await supabase
          .from("ticketmaster_capi_events")
          .update(validDirectMeta)
          .eq("id", purchase.id);

        if (update.error) throw new Error(`enrich direct ${purchase.event_id.slice(0, 12)}: ${update.error.message}`);
        matched += 1;
      }
    } else {
      skipped += 1;
    }
    continue;
  }
  const hasValidDirectMeta = Boolean(validDirectMeta.meta_ad_id || validDirectMeta.meta_adset_id || validDirectMeta.meta_campaign_id);
  if (hasInvalidDirectMetaIds(purchase)) {
    if (apply) {
      const scrub = await supabase
        .from("ticketmaster_capi_events")
        .update(validDirectMeta)
        .eq("id", purchase.id);
      if (scrub.error) throw new Error(`scrub invalid direct ${purchase.event_id.slice(0, 12)}: ${scrub.error.message}`);
    }
    skipped += 1;
    continue;
  }
  if (hasValidDirectMeta) {
    proposed += 1;
    if (directHierarchyImproved) hierarchyEnriched += 1;
    if (apply) {
      const update = await supabase
        .from("ticketmaster_capi_events")
        .update({
          ...validDirectMeta,
          attribution_match_confidence: "deterministic",
          attribution_match_method: "direct_ticketmaster_params",
          attribution_matched_at: new Date().toISOString(),
        })
        .eq("id", purchase.id);

      if (update.error) throw new Error(`mark direct ${purchase.event_id.slice(0, 12)}: ${update.error.message}`);
      matched += 1;
    }
    continue;
  }
  const match = await matchPurchase(purchase);
  if (!match || !canApplyMatch(match)) {
    skipped += 1;
    continue;
  }

  proposed += 1;
  const handoffUpdatePayload = await enrichMetaHierarchy(handoffUpdate(match.row, match.method, match.confidence));
  if (hasHierarchyImprovement(purchase, handoffUpdatePayload)) hierarchyEnriched += 1;
  if (!apply) continue;

  const update = await supabase
    .from("ticketmaster_capi_events")
    .update(handoffUpdatePayload)
    .eq("id", purchase.id);

  if (update.error) throw new Error(`update ${purchase.event_id.slice(0, 12)}: ${update.error.message}`);
  matched += 1;
}

console.log(JSON.stringify({
  allowMedium,
  apply,
  checked,
  cutoff,
  hierarchy_enriched: hierarchyEnriched,
  meta_hierarchy_lookup_enabled: Boolean(metaAccessToken),
  matched,
  mode: apply ? "apply" : "dry_run",
  proposed,
  skipped,
}, null, 2));
