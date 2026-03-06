import { NextRequest, NextResponse } from "next/server";
import { authGuard, apiError } from "@/lib/api-helpers";
import {
  canAccessClientAssets,
  deleteAssetById,
  getAssetOperatingData,
  getClientAssetScope,
} from "@/features/assets/server";
import { logSystemEvent } from "@/features/system-events/server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId, error } = await authGuard();
  if (error) return error;

  const { id } = await params;

  const asset = await getAssetOperatingData(id);
  if (!asset) return apiError("Asset not found", 404);
  const clientSlug = asset.asset.client_slug;

  const allowed = await canAccessClientAssets(userId, clientSlug);
  if (!allowed) return apiError("Forbidden", 403);

  const scope = await getClientAssetScope(userId, clientSlug);
  const scopedAsset = await getAssetOperatingData(id, [], scope);
  if (!scopedAsset) return apiError("Asset not found", 404);

  try {
    const deleted = await deleteAssetById(id);
    await logSystemEvent({
      eventName: "asset_deleted",
      actorId: userId,
      clientSlug: deleted.clientSlug,
      entityType: "asset",
      entityId: deleted.id,
      summary: `Deleted asset "${deleted.fileName}"`,
    });
    return NextResponse.json({ deleted: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to delete asset";
    return apiError(message, message === "Asset not found" ? 404 : 500);
  }
}
