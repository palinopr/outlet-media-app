import { currentUser } from "@clerk/nextjs/server";
import { getMemberAccessForSlug } from "@/lib/member-access";
import { createClerkSupabaseClient, supabaseAdmin } from "@/lib/supabase";

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

interface ListCrmDiscussionThreadsOptions {
  audience?: "all" | CrmCommentVisibility;
  clientSlug?: string | null;
  limit?: number;
}

export interface CrmDiscussionThread {
  id: string;
  clientSlug: string;
  contactId: string;
  contactName: string | null;
  authorName: string | null;
  content: string;
  createdAt: string;
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

async function getCrmCommentsReadClient(clientSlug?: string | null) {
  if (!supabaseAdmin || !clientSlug) return supabaseAdmin;

  try {
    const user = await currentUser();
    const role = (user?.publicMetadata as { role?: string } | null)?.role;
    if (role === "admin") {
      return supabaseAdmin;
    }
  } catch {
    return supabaseAdmin;
  }

  return (await createClerkSupabaseClient()) ?? supabaseAdmin;
}

export async function listCrmComments(options: ListCrmCommentsOptions): Promise<CrmComment[]> {
  const db = await getCrmCommentsReadClient(options.clientSlug);
  if (!db) return [];

  let query = db
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

export async function listCrmDiscussionThreads(
  options: ListCrmDiscussionThreadsOptions = {},
): Promise<CrmDiscussionThread[]> {
  const db = await getCrmCommentsReadClient(options.clientSlug);
  if (!db) return [];

  let query = db
    .from("crm_comments")
    .select("id, contact_id, client_slug, author_name, content, created_at")
    .eq("resolved", false)
    .is("parent_comment_id", null)
    .order("created_at", { ascending: false })
    .limit(options.limit ?? 8);

  if (options.clientSlug) {
    query = query.eq("client_slug", options.clientSlug);
  }

  if (options.audience && options.audience !== "all") {
    query = query.eq("visibility", options.audience);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[crm-comments] thread list failed:", error.message);
    return [];
  }

  const rows = (data ?? []) as Record<string, unknown>[];
  const contactIds = [...new Set(rows.map((row) => row.contact_id as string).filter(Boolean))];
  const contactNames = new Map<string, string>();

  if (contactIds.length > 0) {
    const { data: contactRows, error: contactError } = await db
      .from("crm_contacts" as never)
      .select("id, full_name")
      .in("id", contactIds);

    if (contactError) {
      console.error("[crm-comments] thread contact lookup failed:", contactError.message);
    } else {
      for (const row of contactRows ?? []) {
        const record = row as Record<string, unknown>;
        contactNames.set(record.id as string, (record.full_name as string | null) ?? "CRM contact");
      }
    }
  }

  return rows.map((row) => ({
    id: row.id as string,
    clientSlug: row.client_slug as string,
    contactId: row.contact_id as string,
    contactName: contactNames.get(row.contact_id as string) ?? null,
    authorName: (row.author_name as string | null) ?? null,
    content: row.content as string,
    createdAt: row.created_at as string,
  }));
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
