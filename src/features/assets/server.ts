import { currentUser } from "@clerk/nextjs/server";
import {
  detectProvider,
  downloadCloudFile,
  listCloudFolder,
  type CloudFile,
} from "@/lib/cloud-import";
import { classifyAsset } from "@/lib/asset-classifier";
import { insertAssetRow, uploadToAssetStorage } from "@/lib/asset-storage";
import {
  applyEffectiveCampaignClientSlugs,
  listEffectiveCampaignRowsForClientSlug,
} from "@/lib/campaign-client-assignment";
import { getMemberAccessForSlug, type ScopeFilter } from "@/lib/member-access";
import { createClerkSupabaseClient, supabaseAdmin } from "@/lib/supabase";
import type { AssetRow } from "./types";

const CONCURRENCY = 4;
export const MAX_ASSET_FILE_SIZE = 50 * 1024 * 1024;
export const ALLOWED_ASSET_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
]);

const ASSET_SELECT =
  "id, file_name, public_url, media_type, placement, format, folder, labels, status, created_at, width, height";
const ASSET_OPERATING_SELECT = `${ASSET_SELECT}, client_slug, source_url, uploaded_by, storage_path`;

export interface AssetOperatingRecord extends AssetRow {
  client_slug: string;
  source_url: string | null;
  uploaded_by: string | null;
  storage_path: string | null;
}

export interface AssetLinkedCampaign {
  campaignId: string;
  name: string;
  status: string;
  spend: number | null;
  roas: number | null;
  impressions: number | null;
  clicks: number | null;
}

export interface AssetLibraryRecord {
  asset: AssetOperatingRecord;
  linkedCampaignCount: number;
  linkedCampaignNames: string[];
}

export interface AssetOperatingData {
  asset: AssetOperatingRecord;
  linkedCampaigns: AssetLinkedCampaign[];
}

interface BatchResult<R> {
  successes: R[];
  errors: string[];
}

interface UploadAssetFileParams {
  file: File;
  clientSlug: string;
  uploadedBy: string;
  classify?: boolean;
}

interface ImportAssetsFromFolderParams {
  folderUrl: string;
  clientSlug: string;
  uploadedBy: string;
  classify?: boolean;
  onListError?: (error: string, provider: "dropbox" | "gdrive") => Promise<void> | void;
  onImportComplete?: (imported: number) => Promise<void> | void;
}

interface CampaignMatchSummary {
  campaignId: string;
  campaignName: string;
  count: number;
}

interface AssetScopeCampaign {
  campaignId: string;
  eventId: string | null;
  name: string | null;
}

interface ImportedAssetResult {
  campaignId: string | null;
  campaignName: string | null;
  fileName: string;
}

interface UploadAssetFileResult {
  asset: Record<string, unknown>;
  campaignId: string | null;
  campaignName: string | null;
}

export async function canAccessClientAssets(
  userId: string,
  clientSlug: string,
): Promise<boolean> {
  const user = await currentUser();
  const meta = (user?.publicMetadata ?? {}) as { role?: string };
  if (meta.role === "admin") return true;
  return !!(await getMemberAccessForSlug(userId, clientSlug));
}

export async function getClientAssetScope(
  userId: string,
  clientSlug: string,
): Promise<ScopeFilter | undefined> {
  const user = await currentUser();
  const meta = (user?.publicMetadata ?? {}) as { role?: string };
  if (meta.role === "admin") return undefined;

  const access = await getMemberAccessForSlug(userId, clientSlug);
  if (access?.scope !== "assigned") return undefined;

  return {
    allowedCampaignIds: access.allowedCampaignIds,
    allowedEventIds: access.allowedEventIds,
  };
}

function mapAssetOperatingRecordToAssetRow(asset: AssetOperatingRecord): AssetRow {
  return {
    id: asset.id,
    file_name: asset.file_name,
    public_url: asset.public_url,
    media_type: asset.media_type,
    placement: asset.placement,
    format: asset.format,
    folder: asset.folder,
    labels: asset.labels,
    status: asset.status,
    created_at: asset.created_at,
    width: asset.width,
    height: asset.height,
  };
}

function filterCampaignsForScope(
  campaigns: AssetScopeCampaign[],
  scope?: ScopeFilter,
): AssetScopeCampaign[] | null {
  if (!scope?.allowedCampaignIds && !scope?.allowedEventIds) {
    return null;
  }

  const allowedCampaignIds = new Set(scope.allowedCampaignIds ?? []);
  const allowedEventIds = new Set(scope.allowedEventIds ?? []);

  if (allowedCampaignIds.size === 0 && allowedEventIds.size === 0) {
    return [];
  }

  return campaigns.filter((campaign) => {
    if (allowedCampaignIds.has(campaign.campaignId)) return true;
    if (campaign.eventId && allowedEventIds.has(campaign.eventId)) return true;
    return false;
  });
}

export function assetMatchesScopedCampaigns(
  asset: Pick<AssetOperatingRecord, "folder" | "labels">,
  campaigns: Pick<AssetScopeCampaign, "name">[] | null,
) {
  if (campaigns === null) return true;
  if (campaigns.length === 0) return false;
  return campaigns.some((campaign) => assetMatchesCampaignName(asset, campaign.name));
}

async function listClientCampaignsForAssets(clientSlug: string): Promise<AssetScopeCampaign[]> {
  const rows = await listEffectiveCampaignRowsForClientSlug<{
    campaign_id: string;
    client_slug: string | null;
    name: string | null;
    tm_event_id: string | null;
  }>("campaign_id, client_slug, name, tm_event_id", clientSlug);

  return rows.map((row) => ({
    campaignId: row.campaign_id as string,
    eventId: (row.tm_event_id as string | null) ?? null,
    name: (row.name as string | null) ?? null,
  }));
}

async function getAssetReadContext(clientSlug?: string | null) {
  if (!supabaseAdmin) return null;
  if (!clientSlug) {
    return {
      db: supabaseAdmin,
      usesClerkScopedReads: false,
    };
  }

  try {
    const user = await currentUser();
    const meta = (user?.publicMetadata ?? {}) as { role?: string };
    if (meta.role === "admin") {
      return {
        db: supabaseAdmin,
        usesClerkScopedReads: false,
      };
    }
  } catch {
    return {
      db: supabaseAdmin,
      usesClerkScopedReads: false,
    };
  }

  const userScopedClient = await createClerkSupabaseClient();
  if (!userScopedClient) {
    return {
      db: supabaseAdmin,
      usesClerkScopedReads: false,
    };
  }

  return {
    db: userScopedClient,
    usesClerkScopedReads: true,
  };
}

export async function listVisibleAssetIdsForScope(
  clientSlug: string,
  assetIds: string[],
  scope?: ScopeFilter,
): Promise<Set<string> | null> {
  if (!supabaseAdmin) throw new Error("DB not configured");
  if (!scope?.allowedCampaignIds && !scope?.allowedEventIds) {
    return null;
  }

  if (assetIds.length === 0) {
    return new Set<string>();
  }

  const scopedCampaigns = filterCampaignsForScope(
    await listClientCampaignsForAssets(clientSlug),
    scope,
  );

  if (!scopedCampaigns || scopedCampaigns.length === 0) {
    return new Set<string>();
  }

  const { data, error } = await supabaseAdmin
    .from("ad_assets")
    .select("id, folder, labels")
    .eq("client_slug", clientSlug)
    .in("id", assetIds);

  if (error) throw new Error(error.message);

  return new Set(
    ((data ?? []) as Record<string, unknown>[])
      .filter((asset) =>
        assetMatchesScopedCampaigns(
          {
            folder: (asset.folder as string | null) ?? null,
            labels: (asset.labels as string[] | null) ?? null,
          },
          scopedCampaigns,
        ),
      )
      .map((asset) => String(asset.id)),
  );
}

export async function listAssets(
  clientSlug: string,
  scope?: ScopeFilter,
): Promise<AssetRow[]> {
  const readContext = await getAssetReadContext(clientSlug);
  if (!readContext) throw new Error("DB not configured");

  const [assetsRes, campaigns] = await Promise.all([
    readContext.db
      .from("ad_assets")
      .select(ASSET_OPERATING_SELECT)
      .eq("client_slug", clientSlug)
      .order("created_at", { ascending: false }),
    listClientCampaignsForAssets(clientSlug),
  ]);

  const { data, error } = assetsRes;

  if (error) throw new Error(error.message);
  const scopedCampaigns = filterCampaignsForScope(campaigns, scope);

  return ((data ?? []) as AssetOperatingRecord[])
    .filter((asset) => assetMatchesScopedCampaigns(asset, scopedCampaigns))
    .map((asset) => mapAssetOperatingRecordToAssetRow(asset));
}

export async function getAssetRecordById(
  assetId: string,
  db: typeof supabaseAdmin = supabaseAdmin,
): Promise<AssetOperatingRecord | null> {
  if (!db) throw new Error("DB not configured");

  const { data, error } = await db
    .from("ad_assets")
    .select(ASSET_OPERATING_SELECT)
    .eq("id", assetId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as AssetOperatingRecord | null) ?? null;
}

function normalizeCampaignName(value: string | null | undefined) {
  return (value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function assetNameTokens(asset: Pick<AssetOperatingRecord, "folder" | "labels">) {
  const tokens = new Set<string>();

  const folderRoot =
    typeof asset.folder === "string" && asset.folder.length > 0
      ? asset.folder.split("/")[0]
      : null;
  const normalizedFolder = normalizeCampaignName(folderRoot);
  if (normalizedFolder) tokens.add(normalizedFolder);

  if (Array.isArray(asset.labels)) {
    for (const label of asset.labels) {
      const normalized = normalizeCampaignName(label);
      if (normalized) tokens.add(normalized);
    }
  }

  return tokens;
}

function assetMatchesCampaignName(
  asset: Pick<AssetOperatingRecord, "folder" | "labels">,
  campaignName: string | null | undefined,
) {
  const normalizedCampaign = normalizeCampaignName(campaignName);
  if (!normalizedCampaign) return false;
  return assetNameTokens(asset).has(normalizedCampaign);
}

function toNullableNumber(value: number | string | null | undefined) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function summarizeCampaignMatches(matches: ImportedAssetResult[]): CampaignMatchSummary[] {
  const counts = new Map<string, CampaignMatchSummary>();

  for (const match of matches) {
    if (!match.campaignId || !match.campaignName) continue;

    const existing = counts.get(match.campaignId);
    if (existing) {
      existing.count += 1;
      continue;
    }

    counts.set(match.campaignId, {
      campaignId: match.campaignId,
      campaignName: match.campaignName,
      count: 1,
    });
  }

  return Array.from(counts.values()).sort((a, b) => b.count - a.count);
}

export async function listAssetLibrary(
  clientSlug?: string | null,
  limit = 72,
  scope?: ScopeFilter,
): Promise<AssetLibraryRecord[]> {
  const readContext = await getAssetReadContext(clientSlug);
  if (!readContext || !supabaseAdmin) throw new Error("DB not configured");

  let assetsQuery = readContext.db
    .from("ad_assets")
    .select(ASSET_OPERATING_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (clientSlug) {
    assetsQuery = assetsQuery.eq("client_slug", clientSlug);
  }

  const campaignsQuery = clientSlug
    ? listEffectiveCampaignRowsForClientSlug<{
        campaign_id: string;
        client_slug: string | null;
        name: string | null;
        tm_event_id: string | null;
      }>("campaign_id, client_slug, name, tm_event_id", clientSlug)
    : supabaseAdmin
        .from("meta_campaigns")
        .select("campaign_id, client_slug, name, tm_event_id")
        .limit(600)
        .then(async ({ data, error }) => {
          if (error) throw new Error(error.message);
          return applyEffectiveCampaignClientSlugs(
            ((data ?? []) as Array<{
              campaign_id: string;
              client_slug: string | null;
              name: string | null;
              tm_event_id: string | null;
            }>),
          );
        });

  const [assetsRes, campaignsRes] = await Promise.all([assetsQuery, campaignsQuery]);

  if (assetsRes.error) throw new Error(assetsRes.error.message);

  const campaignsBySlug = new Map<
    string,
    AssetScopeCampaign[]
  >();

  for (const row of campaignsRes ?? []) {
    const slug = row.client_slug as string | null;
    if (!slug) continue;

    const existing = campaignsBySlug.get(slug) ?? [];
    existing.push({
      campaignId: row.campaign_id as string,
      eventId: (row.tm_event_id as string | null) ?? null,
      name: (row.name as string | null) ?? null,
    });
    campaignsBySlug.set(slug, existing);
  }

  const scopedCampaigns =
    clientSlug && scope
      ? filterCampaignsForScope(campaignsBySlug.get(clientSlug) ?? [], scope)
      : null;

  return ((assetsRes.data ?? []) as AssetOperatingRecord[])
    .filter((asset) =>
      clientSlug ? assetMatchesScopedCampaigns(asset, scopedCampaigns) : true,
    )
    .map((asset) => {
    const linkedCampaigns = (campaignsBySlug.get(asset.client_slug) ?? []).filter((campaign) =>
      assetMatchesCampaignName(asset, campaign.name),
    );

    return {
      asset,
      linkedCampaignCount: linkedCampaigns.length,
      linkedCampaignNames: linkedCampaigns
        .map((campaign) => campaign.name)
        .filter((name): name is string => typeof name === "string" && name.length > 0)
        .slice(0, 3),
    };
  });
}

export async function getAssetOperatingData(
  assetId: string,
  explicitCampaignIds: Iterable<string> = [],
  scope?: ScopeFilter,
  clientSlug?: string | null,
): Promise<AssetOperatingData | null> {
  const readContext = await getAssetReadContext(clientSlug);
  if (!readContext) throw new Error("DB not configured");

  const asset = await getAssetRecordById(assetId, readContext.db);
  if (!asset) return null;
  if (clientSlug && asset.client_slug !== clientSlug) return null;

  if (!supabaseAdmin) throw new Error("DB not configured");

  const explicitIds = new Set(explicitCampaignIds);
  const campaignRows = await listEffectiveCampaignRowsForClientSlug<{
    campaign_id: string;
    client_slug: string | null;
    name: string | null;
    status: string | null;
    spend: number | string | null;
    roas: number | string | null;
    impressions: number | string | null;
    clicks: number | string | null;
    tm_event_id: string | null;
  }>(
    "campaign_id, client_slug, name, status, spend, roas, impressions, clicks, tm_event_id",
    asset.client_slug,
  );

  const campaigns = campaignRows.map((row) => ({
    campaignId: row.campaign_id as string,
    clicks: toNullableNumber(row.clicks as number | string | null | undefined),
    eventId: (row.tm_event_id as string | null) ?? null,
    impressions: toNullableNumber(row.impressions as number | string | null | undefined),
    name: (row.name as string | null) ?? null,
    roas: toNullableNumber(row.roas as number | string | null | undefined),
    spend: toNullableNumber(row.spend as number | string | null | undefined),
    status: ((row.status as string | null) ?? "unknown") as string,
  }));
  const scopedCampaigns = filterCampaignsForScope(
    campaigns.map((campaign) => ({
      campaignId: campaign.campaignId,
      eventId: campaign.eventId,
      name: campaign.name,
    })),
    scope,
  );

  if (!assetMatchesScopedCampaigns(asset, scopedCampaigns)) {
    return null;
  }

  const linkedCampaigns = campaigns
    .filter((row) => {
      if (
        scopedCampaigns &&
        !scopedCampaigns.some((campaign) => campaign.campaignId === row.campaignId)
      ) {
        return false;
      }

      return explicitIds.has(row.campaignId) || assetMatchesCampaignName(asset, row.name);
    })
    .map((row) => ({
      campaignId: row.campaignId,
      name: row.name ?? row.campaignId,
      status: row.status,
      spend: row.spend,
      roas: row.roas,
      impressions: row.impressions,
      clicks: row.clicks,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    asset,
    linkedCampaigns,
  };
}

export async function listCampaignAssets(
  clientSlug: string,
  campaignName: string,
  limit = 8,
): Promise<AssetRow[]> {
  const readContext = await getAssetReadContext(clientSlug);
  if (!readContext) throw new Error("DB not configured");

  const normalizedCampaign = normalizeCampaignName(campaignName);
  if (!normalizedCampaign) return [];

  const { data, error } = await readContext.db
    .from("ad_assets")
    .select(ASSET_SELECT)
    .eq("client_slug", clientSlug)
    .order("created_at", { ascending: false })
    .limit(Math.max(limit * 6, 48));

  if (error) throw new Error(error.message);

  return (data ?? [])
    .filter((row) => {
      const folderRoot = normalizeCampaignName(
        typeof row.folder === "string" ? row.folder.split("/")[0] : null,
      );
      const labels = Array.isArray(row.labels)
        ? row.labels.map((label) => normalizeCampaignName(label))
        : [];

      return folderRoot === normalizedCampaign || labels.includes(normalizedCampaign);
    })
    .slice(0, limit) as AssetRow[];
}

export function validateAssetFile(file: File): string | null {
  if (file.size > MAX_ASSET_FILE_SIZE) {
    return "File too large. Max 50 MB.";
  }

  if (!ALLOWED_ASSET_TYPES.has(file.type)) {
    return `Unsupported file type: ${file.type}`;
  }

  return null;
}

export async function uploadAssetFile({
  file,
  clientSlug,
  uploadedBy,
  classify = false,
}: UploadAssetFileParams): Promise<UploadAssetFileResult> {
  if (!supabaseAdmin) throw new Error("DB not configured");

  const validationError = validateAssetFile(file);
  if (validationError) throw new Error(validationError);

  const buffer = Buffer.from(await file.arrayBuffer());
  const classification = classify
    ? await classifyAsset(file.name, buffer, file.type, clientSlug)
    : null;

  const { storagePath, publicUrl } = await uploadToAssetStorage(
    clientSlug,
    file.name,
    buffer,
    file.type,
  );

  try {
    const asset = await insertAssetRow({
      clientSlug,
      fileName: file.name,
      storagePath,
      publicUrl,
      mimeType: file.type,
      uploadedBy,
      placement: classification?.placement,
      folder: classification?.folder,
      labels: classification?.labels,
      width: classification?.width,
      height: classification?.height,
    });

    return {
      asset,
      campaignId: classification?.campaignId ?? null,
      campaignName: classification?.campaignName ?? null,
    };
  } catch (error) {
    await supabaseAdmin.storage.from("ad-assets").remove([storagePath]);
    throw error;
  }
}

export function userFacingImportError(raw: string): string {
  if (/all access methods failed/i.test(raw) || /all methods exhausted/i.test(raw)) {
    return "We couldn't access this folder right now. Our team has been notified and is working on it.";
  }
  if (/not configured/i.test(raw)) {
    return "We couldn't access this folder right now. Our team has been notified and is working on it.";
  }
  if (/Could not extract folder ID/i.test(raw)) {
    return "This doesn't look like a valid folder link. Paste the full URL from your browser.";
  }
  return "Something went wrong importing this folder. Our team has been notified.";
}

async function processInBatches<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<BatchResult<R>> {
  const successes: R[] = [];
  const errors: string[] = [];

  for (let index = 0; index < items.length; index += concurrency) {
    const batch = items.slice(index, index + concurrency);
    const results = await Promise.allSettled(batch.map(fn));

    for (const result of results) {
      if (result.status === "fulfilled") {
        successes.push(result.value);
      } else {
        errors.push(
          result.reason instanceof Error ? result.reason.message : String(result.reason),
        );
      }
    }
  }

  return { successes, errors };
}

async function importCloudFile(
  file: CloudFile,
  provider: "dropbox" | "gdrive",
  folderUrl: string,
  clientSlug: string,
  uploadedBy: string,
  classify: boolean,
): Promise<ImportedAssetResult> {
  if (!supabaseAdmin) throw new Error("DB not configured");

  const sourceKey = `${provider}:${file.downloadUrl}`;
  const { buffer, mimeType } = await downloadCloudFile(
    provider,
    folderUrl,
    file.downloadUrl,
  );
  const classification = classify
    ? await classifyAsset(file.name, buffer, mimeType, clientSlug)
    : null;

  const { storagePath, publicUrl } = await uploadToAssetStorage(
    clientSlug,
    file.name,
    buffer,
    mimeType,
  );

  try {
    await insertAssetRow({
      clientSlug,
      fileName: file.name,
      storagePath,
      publicUrl,
      mimeType,
      uploadedBy,
      sourceUrl: sourceKey,
      placement: classification?.placement,
      folder: classification?.folder,
      labels: classification?.labels,
      width: classification?.width,
      height: classification?.height,
    });
  } catch (error) {
    await supabaseAdmin.storage.from("ad-assets").remove([storagePath]);
    throw error;
  }

  return {
    fileName: file.name,
    campaignId: classification?.campaignId ?? null,
    campaignName: classification?.campaignName ?? null,
  };
}

export async function importAssetsFromFolder({
  folderUrl,
  clientSlug,
  uploadedBy,
  classify = false,
  onListError,
  onImportComplete,
}: ImportAssetsFromFolderParams): Promise<{
  campaignMatches: CampaignMatchSummary[];
  imported: number;
  skipped: number;
  total: number;
  errors?: string[];
  message?: string;
}> {
  if (!supabaseAdmin) throw new Error("DB not configured");

  const provider = detectProvider(folderUrl);
  if (!provider) {
    throw new Error("Unsupported URL. Paste a Dropbox or Google Drive shared folder link.");
  }

  let listing;
  try {
    listing = await listCloudFolder(folderUrl);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to list folder";
    await onListError?.(message, provider);
    throw new Error(message);
  }

  if (listing.files.length === 0) {
    return {
      campaignMatches: [],
      imported: 0,
      skipped: 0,
      total: 0,
      message: "No media files found in folder.",
    };
  }

  const incomingKeys = listing.files.map(
    (file) => `${provider}:${file.downloadUrl}`,
  );
  const { data: existing } = await supabaseAdmin
    .from("ad_assets")
    .select("source_url")
    .eq("client_slug", clientSlug)
    .in("source_url", incomingKeys);

  const existingUrls = new Set((existing ?? []).map((row) => row.source_url));
  const toImport = listing.files.filter(
    (file) => !existingUrls.has(`${provider}:${file.downloadUrl}`),
  );
  const skipped = listing.files.length - toImport.length;

  const { successes, errors } = await processInBatches(
    toImport,
    CONCURRENCY,
    (file) =>
      importCloudFile(
        file,
        provider,
        folderUrl,
        clientSlug,
        uploadedBy,
        classify,
      ),
  );

  const imported = successes.length;
  const campaignMatches = summarizeCampaignMatches(successes);

  await supabaseAdmin.from("asset_sources").upsert(
    {
      client_slug: clientSlug,
      provider,
      folder_url: folderUrl,
      last_synced_at: new Date().toISOString(),
      file_count: imported + skipped,
    },
    { onConflict: "client_slug,folder_url" },
  );

  if (imported > 0) {
    await onImportComplete?.(imported);
  }

  return {
    campaignMatches,
    imported,
    skipped,
    total: listing.files.length,
    errors: errors.length > 0 ? errors : undefined,
  };
}

export async function updateAsset(
  assetId: string,
  body: Record<string, unknown>,
) {
  if (!supabaseAdmin) throw new Error("DB not configured");

  const allowed = ["labels", "placement", "format", "status", "used_in_campaigns"];
  const updates: Record<string, unknown> = {};

  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }

  if (Object.keys(updates).length === 0) {
    throw new Error("No valid fields to update");
  }

  const { data, error } = await supabaseAdmin
    .from("ad_assets")
    .update(updates)
    .eq("id", assetId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Asset not found");
  return data;
}

export async function getAssetClientSlug(assetId: string): Promise<string | null> {
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { data } = await supabaseAdmin
    .from("ad_assets")
    .select("client_slug")
    .eq("id", assetId)
    .single();

  return data?.client_slug ?? null;
}

export async function deleteAssetById(assetId: string): Promise<{
  clientSlug: string;
  fileName: string;
  id: string;
}> {
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { data: asset } = await supabaseAdmin
    .from("ad_assets")
    .select("client_slug, file_name, storage_path")
    .eq("id", assetId)
    .single();

  if (!asset) throw new Error("Asset not found");

  await supabaseAdmin.storage.from("ad-assets").remove([asset.storage_path]);

  const { error } = await supabaseAdmin
    .from("ad_assets")
    .delete()
    .eq("id", assetId);

  if (error) throw new Error(error.message);

  return {
    clientSlug: asset.client_slug as string,
    fileName: asset.file_name as string,
    id: assetId,
  };
}
