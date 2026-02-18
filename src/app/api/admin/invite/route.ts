import { NextResponse } from "next/server";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

// POST /api/admin/invite
// Body: { email: string, client_slug?: string, role?: "admin" }
// Sends a Clerk invitation email. When the user signs up they get
// the metadata pre-applied (client_slug or role).

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const caller = await currentUser();
  const callerMeta = (caller?.publicMetadata ?? {}) as { role?: string };
  if (callerMeta.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    email: string;
    client_slug?: string;
    role?: string;
  };

  if (!body.email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  const publicMetadata: Record<string, string> = {};
  if (body.client_slug) publicMetadata.client_slug = body.client_slug;
  if (body.role) publicMetadata.role = body.role;

  const client = await clerkClient();
  await client.invitations.createInvitation({
    emailAddress: body.email,
    publicMetadata,
    redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/sign-in`,
  });

  return NextResponse.json({ ok: true });
}
