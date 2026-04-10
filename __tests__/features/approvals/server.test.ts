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
    approval_requests: [] as Record<string, unknown>[],
  };

  const userScopedState = {
    approval_requests: [] as Record<string, unknown>[],
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

vi.mock("@/lib/campaign-client-assignment", () => ({
  listEffectiveCampaignIdsForClientSlug,
}));

vi.mock("@/lib/supabase", () => ({
  createClerkSupabaseClient,
  getFeatureReadClient,
  supabaseAdmin,
}));

vi.mock("@/features/assets/server", () => ({
  listVisibleAssetIdsForScope,
}));

import {
  listApprovalRequests,
  listCampaignApprovalRequests,
  listEventApprovalRequests,
} from "@/features/approvals/server";

describe("listApprovalRequests", () => {
  beforeEach(() => {
    createClerkSupabaseClient.mockReset();
    currentUser.mockReset();
    listEffectiveCampaignIdsForClientSlug.mockReset();
    listVisibleAssetIdsForScope.mockReset();
    serviceState.approval_requests = [];
    userScopedState.approval_requests = [];
    currentUser.mockResolvedValue({ publicMetadata: { role: "member" } });
    createClerkSupabaseClient.mockResolvedValue(null);
    listEffectiveCampaignIdsForClientSlug.mockResolvedValue([]);
  });

  it("prefers the Clerk-scoped client for client approval lists", async () => {
    serviceState.approval_requests = [
      {
        id: "approval_service",
        client_slug: "zamora",
        audience: "shared",
        request_type: "asset_review",
        status: "pending",
        title: "Service approval",
        created_at: "2026-03-06T12:00:00.000Z",
        updated_at: "2026-03-06T12:00:00.000Z",
        metadata: {},
      },
    ];
    userScopedState.approval_requests = [
      {
        id: "approval_rls",
        client_slug: "zamora",
        audience: "shared",
        request_type: "asset_review",
        status: "pending",
        title: "RLS approval",
        created_at: "2026-03-06T12:01:00.000Z",
        updated_at: "2026-03-06T12:01:00.000Z",
        metadata: {},
      },
    ];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);

    const approvals = await listApprovalRequests({
      audience: "shared",
      clientSlug: "zamora",
      status: "pending",
    });

    expect(approvals.map((approval) => approval.id)).toEqual(["approval_rls"]);
  });

  it("keeps the reassigned-campaign fallback on the service role", async () => {
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);
    listEffectiveCampaignIdsForClientSlug.mockResolvedValue(["cmp_1"]);
    serviceState.approval_requests = [
      {
        id: "approval_reassigned",
        client_slug: "legacy",
        audience: "shared",
        request_type: "asset_review",
        status: "pending",
        title: "Legacy slug approval",
        entity_type: "campaign",
        entity_id: "cmp_1",
        created_at: "2026-03-06T12:00:00.000Z",
        updated_at: "2026-03-06T12:00:00.000Z",
        metadata: {},
      },
    ];

    const approvals = await listApprovalRequests({
      audience: "shared",
      clientSlug: "zamora",
      status: "pending",
    });

    expect(approvals.map((approval) => approval.id)).toEqual(["approval_reassigned"]);
  });

  it("keeps admin viewers on the service role for client-scoped approval lists", async () => {
    currentUser.mockResolvedValue({ publicMetadata: { role: "admin" } });
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);
    serviceState.approval_requests = [
      {
        id: "approval_admin",
        client_slug: "zamora",
        audience: "shared",
        request_type: "asset_review",
        status: "pending",
        title: "Admin approval",
        created_at: "2026-03-06T12:00:00.000Z",
        updated_at: "2026-03-06T12:00:00.000Z",
        metadata: {},
      },
    ];
    userScopedState.approval_requests = [
      {
        id: "approval_rls",
        client_slug: "zamora",
        audience: "shared",
        request_type: "asset_review",
        status: "pending",
        title: "RLS approval",
        created_at: "2026-03-06T12:01:00.000Z",
        updated_at: "2026-03-06T12:01:00.000Z",
        metadata: {},
      },
    ];

    const approvals = await listApprovalRequests({
      audience: "shared",
      clientSlug: "zamora",
      status: "pending",
    });

    expect(approvals.map((approval) => approval.id)).toEqual(["approval_admin"]);
    expect(createClerkSupabaseClient).not.toHaveBeenCalled();
  });
});

describe("listCampaignApprovalRequests", () => {
  beforeEach(() => {
    createClerkSupabaseClient.mockReset();
    currentUser.mockReset();
    listEffectiveCampaignIdsForClientSlug.mockReset();
    listVisibleAssetIdsForScope.mockReset();
    serviceState.approval_requests = [];
    userScopedState.approval_requests = [];
    currentUser.mockResolvedValue({ publicMetadata: { role: "member" } });
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);
    listEffectiveCampaignIdsForClientSlug.mockResolvedValue([]);
  });

  it("keeps client campaign approval helpers on the Clerk-scoped client", async () => {
    serviceState.approval_requests = [
      {
        id: "approval_service",
        client_slug: "zamora",
        audience: "shared",
        request_type: "campaign_review",
        status: "pending",
        title: "Service approval",
        entity_type: "campaign",
        entity_id: "cmp_1",
        created_at: "2026-03-06T12:00:00.000Z",
        updated_at: "2026-03-06T12:00:00.000Z",
        metadata: {},
      },
    ];
    userScopedState.approval_requests = [
      {
        id: "approval_rls",
        client_slug: "zamora",
        audience: "shared",
        request_type: "campaign_review",
        status: "pending",
        title: "RLS approval",
        entity_type: "campaign",
        entity_id: "cmp_1",
        created_at: "2026-03-06T12:01:00.000Z",
        updated_at: "2026-03-06T12:01:00.000Z",
        metadata: {},
      },
    ];

    const approvals = await listCampaignApprovalRequests({
      audience: "shared",
      campaignId: "cmp_1",
      clientSlug: "zamora",
      status: "pending",
    });

    expect(approvals.map((approval) => approval.id)).toEqual(["approval_rls"]);
  });
});

describe("listEventApprovalRequests", () => {
  beforeEach(() => {
    createClerkSupabaseClient.mockReset();
    currentUser.mockReset();
    listEffectiveCampaignIdsForClientSlug.mockReset();
    listVisibleAssetIdsForScope.mockReset();
    serviceState.approval_requests = [];
    userScopedState.approval_requests = [];
    currentUser.mockResolvedValue({ publicMetadata: { role: "member" } });
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);
    listEffectiveCampaignIdsForClientSlug.mockResolvedValue([]);
  });

  it("keeps event approval helpers event-aware across event and linked campaign approvals", async () => {
    userScopedState.approval_requests = [
      {
        id: "approval_event",
        client_slug: "zamora",
        audience: "shared",
        request_type: "event_review",
        status: "pending",
        title: "Event approval",
        entity_type: "event",
        entity_id: "evt_1",
        created_at: "2026-03-06T12:00:00.000Z",
        updated_at: "2026-03-06T12:00:00.000Z",
        metadata: {},
      },
      {
        id: "approval_campaign",
        client_slug: "zamora",
        audience: "shared",
        request_type: "campaign_review",
        status: "pending",
        title: "Campaign approval",
        entity_type: "campaign",
        entity_id: "cmp_1",
        created_at: "2026-03-06T12:01:00.000Z",
        updated_at: "2026-03-06T12:01:00.000Z",
        metadata: {},
      },
    ];

    const approvals = await listEventApprovalRequests({
      audience: "shared",
      campaignIds: ["cmp_1"],
      clientSlug: "zamora",
      eventId: "evt_1",
      status: "pending",
    });

    expect(approvals.map((approval) => approval.id)).toEqual([
      "approval_event",
      "approval_campaign",
    ]);
  });
});
