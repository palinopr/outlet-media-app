import { currentUser } from "@clerk/nextjs/server";
import { getMemberAccessForSlug } from "@/lib/member-access";
import { getFeatureReadClient, supabaseAdmin } from "@/lib/supabase";

export type AssetCommentVisibility = "admin_only" | "shared";

export interface AssetComment {
  id: string;
  assetId: string;
  clientSlug: string;
  content: string;
  visibility: AssetCommentVisibility;
  authorId: string | null;
  authorName: string | null;
  parentCommentId: string | null;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ListAssetCommentsOptions {
  audience?: "all" | AssetCommentVisibility;
  assetId: string;
  clientSlug: string;
}

function mapAssetComment(row: Record<string, unknown>): AssetComment {
  return {
    id: row.id as string,
    assetId: row.asset_id as string,
    clientSlug: row.client_slug as string,
    content: row.content as string,
    visibility: row.visibility as AssetCommentVisibility,
    authorId: (row.author_id as string | null) ?? null,
    authorName: (row.author_name as string | null) ?? null,
    parentCommentId: (row.parent_comment_id as string | null) ?? null,
    resolved: Boolean(row.resolved),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}


export async function listAssetComments(
  options: ListAssetCommentsOptions,
): Promise<AssetComment[]> {
  const db = await getFeatureReadClient(!!options.clientSlug);
  if (!db) return [];

  let query = db
    .from("asset_comments" as never)
    .select(
      "id, asset_id, client_slug, content, visibility, author_id, author_name, parent_comment_id, resolved, created_at, updated_at",
    )
    .eq("asset_id", options.assetId)
    .eq("client_slug", options.clientSlug)
    .order("created_at", { ascending: true });

  if (options.audience && options.audience !== "all") {
    query = query.eq("visibility", options.audience);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[asset-comments] list failed:", error.message);
    return [];
  }

  return ((data ?? []) as Record<string, unknown>[]).map((row) => mapAssetComment(row));
}

export async function canAccessAssetComments(
  userId: string,
  clientSlug: string,
  visibility?: AssetCommentVisibility,
) {
  const user = await currentUser();
  const role = (user?.publicMetadata as { role?: string } | null)?.role;
  const isAdmin = role === "admin";

  if (isAdmin) {
    return { allowed: true, isAdmin: true };
  }

  if (visibility === "admin_only") {
    return { allowed: false, isAdmin: false };
  }

  const allowed = !!(await getMemberAccessForSlug(userId, clientSlug));
  return { allowed, isAdmin: false };
}
