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
    campaign_action_items: [] as Record<string, unknown>[],
  };

  const userScopedState = {
    campaign_action_items: [] as Record<string, unknown>[],
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
        let limitValue: number | null = null;

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

vi.mock("@/lib/agent-dispatch", () => ({
  enqueueExternalAgentTask: vi.fn(),
}));

vi.mock("@/features/notifications/workflow", () => ({
  notifyWorkflowAssignee: vi.fn(),
}));

vi.mock("@/features/system-events/server", () => ({
  logSystemEvent: vi.fn(),
  summarizeChangedFields: vi.fn(),
}));

import { listCampaignActionItems } from "@/features/campaign-action-items/server";

describe("campaign action items read clients", () => {
  beforeEach(() => {
    createClerkSupabaseClient.mockReset();
    currentUser.mockReset();
    serviceState.campaign_action_items = [];
    userScopedState.campaign_action_items = [];
    currentUser.mockResolvedValue({ publicMetadata: { role: "member" } });
    createClerkSupabaseClient.mockResolvedValue(null);
  });

  it("prefers the Clerk-scoped client for shared campaign action items", async () => {
    serviceState.campaign_action_items = [
      {
        id: "item_service",
        campaign_id: "cmp_1",
        client_slug: "zamora",
        title: "Service item",
        description: null,
        status: "todo",
        priority: "medium",
        visibility: "shared",
        assignee_id: null,
        assignee_name: null,
        due_date: null,
        created_by: "user_service",
        position: 0,
        source_entity_type: null,
        source_entity_id: null,
        created_at: "2026-03-07T12:00:00.000Z",
        updated_at: "2026-03-07T12:00:00.000Z",
      },
    ];
    userScopedState.campaign_action_items = [
      {
        id: "item_rls",
        campaign_id: "cmp_1",
        client_slug: "legacy",
        title: "RLS item",
        description: null,
        status: "todo",
        priority: "medium",
        visibility: "shared",
        assignee_id: null,
        assignee_name: null,
        due_date: null,
        created_by: "user_rls",
        position: 0,
        source_entity_type: null,
        source_entity_id: null,
        created_at: "2026-03-07T12:01:00.000Z",
        updated_at: "2026-03-07T12:01:00.000Z",
      },
    ];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);

    const items = await listCampaignActionItems({
      audience: "shared",
      campaignId: "cmp_1",
      clientSlug: "zamora",
    });

    expect(items.map((item) => item.id)).toEqual(["item_rls"]);
  });

  it("keeps admin viewers on the service role for shared campaign action items", async () => {
    currentUser.mockResolvedValue({ publicMetadata: { role: "admin" } });
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);
    serviceState.campaign_action_items = [
      {
        id: "item_service",
        campaign_id: "cmp_1",
        client_slug: "zamora",
        title: "Service item",
        description: null,
        status: "todo",
        priority: "medium",
        visibility: "shared",
        assignee_id: null,
        assignee_name: null,
        due_date: null,
        created_by: "user_service",
        position: 0,
        source_entity_type: null,
        source_entity_id: null,
        created_at: "2026-03-07T12:00:00.000Z",
        updated_at: "2026-03-07T12:00:00.000Z",
      },
    ];

    const items = await listCampaignActionItems({
      audience: "shared",
      campaignId: "cmp_1",
      clientSlug: "zamora",
    });

    expect(items.map((item) => item.id)).toEqual(["item_service"]);
    expect(createClerkSupabaseClient).not.toHaveBeenCalled();
  });
});
