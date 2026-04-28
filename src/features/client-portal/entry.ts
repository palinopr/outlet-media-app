import { supabaseAdmin } from "@/lib/supabase";
import { getMemberships, type MemberAccess } from "@/lib/member-access";

export interface PendingClientAccessInvite {
  clientId: string;
  clientRole: "owner" | "member";
  clientSlug: string | null;
  createdAt: string;
  email: string;
  id: string;
  status: "pending" | "expired";
}

export type ClientPortalEntry =
  | {
      destination: "/admin/dashboard";
      kind: "admin";
    }
  | {
      clientSlug: string;
      destination: string;
      kind: "portal";
      memberships: MemberAccess[];
    }
  | {
      destination: "/client";
      kind: "picker";
      memberships: MemberAccess[];
    }
  | {
      destination: "/client/pending";
      kind: "pending";
      pendingInvites: PendingClientAccessInvite[];
    };

export interface ResolveClientPortalEntryInput {
  emailAddresses: string[];
  inviteId?: string | null;
  preferredSlug?: string | null;
  role?: string | null;
  userId: string;
}

interface ResolveClientPortalEntryDeps {
  acceptClientAccessInvite: typeof acceptClientAccessInvite;
  acceptPendingClientAccessInvites: typeof acceptPendingClientAccessInvites;
  getMemberships: typeof getMemberships;
  listPendingClientAccessInvites: typeof listPendingClientAccessInvites;
}

const defaultDeps: ResolveClientPortalEntryDeps = {
  acceptClientAccessInvite,
  acceptPendingClientAccessInvites,
  getMemberships,
  listPendingClientAccessInvites,
};

export async function resolveClientPortalEntry(
  input: ResolveClientPortalEntryInput,
  deps: ResolveClientPortalEntryDeps = defaultDeps,
): Promise<ClientPortalEntry> {
  if (input.role === "admin") {
    return {
      destination: "/admin/dashboard",
      kind: "admin",
    };
  }

  if (input.inviteId) {
    await deps.acceptClientAccessInvite({
      emailAddresses: input.emailAddresses,
      inviteId: input.inviteId,
      userId: input.userId,
    });
  }

  await deps.acceptPendingClientAccessInvites({
    emailAddresses: input.emailAddresses,
    userId: input.userId,
  });

  const memberships = await deps.getMemberships(input.userId);

  if (input.preferredSlug) {
    const preferredMembership = memberships.find(
      (membership) => membership.clientSlug === input.preferredSlug,
    );

    if (preferredMembership) {
      return {
        clientSlug: preferredMembership.clientSlug,
        destination: `/client/${preferredMembership.clientSlug}`,
        kind: "portal",
        memberships,
      };
    }
  }

  if (memberships.length === 1) {
    return {
      clientSlug: memberships[0].clientSlug,
      destination: `/client/${memberships[0].clientSlug}`,
      kind: "portal",
      memberships,
    };
  }

  if (memberships.length > 1) {
    return {
      destination: "/client",
      kind: "picker",
      memberships,
    };
  }

  const pendingInvites = await deps.listPendingClientAccessInvites(input.emailAddresses);
  return {
    destination: "/client/pending",
    kind: "pending",
    pendingInvites,
  };
}

export async function listPendingClientAccessInvites(
  emailAddresses: string[],
): Promise<PendingClientAccessInvite[]> {
  if (!supabaseAdmin) return [];

  const normalizedEmails = normalizeEmails(emailAddresses);
  if (normalizedEmails.length === 0) return [];

  const { data, error } = await supabaseAdmin
    .from("client_access_invites")
    .select("id, client_id, email, client_role, status, created_at, clients(slug)")
    .in("email", normalizedEmails)
    .in("status", ["pending", "expired"]);

  if (error) {
    console.error("[client-portal/entry] failed to load pending client invites:", error.message);
    return [];
  }

  return ((data ?? []) as Array<{
    client_id: string;
    client_role: string;
    clients: { slug: string } | { slug: string }[] | null;
    created_at: string;
    email: string;
    id: string;
    status: string;
  }>).map((row) => ({
    clientId: row.client_id,
    clientRole: row.client_role === "owner" ? "owner" : "member",
    clientSlug: normalizeClientSlug(row.clients),
    createdAt: row.created_at,
    email: row.email,
    id: row.id,
    status: row.status === "expired" ? "expired" : "pending",
  }));
}

export async function acceptClientAccessInvite(input: {
  emailAddresses: string[];
  inviteId: string;
  userId: string;
}) {
  if (!supabaseAdmin) return null;

  const normalizedEmails = new Set(normalizeEmails(input.emailAddresses));
  if (normalizedEmails.size === 0) return null;

  const { data, error } = await supabaseAdmin
    .from("client_access_invites")
    .select(
      "id, client_id, email, client_role, status, accepted_by_clerk_user_id, clients(slug, name)",
    )
    .eq("id", input.inviteId)
    .maybeSingle();

  if (error) {
    console.error("[client-portal/entry] failed to load invite:", error.message);
    return null;
  }

  if (!data) return null;
  if (!normalizedEmails.has(data.email.toLowerCase())) return null;
  if (data.status === "revoked" || data.status === "expired") return null;

  const client = normalizeClient(data.clients);
  if (!client?.slug) return null;

  if (data.status === "accepted") {
    if (data.accepted_by_clerk_user_id === input.userId) {
      return {
        clientId: data.client_id,
        clientName: client.name,
        clientSlug: client.slug,
      };
    }
    return null;
  }

  const inviteRole = data.client_role === "owner" ? "owner" : "member";
  const { data: existingMembership, error: existingMembershipError } = await supabaseAdmin
    .from("client_members")
    .select("id, role")
    .eq("client_id", data.client_id)
    .eq("clerk_user_id", input.userId)
    .maybeSingle();

  if (existingMembershipError) {
    console.error(
      "[client-portal/entry] failed to load existing client membership:",
      existingMembershipError.message,
    );
    return null;
  }

  const membershipWrite = existingMembership
    ? supabaseAdmin
        .from("client_members")
        .update({ role: inviteRole })
        .eq("id", existingMembership.id)
    : supabaseAdmin
        .from("client_members")
        .insert({
          client_id: data.client_id,
          clerk_user_id: input.userId,
          role: inviteRole,
        });

  const { error: membershipError } = await membershipWrite;

  if (membershipError) {
    console.error("[client-portal/entry] failed to save client membership:", membershipError.message);
    return null;
  }

  const { error: updateError } = await supabaseAdmin
    .from("client_access_invites")
    .update({
      accepted_at: new Date().toISOString(),
      accepted_by_clerk_user_id: input.userId,
      status: "accepted",
    })
    .eq("id", input.inviteId);

  if (updateError) {
    console.error("[client-portal/entry] failed to mark invite accepted:", updateError.message);
    return null;
  }

  return {
    clientId: data.client_id,
    clientName: client.name,
    clientSlug: client.slug,
  };
}

export async function acceptPendingClientAccessInvites(input: {
  emailAddresses: string[];
  userId: string;
}) {
  if (!supabaseAdmin) return [];

  const normalizedEmails = normalizeEmails(input.emailAddresses);
  if (normalizedEmails.length === 0) return [];

  const { data, error } = await supabaseAdmin
    .from("client_access_invites")
    .select("id")
    .in("email", normalizedEmails)
    .eq("status", "pending")
    .is("revoked_at", null);

  if (error) {
    console.error("[client-portal/entry] failed to load pending invites for auto-accept:", error.message);
    return [];
  }

  const accepted = await Promise.all(
    (data ?? []).map((invite) =>
      acceptClientAccessInvite({
        emailAddresses: normalizedEmails,
        inviteId: invite.id,
        userId: input.userId,
      }),
    ),
  );

  return accepted.filter((invite): invite is NonNullable<typeof invite> => invite !== null);
}

export function getUserEmailAddresses(user: {
  emailAddresses?: Array<{ emailAddress?: string | null }> | null;
  primaryEmailAddress?: { emailAddress?: string | null } | null;
} | null) {
  const emails = new Set<string>();

  const primaryEmail = user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase();
  if (primaryEmail) emails.add(primaryEmail);

  for (const email of user?.emailAddresses ?? []) {
    const value = email.emailAddress?.trim().toLowerCase();
    if (value) emails.add(value);
  }

  return [...emails];
}

function normalizeEmails(emailAddresses: string[]) {
  return [...new Set(emailAddresses.map((email) => email.trim().toLowerCase()).filter(Boolean))];
}

function normalizeClientSlug(clients: { slug: string } | { slug: string }[] | null) {
  if (Array.isArray(clients)) return clients[0]?.slug ?? null;
  return clients?.slug ?? null;
}

function normalizeClient(
  clients: { slug: string; name?: string | null } | { slug: string; name?: string | null }[] | null,
) {
  if (Array.isArray(clients)) return clients[0] ?? null;
  return clients ?? null;
}
