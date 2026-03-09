import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  authGuard,
  getWorkspaceReadClient,
  logSystemEvent,
  pageReadState,
  readClient,
  requireWorkspaceClientAccess,
  revalidateWorkspaceMutationTargets,
  supabaseAdmin,
  validateRequest,
} = vi.hoisted(() => {
  const pageReadState = {
    workspace_pages: [] as Record<string, unknown>[],
  };

  const readClient = {
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
        then(resolve: (value: { data: Record<string, unknown>[]; error: null }) => unknown) {
          const rows = (pageReadState[table as keyof typeof pageReadState] ?? []).filter((row) =>
            filters.every((filter) => row[filter.field] === filter.value),
          );
          return Promise.resolve({ data: rows, error: null }).then(resolve);
        },
      };

      return query;
    },
  };

  return {
    authGuard: vi.fn(),
    getWorkspaceReadClient: vi.fn(),
    logSystemEvent: vi.fn(),
    pageReadState,
    readClient,
    requireWorkspaceClientAccess: vi.fn(),
    revalidateWorkspaceMutationTargets: vi.fn(),
    supabaseAdmin: {
      from: vi.fn((table: string) => {
        if (table === "workspace_pages") {
          return {
            insert: vi.fn(() => ({
              select: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: {
                    id: "page_1",
                    title: "Launch brief",
                  },
                  error: null,
                }),
              })),
            })),
          };
        }

        return {};
      }),
    },
    validateRequest: vi.fn(),
  };
});

vi.mock("@/lib/api-helpers", () => ({
  apiError: (message: string, status = 500) =>
    Response.json({ error: message }, { status }),
  authGuard,
  validateRequest,
}));

vi.mock("@/features/system-events/server", () => ({
  logSystemEvent,
}));

vi.mock("@/features/workflow/revalidation", () => ({
  revalidateWorkspaceMutationTargets,
}));

vi.mock("@/features/workspace/access", () => ({
  requireWorkspaceClientAccess,
}));

vi.mock("@/features/workspace/server", () => ({
  getWorkspaceReadClient,
}));

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin,
}));

describe("workspace pages route", () => {
  beforeEach(() => {
    vi.resetModules();
    authGuard.mockReset();
    getWorkspaceReadClient.mockReset();
    logSystemEvent.mockReset();
    pageReadState.workspace_pages = [];
    requireWorkspaceClientAccess.mockReset();
    revalidateWorkspaceMutationTargets.mockReset();
    supabaseAdmin.from.mockClear();
    validateRequest.mockReset();
    getWorkspaceReadClient.mockResolvedValue(readClient);
  });

  it("uses the workspace read client for page lists", async () => {
    authGuard.mockResolvedValue({ error: null, userId: "user_1" });
    requireWorkspaceClientAccess.mockResolvedValue({ clientSlug: "zamora" });
    pageReadState.workspace_pages = [
      { client_slug: "zamora", id: "page_rls", title: "RLS page" },
      { client_slug: "kybba", id: "page_other", title: "Other page" },
    ];

    const { GET } = await import("./route");
    const response = await GET(
      new Request("https://example.com/api/workspace/pages?client_slug=zamora"),
    );
    const payload = (await response.json()) as { pages: Array<{ id: string }> };

    expect(response.status).toBe(200);
    expect(payload.pages.map((page) => page.id)).toEqual(["page_rls"]);
    expect(getWorkspaceReadClient).toHaveBeenCalledWith("zamora");
  });

  it("revalidates workspace surfaces when creating a page", async () => {
    authGuard.mockResolvedValue({ error: null, userId: "user_1" });
    requireWorkspaceClientAccess.mockResolvedValue({ clientSlug: "zamora" });
    validateRequest.mockResolvedValue({
      data: {
        client_slug: "zamora",
        title: "Launch brief",
      },
      error: null,
    });

    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://example.com/api/workspace/pages", {
        body: JSON.stringify({}),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }),
    );

    expect(response.status).toBe(201);
    expect(logSystemEvent).toHaveBeenCalled();
    expect(revalidateWorkspaceMutationTargets).toHaveBeenCalledWith({
      clientSlug: "zamora",
      includeActivity: true,
      pageIds: ["page_1"],
    });
  });
});
