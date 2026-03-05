import { NextRequest, NextResponse } from "next/server";
import { adminGuard, apiError } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";

// ─── PATCH: update asset metadata (labels, placement, status) ────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await adminGuard();
  if (guard) return guard;
  if (!supabaseAdmin) return apiError("DB not configured", 500);

  const { id } = await params;
  const body = await req.json();

  const allowed = ["labels", "placement", "format", "status", "used_in_campaigns"];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }

  if (Object.keys(updates).length === 0) {
    return apiError("No valid fields to update", 400);
  }

  const { data, error } = await supabaseAdmin
    .from("ad_assets")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return apiError(error.message, 500);
  if (!data) return apiError("Asset not found", 404);

  return NextResponse.json({ asset: data });
}

// ─── DELETE: remove asset from storage + DB ──────────────────────────────────

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await adminGuard();
  if (guard) return guard;
  if (!supabaseAdmin) return apiError("DB not configured", 500);

  const { id } = await params;

  const { data: asset } = await supabaseAdmin
    .from("ad_assets")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (!asset) return apiError("Asset not found", 404);

  // Remove from storage
  await supabaseAdmin.storage.from("ad-assets").remove([asset.storage_path]);

  // Remove DB row
  const { error } = await supabaseAdmin
    .from("ad_assets")
    .delete()
    .eq("id", id);

  if (error) return apiError(error.message, 500);
  return NextResponse.json({ deleted: true });
}
