import { NextResponse, type NextRequest } from "next/server";
import { adminGuard, apiError, parseJsonBody } from "@/lib/api-helpers";
import {
  createSystemEventFollowUpItem,
  findEventFollowUpItemBySource,
} from "@/features/event-follow-up-items/server";
import {
  getEventWorkflowPaths,
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

  const existingItem = await findEventFollowUpItemBySource("event_comment", commentId);
  if (existingItem) {
    return NextResponse.json({ item: existingItem });
  }

  const { data: comment, error } = await supabaseAdmin
    .from("event_comments" as never)
    .select("event_id, client_slug, content, visibility, author_name")
    .eq("id", commentId)
    .maybeSingle();

  if (error) return apiError(error.message);
  if (!comment) return apiError("Comment not found", 404);

  const item = await createSystemEventFollowUpItem({
    actorType: "system",
    actorName: "Outlet Events",
    clientSlug: ((comment as Record<string, unknown>).client_slug as string | null) ?? null,
    description: compactText((comment as Record<string, unknown>).content as string, 2000),
    eventId: (comment as Record<string, unknown>).event_id as string,
    priority: "medium",
    sourceEntityId: commentId,
    sourceEntityType: "event_comment",
    status: "todo",
    title: `Follow up on ${((comment as Record<string, unknown>).author_name as string | null) ?? "client"} event comment`,
    visibility: (comment as Record<string, unknown>).visibility as "admin_only" | "shared",
  });

  if (!item) return apiError("Failed to create follow-up item", 500);

  const commentRow = comment as Record<string, unknown>;
  revalidateWorkflowPaths(
    getEventWorkflowPaths(
      (commentRow.client_slug as string | null) ?? "",
      commentRow.event_id as string,
    ),
  );

  return NextResponse.json({ item }, { status: 201 });
}
