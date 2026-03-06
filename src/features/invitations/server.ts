import { clerkClient } from "@clerk/nextjs/server";

export type ActionableInvitationStatus = "pending" | "expired";

export interface ActionableInvitation {
  clientRole: string | null;
  clientSlug: string | null;
  createdAt: string;
  email: string;
  id: string;
  role: string | null;
  status: ActionableInvitationStatus;
}

interface InvitationLike {
  createdAt: number;
  emailAddress: string;
  id: string;
  publicMetadata?: {
    client_role?: string;
    client_slug?: string;
    role?: string;
  } | null;
  status: string;
}

interface ListActionableInvitationsOptions {
  clientSlug?: string;
  excludeEmails?: string[];
}

export function buildActionableInvitations(
  invitations: InvitationLike[],
  options: ListActionableInvitationsOptions = {},
): ActionableInvitation[] {
  const excluded = new Set((options.excludeEmails ?? []).map((email) => email.toLowerCase()));
  const bestByEmail = new Map<string, InvitationLike>();

  for (const invitation of invitations) {
    const email = invitation.emailAddress.toLowerCase();
    if (excluded.has(email)) continue;
    if (invitation.status !== "pending" && invitation.status !== "expired") continue;

    const metadata = invitation.publicMetadata ?? {};
    if (options.clientSlug && metadata.client_slug !== options.clientSlug) continue;

    const existing = bestByEmail.get(email);
    if (
      !existing ||
      (invitation.status === "pending" && existing.status !== "pending") ||
      (invitation.status === existing.status && invitation.createdAt > existing.createdAt)
    ) {
      bestByEmail.set(email, invitation);
    }
  }

  return [...bestByEmail.values()]
    .sort((left, right) => right.createdAt - left.createdAt)
    .map((invitation) => {
      const metadata = invitation.publicMetadata ?? {};
      return {
        clientRole: metadata.client_role ?? null,
        clientSlug: metadata.client_slug ?? null,
        createdAt: new Date(invitation.createdAt).toISOString(),
        email: invitation.emailAddress,
        id: invitation.id,
        role: metadata.role ?? null,
        status: invitation.status as ActionableInvitationStatus,
      };
    });
}

export async function listActionableInvitations(
  options: ListActionableInvitationsOptions = {},
) {
  const clerk = await clerkClient();
  const invitations = await clerk.invitations.getInvitationList();
  return buildActionableInvitations(invitations.data as InvitationLike[], options);
}
