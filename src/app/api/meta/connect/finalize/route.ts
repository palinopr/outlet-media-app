import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { encrypt, decrypt } from "@/lib/crypto";
import { fetchAdAccounts } from "@/lib/meta-oauth";
import { z } from "zod/v4";
import { apiError, validateRequest } from "@/lib/api-helpers";

const FinalizeSchema = z.object({
  ad_account_id: z.string().min(1),
  slug: z.string().min(1),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return apiError("Unauthorized", 401);
  if (!supabaseAdmin) return apiError("Database not configured", 500);

  const { data, error: valErr } = await validateRequest(request, FinalizeSchema);
  if (valErr) return valErr;

  const cookieStore = await cookies();
  const pendingToken = cookieStore.get("meta_pending_token")?.value;
  const pendingExpires = cookieStore.get("meta_pending_expires")?.value;

  if (!pendingToken || !pendingExpires) {
    return apiError("Session expired, please reconnect", 400);
  }

  const token = decrypt(pendingToken);
  const expiresIn = parseInt(pendingExpires, 10);
  const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

  const adAccounts = await fetchAdAccounts(token);
  const account = adAccounts.find((a) => a.id === data.ad_account_id);
  if (!account) {
    return apiError("Ad account not found on your profile", 403);
  }

  const { error } = await supabaseAdmin.from("client_accounts").upsert(
    {
      clerk_user_id: userId,
      client_slug: data.slug,
      meta_user_id: "",
      ad_account_id: account.id,
      ad_account_name: account.name,
      access_token_encrypted: encrypt(token),
      token_expires_at: expiresAt,
      scopes: ["ads_management", "ads_read", "business_management"],
      status: "active",
      connected_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "ad_account_id" }
  );

  if (error) return apiError(`Failed to store account: ${error.message}`, 500);

  const response = NextResponse.json({ ok: true });
  response.cookies.delete("meta_pending_token");
  response.cookies.delete("meta_pending_expires");
  return response;
}
