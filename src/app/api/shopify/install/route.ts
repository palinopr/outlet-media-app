import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { buildShopifyInstallUrl, normalizeShopDomain } from "@/lib/shopify-oauth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const shop = normalizeShopDomain(url.searchParams.get("shop"));
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!shop) {
    return NextResponse.redirect(`${appUrl}/connect-error?code=invalid_shop`);
  }

  const state = randomBytes(24).toString("base64url");
  const response = NextResponse.redirect(buildShopifyInstallUrl(shop, state));
  response.cookies.set("shopify_oauth_state", state, {
    httpOnly: true,
    maxAge: 10 * 60,
    path: "/api/shopify/oauth",
    sameSite: "lax",
    secure: appUrl.startsWith("https://"),
  });
  return response;
}
