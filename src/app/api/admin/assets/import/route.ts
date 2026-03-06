import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { adminGuard, apiError } from "@/lib/api-helpers";
import { importAssetsFromFolder } from "@/features/assets/server";
import { logSystemEvent } from "@/features/system-events/server";

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

  const user = await currentUser();

  try {
    const result = await importAssetsFromFolder({
      folderUrl: folder_url,
      clientSlug: client_slug,
      uploadedBy: uploaded_by,
    });

    if (result.imported > 0) {
      await logSystemEvent({
        eventName: "asset_folder_imported",
        actorId: user?.id ?? uploaded_by,
        clientSlug: client_slug,
        entityType: "asset_folder",
        entityId: folder_url,
        summary: `Imported ${result.imported} asset${result.imported === 1 ? "" : "s"}`,
        detail:
          result.skipped > 0
            ? `${result.skipped} already existed in this client library.`
            : "Imported from a shared folder.",
        metadata: {
          folderUrl: folder_url,
          imported: result.imported,
          skipped: result.skipped,
          total: result.total,
        },
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to import assets";
    return apiError(message, message === "DB not configured" ? 500 : 400);
  }
}
