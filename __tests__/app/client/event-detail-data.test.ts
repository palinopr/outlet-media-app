import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  applyEffectiveCampaignClientSlugs,
  createClerkSupabaseClient,
  currentUser,
  serviceState,
  supabaseAdmin,
  userScopedState,
  userScopedSupabase,
} = vi.hoisted(() => {
  const serviceState = {
    event_snapshots: [] as Record<string, unknown>[],
    meta_campaigns: [] as Record<string, unknown>[],
    tm_event_demographics: [] as Record<string, unknown>[],
    tm_events: [] as Record<string, unknown>[],
  };

  const userScopedState = {
    event_snapshots: [] as Record<string, unknown>[],
    meta_campaigns: [] as Record<string, unknown>[],
    tm_event_demographics: [] as Record<string, unknown>[],
    tm_events: [] as Record<string, unknown>[],
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

        const query = {
          select() {
            return this;
          },
          eq(field: string, value: unknown) {
            filters.push({ field, type: "eq", value });
            return this;
          },
          order() {
            return this;
          },
          async maybeSingle() {
            const rows = applyFilters(
              (state[table as keyof typeof state] ?? []) as Record<string, unknown>[],
              filters,
            );
            return { data: rows[0] ?? null, error: null };
          },
          then(
            resolve: (value: { data: Record<string, unknown>[]; error: null }) => unknown,
          ) {
            const rows = applyFilters(
              (state[table as keyof typeof state] ?? []) as Record<string, unknown>[],
              filters,
            );
            return Promise.resolve({ data: rows, error: null }).then(resolve);
          },
        };

        return query;
      },
    };
  }

  return {
    applyEffectiveCampaignClientSlugs: vi.fn(async (rows: unknown[]) => rows),
    createClerkSupabaseClient: vi.fn(),
    currentUser: vi.fn(),
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
  applyEffectiveCampaignClientSlugs,
}));

import { getEventDetail } from "@/app/client/[slug]/event/[eventId]/data";

function makeEventRow() {
  return {
    id: "evt_1",
    tm_id: "tm_1",
    client_slug: "zamora",
    name: "RLS Event",
    artist: "RLS Event",
    venue: "Arena",
    city: "Miami",
    date: "2026-04-01T00:00:00.000Z",
    status: "onsale",
    tickets_sold: 100,
    tickets_available: 50,
    avg_ticket_price: 5500,
    potential_revenue: 825000,
    gross: 550000,
    updated_at: "2026-03-07T12:00:00.000Z",
    tickets_sold_today: 5,
    revenue_today: 27500,
    conversion_rate: null,
    edp_total_views: null,
    edp_avg_daily_views: null,
    channel_internet_pct: null,
    channel_mobile_pct: null,
    channel_box_pct: null,
    channel_phone_pct: null,
  };
}

describe("client event detail reads", () => {
  beforeEach(() => {
    applyEffectiveCampaignClientSlugs.mockReset();
    createClerkSupabaseClient.mockReset();
    currentUser.mockReset();
    serviceState.event_snapshots = [];
    serviceState.meta_campaigns = [];
    serviceState.tm_event_demographics = [];
    serviceState.tm_events = [];
    userScopedState.event_snapshots = [];
    userScopedState.meta_campaigns = [];
    userScopedState.tm_event_demographics = [];
    userScopedState.tm_events = [];
    currentUser.mockResolvedValue({ publicMetadata: { role: "member" } });
    createClerkSupabaseClient.mockResolvedValue(null);
    applyEffectiveCampaignClientSlugs.mockImplementation(async (rows: unknown[]) => rows);
  });

  it("prefers the Clerk-scoped client for client event detail reads", async () => {
    userScopedState.tm_events = [makeEventRow()];
    userScopedState.meta_campaigns = [
      {
        campaign_id: "cmp_1",
        client_slug: "legacy",
        name: "RLS Linked Campaign",
        status: "ACTIVE",
        spend: 20000,
        roas: 3,
        impressions: 1000,
        clicks: 25,
        tm_event_id: "evt_1",
      },
    ];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);

    const detail = await getEventDetail("zamora", "evt_1");

    expect(detail?.event.name).toBe("RLS Event");
    expect(detail?.linkedCampaigns).toEqual([
      expect.objectContaining({
        campaignId: "cmp_1",
        name: "RLS Linked Campaign",
      }),
    ]);
    expect(applyEffectiveCampaignClientSlugs).not.toHaveBeenCalled();
  });

  it("keeps admin client-portal viewers on the service role for event detail reads", async () => {
    currentUser.mockResolvedValue({ publicMetadata: { role: "admin" } });
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);
    serviceState.tm_events = [makeEventRow()];
    serviceState.meta_campaigns = [
      {
        campaign_id: "cmp_1",
        client_slug: "zamora",
        name: "Service Linked Campaign",
        status: "ACTIVE",
        spend: 20000,
        roas: 3,
        impressions: 1000,
        clicks: 25,
        tm_event_id: "evt_1",
      },
    ];

    const detail = await getEventDetail("zamora", "evt_1");

    expect(detail?.linkedCampaigns).toEqual([
      expect.objectContaining({
        campaignId: "cmp_1",
        name: "Service Linked Campaign",
      }),
    ]);
    expect(createClerkSupabaseClient).not.toHaveBeenCalled();
    expect(applyEffectiveCampaignClientSlugs).toHaveBeenCalledOnce();
  });
});
