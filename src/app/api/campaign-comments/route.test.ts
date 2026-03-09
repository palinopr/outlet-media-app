import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  authGuard,
  campaignBelongsToClientSlug,
  canAccessCampaignComments,
  commentsDb,
  createClerkSupabaseClient,
  currentUser,
  supabaseAdmin,
} = vi.hoisted(() => ({
  authGuard: vi.fn(),
  campaignBelongsToClientSlug: vi.fn(),
  canAccessCampaignComments: vi.fn(),
  commentsDb: {
    from: vi.fn(),
  },
  createClerkSupabaseClient: vi.fn(),
  currentUser: vi.fn(),
  supabaseAdmin: {
    from: vi.fn(),
  },
}));

vi.mock("@/lib/api-helpers", () => ({
  apiError: (message: string, status = 500) =>
    Response.json({ error: message }, { status }),
  authGuard,
  validateRequest: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  currentUser,
}));

vi.mock("@/lib/campaign-client-assignment", () => ({
  campaignBelongsToClientSlug,
  getEffectiveCampaignRowById: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  createClerkSupabaseClient,
  supabaseAdmin,
}));

vi.mock("@/features/campaign-comments/server", async () => {
  const actual = await vi.importActual<typeof import("@/features/campaign-comments/server")>(
    "@/features/campaign-comments/server",
  );
  return {
    ...actual,
    canAccessCampaignComments,
  };
});

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
  getCampaignWorkflowPaths: vi.fn(),
  revalidateWorkflowPaths: vi.fn(),
}));

vi.mock("@/features/client-portal/scope", () => ({
  allowsCampaignInScope: vi.fn().mockReturnValue(true),
}));

function makeGetRequest(url: string) {
  return {
    nextUrl: new URL(url),
  } as NextRequest;
}

describe("campaign comments route", () => {
  beforeEach(() => {
    authGuard.mockReset();
    campaignBelongsToClientSlug.mockReset();
    canAccessCampaignComments.mockReset();
    createClerkSupabaseClient.mockReset();
    currentUser.mockReset();
    commentsDb.from.mockClear();
    supabaseAdmin.from.mockClear();

    authGuard.mockResolvedValue({ error: null, userId: "user_1" });
    campaignBelongsToClientSlug.mockResolvedValue(true);
    createClerkSupabaseClient.mockResolvedValue(commentsDb);
    commentsDb.from.mockImplementation(() => {
      const query = {
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        then(
          resolve: (value: { data: Record<string, unknown>[]; error: null }) => unknown,
        ) {
          return Promise.resolve({
            data: [{ id: "comment_rls", campaign_id: "cmp_1", visibility: "shared" }],
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
            data: [{ id: "comment_service", campaign_id: "cmp_1", visibility: "shared" }],
            error: null,
          }).then(resolve);
        },
      };

      return query;
    });
  });

  it("reads client comment GETs through the Clerk-scoped client", async () => {
    canAccessCampaignComments.mockResolvedValue({
      allowed: true,
      isAdmin: false,
      scope: undefined,
    });

    const { GET } = await import("./route");
    const response = await GET(
      makeGetRequest("https://example.com/api/campaign-comments?campaign_id=cmp_1&client_slug=zamora"),
    );

    expect(response.status).toBe(200);
    expect(commentsDb.from).toHaveBeenCalledWith("campaign_comments");
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toEqual({
      comments: [{ id: "comment_rls", campaign_id: "cmp_1", visibility: "shared" }],
    });
  });

  it("keeps admin comment GETs on the service role", async () => {
    canAccessCampaignComments.mockResolvedValue({
      allowed: true,
      isAdmin: true,
      scope: undefined,
    });

    const { GET } = await import("./route");
    const response = await GET(
      makeGetRequest("https://example.com/api/campaign-comments?campaign_id=cmp_1&client_slug=zamora"),
    );

    expect(response.status).toBe(200);
    expect(supabaseAdmin.from).toHaveBeenCalledWith("campaign_comments");
  });
});
