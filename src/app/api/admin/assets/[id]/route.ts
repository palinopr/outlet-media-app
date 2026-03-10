import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  getAssetWorkflowPaths,
  revalidateWorkflowPaths,
} from "@/features/workflow/revalidation";
import { adminGuard, apiError, validateRequest } from "@/lib/api-helpers";
import { UpdateAssetSchema } from "@/lib/api-schemas";
import { deleteAssetById, getAssetRecordById, updateAsset } from "@/features/assets/server";
import { logSystemEvent, summarizeChangedFields } from "@/features/system-events/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await adminGuard();
  if (guard) return guard;

  const { id } = await params;
  const { data: body, error: valErr } = await validateRequest(req, UpdateAssetSchema);
  if (valErr) return valErr;
  const user = await currentUser();

  try {
    const before = await getAssetRecordById(id);
    if (!before) return apiError("Asset not found", 404);

    const asset = await updateAsset(id, body);

    const beforeRecord = before as unknown as Record<string, unknown>;
    const assetRecord = asset as Record<string, unknown>;
    const changedFields = ["format", "labels", "placement", "status", "used_in_campaigns"].filter(
      (field) => JSON.stringify(beforeRecord[field]) !== JSON.stringify(assetRecord[field]),
    );

    if (changedFields.length > 0) {
      await logSystemEvent({
        eventName: "asset_updated",
        actorId: user?.id ?? null,
        clientSlug: before.client_slug,
        visibility: "admin_only",
        entityType: "asset",
        entityId: id,
        summary: `Updated asset "${before.file_name}"`,
        detail: summarizeChangedFields(changedFields),
        metadata: {
          assetId: id,
          assetName: before.file_name,
        },
      });
    }

    revalidateWorkflowPaths(getAssetWorkflowPaths(before.client_slug, id));
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
    revalidateWorkflowPaths(getAssetWorkflowPaths(deleted.clientSlug, id));
    return NextResponse.json({ deleted: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete asset";
    return apiError(message, message === "Asset not found" ? 404 : 500);
  }
}
