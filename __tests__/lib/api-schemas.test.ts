import { describe, it, expect } from "vitest";
import {
  IngestPayloadSchema,
  AlertPostSchema,
  AlertPatchSchema,
  AgentPostSchema,
  CreateAssetCommentSchema,
  CreateCampaignCommentSchema,
  CreateEventCommentSchema,
  InviteSchema,
  VALID_AGENTS,
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

// ─── AlertPostSchema ────────────────────────────────────────────────────────

describe("AlertPostSchema", () => {
  it("accepts a valid alert", () => {
    const result = AlertPostSchema.safeParse({ secret: "s", message: "alert!" });
    expect(result.success).toBe(true);
  });

  it("accepts with level", () => {
    const result = AlertPostSchema.safeParse({ secret: "s", message: "x", level: "critical" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid level", () => {
    const result = AlertPostSchema.safeParse({ secret: "s", message: "x", level: "error" });
    expect(result.success).toBe(false);
  });

  it("rejects empty message", () => {
    const result = AlertPostSchema.safeParse({ secret: "s", message: "" });
    expect(result.success).toBe(false);
  });

  it("rejects whitespace-only message (trimmed)", () => {
    const result = AlertPostSchema.safeParse({ secret: "s", message: "   " });
    expect(result.success).toBe(false);
  });

  it("rejects missing secret", () => {
    const result = AlertPostSchema.safeParse({ message: "hi" });
    expect(result.success).toBe(false);
  });

  it("rejects message over 5000 chars", () => {
    const result = AlertPostSchema.safeParse({ secret: "s", message: "x".repeat(5001) });
    expect(result.success).toBe(false);
  });
});

// ─── AlertPatchSchema ───────────────────────────────────────────────────────

describe("AlertPatchSchema", () => {
  it("accepts valid patch", () => {
    expect(AlertPatchSchema.safeParse({ secret: "s" }).success).toBe(true);
  });

  it("rejects missing secret", () => {
    expect(AlertPatchSchema.safeParse({}).success).toBe(false);
  });
});

// ─── AgentPostSchema ────────────────────────────────────────────────────────

describe("AgentPostSchema", () => {
  it("accepts all valid agent types", () => {
    for (const agent of VALID_AGENTS) {
      const result = AgentPostSchema.safeParse({ agent });
      expect(result.success).toBe(true);
    }
  });

  it("rejects unknown agent", () => {
    const result = AgentPostSchema.safeParse({ agent: "unknown" });
    expect(result.success).toBe(false);
  });

  it("accepts optional prompt", () => {
    const result = AgentPostSchema.safeParse({ agent: "tm-monitor", prompt: "check sales" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.prompt).toBe("check sales");
    }
  });

  it("rejects prompt over 10000 chars", () => {
    const result = AgentPostSchema.safeParse({ agent: "tm-monitor", prompt: "x".repeat(10001) });
    expect(result.success).toBe(false);
  });
});

// ─── InviteSchema ───────────────────────────────────────────────────────────

describe("InviteSchema", () => {
  it("accepts valid email", () => {
    const result = InviteSchema.safeParse({ email: "test@example.com" });
    expect(result.success).toBe(true);
  });

  it("accepts email with client_slug", () => {
    const result = InviteSchema.safeParse({ email: "a@b.com", client_slug: "zamora" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = InviteSchema.safeParse({ email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects missing email", () => {
    const result = InviteSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

// ─── CreateCampaignCommentSchema ────────────────────────────────────────────

describe("CreateCampaignCommentSchema", () => {
  it("accepts a valid shared campaign comment", () => {
    const result = CreateCampaignCommentSchema.safeParse({
      campaign_id: "123456789",
      client_slug: "zamora",
      content: "New creative is ready for review.",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.visibility).toBe("shared");
    }
  });

  it("accepts admin-only visibility", () => {
    const result = CreateCampaignCommentSchema.safeParse({
      campaign_id: "123456789",
      client_slug: "zamora",
      content: "Keep this internal for the team.",
      visibility: "admin_only",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty content", () => {
    const result = CreateCampaignCommentSchema.safeParse({
      campaign_id: "123456789",
      client_slug: "zamora",
      content: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid visibility", () => {
    const result = CreateCampaignCommentSchema.safeParse({
      campaign_id: "123456789",
      client_slug: "zamora",
      content: "hello",
      visibility: "client_only",
    });
    expect(result.success).toBe(false);
  });
});

// ─── CreateAssetCommentSchema ───────────────────────────────────────────────

describe("CreateAssetCommentSchema", () => {
  it("accepts a valid shared asset comment", () => {
    const result = CreateAssetCommentSchema.safeParse({
      asset_id: "34d8c8f2-78ff-4aca-96ac-15591fa7ec7d",
      client_slug: "zamora",
      content: "Can we swap this story cut for the brighter version?",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.visibility).toBe("shared");
    }
  });

  it("accepts admin-only asset feedback", () => {
    const result = CreateAssetCommentSchema.safeParse({
      asset_id: "34d8c8f2-78ff-4aca-96ac-15591fa7ec7d",
      client_slug: "zamora",
      content: "Internal note: crop and safe-zone still need review.",
      visibility: "admin_only",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid asset ids", () => {
    const result = CreateAssetCommentSchema.safeParse({
      asset_id: "not-a-uuid",
      client_slug: "zamora",
      content: "Need a new version",
    });
    expect(result.success).toBe(false);
  });
});

// ─── CreateEventCommentSchema ───────────────────────────────────────────────

describe("CreateEventCommentSchema", () => {
  it("accepts a valid shared event comment", () => {
    const result = CreateEventCommentSchema.safeParse({
      event_id: "34d8c8f2-78ff-4aca-96ac-15591fa7ec7d",
      content: "Can we confirm whether this on-sale push should stay live through the weekend?",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.visibility).toBe("shared");
    }
  });

  it("accepts admin-only event notes", () => {
    const result = CreateEventCommentSchema.safeParse({
      event_id: "34d8c8f2-78ff-4aca-96ac-15591fa7ec7d",
      content: "Internal note: hold this until ticket holdback is confirmed.",
      visibility: "admin_only",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid event ids", () => {
    const result = CreateEventCommentSchema.safeParse({
      event_id: "not-a-uuid",
      content: "Need a pricing review",
    });
    expect(result.success).toBe(false);
  });
});
