import { NextResponse, type NextRequest } from "next/server";
import { authGuard, apiError, validateRequest } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";
import { CreateCommentSchema, ResolveCommentSchema } from "@/lib/api-schemas";
import { currentUser } from "@clerk/nextjs/server";
import { logSystemEvent } from "@/features/system-events/server";
import { createNotification } from "@/features/notifications/server";
import { revalidateWorkspaceMutationTargets } from "@/features/workflow/revalidation";
import { requireWorkspaceClientAccess } from "@/features/workspace/access";
import { getWorkspaceReadClient } from "@/features/workspace/server";
import type { NotificationType } from "@/lib/workspace-types";

function excerpt(text: string, limit = 140) {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit - 1)}…`;
}

export async function GET(request: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured");

  const pageId = request.nextUrl.searchParams.get("page_id");
  const requestedClientSlug = request.nextUrl.searchParams.get("client_slug");
  if (!pageId) return apiError("page_id required", 400);

  const readDb = await getWorkspaceReadClient(requestedClientSlug ?? undefined);
  if (!readDb) return apiError("DB not configured", 500);

  const { data: page } = await readDb
    .from("workspace_pages")
    .select("client_slug")
    .eq("id", pageId)
    .single();

  if (!page) return apiError("Page not found", 404);
  const access = await requireWorkspaceClientAccess(userId, page.client_slug as string | null);
  if (access instanceof Response) return access;

  const { data, error: dbErr } = await readDb
    .from("workspace_comments")
    .select("*")
    .eq("page_id", pageId)
    .order("created_at", { ascending: true });

  if (dbErr) return apiError(dbErr.message);
  return NextResponse.json({ comments: data });
}

export async function POST(request: NextRequest) {
  const { userId, error: authErr } = await authGuard();
  if (authErr) return authErr;
  if (!supabaseAdmin) return apiError("DB not configured");

  const { data: body, error: valErr } = await validateRequest(request, CreateCommentSchema);
  if (valErr) return valErr;

  const user = await currentUser();
  const authorName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Unknown";
  const [{ data: page }, parentResult] = await Promise.all([
    supabaseAdmin
      .from("workspace_pages")
      .select("title, client_slug, created_by")
      .eq("id", body.page_id)
      .single(),
    body.parent_comment_id
      ? supabaseAdmin
          .from("workspace_comments")
          .select("author_id")
          .eq("id", body.parent_comment_id)
          .single()
      : Promise.resolve({ data: null }),
  ]);

  if (!page) return apiError("Page not found", 404);
  const access = await requireWorkspaceClientAccess(userId, page.client_slug as string | null);
  if (access instanceof Response) return access;

  const { data, error: dbErr } = await supabaseAdmin
    .from("workspace_comments")
    .insert({
      page_id: body.page_id,
      content: body.content,
      author_id: userId,
      author_name: authorName,
      parent_comment_id: body.parent_comment_id ?? null,
    })
    .select("*")
    .single();

  if (dbErr) return apiError(dbErr.message);

  const commentType: NotificationType = "comment";
  const notificationJobs: Promise<unknown>[] = [];

  if (page.created_by && page.created_by !== userId) {
    notificationJobs.push(
      createNotification({
        clientSlug: page.client_slug as string | null,
        entityId: body.page_id,
        entityType: "workspace_page",
        fromUserId: userId,
        fromUserName: authorName,
        message: `${authorName} commented on "${page.title}"`,
        pageId: body.page_id,
        title: "New comment",
        type: commentType,
        userId: page.created_by as string,
      }),
    );
  }

  const parentAuthorId =
    parentResult?.data && typeof parentResult.data.author_id === "string"
      ? parentResult.data.author_id
      : null;

  if (parentAuthorId && parentAuthorId !== userId && parentAuthorId !== page.created_by) {
    notificationJobs.push(
      createNotification({
        clientSlug: page.client_slug as string | null,
        entityId: body.page_id,
        entityType: "workspace_page",
        fromUserId: userId,
        fromUserName: authorName,
        message: `${authorName} replied to your comment`,
        pageId: body.page_id,
        title: "New reply",
        type: commentType,
        userId: parentAuthorId,
      }),
    );
  }

  await Promise.all([
    logSystemEvent({
      eventName: "workspace_comment_added",
      actorId: userId,
      clientSlug: page.client_slug,
      entityType: "workspace_comment",
      entityId: data.id,
      pageId: body.page_id,
      summary: body.parent_comment_id
        ? `Replied in "${page.title}"`
        : `Commented on "${page.title}"`,
      detail: excerpt(body.content),
      metadata: {
        parentCommentId: body.parent_comment_id ?? null,
      },
    }),
    ...notificationJobs,
  ]);

  revalidateWorkspaceMutationTargets({
    clientSlug: page.client_slug as string | null,
    includeActivity: true,
    includeNotifications: true,
    pageIds: [body.page_id],
  });

  return NextResponse.json({ comment: data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const { userId, error: authErr } = await authGuard();
  if (authErr) return authErr;
  if (!supabaseAdmin) return apiError("DB not configured");

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return apiError("id required", 400);

  const { data: body, error: valErr } = await validateRequest(request, ResolveCommentSchema);
  if (valErr) return valErr;

  const { data: existing } = await supabaseAdmin
    .from("workspace_comments")
    .select("page_id, content, resolved")
    .eq("id", id)
    .single();

  if (!existing) return apiError("Comment not found", 404);
  const { data: page } = await supabaseAdmin
    .from("workspace_pages")
    .select("title, client_slug")
    .eq("id", existing.page_id)
    .single();

  if (!page) return apiError("Page not found", 404);
  const access = await requireWorkspaceClientAccess(userId, page.client_slug as string | null);
  if (access instanceof Response) return access;

  const { error: dbErr } = await supabaseAdmin
    .from("workspace_comments")
    .update({ resolved: body.resolved, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (dbErr) return apiError(dbErr.message);

  if (body.resolved !== existing.resolved) {
    if (page) {
      await logSystemEvent({
        eventName: "workspace_comment_resolved",
        actorId: userId,
        clientSlug: page.client_slug,
        entityType: "workspace_comment",
        entityId: id,
        pageId: existing.page_id,
        summary: body.resolved
          ? `Resolved a comment on "${page.title}"`
          : `Reopened a comment on "${page.title}"`,
        detail: excerpt(existing.content),
      });
    }
  }

  revalidateWorkspaceMutationTargets({
    clientSlug: page.client_slug as string | null,
    includeActivity: true,
    pageIds: [existing.page_id],
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const { userId, error: authErr } = await authGuard();
  if (authErr) return authErr;
  if (!supabaseAdmin) return apiError("DB not configured");

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return apiError("id required", 400);

  const { data: existing } = await supabaseAdmin
    .from("workspace_comments")
    .select("page_id, content")
    .eq("id", id)
    .eq("author_id", userId)
    .single();

  if (!existing) return apiError("Comment not found", 404);
  const { data: page } = await supabaseAdmin
    .from("workspace_pages")
    .select("title, client_slug")
    .eq("id", existing.page_id)
    .single();

  if (!page) return apiError("Page not found", 404);
  const access = await requireWorkspaceClientAccess(userId, page.client_slug as string | null);
  if (access instanceof Response) return access;

  const { error: dbErr } = await supabaseAdmin
    .from("workspace_comments")
    .delete()
    .eq("id", id)
    .eq("author_id", userId);

  if (dbErr) return apiError(dbErr.message);

  if (page) {
    await logSystemEvent({
      eventName: "workspace_comment_deleted",
      actorId: userId,
      clientSlug: page.client_slug,
      entityType: "workspace_comment",
      entityId: id,
      pageId: existing.page_id,
      summary: `Deleted a comment from "${page.title}"`,
      detail: excerpt(existing.content),
    });
  }

  revalidateWorkspaceMutationTargets({
    clientSlug: page.client_slug as string | null,
    includeActivity: true,
    pageIds: [existing.page_id],
  });

  return NextResponse.json({ success: true });
}
