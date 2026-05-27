import { NextResponse } from "next/server";
import {
  encryptTikTokToken,
  exchangeTikTokAuthCode,
  fetchTikTokAdvertisers,
  parseTikTokScopes,
  tokenExpiresAt,
  type TikTokAdvertiser,
} from "@/lib/tiktok-oauth";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

function redirectError(code: string, detail?: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const url = new URL("/connect-error", appUrl);
  url.searchParams.set("code", code);
  if (detail) url.searchParams.set("error", detail);
  return NextResponse.redirect(url);
}

function redirectConnected(advertiserId?: string | null) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const url = new URL("/admin", appUrl);
  url.searchParams.set("tiktok", "connected");
  if (advertiserId) url.searchParams.set("advertiser_id", advertiserId);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  if (error) return redirectError(error, url.searchParams.get("error_description") ?? undefined);

  const authCode = url.searchParams.get("auth_code") ?? url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const stateCookie = request.headers.get("cookie")?.match(/(?:^|;\s*)tiktok_oauth_state=([^;]+)/)?.[1];
  if (!authCode) return redirectError("missing_tiktok_oauth_code");
  if (!state || !stateCookie || stateCookie !== state) return redirectError("invalid_tiktok_oauth_state");
  if (!supabaseAdmin) return redirectError("database_not_configured");

  try {
    const tokenPayload = await exchangeTikTokAuthCode(authCode);
    const advertisers = await fetchTikTokAdvertisers(tokenPayload.access_token);
    const tokenAdvertiserIds = [
      ...(tokenPayload.advertiser_ids ?? []),
      ...(tokenPayload.advertiser_id ? [tokenPayload.advertiser_id] : []),
    ];
    const fallbackAdvertisers: TikTokAdvertiser[] = tokenAdvertiserIds.map((advertiserId) => ({ advertiser_id: advertiserId }));
    const effectiveAdvertisers = advertisers.length > 0 ? advertisers : fallbackAdvertisers;
    if (effectiveAdvertisers.length === 0) return redirectError("no_tiktok_advertisers");

    const now = new Date().toISOString();
    const scopes = parseTikTokScopes(tokenPayload.scope ?? tokenPayload.scopes);
    const tokenExpires = tokenExpiresAt(tokenPayload.expires_in);
    const refreshTokenExpires = tokenExpiresAt(tokenPayload.refresh_token_expires_in);

    const rows = effectiveAdvertisers.map((advertiser) => ({
      access_token_encrypted: encryptTikTokToken(tokenPayload.access_token),
      advertiser_id: advertiser.advertiser_id,
      advertiser_name: advertiser.advertiser_name ?? advertiser.display_name ?? advertiser.name ?? null,
      connected_at: now,
      open_id: tokenPayload.open_id ?? null,
      refresh_token_encrypted: tokenPayload.refresh_token
        ? encryptTikTokToken(tokenPayload.refresh_token)
        : null,
      refresh_token_expires_at: refreshTokenExpires,
      scopes,
      status: "active",
      token_expires_at: tokenExpires,
      updated_at: now,
    }));

    const { error: upsertError } = await supabaseAdmin
      .from("tiktok_connections")
      .upsert(rows, { onConflict: "advertiser_id" });

    if (upsertError) throw upsertError;

    const response = redirectConnected(rows[0]?.advertiser_id);
    response.cookies.delete("tiktok_oauth_state");
    return response;
  } catch (caught) {
    console.error("[tiktok-oauth] callback failed:", caught);
    return redirectError("tiktok_oauth_failed");
  }
}
