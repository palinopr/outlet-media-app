import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

export const TIKTOK_API_VERSION = "v1.3";
export const TIKTOK_API_BASE_URL = "https://business-api.tiktok.com/open_api";

export type TikTokTokenPayload = {
  access_token: string;
  advertiser_ids?: string[];
  advertiser_id?: string;
  expires_in?: number;
  open_id?: string;
  refresh_token?: string;
  refresh_token_expires_in?: number;
  scope?: string | string[];
  scopes?: string | string[];
};

export type TikTokAdvertiser = {
  advertiser_id: string;
  advertiser_name?: string;
  advertiser_role?: string;
  display_name?: string;
  name?: string;
};

type TikTokApiResponse<T> = {
  code?: number;
  message?: string;
  msg?: string;
  data?: T;
};

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} not configured`);
  return value;
}

export function getTikTokAppId() {
  return requireEnv("TIKTOK_APP_ID");
}

export function getTikTokAppSecret() {
  return requireEnv("TIKTOK_APP_SECRET");
}

export function getTikTokRedirectUri() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${appUrl.replace(/\/$/, "")}/api/tiktok/oauth/callback`;
}

function encryptionKey() {
  const source = process.env.TIKTOK_TOKEN_ENCRYPTION_KEY ?? process.env.INGEST_SECRET;
  if (!source) throw new Error("TIKTOK_TOKEN_ENCRYPTION_KEY or INGEST_SECRET not configured");
  return createHash("sha256").update(source).digest();
}

export function encryptTikTokToken(token: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `v1.${iv.toString("base64url")}.${authTag.toString("base64url")}.${encrypted.toString("base64url")}`;
}

export function decryptTikTokToken(payload: string) {
  const [version, ivRaw, tagRaw, encryptedRaw] = payload.split(".");
  if (version !== "v1" || !ivRaw || !tagRaw || !encryptedRaw) throw new Error("Invalid encrypted token payload");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(ivRaw, "base64url"));
  decipher.setAuthTag(Buffer.from(tagRaw, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedRaw, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

function parseTikTokResponse<T>(payload: TikTokApiResponse<T>, label: string): T {
  if (payload.code && payload.code !== 0) {
    throw new Error(`${label} failed: ${payload.message ?? payload.msg ?? `code ${payload.code}`}`);
  }
  if (!payload.data) throw new Error(`${label} returned no data`);
  return payload.data;
}

export async function exchangeTikTokAuthCode(authCode: string): Promise<TikTokTokenPayload> {
  const response = await fetch(`${TIKTOK_API_BASE_URL}/${TIKTOK_API_VERSION}/oauth2/access_token/`, {
    body: JSON.stringify({
      app_id: getTikTokAppId(),
      auth_code: authCode,
      secret: getTikTokAppSecret(),
    }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`TikTok token exchange failed: ${response.status} ${text.slice(0, 200)}`);
  }

  return parseTikTokResponse<TikTokTokenPayload>(
    JSON.parse(text) as TikTokApiResponse<TikTokTokenPayload>,
    "TikTok token exchange",
  );
}

export async function fetchTikTokAdvertisers(accessToken: string): Promise<TikTokAdvertiser[]> {
  const url = new URL(`${TIKTOK_API_BASE_URL}/${TIKTOK_API_VERSION}/oauth2/advertiser/get/`);
  url.searchParams.set("app_id", getTikTokAppId());
  url.searchParams.set("secret", getTikTokAppSecret());

  const response = await fetch(url, {
    headers: { "Access-Token": accessToken },
    method: "GET",
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`TikTok advertiser lookup failed: ${response.status} ${text.slice(0, 200)}`);
  }

  const data = parseTikTokResponse<{ list?: TikTokAdvertiser[] }>(
    JSON.parse(text) as TikTokApiResponse<{ list?: TikTokAdvertiser[] }>,
    "TikTok advertiser lookup",
  );
  return data.list ?? [];
}

export function parseTikTokScopes(value: string | string[] | undefined) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => item.trim()).filter(Boolean);
  return value.split(/[,\s]+/).map((item) => item.trim()).filter(Boolean);
}

export function tokenExpiresAt(expiresInSeconds: number | undefined, now = new Date()) {
  if (!expiresInSeconds || expiresInSeconds <= 0) return null;
  return new Date(now.getTime() + expiresInSeconds * 1000).toISOString();
}
