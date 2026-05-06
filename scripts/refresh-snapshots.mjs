import { createClient } from "@supabase/supabase-js";

const META_API_VERSION = "v21.0";
const BATCH_SIZE = 50;
const today = new Date().toISOString().slice(0, 10);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const metaToken = process.env.META_ACCESS_TOKEN;
const rawMetaAccountId = process.env.META_AD_ACCOUNT_ID;

if (!supabaseUrl || !supabaseKey) {
  console.error("FAIL missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

if (!metaToken || !rawMetaAccountId) {
  console.error("FAIL missing META_ACCESS_TOKEN or META_AD_ACCOUNT_ID");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const metaAccountId = rawMetaAccountId.replace(/^act_/, "");

const clientRules = [
  { keywords: ["zamora", "arjona", "alofoke", "camila"], slug: "zamora" },
  { keywords: ["kybba"], slug: "kybba" },
  { keywords: ["beamina"], slug: "beamina" },
  { keywords: ["happy paws", "happy_paws"], slug: "happy_paws" },
  { keywords: ["don omar", "don_omar"], slug: "don_omar_bcn" },
  { keywords: ["distill", "destilado", "destilero"], slug: "distill_pr" },
  { keywords: ["vaz vil", "vaz_vil"], slug: "vaz_vil_enterprise" },
  { keywords: ["sienna"], slug: "sienna" },
  { keywords: ["9am", "9 am"], slug: "9am" },
  { keywords: ["outlet media"], slug: "outlet_media" },
  { keywords: ["chris r", "chris_r"], slug: "chris_r" },
  { keywords: ["proteccion final", "protección final"], slug: "proteccion_final" },
];

function guessClientSlug(campaignName) {
  const lower = String(campaignName ?? "").toLowerCase();
  const rule = clientRules.find((entry) => entry.keywords.some((keyword) => lower.includes(keyword)));
  return rule?.slug ?? "unknown";
}

function storedClientSlugOrNull(value) {
  return value && value !== "unknown" ? value : null;
}

function centsFromMetaDollarString(value) {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : null;
}

function integerFromMeta(value) {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : null;
}

function numberFromMeta(value) {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

const PURCHASE_ACTION_TYPES = [
  "omni_purchase",
  "purchase",
  "offsite_conversion.fb_pixel_purchase",
  "onsite_web_purchase",
];

function getPurchaseRoas(row) {
  const metrics = row?.purchase_roas;
  if (!metrics?.length) return null;

  for (const actionType of PURCHASE_ACTION_TYPES) {
    const metric = metrics.find((entry) => entry.action_type === actionType);
    const value = numberFromMeta(metric?.value);
    if (value != null) return value;
  }

  const fallback = metrics.find((entry) => entry.action_type?.includes("purchase"));
  return numberFromMeta(fallback?.value);
}

async function fetchMetaPages(url, label) {
  const rows = [];
  let nextUrl = url;

  while (nextUrl) {
    const response = await fetch(nextUrl);
    const body = await response.json();

    if (!response.ok || body.error) {
      throw new Error(`${label}: ${body.error?.message ?? `HTTP ${response.status}`}`);
    }

    rows.push(...(body.data ?? []));
    nextUrl = body.paging?.next ?? null;
  }

  return rows;
}

function buildCampaignsUrl() {
  const url = new URL(`https://graph.facebook.com/${META_API_VERSION}/act_${metaAccountId}/campaigns`);
  url.searchParams.set("access_token", metaToken);
  url.searchParams.set("effective_status", JSON.stringify(["ACTIVE"]));
  url.searchParams.set("fields", "id,name,status,objective,daily_budget,start_time");
  url.searchParams.set("limit", "500");
  return url.toString();
}

function buildInsightsUrl(campaignIds) {
  const url = new URL(`https://graph.facebook.com/${META_API_VERSION}/act_${metaAccountId}/insights`);
  url.searchParams.set("access_token", metaToken);
  url.searchParams.set("level", "campaign");
  url.searchParams.set("date_preset", "today");
  url.searchParams.set("fields", "campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,cpm,purchase_roas");
  url.searchParams.set("filtering", JSON.stringify([
    { field: "campaign.id", operator: "IN", value: campaignIds },
  ]));
  url.searchParams.set("limit", "500");
  return url.toString();
}

async function readExistingCampaignMetadata(campaignIds) {
  if (campaignIds.length === 0) return new Map();
  const { data, error } = await supabase
    .from("meta_campaigns")
    .select("campaign_id, client_slug, campaign_type")
    .in("campaign_id", campaignIds);

  if (error) throw new Error(`meta_campaigns metadata: ${error.message}`);
  return new Map((data ?? []).map((row) => [row.campaign_id, row]));
}

async function readCampaignOverrides(campaignIds) {
  if (campaignIds.length === 0) return new Map();
  const { data, error } = await supabase
    .from("campaign_client_overrides")
    .select("campaign_id, client_slug")
    .in("campaign_id", campaignIds);

  if (error) throw new Error(`campaign_client_overrides: ${error.message}`);
  return new Map((data ?? []).map((row) => [row.campaign_id, row.client_slug]));
}

async function readDbActiveCampaignIds() {
  const { data, error } = await supabase
    .from("meta_campaigns")
    .select("campaign_id")
    .eq("status", "ACTIVE");

  if (error) throw new Error(`meta_campaigns active lookup: ${error.message}`);
  return (data ?? []).map((row) => row.campaign_id);
}

async function markAbsentActiveCampaignsPaused(activeMetaCampaignIds, syncedAt) {
  const dbActiveCampaignIds = await readDbActiveCampaignIds();
  const activeMetaCampaignIdSet = new Set(activeMetaCampaignIds);
  const staleIds = dbActiveCampaignIds.filter((campaignId) => !activeMetaCampaignIdSet.has(campaignId));

  for (let index = 0; index < staleIds.length; index += BATCH_SIZE) {
    const batch = staleIds.slice(index, index + BATCH_SIZE);
    const { error } = await supabase
      .from("meta_campaigns")
      .update({ status: "PAUSED", synced_at: syncedAt })
      .in("campaign_id", batch);

    if (error) throw new Error(`meta_campaigns pause absent active campaigns: ${error.message}`);
  }

  return staleIds;
}

console.log(`Refreshing active campaign snapshots for ${today}`);

const campaigns = await fetchMetaPages(buildCampaignsUrl(), "campaigns");
const campaignIds = campaigns.map((campaign) => campaign.id);
const [existingMetadata, overrides] = await Promise.all([
  readExistingCampaignMetadata(campaignIds),
  readCampaignOverrides(campaignIds),
]);

const insightRows = [];
for (let index = 0; index < campaignIds.length; index += BATCH_SIZE) {
  const batch = campaignIds.slice(index, index + BATCH_SIZE);
  insightRows.push(...await fetchMetaPages(buildInsightsUrl(batch), `insights-${index}`));
}

const insightsByCampaignId = new Map(insightRows.map((row) => [row.campaign_id, row]));
const scrapedAt = new Date().toISOString();
const retiredCampaignIds = await markAbsentActiveCampaignsPaused(campaignIds, scrapedAt);

const campaignRows = campaigns.map((campaign) => {
  const insight = insightsByCampaignId.get(campaign.id);
  const existing = existingMetadata.get(campaign.id);
  const clientSlug = overrides.has(campaign.id)
    ? overrides.get(campaign.id)
    : storedClientSlugOrNull(existing?.client_slug)
    ?? guessClientSlug(campaign.name);

  return {
    campaign_id: campaign.id,
    campaign_type: existing?.campaign_type ?? "sales",
    client_slug: clientSlug,
    clicks: insight ? integerFromMeta(insight.clicks) : 0,
    cpc: insight ? numberFromMeta(insight.cpc) : null,
    cpm: insight ? numberFromMeta(insight.cpm) : null,
    ctr: insight ? numberFromMeta(insight.ctr) : null,
    daily_budget: integerFromMeta(campaign.daily_budget),
    impressions: insight ? integerFromMeta(insight.impressions) : 0,
    name: campaign.name,
    objective: campaign.objective ?? "",
    roas: getPurchaseRoas(insight),
    spend: insight ? centsFromMetaDollarString(insight.spend) : 0,
    start_time: campaign.start_time ?? null,
    status: campaign.status,
    synced_at: scrapedAt,
  };
});

const snapshotRows = campaignRows.map((row) => ({
  campaign_id: row.campaign_id,
  clicks: row.clicks,
  cpc: row.cpc,
  cpm: row.cpm,
  ctr: row.ctr,
  impressions: row.impressions,
  roas: row.roas,
  snapshot_date: today,
  spend: row.spend,
}));

if (campaignRows.length > 0) {
  const { error: campaignError } = await supabase
    .from("meta_campaigns")
    .upsert(campaignRows, { onConflict: "campaign_id" });

  if (campaignError) {
    throw new Error(`meta_campaigns upsert: ${campaignError.message}`);
  }
}

if (snapshotRows.length > 0) {
  const { error: snapshotError } = await supabase
    .from("campaign_snapshots")
    .upsert(snapshotRows, { onConflict: "campaign_id,snapshot_date" });

  if (snapshotError) {
    throw new Error(`campaign_snapshots upsert: ${snapshotError.message}`);
  }
}

console.log(`PASS campaigns_refreshed=${campaignRows.length}`);
console.log(`PASS campaigns_retired=${retiredCampaignIds.length}`);
console.log(`PASS snapshots_upserted=${snapshotRows.length}`);
console.log(`PASS insights_returned=${insightRows.length}`);
console.log(`PASS insights_missing=${campaignRows.length - insightsByCampaignId.size}`);
