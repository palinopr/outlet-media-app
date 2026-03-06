import { NextResponse } from "next/server";
import { authGuard, apiError, validateRequest } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";
import { CreatePageSchema } from "@/lib/api-schemas";
import { logSystemEvent } from "@/features/system-events/server";

export async function GET(request: Request) {
  const { userId: _userId, error: authErr } = await authGuard();
  if (authErr) return authErr;
  if (!supabaseAdmin) return apiError("DB not configured", 500);

  const { searchParams } = new URL(request.url);
  const clientSlug = searchParams.get("client_slug");

  let query = supabaseAdmin
    .from("workspace_pages")
    .select("id, title, icon, parent_page_id, client_slug, is_archived, position, created_at, updated_at, created_by")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (clientSlug) {
    query = query.eq("client_slug", clientSlug);
  }

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

  const { data, error } = await supabaseAdmin
    .from("workspace_pages")
    .insert({
      title: body.title,
      client_slug: body.client_slug,
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
    clientSlug: body.client_slug,
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

  return NextResponse.json(data, { status: 201 });
}
