import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { listActionableInvitations } from "@/features/invitations/server";

// ─── Connected Accounts ─────────────────────────────────────────────────────

export interface ConnectedAccount {
  id: string;
  ad_account_id: string;
  ad_account_name: string | null;
  status: string;
  connected_at: string;
  token_expires_at: string;
  last_used_at: string | null;
}

export async function getConnectedAccounts(
  clientSlug: string
): Promise<ConnectedAccount[]> {
  if (!supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from("client_accounts")
    .select(
      "id, ad_account_id, ad_account_name, status, connected_at, token_expires_at, last_used_at"
    )
    .eq("client_slug", clientSlug)
    .order("connected_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch connected accounts:", error.message);
    return [];
  }

  return (data ?? []) as ConnectedAccount[];
}

// ─── Team Members ────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface PendingInvite {
  id: string;
  email: string;
  createdAt: string;
  status: "pending" | "expired";
}

export interface SettingsData {
  clientId: string;
  clientName: string;
  connectedAccounts: ConnectedAccount[];
  slug: string;
  isOwner: boolean;
  members: TeamMember[];
  pendingInvites: PendingInvite[];
}

export async function getSettingsData(slug: string): Promise<SettingsData | null> {
  if (!supabaseAdmin) return null;

  const { userId } = await auth();
  if (!userId) return null;

  const { data: client } = await supabaseAdmin
    .from("clients")
    .select("id, name, slug")
    .eq("slug", slug)
    .single();
  if (!client) return null;

  const { data: members } = await supabaseAdmin
    .from("client_members")
    .select("id, clerk_user_id, role, created_at")
    .eq("client_id", client.id)
    .order("created_at");
  if (!members) return null;

  const currentMember = members.find((m) => m.clerk_user_id === userId);
  const isOwner = currentMember?.role === "owner";

  const clerk = await clerkClient();
  const teamMembers: TeamMember[] = await Promise.all(
    members.map(async (m) => {
      try {
        const user = await clerk.users.getUser(m.clerk_user_id);
        return {
          id: m.id,
          name: [user.firstName, user.lastName].filter(Boolean).join(" ") || "No name",
          email: user.emailAddresses[0]?.emailAddress ?? "",
          role: m.role,
          createdAt: m.created_at,
        };
      } catch {
        return { id: m.id, name: "Unknown", email: "", role: m.role, createdAt: m.created_at };
      }
    })
  );
  let pendingInvites: PendingInvite[] = [];
  try {
    pendingInvites = (await listActionableInvitations({ clientSlug: slug })).map((invite) => ({
      createdAt: invite.createdAt,
      email: invite.email,
      id: invite.id,
      status: invite.status,
    }));
  } catch (error) {
    console.error("[client/settings] Failed to fetch pending invites:", error);
  }
  const connectedAccounts = await getConnectedAccounts(slug);

  return {
    clientId: client.id,
    clientName: client.name,
    connectedAccounts,
    slug: client.slug,
    isOwner,
    members: teamMembers,
    pendingInvites,
  };
}
