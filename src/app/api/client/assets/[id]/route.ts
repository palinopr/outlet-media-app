import { NextRequest, NextResponse } from "next/server";
import { authGuard, apiError } from "@/lib/api-helpers";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getMemberAccessForSlug } from "@/lib/member-access";

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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId, error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured", 500);

  const { id } = await params;

  const { data: asset } = await supabaseAdmin
    .from("ad_assets")
    .select("storage_path, client_slug")
    .eq("id", id)
    .single();

  if (!asset) return apiError("Asset not found", 404);

  const allowed = await verifyClientAccess(userId, asset.client_slug);
  if (!allowed) return apiError("Forbidden", 403);

  await supabaseAdmin.storage.from("ad-assets").remove([asset.storage_path]);

  const { error: dbErr } = await supabaseAdmin
    .from("ad_assets")
    .delete()
    .eq("id", id);

  if (dbErr) return apiError(dbErr.message, 500);
  return NextResponse.json({ deleted: true });
}
