import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { encrypt } from "@/lib/crypto";
import {
  exchangeCodeForToken,
  exchangeForLongLived,
  fetchAdAccounts,
} from "@/lib/meta-oauth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const stateB64 = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (error) {
    const errorDesc =
      url.searchParams.get("error_description") ?? "Permission denied";
    return NextResponse.redirect(
      `${appUrl}/client/connect-error?error=${encodeURIComponent(errorDesc)}`,
    );
  }

  if (!code || !stateB64) {
    return NextResponse.redirect(
      `${appUrl}/client/connect-error?error=missing_params`,
    );
  }

  const secret = process.env.META_APP_SECRET;
  if (!secret) {
    return NextResponse.redirect(
      `${appUrl}/client/connect-error?error=not_configured`,
    );
  }

  let userId: string;
  let slug: string;
  try {
    const stateRaw = Buffer.from(stateB64, "base64url").toString("utf8");
    const dotIndex = stateRaw.indexOf(".");
    const sig = stateRaw.slice(0, dotIndex);
    const payload = stateRaw.slice(dotIndex + 1);
    const expectedSig = createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    if (
      sig.length !== expectedSig.length ||
      !timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))
    ) {
      throw new Error("Invalid state signature");
    }

    const parsed = JSON.parse(payload);
    userId = parsed.userId;
    slug = parsed.slug;
  } catch {
    return NextResponse.redirect(
      `${appUrl}/client/connect-error?error=invalid_state`,
    );
  }

  try {
    const shortLived = await exchangeCodeForToken(code);
    const longLived = await exchangeForLongLived(shortLived.access_token);
    const adAccounts = await fetchAdAccounts(longLived.access_token);

    if (adAccounts.length === 0) {
      return NextResponse.redirect(
        `${appUrl}/client/${slug}/settings?error=no_ad_accounts`,
      );
    }

    if (adAccounts.length === 1) {
      const account = adAccounts[0];
      await storeAccount(userId, slug, longLived, account);
      return NextResponse.redirect(
        `${appUrl}/client/${slug}/settings?connected=${account.id}`,
      );
    }

    const response = NextResponse.redirect(
      `${appUrl}/client/${slug}/connect?accounts=${encodeURIComponent(JSON.stringify(adAccounts))}`,
    );
    response.cookies.set("meta_pending_token", encrypt(longLived.access_token), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 1800,
      path: "/",
    });
    response.cookies.set(
      "meta_pending_expires",
      String(longLived.expires_in),
      {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 1800,
        path: "/",
      },
    );
    return response;
  } catch (err) {
    console.error("OAuth callback error:", err);
    return NextResponse.redirect(
      `${appUrl}/client/${slug}/settings?error=oauth_failed`,
    );
  }
}

export async function storeAccount(
  clerkUserId: string,
  clientSlug: string,
  tokenData: { access_token: string; expires_in: number },
  account: { id: string; name: string },
) {
  if (!supabaseAdmin) throw new Error("Database not configured");

  const expiresAt = new Date(
    Date.now() + tokenData.expires_in * 1000,
  ).toISOString();

  const { error } = await supabaseAdmin.from("client_accounts").upsert(
    {
      clerk_user_id: clerkUserId,
      client_slug: clientSlug,
      meta_user_id: "",
      ad_account_id: account.id,
      ad_account_name: account.name,
      access_token_encrypted: encrypt(tokenData.access_token),
      token_expires_at: expiresAt,
      scopes: ["ads_management", "ads_read", "business_management"],
      status: "active",
      connected_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "ad_account_id" },
  );

  if (error) throw new Error(`Failed to store account: ${error.message}`);
}
