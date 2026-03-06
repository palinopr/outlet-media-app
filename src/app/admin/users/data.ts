import { clerkClient } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { listActionableInvitations } from "@/features/invitations/server";

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string | null;
  client_slug: string | null;
  client_slugs: string[];
  created_at: string;
  /** "active" = signed-up user, "invited" = pending Clerk invitation */
  status: "active" | "invited";
}

export async function getUsers(): Promise<UserRow[]> {
  const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!clerkEnabled) return [];

  const client = await clerkClient();

  // Fetch all client_members to map clerk_user_id -> slugs
  const membershipMap = new Map<string, string[]>();
  if (supabaseAdmin) {
    const { data: memberships } = await supabaseAdmin
      .from("client_members")
      .select("clerk_user_id, clients(slug)");
    if (memberships) {
      for (const m of memberships) {
        const slug = (m.clients as unknown as { slug: string })?.slug;
        if (!slug) continue;
        const existing = membershipMap.get(m.clerk_user_id) ?? [];
        existing.push(slug);
        membershipMap.set(m.clerk_user_id, existing);
      }
    }
  }

  let userRows: UserRow[] = [];
  try {
    const { data: users } = await client.users.getUserList({ limit: 100 });
    userRows = users.map((u) => {
      const meta = (u.publicMetadata ?? {}) as {
        role?: string;
        client_slug?: string;
      };
      const slugs = membershipMap.get(u.id) ?? [];
      return {
        id: u.id,
        name: [u.firstName, u.lastName].filter(Boolean).join(" "),
        email: u.emailAddresses[0]?.emailAddress ?? "",
        role: meta.role ?? null,
        client_slug: meta.client_slug ?? null,
        client_slugs: slugs,
        created_at: new Date(u.createdAt).toISOString(),
        status: "active" as const,
      };
    });
  } catch (err) {
    console.error("Failed to fetch users from Clerk:", err);
  }

  let inviteRows: UserRow[] = [];
  try {
    const existingEmails = new Set(userRows.map((u) => u.email.toLowerCase()));
    const invitations = await listActionableInvitations({
      excludeEmails: [...existingEmails],
    });
    inviteRows = invitations.map((inv) => {
      return {
        id: inv.id,
        name: "",
        email: inv.email,
        role: inv.role,
        client_slug: inv.clientSlug,
        client_slugs: [],
        created_at: inv.createdAt,
        status: "invited" as const,
      };
    });
  } catch (err) {
    console.error("[users/data] Failed to fetch invitations from Clerk:", err);
  }

  return [...userRows, ...inviteRows];
}
