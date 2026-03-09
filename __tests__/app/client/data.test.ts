import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  createClerkSupabaseClient,
  currentUser,
  fetchAllCampaigns,
  serviceState,
  supabaseAdmin,
  userScopedState,
  userScopedSupabase,
} = vi.hoisted(() => {
  const serviceState = {
    tm_event_demographics: [] as Record<string, unknown>[],
    tm_events: [] as Record<string, unknown>[],
  };

  const userScopedState = {
    tm_event_demographics: [] as Record<string, unknown>[],
    tm_events: [] as Record<string, unknown>[],
  };

  function applyFilters(
    rows: Record<string, unknown>[],
    filters: Array<{ field: string; type: "eq" | "in"; value: unknown }>,
  ) {
    return rows.filter((row) =>
      filters.every((filter) => {
        if (filter.type === "eq") {
          return row[filter.field] === filter.value;
        }

        const values = Array.isArray(filter.value) ? filter.value : [];
        return values.includes(row[filter.field]);
      }),
    );
  }

  function buildClient(state: typeof serviceState) {
    return {
      from(table: string) {
        const filters: Array<{ field: string; type: "eq" | "in"; value: unknown }> = [];
        let limitValue: number | null = null;

        const query = {
          select() {
            return this;
          },
          eq(field: string, value: unknown) {
            filters.push({ field, type: "eq", value });
            return this;
          },
          in(field: string, value: unknown[]) {
            filters.push({ field, type: "in", value });
            return this;
          },
          order() {
            return this;
          },
          limit(value: number) {
            limitValue = value;
            return this;
          },
          then(
            resolve: (value: { data: Record<string, unknown>[]; error: null }) => unknown,
          ) {
            const rows = applyFilters(
              (state[table as keyof typeof state] ?? []) as Record<string, unknown>[],
              filters,
            );
            const data = limitValue == null ? rows : rows.slice(0, limitValue);
            return Promise.resolve({ data, error: null }).then(resolve);
          },
        };

        return query;
      },
    };
  }

  return {
    createClerkSupabaseClient: vi.fn(),
    currentUser: vi.fn(),
    fetchAllCampaigns: vi.fn(),
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

vi.mock("@/lib/meta-campaigns", () => ({
  fetchAllCampaigns,
}));

import { getData, getEventsPageData } from "@/app/client/[slug]/data";

function makeCampaign(name: string) {
  return {
    campaignId: "cmp_1",
    clicks: 10,
    cpc: 100,
    cpm: 200,
    ctr: 1,
    dailyBudget: null,
    impressions: 1000,
    name,
    revenue: 40000,
    roas: 4,
    spend: 10000,
    startTime: "2026-03-01T00:00:00.000Z",
    status: "ACTIVE",
  };
}

function makeEvent(id: string, name: string, tmId: string) {
  return {
    artist: name,
    avg_ticket_price: 5500,
    city: "Miami",
    client_slug: "zamora",
    conversion_rate: null,
    date: "2026-04-01T00:00:00.000Z",
    edp_avg_daily_views: null,
    edp_total_views: null,
    gross: 550000,
    id,
    name,
    potential_revenue: null,
    revenue_today: null,
    status: "onsale",
    tickets_available: 90,
    tickets_sold: 10,
    tickets_sold_today: null,
    tm_id: tmId,
    updated_at: "2026-03-07T12:00:00.000Z",
    venue: "Arena",
  };
}

describe("client portal data reads", () => {
  beforeEach(() => {
    createClerkSupabaseClient.mockReset();
    currentUser.mockReset();
    fetchAllCampaigns.mockReset();
    serviceState.tm_event_demographics = [];
    serviceState.tm_events = [];
    userScopedState.tm_event_demographics = [];
    userScopedState.tm_events = [];
    currentUser.mockResolvedValue({ publicMetadata: { role: "member" } });
    createClerkSupabaseClient.mockResolvedValue(null);
    fetchAllCampaigns.mockResolvedValue({
      campaigns: [makeCampaign("Campaign 1")],
      dailyInsights: [],
      error: null,
    });
  });

  it("prefers the Clerk-scoped client for client event and audience reads", async () => {
    serviceState.tm_events = [makeEvent("evt_service", "Service Event", "svc_tm")];
    userScopedState.tm_events = [makeEvent("evt_rls", "RLS Event", "rls_tm")];
    serviceState.tm_event_demographics = [{ tm_id: "svc_tm", fans_total: 10, fans_female_pct: 40 }];
    userScopedState.tm_event_demographics = [
      { tm_id: "rls_tm", fans_total: 120, fans_female_pct: 75 },
    ];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);

    const data = await getData("zamora", "7");

    expect(data.events.map((event) => event.id)).toEqual(["evt_rls"]);
    expect(data.audience?.totalFans).toBe(120);
  });

  it("keeps admin portal viewers on the service role for event lists", async () => {
    currentUser.mockResolvedValue({ publicMetadata: { role: "admin" } });
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);
    serviceState.tm_events = [makeEvent("evt_service", "Service Event", "svc_tm")];
    userScopedState.tm_events = [makeEvent("evt_rls", "RLS Event", "rls_tm")];

    const data = await getEventsPageData("zamora");

    expect(data.events.map((event) => event.id)).toEqual(["evt_service"]);
    expect(createClerkSupabaseClient).not.toHaveBeenCalled();
  });
});
