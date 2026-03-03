import { describe, it, expect, vi } from "vitest";
import { createHmac } from "node:crypto";

vi.stubEnv("META_APP_SECRET", "test-secret");
vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://example.com");

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    from: () => ({
      delete: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    }),
  },
}));

describe("POST /api/meta/data-deletion", () => {
  it("returns confirmation code for valid signed_request", async () => {
    const { POST } = await import("./route");

    const payload = JSON.stringify({
      user_id: "fb_user_123",
      algorithm: "HMAC-SHA256",
      issued_at: Math.floor(Date.now() / 1000),
    });
    const encodedPayload = Buffer.from(payload).toString("base64url");
    const sig = createHmac("sha256", "test-secret")
      .update(encodedPayload)
      .digest();
    const encodedSig = sig.toString("base64url");
    const signedRequest = `${encodedSig}.${encodedPayload}`;

    const formData = new FormData();
    formData.set("signed_request", signedRequest);

    const request = new Request(
      "https://example.com/api/meta/data-deletion",
      {
        method: "POST",
        body: formData,
      },
    );
    const response = await POST(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.url).toContain("deletion-status");
    expect(body.confirmation_code).toBeTruthy();
  });

  it("rejects invalid signature", async () => {
    const { POST } = await import("./route");
    const formData = new FormData();
    formData.set("signed_request", "invalid.data");
    const request = new Request(
      "https://example.com/api/meta/data-deletion",
      {
        method: "POST",
        body: formData,
      },
    );
    const response = await POST(request);
    expect(response.status).toBe(403);
  });
});
