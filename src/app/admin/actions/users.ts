"use server";

import { z } from "zod/v4";
import { clerkClient } from "@clerk/nextjs/server";
import { adminGuard } from "@/lib/api-helpers";
import { logAudit } from "./audit";
import { revalidateAccessManagementPaths } from "@/features/access/revalidation";
import { supabaseAdmin } from "@/lib/supabase";

const ChangeRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["admin", "client"]),
});

export async function changeUserRole(formData: { userId: string; role: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = ChangeRoleSchema.parse(formData);
  const client = await clerkClient();
  const user = await client.users.getUser(parsed.userId);
  const oldRole = (user.publicMetadata as Record<string, unknown>)?.role ?? "client";

  await client.users.updateUserMetadata(parsed.userId, {
    publicMetadata: { ...user.publicMetadata, role: parsed.role === "client" ? undefined : parsed.role },
  });

  await logAudit("user", parsed.userId, "change_role", { role: oldRole }, { role: parsed.role });
  revalidateAccessManagementPaths();
}

const BulkUpdateRoleSchema = z.object({
  userIds: z.array(z.string().min(1)).min(1),
  role: z.enum(["admin", "client"]),
});

export async function bulkUpdateUserRole(formData: { userIds: string[]; role: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = BulkUpdateRoleSchema.parse(formData);
  const clerk = await clerkClient();

  const results = await Promise.allSettled(
    parsed.userIds.map(async (userId) => {
      const user = await clerk.users.getUser(userId);
      await clerk.users.updateUserMetadata(userId, {
        publicMetadata: { ...user.publicMetadata, role: parsed.role === "client" ? undefined : parsed.role },
      });
    }),
  );

  const failed = results.filter((r) => r.status === "rejected").length;
  const succeeded = results.length - failed;

  await logAudit("user", "bulk", "bulk_update_role", null, {
    total: parsed.userIds.length,
    succeeded,
    failed,
    role: parsed.role,
  });
  revalidateAccessManagementPaths();

  if (failed > 0) {
    return { success: false, message: `${succeeded} updated, ${failed} failed` };
  }
  return { success: true };
}

const DeleteUserSchema = z.object({
  userId: z.string().min(1),
});

export async function deleteUser(formData: { userId: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = DeleteUserSchema.parse(formData);
  const client = await clerkClient();
  const user = await client.users.getUser(parsed.userId);

  await client.users.deleteUser(parsed.userId);

  await logAudit("user", parsed.userId, "delete", { email: user.emailAddresses[0]?.emailAddress }, null);
  revalidateAccessManagementPaths();
}

const RevokeInvitationSchema = z.object({
  invitationId: z.string().min(1),
});

export async function revokeInvitation(formData: { invitationId: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = RevokeInvitationSchema.parse(formData);
  const client = await clerkClient();

  if (!supabaseAdmin) {
    await client.invitations.revokeInvitation(parsed.invitationId);
    await logAudit("invitation", parsed.invitationId, "revoke", null, null);
    revalidateAccessManagementPaths();
    return;
  }

  const { data: invite, error } = await supabaseAdmin
    .from("client_access_invites")
    .select("id, email, client_id, clerk_invitation_id, clients(slug)")
    .eq("id", parsed.invitationId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!invite) {
    await client.invitations.revokeInvitation(parsed.invitationId);
    await logAudit("invitation", parsed.invitationId, "revoke", null, { status: "revoked" });
    revalidateAccessManagementPaths();
    return;
  }

  if (invite.clerk_invitation_id) {
    await client.invitations.revokeInvitation(invite.clerk_invitation_id);
  }

  const now = new Date().toISOString();
  const { error: updateError } = await supabaseAdmin
    .from("client_access_invites")
    .update({ revoked_at: now, status: "revoked" })
    .eq("id", parsed.invitationId);

  if (updateError) throw new Error(updateError.message);

  const inviteClient = invite.clients as
    | { slug: string }
    | { slug: string }[]
    | null;
  const clientSlug = Array.isArray(inviteClient)
    ? inviteClient[0]?.slug ?? null
    : inviteClient?.slug ?? null;

  await logAudit(
    "invitation",
    parsed.invitationId,
    "revoke",
    { email: invite.email, clerk_invitation_id: invite.clerk_invitation_id },
    { status: "revoked" },
  );

  revalidateAccessManagementPaths({
    clientId: invite.client_id,
    clientSlug,
  });
}
