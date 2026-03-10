import { guessClientSlug } from "./client-slug";
import { supabaseAdmin } from "./supabase";

export interface CampaignClientAssignmentRow {
  campaign_id: string;
  client_slug: string | null;
  name?: string | null;
}

function normalizeGuessedClientSlug(value: string) {
  return value === "unknown" ? null : value;
}

export async function getCampaignClientOverrideMap(
  campaignIds?: Iterable<string>,
): Promise<Map<string, string>> {
  const overrides = new Map<string, string>();
  if (!supabaseAdmin) return overrides;

  const uniqueCampaignIds = campaignIds
    ? [...new Set(Array.from(campaignIds).filter((value): value is string => Boolean(value)))]
    : [];

  let query = supabaseAdmin
    .from("campaign_client_overrides")
    .select("campaign_id, client_slug");

  if (uniqueCampaignIds.length > 0) {
    query = query.in("campaign_id", uniqueCampaignIds);
  } else {
    query = query.limit(1000);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  for (const row of data ?? []) {
    if (row.campaign_id && row.client_slug) {
      overrides.set(row.campaign_id as string, row.client_slug as string);
    }
  }

  return overrides;
}

export function resolveEffectiveCampaignClientSlug(
  row: CampaignClientAssignmentRow,
  overrides: Map<string, string>,
) {
  const override = overrides.get(row.campaign_id);
  if (override) return override;
  if (row.client_slug) return row.client_slug;
  return row.name ? normalizeGuessedClientSlug(guessClientSlug(row.name)) : null;
}

export async function applyEffectiveCampaignClientSlugs<T extends CampaignClientAssignmentRow>(
  rows: T[],
): Promise<T[]> {
  if (rows.length === 0) return rows;

  const overrides = await getCampaignClientOverrideMap(rows.map((row) => row.campaign_id));
  return rows.map((row) => ({
    ...row,
    client_slug: resolveEffectiveCampaignClientSlug(row, overrides),
  }));
}

export async function getEffectiveCampaignRowById<T extends CampaignClientAssignmentRow>(
  campaignId: string,
  select: string,
): Promise<T | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from("meta_campaigns")
    .select(select)
    .eq("campaign_id", campaignId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const [row] = await applyEffectiveCampaignClientSlugs([data as unknown as T]);
  return row ?? null;
}

export async function getEffectiveCampaignClientSlug(campaignId: string) {
  const row = await getEffectiveCampaignRowById<CampaignClientAssignmentRow>(
    campaignId,
    "campaign_id, client_slug, name",
  );

  return row?.client_slug ?? null;
}

export async function listEffectiveCampaignRowsForClientSlug<
  T extends CampaignClientAssignmentRow,
>(select: string, clientSlug: string): Promise<T[]> {
  if (!supabaseAdmin) return [];

  const [baseRowsRes, overrideRowsRes] = await Promise.all([
    supabaseAdmin
      .from("meta_campaigns")
      .select(select)
      .eq("client_slug", clientSlug)
      .limit(250),
    supabaseAdmin
      .from("campaign_client_overrides")
      .select("campaign_id")
      .eq("client_slug", clientSlug)
      .limit(250),
  ]);

  if (baseRowsRes.error) throw new Error(baseRowsRes.error.message);
  if (overrideRowsRes.error) throw new Error(overrideRowsRes.error.message);

  const baseRows = (baseRowsRes.data ?? []) as unknown as T[];
  const existingIds = new Set(baseRows.map((row) => row.campaign_id));
  const overrideCampaignIds = ((overrideRowsRes.data ?? []) as Array<{ campaign_id: string | null }>)
    .map((row) => row.campaign_id)
    .filter((value): value is string => Boolean(value))
    .filter((value) => !existingIds.has(value));

  let extraRows: T[] = [];
  if (overrideCampaignIds.length > 0) {
    const { data, error } = await supabaseAdmin
      .from("meta_campaigns")
      .select(select)
      .in("campaign_id", overrideCampaignIds);

    if (error) throw new Error(error.message);
    extraRows = (data ?? []) as unknown as T[];
  }

  const combinedRows = [...baseRows, ...extraRows];
  const effectiveRows = await applyEffectiveCampaignClientSlugs(combinedRows);
  return effectiveRows.filter((row) => row.client_slug === clientSlug);
}

export async function listEffectiveCampaignIdsForClientSlug(clientSlug: string) {
  const rows = await listEffectiveCampaignRowsForClientSlug<CampaignClientAssignmentRow>(
    "campaign_id, client_slug, name",
    clientSlug,
  );

  return rows.map((row) => row.campaign_id);
}

export async function campaignBelongsToClientSlug(campaignId: string, clientSlug: string) {
  const row = await getEffectiveCampaignRowById<CampaignClientAssignmentRow>(
    campaignId,
    "campaign_id, client_slug, name",
  );
  return row?.client_slug === clientSlug;
}
