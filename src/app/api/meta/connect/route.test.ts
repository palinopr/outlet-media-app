import { describe, it, expect, vi } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn().mockResolvedValue({ userId: "user_123" }),
}));
vi.mock("@/features/client-portal/ownership", () => ({
  requireClientOwner: vi.fn().mockResolvedValue(null),
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

  it("blocks non-owner client members from starting Meta connect", async () => {
    const { requireClientOwner } = await import("@/features/client-portal/ownership");
    vi.mocked(requireClientOwner).mockResolvedValueOnce(
      Response.json({ error: "Only owners can connect ad accounts" }, { status: 403 }),
    );

    const { GET } = await import("./route");
    const request = new Request(
      "https://example.com/api/meta/connect?slug=zamora",
    );
    const response = await GET(request);

    expect(response.status).toBe(403);
  });
});
