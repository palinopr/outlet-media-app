import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  createClerkSupabaseClient,
  currentUser,
  getFeatureReadClient,
  serviceState,
  supabaseAdmin,
  userScopedState,
  userScopedSupabase,
} = vi.hoisted(() => {
  const serviceState = {
    ad_assets: [] as Record<string, unknown>[],
    asset_comments: [] as Record<string, unknown>[],
    asset_follow_up_items: [] as Record<string, unknown>[],
    campaign_action_items: [] as Record<string, unknown>[],
    campaign_comments: [] as Record<string, unknown>[],
    crm_comments: [] as Record<string, unknown>[],
    crm_contacts: [] as Record<string, unknown>[],
    crm_follow_up_items: [] as Record<string, unknown>[],
    event_comments: [] as Record<string, unknown>[],
    event_follow_up_items: [] as Record<string, unknown>[],
    meta_campaigns: [] as Record<string, unknown>[],
    tm_events: [] as Record<string, unknown>[],
  };

  const userScopedState = {
    ad_assets: [] as Record<string, unknown>[],
    asset_comments: [] as Record<string, unknown>[],
    asset_follow_up_items: [] as Record<string, unknown>[],
    campaign_action_items: [] as Record<string, unknown>[],
    campaign_comments: [] as Record<string, unknown>[],
    crm_comments: [] as Record<string, unknown>[],
    crm_contacts: [] as Record<string, unknown>[],
    crm_follow_up_items: [] as Record<string, unknown>[],
    event_comments: [] as Record<string, unknown>[],
    event_follow_up_items: [] as Record<string, unknown>[],
    meta_campaigns: [] as Record<string, unknown>[],
    tm_events: [] as Record<string, unknown>[],
  };

  function applyFilters(
    rows: Record<string, unknown>[],
    filters: Array<{ field: string; type: "eq" | "in" | "is"; value: unknown }>,
  ) {
    return rows.filter((row) =>
      filters.every((filter) => {
        if (filter.type === "eq" || filter.type === "is") {
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
        const filters: Array<{ field: string; type: "eq" | "in" | "is"; value: unknown }> = [];
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
          is(field: string, value: unknown) {
            filters.push({ field, type: "is", value });
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

vi.mock("@/features/assets/server", () => ({
  listVisibleAssetIdsForScope: vi.fn().mockResolvedValue(new Set<string>()),
}));

vi.mock("@/lib/campaign-client-assignment", () => ({
  listEffectiveCampaignIdsForClientSlug: vi.fn().mockResolvedValue(["cmp_1"]),
}));

import { listConversationThreads } from "@/features/conversations/server";

describe("conversation read clients", () => {
  beforeEach(() => {
    createClerkSupabaseClient.mockReset();
    currentUser.mockReset();
    for (const table of Object.keys(serviceState) as Array<keyof typeof serviceState>) {
      serviceState[table] = [];
      userScopedState[table] = [];
    }
    currentUser.mockResolvedValue({ publicMetadata: { role: "member" } });
    createClerkSupabaseClient.mockResolvedValue(null);
  });

  it("prefers the Clerk-scoped client for client campaign threads and names", async () => {
    serviceState.campaign_comments = [
      {
        id: "comment_service",
        campaign_id: "cmp_1",
        client_slug: "zamora",
        author_name: "Service",
        content: "Service thread",
        resolved: false,
        parent_comment_id: null,
        visibility: "shared",
        created_at: "2026-03-07T12:00:00.000Z",
      },
    ];
    serviceState.meta_campaigns = [
      { campaign_id: "cmp_1", name: "Service Campaign" },
    ];
    userScopedState.campaign_comments = [
      {
        id: "comment_rls",
        campaign_id: "cmp_1",
        client_slug: "zamora",
        author_name: "RLS",
        content: "RLS thread",
        resolved: false,
        parent_comment_id: null,
        visibility: "shared",
        created_at: "2026-03-07T12:01:00.000Z",
      },
    ];
    userScopedState.meta_campaigns = [
      { campaign_id: "cmp_1", name: "RLS Campaign" },
    ];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);

    const threads = await listConversationThreads({
      clientSlug: "zamora",
      limit: 4,
      mode: "client",
      scope: { allowedCampaignIds: ["cmp_1"], allowedEventIds: null },
    });

    expect(threads).toEqual([
      expect.objectContaining({
        id: "comment_rls",
        kind: "campaign",
        targetName: "RLS Campaign",
      }),
    ]);
  });

  it("keeps admin viewers on the service role for client conversation threads", async () => {
    currentUser.mockResolvedValue({ publicMetadata: { role: "admin" } });
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);
    serviceState.campaign_comments = [
      {
        id: "comment_service",
        campaign_id: "cmp_1",
        client_slug: "zamora",
        author_name: "Service",
        content: "Service thread",
        resolved: false,
        parent_comment_id: null,
        visibility: "shared",
        created_at: "2026-03-07T12:00:00.000Z",
      },
    ];
    serviceState.meta_campaigns = [
      { campaign_id: "cmp_1", name: "Service Campaign" },
    ];

    const threads = await listConversationThreads({
      clientSlug: "zamora",
      limit: 4,
      mode: "client",
      scope: { allowedCampaignIds: ["cmp_1"], allowedEventIds: null },
    });

    expect(threads).toEqual([
      expect.objectContaining({
        id: "comment_service",
        targetName: "Service Campaign",
      }),
    ]);
    expect(createClerkSupabaseClient).not.toHaveBeenCalled();
  });
});
