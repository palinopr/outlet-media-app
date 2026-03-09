import { currentUser } from "@clerk/nextjs/server";
import { getMemberAccessForSlug, type ScopeFilter } from "@/lib/member-access";
import { createClerkSupabaseClient, supabaseAdmin } from "@/lib/supabase";

export type EventCommentVisibility = "admin_only" | "shared";

export interface EventComment {
  id: string;
  eventId: string;
  clientSlug: string | null;
  content: string;
  visibility: EventCommentVisibility;
  authorId: string | null;
  authorName: string | null;
  parentCommentId: string | null;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ListEventCommentsOptions {
  audience?: "all" | EventCommentVisibility;
  eventId: string;
}

function mapEventComment(row: Record<string, unknown>): EventComment {
  return {
    id: row.id as string,
    eventId: row.event_id as string,
    clientSlug: (row.client_slug as string | null) ?? null,
    content: row.content as string,
    visibility: row.visibility as EventCommentVisibility,
    authorId: (row.author_id as string | null) ?? null,
    authorName: (row.author_name as string | null) ?? null,
    parentCommentId: (row.parent_comment_id as string | null) ?? null,
    resolved: Boolean(row.resolved),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

async function getEventCommentsReadClient(options: {
  audience?: "all" | EventCommentVisibility;
}) {
  if (!supabaseAdmin) return null;
  if (options.audience !== "shared") return supabaseAdmin;

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

export async function listEventComments(
  options: ListEventCommentsOptions,
): Promise<EventComment[]> {
  const db = await getEventCommentsReadClient(options);
  if (!db) return [];

  let query = db
    .from("event_comments" as never)
    .select(
      "id, event_id, client_slug, content, visibility, author_id, author_name, parent_comment_id, resolved, created_at, updated_at",
    )
    .eq("event_id", options.eventId)
    .order("created_at", { ascending: true });

  if (options.audience && options.audience !== "all") {
    query = query.eq("visibility", options.audience);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[event-comments] list failed:", error.message);
    return [];
  }

  return ((data ?? []) as Record<string, unknown>[]).map((row) => mapEventComment(row));
}

export async function canAccessEventComments(
  userId: string,
  clientSlug: string | null,
  visibility?: EventCommentVisibility,
): Promise<{ allowed: boolean; isAdmin: boolean; scope?: ScopeFilter }> {
  const user = await currentUser();
  const role = (user?.publicMetadata as { role?: string } | null)?.role;
  const isAdmin = role === "admin";

  if (isAdmin) {
    return { allowed: true, isAdmin: true, scope: undefined };
  }

  if (visibility === "admin_only" || !clientSlug) {
    return { allowed: false, isAdmin: false, scope: undefined };
  }

  const access = await getMemberAccessForSlug(userId, clientSlug);
  return {
    allowed: !!access,
    isAdmin: false,
    scope:
      access?.scope === "assigned"
        ? {
            allowedCampaignIds: access.allowedCampaignIds,
            allowedEventIds: access.allowedEventIds,
          }
        : undefined,
  };
}
