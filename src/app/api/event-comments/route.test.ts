import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  authGuard,
  canAccessEventComments,
  commentsDb,
  createClerkSupabaseClient,
  getEventRecordById,
  getEventWorkflowPaths,
  logSystemEvent,
  revalidateWorkflowPaths,
  supabaseAdmin,
  validateRequest,
} = vi.hoisted(() => ({
  authGuard: vi.fn(),
  canAccessEventComments: vi.fn(),
  commentsDb: {
    from: vi.fn(),
  },
  createClerkSupabaseClient: vi.fn(),
  getEventRecordById: vi.fn(),
  getEventWorkflowPaths: vi.fn(),
  logSystemEvent: vi.fn(),
  revalidateWorkflowPaths: vi.fn(),
  supabaseAdmin: {
    from: vi.fn(),
  },
  validateRequest: vi.fn(),
}));

vi.mock("@/lib/api-helpers", () => ({
  apiError: (message: string, status = 500) => Response.json({ error: message }, { status }),
  authGuard,
  dbError: () => Response.json({ error: "Database error" }, { status: 500 }),
  getAuthorName: () => "Outlet Admin",
  validateRequest,
}));

vi.mock("@/lib/supabase", () => ({
  createClerkSupabaseClient,
  supabaseAdmin,
}));

vi.mock("@/features/event-comments/server", async () => {
  const actual = await vi.importActual<typeof import("@/features/event-comments/server")>(
    "@/features/event-comments/server",
  );
  return {
    ...actual,
    canAccessEventComments,
  };
});

vi.mock("@/features/events/server", () => ({
  getEventRecordById,
}));

vi.mock("@/features/client-portal/scope", () => ({
  allowsEventInScope: vi.fn().mockReturnValue(true),
}));

vi.mock("@clerk/nextjs/server", () => ({
  currentUser: vi.fn(),
}));

vi.mock("@/features/notifications/discussions", () => ({
  notifyDiscussionAudience: vi.fn(),
}));

vi.mock("@/features/system-events/server", () => ({
  logSystemEvent,
}));

vi.mock("@/features/workflow/revalidation", () => ({
  getEventWorkflowPaths,
  revalidateWorkflowPaths,
}));

function makeGetRequest(url: string) {
  return {
    nextUrl: new URL(url),
  } as NextRequest;
}

describe("event comments route", () => {
  beforeEach(() => {
    authGuard.mockReset();
    canAccessEventComments.mockReset();
    createClerkSupabaseClient.mockReset();
    getEventRecordById.mockReset();
    getEventWorkflowPaths.mockReset();
    logSystemEvent.mockReset();
    revalidateWorkflowPaths.mockReset();
    validateRequest.mockReset();
    commentsDb.from.mockClear();
    supabaseAdmin.from.mockClear();

    authGuard.mockResolvedValue({ error: null, userId: "user_1" });
    createClerkSupabaseClient.mockResolvedValue(commentsDb);
    getEventRecordById.mockResolvedValue({
      id: "evt_1",
      clientSlug: "zamora",
      name: "Miami Show",
      artist: "Miami Show",
    });
    commentsDb.from.mockImplementation(() => {
      const query = {
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        then(
          resolve: (value: { data: Record<string, unknown>[]; error: null }) => unknown,
        ) {
          return Promise.resolve({
            data: [{ id: "comment_rls", event_id: "evt_1", visibility: "shared" }],
            error: null,
          }).then(resolve);
        },
      };

      return query;
    });
    supabaseAdmin.from.mockImplementation(() => {
      const query = {
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        then(
          resolve: (value: { data: Record<string, unknown>[]; error: null }) => unknown,
        ) {
          return Promise.resolve({
            data: [{ id: "comment_service", event_id: "evt_1", visibility: "shared" }],
            error: null,
          }).then(resolve);
        },
      };

      return query;
    });
  });

  it("reads client event comment GETs through the Clerk-scoped client", async () => {
    canAccessEventComments.mockResolvedValue({
      allowed: true,
      isAdmin: false,
      scope: undefined,
    });

    const { GET } = await import("./route");
    const response = await GET(
      makeGetRequest("https://example.com/api/event-comments?event_id=evt_1&client_slug=zamora"),
    );

    expect(response.status).toBe(200);
    expect(commentsDb.from).toHaveBeenCalledWith("event_comments");
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toEqual({
      comments: [{ id: "comment_rls", event_id: "evt_1", visibility: "shared" }],
    });
  });

  it("does not fall back to the service role for non-admin event comment GETs when the Clerk-scoped client is unavailable", async () => {
    canAccessEventComments.mockResolvedValue({
      allowed: true,
      isAdmin: false,
      scope: undefined,
    });
    createClerkSupabaseClient.mockResolvedValue(null);

    const { GET } = await import("./route");
    const response = await GET(
      makeGetRequest("https://example.com/api/event-comments?event_id=evt_1&client_slug=zamora"),
    );

    expect(response.status).toBe(200);
    expect(commentsDb.from).not.toHaveBeenCalled();
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toEqual({ comments: [] });
  });

  it("keeps admin event comment GETs on the service role", async () => {
    canAccessEventComments.mockResolvedValue({
      allowed: true,
      isAdmin: true,
      scope: undefined,
    });

    const { GET } = await import("./route");
    const response = await GET(
      makeGetRequest("https://example.com/api/event-comments?event_id=evt_1&client_slug=zamora"),
    );

    expect(response.status).toBe(200);
    expect(supabaseAdmin.from).toHaveBeenCalledWith("event_comments");
  });

  it("lets admins resolve an event request thread", async () => {
    validateRequest.mockResolvedValue({
      data: { resolved: true },
      error: null,
    });
    canAccessEventComments.mockResolvedValue({
      allowed: true,
      isAdmin: true,
      scope: undefined,
    });
    getEventWorkflowPaths.mockReturnValue(["/admin/events/evt_1"]);

    supabaseAdmin.from.mockImplementation((table: string) => {
      if (table !== "event_comments") {
        throw new Error(`Unexpected table ${table}`);
      }

      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: {
                event_id: "evt_1",
                client_slug: "zamora",
                content: "Need the latest hold count before increasing spend.",
                resolved: false,
                visibility: "shared",
              },
            }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      };
    });

    const { PATCH } = await import("./route");
    const response = await PATCH(
      makeGetRequest("https://example.com/api/event-comments?id=comment_1"),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(logSystemEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: "event_comment_resolved",
        entityId: "comment_1",
        entityType: "event_comment",
        summary: "Resolved a comment in Miami Show discussion",
      }),
    );
    expect(revalidateWorkflowPaths).toHaveBeenCalledWith(["/admin/events/evt_1"]);
  });
});
