import { describe, it, expect, vi } from "vitest";

vi.stubEnv("META_APP_SECRET", "test-secret");
vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://example.com");

describe("GET /api/meta/callback", () => {
  it("redirects to error page when error param present", async () => {
    const { GET } = await import("./route");
    const request = new Request(
      "https://example.com/api/meta/callback?error=access_denied&error_description=User+denied",
    );
    const response = await GET(request);
    expect(response.status).toBe(307);
    const location = response.headers.get("location");
    expect(location).toContain("connect-error");
    expect(location).toContain("User%20denied");
  });

  it("redirects to error page when missing code", async () => {
    const { GET } = await import("./route");
    const request = new Request("https://example.com/api/meta/callback");
    const response = await GET(request);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("missing_params");
  });

  it("redirects completed callbacks to the retired-flow message", async () => {
    const { GET } = await import("./route");
    const request = new Request(
      "https://example.com/api/meta/callback?code=test-code&state=test-state",
    );
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://example.com/connect-error?code=retired_client_flow",
    );
  });
});
