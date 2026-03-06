import { NextResponse } from "next/server";
import { authGuard, apiError, validateRequest } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";
import { CreatePageSchema } from "@/lib/api-schemas";
import { logSystemEvent } from "@/features/system-events/server";
import { revalidateWorkspaceMutationTargets } from "@/features/workflow/revalidation";
import { requireWorkspaceClientAccess } from "@/features/workspace/access";

export async function GET(request: Request) {
  const { userId, error: authErr } = await authGuard();
  if (authErr) return authErr;
  if (!supabaseAdmin) return apiError("DB not configured", 500);

  const { searchParams } = new URL(request.url);
  const access = await requireWorkspaceClientAccess(userId, searchParams.get("client_slug"));
  if (access instanceof Response) return access;

  let query = supabaseAdmin
    .from("workspace_pages")
    .select("id, title, icon, parent_page_id, client_slug, is_archived, position, created_at, updated_at, created_by")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  query = query.eq("client_slug", access.clientSlug);

  const { data, error } = await query;
  if (error) return apiError(error.message, 500);

  return NextResponse.json({ pages: data });
}

export async function POST(request: Request) {
  const { userId, error: authErr } = await authGuard();
  if (authErr) return authErr;
  if (!supabaseAdmin) return apiError("DB not configured", 500);

  const { data: body, error: valErr } = await validateRequest(request, CreatePageSchema);
  if (valErr) return valErr;
  const access = await requireWorkspaceClientAccess(userId, body.client_slug);
  if (access instanceof Response) return access;

  const { data, error } = await supabaseAdmin
    .from("workspace_pages")
    .insert({
      title: body.title,
      client_slug: access.clientSlug,
      parent_page_id: body.parent_page_id ?? null,
      icon: body.icon ?? null,
      created_by: userId!,
      content: [{ type: "p", children: [{ text: "" }] }],
    })
    .select("id, title")
    .single();

  if (error) return apiError(error.message, 500);

  await logSystemEvent({
    eventName: "workspace_page_created",
    actorId: userId,
    clientSlug: access.clientSlug,
    entityType: "workspace_page",
    entityId: data.id,
    pageId: data.id,
    summary: `Created page "${data.title as string}"`,
    detail: body.parent_page_id ? "Added it inside another page." : null,
    metadata: {
      title: data.title,
      parentPageId: body.parent_page_id ?? null,
    },
  });

  revalidateWorkspaceMutationTargets({
    clientSlug: access.clientSlug,
    includeActivity: true,
    pageIds: [data.id],
  });

  return NextResponse.json(data, { status: 201 });
}
