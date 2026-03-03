import { supabaseAdmin } from "@/lib/supabase";

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
  clerkUserId: string,
  clientSlug: string
): Promise<ConnectedAccount[]> {
  if (!supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from("client_accounts")
    .select(
      "id, ad_account_id, ad_account_name, status, connected_at, token_expires_at, last_used_at"
    )
    .eq("clerk_user_id", clerkUserId)
    .eq("client_slug", clientSlug)
    .order("connected_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch connected accounts:", error.message);
    return [];
  }

  return (data ?? []) as ConnectedAccount[];
}
