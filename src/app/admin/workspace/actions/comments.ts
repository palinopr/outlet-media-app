"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { NotificationType } from "@/lib/workspace-types";
import { createNotification } from "@/features/notifications/server";
import { revalidateWorkspaceMutationTargets } from "@/features/workflow/revalidation";

function readPageClientSlug(page: unknown): string | null {
  if (!page || typeof page !== "object") return null;
  const value = (page as Record<string, unknown>).client_slug;
  return typeof value === "string" ? value : null;
}

export async function createComment(formData: {
  page_id: string;
  content: string;
  parent_comment_id?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const user = await currentUser();
  const authorName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Unknown";

  const { data: comment, error } = await supabaseAdmin
    .from("workspace_comments")
    .insert({
      page_id: formData.page_id,
      content: formData.content,
      author_id: userId,
      author_name: authorName,
      parent_comment_id: formData.parent_comment_id ?? null,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  // Fetch page + parent comment in parallel for notifications
  const [{ data: page }, parentResult] = await Promise.all([
    supabaseAdmin
      .from("workspace_pages")
      .select("client_slug, created_by, title")
      .eq("id", formData.page_id)
      .single(),
    formData.parent_comment_id
      ? supabaseAdmin
          .from("workspace_comments")
          .select("author_id, author_name")
          .eq("id", formData.parent_comment_id)
          .single()
      : Promise.resolve({ data: null }),
  ]);
  const pageClientSlug = readPageClientSlug(page);

  // Notify page owner about new comment
  const commentType: NotificationType = "comment";
  if (page?.created_by && page.created_by !== userId) {
    await createNotification({
      clientSlug: pageClientSlug,
      entityId: formData.page_id,
      entityType: "workspace_page",
      type: commentType,
      title: "New comment",
      message: `${authorName} commented on "${page.title}"`,
      pageId: formData.page_id,
      fromUserId: userId,
      fromUserName: authorName,
      userId: page.created_by,
    });
  }

  // If replying, notify the parent comment author
  const parent = parentResult?.data;
  if (parent?.author_id && parent.author_id !== userId && parent.author_id !== page?.created_by) {
    await createNotification({
      clientSlug: pageClientSlug,
      entityId: formData.page_id,
      entityType: "workspace_page",
      type: commentType,
      title: "New reply",
      message: `${authorName} replied to your comment`,
      pageId: formData.page_id,
      fromUserId: userId,
      fromUserName: authorName,
      userId: parent.author_id,
    });
  }

  revalidateWorkspaceMutationTargets({
    clientSlug: pageClientSlug,
    includeNotifications: true,
    pageIds: [formData.page_id],
  });
  return comment;
}

export async function resolveComment(formData: { id: string; resolved: boolean }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { data: existing } = await supabaseAdmin
    .from("workspace_comments")
    .select("page_id")
    .eq("id", formData.id)
    .single();

  if (!existing) throw new Error("Comment not found");

  const [{ error }, { data: page }] = await Promise.all([
    supabaseAdmin
      .from("workspace_comments")
      .update({ resolved: formData.resolved, updated_at: new Date().toISOString() })
      .eq("id", formData.id),
    supabaseAdmin
      .from("workspace_pages")
      .select("client_slug")
      .eq("id", existing.page_id)
      .single(),
  ]);

  if (error) throw new Error(error.message);
  revalidateWorkspaceMutationTargets({
    clientSlug: readPageClientSlug(page),
    pageIds: [existing.page_id],
  });
}

export async function deleteComment(formData: { id: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { data: existing } = await supabaseAdmin
    .from("workspace_comments")
    .select("page_id")
    .eq("id", formData.id)
    .eq("author_id", userId)
    .single();

  if (!existing) throw new Error("Comment not found");

  const [{ error }, { data: page }] = await Promise.all([
    supabaseAdmin
      .from("workspace_comments")
      .delete()
      .eq("id", formData.id)
      .eq("author_id", userId),
    supabaseAdmin
      .from("workspace_pages")
      .select("client_slug")
      .eq("id", existing.page_id)
      .single(),
  ]);

  if (error) throw new Error(error.message);
  revalidateWorkspaceMutationTargets({
    clientSlug: readPageClientSlug(page),
    pageIds: [existing.page_id],
  });
}
