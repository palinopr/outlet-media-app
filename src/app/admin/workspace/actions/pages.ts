"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { adminGuard } from "@/lib/api-helpers";
import { logAudit } from "../../actions/audit";

const CreatePageInput = z.object({
  title: z.string().max(500).default("Untitled"),
  client_slug: z.string().min(1),
  parent_page_id: z.string().uuid().optional(),
  icon: z.string().max(10).optional(),
});

const UpdatePageInput = z.object({
  pageId: z.string().uuid(),
  title: z.string().max(500).optional(),
  icon: z.string().max(10).optional().nullable(),
  cover_image: z.string().max(2000).optional().nullable(),
  parent_page_id: z.string().uuid().optional().nullable(),
  is_archived: z.boolean().optional(),
  position: z.number().int().min(0).optional(),
});

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

  const parsed = CreatePageInput.parse(formData);
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
  revalidatePath("/admin/workspace");
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

  const parsed = UpdatePageInput.parse(formData);
  const { pageId, ...updates } = parsed;

  const { error } = await supabaseAdmin
    .from("workspace_pages")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", pageId);

  if (error) throw new Error(error.message);

  await logAudit("workspace_page", pageId, "update", null, updates);
  revalidatePath("/admin/workspace");
}

export async function archivePage(formData: { pageId: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = DeletePageInput.parse(formData);

  const { error } = await supabaseAdmin
    .from("workspace_pages")
    .update({ is_archived: true, updated_at: new Date().toISOString() })
    .eq("id", parsed.pageId);

  if (error) throw new Error(error.message);

  await logAudit("workspace_page", parsed.pageId, "archive", null, { is_archived: true });
  revalidatePath("/admin/workspace");
}

export async function restorePage(formData: { pageId: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = DeletePageInput.parse(formData);

  const { error } = await supabaseAdmin
    .from("workspace_pages")
    .update({ is_archived: false, updated_at: new Date().toISOString() })
    .eq("id", parsed.pageId);

  if (error) throw new Error(error.message);

  await logAudit("workspace_page", parsed.pageId, "restore", null, { is_archived: false });
  revalidatePath("/admin/workspace");
}

export async function deletePage(formData: { pageId: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = DeletePageInput.parse(formData);

  const { error } = await supabaseAdmin
    .from("workspace_pages")
    .delete()
    .eq("id", parsed.pageId);

  if (error) throw new Error(error.message);

  await logAudit("workspace_page", parsed.pageId, "delete", null, null);
  revalidatePath("/admin/workspace");
}
