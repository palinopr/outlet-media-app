import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  createClerkSupabaseClient,
  currentUser,
  getEffectiveCampaignRowById,
  metaGet,
  serviceState,
  supabaseAdmin,
  userScopedState,
  userScopedSupabase,
} = vi.hoisted(() => {
  const serviceState = {
    meta_campaigns: [] as Record<string, unknown>[],
  };

  const userScopedState = {
    meta_campaigns: [] as Record<string, unknown>[],
  };

  function applyFilters(
    rows: Record<string, unknown>[],
    filters: Array<{ field: string; type: "eq"; value: unknown }>,
  ) {
    return rows.filter((row) =>
      filters.every((filter) => row[filter.field] === filter.value),
    );
  }

  function buildClient(state: typeof serviceState) {
    return {
      from(table: string) {
        const filters: Array<{ field: string; type: "eq"; value: unknown }> = [];

        return {
          select() {
            return this;
          },
          eq(field: string, value: unknown) {
            filters.push({ field, type: "eq", value });
            return this;
          },
          async maybeSingle() {
            const rows = applyFilters(
              (state[table as keyof typeof state] ?? []) as Record<string, unknown>[],
              filters,
            );
            return { data: rows[0] ?? null, error: null };
          },
        };
      },
    };
  }

  return {
    createClerkSupabaseClient: vi.fn(),
    currentUser: vi.fn(),
    getEffectiveCampaignRowById: vi.fn(),
    metaGet: vi.fn(),
    serviceState,
    supabaseAdmin: buildClient(serviceState),
    userScopedState,
    userScopedSupabase: buildClient(userScopedState),
  };
});

vi.mock("@clerk/nextjs/server", () => ({
  currentUser,
}));

vi.mock("@/lib/supabase", () => ({
  createClerkSupabaseClient,
  supabaseAdmin,
}));

vi.mock("@/lib/campaign-client-assignment", () => ({
  getEffectiveCampaignRowById,
}));

vi.mock("@/lib/meta-api", () => ({
  metaGet,
  metaInsightsUrl: vi.fn(() => "https://example.com/insights"),
  metaUrl: vi.fn(() => "https://example.com/meta"),
}));

import { getCampaignDetail } from "@/app/client/[slug]/campaign/[campaignId]/data";

describe("client campaign detail reads", () => {
  beforeEach(() => {
    createClerkSupabaseClient.mockReset();
    currentUser.mockReset();
    getEffectiveCampaignRowById.mockReset();
    metaGet.mockReset();
    serviceState.meta_campaigns = [];
    userScopedState.meta_campaigns = [];
    currentUser.mockResolvedValue({ publicMetadata: { role: "member" } });
    createClerkSupabaseClient.mockResolvedValue(null);
    getEffectiveCampaignRowById.mockResolvedValue(null);
    metaGet.mockResolvedValue(null);
  });

  it("prefers the Clerk-scoped client for client campaign detail reads", async () => {
    userScopedState.meta_campaigns = [
      {
        campaign_id: "cmp_1",
        client_slug: "legacy",
        name: "RLS Campaign",
        status: "ACTIVE",
        spend: 12345,
        roas: 3.5,
        impressions: 1000,
        clicks: 25,
        ctr: 2.5,
        cpc: 494,
        cpm: 1234,
        daily_budget: 5000,
        start_time: "2026-03-01T00:00:00.000Z",
      },
    ];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);

    const detail = await getCampaignDetail("zamora", "cmp_1", "7");

    expect(detail?.campaign.name).toBe("RLS Campaign");
    expect(detail?.dataSource).toBe("supabase");
    expect(getEffectiveCampaignRowById).not.toHaveBeenCalled();
  });

  it("keeps admin client-portal viewers on the service role fallback", async () => {
    currentUser.mockResolvedValue({ publicMetadata: { role: "admin" } });
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);
    getEffectiveCampaignRowById.mockResolvedValue({
      campaign_id: "cmp_1",
      client_slug: "zamora",
      name: "Service Campaign",
      status: "ACTIVE",
      spend: 23456,
      roas: 2.1,
      impressions: 2000,
      clicks: 50,
      ctr: 2.5,
      cpc: 469,
      cpm: 1172,
      daily_budget: 9000,
      start_time: "2026-03-01T00:00:00.000Z",
    });

    const detail = await getCampaignDetail("zamora", "cmp_1", "7");

    expect(detail?.campaign.name).toBe("Service Campaign");
    expect(createClerkSupabaseClient).not.toHaveBeenCalled();
  });
});
