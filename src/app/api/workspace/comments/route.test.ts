import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  authGuard,
  createNotification,
  currentUser,
  getWorkspaceReadClient,
  logSystemEvent,
  readState,
  readWorkspaceClient,
  requireWorkspaceClientAccess,
  revalidateWorkspaceMutationTargets,
  supabaseAdmin,
  validateRequest,
} = vi.hoisted(() => {
  const readState = {
    workspace_comments: [] as Record<string, unknown>[],
    workspace_pages: [] as Record<string, unknown>[],
  };

  const readWorkspaceClient = {
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
          const rows = (readState[table as keyof typeof readState] ?? []).filter((row) =>
            filters.every((filter) => row[filter.field] === filter.value),
          );
          return { data: rows[0] ?? null, error: null };
        },
        then(
          resolve: (value: { data: Record<string, unknown>[]; error: null }) => unknown,
        ) {
          const rows = (readState[table as keyof typeof readState] ?? []).filter((row) =>
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
    createNotification: vi.fn(),
    currentUser: vi.fn(),
    getWorkspaceReadClient: vi.fn(),
    logSystemEvent: vi.fn(),
    readState,
    readWorkspaceClient,
    requireWorkspaceClientAccess: vi.fn(),
    revalidateWorkspaceMutationTargets: vi.fn(),
    supabaseAdmin: {
      from: vi.fn((table: string) => {
        if (table === "workspace_pages") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: {
                    client_slug: "zamora",
                    created_by: "owner_1",
                    title: "Launch brief",
                  },
                  error: null,
                }),
              })),
            })),
          };
        }

        if (table === "workspace_comments") {
          return {
            insert: vi.fn(() => ({
              select: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: {
                    id: "comment_1",
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

vi.mock("@clerk/nextjs/server", () => ({
  currentUser,
}));

vi.mock("@/features/system-events/server", () => ({
  logSystemEvent,
}));

vi.mock("@/features/notifications/server", () => ({
  createNotification,
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

describe("workspace comments route", () => {
  beforeEach(() => {
    vi.resetModules();
    authGuard.mockReset();
    createNotification.mockReset();
    currentUser.mockReset();
    getWorkspaceReadClient.mockReset();
    logSystemEvent.mockReset();
    readState.workspace_comments = [];
    readState.workspace_pages = [];
    requireWorkspaceClientAccess.mockReset();
    revalidateWorkspaceMutationTargets.mockReset();
    supabaseAdmin.from.mockClear();
    validateRequest.mockReset();
    getWorkspaceReadClient.mockResolvedValue(readWorkspaceClient);
  });

  it("uses the workspace read client for comment lists", async () => {
    authGuard.mockResolvedValue({ error: null, userId: "user_1" });
    requireWorkspaceClientAccess.mockResolvedValue({ clientSlug: "zamora" });
    readState.workspace_pages = [{ client_slug: "zamora", id: "page_1" }];
    readState.workspace_comments = [
      { author_id: "user_1", id: "comment_1", page_id: "page_1" },
      { author_id: "user_2", id: "comment_2", page_id: "page_2" },
    ];

    const { GET } = await import("./route");
    const response = await GET(
      {
        nextUrl: new URL(
          "https://example.com/api/workspace/comments?page_id=page_1&client_slug=zamora",
        ),
      } as NextRequest,
    );
    const payload = (await response.json()) as { comments: Array<{ id: string }> };

    expect(response.status).toBe(200);
    expect(payload.comments.map((comment) => comment.id)).toEqual(["comment_1"]);
    expect(getWorkspaceReadClient).toHaveBeenCalledWith("zamora");
  });

  it("notifies the page owner and revalidates workspace surfaces on comment create", async () => {
    authGuard.mockResolvedValue({ error: null, userId: "user_1" });
    currentUser.mockResolvedValue({ firstName: "Jaime", lastName: "Ortiz" });
    requireWorkspaceClientAccess.mockResolvedValue({ clientSlug: "zamora" });
    validateRequest.mockResolvedValue({
      data: {
        content: "Need updated poster specs",
        page_id: "page_1",
      },
      error: null,
    });

    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://example.com/api/workspace/comments", {
        body: JSON.stringify({}),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }) as NextRequest,
    );

    expect(response.status).toBe(201);
    expect(createNotification).toHaveBeenCalledWith({
      clientSlug: "zamora",
      entityId: "page_1",
      entityType: "workspace_page",
      fromUserId: "user_1",
      fromUserName: "Jaime Ortiz",
      message: 'Jaime Ortiz commented on "Launch brief"',
      pageId: "page_1",
      title: "New comment",
      type: "comment",
      userId: "owner_1",
    });
    expect(logSystemEvent).toHaveBeenCalled();
    expect(revalidateWorkspaceMutationTargets).toHaveBeenCalledWith({
      clientSlug: "zamora",
      includeActivity: true,
      includeNotifications: true,
      pageIds: ["page_1"],
    });
  });
});
