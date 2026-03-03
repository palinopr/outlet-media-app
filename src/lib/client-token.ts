import { supabaseAdmin } from "./supabase";
import { decrypt } from "./crypto";

export async function getClientToken(
  clientSlug: string,
  adAccountId: string
): Promise<string | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from("client_accounts")
    .select("access_token_encrypted")
    .eq("client_slug", clientSlug)
    .eq("ad_account_id", adAccountId)
    .eq("status", "active")
    .single();

  if (error || !data) return null;

  try {
    return decrypt(data.access_token_encrypted);
  } catch {
    console.error(`Failed to decrypt token for ${adAccountId}`);
    return null;
  }
}

export async function getActiveAccountsForSlug(
  clientSlug: string
): Promise<Array<{ ad_account_id: string; ad_account_name: string | null }>> {
  if (!supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from("client_accounts")
    .select("ad_account_id, ad_account_name")
    .eq("client_slug", clientSlug)
    .eq("status", "active");

  if (error || !data) return [];
  return data;
}
