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
    workspace_pages: [] as Record<string, unknown>[],
    workspace_tasks: [] as Record<string, unknown>[],
  };

  const userScopedState = {
    workspace_pages: [] as Record<string, unknown>[],
    workspace_tasks: [] as Record<string, unknown>[],
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
          async single() {
            const rows = applyFilters(
              (state[table as keyof typeof state] ?? []) as Record<string, unknown>[],
              filters,
            );
            return { data: rows[0] ?? null, error: null };
          },
          then(
            resolve: (value: { data: Record<string, unknown>[]; error: null }) => unknown,
          ) {
            const rows = applyFilters(
              (state[table as keyof typeof state] ?? []) as Record<string, unknown>[],
              filters,
            );
            return Promise.resolve({ data: rows, error: null }).then(resolve);
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

import {
  getWorkspacePage,
  getWorkspacePages,
  getWorkspaceTasks,
} from "@/features/workspace/server";

describe("workspace server reads", () => {
  beforeEach(() => {
    createClerkSupabaseClient.mockReset();
    currentUser.mockReset();
    serviceState.workspace_pages = [];
    serviceState.workspace_tasks = [];
    userScopedState.workspace_pages = [];
    userScopedState.workspace_tasks = [];
    createClerkSupabaseClient.mockResolvedValue(null);
    currentUser.mockResolvedValue({ publicMetadata: { role: "member" } });
  });

  it("uses the Clerk-scoped client for non-admin client workspace page lists", async () => {
    serviceState.workspace_pages = [
      { id: "page_service", title: "Service page", client_slug: "zamora" },
    ];
    userScopedState.workspace_pages = [
      { id: "page_rls", title: "RLS page", client_slug: "zamora" },
    ];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);

    const result = await getWorkspacePages("zamora");

    expect(result.pages.map((page) => page.id)).toEqual(["page_rls"]);
  });

  it("keeps admin workspace page reads on the service-role client", async () => {
    serviceState.workspace_pages = [
      { id: "page_admin", title: "Admin page", client_slug: "admin" },
    ];
    userScopedState.workspace_pages = [
      { id: "page_rls", title: "RLS page", client_slug: "admin" },
    ];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);

    const page = await getWorkspacePage("page_admin", "admin");

    expect(page?.id).toBe("page_admin");
    expect(createClerkSupabaseClient).not.toHaveBeenCalled();
  });

  it("keeps admin viewers on the service-role client for client-scoped task lists", async () => {
    serviceState.workspace_tasks = [
      { id: "task_admin", title: "Admin task", client_slug: "zamora" },
    ];
    userScopedState.workspace_tasks = [
      { id: "task_rls", title: "RLS task", client_slug: "zamora" },
    ];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);
    currentUser.mockResolvedValue({ publicMetadata: { role: "admin" } });

    const tasks = await getWorkspaceTasks("zamora");

    expect(tasks.map((task) => task.id)).toEqual(["task_admin"]);
  });
});
