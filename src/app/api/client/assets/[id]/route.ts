import { NextRequest, NextResponse } from "next/server";
import { authGuard, apiError } from "@/lib/api-helpers";
import {
  canAccessClientAssets,
  deleteAssetById,
  getAssetClientSlug,
} from "@/features/assets/server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId, error } = await authGuard();
  if (error) return error;

  const { id } = await params;

  const clientSlug = await getAssetClientSlug(id);
  if (!clientSlug) return apiError("Asset not found", 404);

  const allowed = await canAccessClientAssets(userId, clientSlug);
  if (!allowed) return apiError("Forbidden", 403);

  try {
    await deleteAssetById(id);
    return NextResponse.json({ deleted: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to delete asset";
    return apiError(message, message === "Asset not found" ? 404 : 500);
  }
}
