import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  authGuard,
  logSystemEvent,
  requireWorkspaceClientAccess,
  revalidateWorkspaceMutationTargets,
  supabaseAdmin,
  validateRequest,
} = vi.hoisted(() => ({
  authGuard: vi.fn(),
  logSystemEvent: vi.fn(),
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
}));

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

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin,
}));

describe("workspace pages route", () => {
  beforeEach(() => {
    vi.resetModules();
    authGuard.mockReset();
    logSystemEvent.mockReset();
    requireWorkspaceClientAccess.mockReset();
    revalidateWorkspaceMutationTargets.mockReset();
    supabaseAdmin.from.mockClear();
    validateRequest.mockReset();
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
