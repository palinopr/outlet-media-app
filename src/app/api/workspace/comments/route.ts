import { NextResponse, type NextRequest } from "next/server";
import { authGuard, apiError, validateRequest } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";
import { CreateCommentSchema, ResolveCommentSchema } from "@/lib/api-schemas";
import { currentUser } from "@clerk/nextjs/server";
import { logSystemEvent } from "@/features/system-events/server";
import { requireWorkspaceClientAccess } from "@/features/workspace/access";

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
  if (!pageId) return apiError("page_id required", 400);

  const { data: page } = await supabaseAdmin
    .from("workspace_pages")
    .select("client_slug")
    .eq("id", pageId)
    .single();

  if (!page) return apiError("Page not found", 404);
  const access = await requireWorkspaceClientAccess(userId, page.client_slug as string | null);
  if (access instanceof Response) return access;

  const { data, error: dbErr } = await supabaseAdmin
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
  const { data: page } = await supabaseAdmin
    .from("workspace_pages")
    .select("title, client_slug")
    .eq("id", body.page_id)
    .single();

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

  if (page) {
    await logSystemEvent({
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
    });
  }

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

  return NextResponse.json({ success: true });
}
