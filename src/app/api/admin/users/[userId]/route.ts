import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { adminGuard, apiError, parseJsonBody } from "@/lib/api-helpers";
import { UserUpdateSchema } from "@/lib/api-schemas";

// PATCH /api/admin/users/[userId]
// Body: { client_slug?: string | null, role?: "admin" | null }
// Only admins can call this.

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const adminErr = await adminGuard();
  if (adminErr) return adminErr;

  const { userId } = await params;
  const rawBody = await parseJsonBody<unknown>(request);
  if (rawBody instanceof Response) return rawBody;
  const parsed = UserUpdateSchema.safeParse(rawBody);
  if (!parsed.success) {
    return apiError("Invalid payload", 400);
  }
  const body = parsed.data;

  // Fetch existing metadata so we don't wipe unrelated fields
  const client = await clerkClient();
  const target = await client.users.getUser(userId);
  const existingMeta = (target.publicMetadata ?? {}) as Record<string, unknown>;

  const updated: Record<string, unknown> = { ...existingMeta };

  if ("client_slug" in body) {
    if (body.client_slug) {
      updated.client_slug = body.client_slug;
    } else {
      delete updated.client_slug;
    }
  }

  if ("role" in body) {
    if (body.role) {
      updated.role = body.role;
    } else {
      delete updated.role;
    }
  }

  await client.users.updateUserMetadata(userId, { publicMetadata: updated });

  return NextResponse.json({ ok: true });
}
