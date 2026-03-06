import { currentUser } from "@clerk/nextjs/server";
import { getMemberAccessForSlug } from "@/lib/member-access";
import { supabaseAdmin } from "@/lib/supabase";

export type CrmCommentVisibility = "admin_only" | "shared";

export interface CrmComment {
  id: string;
  contactId: string;
  clientSlug: string;
  content: string;
  visibility: CrmCommentVisibility;
  authorId: string | null;
  authorName: string | null;
  parentCommentId: string | null;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ListCrmCommentsOptions {
  audience?: "all" | CrmCommentVisibility;
  contactId: string;
  clientSlug: string;
}

function mapCrmComment(row: Record<string, unknown>): CrmComment {
  return {
    id: row.id as string,
    contactId: row.contact_id as string,
    clientSlug: row.client_slug as string,
    content: row.content as string,
    visibility: row.visibility as CrmCommentVisibility,
    authorId: (row.author_id as string | null) ?? null,
    authorName: (row.author_name as string | null) ?? null,
    parentCommentId: (row.parent_comment_id as string | null) ?? null,
    resolved: Boolean(row.resolved),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function listCrmComments(options: ListCrmCommentsOptions): Promise<CrmComment[]> {
  if (!supabaseAdmin) return [];

  let query = supabaseAdmin
    .from("crm_comments")
    .select(
      "id, contact_id, client_slug, content, visibility, author_id, author_name, parent_comment_id, resolved, created_at, updated_at",
    )
    .eq("contact_id", options.contactId)
    .eq("client_slug", options.clientSlug)
    .order("created_at", { ascending: true });

  if (options.audience && options.audience !== "all") {
    query = query.eq("visibility", options.audience);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[crm-comments] list failed:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapCrmComment(row as Record<string, unknown>));
}

export async function canAccessCrmComments(
  userId: string,
  clientSlug: string,
  visibility?: CrmCommentVisibility,
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
