import { NextRequest, NextResponse } from "next/server";
import { authGuard, apiError, validateRequest } from "@/lib/api-helpers";
import { ClientImportAssetsSchema } from "@/lib/api-schemas";
import { notifyCreative, notifyCreativeNewAssets } from "@/lib/notify-creative";
import { createApprovalRequest } from "@/features/approvals/server";
import {
  canAccessClientAssets,
  importAssetsFromFolder,
  userFacingImportError,
} from "@/features/assets/server";
import { logSystemEvent } from "@/features/system-events/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;

  const { data: body, error: valErr } = await validateRequest(req, ClientImportAssetsSchema);
  if (valErr) return valErr;
  const { folder_url, client_slug } = body;

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

    if (result.imported > 0) {
      await logSystemEvent({
        eventName: "asset_folder_imported",
        actorId: userId,
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

      if (result.campaignMatches.length > 0) {
        for (const match of result.campaignMatches) {
          await logSystemEvent({
            eventName: "asset_folder_imported",
            actorId: userId,
            clientSlug: client_slug,
            entityType: "campaign",
            entityId: match.campaignId,
            summary: `Imported ${match.count} asset${match.count === 1 ? "" : "s"} for ${match.campaignName}`,
            detail: "Imported from a shared folder and linked to this campaign.",
            metadata: {
              folderUrl: folder_url,
              campaignId: match.campaignId,
              campaignName: match.campaignName,
              imported: match.count,
            },
          });

          await createApprovalRequest({
            audience: "admin",
            clientSlug: client_slug,
            entityId: match.campaignId,
            entityType: "campaign",
            requestType: "asset_import_review",
            summary: `A client imported ${match.count} new asset${match.count === 1 ? "" : "s"} for ${match.campaignName} and they should be reviewed.`,
            title: `Review ${match.count} imported asset${match.count === 1 ? "" : "s"} for ${match.campaignName}`,
            metadata: {
              folderUrl: folder_url,
              campaignId: match.campaignId,
              campaignName: match.campaignName,
              imported: match.count,
              skipped: result.skipped,
              total: result.total,
            },
          });
        }
      } else {
        await createApprovalRequest({
          audience: "admin",
          clientSlug: client_slug,
          entityId: folder_url,
          entityType: "asset_folder",
          requestType: "asset_import_review",
          summary: `A client imported ${result.imported} new asset${result.imported === 1 ? "" : "s"} from a shared folder and they should be reviewed.`,
          title: `Review ${result.imported} imported asset${result.imported === 1 ? "" : "s"}`,
          metadata: {
            folderUrl: folder_url,
            imported: result.imported,
            skipped: result.skipped,
            total: result.total,
          },
        });
      }
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
