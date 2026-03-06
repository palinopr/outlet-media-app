import { NextRequest, NextResponse } from "next/server";
import { adminGuard, apiError } from "@/lib/api-helpers";
import { importAssetsFromFolder } from "@/features/assets/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const guard = await adminGuard();
  if (guard) return guard;

  const body = await req.json();
  const { folder_url, client_slug, uploaded_by } = body as {
    folder_url: string;
    client_slug: string;
    uploaded_by: string;
  };

  if (!folder_url || !client_slug || !uploaded_by) {
    return apiError("folder_url, client_slug, and uploaded_by are required", 400);
  }

  try {
    const result = await importAssetsFromFolder({
      folderUrl: folder_url,
      clientSlug: client_slug,
      uploadedBy: uploaded_by,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to import assets";
    return apiError(message, message === "DB not configured" ? 500 : 400);
  }
}
