import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { InviteSchema } from "@/lib/api-schemas";
import { adminGuard, validateRequest } from "@/lib/api-helpers";
import { enforceContentLength } from "@/lib/request-guards";
import { supabaseAdmin } from "@/lib/supabase";

async function grantClientMembership(input: {
  clientId: string;
  clerkUserId: string;
  role: "owner" | "member";
}) {
  if (!supabaseAdmin) throw new Error("Database not configured");

  const { data: existingMembership, error: existingMembershipError } = await supabaseAdmin
    .from("client_members")
    .select("id")
    .eq("client_id", input.clientId)
    .eq("clerk_user_id", input.clerkUserId)
    .maybeSingle();

  if (existingMembershipError) throw new Error(existingMembershipError.message);

  if (existingMembership) {
    const { error } = await supabaseAdmin
      .from("client_members")
      .update({ role: input.role })
      .eq("id", existingMembership.id);
    if (error) throw new Error(error.message);
    return;
  }

  const { error } = await supabaseAdmin
    .from("client_members")
    .insert({
      client_id: input.clientId,
      clerk_user_id: input.clerkUserId,
      role: input.role,
    });

  if (error) throw new Error(error.message);
}

// POST /api/admin/invite
// Body: { email: string, clientId?: string, client_role?: "owner" | "member", role?: "admin" }
// Creates a DB-backed invite ledger row for client invites and sends the Clerk invitation
// with only the transition metadata needed for signup completion.

export async function POST(request: Request) {
  const sizeError = enforceContentLength(request, 8 * 1024);
  if (sizeError) return sizeError;

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

  const client = await clerkClient();
  const clientRole = body.client_role ?? "member";
  const existingUsers = await client.users.getUserList({
    emailAddress: [normalizedEmail],
    limit: 1,
  });
  const existingUser = existingUsers.data[0] ?? null;

  if (existingUser && body.role === "admin") {
    await client.users.updateUserMetadata(existingUser.id, {
      publicMetadata: { ...existingUser.publicMetadata, role: "admin" },
    });
    return NextResponse.json({
      ok: true,
      message: "Admin access granted to existing user.",
    });
  }

  if (clientRow && existingUser) {
    try {
      await grantClientMembership({
        clientId: clientRow.id,
        clerkUserId: existingUser.id,
        role: clientRole,
      });
      await supabaseAdmin
        .from("client_access_invites")
        .update({
          accepted_at: new Date().toISOString(),
          accepted_by_clerk_user_id: existingUser.id,
          status: "accepted",
        })
        .eq("client_id", clientRow.id)
        .eq("email", normalizedEmail)
        .eq("status", "pending");
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Failed to grant client access";
      return NextResponse.json({ error: detail }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: "Access granted to existing user.",
    });
  }

  let inviteId: string | null = null;
  if (clientRow) {
    const { data, error } = await supabaseAdmin
      .from("client_access_invites")
      .insert({
        client_id: clientRow.id,
        client_role: clientRole,
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
    publicMetadata.client_role = clientRole;
    publicMetadata.invite_id = inviteId;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  const redirectUrl = new URL("/sign-up", baseUrl);
  if (inviteId) {
    redirectUrl.searchParams.set("invite_id", inviteId);
  }

  try {
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
