import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { adminGuard, apiError } from "@/lib/api-helpers";
import { deleteAssetById, updateAsset } from "@/features/assets/server";
import { logSystemEvent } from "@/features/system-events/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await adminGuard();
  if (guard) return guard;

  const { id } = await params;
  const body = (await req.json()) as Record<string, unknown>;

  try {
    const asset = await updateAsset(id, body);
    return NextResponse.json({ asset });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update asset";
    const status =
      message === "No valid fields to update"
        ? 400
        : message === "Asset not found"
          ? 404
          : 500;
    return apiError(message, status);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await adminGuard();
  if (guard) return guard;

  const { id } = await params;
  const user = await currentUser();

  try {
    const deleted = await deleteAssetById(id);
    await logSystemEvent({
      eventName: "asset_deleted",
      actorId: user?.id ?? null,
      clientSlug: deleted.clientSlug,
      entityType: "asset",
      entityId: deleted.id,
      summary: `Deleted asset "${deleted.fileName}"`,
    });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete asset";
    return apiError(message, message === "Asset not found" ? 404 : 500);
  }
}
