"use server";

import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import { supabaseAdmin } from "@/lib/supabase";

const InviteTeamMemberSchema = z.object({
  email: z.string().email(),
  slug: z.string().min(1),
});

export async function inviteTeamMember(formData: { email: string; slug: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = InviteTeamMemberSchema.parse(formData);

  // Verify caller is an owner
  const { data: client } = await supabaseAdmin
    .from("clients")
    .select("id")
    .eq("slug", parsed.slug)
    .single();
  if (!client) throw new Error("Client not found");

  const { data: membership } = await supabaseAdmin
    .from("client_members")
    .select("role")
    .eq("client_id", client.id)
    .eq("clerk_user_id", userId)
    .single();
  if (membership?.role !== "owner") throw new Error("Only owners can invite team members");

  const clerk = await clerkClient();
  await clerk.invitations.createInvitation({
    emailAddress: parsed.email,
    publicMetadata: { client_slug: parsed.slug },
  });

  revalidatePath(`/client/${parsed.slug}/settings`);
}

const RemoveTeamMemberSchema = z.object({
  memberId: z.string().uuid(),
  slug: z.string().min(1),
});

export async function removeTeamMember(formData: { memberId: string; slug: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = RemoveTeamMemberSchema.parse(formData);

  const { data: client } = await supabaseAdmin
    .from("clients")
    .select("id")
    .eq("slug", parsed.slug)
    .single();
  if (!client) throw new Error("Client not found");

  // Verify caller is owner
  const { data: callerMembership } = await supabaseAdmin
    .from("client_members")
    .select("role")
    .eq("client_id", client.id)
    .eq("clerk_user_id", userId)
    .single();
  if (callerMembership?.role !== "owner") throw new Error("Only owners can remove members");

  // Get member being removed
  const { data: member } = await supabaseAdmin
    .from("client_members")
    .select("clerk_user_id, role")
    .eq("id", parsed.memberId)
    .single();
  if (!member) throw new Error("Member not found");
  if (member.role === "owner") throw new Error("Cannot remove an owner");

  await supabaseAdmin.from("client_members").delete().eq("id", parsed.memberId);

  // Clear Clerk metadata if no other memberships
  const { data: otherMemberships } = await supabaseAdmin
    .from("client_members")
    .select("id")
    .eq("clerk_user_id", member.clerk_user_id)
    .limit(1);

  if (!otherMemberships?.length) {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(member.clerk_user_id);
    const meta = (user.publicMetadata ?? {}) as Record<string, unknown>;
    delete meta.client_slug;
    await clerk.users.updateUserMetadata(member.clerk_user_id, { publicMetadata: meta });
  }

  revalidatePath(`/client/${parsed.slug}/settings`);
}

const RevokeTeamInviteSchema = z.object({
  invitationId: z.string().min(1),
  slug: z.string().min(1),
});

export async function revokeTeamInvite(formData: {
  invitationId: string;
  slug: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  if (!supabaseAdmin) throw new Error("DB not configured");

  const parsed = RevokeTeamInviteSchema.parse(formData);

  const { data: client } = await supabaseAdmin
    .from("clients")
    .select("id")
    .eq("slug", parsed.slug)
    .single();
  if (!client) throw new Error("Client not found");

  const { data: membership } = await supabaseAdmin
    .from("client_members")
    .select("role")
    .eq("client_id", client.id)
    .eq("clerk_user_id", userId)
    .single();
  if (membership?.role !== "owner") throw new Error("Only owners can revoke invites");

  const clerk = await clerkClient();
  await clerk.invitations.revokeInvitation(parsed.invitationId);

  revalidatePath(`/client/${parsed.slug}/settings`);
}
