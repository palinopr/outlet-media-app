import { beforeEach, describe, expect, it, vi } from "vitest";

const { insert, from } = vi.hoisted(() => {
  const insert = vi.fn();
  const from = vi.fn(() => ({ insert }));
  return { insert, from };
});

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: { from },
}));

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    insert.mockResolvedValue({ error: null });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 200 })));
  });

  it("stores the contact submission and sends email through Resend HTTP API", async () => {
    vi.stubEnv("RESEND_API_KEY", "resend_test_key");
    vi.stubEnv("RESEND_FROM_EMAIL", "Outlet <hello@example.com>");
    vi.stubEnv("CONTACT_FORM_TO_EMAIL", "team@example.com");

    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://example.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: "Acme Live",
          email: "buyer@example.com",
          goal: "Sell more tickets",
          message: "Need help with paid media.",
          name: "Buyer",
          phone: "+1 555 000 1111",
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(from).toHaveBeenCalledWith("contact_submissions");
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "buyer@example.com",
        message: expect.stringContaining("Business: Acme Live"),
        name: "Buyer",
      }),
    );
    expect(fetch).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer resend_test_key" }),
        body: expect.stringContaining("New audit request: Buyer (Acme Live)"),
      }),
    );
  });

  it("does not call Resend when the API key is not configured", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://example.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "buyer@example.com",
          message: "Need help.",
          name: "Buyer",
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(fetch).not.toHaveBeenCalled();
  });
});
