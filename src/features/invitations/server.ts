import { clerkClient } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { compareActionableInvitationState } from "./sort";
import type { ActionableInvitation, ActionableInvitationStatus } from "./types";

interface ClientAccessInviteLike {
  clerkInvitationId?: string | null;
  clerkStatus?: string | null;
  clientId?: string | null;
  clientRole?: string | null;
  clientSlug?: string | null;
  createdAt: string;
  email: string;
  id: string;
  role?: string | null;
  status: string;
}

interface ListActionableInvitationsOptions {
  clientId?: string;
  clientSlug?: string;
  excludeEmails?: string[];
}

export function buildActionableInvitations(
  invitations: ClientAccessInviteLike[],
  options: ListActionableInvitationsOptions = {},
): ActionableInvitation[] {
  const excluded = new Set((options.excludeEmails ?? []).map((email) => email.toLowerCase()));
  return invitations
    .filter((invitation) => {
      const email = invitation.email.toLowerCase();
      if (excluded.has(email)) return false;
      if (options.clientId && invitation.clientId !== options.clientId) return false;
      if (options.clientSlug && invitation.clientSlug !== options.clientSlug) return false;
      return true;
    })
    .map((invitation) => {
      const status = toActionableInvitationStatus(
        invitation.status,
        invitation.clerkStatus,
      );

      if (!status) return null;

      return {
        clientRole: invitation.clientRole ?? null,
        clientSlug: invitation.clientSlug ?? null,
        createdAt: invitation.createdAt,
        email: invitation.email,
        id: invitation.id,
        role: invitation.role ?? null,
        status,
      } satisfies ActionableInvitation;
    })
    .filter((invitation): invitation is ActionableInvitation => invitation !== null)
    .sort((left, right) =>
      compareActionableInvitationState(
        left.status as ActionableInvitationStatus,
        left.createdAt,
        right.status as ActionableInvitationStatus,
        right.createdAt,
      ),
    );
}

export async function listActionableInvitations(
  options: ListActionableInvitationsOptions = {},
) {
  if (!supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from("client_access_invites")
    .select("id, client_id, email, client_role, status, clerk_invitation_id, created_at, clients(slug)")
    .in("status", ["pending", "expired"]);

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as Array<{
    id: string;
    client_id: string;
    email: string;
    client_role: string;
    status: string;
    clerk_invitation_id: string | null;
    created_at: string;
    clients: { slug: string } | { slug: string }[] | null;
  }>;

  const clerkIds = rows
    .map((row) => row.clerk_invitation_id)
    .filter((value): value is string => typeof value === "string" && value.length > 0);

  const clerkStatuses = new Map<string, string>();
  if (clerkIds.length > 0) {
    const clerk = await clerkClient();
    const invitations = await clerk.invitations.getInvitationList({ limit: 100 });
    for (const invitation of invitations.data as Array<{ id: string; status: string }>) {
      if (clerkIds.includes(invitation.id)) {
        clerkStatuses.set(invitation.id, invitation.status);
      }
    }
  }

  return buildActionableInvitations(
    rows.map((row) => ({
      clerkInvitationId: row.clerk_invitation_id,
      clerkStatus: row.clerk_invitation_id ? clerkStatuses.get(row.clerk_invitation_id) ?? null : null,
      clientId: row.client_id,
      clientRole: row.client_role,
      clientSlug: normalizeClientSlug(row.clients),
      createdAt: row.created_at,
      email: row.email,
      id: row.id,
      role: null,
      status: row.status,
    })),
    options,
  );
}

function toActionableInvitationStatus(
  storedStatus: string,
  clerkStatus?: string | null,
): ActionableInvitationStatus | null {
  const effectiveStatus = clerkStatus ?? storedStatus;
  if (effectiveStatus === "accepted" || effectiveStatus === "revoked") return null;
  if (effectiveStatus === "expired") return "expired";
  if (effectiveStatus === "pending") return "pending";
  return null;
}

function normalizeClientSlug(
  clients: { slug: string } | { slug: string }[] | null,
) {
  if (Array.isArray(clients)) return clients[0]?.slug ?? null;
  return clients?.slug ?? null;
}
