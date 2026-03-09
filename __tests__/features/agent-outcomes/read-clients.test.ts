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
    agent_tasks: [] as Record<string, unknown>[],
    asset_follow_up_items: [] as Record<string, unknown>[],
    campaign_action_items: [] as Record<string, unknown>[],
    crm_follow_up_items: [] as Record<string, unknown>[],
    event_follow_up_items: [] as Record<string, unknown>[],
    system_events: [] as Record<string, unknown>[],
  };

  const userScopedState = {
    agent_tasks: [] as Record<string, unknown>[],
    asset_follow_up_items: [] as Record<string, unknown>[],
    campaign_action_items: [] as Record<string, unknown>[],
    crm_follow_up_items: [] as Record<string, unknown>[],
    event_follow_up_items: [] as Record<string, unknown>[],
    system_events: [] as Record<string, unknown>[],
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

vi.mock("@/features/assets/server", () => ({
  listVisibleAssetIdsForScope: vi.fn(),
}));

import { listAgentOutcomes } from "@/features/agent-outcomes/server";

function makeRequest(taskId: string, summary: string) {
  return {
    client_slug: "zamora",
    created_at: "2026-03-07T12:00:00.000Z",
    detail: null,
    entity_id: taskId,
    entity_type: "agent_task",
    event_name: "agent_action_requested",
    metadata: {
      campaignId: "cmp_1",
      campaignName: "Campaign One",
    },
    summary,
    visibility: "shared",
  };
}

function makeTask(id: string, action: string) {
  return {
    action,
    completed_at: null,
    created_at: "2026-03-07T12:00:00.000Z",
    error: null,
    from_agent: "boss",
    id,
    params: {},
    result: null,
    started_at: null,
    status: "pending",
    to_agent: "assistant",
  };
}

describe("agent outcomes read clients", () => {
  beforeEach(() => {
    createClerkSupabaseClient.mockReset();
    currentUser.mockReset();
    serviceState.agent_tasks = [];
    serviceState.asset_follow_up_items = [];
    serviceState.campaign_action_items = [];
    serviceState.crm_follow_up_items = [];
    serviceState.event_follow_up_items = [];
    serviceState.system_events = [];
    userScopedState.agent_tasks = [];
    userScopedState.asset_follow_up_items = [];
    userScopedState.campaign_action_items = [];
    userScopedState.crm_follow_up_items = [];
    userScopedState.event_follow_up_items = [];
    userScopedState.system_events = [];
    currentUser.mockResolvedValue({ publicMetadata: { role: "member" } });
    createClerkSupabaseClient.mockResolvedValue(null);
  });

  it("prefers the Clerk-scoped client for shared client outcomes", async () => {
    serviceState.system_events = [makeRequest("task_service", "Service request")];
    serviceState.agent_tasks = [makeTask("task_service", "service-action")];
    userScopedState.system_events = [makeRequest("task_rls", "RLS request")];
    userScopedState.agent_tasks = [makeTask("task_rls", "rls-action")];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);

    const outcomes = await listAgentOutcomes({
      audience: "shared",
      clientSlug: "zamora",
      limit: 4,
    });

    expect(outcomes.map((outcome) => outcome.taskId)).toEqual(["task_rls"]);
    expect(outcomes[0]?.action).toBe("rls-action");
  });

  it("keeps admin viewers on the service role for client outcomes", async () => {
    currentUser.mockResolvedValue({ publicMetadata: { role: "admin" } });
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);
    serviceState.system_events = [makeRequest("task_service", "Service request")];
    serviceState.agent_tasks = [makeTask("task_service", "service-action")];
    userScopedState.system_events = [makeRequest("task_rls", "RLS request")];
    userScopedState.agent_tasks = [makeTask("task_rls", "rls-action")];

    const outcomes = await listAgentOutcomes({
      audience: "shared",
      clientSlug: "zamora",
      limit: 4,
    });

    expect(outcomes.map((outcome) => outcome.taskId)).toEqual(["task_service"]);
    expect(createClerkSupabaseClient).not.toHaveBeenCalled();
  });
});
