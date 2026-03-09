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
    campaign_comments: [] as Record<string, unknown>[],
  };

  const userScopedState = {
    campaign_comments: [] as Record<string, unknown>[],
  };

  function applyFilters(
    rows: Record<string, unknown>[],
    filters: Array<{ field: string; type: "eq"; value: unknown }>,
  ) {
    return rows.filter((row) =>
      filters.every((filter) => row[filter.field] === filter.value),
    );
  }

  function buildClient(state: typeof serviceState) {
    return {
      from(table: string) {
        const filters: Array<{ field: string; type: "eq"; value: unknown }> = [];

        const query = {
          select() {
            return this;
          },
          eq(field: string, value: unknown) {
            filters.push({ field, type: "eq", value });
            return this;
          },
          order() {
            return this;
          },
          then(
            resolve: (value: { data: Record<string, unknown>[]; error: null }) => unknown,
          ) {
            const data = applyFilters(
              (state[table as keyof typeof state] ?? []) as Record<string, unknown>[],
              filters,
            );
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

import { listCampaignComments } from "@/features/campaign-comments/server";

describe("campaign comments read clients", () => {
  beforeEach(() => {
    createClerkSupabaseClient.mockReset();
    currentUser.mockReset();
    serviceState.campaign_comments = [];
    userScopedState.campaign_comments = [];
    currentUser.mockResolvedValue({ publicMetadata: { role: "member" } });
    createClerkSupabaseClient.mockResolvedValue(null);
  });

  it("prefers the Clerk-scoped client for shared campaign comments", async () => {
    serviceState.campaign_comments = [
      {
        id: "comment_service",
        campaign_id: "cmp_1",
        client_slug: "zamora",
        content: "Service comment",
        visibility: "shared",
        resolved: false,
        created_at: "2026-03-07T12:00:00.000Z",
        updated_at: "2026-03-07T12:00:00.000Z",
      },
    ];
    userScopedState.campaign_comments = [
      {
        id: "comment_rls",
        campaign_id: "cmp_1",
        client_slug: "zamora",
        content: "RLS comment",
        visibility: "shared",
        resolved: false,
        created_at: "2026-03-07T12:01:00.000Z",
        updated_at: "2026-03-07T12:01:00.000Z",
      },
    ];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);

    const comments = await listCampaignComments({
      audience: "shared",
      campaignId: "cmp_1",
      clientSlug: "zamora",
    });

    expect(comments.map((comment) => comment.id)).toEqual(["comment_rls"]);
  });

  it("keeps admin viewers on the service role for campaign comments", async () => {
    currentUser.mockResolvedValue({ publicMetadata: { role: "admin" } });
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);
    serviceState.campaign_comments = [
      {
        id: "comment_service",
        campaign_id: "cmp_1",
        client_slug: "zamora",
        content: "Service comment",
        visibility: "shared",
        resolved: false,
        created_at: "2026-03-07T12:00:00.000Z",
        updated_at: "2026-03-07T12:00:00.000Z",
      },
    ];

    const comments = await listCampaignComments({
      audience: "shared",
      campaignId: "cmp_1",
      clientSlug: "zamora",
    });

    expect(comments.map((comment) => comment.id)).toEqual(["comment_service"]);
    expect(createClerkSupabaseClient).not.toHaveBeenCalled();
  });
});
