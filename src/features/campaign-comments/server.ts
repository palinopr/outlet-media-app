import { currentUser } from "@clerk/nextjs/server";
import { getMemberAccessForSlug } from "@/lib/member-access";
import { supabaseAdmin } from "@/lib/supabase";

export type CampaignCommentVisibility = "admin_only" | "shared";

export interface CampaignComment {
  id: string;
  campaignId: string;
  clientSlug: string;
  content: string;
  visibility: CampaignCommentVisibility;
  authorId: string | null;
  authorName: string | null;
  parentCommentId: string | null;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ListCampaignCommentsOptions {
  audience?: "all" | CampaignCommentVisibility;
  campaignId: string;
  clientSlug: string;
}

function mapCampaignComment(row: Record<string, unknown>): CampaignComment {
  return {
    id: row.id as string,
    campaignId: row.campaign_id as string,
    clientSlug: row.client_slug as string,
    content: row.content as string,
    visibility: row.visibility as CampaignCommentVisibility,
    authorId: (row.author_id as string | null) ?? null,
    authorName: (row.author_name as string | null) ?? null,
    parentCommentId: (row.parent_comment_id as string | null) ?? null,
    resolved: Boolean(row.resolved),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function listCampaignComments(
  options: ListCampaignCommentsOptions,
): Promise<CampaignComment[]> {
  if (!supabaseAdmin) return [];

  let query = supabaseAdmin
    .from("campaign_comments")
    .select(
      "id, campaign_id, client_slug, content, visibility, author_id, author_name, parent_comment_id, resolved, created_at, updated_at",
    )
    .eq("campaign_id", options.campaignId)
    .eq("client_slug", options.clientSlug)
    .order("created_at", { ascending: true });

  if (options.audience && options.audience !== "all") {
    query = query.eq("visibility", options.audience);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[campaign-comments] list failed:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapCampaignComment(row as Record<string, unknown>));
}

export async function canAccessCampaignComments(
  userId: string,
  clientSlug: string,
  visibility?: CampaignCommentVisibility,
) {
  const user = await currentUser();
  const role = (user?.publicMetadata as { role?: string } | null)?.role;
  const isAdmin = role === "admin";

  if (isAdmin) {
    return { allowed: true, isAdmin: true };
  }

  if (visibility === "admin_only") {
    return { isAdmin: false, allowed: false };
  }

  const allowed = !!(await getMemberAccessForSlug(userId, clientSlug));
  return { allowed, isAdmin: false };
}
