import { NextResponse } from "next/server";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { InviteSchema } from "@/lib/api-schemas";
import { authGuard, apiError } from "@/lib/api-helpers";

// POST /api/admin/invite
// Body: { email: string, client_slug?: string, role?: "admin" }
// Sends a Clerk invitation email. When the user signs up they get
// the metadata pre-applied (client_slug or role).

export async function POST(request: Request) {
  const { error: authErr } = await authGuard();
  if (authErr) return authErr;

  const caller = await currentUser();
  const callerMeta = (caller?.publicMetadata ?? {}) as { role?: string };
  if (callerMeta.role !== "admin") {
    return apiError("Forbidden", 403);
  }

  const raw = await request.json();
  const parsed = InviteSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const body = parsed.data;

  const publicMetadata: Record<string, string> = {};
  if (body.client_slug) publicMetadata.client_slug = body.client_slug;
  if (body.role) publicMetadata.role = body.role;

  const client = await clerkClient();
  await client.invitations.createInvitation({
    emailAddress: body.email,
    publicMetadata,
  });

  return NextResponse.json({ ok: true });
}
