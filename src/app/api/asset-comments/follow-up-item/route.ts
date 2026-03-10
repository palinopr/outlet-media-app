import { NextResponse, type NextRequest } from "next/server";
import { adminGuard, apiError, dbError, parseJsonBody } from "@/lib/api-helpers";
import {
  createSystemAssetFollowUpItem,
  findAssetFollowUpItemBySource,
} from "@/features/asset-follow-up-items/server";
import {
  getAssetWorkflowPaths,
  revalidateWorkflowPaths,
} from "@/features/workflow/revalidation";
import { supabaseAdmin } from "@/lib/supabase";

function compactText(value: string, limit = 240) {
  const normalized = value.trim().replace(/\s+/g, " ");
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit - 1)}…`;
}

export async function POST(request: NextRequest) {
  const guard = await adminGuard();
  if (guard) return guard;
  if (!supabaseAdmin) return apiError("DB not configured");

  const parsed = await parseJsonBody<{ commentId?: string }>(request);
  if (parsed instanceof Response) return parsed;

  const commentId = parsed.commentId?.trim();
  if (!commentId) return apiError("commentId is required", 400);

  const existingItem = await findAssetFollowUpItemBySource("asset_comment", commentId);
  if (existingItem) {
    return NextResponse.json({ item: existingItem });
  }

  const { data: commentRow, error } = await supabaseAdmin
    .from("asset_comments" as never)
    .select("asset_id, client_slug, content, visibility, author_name")
    .eq("id", commentId)
    .maybeSingle();

  if (error) return dbError(error);
  if (!commentRow) return apiError("Comment not found", 404);

  const comment = commentRow as Record<string, unknown>;

  const item = await createSystemAssetFollowUpItem({
    assetId: comment.asset_id as string,
    clientSlug: comment.client_slug as string,
    description: compactText(comment.content as string, 2000),
    priority: "medium",
    sourceEntityId: commentId,
    sourceEntityType: "asset_comment",
    status: "todo",
    title: `Follow up on ${comment.author_name ?? "client"} asset comment`,
    visibility: comment.visibility as "admin_only" | "shared",
    actorType: "system",
    actorName: "Outlet Assets",
  });

  if (!item) return apiError("Failed to create follow-up item", 500);

  revalidateWorkflowPaths(
    getAssetWorkflowPaths(comment.client_slug as string, comment.asset_id as string),
  );

  return NextResponse.json({ item }, { status: 201 });
}
