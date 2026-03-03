import { NextResponse } from "next/server";
import { authGuard, apiError, parseJsonBody } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";
import { decrypt } from "@/lib/crypto";
import { revokeToken } from "@/lib/meta-oauth";
import { z } from "zod/v4";

const DisconnectSchema = z.object({
  ad_account_id: z.string().min(1),
});

export async function POST(request: Request) {
  const { userId, error: authErr } = await authGuard();
  if (authErr) return authErr;
  if (!supabaseAdmin) return apiError("Database not configured", 500);

  const raw = await parseJsonBody<unknown>(request);
  if (raw instanceof Response) return raw;

  const parsed = DisconnectSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid payload",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { data: account, error: fetchErr } = await supabaseAdmin
    .from("client_accounts")
    .select("access_token_encrypted, status")
    .eq("clerk_user_id", userId)
    .eq("ad_account_id", parsed.data.ad_account_id)
    .single();

  if (fetchErr || !account) {
    return apiError("Account not found", 404);
  }

  try {
    const token = decrypt(account.access_token_encrypted);
    await revokeToken(token);
  } catch {
    // Token may already be invalid; continue with local cleanup
  }

  const { error: updateErr } = await supabaseAdmin
    .from("client_accounts")
    .update({ status: "revoked", updated_at: new Date().toISOString() })
    .eq("clerk_user_id", userId)
    .eq("ad_account_id", parsed.data.ad_account_id);

  if (updateErr) return apiError("Failed to disconnect", 500);

  return NextResponse.json({ ok: true });
}
