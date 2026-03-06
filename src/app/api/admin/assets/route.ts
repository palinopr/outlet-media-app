import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { adminGuard, apiError } from "@/lib/api-helpers";
import { listAssets, uploadAssetFile } from "@/features/assets/server";
import { logSystemEvent } from "@/features/system-events/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const guard = await adminGuard();
  if (guard) return guard;

  const slug = req.nextUrl.searchParams.get("client_slug");
  if (!slug) return apiError("client_slug is required", 400);

  try {
    const assets = await listAssets(slug);
    return NextResponse.json({ assets });
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : "Failed to load assets",
      500,
    );
  }
}

export async function POST(req: NextRequest) {
  const guard = await adminGuard();
  if (guard) return guard;

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const clientSlug = formData.get("client_slug") as string | null;
  const uploadedBy = formData.get("uploaded_by") as string | null;

  if (!file) return apiError("file is required", 400);
  if (!clientSlug) return apiError("client_slug is required", 400);
  if (!uploadedBy) return apiError("uploaded_by is required", 400);

  const user = await currentUser();

  try {
    const asset = await uploadAssetFile({
      file,
      clientSlug,
      uploadedBy,
    });

    await logSystemEvent({
      eventName: "asset_uploaded",
      actorId: user?.id ?? uploadedBy,
      clientSlug,
      entityType: "asset",
      entityId: asset.id as string,
      summary: `Uploaded asset "${asset.file_name as string}"`,
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
