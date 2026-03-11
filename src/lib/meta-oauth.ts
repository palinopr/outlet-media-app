import { createHmac, timingSafeEqual } from "node:crypto";
import { META_API_VERSION } from "./constants";

const SCOPES = "ads_management,ads_read,business_management";
export const REQUESTED_META_SCOPES = SCOPES.split(",");

function getAppId(): string {
  const id = process.env.META_APP_ID;
  if (!id) throw new Error("META_APP_ID not configured");
  return id;
}

function getAppSecret(): string {
  const secret = process.env.META_APP_SECRET;
  if (!secret) throw new Error("META_APP_SECRET not configured");
  return secret;
}

function getRedirectUri(): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}/api/meta/callback`;
}

export function buildAuthUrl(state: string): string {
  const configId = process.env.META_FACEBOOK_LOGIN_CONFIG_ID?.trim();
  const params = new URLSearchParams({
    client_id: getAppId(),
    redirect_uri: getRedirectUri(),
    state,
    response_type: "code",
  });

  if (configId) {
    // Meta recommends Facebook Login for Business for agency-style business integrations.
    params.set("config_id", configId);
  } else {
    params.set("scope", SCOPES);
  }

  return `https://www.facebook.com/${META_API_VERSION}/dialog/oauth?${params}`;
}

export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string;
  expires_in: number;
}> {
  const params = new URLSearchParams({
    client_id: getAppId(),
    client_secret: getAppSecret(),
    redirect_uri: getRedirectUri(),
    code,
  });
  const res = await fetch(
    `https://graph.facebook.com/${META_API_VERSION}/oauth/access_token?${params}`
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `Token exchange failed: ${err.error?.message ?? res.statusText}`
    );
  }
  return res.json();
}

export async function exchangeForLongLived(shortToken: string): Promise<{
  access_token: string;
  expires_in: number;
}> {
  const params = new URLSearchParams({
    grant_type: "fb_exchange_token",
    client_id: getAppId(),
    client_secret: getAppSecret(),
    fb_exchange_token: shortToken,
  });
  const res = await fetch(
    `https://graph.facebook.com/${META_API_VERSION}/oauth/access_token?${params}`
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `Long-lived token exchange failed: ${err.error?.message ?? res.statusText}`
    );
  }
  return res.json();
}

export async function fetchAdAccounts(
  token: string
): Promise<Array<{ id: string; name: string; account_status: number }>> {
  const res = await fetch(
    `https://graph.facebook.com/${META_API_VERSION}/me/adaccounts?fields=id,name,account_status`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `Failed to fetch ad accounts: ${err.error?.message ?? res.statusText}`
    );
  }
  const data = await res.json();
  return data.data ?? [];
}

export async function fetchMetaUserProfile(token: string): Promise<{
  id: string;
  name?: string;
}> {
  const res = await fetch(
    `https://graph.facebook.com/${META_API_VERSION}/me?fields=id,name`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `Failed to fetch Meta user: ${err.error?.message ?? res.statusText}`
    );
  }
  return res.json();
}

export async function revokeToken(token: string): Promise<void> {
  const res = await fetch(
    `https://graph.facebook.com/${META_API_VERSION}/me/permissions`,
    { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `Token revocation failed: ${err.error?.message ?? res.statusText}`
    );
  }
}

export function verifySignedRequest(signedRequest: string): {
  user_id: string;
  algorithm: string;
  issued_at: number;
} {
  const [encodedSig, encodedPayload] = signedRequest.split(".");
  if (!encodedSig || !encodedPayload) {
    throw new Error("Invalid signed_request format");
  }
  const expectedSig = createHmac("sha256", getAppSecret())
    .update(encodedPayload)
    .digest();
  const actualSig = Buffer.from(encodedSig, "base64url");
  if (
    actualSig.length !== expectedSig.length ||
    !timingSafeEqual(actualSig, expectedSig)
  ) {
    throw new Error("Invalid signed_request signature");
  }
  return JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
}
