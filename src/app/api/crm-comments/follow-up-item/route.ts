import { NextResponse, type NextRequest } from "next/server";
import { adminGuard, apiError, parseJsonBody } from "@/lib/api-helpers";
import {
  createSystemCrmFollowUpItem,
  findCrmFollowUpItemBySource,
} from "@/features/crm-follow-up-items/server";
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

  const existingItem = await findCrmFollowUpItemBySource("crm_comment", commentId);
  if (existingItem) {
    return NextResponse.json({ item: existingItem });
  }

  const { data: comment, error } = await supabaseAdmin
    .from("crm_comments")
    .select("contact_id, client_slug, content, visibility, author_name")
    .eq("id", commentId)
    .maybeSingle();

  if (error) return apiError(error.message);
  if (!comment) return apiError("Comment not found", 404);

  const { data: contact } = await supabaseAdmin
    .from("crm_contacts" as never)
    .select("full_name")
    .eq("id", comment.contact_id as string)
    .maybeSingle();

  const item = await createSystemCrmFollowUpItem({
    clientSlug: comment.client_slug as string,
    contactId: comment.contact_id as string,
    description: compactText(comment.content as string, 2000),
    priority: "medium",
    sourceEntityId: commentId,
    sourceEntityType: "crm_comment",
    status: "todo",
    title: `Follow up on ${comment.author_name ?? "client"} CRM note`,
    visibility: comment.visibility as "admin_only" | "shared",
    actorType: "system",
    actorName: "Outlet CRM",
  });

  if (!item) return apiError("Failed to create follow-up item", 500);

  return NextResponse.json(
    {
      contactName:
        ((contact as Record<string, unknown> | null)?.full_name as string | undefined) ?? null,
      item,
    },
    { status: 201 },
  );
}
