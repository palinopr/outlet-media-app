import { describe, it, expect, vi, beforeEach } from "vitest";

vi.stubEnv("META_APP_ID", "123456");
vi.stubEnv("META_APP_SECRET", "test-secret");
vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://example.com");

describe("meta-oauth", () => {
  beforeEach(() => vi.resetAllMocks());

  it("buildAuthUrl returns a valid Facebook OAuth URL", async () => {
    const { buildAuthUrl } = await import("./meta-oauth");
    const url = buildAuthUrl("state-token-123");
    expect(url).toContain("facebook.com/v21.0/dialog/oauth");
    expect(url).toContain("client_id=123456");
    expect(url).toContain("redirect_uri=");
    expect(url).toContain("scope=ads_management");
    expect(url).toContain("state=state-token-123");
  });

  it("verifySignedRequest validates HMAC signature", async () => {
    const crypto = await import("node:crypto");
    const { verifySignedRequest } = await import("./meta-oauth");
    const payload = JSON.stringify({
      user_id: "123",
      algorithm: "HMAC-SHA256",
      issued_at: Date.now() / 1000,
    });
    const encodedPayload = Buffer.from(payload).toString("base64url");
    const sig = crypto
      .createHmac("sha256", "test-secret")
      .update(encodedPayload)
      .digest();
    const encodedSig = sig.toString("base64url");
    const signedRequest = `${encodedSig}.${encodedPayload}`;

    const result = verifySignedRequest(signedRequest);
    expect(result).toEqual(expect.objectContaining({ user_id: "123" }));
  });

  it("verifySignedRequest rejects tampered payload", async () => {
    const { verifySignedRequest } = await import("./meta-oauth");
    expect(() => verifySignedRequest("bad.data")).toThrow();
  });
});
