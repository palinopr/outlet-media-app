import { NextResponse, type NextRequest } from "next/server";
import { authGuard, apiError, validateRequest } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";
import { CreateCommentSchema, ResolveCommentSchema } from "@/lib/api-schemas";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  const { error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured");

  const pageId = request.nextUrl.searchParams.get("page_id");
  if (!pageId) return apiError("page_id required", 400);

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

  const { error: dbErr } = await supabaseAdmin
    .from("workspace_comments")
    .update({ resolved: body.resolved, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (dbErr) return apiError(dbErr.message);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const { userId, error: authErr } = await authGuard();
  if (authErr) return authErr;
  if (!supabaseAdmin) return apiError("DB not configured");

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return apiError("id required", 400);

  const { error: dbErr } = await supabaseAdmin
    .from("workspace_comments")
    .delete()
    .eq("id", id)
    .eq("author_id", userId);

  if (dbErr) return apiError(dbErr.message);
  return NextResponse.json({ success: true });
}
