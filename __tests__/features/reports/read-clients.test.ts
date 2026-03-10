import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  createClerkSupabaseClient,
  currentUser,
  fetchAllCampaigns,
  getFeatureReadClient,
  serviceState,
  supabaseAdmin,
  userScopedState,
  userScopedSupabase,
} = vi.hoisted(() => {
  const serviceState = {
    tm_events: [] as Record<string, unknown>[],
  };

  const userScopedState = {
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

  const supabaseAdminClient = buildClient(serviceState);
  const userScopedSupabaseClient = buildClient(userScopedState);

  const createClerkSupabaseClientFn = vi.fn();
  const currentUserFn = vi.fn();

  const getFeatureReadClientFn = vi.fn(async (useClientScope: boolean) => {
    if (!useClientScope) return supabaseAdminClient;
    try {
      const user = await currentUserFn();
      const role = (user?.publicMetadata as { role?: string } | null)?.role;
      if (role === "admin") return supabaseAdminClient;
    } catch {
      return supabaseAdminClient;
    }
    return (await createClerkSupabaseClientFn()) ?? supabaseAdminClient;
  });

  return {
    createClerkSupabaseClient: createClerkSupabaseClientFn,
    currentUser: currentUserFn,
    fetchAllCampaigns: vi.fn(),
    getFeatureReadClient: getFeatureReadClientFn,
    serviceState,
    supabaseAdmin: supabaseAdminClient,
    userScopedState,
    userScopedSupabase: userScopedSupabaseClient,
  };
});

vi.mock("@clerk/nextjs/server", () => ({
  currentUser,
}));

vi.mock("@/lib/supabase", () => ({
  createClerkSupabaseClient,
  getFeatureReadClient,
  supabaseAdmin,
}));

vi.mock("@/lib/meta-campaigns", () => ({
  fetchAllCampaigns,
}));

import { getReportsData } from "@/features/reports/server";

function makeEvent(id: string, name: string) {
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
    tm_id: id,
    updated_at: "2026-03-07T12:00:00.000Z",
    venue: "Arena",
  };
}

describe("reports read clients", () => {
  beforeEach(() => {
    createClerkSupabaseClient.mockReset();
    currentUser.mockReset();
    fetchAllCampaigns.mockReset();
    serviceState.tm_events = [];
    userScopedState.tm_events = [];
    currentUser.mockResolvedValue({ publicMetadata: { role: "member" } });
    createClerkSupabaseClient.mockResolvedValue(null);
    fetchAllCampaigns.mockResolvedValue({
      campaigns: [],
      clients: ["zamora"],
      dailyInsights: [],
      error: null,
    });
  });

  it("prefers the Clerk-scoped client for client report event reads", async () => {
    serviceState.tm_events = [makeEvent("evt_service", "Service Event")];
    userScopedState.tm_events = [makeEvent("evt_rls", "RLS Event")];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);

    const data = await getReportsData({ clientSlug: "zamora" });

    expect(data.events.map((event) => event.id)).toEqual(["evt_rls"]);
  });

  it("keeps admin report viewers on the service role for event reads", async () => {
    currentUser.mockResolvedValue({ publicMetadata: { role: "admin" } });
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);
    serviceState.tm_events = [makeEvent("evt_service", "Service Event")];
    userScopedState.tm_events = [makeEvent("evt_rls", "RLS Event")];

    const data = await getReportsData({ clientSlug: "zamora" });

    expect(data.events.map((event) => event.id)).toEqual(["evt_service"]);
    expect(createClerkSupabaseClient).not.toHaveBeenCalled();
  });
});
