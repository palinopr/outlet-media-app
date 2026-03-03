import { describe, it, expect, vi } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn().mockResolvedValue({ userId: "user_123" }),
}));
vi.stubEnv("META_APP_ID", "123456");
vi.stubEnv("META_APP_SECRET", "secret");
vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://example.com");

describe("GET /api/meta/connect", () => {
  it("redirects to Facebook OAuth URL", async () => {
    const { GET } = await import("./route");
    const request = new Request(
      "https://example.com/api/meta/connect?slug=zamora",
    );
    const response = await GET(request);
    expect(response.status).toBe(307);
    const location = response.headers.get("location");
    expect(location).toContain("facebook.com");
    expect(location).toContain("dialog/oauth");
  });
});
