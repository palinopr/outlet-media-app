import { NextResponse, type NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { authGuard, apiError, validateRequest } from "@/lib/api-helpers";
import { ResolveApprovalRequestSchema } from "@/lib/api-schemas";
import {
  canAccessApprovalRequest,
  getApprovalRequestById,
  resolveApprovalRequest,
} from "@/features/approvals/server";

function isAdminRole(role: unknown): boolean {
  return typeof role === "string" && role === "admin";
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId, error } = await authGuard();
  if (error) return error;

  const { id } = await params;
  const { data: body, error: validationError } = await validateRequest(
    request,
    ResolveApprovalRequestSchema,
  );
  if (validationError) return validationError;

  const user = await currentUser();
  const isAdmin = isAdminRole((user?.publicMetadata as { role?: string } | undefined)?.role);
  const approval = await getApprovalRequestById(id);

  if (!approval) return apiError("Approval not found", 404);

  if (!isAdmin) {
    const allowed = await canAccessApprovalRequest(userId, approval);
    if (!allowed) return apiError("Forbidden", 403);
  }

  if (approval.status !== "pending") {
    return apiError("Approval is already resolved", 409);
  }

  const updated = await resolveApprovalRequest({
    id,
    note: body.note ?? null,
    status: body.status,
  });

  if (!updated) return apiError("Failed to update approval", 500);

  return NextResponse.json({ approval: updated });
}
