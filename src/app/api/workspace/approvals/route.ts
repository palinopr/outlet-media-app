import { NextResponse, type NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { authGuard, apiError, isAdminRole, validateRequest } from "@/lib/api-helpers";
import { CreateApprovalRequestSchema } from "@/lib/api-schemas";
import { getMemberAccessForSlug } from "@/lib/member-access";
import {
  canAccessApprovalAudience,
  createApprovalRequest,
  listApprovalRequests,
} from "@/features/approvals/server";

export async function GET(request: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;

  const user = await currentUser();
  const isAdmin = isAdminRole((user?.publicMetadata as { role?: string } | undefined)?.role);
  const clientSlug = request.nextUrl.searchParams.get("client_slug");
  const status = request.nextUrl.searchParams.get("status");
  const access = !isAdmin && clientSlug ? await getMemberAccessForSlug(userId, clientSlug) : null;

  if (!isAdmin && !clientSlug) {
    return apiError("client_slug is required", 400);
  }

  if (!isAdmin && clientSlug) {
    if (!access) return apiError("Forbidden", 403);
  }

  const approvals = await listApprovalRequests({
    audience: isAdmin ? "all" : "shared",
    clientSlug,
    limit: 20,
    scope:
      access?.scope === "assigned"
        ? {
            allowedCampaignIds: access.allowedCampaignIds,
            allowedEventIds: access.allowedEventIds,
          }
        : null,
    status:
      status === "approved" ||
      status === "rejected" ||
      status === "cancelled" ||
      status === "pending"
        ? status
        : "all",
  });

  return NextResponse.json({ approvals });
}

export async function POST(request: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;

  const { data: body, error: validationError } = await validateRequest(
    request,
    CreateApprovalRequestSchema,
  );
  if (validationError) return validationError;

  const user = await currentUser();
  const isAdmin = isAdminRole((user?.publicMetadata as { role?: string } | undefined)?.role);
  if (!isAdmin) {
    const allowed = await canAccessApprovalAudience(userId, body.client_slug, "shared");
    if (!allowed) return apiError("Forbidden", 403);
  }

  const approval = await createApprovalRequest({
    audience: body.audience,
    clientSlug: body.client_slug,
    entityId: body.entity_id ?? null,
    entityType: body.entity_type ?? null,
    metadata: body.metadata,
    pageId: body.page_id ?? null,
    requestType: body.request_type,
    summary: body.summary ?? null,
    taskId: body.task_id ?? null,
    title: body.title,
  });

  if (!approval) return apiError("Failed to create approval", 500);

  return NextResponse.json({ approval }, { status: 201 });
}
