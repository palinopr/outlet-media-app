import { NextResponse, NextRequest } from "next/server";
import { authGuard, apiError } from "@/lib/api-helpers";
import { requireWorkspaceClientAccess } from "@/features/workspace/access";
import { getWorkspaceReadClient } from "@/features/workspace/server";

export async function GET(request: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;

  const { searchParams } = request.nextUrl;
  const clientSlug = searchParams.get("client_slug");
  const status = searchParams.get("status");
  const assigneeId = searchParams.get("assignee_id");
  const priority = searchParams.get("priority");

  if (!clientSlug) return apiError("client_slug is required", 400);
  const access = await requireWorkspaceClientAccess(userId, clientSlug);
  if (access instanceof Response) return access;

  const readDb = await getWorkspaceReadClient(access.clientSlug);
  if (!readDb) return apiError("DB not configured", 500);

  let query = readDb
    .from("workspace_tasks")
    .select("*")
    .eq("client_slug", access.clientSlug)
    .order("position", { ascending: true });

  if (status) query = query.eq("status", status);
  if (assigneeId) query = query.eq("assignee_id", assigneeId);
  if (priority) query = query.eq("priority", priority);

  const { data, error: dbError } = await query;
  if (dbError) return apiError(dbError.message, 500);

  return NextResponse.json(data ?? []);
}
