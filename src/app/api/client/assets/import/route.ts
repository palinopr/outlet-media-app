import { NextRequest, NextResponse } from "next/server";
import { authGuard, apiError } from "@/lib/api-helpers";
import { notifyCreative, notifyCreativeNewAssets } from "@/lib/notify-creative";
import {
  canAccessClientAssets,
  importAssetsFromFolder,
  userFacingImportError,
} from "@/features/assets/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;

  const body = await req.json();
  const { folder_url, client_slug } = body as {
    folder_url: string;
    client_slug: string;
  };

  if (!folder_url || !client_slug) {
    return apiError("folder_url and client_slug are required", 400);
  }

  const allowed = await canAccessClientAssets(userId, client_slug);
  if (!allowed) return apiError("Forbidden", 403);

  try {
    const result = await importAssetsFromFolder({
      folderUrl: folder_url,
      clientSlug: client_slug,
      uploadedBy: userId,
      classify: true,
      onListError: (raw, provider) =>
        notifyCreative({
          clientSlug: client_slug,
          folderUrl: folder_url,
          provider,
          error: raw,
        }),
      onImportComplete: (imported) =>
        notifyCreativeNewAssets(client_slug, imported),
    });

    if (result.message) {
      return NextResponse.json({
        imported: 0,
        skipped: 0,
        message:
          "No images or videos found in this folder. We support JPG, PNG, WEBP, GIF, MP4, MOV.",
      });
    }

    return NextResponse.json(result);
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Failed to import assets";
    if (/^Unsupported URL\./.test(raw)) {
      return apiError(
        "Paste a Dropbox shared folder link or Google Drive folder link.",
        400,
      );
    }

    return apiError(
      userFacingImportError(raw),
      raw === "DB not configured" ? 500 : 502,
    );
  }
}
