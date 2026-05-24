import { describe, expect, it, vi } from "vitest";

vi.stubEnv("SHOPIFY_CLIENT_ID", "client-id");
vi.stubEnv("SHOPIFY_CLIENT_SECRET", "client-secret");
vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://outletmedia.net");

describe("GET /api/shopify/install", () => {
  it("redirects invalid shops to connect error", async () => {
    const { GET } = await import("./route");

    const response = await GET(new Request("https://outletmedia.net/api/shopify/install?shop=angelhair.us"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://outletmedia.net/connect-error?code=invalid_shop");
  });

  it("redirects valid shops to Shopify OAuth and sets state cookie", async () => {
    const { GET } = await import("./route");

    const response = await GET(new Request("https://outletmedia.net/api/shopify/install?shop=evwqpv-yh.myshopify.com"));
    const location = response.headers.get("location");

    expect(response.status).toBe(307);
    expect(location).toContain("https://evwqpv-yh.myshopify.com/admin/oauth/authorize");
    expect(location).toContain("client_id=client-id");
    expect(response.headers.get("set-cookie")).toContain("shopify_oauth_state=");
  });
});
