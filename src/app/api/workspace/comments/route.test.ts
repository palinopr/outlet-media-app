import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  authGuard,
  createNotification,
  currentUser,
  logSystemEvent,
  requireWorkspaceClientAccess,
  revalidateWorkspaceMutationTargets,
  supabaseAdmin,
  validateRequest,
} = vi.hoisted(() => ({
  authGuard: vi.fn(),
  createNotification: vi.fn(),
  currentUser: vi.fn(),
  logSystemEvent: vi.fn(),
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
}));

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

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin,
}));

describe("workspace comments route", () => {
  beforeEach(() => {
    vi.resetModules();
    authGuard.mockReset();
    createNotification.mockReset();
    currentUser.mockReset();
    logSystemEvent.mockReset();
    requireWorkspaceClientAccess.mockReset();
    revalidateWorkspaceMutationTargets.mockReset();
    supabaseAdmin.from.mockClear();
    validateRequest.mockReset();
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
