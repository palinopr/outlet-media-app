import { createHmac } from "node:crypto";
import { describe, expect, it, vi } from "vitest";

vi.stubEnv("SHOPIFY_CLIENT_ID", "client-id");
vi.stubEnv("SHOPIFY_CLIENT_SECRET", "client-secret");
vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://outletmedia.net");
vi.stubEnv("SHOPIFY_TOKEN_ENCRYPTION_KEY", "encryption-secret");

describe("shopify-oauth", () => {
  it("normalizes valid myshopify domains only", async () => {
    const { normalizeShopDomain } = await import("./shopify-oauth");

    expect(normalizeShopDomain("https://evwqpv-yh.myshopify.com/admin")).toBe("evwqpv-yh.myshopify.com");
    expect(normalizeShopDomain("angelhair.us")).toBeNull();
    expect(normalizeShopDomain("bad.myshopify.com.evil.com")).toBeNull();
  });

  it("builds an install URL with required OAuth parameters", async () => {
    const { buildShopifyInstallUrl } = await import("./shopify-oauth");

    const url = buildShopifyInstallUrl("evwqpv-yh.myshopify.com", "state-value");

    expect(url.origin).toBe("https://evwqpv-yh.myshopify.com");
    expect(url.pathname).toBe("/admin/oauth/authorize");
    expect(url.searchParams.get("client_id")).toBe("client-id");
    expect(url.searchParams.get("redirect_uri")).toBe("https://outletmedia.net/api/shopify/oauth/callback");
    expect(url.searchParams.get("state")).toBe("state-value");
    expect(url.searchParams.get("scope")).toContain("read_products");
  });

  it("verifies Shopify callback HMAC", async () => {
    const { verifyShopifyHmac } = await import("./shopify-oauth");
    const params = new URLSearchParams({
      code: "oauth-code",
      shop: "evwqpv-yh.myshopify.com",
      state: "state-value",
      timestamp: "1779404816",
    });
    const message = [...params.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    params.set("hmac", createHmac("sha256", "client-secret").update(message).digest("hex"));

    expect(verifyShopifyHmac(params)).toBe(true);

    params.set("code", "changed");
    expect(verifyShopifyHmac(params)).toBe(false);
  });

  it("encrypts and decrypts tokens", async () => {
    const { decryptShopifyToken, encryptShopifyToken } = await import("./shopify-oauth");

    const encrypted = encryptShopifyToken("shpat_token");

    expect(encrypted).not.toContain("shpat_token");
    expect(decryptShopifyToken(encrypted)).toBe("shpat_token");
  });
});
