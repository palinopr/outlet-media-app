import { NextResponse, type NextRequest } from "next/server";
import { adminGuard, apiError, parseJsonBody } from "@/lib/api-helpers";
import {
  createSystemCampaignActionItem,
  findCampaignActionItemBySource,
} from "@/features/campaign-action-items/server";
import {
  getCampaignWorkflowPaths,
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

  const body = parsed;
  const commentId = body.commentId?.trim();
  if (!commentId) return apiError("commentId is required", 400);

  const existingItem = await findCampaignActionItemBySource("campaign_comment", commentId);
  if (existingItem) {
    return NextResponse.json({ item: existingItem });
  }

  const { data: comment, error } = await supabaseAdmin
    .from("campaign_comments")
    .select("campaign_id, client_slug, content, visibility, author_name")
    .eq("id", commentId)
    .maybeSingle();

  if (error) return apiError(error.message);
  if (!comment) return apiError("Comment not found", 404);

  const item = await createSystemCampaignActionItem({
    campaignId: comment.campaign_id as string,
    clientSlug: comment.client_slug as string,
    description: compactText(comment.content as string, 2000),
    priority: "medium",
    sourceEntityId: commentId,
    sourceEntityType: "campaign_comment",
    status: "todo",
    title: `Follow up on ${comment.author_name ?? "client"} campaign comment`,
    visibility: comment.visibility as "admin_only" | "shared",
  });

  if (!item) return apiError("Failed to create action item", 500);

  revalidateWorkflowPaths(
    getCampaignWorkflowPaths(comment.client_slug as string, comment.campaign_id as string),
  );

  return NextResponse.json({ item }, { status: 201 });
}
