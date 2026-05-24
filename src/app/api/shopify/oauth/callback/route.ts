import { NextResponse } from "next/server";
import {
  encryptShopifyToken,
  exchangeShopifyCode,
  normalizeShopDomain,
  parseShopifyScopes,
  verifyShopifyHmac,
} from "@/lib/shopify-oauth";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

function redirectError(code: string, detail?: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const url = new URL("/connect-error", appUrl);
  url.searchParams.set("code", code);
  if (detail) url.searchParams.set("error", detail);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  if (error) return redirectError(error, url.searchParams.get("error_description") ?? undefined);

  const shop = normalizeShopDomain(url.searchParams.get("shop"));
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const stateCookie = request.headers.get("cookie")?.match(/(?:^|;\s*)shopify_oauth_state=([^;]+)/)?.[1];

  if (!shop || !code || !state) return redirectError("missing_shopify_oauth_params");
  if (!stateCookie || stateCookie !== state) return redirectError("invalid_shopify_oauth_state");
  if (!verifyShopifyHmac(url.searchParams)) return redirectError("invalid_shopify_hmac");
  if (!supabaseAdmin) return redirectError("database_not_configured");

  try {
    const tokenPayload = await exchangeShopifyCode(shop, code);
    const { error: upsertError } = await supabaseAdmin
      .from("shopify_connections")
      .upsert(
        {
          access_token_encrypted: encryptShopifyToken(tokenPayload.access_token),
          connected_at: new Date().toISOString(),
          scopes: parseShopifyScopes(tokenPayload.scope),
          shop_domain: shop,
          status: "active",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "shop_domain" },
      );

    if (upsertError) throw upsertError;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const response = NextResponse.redirect(`${appUrl}/admin?shopify=connected&shop=${encodeURIComponent(shop)}`);
    response.cookies.delete("shopify_oauth_state");
    return response;
  } catch (caught) {
    console.error("[shopify-oauth] callback failed:", caught);
    return redirectError("shopify_oauth_failed");
  }
}
