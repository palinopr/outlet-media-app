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
    const result = await client.invitations.getInvitationList();
    const existingEmails = new Set(userRows.map((u) => u.email.toLowerCase()));
    // Show pending/expired invites, plus "accepted" invites where the user
    // never finished sign-up (no matching user account exists)
    // Prefer pending > expired > accepted (incomplete sign-up).
    // Deduplicate by email -- keep the most actionable invitation per address.
    const bestByEmail = new Map<string, (typeof result.data)[number]>();
    const priority: Record<string, number> = { pending: 3, expired: 2, accepted: 1 };
    for (const inv of result.data) {
      const email = inv.emailAddress.toLowerCase();
      if (existingEmails.has(email)) continue; // user already signed up
      if (inv.status === "revoked") continue;
      const existing = bestByEmail.get(email);
      if (!existing || (priority[inv.status] ?? 0) > (priority[existing.status] ?? 0)) {
        bestByEmail.set(email, inv);
      }
    }
    const invitations = [...bestByEmail.values()];
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

  return [...userRows, ...inviteRows];
}
