import { META_API_VERSION, type CampaignRangeInput, META_PRESETS } from "./constants";
import {
  getCampaignClientOverrideMap,
  resolveEffectiveCampaignClientSlug,
} from "./campaign-client-assignment";
import { centsToUsd } from "./formatters";
import type { MetaInsightsTimeRange } from "./meta-api";
import { supabaseAdmin } from "./supabase";

export interface MetaCampaignCard {
  campaignId: string;
  name: string;
  status: string;
  objective: string;
  clientSlug: string;
  campaignType: string;
  spend: number;
  roas: number | null;
  revenue: number | null;
  impressions: number;
  clicks: number;
  ctr: number | null;
  cpc: number | null;
  cpm: number | null;
  dailyBudget: number | null;
  startTime: string | null;
}

export interface DailyInsight {
  campaignId: string;
  date: string;
  spend: number;
  roas: number | null;
}

export interface MetaCampaignsResult {
  campaigns: MetaCampaignCard[];
  dailyInsights: DailyInsight[];
  clients: string[];
  error: string | null;
}

function getCredentials() {
  const token = process.env.META_ACCESS_TOKEN;
  const rawAccountId = process.env.META_AD_ACCOUNT_ID;
  if (!token || !rawAccountId) return null;
  const accountId = rawAccountId.replace(/^act_/, "");
  return { token, accountId };
}

interface MetaPagedResponse<T> {
  data: T[];
  paging?: { next?: string };
}

async function fetchAllPages<T>(url: string, label?: string): Promise<T[]> {
  const all: T[] = [];
  let nextUrl: string | null = url;
  while (nextUrl) {
    const res = await fetch(nextUrl, { next: { revalidate: 300 } });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      const message = `[meta-campaigns] ${label ?? "fetch"} failed (${res.status}): ${body.slice(0, 500)}`;
      console.error(message);
      throw new Error(message);
    }
    const json = await res.json();
    if (json.error) {
      const detail = json.error.message ?? JSON.stringify(json.error);
      const message = `[meta-campaigns] ${label ?? "fetch"} API error: ${detail}`;
      console.error(message);
      throw new Error(message);
    }
    const paged = json as MetaPagedResponse<T>;
    if (paged.data) all.push(...paged.data);
    nextUrl = paged.paging?.next ?? null;
  }
  return all;
}

interface RawCampaign {
  id: string;
  name: string;
  status: string;
  objective?: string;
  daily_budget?: string;
  start_time?: string;
}

interface RawInsight {
  campaign_id: string;
  campaign_name: string;
  spend: string;
  impressions: string;
  clicks: string;
  ctr: string;
  cpc: string;
  cpm: string;
  purchase_roas?: Array<{ action_type: string; value: string }>;
}

interface RawDailyInsight extends RawInsight {
  date_start: string;
}

interface StoredCampaignRow {
  campaign_id: string;
  campaign_type: string | null;
  client_slug: string | null;
  clicks: number | string | null;
  cpc: number | string | null;
  cpm: number | string | null;
  ctr: number | string | null;
  daily_budget: number | string | null;
  impressions: number | string | null;
  name: string | null;
  objective: string | null;
  roas: number | string | null;
  spend: number | string | null;
  start_time: string | null;
  status: string | null;
}

interface StoredSnapshotRow {
  campaign_id: string;
  roas: number | string | null;
  snapshot_date: string;
  spend: number | string | null;
}

interface StoredCampaignMetadata {
  campaignType: string | null;
  clientSlug: string | null;
}

async function loadCampaignMetadata(): Promise<Map<string, StoredCampaignMetadata>> {
  const metadata = new Map<string, StoredCampaignMetadata>();
  if (!supabaseAdmin) return metadata;
  const { data, error } = await supabaseAdmin
    .from("meta_campaigns")
    .select("campaign_id, campaign_type, client_slug");
  if (error) throw new Error(error.message);
  for (const row of data ?? []) {
    metadata.set(row.campaign_id, {
      campaignType: row.campaign_type ?? null,
      clientSlug: row.client_slug ?? null,
    });
  }
  return metadata;
}

async function loadActiveClientSlugs(): Promise<string[]> {
  if (!supabaseAdmin) return [];
  const { data, error } = await supabaseAdmin
    .from("clients")
    .select("slug")
    .eq("status", "active");
  if (error) throw new Error(error.message);
  return data?.map((r) => r.slug).filter(Boolean) ?? [];
}

async function readOptionalSupabaseData<T>(label: string, read: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await read();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[meta-campaigns] optional Supabase ${label} unavailable: ${message}`);
    return fallback;
  }
}

function safeParseFloat(s: string | null | undefined): number | null {
  const n = parseFloat(s ?? "");
  return Number.isFinite(n) ? n : null;
}

function toNumber(value: number | string | null | undefined): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function centsToDollars(value: number | string | null | undefined): number | null {
  const cents = toNumber(value);
  return cents == null ? null : (centsToUsd(cents) as number);
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

function getSnapshotBounds(range: CampaignRangeInput | MetaInsightsTimeRange) {
  if (typeof range !== "string") {
    return { since: range.since, until: range.until };
  }

  const today = new Date();
  const todayIso = toIsoDate(today);
  if (range === "lifetime") return null;
  if (range === "today") return { since: todayIso, until: todayIso };
  if (range === "yesterday") {
    const yesterday = toIsoDate(addDays(today, -1));
    return { since: yesterday, until: yesterday };
  }

  const days = Number(range);
  if (Number.isFinite(days) && days > 0) {
    return { since: toIsoDate(addDays(today, -(days - 1))), until: todayIso };
  }

  return null;
}

function toStoredCampaignCard(row: StoredCampaignRow): MetaCampaignCard {
  const spend = centsToDollars(row.spend) ?? 0;
  const roas = toNumber(row.roas);

  return {
    campaignId: row.campaign_id,
    name: row.name ?? row.campaign_id,
    status: row.status ?? "UNKNOWN",
    objective: row.objective ?? "",
    clientSlug: row.client_slug ?? "unknown",
    campaignType: row.campaign_type ?? "sales",
    spend,
    roas,
    revenue: roas != null ? spend * roas : null,
    impressions: toNumber(row.impressions) ?? 0,
    clicks: toNumber(row.clicks) ?? 0,
    ctr: toNumber(row.ctr),
    cpc: toNumber(row.cpc),
    cpm: toNumber(row.cpm),
    dailyBudget: centsToDollars(row.daily_budget),
    startTime: row.start_time ?? null,
  };
}

async function fetchStoredCampaigns(
  range: CampaignRangeInput | MetaInsightsTimeRange,
  clientSlug: string | null | undefined,
  error: string,
): Promise<MetaCampaignsResult> {
  if (!supabaseAdmin) {
    return { campaigns: [], dailyInsights: [], clients: [], error };
  }

  try {
    const [campaignsRes, dbClientSlugs] = await Promise.all([
      supabaseAdmin
        .from("meta_campaigns")
        .select("campaign_id, name, status, objective, daily_budget, spend, roas, impressions, clicks, ctr, cpc, cpm, campaign_type, start_time, client_slug")
        .order("spend", { ascending: false })
        .limit(1000),
      readOptionalSupabaseData("client slugs", () => loadActiveClientSlugs(), []),
    ]);

    if (campaignsRes.error) {
      console.error("[meta-campaigns] Supabase campaign fallback failed:", campaignsRes.error.message);
      return { campaigns: [], dailyInsights: [], clients: dbClientSlugs, error };
    }

    const baseRows = (campaignsRes.data ?? []) as StoredCampaignRow[];
    const overrides = await readOptionalSupabaseData(
      "campaign overrides",
      () => getCampaignClientOverrideMap(baseRows.map((row) => row.campaign_id)),
      new Map<string, string>(),
    );
    const effectiveRows = baseRows.map((row) => ({
      ...row,
      client_slug: resolveEffectiveCampaignClientSlug(row, overrides),
    }));
    const filteredRows = clientSlug
      ? effectiveRows.filter((row) => row.client_slug === clientSlug)
      : effectiveRows;
    const campaignIds = filteredRows.map((row) => row.campaign_id);

    let dailyInsights: DailyInsight[] = [];
    if (campaignIds.length > 0) {
      let snapshotsQuery = supabaseAdmin
        .from("campaign_snapshots")
        .select("campaign_id, snapshot_date, spend, roas")
        .in("campaign_id", campaignIds)
        .order("snapshot_date", { ascending: true })
        .limit(5000);

      const bounds = getSnapshotBounds(range);
      if (bounds) {
        snapshotsQuery = snapshotsQuery.gte("snapshot_date", bounds.since).lte("snapshot_date", bounds.until);
      }

      const snapshotsRes = await snapshotsQuery;
      if (snapshotsRes.error) {
        console.error("[meta-campaigns] Supabase snapshot fallback failed:", snapshotsRes.error.message);
      } else {
        dailyInsights = ((snapshotsRes.data ?? []) as StoredSnapshotRow[]).map((row) => ({
          campaignId: row.campaign_id,
          date: row.snapshot_date,
          spend: centsToDollars(row.spend) ?? 0,
          roas: toNumber(row.roas),
        }));
      }
    }

    const slugSet = new Set<string>(dbClientSlugs);
    for (const row of effectiveRows) {
      if (row.client_slug && row.client_slug !== "unknown") slugSet.add(row.client_slug);
    }

    return {
      campaigns: filteredRows.map(toStoredCampaignCard),
      dailyInsights,
      clients: [...slugSet].sort(),
      error,
    };
  } catch (fallbackError) {
    const message = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
    console.error("[meta-campaigns] Supabase fallback unavailable:", message);
    return { campaigns: [], dailyInsights: [], clients: [], error };
  }
}

function getPurchaseRoas(insight: Pick<RawInsight, "purchase_roas"> | undefined): number | null {
  const roasVal = insight?.purchase_roas?.find(
    (r) => r.action_type === "omni_purchase",
  )?.value;
  return roasVal ? parseFloat(roasVal) : null;
}

function toCampaignCard(
  campaign: RawCampaign,
  insight: RawInsight | undefined,
  clientSlug: string,
  campaignType: string,
): MetaCampaignCard {
  const spend = insight ? parseFloat(insight.spend) || 0 : 0;
  const roas = getPurchaseRoas(insight);

  return {
    campaignId: campaign.id,
    name: campaign.name,
    status: campaign.status,
    objective: campaign.objective ?? "",
    clientSlug,
    campaignType,
    spend,
    roas,
    revenue: roas != null ? spend * roas : null,
    impressions: insight ? parseInt(insight.impressions) || 0 : 0,
    clicks: insight ? parseInt(insight.clicks) || 0 : 0,
    ctr: insight ? safeParseFloat(insight.ctr) : null,
    cpc: insight ? safeParseFloat(insight.cpc) : null,
    cpm: insight ? safeParseFloat(insight.cpm) : null,
    dailyBudget: campaign.daily_budget ? centsToUsd(parseInt(campaign.daily_budget)) : null,
    startTime: campaign.start_time ?? null,
  };
}

async function fetchMetaJson<T>(url: string, label: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const message = `[meta-campaigns] ${label} failed (${res.status}): ${body.slice(0, 500)}`;
    console.error(message);
    throw new Error(message);
  }

  const json = await res.json();
  if (json.error) {
    const detail = json.error.message ?? JSON.stringify(json.error);
    const message = `[meta-campaigns] ${label} API error: ${detail}`;
    console.error(message);
    throw new Error(message);
  }

  return json as T;
}

function buildCampaignFilter(ids: string[]): string {
  return JSON.stringify([
    { field: "campaign.id", operator: "IN", value: ids },
  ]);
}

function buildInsightsUrl(
  base: string,
  token: string,
  range: CampaignRangeInput | MetaInsightsTimeRange,
  filter: string | null,
  fields: string,
  limit: string,
  timeIncrement?: string,
): string {
  const url = new URL(`${base}/insights`);
  url.searchParams.set("access_token", token);
  url.searchParams.set("level", "campaign");
  url.searchParams.set("fields", fields);
  if (filter) url.searchParams.set("filtering", filter);
  if (typeof range === "string") {
    url.searchParams.set("date_preset", META_PRESETS[range]);
  } else {
    url.searchParams.set("time_range", JSON.stringify({ since: range.since, until: range.until }));
  }
  url.searchParams.set("limit", limit);
  if (timeIncrement) url.searchParams.set("time_increment", timeIncrement);
  return url.toString();
}

export async function fetchCampaignById(
  campaignId: string,
  range: CampaignRangeInput | MetaInsightsTimeRange = "today",
): Promise<{ campaign: MetaCampaignCard | null; dailyInsights: DailyInsight[]; error: string | null }> {
  const creds = getCredentials();
  if (!creds) {
    return {
      campaign: null,
      dailyInsights: [],
      error: "Meta API credentials not configured",
    };
  }

  const { token } = creds;
  const base = `https://graph.facebook.com/${META_API_VERSION}/${campaignId}`;
  const campaignUrl = new URL(base);
  campaignUrl.searchParams.set("access_token", token);
  campaignUrl.searchParams.set(
    "fields",
    "id,name,status,objective,daily_budget,start_time",
  );

  try {
    const [rawCampaign, overrides, campaignMetadata] = await Promise.all([
      fetchMetaJson<RawCampaign>(campaignUrl.toString(), `campaign-${campaignId}`),
      readOptionalSupabaseData("campaign overrides", () => getCampaignClientOverrideMap(), new Map<string, string>()),
      readOptionalSupabaseData(
        "campaign metadata",
        () => loadCampaignMetadata(),
        new Map<string, StoredCampaignMetadata>(),
      ),
    ]);

    const fields = "campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,cpm,purchase_roas";
    const [rawInsights, rawDaily] = await Promise.all([
      fetchAllPages<RawInsight>(
        buildInsightsUrl(base, token, range, null, fields, "25"),
        `campaign-insights-${campaignId}`,
      ),
      fetchAllPages<RawDailyInsight>(
        buildInsightsUrl(base, token, range, null, "campaign_id,spend,purchase_roas", "5000", "1"),
        `campaign-daily-${campaignId}`,
      ),
    ]);

    const clientSlug = resolveEffectiveCampaignClientSlug(
      {
        campaign_id: rawCampaign.id,
        client_slug: campaignMetadata.get(rawCampaign.id)?.clientSlug ?? null,
        name: rawCampaign.name,
      },
      overrides,
    ) ?? "unknown";

    const dailyInsights: DailyInsight[] = rawDaily.map((d) => ({
      campaignId: d.campaign_id,
      date: d.date_start,
      spend: parseFloat(d.spend) || 0,
      roas: getPurchaseRoas(d),
    }));

    return {
      campaign: toCampaignCard(
        rawCampaign,
        rawInsights.find((row) => row.campaign_id === campaignId) ?? rawInsights[0],
        clientSlug,
        campaignMetadata.get(rawCampaign.id)?.campaignType ?? "sales",
      ),
      dailyInsights,
      error: null,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Meta API request failed";
    return { campaign: null, dailyInsights: [], error: msg };
  }
}

export async function fetchAllCampaigns(
  range: CampaignRangeInput | MetaInsightsTimeRange,
  clientSlug?: string | null,
): Promise<MetaCampaignsResult> {
  const creds = getCredentials();
  if (!creds) {
    return fetchStoredCampaigns(range, clientSlug, "Meta API credentials not configured");
  }

  const { token, accountId } = creds;
  const base = `https://graph.facebook.com/${META_API_VERSION}/act_${accountId}`;

  // Phase 1: fetch campaign list (lightweight -- no insights data)
  const campaignsUrl = new URL(`${base}/campaigns`);
  campaignsUrl.searchParams.set("access_token", token);
  campaignsUrl.searchParams.set(
    "fields",
    "id,name,status,objective,daily_budget,start_time",
  );
  campaignsUrl.searchParams.set("limit", "500");

  try {
    const [rawCampaigns, overrides, dbClientSlugs, campaignMetadata] = await Promise.all([
      fetchAllPages<RawCampaign>(campaignsUrl.toString(), "campaigns"),
      readOptionalSupabaseData("campaign overrides", () => getCampaignClientOverrideMap(), new Map<string, string>()),
      readOptionalSupabaseData("client slugs", () => loadActiveClientSlugs(), []),
      readOptionalSupabaseData(
        "campaign metadata",
        () => loadCampaignMetadata(),
        new Map<string, StoredCampaignMetadata>(),
      ),
    ]);

    // Derive client slugs: Supabase override > stored slug > guessed fallback
    const campaignSlugs = new Map<string, string>();
    for (const c of rawCampaigns) {
      const resolvedClientSlug = resolveEffectiveCampaignClientSlug(
        {
          campaign_id: c.id,
          client_slug: campaignMetadata.get(c.id)?.clientSlug ?? null,
          name: c.name,
        },
        overrides,
      );
      campaignSlugs.set(c.id, resolvedClientSlug ?? "unknown");
    }
    // Merge campaign-derived slugs with all clients from the clients table
    const slugSet = new Set(campaignSlugs.values());
    for (const s of dbClientSlugs) slugSet.add(s);
    slugSet.delete("unknown");
    const clients = [...slugSet].sort();

    // Phase 2: filter campaigns before fetching insights
    const filtered = clientSlug
      ? rawCampaigns.filter((c) => campaignSlugs.get(c.id) === clientSlug)
      : rawCampaigns;

    const insightIds = filtered.map((c) => c.id);

    // Fetch insights in batches (Meta API has URL length limits)
    const BATCH = 50;
    const rawInsights: RawInsight[] = [];
    const rawDaily: RawDailyInsight[] = [];
    const insightsFields = "campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,cpm,purchase_roas";

    for (let i = 0; i < insightIds.length; i += BATCH) {
      const batch = insightIds.slice(i, i + BATCH);
      const filter = buildCampaignFilter(batch);

      const [insights, daily] = await Promise.all([
        fetchAllPages<RawInsight>(
          buildInsightsUrl(base, token, range, filter, insightsFields, "500"),
          `insights-${i}`,
        ),
        fetchAllPages<RawDailyInsight>(
          buildInsightsUrl(base, token, range, filter, "campaign_id,spend,purchase_roas", "5000", "1"),
          `daily-${i}`,
        ),
      ]);
      rawInsights.push(...insights);
      rawDaily.push(...daily);
    }

    const insightMap = new Map<string, RawInsight>();
    for (const row of rawInsights) {
      insightMap.set(row.campaign_id, row);
    }

    const campaigns: MetaCampaignCard[] = filtered.map((c) =>
      toCampaignCard(
        c,
        insightMap.get(c.id),
        campaignSlugs.get(c.id) ?? "unknown",
        campaignMetadata.get(c.id)?.campaignType ?? "sales",
      ),
    );

    const dailyInsights: DailyInsight[] = rawDaily.map((d) => ({
      campaignId: d.campaign_id,
      date: d.date_start,
      spend: parseFloat(d.spend) || 0,
      roas: getPurchaseRoas(d),
    }));

    return { campaigns, dailyInsights, clients, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Meta API request failed";
    return fetchStoredCampaigns(range, clientSlug, msg);
  }
}
