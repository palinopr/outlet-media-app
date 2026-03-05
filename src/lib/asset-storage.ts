import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { mediaTypeFromMime } from "@/lib/cloud-import";

const BUCKET = "ad-assets";

interface UploadResult {
  storagePath: string;
  publicUrl: string;
}

export function buildStoragePath(clientSlug: string, fileName: string): string {
  const uid = randomUUID().slice(0, 8);
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${clientSlug}/${uid}_${safeName}`;
}

export async function uploadToAssetStorage(
  clientSlug: string,
  fileName: string,
  buffer: Buffer,
  contentType: string,
): Promise<UploadResult> {
  if (!supabaseAdmin) throw new Error("DB not configured");

  const storagePath = buildStoragePath(clientSlug, fileName);

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(storagePath, buffer, { contentType, upsert: false });

  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(storagePath);

  return { storagePath, publicUrl: data.publicUrl };
}

export async function insertAssetRow(params: {
  clientSlug: string;
  fileName: string;
  storagePath: string;
  publicUrl: string;
  mimeType: string;
  uploadedBy: string;
  sourceUrl?: string;
}) {
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { data, error } = await supabaseAdmin
    .from("ad_assets")
    .insert({
      client_slug: params.clientSlug,
      file_name: params.fileName,
      storage_path: params.storagePath,
      public_url: params.publicUrl,
      media_type: mediaTypeFromMime(params.mimeType),
      uploaded_by: params.uploadedBy,
      source_url: params.sourceUrl,
      status: "new",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
