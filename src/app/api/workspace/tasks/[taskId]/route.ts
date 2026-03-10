import { NextResponse, NextRequest } from "next/server";
import { authGuard, apiError, dbError, validateRequest } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";
import { UpdateTaskSchema } from "@/lib/api-schemas";
import { requireWorkspaceClientAccess } from "@/features/workspace/access";

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
  const { data: existing } = await supabaseAdmin
    .from("workspace_tasks")
    .select("client_slug")
    .eq("id", taskId)
    .single();

  if (!existing) return apiError("Task not found", 404);
  const access = await requireWorkspaceClientAccess(userId, existing.client_slug as string | null);
  if (access instanceof Response) return access;

  const { error: dbErr } = await supabaseAdmin
    .from("workspace_tasks")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", taskId);

  if (dbErr) return dbError(dbErr);

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
  const { data: existing } = await supabaseAdmin
    .from("workspace_tasks")
    .select("client_slug")
    .eq("id", taskId)
    .single();

  if (!existing) return apiError("Task not found", 404);
  const access = await requireWorkspaceClientAccess(userId, existing.client_slug as string | null);
  if (access instanceof Response) return access;

  const { error: dbErr } = await supabaseAdmin
    .from("workspace_tasks")
    .delete()
    .eq("id", taskId);

  if (dbErr) return dbError(dbErr);

  return NextResponse.json({ ok: true });
}
