import { NextRequest, NextResponse } from "next/server";
import { adminGuard, apiError } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";
import {
  detectProvider,
  listCloudFolder,
  downloadCloudFile,
} from "@/lib/cloud-import";
import { uploadToAssetStorage, insertAssetRow } from "@/lib/asset-storage";

export const dynamic = "force-dynamic";

const CONCURRENCY = 4;

async function processInBatches<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(batch.map(fn));
    for (const r of batchResults) {
      if (r.status === "fulfilled") results.push(r.value);
    }
  }
  return results;
}

// ─── POST: import assets from a Dropbox or Google Drive shared folder ────────

export async function POST(req: NextRequest) {
  const guard = await adminGuard();
  if (guard) return guard;
  if (!supabaseAdmin) return apiError("DB not configured", 500);

  const body = await req.json();
  const { folder_url, client_slug, uploaded_by } = body as {
    folder_url: string;
    client_slug: string;
    uploaded_by: string;
  };

  if (!folder_url || !client_slug || !uploaded_by) {
    return apiError("folder_url, client_slug, and uploaded_by are required", 400);
  }

  const provider = detectProvider(folder_url);
  if (!provider) {
    return apiError("Unsupported URL. Paste a Dropbox or Google Drive shared folder link.", 400);
  }

  let listing;
  try {
    listing = await listCloudFolder(folder_url);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to list folder";
    return apiError(msg, 400);
  }

  if (listing.files.length === 0) {
    return NextResponse.json({ imported: 0, skipped: 0, message: "No media files found in folder." });
  }

  // Build source keys for incoming files and check which already exist
  const incomingKeys = listing.files.map((f) => `${provider}:${f.downloadUrl}`);
  const { data: existing } = await supabaseAdmin
    .from("ad_assets")
    .select("source_url")
    .eq("client_slug", client_slug)
    .in("source_url", incomingKeys);

  const existingUrls = new Set((existing ?? []).map((a) => a.source_url));

  const toImport = listing.files.filter(
    (f) => !existingUrls.has(`${provider}:${f.downloadUrl}`),
  );
  const skipped = listing.files.length - toImport.length;

  let imported = 0;
  const errors: string[] = [];

  await processInBatches(toImport, CONCURRENCY, async (file) => {
    const sourceKey = `${provider}:${file.downloadUrl}`;
    try {
      const { buffer, mimeType } = await downloadCloudFile(
        provider, folder_url, file.downloadUrl,
      );
      const { storagePath, publicUrl } = await uploadToAssetStorage(
        client_slug, file.name, buffer, mimeType,
      );
      await insertAssetRow({
        clientSlug: client_slug, fileName: file.name,
        storagePath, publicUrl, mimeType,
        uploadedBy: uploaded_by, sourceUrl: sourceKey,
      });
      imported++;
    } catch (err) {
      errors.push(`${file.name}: ${err instanceof Error ? err.message : "failed"}`);
    }
  });

  // Upsert asset_source record
  await supabaseAdmin.from("asset_sources").upsert(
    {
      client_slug,
      provider,
      folder_url,
      last_synced_at: new Date().toISOString(),
      file_count: imported + skipped,
    },
    { onConflict: "client_slug,folder_url" },
  );

  return NextResponse.json({
    imported,
    skipped,
    total: listing.files.length,
    errors: errors.length > 0 ? errors : undefined,
  });
}
