import { describe, it, expect } from "vitest";
import {
  IngestPayloadSchema,
  ContactFormSchema,
  InviteSchema,
} from "@/lib/api-schemas";

// ─── IngestPayloadSchema ────────────────────────────────────────────────────

describe("IngestPayloadSchema", () => {
  const validBase = {
    secret: "test-secret",
    source: "meta" as const,
    data: { scraped_at: "2026-01-01T00:00:00Z" },
  };

  it("accepts a valid meta payload", () => {
    const result = IngestPayloadSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it("accepts a valid ticketmaster_one payload", () => {
    const result = IngestPayloadSchema.safeParse({
      ...validBase,
      source: "ticketmaster_one",
      data: {
        scraped_at: "2026-01-01",
        events: [{ tm_id: "ev1", tm1_number: "TM1", name: "Show", artist: "Artist", venue: "V", city: "C", date: "2026-06-01", status: "onsale", url: "https://tm.com/ev1", scraped_at: "2026-01-01" }],
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing secret", () => {
    const result = IngestPayloadSchema.safeParse({ source: "meta", data: { scraped_at: "" } });
    expect(result.success).toBe(false);
  });

  it("rejects empty secret", () => {
    const result = IngestPayloadSchema.safeParse({ secret: "", source: "meta", data: { scraped_at: "" } });
    expect(result.success).toBe(false);
  });

  it("rejects invalid source enum", () => {
    const result = IngestPayloadSchema.safeParse({ ...validBase, source: "spotify" });
    expect(result.success).toBe(false);
  });

  it("rejects missing data.scraped_at", () => {
    const result = IngestPayloadSchema.safeParse({ secret: "s", source: "meta", data: {} });
    expect(result.success).toBe(false);
  });

  it("accepts tm_demographics source", () => {
    const result = IngestPayloadSchema.safeParse({
      ...validBase,
      source: "tm_demographics",
      data: {
        scraped_at: "2026-01-01",
        demographics: [{ tm_id: "ev1", fetched_at: "2026-01-01" }],
      },
    });
    expect(result.success).toBe(true);
  });
});

// ─── ContactFormSchema ─────────────────────────────────────────────────────

describe("ContactFormSchema", () => {
  it("accepts the mobile fallback audit form payload", () => {
    const result = ContactFormSchema.safeParse({
      name: "Jaime Ortiz",
      phone: "+1 305 322 5709",
      email: "jaime@example.com",
      company: "Outlet Live",
      monthlyBudget: "$5K — $20K",
      goal: "Sell more tickets next week",
      preferredContact: "WhatsApp",
      pageContext: "landing-audit-funnel",
      message: "Fallback audit request from the Outlet Media landing funnel.",
    });

    expect(result.success).toBe(true);
  });
});

// ─── InviteSchema ───────────────────────────────────────────────────────────

describe("InviteSchema", () => {
  it("accepts admin invites without a client id", () => {
    const result = InviteSchema.safeParse({ email: "test@example.com", role: "admin" });
    expect(result.success).toBe(true);
  });

  it("accepts client invites with clientId", () => {
    const result = InviteSchema.safeParse({
      email: "a@b.com",
      clientId: "client_123",
      client_role: "member",
    });
    expect(result.success).toBe(true);
  });

  it("rejects client invites without clientId", () => {
    const result = InviteSchema.safeParse({ email: "a@b.com", role: "member" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = InviteSchema.safeParse({ email: "not-an-email", role: "admin" });
    expect(result.success).toBe(false);
  });

  it("rejects missing email", () => {
    const result = InviteSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
