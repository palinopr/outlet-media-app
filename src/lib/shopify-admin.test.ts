import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ShopifyAdminApiError,
  getShopifyAdminCredentials,
  shopifyAdminGraphql,
} from "./shopify-admin";

describe("getShopifyAdminCredentials", () => {
  beforeEach(() => {
    delete process.env.SHOPIFY_STORE_DOMAIN;
    delete process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    delete process.env.SHOPIFY_ADMIN_API_VERSION;
  });

  it("reads Shopify credentials from env", () => {
    process.env.SHOPIFY_STORE_DOMAIN = "example-store.myshopify.com";
    process.env.SHOPIFY_ADMIN_ACCESS_TOKEN = "token_123";
    process.env.SHOPIFY_ADMIN_API_VERSION = "2026-04";

    expect(getShopifyAdminCredentials()).toEqual({
      storeDomain: "example-store.myshopify.com",
      accessToken: "token_123",
      apiVersion: "2026-04",
    });
  });

  it("throws when required env is missing", () => {
    expect(() => getShopifyAdminCredentials()).toThrow("Missing Shopify configuration");
  });
});

describe("shopifyAdminGraphql", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("posts a graphql query and returns the data payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          data: {
            shop: { name: "Example" },
          },
        }),
      }),
    );

    const result = await shopifyAdminGraphql<{ shop: { name: string } }>({
      credentials: {
        storeDomain: "example-store.myshopify.com",
        accessToken: "token_123",
        apiVersion: "2026-04",
      },
      query: "query { shop { name } }",
    });

    expect(result).toEqual({
      shop: { name: "Example" },
    });
  });

  it("throws ShopifyAdminApiError when graphql returns top-level errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          errors: [{ message: "Access denied" }],
        }),
      }),
    );

    await expect(
      shopifyAdminGraphql({
        credentials: {
          storeDomain: "example-store.myshopify.com",
          accessToken: "token_123",
          apiVersion: "2026-04",
        },
        query: "query { shop { name } }",
      }),
    ).rejects.toBeInstanceOf(ShopifyAdminApiError);
  });
});
