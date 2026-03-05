import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { adminGuard, apiError } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";
import { mediaTypeFromMime } from "@/lib/cloud-import";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
]);

// ─── GET: list assets for a client ───────────────────────────────────────────

export async function GET(req: NextRequest) {
  const guard = await adminGuard();
  if (guard) return guard;
  if (!supabaseAdmin) return apiError("DB not configured", 500);

  const slug = req.nextUrl.searchParams.get("client_slug");
  if (!slug) return apiError("client_slug is required", 400);

  const { data, error } = await supabaseAdmin
    .from("ad_assets")
    .select("*")
    .eq("client_slug", slug)
    .order("created_at", { ascending: false });

  if (error) return apiError(error.message, 500);
  return NextResponse.json({ assets: data });
}

// ─── POST: upload a file to a client's asset library ─────────────────────────

export async function POST(req: NextRequest) {
  const guard = await adminGuard();
  if (guard) return guard;
  if (!supabaseAdmin) return apiError("DB not configured", 500);

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const clientSlug = formData.get("client_slug") as string | null;
  const uploadedBy = formData.get("uploaded_by") as string | null;

  if (!file) return apiError("file is required", 400);
  if (!clientSlug) return apiError("client_slug is required", 400);
  if (!uploadedBy) return apiError("uploaded_by is required", 400);

  if (file.size > MAX_FILE_SIZE) {
    return apiError("File too large. Max 50 MB.", 400);
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return apiError(`Unsupported file type: ${file.type}`, 400);
  }

  const uid = randomUUID().slice(0, 8);
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${clientSlug}/${uid}_${safeName}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadErr } = await supabaseAdmin.storage
    .from("ad-assets")
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadErr) return apiError(`Storage upload failed: ${uploadErr.message}`, 500);

  const { data: urlData } = supabaseAdmin.storage
    .from("ad-assets")
    .getPublicUrl(storagePath);

  const { data: asset, error: insertErr } = await supabaseAdmin
    .from("ad_assets")
    .insert({
      client_slug: clientSlug,
      file_name: file.name,
      storage_path: storagePath,
      public_url: urlData.publicUrl,
      media_type: mediaTypeFromMime(file.type),
      uploaded_by: uploadedBy,
      status: "new",
    })
    .select()
    .single();

  if (insertErr) return apiError(insertErr.message, 500);
  return NextResponse.json({ asset }, { status: 201 });
}
