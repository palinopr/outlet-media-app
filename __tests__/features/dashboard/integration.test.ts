import { beforeEach, describe, expect, it, vi } from "vitest";

const { getFeatureReadClient, supabaseAdmin, state } = vi.hoisted(() => {
  const state = {
    campaign_client_overrides: [] as Record<string, unknown>[],
    meta_campaigns: [] as Record<string, unknown>[],
    campaign_action_items: [] as Record<string, unknown>[],
    campaign_comments: [] as Record<string, unknown>[],
    system_events: [] as Record<string, unknown>[],
  };

  function applyFilters(
    rows: Record<string, unknown>[],
    filters: Array<{ field: string; type: "eq" | "in" | "neq" | "gte" | "is"; value: unknown }>,
  ) {
    return rows.filter((row) =>
      filters.every((filter) => {
        if (filter.type === "eq") return row[filter.field] === filter.value;
        if (filter.type === "neq") return row[filter.field] !== filter.value;
        if (filter.type === "is") return row[filter.field] == filter.value;
        if (filter.type === "gte")
          return String(row[filter.field]) >= String(filter.value);
        if (filter.type === "in") {
          const values = Array.isArray(filter.value) ? filter.value : [];
          return values.includes(row[filter.field]);
        }
        return true;
      }),
    );
  }

  const supabaseAdmin = {
    from(table: string) {
      const filters: Array<{
        field: string;
        type: "eq" | "in" | "neq" | "gte" | "is";
        value: unknown;
      }> = [];
      let limitValue: number | null = null;

      const query = {
        select() { return this; },
        eq(field: string, value: unknown) {
          filters.push({ field, type: "eq", value });
          return this;
        },
        neq(field: string, value: unknown) {
          filters.push({ field, type: "neq", value });
          return this;
        },
        in(field: string, value: unknown[]) {
          filters.push({ field, type: "in", value });
          return this;
        },
        is(field: string, value: unknown) {
          filters.push({ field, type: "is", value });
          return this;
        },
        gte(field: string, value: unknown) {
          filters.push({ field, type: "gte", value });
          return this;
        },
        lte() { return this; },
        order() { return this; },
        limit(value: number) {
          limitValue = value;
          return this;
        },
        then(resolve: (value: { data: Record<string, unknown>[]; error: null }) => unknown) {
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

  const getFeatureReadClientFn = vi.fn(async () => supabaseAdmin);

  return { getFeatureReadClient: getFeatureReadClientFn, supabaseAdmin, state };
});

vi.mock("@/lib/supabase", () => ({
  getFeatureReadClient,
  supabaseAdmin,
}));

vi.mock("@/features/approvals/server", () => ({
  listApprovalRequests: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/features/conversations/server", () => ({
  listConversationThreads: vi.fn().mockResolvedValue([]),
}));

import { getDashboardOpsSummary } from "@/features/dashboard/server";

describe("getDashboardOpsSummary integration", () => {
  beforeEach(() => {
    state.meta_campaigns = [];
    state.campaign_action_items = [];
    state.campaign_comments = [];
    state.system_events = [];
    state.campaign_client_overrides = [];
  });

  it("returns complete dashboard summary shape with empty data", async () => {
    const result = await getDashboardOpsSummary({ mode: "admin", limit: 5 });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("metrics");
    expect(result).toHaveProperty("attentionCampaigns");
    expect(result).toHaveProperty("campaignsNeedingAttention");
    expect(result).toHaveProperty("mode", "admin");
    expect(Array.isArray(result.metrics)).toBe(true);
    expect(Array.isArray(result.attentionCampaigns)).toBe(true);
  });

  it("aggregates campaign metrics from active campaigns", async () => {
    state.meta_campaigns = [
      { campaign_id: "cmp_1", client_slug: "acme", name: "Spring Sale", status: "active" },
      { campaign_id: "cmp_2", client_slug: "acme", name: "Summer Drop", status: "paused" },
    ];
    state.campaign_action_items = [
      {
        campaign_id: "cmp_1",
        client_slug: "acme",
        priority: "urgent",
        status: "open",
        updated_at: new Date().toISOString(),
        visibility: "shared",
      },
    ];

    const result = await getDashboardOpsSummary({ mode: "admin", limit: 10 });

    expect(result.mode).toBe("admin");
    expect(result.metrics.length).toBeGreaterThan(0);

    const actionItemMetric = result.metrics.find((m) => m.key === "action_items");
    expect(actionItemMetric).toBeDefined();
    expect(actionItemMetric!.value).toBeGreaterThanOrEqual(1);
  });

  it("scopes results to a specific client slug", async () => {
    state.meta_campaigns = [
      { campaign_id: "cmp_a", client_slug: "client_a", name: "Campaign A", status: "active" },
      { campaign_id: "cmp_b", client_slug: "client_b", name: "Campaign B", status: "active" },
    ];

    const result = await getDashboardOpsSummary({
      clientSlug: "client_a",
      mode: "admin",
      limit: 10,
    });

    expect(result).toBeDefined();
    expect(result.attentionCampaigns.every((c) => c.clientSlug === "client_a")).toBe(true);
  });
});
