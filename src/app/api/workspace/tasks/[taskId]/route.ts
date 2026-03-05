import { NextResponse, NextRequest } from "next/server";
import { authGuard, apiError, validateRequest } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";
import { UpdateTaskSchema } from "@/lib/api-schemas";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { userId, error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured", 500);

  const { taskId } = await params;

  const { data: body, error: valError } = await validateRequest(request, UpdateTaskSchema);
  if (valError) return valError;

  const { error: dbError } = await supabaseAdmin
    .from("workspace_tasks")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", taskId);

  if (dbError) return apiError(dbError.message, 500);

  // Fetch updated task
  const { data: task } = await supabaseAdmin
    .from("workspace_tasks")
    .select("*")
    .eq("id", taskId)
    .single();

  return NextResponse.json(task);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { userId, error } = await authGuard();
  if (error) return error;
  if (!supabaseAdmin) return apiError("DB not configured", 500);

  const { taskId } = await params;

  const { error: dbError } = await supabaseAdmin
    .from("workspace_tasks")
    .delete()
    .eq("id", taskId);

  if (dbError) return apiError(dbError.message, 500);

  return NextResponse.json({ ok: true });
}
