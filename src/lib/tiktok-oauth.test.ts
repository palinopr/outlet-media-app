import { describe, expect, it, vi } from "vitest";

vi.stubEnv("TIKTOK_APP_ID", "app-id");
vi.stubEnv("TIKTOK_APP_SECRET", "app-secret");
vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://outletmedia.net");
vi.stubEnv("TIKTOK_TOKEN_ENCRYPTION_KEY", "encryption-secret");

describe("tiktok-oauth", () => {
  it("builds the registered callback URL", async () => {
    const { getTikTokRedirectUri } = await import("./tiktok-oauth");

    expect(getTikTokRedirectUri()).toBe("https://outletmedia.net/api/tiktok/oauth/callback");
  });

  it("encrypts and decrypts tokens", async () => {
    const { decryptTikTokToken, encryptTikTokToken } = await import("./tiktok-oauth");

    const encrypted = encryptTikTokToken("tiktok-token");

    expect(encrypted).not.toContain("tiktok-token");
    expect(decryptTikTokToken(encrypted)).toBe("tiktok-token");
  });

  it("exchanges an auth code through TikTok API for Business", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({
        code: 0,
        data: { access_token: "access-token", advertiser_ids: ["7227326933644689410"] },
      })),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { exchangeTikTokAuthCode } = await import("./tiktok-oauth");
    const payload = await exchangeTikTokAuthCode("auth-code");

    expect(payload.access_token).toBe("access-token");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/",
      expect.objectContaining({
        body: JSON.stringify({
          app_id: "app-id",
          auth_code: "auth-code",
          secret: "app-secret",
        }),
        method: "POST",
      }),
    );
  });
});
