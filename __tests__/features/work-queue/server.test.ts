import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  createClerkSupabaseClient,
  currentUser,
  getFeatureReadClient,
  listEffectiveCampaignIdsForClientSlug,
  listVisibleAssetIdsForScope,
  serviceState,
  supabaseAdmin,
  userScopedState,
  userScopedSupabase,
} = vi.hoisted(() => {
  const serviceState = {
    ad_assets: [] as Record<string, unknown>[],
    campaign_action_items: [] as Record<string, unknown>[],
    crm_contacts: [] as Record<string, unknown>[],
    crm_follow_up_items: [] as Record<string, unknown>[],
    event_follow_up_items: [] as Record<string, unknown>[],
    meta_campaigns: [] as Record<string, unknown>[],
    tm_events: [] as Record<string, unknown>[],
    asset_follow_up_items: [] as Record<string, unknown>[],
  };

  const userScopedState = {
    ad_assets: [] as Record<string, unknown>[],
    campaign_action_items: [] as Record<string, unknown>[],
    crm_contacts: [] as Record<string, unknown>[],
    crm_follow_up_items: [] as Record<string, unknown>[],
    event_follow_up_items: [] as Record<string, unknown>[],
    meta_campaigns: [] as Record<string, unknown>[],
    tm_events: [] as Record<string, unknown>[],
    asset_follow_up_items: [] as Record<string, unknown>[],
  };

  function applyFilters(
    rows: Record<string, unknown>[],
    filters: Array<{ field: string; type: "eq" | "in" | "neq"; value: unknown }>,
  ) {
    return rows.filter((row) =>
      filters.every((filter) => {
        if (filter.type === "eq") {
          return row[filter.field] === filter.value;
        }
        if (filter.type === "neq") {
          return row[filter.field] !== filter.value;
        }

        const values = Array.isArray(filter.value) ? filter.value : [];
        return values.includes(row[filter.field]);
      }),
    );
  }

  function buildClient(state: typeof serviceState) {
    return {
      from(table: string) {
        const filters: Array<{ field: string; type: "eq" | "in" | "neq"; value: unknown }> = [];
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
          neq(field: string, value: unknown) {
            filters.push({ field, type: "neq", value });
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
    listEffectiveCampaignIdsForClientSlug: vi.fn(),
    listVisibleAssetIdsForScope: vi.fn(),
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
  listVisibleAssetIdsForScope,
}));

vi.mock("@/lib/campaign-client-assignment", () => ({
  listEffectiveCampaignIdsForClientSlug,
}));

import { getWorkQueue } from "@/features/work-queue/server";

describe("getWorkQueue", () => {
  beforeEach(() => {
    createClerkSupabaseClient.mockReset();
    currentUser.mockReset();
    listEffectiveCampaignIdsForClientSlug.mockReset();
    listVisibleAssetIdsForScope.mockReset();
    Object.keys(serviceState).forEach((key) => {
      (serviceState as Record<string, unknown[]>)[key] = [];
    });
    Object.keys(userScopedState).forEach((key) => {
      (userScopedState as Record<string, unknown[]>)[key] = [];
    });
    currentUser.mockResolvedValue({ publicMetadata: { role: "member" } });
    createClerkSupabaseClient.mockResolvedValue(null);
    listEffectiveCampaignIdsForClientSlug.mockResolvedValue(["cmp_service", "cmp_rls"]);
    listVisibleAssetIdsForScope.mockResolvedValue(null);
  });

  it("prefers the Clerk-scoped client for client queue reads and campaign labels", async () => {
    serviceState.campaign_action_items = [
      {
        id: "item_service",
        campaign_id: "cmp_service",
        client_slug: "zamora",
        title: "Service queue item",
        status: "todo",
        priority: "medium",
        visibility: "shared",
        updated_at: "2026-03-06T12:00:00.000Z",
      },
    ];
    serviceState.meta_campaigns = [
      {
        campaign_id: "cmp_service",
        name: "Service Campaign",
      },
    ];
    userScopedState.campaign_action_items = [
      {
        id: "item_rls",
        campaign_id: "cmp_rls",
        client_slug: "zamora",
        title: "RLS queue item",
        status: "todo",
        priority: "medium",
        visibility: "shared",
        updated_at: "2026-03-06T12:01:00.000Z",
      },
    ];
    userScopedState.meta_campaigns = [
      {
        campaign_id: "cmp_rls",
        name: "RLS Campaign",
      },
    ];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);

    const summary = await getWorkQueue({
      clientSlug: "zamora",
      limit: 6,
      mode: "client",
    });

    expect(summary.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          contextId: "cmp_rls",
          contextLabel: "RLS Campaign",
          id: "item_rls",
        }),
      ]),
    );
  });

  it("keeps admin viewers on the service role for client queue reads", async () => {
    currentUser.mockResolvedValue({ publicMetadata: { role: "admin" } });
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);
    serviceState.crm_follow_up_items = [
      {
        id: "crm_service",
        contact_id: "contact_service",
        client_slug: "zamora",
        title: "Service CRM item",
        status: "todo",
        priority: "medium",
        visibility: "shared",
        updated_at: "2026-03-06T12:00:00.000Z",
      },
    ];
    serviceState.crm_contacts = [
      {
        id: "contact_service",
        full_name: "Service Contact",
      },
    ];
    userScopedState.crm_follow_up_items = [
      {
        id: "crm_rls",
        contact_id: "contact_rls",
        client_slug: "zamora",
        title: "RLS CRM item",
        status: "todo",
        priority: "medium",
        visibility: "shared",
        updated_at: "2026-03-06T12:01:00.000Z",
      },
    ];
    userScopedState.crm_contacts = [
      {
        id: "contact_rls",
        full_name: "RLS Contact",
      },
    ];

    const summary = await getWorkQueue({
      clientSlug: "zamora",
      limit: 6,
      mode: "client",
    });

    expect(summary.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          contextId: "contact_service",
          contextLabel: "Service Contact",
          id: "crm_service",
        }),
      ]),
    );
    expect(createClerkSupabaseClient).not.toHaveBeenCalled();
  });
});
