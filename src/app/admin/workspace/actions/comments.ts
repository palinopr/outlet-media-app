"use server";

import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createNotification } from "./notifications";

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
      .select("created_by, title")
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

  // Notify page owner about new comment
  if (page?.created_by && page.created_by !== userId) {
    await createNotification({
      user_id: page.created_by,
      type: "comment",
      title: "New comment",
      message: `${authorName} commented on "${page.title}"`,
      page_id: formData.page_id,
      from_user_id: userId,
      from_user_name: authorName,
    });
  }

  // If replying, notify the parent comment author
  const parent = parentResult?.data;
  if (parent?.author_id && parent.author_id !== userId && parent.author_id !== page?.created_by) {
    await createNotification({
      user_id: parent.author_id,
      type: "comment",
      title: "New reply",
      message: `${authorName} replied to your comment`,
      page_id: formData.page_id,
      from_user_id: userId,
      from_user_name: authorName,
    });
  }

  revalidatePath(`/admin/workspace`);
  return comment;
}

export async function resolveComment(formData: { id: string; resolved: boolean }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { error } = await supabaseAdmin
    .from("workspace_comments")
    .update({ resolved: formData.resolved, updated_at: new Date().toISOString() })
    .eq("id", formData.id);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/workspace`);
}

export async function deleteComment(formData: { id: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { error } = await supabaseAdmin
    .from("workspace_comments")
    .delete()
    .eq("id", formData.id)
    .eq("author_id", userId);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/workspace`);
}
