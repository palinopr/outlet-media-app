import { NextRequest, NextResponse } from "next/server";
import { authGuard, apiError } from "@/lib/api-helpers";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { uploadToAssetStorage, insertAssetRow } from "@/lib/asset-storage";
import { getMemberAccessForSlug } from "@/lib/member-access";

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

// --- GET: list assets for a client (client-accessible) ---

export async function GET(req: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured", 500);

  const slug = req.nextUrl.searchParams.get("client_slug");
  if (!slug) return apiError("client_slug is required", 400);

  const allowed = await verifyClientAccess(userId, slug);
  if (!allowed) return apiError("Forbidden", 403);

  const { data, error: dbErr } = await supabaseAdmin
    .from("ad_assets")
    .select("*")
    .eq("client_slug", slug)
    .order("created_at", { ascending: false });

  if (dbErr) return apiError(dbErr.message, 500);
  return NextResponse.json({ assets: data });
}

// --- POST: upload a file (client-accessible) ---

export async function POST(req: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured", 500);

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const clientSlug = formData.get("client_slug") as string | null;

  if (!file) return apiError("file is required", 400);
  if (!clientSlug) return apiError("client_slug is required", 400);

  const allowed = await verifyClientAccess(userId, clientSlug);
  if (!allowed) return apiError("Forbidden", 403);

  if (file.size > MAX_FILE_SIZE) {
    return apiError("File too large. Max 50 MB.", 400);
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return apiError(`Unsupported file type: ${file.type}`, 400);
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { storagePath, publicUrl } = await uploadToAssetStorage(
      clientSlug, file.name, buffer, file.type,
    );
    const asset = await insertAssetRow({
      clientSlug, fileName: file.name, storagePath, publicUrl,
      mimeType: file.type, uploadedBy: userId,
    });
    return NextResponse.json({ asset }, { status: 201 });
  } catch (err) {
    return apiError(err instanceof Error ? err.message : "Upload failed", 500);
  }
}
