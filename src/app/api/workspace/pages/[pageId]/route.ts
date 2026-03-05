import { NextResponse } from "next/server";
import { authGuard, apiError, validateRequest } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";
import { UpdatePageSchema } from "@/lib/api-schemas";

interface Ctx {
  params: Promise<{ pageId: string }>;
}

export async function GET(_request: Request, { params }: Ctx) {
  const { error: authErr } = await authGuard();
  if (authErr) return authErr;
  if (!supabaseAdmin) return apiError("DB not configured", 500);

  const { pageId } = await params;

  const { data, error } = await supabaseAdmin
    .from("workspace_pages")
    .select("*")
    .eq("id", pageId)
    .single();

  if (error) return apiError("Page not found", 404);

  return NextResponse.json(data);
}

export async function PATCH(request: Request, { params }: Ctx) {
  const { error: authErr } = await authGuard();
  if (authErr) return authErr;
  if (!supabaseAdmin) return apiError("DB not configured", 500);

  const { pageId } = await params;

  const { data: body, error: valErr } = await validateRequest(request, UpdatePageSchema);
  if (valErr) return valErr;

  const { error } = await supabaseAdmin
    .from("workspace_pages")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", pageId);

  if (error) return apiError(error.message, 500);

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const { error: authErr } = await authGuard();
  if (authErr) return authErr;
  if (!supabaseAdmin) return apiError("DB not configured", 500);

  const { pageId } = await params;

  const { error } = await supabaseAdmin
    .from("workspace_pages")
    .delete()
    .eq("id", pageId);

  if (error) return apiError(error.message, 500);

  return NextResponse.json({ ok: true });
}
