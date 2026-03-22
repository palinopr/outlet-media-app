import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { InviteSchema } from "@/lib/api-schemas";
import { adminGuard, validateRequest } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";

// POST /api/admin/invite
// Body: { email: string, clientId?: string, client_role?: "owner" | "member", role?: "admin" }
// Creates a DB-backed invite ledger row for client invites and sends the Clerk invitation
// with only the transition metadata needed for signup completion.

export async function POST(request: Request) {
  const adminErr = await adminGuard();
  if (adminErr) return adminErr;

  const { data: body, error: valErr } = await validateRequest(request, InviteSchema);
  if (valErr) return valErr;
  const normalizedEmail = body.email.trim().toLowerCase();

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  let clientRow: { id: string; slug: string } | null = null;
  if (body.clientId) {
    const { data, error } = await supabaseAdmin
      .from("clients")
      .select("id, slug")
      .eq("id", body.clientId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: "Failed to load client" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Client not found" }, { status: 400 });
    }

    clientRow = data;
  }

  let inviteId: string | null = null;
  if (clientRow) {
    const { data, error } = await supabaseAdmin
      .from("client_access_invites")
      .insert({
        client_id: clientRow.id,
        client_role: body.client_role ?? "member",
        email: normalizedEmail,
      })
      .select("id")
      .single();

    if (error || !data?.id) {
      return NextResponse.json({ error: "Failed to create invite record" }, { status: 500 });
    }

    inviteId = data.id;
  }

  const publicMetadata: Record<string, string> = {};
  if (body.role) publicMetadata.role = body.role;
  if (clientRow && inviteId) {
    publicMetadata.client_id = clientRow.id;
    publicMetadata.client_role = body.client_role ?? "member";
    publicMetadata.invite_id = inviteId;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  const redirectUrl = new URL("/sign-up", baseUrl);
  if (inviteId) {
    redirectUrl.searchParams.set("invite_id", inviteId);
  }

  try {
    const client = await clerkClient();
    const invitation = await client.invitations.createInvitation({
      emailAddress: normalizedEmail,
      publicMetadata,
      ignoreExisting: true,
      redirectUrl: redirectUrl.toString(),
    });

    if (inviteId) {
      await supabaseAdmin
        .from("client_access_invites")
        .update({ clerk_invitation_id: invitation.id })
        .eq("id", inviteId);
    }
  } catch (err: unknown) {
    // Clerk errors carry an `errors` array with detailed messages
    const clerkErr = err as { errors?: { message: string }[]; message?: string; status?: number };
    const detail = clerkErr.errors?.[0]?.message ?? clerkErr.message ?? "Failed to create invitation";
    const status = clerkErr.status ?? 500;
    return NextResponse.json({ error: detail }, { status });
  }

  return NextResponse.json({ ok: true });
}
