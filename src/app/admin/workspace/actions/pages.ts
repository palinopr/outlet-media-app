"use server";

import { z } from "zod/v4";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { adminGuard } from "@/lib/api-helpers";
import { CreatePageSchema, UpdatePageSchema } from "@/lib/api-schemas";
import { logAudit } from "../../actions/audit";
import { revalidateWorkspaceMutationTargets } from "@/features/workflow/revalidation";

const DeletePageInput = z.object({
  pageId: z.string().uuid(),
});

export async function createPage(formData: {
  title?: string;
  client_slug: string;
  parent_page_id?: string;
  icon?: string;
}) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = CreatePageSchema.parse(formData);
  const user = await currentUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabaseAdmin
    .from("workspace_pages")
    .insert({
      title: parsed.title,
      client_slug: parsed.client_slug,
      parent_page_id: parsed.parent_page_id ?? null,
      icon: parsed.icon ?? null,
      created_by: user.id,
      content: [{ type: "p", children: [{ text: "" }] }],
    })
    .select("id, title")
    .single();

  if (error) throw new Error(error.message);

  await logAudit("workspace_page", data.id, "create", null, {
    title: parsed.title,
    client_slug: parsed.client_slug,
  });
  revalidateWorkspaceMutationTargets({
    clientSlug: parsed.client_slug,
    pageIds: [data.id],
  });
  return data;
}

export async function updatePage(formData: {
  pageId: string;
  title?: string;
  icon?: string | null;
  cover_image?: string | null;
  parent_page_id?: string | null;
  is_archived?: boolean;
  position?: number;
}) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const pageId = z.string().uuid().parse(formData.pageId);
  const { pageId: _, ...rest } = formData;
  const updates = UpdatePageSchema.parse(rest);
  const { data: existing } = await supabaseAdmin
    .from("workspace_pages")
    .select("client_slug")
    .eq("id", pageId)
    .single();

  if (!existing) throw new Error("Page not found");

  const { error } = await supabaseAdmin
    .from("workspace_pages")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", pageId);

  if (error) throw new Error(error.message);

  await logAudit("workspace_page", pageId, "update", null, updates);
  revalidateWorkspaceMutationTargets({
    clientSlug: existing.client_slug,
    pageIds: [pageId],
  });
}

export async function archivePage(formData: { pageId: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = DeletePageInput.parse(formData);
  const { data: existing } = await supabaseAdmin
    .from("workspace_pages")
    .select("client_slug")
    .eq("id", parsed.pageId)
    .single();

  if (!existing) throw new Error("Page not found");

  const { error } = await supabaseAdmin
    .from("workspace_pages")
    .update({ is_archived: true, updated_at: new Date().toISOString() })
    .eq("id", parsed.pageId);

  if (error) throw new Error(error.message);

  await logAudit("workspace_page", parsed.pageId, "archive", null, { is_archived: true });
  revalidateWorkspaceMutationTargets({
    clientSlug: existing.client_slug,
    pageIds: [parsed.pageId],
  });
}

export async function restorePage(formData: { pageId: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = DeletePageInput.parse(formData);
  const { data: existing } = await supabaseAdmin
    .from("workspace_pages")
    .select("client_slug")
    .eq("id", parsed.pageId)
    .single();

  if (!existing) throw new Error("Page not found");

  const { error } = await supabaseAdmin
    .from("workspace_pages")
    .update({ is_archived: false, updated_at: new Date().toISOString() })
    .eq("id", parsed.pageId);

  if (error) throw new Error(error.message);

  await logAudit("workspace_page", parsed.pageId, "restore", null, { is_archived: false });
  revalidateWorkspaceMutationTargets({
    clientSlug: existing.client_slug,
    pageIds: [parsed.pageId],
  });
}

export async function deletePage(formData: { pageId: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = DeletePageInput.parse(formData);
  const { data: existing } = await supabaseAdmin
    .from("workspace_pages")
    .select("client_slug")
    .eq("id", parsed.pageId)
    .single();

  if (!existing) throw new Error("Page not found");

  const { error } = await supabaseAdmin
    .from("workspace_pages")
    .delete()
    .eq("id", parsed.pageId);

  if (error) throw new Error(error.message);

  await logAudit("workspace_page", parsed.pageId, "delete", null, null);
  revalidateWorkspaceMutationTargets({
    clientSlug: existing.client_slug,
    pageIds: [parsed.pageId],
  });
}
