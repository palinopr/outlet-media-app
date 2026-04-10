import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  authGuard,
  canAccessEventComments,
  commentsDb,
  createClerkSupabaseClient,
  getEventRecordById,
  supabaseAdmin,
} = vi.hoisted(() => ({
  authGuard: vi.fn(),
  canAccessEventComments: vi.fn(),
  commentsDb: {
    from: vi.fn(),
  },
  createClerkSupabaseClient: vi.fn(),
  getEventRecordById: vi.fn(),
  supabaseAdmin: {
    from: vi.fn(),
  },
}));

vi.mock("@/lib/api-helpers", () => ({
  apiError: (message: string, status = 500) => Response.json({ error: message }, { status }),
  authGuard,
  validateRequest: vi.fn(),
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
  logSystemEvent: vi.fn(),
}));

vi.mock("@/lib/agent-dispatch", () => ({
  enqueueExternalAgentTask: vi.fn(),
}));

vi.mock("@/features/workflow/revalidation", () => ({
  getEventWorkflowPaths: vi.fn(),
  revalidateWorkflowPaths: vi.fn(),
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
    commentsDb.from.mockClear();
    supabaseAdmin.from.mockClear();

    authGuard.mockResolvedValue({ error: null, userId: "user_1" });
    createClerkSupabaseClient.mockResolvedValue(commentsDb);
    getEventRecordById.mockResolvedValue({
      id: "evt_1",
      clientSlug: "zamora",
      name: "Miami Show",
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
});
