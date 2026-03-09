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
    system_events: [] as Record<string, unknown>[],
  };

  const userScopedState = {
    system_events: [] as Record<string, unknown>[],
  };

  function applyFilters(
    rows: Record<string, unknown>[],
    filters: Array<{ field: string; value: unknown }>,
  ) {
    return rows.filter((row) => filters.every((filter) => row[filter.field] === filter.value));
  }

  function buildClient(state: typeof serviceState) {
    return {
      from(table: string) {
        const filters: Array<{ field: string; value: unknown }> = [];
        let limitValue: number | null = null;

        const query = {
          select() {
            return this;
          },
          eq(field: string, value: unknown) {
            filters.push({ field, value });
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

vi.mock("@/features/assets/server", () => ({
  listVisibleAssetIdsForScope: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  createClerkSupabaseClient,
  supabaseAdmin,
}));

import { listSystemEvents } from "@/features/system-events/server";

describe("listSystemEvents", () => {
  beforeEach(() => {
    createClerkSupabaseClient.mockReset();
    currentUser.mockReset();
    serviceState.system_events = [];
    userScopedState.system_events = [];
    currentUser.mockResolvedValue({ publicMetadata: { role: "member" } });
    createClerkSupabaseClient.mockResolvedValue(null);
  });

  it("prefers the Clerk-scoped client for client-scoped event lists", async () => {
    serviceState.system_events = [
      {
        id: "evt_service",
        created_at: "2026-03-06T12:00:00.000Z",
        event_name: "campaign_updated",
        visibility: "shared",
        actor_type: "user",
        actor_id: "user_1",
        actor_name: "Service",
        client_slug: "zamora",
        summary: "Service event",
        detail: null,
        entity_type: "campaign",
        entity_id: "cmp_1",
        metadata: {},
      },
    ];
    userScopedState.system_events = [
      {
        id: "evt_rls",
        created_at: "2026-03-06T12:01:00.000Z",
        event_name: "campaign_updated",
        visibility: "shared",
        actor_type: "user",
        actor_id: "user_1",
        actor_name: "RLS",
        client_slug: "zamora",
        summary: "RLS event",
        detail: null,
        entity_type: "campaign",
        entity_id: "cmp_1",
        metadata: {},
      },
    ];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);

    const events = await listSystemEvents({
      audience: "shared",
      clientSlug: "zamora",
    });

    expect(events.map((event) => event.id)).toEqual(["evt_rls"]);
  });

  it("keeps admin viewers on the service role for client-scoped event lists", async () => {
    currentUser.mockResolvedValue({ publicMetadata: { role: "admin" } });
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);
    serviceState.system_events = [
      {
        id: "evt_admin",
        created_at: "2026-03-06T12:00:00.000Z",
        event_name: "campaign_updated",
        visibility: "shared",
        actor_type: "user",
        actor_id: "user_1",
        actor_name: "Admin",
        client_slug: "zamora",
        summary: "Admin event",
        detail: null,
        entity_type: "campaign",
        entity_id: "cmp_1",
        metadata: {},
      },
    ];
    userScopedState.system_events = [
      {
        id: "evt_rls",
        created_at: "2026-03-06T12:01:00.000Z",
        event_name: "campaign_updated",
        visibility: "shared",
        actor_type: "user",
        actor_id: "user_1",
        actor_name: "RLS",
        client_slug: "zamora",
        summary: "RLS event",
        detail: null,
        entity_type: "campaign",
        entity_id: "cmp_1",
        metadata: {},
      },
    ];

    const events = await listSystemEvents({
      audience: "shared",
      clientSlug: "zamora",
    });

    expect(events.map((event) => event.id)).toEqual(["evt_admin"]);
    expect(createClerkSupabaseClient).not.toHaveBeenCalled();
  });
});
