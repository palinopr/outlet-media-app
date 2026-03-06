import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api-helpers", () => ({
  authGuard: vi.fn().mockResolvedValue({ error: null, userId: "user_123" }),
  apiError: (message: string, status = 500) =>
    Response.json({ error: message }, { status }),
  validateRequest: vi.fn().mockResolvedValue({
    data: {
      ad_account_id: "act_123",
      client_slug: "zamora",
      creative: {
        call_to_action: "LEARN_MORE",
        description: "Description",
        headline: "Headline",
        image_hash: "hash_123",
        link_url: "https://example.com",
        primary_text: "Primary text",
      },
      daily_budget: 1000,
      name: "Launch",
      objective: "OUTCOME_TRAFFIC",
      placements: null,
      targeting: {},
    },
    error: null,
  }),
}));

vi.mock("@/features/client-portal/ownership", () => ({
  requireClientOwner: vi.fn().mockResolvedValue(
    Response.json({ error: "Only owners can manage Meta campaigns" }, { status: 403 }),
  ),
}));

describe("POST /api/meta/campaigns", () => {
  it("blocks non-owner client users from campaign creation", async () => {
    const { POST } = await import("./route");
    const response = await POST(new Request("https://example.com/api/meta/campaigns"));

    expect(response.status).toBe(403);
  });
});
