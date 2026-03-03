import { clerkClient } from "@clerk/nextjs/server";

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string | null;
  client_slug: string | null;
  created_at: string;
  /** "active" = signed-up user, "invited" = pending Clerk invitation */
  status: "active" | "invited";
}

export async function getUsers(): Promise<UserRow[]> {
  const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!clerkEnabled) return [];

  const client = await clerkClient();

  let userRows: UserRow[] = [];
  try {
    const { data: users } = await client.users.getUserList({ limit: 100 });
    userRows = users.map((u) => {
      const meta = (u.publicMetadata ?? {}) as {
        role?: string;
        client_slug?: string;
      };
      return {
        id: u.id,
        name: [u.firstName, u.lastName].filter(Boolean).join(" "),
        email: u.emailAddresses[0]?.emailAddress ?? "",
        role: meta.role ?? null,
        client_slug: meta.client_slug ?? null,
        created_at: new Date(u.createdAt).toISOString(),
        status: "active" as const,
      };
    });
  } catch (err) {
    console.error("Failed to fetch users from Clerk:", err);
  }

  let inviteRows: UserRow[] = [];
  try {
    // Fetch all non-accepted invitations (pending, expired, revoked still block re-invite)
    const result = await client.invitations.getInvitationList();
    const allInvitations = result.data;
    console.log("[users/data] all invitations:", allInvitations.map((i) => ({ email: i.emailAddress, status: i.status })));
    const invitations = allInvitations.filter((i) => i.status === "pending" || i.status === "expired");
    console.log("[users/data] showing invitations count:", invitations.length);
    inviteRows = invitations.map((inv) => {
      const meta = (inv.publicMetadata ?? {}) as {
        role?: string;
        client_slug?: string;
      };
      return {
        id: inv.id,
        name: "",
        email: inv.emailAddress,
        role: meta.role ?? null,
        client_slug: meta.client_slug ?? null,
        created_at: new Date(inv.createdAt).toISOString(),
        status: "invited" as const,
      };
    });
  } catch (err) {
    console.error("[users/data] Failed to fetch invitations from Clerk:", err);
  }

  console.log("[users/data] returning", userRows.length, "users +", inviteRows.length, "invites");

  return [...userRows, ...inviteRows];
}
