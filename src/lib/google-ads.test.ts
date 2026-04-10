import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  GOOGLE_ADS_API_VERSION,
  GoogleAdsApiError,
  flattenGoogleAdsSearchStream,
  googleAdsSearchStream,
  googleAdsSearchStreamUrl,
  normalizeGoogleAdsCustomerId,
  refreshGoogleAdsAccessToken,
} from "./google-ads";

describe("normalizeGoogleAdsCustomerId", () => {
  it("strips resource prefixes and dashes", () => {
    expect(normalizeGoogleAdsCustomerId("customers/796-143-7935")).toBe("7961437935");
  });
});

describe("googleAdsSearchStreamUrl", () => {
  it("builds the searchStream endpoint for a customer", () => {
    expect(googleAdsSearchStreamUrl("796-143-7935")).toBe(
      `https://googleads.googleapis.com/${GOOGLE_ADS_API_VERSION}/customers/7961437935/googleAds:searchStream`,
    );
  });
});

describe("flattenGoogleAdsSearchStream", () => {
  it("flattens chunked rows and preserves metadata", () => {
    const result = flattenGoogleAdsSearchStream<Array<{ customer: { id: string } }>[number]>([
      {
        results: [{ customer: { id: "1" } }],
        fieldMask: "customer.id",
        requestId: "req-1",
        queryResourceConsumption: "82",
      },
      {
        results: [{ customer: { id: "2" } }],
      },
    ]);

    expect(result.rows).toEqual([
      { customer: { id: "1" } },
      { customer: { id: "2" } },
    ]);
    expect(result.fieldMask).toBe("customer.id");
    expect(result.requestId).toBe("req-1");
    expect(result.queryResourceConsumption).toBe(82);
  });
});

describe("refreshGoogleAdsAccessToken", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("refreshes an access token from OAuth", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({
        access_token: "token-123",
        expires_in: 3599,
        scope: "https://www.googleapis.com/auth/adwords",
        token_type: "Bearer",
        refresh_token_expires_in: 604800,
      })),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await refreshGoogleAdsAccessToken({
      developerToken: "dev-token",
      clientId: "client-id",
      clientSecret: "client-secret",
      refreshToken: "refresh-token",
      loginCustomerId: "7961437935",
      customerId: "7961437935",
      apiVersion: GOOGLE_ADS_API_VERSION,
    });

    expect(result.accessToken).toBe("token-123");
    expect(result.refreshTokenExpiresIn).toBe(604800);

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe("POST");
    expect(String(init.body)).toContain("grant_type=refresh_token");
    expect(String(init.body)).toContain("client_id=client-id");
  });

  it("throws GoogleAdsApiError when the refresh fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: () => Promise.resolve(JSON.stringify({
        error: "invalid_grant",
        error_description: "Bad refresh token",
      })),
    }));

    await expect(
      refreshGoogleAdsAccessToken({
        developerToken: "dev-token",
        clientId: "client-id",
        clientSecret: "client-secret",
        refreshToken: "refresh-token",
        loginCustomerId: "7961437935",
        customerId: "7961437935",
        apiVersion: GOOGLE_ADS_API_VERSION,
      }),
    ).rejects.toThrow(GoogleAdsApiError);
  });
});

describe("googleAdsSearchStream", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("posts the GAQL query and flattens rows", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify([
        {
          results: [{ customer: { id: "7961437935" } }],
          fieldMask: "customer.id",
          requestId: "req-123",
          queryResourceConsumption: "82",
        },
      ])),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await googleAdsSearchStream<{ customer: { id: string } }>(
      "SELECT customer.id FROM customer LIMIT 1",
      {
        accessToken: "access-token",
        developerToken: "dev-token",
        clientId: "client-id",
        clientSecret: "client-secret",
        refreshToken: "refresh-token",
        loginCustomerId: "796-143-7935",
        customerId: "796-143-7935",
        apiVersion: GOOGLE_ADS_API_VERSION,
      },
    );

    expect(result.rows).toEqual([{ customer: { id: "7961437935" } }]);
    expect(result.requestId).toBe("req-123");

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(
      `https://googleads.googleapis.com/${GOOGLE_ADS_API_VERSION}/customers/7961437935/googleAds:searchStream`,
    );
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>)["login-customer-id"]).toBe("7961437935");
    expect(init.body).toBe(JSON.stringify({ query: "SELECT customer.id FROM customer LIMIT 1" }));
  });
});
