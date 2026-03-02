import { NextResponse } from "next/server";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { authGuard, apiError } from "@/lib/api-helpers";

// PATCH /api/admin/users/[userId]
// Body: { client_slug?: string | null, role?: "admin" | null }
// Only admins can call this.

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { error: authErr } = await authGuard();
  if (authErr) return authErr;

  const caller = await currentUser();
  const callerMeta = (caller?.publicMetadata ?? {}) as { role?: string };
  if (callerMeta.role !== "admin") {
    return apiError("Forbidden", 403);
  }

  const { userId } = await params;
  const body = (await request.json()) as {
    client_slug?: string | null;
    role?: string | null;
  };

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
