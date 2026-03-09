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
    event_comments: [] as Record<string, unknown>[],
    event_follow_up_items: [] as Record<string, unknown>[],
    tm_events: [] as Record<string, unknown>[],
  };

  const userScopedState = {
    event_comments: [] as Record<string, unknown>[],
    event_follow_up_items: [] as Record<string, unknown>[],
    tm_events: [] as Record<string, unknown>[],
  };

  function applyFilters(
    rows: Record<string, unknown>[],
    filters: Array<{ field: string; type: "eq" | "in" | "is" | "neq"; value: unknown }>,
  ) {
    return rows.filter((row) =>
      filters.every((filter) => {
        if (filter.type === "eq") {
          return row[filter.field] === filter.value;
        }

        if (filter.type === "neq") {
          return row[filter.field] !== filter.value;
        }

        if (filter.type === "is") {
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
        const filters: Array<{ field: string; type: "eq" | "in" | "is" | "neq"; value: unknown }> =
          [];
        let limitValue: number | null = null;

        const query = {
          select() {
            return this;
          },
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

vi.mock("@/features/system-events/server", () => ({
  listSystemEvents: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/features/dashboard/server", () => ({
  getDashboardActionCenter: vi.fn(),
}));

vi.mock("@/features/agent-outcomes/server", () => ({
  listAgentOutcomes: vi.fn(),
}));

import { getEventOperationsSummary } from "@/features/events/server";

function makeEvent(id: string, name: string) {
  return {
    artist: name,
    client_slug: "zamora",
    date: "2026-04-01T00:00:00.000Z",
    id,
    name,
    status: "onsale",
    venue: "Arena",
  };
}

describe("event read clients", () => {
  beforeEach(() => {
    createClerkSupabaseClient.mockReset();
    currentUser.mockReset();
    serviceState.event_comments = [];
    serviceState.event_follow_up_items = [];
    serviceState.tm_events = [];
    userScopedState.event_comments = [];
    userScopedState.event_follow_up_items = [];
    userScopedState.tm_events = [];
    currentUser.mockResolvedValue({ publicMetadata: { role: "member" } });
    createClerkSupabaseClient.mockResolvedValue(null);
  });

  it("prefers the Clerk-scoped client for client event summaries", async () => {
    serviceState.tm_events = [makeEvent("evt_service", "Service Event")];
    userScopedState.tm_events = [makeEvent("evt_rls", "RLS Event")];
    serviceState.event_follow_up_items = [
      {
        client_slug: "zamora",
        event_id: "evt_service",
        priority: "urgent",
        status: "todo",
        updated_at: "2026-03-07T10:00:00.000Z",
        visibility: "shared",
      },
    ];
    userScopedState.event_follow_up_items = [
      {
        client_slug: "zamora",
        event_id: "evt_rls",
        priority: "urgent",
        status: "todo",
        updated_at: "2026-03-07T11:00:00.000Z",
        visibility: "shared",
      },
    ];
    serviceState.event_comments = [
      {
        client_slug: "zamora",
        created_at: "2026-03-07T10:30:00.000Z",
        event_id: "evt_service",
        parent_comment_id: null,
        resolved: false,
        visibility: "shared",
      },
    ];
    userScopedState.event_comments = [
      {
        client_slug: "zamora",
        created_at: "2026-03-07T11:30:00.000Z",
        event_id: "evt_rls",
        parent_comment_id: null,
        resolved: false,
        visibility: "shared",
      },
    ];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);

    const summary = await getEventOperationsSummary({
      clientSlug: "zamora",
      limit: 4,
      mode: "client",
    });

    expect(summary.attentionEvents[0]?.eventId).toBe("evt_rls");
    expect(summary.metrics.find((metric) => metric.key === "open_follow_ups")?.value).toBe(1);
    expect(summary.metrics.find((metric) => metric.key === "open_discussions")?.value).toBe(1);
  });

  it("keeps admin users on the service role for client event summaries", async () => {
    currentUser.mockResolvedValue({ publicMetadata: { role: "admin" } });
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);
    serviceState.tm_events = [makeEvent("evt_service", "Service Event")];
    serviceState.event_follow_up_items = [
      {
        client_slug: "zamora",
        event_id: "evt_service",
        priority: "urgent",
        status: "todo",
        updated_at: "2026-03-07T10:00:00.000Z",
        visibility: "shared",
      },
    ];

    const summary = await getEventOperationsSummary({
      clientSlug: "zamora",
      limit: 4,
      mode: "client",
    });

    expect(summary.attentionEvents[0]?.eventId).toBe("evt_service");
    expect(createClerkSupabaseClient).not.toHaveBeenCalled();
  });
});
