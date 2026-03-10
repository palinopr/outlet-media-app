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
    event_follow_up_items: [] as Record<string, unknown>[],
    tm_events: [] as Record<string, unknown>[],
  };

  const userScopedState = {
    event_follow_up_items: [] as Record<string, unknown>[],
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

import { listEventFollowUpItems } from "@/features/event-follow-up-items/server";

describe("event follow-up items read clients", () => {
  beforeEach(() => {
    createClerkSupabaseClient.mockReset();
    currentUser.mockReset();
    serviceState.event_follow_up_items = [];
    serviceState.tm_events = [];
    userScopedState.event_follow_up_items = [];
    userScopedState.tm_events = [];
    currentUser.mockResolvedValue({ publicMetadata: { role: "member" } });
    createClerkSupabaseClient.mockResolvedValue(null);
  });

  it("prefers the Clerk-scoped client for shared event follow-up items", async () => {
    serviceState.event_follow_up_items = [
      {
        id: "item_service",
        event_id: "evt_1",
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
    serviceState.tm_events = [
      {
        id: "evt_1",
        name: "Service Event",
        artist: "Service Event",
        date: "2026-04-01T00:00:00.000Z",
        venue: "Arena",
      },
    ];
    userScopedState.event_follow_up_items = [
      {
        id: "item_rls",
        event_id: "evt_1",
        client_slug: "zamora",
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
    userScopedState.tm_events = [
      {
        id: "evt_1",
        name: "RLS Event",
        artist: "RLS Event",
        date: "2026-04-01T00:00:00.000Z",
        venue: "Arena",
      },
    ];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);

    const items = await listEventFollowUpItems({
      audience: "shared",
      eventId: "evt_1",
      limit: 10,
    });

    expect(items).toEqual([
      expect.objectContaining({
        eventName: "RLS Event",
        id: "item_rls",
      }),
    ]);
  });

  it("keeps admin viewers on the service role for shared event follow-up items", async () => {
    currentUser.mockResolvedValue({ publicMetadata: { role: "admin" } });
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);
    serviceState.event_follow_up_items = [
      {
        id: "item_service",
        event_id: "evt_1",
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
    serviceState.tm_events = [
      {
        id: "evt_1",
        name: "Service Event",
        artist: "Service Event",
        date: "2026-04-01T00:00:00.000Z",
        venue: "Arena",
      },
    ];

    const items = await listEventFollowUpItems({
      audience: "shared",
      eventId: "evt_1",
      limit: 10,
    });

    expect(items).toEqual([
      expect.objectContaining({
        eventName: "Service Event",
        id: "item_service",
      }),
    ]);
    expect(createClerkSupabaseClient).not.toHaveBeenCalled();
  });
});
