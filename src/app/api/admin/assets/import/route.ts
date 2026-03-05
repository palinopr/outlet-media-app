import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { adminGuard, apiError } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";
import {
  detectProvider,
  listCloudFolder,
  downloadCloudFile,
  mediaTypeFromMime,
} from "@/lib/cloud-import";

export const dynamic = "force-dynamic";

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

  // List files in the cloud folder
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

  // Check which files we already imported (by source_url matching)
  const { data: existing } = await supabaseAdmin
    .from("ad_assets")
    .select("source_url")
    .eq("client_slug", client_slug);

  const existingUrls = new Set((existing ?? []).map((a) => a.source_url).filter(Boolean));

  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const file of listing.files) {
    const sourceKey = `${provider}:${file.downloadUrl}`;
    if (existingUrls.has(sourceKey)) {
      skipped++;
      continue;
    }

    try {
      const { buffer, mimeType } = await downloadCloudFile(
        provider,
        folder_url,
        file.downloadUrl,
      );

      const uid = randomUUID().slice(0, 8);
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `${client_slug}/${uid}_${safeName}`;

      const { error: uploadErr } = await supabaseAdmin.storage
        .from("ad-assets")
        .upload(storagePath, buffer, {
          contentType: mimeType,
          upsert: false,
        });

      if (uploadErr) {
        errors.push(`${file.name}: ${uploadErr.message}`);
        continue;
      }

      const { data: urlData } = supabaseAdmin.storage
        .from("ad-assets")
        .getPublicUrl(storagePath);

      await supabaseAdmin.from("ad_assets").insert({
        client_slug,
        file_name: file.name,
        storage_path: storagePath,
        public_url: urlData.publicUrl,
        media_type: mediaTypeFromMime(mimeType),
        uploaded_by,
        source_url: sourceKey,
        status: "new",
      });

      imported++;
    } catch (err) {
      errors.push(`${file.name}: ${err instanceof Error ? err.message : "download failed"}`);
    }
  }

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
