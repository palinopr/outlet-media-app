import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/api-helpers";
import { getTikTokAppId, getTikTokRedirectUri } from "@/lib/tiktok-oauth";

export const runtime = "nodejs";

const TIKTOK_AUTH_URL = "https://business-api.tiktok.com/portal/auth";

function redirectError(code: string, detail?: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const url = new URL("/connect-error", appUrl);
  url.searchParams.set("code", code);
  if (detail) url.searchParams.set("error", detail);
  return NextResponse.redirect(url);
}

export async function GET() {
  const adminErr = await adminGuard();
  if (adminErr) return adminErr;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const state = randomBytes(24).toString("base64url");
    const authUrl = new URL(TIKTOK_AUTH_URL);
    authUrl.searchParams.set("app_id", getTikTokAppId());
    authUrl.searchParams.set("redirect_uri", getTikTokRedirectUri());
    authUrl.searchParams.set("state", state);

    const response = NextResponse.redirect(authUrl);
    response.cookies.set("tiktok_oauth_state", state, {
      httpOnly: true,
      maxAge: 10 * 60,
      path: "/api/tiktok/oauth",
      sameSite: "lax",
      secure: appUrl.startsWith("https://"),
    });
    return response;
  } catch (caught) {
    const detail = caught instanceof Error ? caught.message : "TikTok OAuth setup failed";
    return redirectError("tiktok_oauth_not_configured", detail);
  }
}
