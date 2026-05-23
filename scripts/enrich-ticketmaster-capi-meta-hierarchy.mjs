import { createClient } from "@supabase/supabase-js";

const META_API_VERSION = "v21.0";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const metaAccessToken = process.env.META_CAPI_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN;
const days = Number(process.env.TICKETMASTER_META_HIERARCHY_DAYS ?? 30);
const cutoff = new Date(Date.now() - (Number.isFinite(days) ? days : 30) * 24 * 60 * 60 * 1000).toISOString();
const apply = process.env.TICKETMASTER_META_HIERARCHY_APPLY === "1";

if (!supabaseUrl || !supabaseKey) {
  console.error("FAIL missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

if (!metaAccessToken) {
  console.error("FAIL missing META_ACCESS_TOKEN or META_CAPI_ACCESS_TOKEN");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const unsafeValuePattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\.|access[_-]?token|api[_-]?key|secret|password|bearer|(?:^|[^A-Za-z0-9])(?:\+?\d[\d\s().-]{7,}\d)(?=$|[^A-Za-z0-9])|\d{10,}/i;
const hierarchyCache = new Map();

function isValidMetaEntityId(value) {
  return typeof value === "string" && /^\d{12,30}$/.test(value);
}

function safeText(value, maxLength = 240) {
  if (typeof value !== "string") return null;
  const cleaned = value.trim().slice(0, maxLength);
  if (!cleaned || unsafeValuePattern.test(cleaned) || /^https?:\/\//i.test(cleaned)) return null;
  return cleaned.replace(/[<>]/g, "");
}

async function resolveHierarchy(adId) {
  if (!isValidMetaEntityId(adId)) return null;
  if (hierarchyCache.has(adId)) return hierarchyCache.get(adId);

  const endpoint = new URL(`https://graph.facebook.com/${META_API_VERSION}/${adId}`);
  endpoint.searchParams.set("fields", "id,name,adset{id,name},campaign{id,name}");
  endpoint.searchParams.set("access_token", metaAccessToken);

  const promise = fetch(endpoint.toString())
    .then(async (response) => {
      const body = await response.json().catch(() => null);
      if (!response.ok || !body || body.error) return null;
      return {
        meta_ad_id: isValidMetaEntityId(body.id) ? body.id : null,
        meta_ad_name: safeText(body.name),
        meta_adset_id: isValidMetaEntityId(body.adset?.id) ? body.adset.id : null,
        meta_adset_name: safeText(body.adset?.name),
        meta_campaign_id: isValidMetaEntityId(body.campaign?.id) ? body.campaign.id : null,
        meta_campaign_name: safeText(body.campaign?.name),
      };
    })
    .catch(() => null);

  hierarchyCache.set(adId, promise);
  return promise;
}

function missingHierarchy(row) {
  return !row.meta_ad_name || !row.meta_adset_id || !row.meta_adset_name || !row.meta_campaign_id || !row.meta_campaign_name;
}

function updateFor(row, hierarchy) {
  if (!hierarchy || hierarchy.meta_ad_id !== row.meta_ad_id) return null;
  const update = {};
  for (const key of ["meta_ad_name", "meta_adset_id", "meta_adset_name", "meta_campaign_id", "meta_campaign_name"]) {
    if (!row[key] && hierarchy[key]) update[key] = hierarchy[key];
  }
  return Object.keys(update).length > 0 ? update : null;
}

const { data: purchases, error } = await supabase
  .from("ticketmaster_capi_events")
  .select("id, created_at, event_id, meta_ad_id, meta_ad_name, meta_adset_id, meta_adset_name, meta_campaign_id, meta_campaign_name, event_name, is_test, skip_reason, attribution_match_confidence")
  .eq("event_name", "Purchase")
  .eq("is_test", false)
  .is("skip_reason", null)
  .eq("attribution_match_confidence", "deterministic")
  .not("meta_ad_id", "is", null)
  .or("meta_ad_name.is.null,meta_adset_id.is.null,meta_adset_name.is.null,meta_campaign_id.is.null,meta_campaign_name.is.null")
  .gte("created_at", cutoff)
  .order("created_at", { ascending: false })
  .limit(1000);

if (error) throw new Error(`ticketmaster_capi_events: ${error.message}`);

let checked = 0;
let resolvable = 0;
let proposed = 0;
let updated = 0;
let skipped = 0;
let failed = 0;

for (const row of purchases ?? []) {
  checked += 1;
  if (!isValidMetaEntityId(row.meta_ad_id) || !missingHierarchy(row)) {
    skipped += 1;
    continue;
  }

  const hierarchy = await resolveHierarchy(row.meta_ad_id);
  if (!hierarchy) {
    failed += 1;
    continue;
  }

  resolvable += 1;
  const update = updateFor(row, hierarchy);
  if (!update) {
    skipped += 1;
    continue;
  }

  proposed += 1;
  if (!apply) continue;

  const write = await supabase
    .from("ticketmaster_capi_events")
    .update(update)
    .eq("id", row.id);

  if (write.error) throw new Error(`update ${row.event_id.slice(0, 12)}: ${write.error.message}`);
  updated += 1;
}

console.log(JSON.stringify({
  apply,
  checked,
  cutoff,
  failed,
  mode: apply ? "apply" : "dry_run",
  proposed,
  resolvable,
  skipped,
  updated,
}, null, 2));
