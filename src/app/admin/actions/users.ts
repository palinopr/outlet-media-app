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

  await client.invitations.revokeInvitation(parsed.invitationId);

  await logAudit("invitation", parsed.invitationId, "revoke", null, null);
  revalidatePath("/admin/users");
}
