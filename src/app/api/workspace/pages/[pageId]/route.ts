import { NextResponse } from "next/server";
import { authGuard, apiError, dbError, validateRequest } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";
import { UpdatePageSchema } from "@/lib/api-schemas";
import {
  logSystemEvent,
  summarizeChangedFields,
} from "@/features/system-events/server";
import { revalidateWorkspaceMutationTargets } from "@/features/workflow/revalidation";
import { requireWorkspaceClientAccess } from "@/features/workspace/access";

interface Ctx {
  params: Promise<{ pageId: string }>;
}

const PAGE_FIELD_LABELS: Record<string, string> = {
  cover_image: "cover image",
  icon: "icon",
  is_archived: "archive state",
  parent_page_id: "parent page",
  title: "title",
};

export async function GET(_request: Request, { params }: Ctx) {
  const { userId, error: authErr } = await authGuard();
  if (authErr) return authErr;
  if (!supabaseAdmin) return apiError("DB not configured", 500);

  const { pageId } = await params;

  const { data, error } = await supabaseAdmin
    .from("workspace_pages")
    .select("*")
    .eq("id", pageId)
    .single();

  if (error) return apiError("Page not found", 404);
  const access = await requireWorkspaceClientAccess(userId, data.client_slug as string | null);
  if (access instanceof Response) return access;

  return NextResponse.json(data);
}

export async function PATCH(request: Request, { params }: Ctx) {
  const { userId, error: authErr } = await authGuard();
  if (authErr) return authErr;
  if (!supabaseAdmin) return apiError("DB not configured", 500);

  const { pageId } = await params;

  const { data: body, error: valErr } = await validateRequest(request, UpdatePageSchema);
  if (valErr) return valErr;

  const { data: existing } = await supabaseAdmin
    .from("workspace_pages")
    .select("title, client_slug, is_archived")
    .eq("id", pageId)
    .single();

  if (!existing) return apiError("Page not found", 404);
  const access = await requireWorkspaceClientAccess(userId, existing.client_slug as string | null);
  if (access instanceof Response) return access;

  const { error } = await supabaseAdmin
    .from("workspace_pages")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", pageId);

  if (error) return dbError(error);

  const changedFields = Object.keys(body)
    .filter((key) => key !== "content" && key !== "position")
    .map((key) => PAGE_FIELD_LABELS[key] ?? key.replaceAll("_", " "));

  const archiveChanged = typeof body.is_archived === "boolean" && body.is_archived !== existing.is_archived;
  const eventName = archiveChanged
    ? body.is_archived
      ? "workspace_page_archived"
      : "workspace_page_restored"
    : "workspace_page_updated";

  if (archiveChanged || changedFields.length > 0) {
    const nextTitle = typeof body.title === "string" ? body.title : existing.title;
    const summary =
      eventName === "workspace_page_archived"
        ? `Archived page "${existing.title}"`
        : eventName === "workspace_page_restored"
          ? `Restored page "${existing.title}"`
          : body.title && body.title !== existing.title
            ? `Renamed page to "${body.title}"`
            : `Updated page "${nextTitle}"`;

    await logSystemEvent({
      eventName,
      actorId: userId,
      clientSlug: existing.client_slug,
      entityType: "workspace_page",
      entityId: pageId,
      pageId,
      summary,
      detail: summarizeChangedFields(changedFields),
      metadata: {
        changedFields,
      },
    });
  }

  revalidateWorkspaceMutationTargets({
    clientSlug: existing.client_slug as string | null,
    includeActivity: true,
    pageIds: [pageId],
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const { userId, error: authErr } = await authGuard();
  if (authErr) return authErr;
  if (!supabaseAdmin) return apiError("DB not configured", 500);

  const { pageId } = await params;

  const { data: existing } = await supabaseAdmin
    .from("workspace_pages")
    .select("title, client_slug")
    .eq("id", pageId)
    .single();

  if (!existing) return apiError("Page not found", 404);
  const access = await requireWorkspaceClientAccess(userId, existing.client_slug as string | null);
  if (access instanceof Response) return access;

  const { error } = await supabaseAdmin
    .from("workspace_pages")
    .delete()
    .eq("id", pageId);

  if (error) return dbError(error);

  await logSystemEvent({
    eventName: "workspace_page_deleted",
    actorId: userId,
    clientSlug: existing.client_slug,
    entityType: "workspace_page",
    entityId: pageId,
    pageId,
    summary: `Deleted page "${existing.title}"`,
  });

  revalidateWorkspaceMutationTargets({
    clientSlug: existing.client_slug as string | null,
    includeActivity: true,
    pageIds: [pageId],
  });

  return NextResponse.json({ ok: true });
}
