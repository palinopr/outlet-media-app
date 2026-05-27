import { beforeEach, describe, expect, it, vi } from "vitest";

vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://outletmedia.net");
vi.stubEnv("TIKTOK_APP_ID", "app-id");
vi.stubEnv("TIKTOK_APP_SECRET", "app-secret");
vi.stubEnv("TIKTOK_TOKEN_ENCRYPTION_KEY", "encryption-secret");

const upsert = vi.fn();
vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      upsert,
    })),
  },
}));

describe("GET /api/tiktok/oauth/callback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to error page when TikTok returns an error", async () => {
    const { GET } = await import("./route");
    const response = await GET(new Request(
      "https://outletmedia.net/api/tiktok/oauth/callback?error=access_denied&error_description=Denied",
    ));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://outletmedia.net/connect-error?code=access_denied&error=Denied",
    );
  });

  it("redirects to error page when no auth code is present", async () => {
    const { GET } = await import("./route");
    const response = await GET(new Request("https://outletmedia.net/api/tiktok/oauth/callback"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://outletmedia.net/connect-error?code=missing_tiktok_oauth_code",
    );
  });

  it("redirects to error page when OAuth state is invalid", async () => {
    const { GET } = await import("./route");
    const response = await GET(new Request(
      "https://outletmedia.net/api/tiktok/oauth/callback?auth_code=auth-code&state=state",
      { headers: { cookie: "tiktok_oauth_state=other-state" } },
    ));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://outletmedia.net/connect-error?code=invalid_tiktok_oauth_state",
    );
  });

  it("exchanges the auth code and stores authorized advertiser connections", async () => {
    upsert.mockResolvedValue({ error: null });
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({
          code: 0,
          data: {
            access_token: "access-token",
            advertiser_ids: ["7227326933644689410"],
            expires_in: 86400,
            refresh_token: "refresh-token",
            refresh_token_expires_in: 604800,
            scope: "advertiser_info reporting",
          },
        })),
      })
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({
          code: 0,
          data: {
            list: [
              {
                advertiser_id: "7227326933644689410",
                advertiser_name: "test134",
              },
            ],
          },
        })),
      }));

    const { GET } = await import("./route");
    const response = await GET(new Request(
      "https://outletmedia.net/api/tiktok/oauth/callback?auth_code=auth-code&state=state",
      { headers: { cookie: "tiktok_oauth_state=state" } },
    ));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://outletmedia.net/admin?tiktok=connected&advertiser_id=7227326933644689410",
    );
    expect(upsert).toHaveBeenCalledWith(
      [expect.objectContaining({
        advertiser_id: "7227326933644689410",
        advertiser_name: "test134",
        status: "active",
      })],
      { onConflict: "advertiser_id" },
    );
    const row = upsert.mock.calls[0][0][0];
    expect(row.access_token_encrypted).not.toContain("access-token");
    expect(row.refresh_token_encrypted).not.toContain("refresh-token");
  });
});
