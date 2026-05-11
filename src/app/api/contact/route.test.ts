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
          businessLink: "https://example.com/event",
          company: "Acme Live",
          deadline: "30 days",
          desiredOutcome: "Tickets",
          email: "buyer@example.com",
          fbclid: "fb.1.test",
          gclid: "gclid-test",
          goal: "Sell more tickets",
          hasAdAccount: "Yes, but needs help",
          message: "Need help with paid media.",
          monthlyBudget: "$5,000 - $20,000/mes",
          name: "Buyer",
          pageContext: "landing-growth-system-funnel",
          phone: "+1 555 000 1111",
          recommendedOffer: "Ticket Sales Sprint - desde $5,000",
          stage: "Necesito vender boletos",
          utmCampaign: "spring_launch",
          utmContent: "hero",
          utmMedium: "paid_social",
          utmSource: "meta",
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
    expect(insert.mock.calls[0]?.[0].message).toContain(
      "Recommended offer: Ticket Sales Sprint - desde $5,000",
    );
    expect(insert.mock.calls[0]?.[0].message).toContain("UTM campaign: spring_launch");
    expect(fetch).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer resend_test_key" }),
        body: expect.stringContaining("New audit request: Buyer (Acme Live)"),
      }),
    );
    expect(fetch).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        body: expect.stringContaining("Recommended offer: Ticket Sales Sprint - desde $5,000"),
      }),
    );
  });

  it("rejects oversized submissions before parsing", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://example.com/api/contact", {
        method: "POST",
        headers: { "Content-Length": String(17 * 1024), "Content-Type": "application/json" },
        body: JSON.stringify({ email: "buyer@example.com", message: "Need help.", name: "Buyer" }),
      }),
    );

    expect(response.status).toBe(413);
    expect(insert).not.toHaveBeenCalled();
  });

  it("rate limits repeated submissions from the same client IP", async () => {
    const { POST } = await import("./route");
    const body = JSON.stringify({ email: "buyer@example.com", message: "Need help.", name: "Buyer" });

    let response = new Response(null, { status: 500 });
    for (let index = 0; index < 9; index += 1) {
      response = await POST(
        new Request("https://example.com/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-real-ip": "203.0.113.20" },
          body,
        }),
      );
    }

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBeTruthy();
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
