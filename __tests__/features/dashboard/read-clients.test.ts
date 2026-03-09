import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  createClerkSupabaseClient,
  currentUser,
  serviceState,
  supabaseAdmin,
  userScopedState,
  userScopedSupabase,
} = vi.hoisted(() => {
  const serviceState = {
    campaign_action_items: [] as Record<string, unknown>[],
    campaign_comments: [] as Record<string, unknown>[],
    meta_campaigns: [] as Record<string, unknown>[],
    system_events: [] as Record<string, unknown>[],
  };

  const userScopedState = {
    campaign_action_items: [] as Record<string, unknown>[],
    campaign_comments: [] as Record<string, unknown>[],
    meta_campaigns: [] as Record<string, unknown>[],
    system_events: [] as Record<string, unknown>[],
  };

  function applyFilters(
    rows: Record<string, unknown>[],
    filters: Array<{ field: string; type: "eq" | "in" | "gte"; value: unknown }>,
  ) {
    return rows.filter((row) =>
      filters.every((filter) => {
        if (filter.type === "eq") {
          return row[filter.field] === filter.value;
        }

        if (filter.type === "gte") {
          return String(row[filter.field] ?? "") >= String(filter.value ?? "");
        }

        const values = Array.isArray(filter.value) ? filter.value : [];
        return values.includes(row[filter.field]);
      }),
    );
  }

  function buildClient(state: typeof serviceState) {
    return {
      from(table: string) {
        const filters: Array<{ field: string; type: "eq" | "in" | "gte"; value: unknown }> = [];
        let limitValue: number | null = null;

        const query = {
          select() {
            return this;
          },
          eq(field: string, value: unknown) {
            filters.push({ field, type: "eq", value });
            return this;
          },
          gte(field: string, value: unknown) {
            filters.push({ field, type: "gte", value });
            return this;
          },
          in(field: string, value: unknown[]) {
            filters.push({ field, type: "in", value });
            return this;
          },
          neq() {
            return this;
          },
          is() {
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
  applyEffectiveCampaignClientSlugs: vi.fn(async (rows: unknown[]) => rows),
  listEffectiveCampaignIdsForClientSlug: vi.fn().mockResolvedValue(["cmp_1"]),
}));

vi.mock("@/features/approvals/server", () => ({
  listApprovalRequests: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/features/conversations/server", () => ({
  listConversationThreads: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/features/crm-follow-up-items/server", () => ({
  listCrmFollowUpItems: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/features/assets/server", () => ({
  listAssetLibrary: vi.fn(),
}));

vi.mock("@/features/assets/summary", () => ({
  buildAssetLibrarySummary: vi.fn(),
}));

import { getDashboardOpsSummary } from "@/features/dashboard/server";

describe("dashboard read clients", () => {
  beforeEach(() => {
    createClerkSupabaseClient.mockReset();
    currentUser.mockReset();
    serviceState.campaign_action_items = [];
    serviceState.campaign_comments = [];
    serviceState.meta_campaigns = [];
    serviceState.system_events = [];
    userScopedState.campaign_action_items = [];
    userScopedState.campaign_comments = [];
    userScopedState.meta_campaigns = [];
    userScopedState.system_events = [];
    currentUser.mockResolvedValue({ publicMetadata: { role: "member" } });
    createClerkSupabaseClient.mockResolvedValue(null);
  });

  it("prefers the Clerk-scoped client for client dashboard summaries", async () => {
    serviceState.meta_campaigns = [
      { campaign_id: "cmp_1", client_slug: "zamora", name: "Service Campaign", status: "ACTIVE" },
    ];
    userScopedState.meta_campaigns = [
      { campaign_id: "cmp_1", client_slug: "zamora", name: "RLS Campaign", status: "ACTIVE" },
    ];
    userScopedState.campaign_action_items = [
      {
        campaign_id: "cmp_1",
        client_slug: "zamora",
        priority: "urgent",
        status: "todo",
        updated_at: "2026-03-07T12:00:00.000Z",
        visibility: "shared",
      },
    ];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);

    const summary = await getDashboardOpsSummary({
      clientSlug: "zamora",
      limit: 4,
      mode: "client",
      scopeCampaignIds: ["cmp_1"],
    });

    expect(summary.attentionCampaigns[0]?.campaignId).toBe("cmp_1");
    expect(summary.attentionCampaigns[0]?.name).toBe("RLS Campaign");
  });

  it("keeps admin viewers on the service role for client dashboard summaries", async () => {
    currentUser.mockResolvedValue({ publicMetadata: { role: "admin" } });
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);
    serviceState.meta_campaigns = [
      { campaign_id: "cmp_1", client_slug: "zamora", name: "Service Campaign", status: "ACTIVE" },
    ];
    serviceState.campaign_action_items = [
      {
        campaign_id: "cmp_1",
        client_slug: "zamora",
        priority: "urgent",
        status: "todo",
        updated_at: "2026-03-07T12:00:00.000Z",
        visibility: "shared",
      },
    ];

    const summary = await getDashboardOpsSummary({
      clientSlug: "zamora",
      limit: 4,
      mode: "client",
      scopeCampaignIds: ["cmp_1"],
    });

    expect(summary.attentionCampaigns[0]?.name).toBe("Service Campaign");
    expect(createClerkSupabaseClient).not.toHaveBeenCalled();
  });
});
