import { describe, it, expect, vi, beforeEach } from "vitest";

vi.stubEnv("META_APP_SECRET", "test-secret");

describe("meta-oauth", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.unstubAllEnvs();
    vi.stubEnv("META_APP_SECRET", "test-secret");
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
