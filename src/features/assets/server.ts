import { currentUser } from "@clerk/nextjs/server";
import {
  detectProvider,
  downloadCloudFile,
  listCloudFolder,
  type CloudFile,
} from "@/lib/cloud-import";
import { classifyAsset } from "@/lib/asset-classifier";
import { insertAssetRow, uploadToAssetStorage } from "@/lib/asset-storage";
import { getMemberAccessForSlug } from "@/lib/member-access";
import { supabaseAdmin } from "@/lib/supabase";
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

export async function listAssets(clientSlug: string): Promise<AssetRow[]> {
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { data, error } = await supabaseAdmin
    .from("ad_assets")
    .select(ASSET_SELECT)
    .eq("client_slug", clientSlug)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as AssetRow[];
}

function normalizeCampaignName(value: string | null | undefined) {
  return (value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
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

export async function listCampaignAssets(
  clientSlug: string,
  campaignName: string,
  limit = 8,
): Promise<AssetRow[]> {
  if (!supabaseAdmin) throw new Error("DB not configured");

  const normalizedCampaign = normalizeCampaignName(campaignName);
  if (!normalizedCampaign) return [];

  const { data, error } = await supabaseAdmin
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
