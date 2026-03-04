"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import { clerkClient } from "@clerk/nextjs/server";
import { adminGuard } from "@/lib/api-helpers";
import { logAudit } from "./audit";

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
  revalidatePath("/admin/users");
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
  revalidatePath("/admin/users");

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
  revalidatePath("/admin/users");
}

const RevokeInvitationSchema = z.object({
  invitationId: z.string().min(1),
});

export async function revokeInvitation(formData: { invitationId: string }) {
  const err = await adminGuard();
  if (err) throw new Error("Forbidden");

  const parsed = RevokeInvitationSchema.parse(formData);
  const client = await clerkClient();

  // Find the target invitation's email, then revoke all revocable
  // invitations for that address so old pending/expired ones don't linger.
  // Only "pending" and "expired" can be revoked -- "accepted" cannot.
  const { data: allInvitations } = await client.invitations.getInvitationList();
  const target = allInvitations.find((i) => i.id === parsed.invitationId);
  const email = target?.emailAddress;

  if (email) {
    const revocable = allInvitations.filter(
      (i) => i.emailAddress.toLowerCase() === email.toLowerCase() && (i.status === "pending" || i.status === "expired")
    );
    await Promise.all(revocable.map((i) => client.invitations.revokeInvitation(i.id)));
    await logAudit("invitation", parsed.invitationId, "revoke_all", { email, count: revocable.length }, null);
  } else {
    await client.invitations.revokeInvitation(parsed.invitationId);
    await logAudit("invitation", parsed.invitationId, "revoke", null, null);
  }

  revalidatePath("/admin/users");
}
