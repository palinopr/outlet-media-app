import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const SHOPIFY_API_VERSION = process.env.SHOPIFY_ADMIN_API_VERSION ?? "2026-04";
export const SHOPIFY_DEFAULT_SCOPES = [
  "read_products",
  "read_orders",
  "read_themes",
  "write_themes",
  "read_content",
  "write_content",
] as const;

export type ShopifyTokenPayload = {
  access_token: string;
  scope?: string;
};

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} not configured`);
  return value;
}

export function getShopifyClientId() {
  return requireEnv("SHOPIFY_CLIENT_ID");
}

export function getShopifyClientSecret() {
  return requireEnv("SHOPIFY_CLIENT_SECRET");
}

export function getShopifyRedirectUri() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${appUrl.replace(/\/$/, "")}/api/shopify/oauth/callback`;
}

export function normalizeShopDomain(value: string | null) {
  if (!value) return null;
  const trimmed = value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(trimmed)) return null;
  return trimmed;
}

export function buildShopifyInstallUrl(shop: string, state: string, scopes = SHOPIFY_DEFAULT_SCOPES) {
  const url = new URL(`https://${shop}/admin/oauth/authorize`);
  url.searchParams.set("client_id", getShopifyClientId());
  url.searchParams.set("scope", scopes.join(","));
  url.searchParams.set("redirect_uri", getShopifyRedirectUri());
  url.searchParams.set("state", state);
  return url;
}

export function verifyShopifyHmac(searchParams: URLSearchParams, secret = getShopifyClientSecret()) {
  const received = searchParams.get("hmac");
  if (!received) return false;

  const message = [...searchParams.entries()]
    .filter(([key]) => key !== "hmac" && key !== "signature")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const expected = createHmac("sha256", secret).update(message).digest("hex");
  const receivedBuffer = Buffer.from(received, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer);
}

function encryptionKey() {
  const source = process.env.SHOPIFY_TOKEN_ENCRYPTION_KEY ?? process.env.INGEST_SECRET;
  if (!source) throw new Error("SHOPIFY_TOKEN_ENCRYPTION_KEY or INGEST_SECRET not configured");
  return createHash("sha256").update(source).digest();
}

export function encryptShopifyToken(token: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `v1.${iv.toString("base64url")}.${authTag.toString("base64url")}.${encrypted.toString("base64url")}`;
}

export function decryptShopifyToken(payload: string) {
  const [version, ivRaw, tagRaw, encryptedRaw] = payload.split(".");
  if (version !== "v1" || !ivRaw || !tagRaw || !encryptedRaw) throw new Error("Invalid encrypted token payload");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(ivRaw, "base64url"));
  decipher.setAuthTag(Buffer.from(tagRaw, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedRaw, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

export async function exchangeShopifyCode(shop: string, code: string): Promise<ShopifyTokenPayload> {
  const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
    body: JSON.stringify({
      client_id: getShopifyClientId(),
      client_secret: getShopifyClientSecret(),
      code,
    }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Shopify token exchange failed: ${response.status} ${text.slice(0, 200)}`);
  }

  return response.json() as Promise<ShopifyTokenPayload>;
}

export function parseShopifyScopes(scope: string | undefined) {
  if (!scope) return [];
  return scope.split(",").map((value) => value.trim()).filter(Boolean);
}
