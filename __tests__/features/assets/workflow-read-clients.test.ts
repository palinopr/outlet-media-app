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
    ad_assets: [] as Record<string, unknown>[],
    asset_comments: [] as Record<string, unknown>[],
    asset_follow_up_items: [] as Record<string, unknown>[],
  };

  const userScopedState = {
    ad_assets: [] as Record<string, unknown>[],
    asset_comments: [] as Record<string, unknown>[],
    asset_follow_up_items: [] as Record<string, unknown>[],
  };

  function applyFilters(
    rows: Record<string, unknown>[],
    filters: Array<{ field: string; type: "eq" | "in"; value: unknown }>,
  ) {
    return rows.filter((row) =>
      filters.every((filter) => {
        if (filter.type === "eq") {
          return row[filter.field] === filter.value;
        }

        const values = Array.isArray(filter.value) ? filter.value : [];
        return values.includes(row[filter.field]);
      }),
    );
  }

  function buildClient(state: typeof serviceState) {
    return {
      from(table: string) {
        const filters: Array<{ field: string; type: "eq" | "in"; value: unknown }> = [];
        let limitValue: number | null = null;

        const query = {
          select() {
            return this;
          },
          eq(field: string, value: unknown) {
            filters.push({ field, type: "eq", value });
            return this;
          },
          in(field: string, value: unknown[]) {
            filters.push({ field, type: "in", value });
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

vi.mock("@/lib/supabase", () => ({
  createClerkSupabaseClient,
  supabaseAdmin,
}));

vi.mock("@/lib/agent-dispatch", () => ({
  enqueueExternalAgentTask: vi.fn(),
}));

vi.mock("@/features/system-events/server", () => ({
  getCurrentActor: vi.fn(),
  logSystemEvent: vi.fn(),
  summarizeChangedFields: vi.fn(),
}));

vi.mock("@/features/notifications/workflow", () => ({
  notifyWorkflowAssignee: vi.fn(),
}));

import { listAssetComments } from "@/features/asset-comments/server";
import { listAssetFollowUpItems } from "@/features/asset-follow-up-items/server";

describe("asset workflow read clients", () => {
  beforeEach(() => {
    createClerkSupabaseClient.mockReset();
    currentUser.mockReset();
    serviceState.ad_assets = [];
    serviceState.asset_comments = [];
    serviceState.asset_follow_up_items = [];
    userScopedState.ad_assets = [];
    userScopedState.asset_comments = [];
    userScopedState.asset_follow_up_items = [];
    currentUser.mockResolvedValue({ publicMetadata: { role: "member" } });
    createClerkSupabaseClient.mockResolvedValue(null);
  });

  it("prefers the Clerk-scoped client for asset comment reads", async () => {
    serviceState.asset_comments = [
      {
        id: "comment_service",
        asset_id: "asset_1",
        client_slug: "zamora",
        content: "Service comment",
        visibility: "shared",
        resolved: false,
        created_at: "2026-03-06T12:00:00.000Z",
        updated_at: "2026-03-06T12:00:00.000Z",
      },
    ];
    userScopedState.asset_comments = [
      {
        id: "comment_rls",
        asset_id: "asset_1",
        client_slug: "zamora",
        content: "RLS comment",
        visibility: "shared",
        resolved: false,
        created_at: "2026-03-06T12:01:00.000Z",
        updated_at: "2026-03-06T12:01:00.000Z",
      },
    ];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);

    const comments = await listAssetComments({
      audience: "shared",
      assetId: "asset_1",
      clientSlug: "zamora",
    });

    expect(comments.map((comment) => comment.id)).toEqual(["comment_rls"]);
  });

  it("prefers the Clerk-scoped client for asset follow-up reads and asset names", async () => {
    serviceState.asset_follow_up_items = [
      {
        id: "item_service",
        asset_id: "asset_1",
        client_slug: "zamora",
        title: "Service item",
        status: "todo",
        priority: "medium",
        visibility: "shared",
        position: 0,
        created_at: "2026-03-06T12:00:00.000Z",
        updated_at: "2026-03-06T12:00:00.000Z",
      },
    ];
    serviceState.ad_assets = [
      {
        id: "asset_1",
        file_name: "service.png",
      },
    ];
    userScopedState.asset_follow_up_items = [
      {
        id: "item_rls",
        asset_id: "asset_2",
        client_slug: "zamora",
        title: "RLS item",
        status: "todo",
        priority: "medium",
        visibility: "shared",
        position: 0,
        created_at: "2026-03-06T12:01:00.000Z",
        updated_at: "2026-03-06T12:01:00.000Z",
      },
    ];
    userScopedState.ad_assets = [
      {
        id: "asset_2",
        file_name: "rls.png",
      },
    ];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);

    const items = await listAssetFollowUpItems({
      audience: "shared",
      clientSlug: "zamora",
    });

    expect(items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          assetId: "asset_2",
          assetName: "rls.png",
          id: "item_rls",
        }),
      ]),
    );
  });

  it("keeps admin asset follow-up reads on the service role", async () => {
    currentUser.mockResolvedValue({ publicMetadata: { role: "admin" } });
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);
    serviceState.asset_follow_up_items = [
      {
        id: "item_admin",
        asset_id: "asset_admin",
        client_slug: "zamora",
        title: "Admin item",
        status: "todo",
        priority: "medium",
        visibility: "shared",
        position: 0,
        created_at: "2026-03-06T12:00:00.000Z",
        updated_at: "2026-03-06T12:00:00.000Z",
      },
    ];
    serviceState.ad_assets = [
      {
        id: "asset_admin",
        file_name: "admin.png",
      },
    ];
    userScopedState.asset_follow_up_items = [
      {
        id: "item_rls",
        asset_id: "asset_rls",
        client_slug: "zamora",
        title: "RLS item",
        status: "todo",
        priority: "medium",
        visibility: "shared",
        position: 0,
        created_at: "2026-03-06T12:01:00.000Z",
        updated_at: "2026-03-06T12:01:00.000Z",
      },
    ];
    userScopedState.ad_assets = [
      {
        id: "asset_rls",
        file_name: "rls.png",
      },
    ];

    const items = await listAssetFollowUpItems({
      audience: "shared",
      clientSlug: "zamora",
    });

    expect(items.map((item) => item.id)).toEqual(["item_admin"]);
    expect(createClerkSupabaseClient).not.toHaveBeenCalled();
  });
});
