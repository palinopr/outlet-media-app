import { NextRequest, NextResponse } from "next/server";
import { authGuard, apiError } from "@/lib/api-helpers";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  detectProvider,
  listCloudFolder,
  downloadCloudFile,
} from "@/lib/cloud-import";
import { uploadToAssetStorage, insertAssetRow } from "@/lib/asset-storage";
import { getMemberAccessForSlug } from "@/lib/member-access";
import { notifyCreative } from "@/lib/notify-creative";

export const dynamic = "force-dynamic";

const CONCURRENCY = 4;

async function verifyClientAccess(
  userId: string,
  clientSlug: string,
): Promise<boolean> {
  const user = await currentUser();
  const meta = (user?.publicMetadata ?? {}) as { role?: string };
  if (meta.role === "admin") return true;
  const access = await getMemberAccessForSlug(userId, clientSlug);
  return !!access;
}

interface BatchResult<R> {
  successes: R[];
  errors: string[];
}

async function processInBatches<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<BatchResult<R>> {
  const successes: R[] = [];
  const errors: string[] = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const results = await Promise.allSettled(batch.map(fn));
    for (const r of results) {
      if (r.status === "fulfilled") {
        successes.push(r.value);
      } else {
        errors.push(r.reason instanceof Error ? r.reason.message : String(r.reason));
      }
    }
  }
  return { successes, errors };
}

function isProviderError(raw: string): boolean {
  return (
    /OAuth token refresh failed/i.test(raw) ||
    /not configured/i.test(raw) ||
    /API error \(\d+\)/i.test(raw) ||
    /download failed/i.test(raw)
  );
}

function mapProviderError(raw: string, provider: string): string {
  if (/OAuth token refresh failed/i.test(raw)) {
    return "Google Drive access has expired. Our team has been notified and will fix this shortly.";
  }
  if (/API error \(404\)/i.test(raw) || /API error \(403\)/i.test(raw)) {
    return "This folder is private or restricted. Make sure it's shared with anyone with the link, or contact Outlet Media support.";
  }
  if (provider === "dropbox" && /not configured/i.test(raw)) {
    return "Dropbox imports are not configured yet. Contact Outlet Media support.";
  }
  if (provider === "gdrive" && /not configured/i.test(raw)) {
    return "Google Drive access is not configured yet. Contact Outlet Media support.";
  }
  if (/API error/i.test(raw) || /download failed/i.test(raw)) {
    return `${provider === "gdrive" ? "Google Drive" : "Dropbox"} returned an error. Our team has been notified.`;
  }
  return raw;
}

export async function POST(req: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured", 500);

  const body = await req.json();
  const { folder_url, client_slug } = body as {
    folder_url: string;
    client_slug: string;
  };

  if (!folder_url || !client_slug) {
    return apiError("folder_url and client_slug are required", 400);
  }

  const allowed = await verifyClientAccess(userId, client_slug);
  if (!allowed) return apiError("Forbidden", 403);

  const provider = detectProvider(folder_url);
  if (!provider) {
    return apiError(
      "Paste a Dropbox shared folder link or Google Drive folder link.",
      400,
    );
  }

  let listing;
  try {
    listing = await listCloudFolder(folder_url);
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Failed to list folder";
    const friendly = mapProviderError(raw, provider);
    if (isProviderError(raw)) {
      notifyCreative({
        clientSlug: client_slug,
        folderUrl: folder_url,
        provider,
        error: raw,
      });
    }
    return apiError(friendly, isProviderError(raw) ? 502 : 400);
  }

  if (listing.files.length === 0) {
    return NextResponse.json({
      imported: 0,
      skipped: 0,
      message:
        "No images or videos found in this folder. We support JPG, PNG, WEBP, GIF, MP4, MOV.",
    });
  }

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

  const { successes, errors: importErrors } = await processInBatches(toImport, CONCURRENCY, async (file) => {
    const sourceKey = `${provider}:${file.downloadUrl}`;
    const { buffer, mimeType } = await downloadCloudFile(
      provider, folder_url, file.downloadUrl,
    );
    const { storagePath, publicUrl } = await uploadToAssetStorage(
      client_slug, file.name, buffer, mimeType,
    );
    try {
      await insertAssetRow({
        clientSlug: client_slug, fileName: file.name,
        storagePath, publicUrl, mimeType,
        uploadedBy: userId, sourceUrl: sourceKey,
      });
    } catch (err) {
      await supabaseAdmin!.storage.from("ad-assets").remove([storagePath]);
      throw err;
    }
    return file.name;
  });

  const imported = successes.length;

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
    errors: importErrors.length > 0 ? importErrors : undefined,
  });
}
