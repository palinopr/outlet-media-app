import { NextRequest, NextResponse } from "next/server";
import { authGuard, apiError } from "@/lib/api-helpers";
import {
  canAccessClientAssets,
  listAssets,
  uploadAssetFile,
} from "@/features/assets/server";
import { createApprovalRequest } from "@/features/approvals/server";
import { logSystemEvent } from "@/features/system-events/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;

  const slug = req.nextUrl.searchParams.get("client_slug");
  if (!slug) return apiError("client_slug is required", 400);

  const allowed = await canAccessClientAssets(userId, slug);
  if (!allowed) return apiError("Forbidden", 403);

  try {
    const assets = await listAssets(slug);
    return NextResponse.json({ assets });
  } catch (err) {
    return apiError(
      err instanceof Error ? err.message : "Failed to load assets",
      500,
    );
  }
}

export async function POST(req: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const clientSlug = formData.get("client_slug") as string | null;

  if (!file) return apiError("file is required", 400);
  if (!clientSlug) return apiError("client_slug is required", 400);

  const allowed = await canAccessClientAssets(userId, clientSlug);
  if (!allowed) return apiError("Forbidden", 403);

  try {
    const asset = await uploadAssetFile({
      file,
      clientSlug,
      uploadedBy: userId,
      classify: true,
    });

    await logSystemEvent({
      eventName: "asset_uploaded",
      actorId: userId,
      clientSlug,
      entityType: "asset",
      entityId: asset.id as string,
      summary: `Uploaded asset "${asset.file_name as string}"`,
    });

    await createApprovalRequest({
      audience: "admin",
      clientSlug,
      entityId: asset.id as string,
      entityType: "asset",
      requestType: "asset_review",
      summary: "A client uploaded a new asset that should be reviewed before it moves further in the campaign workflow.",
      title: `Review uploaded asset "${asset.file_name as string}"`,
    });

    return NextResponse.json({ asset }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    const status =
      message === "File too large. Max 50 MB." ||
      message.startsWith("Unsupported file type:")
        ? 400
        : 500;
    return apiError(message, status);
  }
}
