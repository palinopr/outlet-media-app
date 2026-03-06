import { beforeEach, describe, expect, it, vi } from "vitest";

const { state, supabaseAdmin } = vi.hoisted(() => {
  const state = {
    approval_requests: [] as Record<string, unknown>[],
    asset_comments: [] as Record<string, unknown>[],
    asset_follow_up_items: [] as Record<string, unknown>[],
    campaign_action_items: [] as Record<string, unknown>[],
    campaign_comments: [] as Record<string, unknown>[],
    client_member_campaigns: [] as Record<string, unknown>[],
    client_member_events: [] as Record<string, unknown>[],
    client_members: [] as Record<string, unknown>[],
    clients: [] as Record<string, unknown>[],
    event_comments: [] as Record<string, unknown>[],
    event_follow_up_items: [] as Record<string, unknown>[],
    notifications: [] as Record<string, unknown>[],
  };

  function applyFilters(
    rows: Record<string, unknown>[],
    filters: Array<{ field: string; type: "eq" | "in" | "neq" | "not-null"; value: unknown }>,
  ) {
    return rows.filter((row) =>
      filters.every((filter) => {
        if (filter.type === "eq") {
          return row[filter.field] === filter.value;
        }
        if (filter.type === "neq") {
          return row[filter.field] !== filter.value;
        }
        if (filter.type === "not-null") {
          return row[filter.field] != null;
        }
        const values = Array.isArray(filter.value) ? filter.value : [];
        return values.includes(row[filter.field]);
      }),
    );
  }

  const supabaseAdmin = {
    from(table: string) {
      const filters: Array<{ field: string; type: "eq" | "in" | "neq" | "not-null"; value: unknown }> = [];
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
        neq(field: string, value: unknown) {
          filters.push({ field, type: "neq", value });
          return this;
        },
        not(field: string, operator: string, value: unknown) {
          if (operator === "is" && value === null) {
            filters.push({ field, type: "not-null", value });
          }
          return this;
        },
        order() {
          return this;
        },
        limit(value: number) {
          limitValue = value;
          return this;
        },
        async maybeSingle() {
          const rows = applyFilters(
            (state[table as keyof typeof state] ?? []) as Record<string, unknown>[],
            filters,
          );
          return { data: rows[0] ?? null, error: null };
        },
        then(resolve: (value: { data: Record<string, unknown>[]; error: null }) => unknown) {
          const rows = applyFilters((state[table as keyof typeof state] ?? []) as Record<string, unknown>[], filters);
          const data = limitValue == null ? rows : rows.slice(0, limitValue);
          return Promise.resolve({ data, error: null }).then(resolve);
        },
      };

      return query;
    },
  };

  return { state, supabaseAdmin };
});

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin,
}));

vi.mock("@/features/assets/server", () => ({
  listVisibleAssetIdsForScope: vi.fn(),
}));

import { listVisibleAssetIdsForScope } from "@/features/assets/server";
import {
  listClientNotificationRecipients,
  listNotificationsForUser,
} from "@/features/notifications/server";

const mockedListVisibleAssetIdsForScope = vi.mocked(listVisibleAssetIdsForScope);

describe("listNotificationsForUser", () => {
  beforeEach(() => {
    state.notifications = [];
    state.campaign_comments = [];
    state.campaign_action_items = [];
    state.clients = [];
    state.client_member_campaigns = [];
    state.client_member_events = [];
    state.client_members = [];
    state.event_comments = [];
    state.event_follow_up_items = [];
    state.asset_comments = [];
    state.asset_follow_up_items = [];
    state.approval_requests = [];
    mockedListVisibleAssetIdsForScope.mockReset();
  });

  it("filters scoped client notifications by campaign, event, asset, and approval context", async () => {
    state.notifications = [
      {
        id: "notif_campaign_allowed",
        user_id: "user_1",
        title: "Campaign update",
        type: "comment",
        entity_type: "campaign",
        entity_id: "cmp_allowed",
        client_slug: "zamora",
        read: false,
        created_at: "2026-03-06T12:00:00.000Z",
      },
      {
        id: "notif_campaign_blocked",
        user_id: "user_1",
        title: "Campaign update",
        type: "comment",
        entity_type: "campaign",
        entity_id: "cmp_blocked",
        client_slug: "zamora",
        read: false,
        created_at: "2026-03-06T12:00:00.000Z",
      },
      {
        id: "notif_event_comment",
        user_id: "user_1",
        title: "Event thread",
        type: "comment",
        entity_type: "event_comment",
        entity_id: "event_comment_allowed",
        client_slug: "zamora",
        read: false,
        created_at: "2026-03-06T12:00:00.000Z",
      },
      {
        id: "notif_asset",
        user_id: "user_1",
        title: "Asset review",
        type: "comment",
        entity_type: "asset",
        entity_id: "asset_allowed",
        client_slug: "zamora",
        read: false,
        created_at: "2026-03-06T12:00:00.000Z",
      },
      {
        id: "notif_asset_follow_up",
        user_id: "user_1",
        title: "Asset next step",
        type: "assignment",
        entity_type: "asset_follow_up_item",
        entity_id: "asset_follow_up_allowed",
        client_slug: "zamora",
        read: false,
        created_at: "2026-03-06T12:00:00.000Z",
      },
      {
        id: "notif_approval",
        user_id: "user_1",
        title: "Approval requested",
        type: "approval",
        entity_type: "approval_request",
        entity_id: "approval_allowed",
        client_slug: "zamora",
        read: false,
        created_at: "2026-03-06T12:00:00.000Z",
      },
      {
        id: "notif_workspace",
        user_id: "user_1",
        title: "Workspace task",
        type: "assignment",
        entity_type: "workspace_task",
        entity_id: "task_1",
        task_id: "task_1",
        client_slug: "zamora",
        read: false,
        created_at: "2026-03-06T12:00:00.000Z",
      },
    ];

    state.event_comments = [
      { id: "event_comment_allowed", event_id: "evt_allowed" },
    ];
    state.asset_follow_up_items = [
      { id: "asset_follow_up_allowed", asset_id: "asset_from_follow_up" },
    ];
    state.approval_requests = [
      {
        id: "approval_allowed",
        client_slug: "zamora",
        entity_type: "campaign",
        entity_id: "cmp_allowed",
        metadata: {},
      },
    ];

    mockedListVisibleAssetIdsForScope.mockResolvedValue(
      new Set(["asset_allowed", "asset_from_follow_up"]),
    );

    const notifications = await listNotificationsForUser("user_1", {
      clientSlug: "zamora",
      scope: {
        allowedCampaignIds: ["cmp_allowed"],
        allowedEventIds: ["evt_allowed"],
      },
    });

    expect(notifications.map((notification) => notification.id)).toEqual([
      "notif_campaign_allowed",
      "notif_event_comment",
      "notif_asset",
      "notif_asset_follow_up",
      "notif_approval",
      "notif_workspace",
    ]);
    expect(mockedListVisibleAssetIdsForScope).toHaveBeenCalledWith(
      "zamora",
      ["asset_allowed", "asset_from_follow_up"],
      {
        allowedCampaignIds: ["cmp_allowed"],
        allowedEventIds: ["evt_allowed"],
      },
    );
  });

  it("keeps unscoped client-wide notifications when assigned scope is otherwise empty", async () => {
    state.notifications = [
      {
        id: "notif_workspace",
        user_id: "user_1",
        title: "Workspace task",
        type: "assignment",
        entity_type: "workspace_task",
        entity_id: "task_1",
        task_id: "task_1",
        client_slug: "zamora",
        read: false,
        created_at: "2026-03-06T12:00:00.000Z",
      },
      {
        id: "notif_campaign",
        user_id: "user_1",
        title: "Campaign update",
        type: "comment",
        entity_type: "campaign",
        entity_id: "cmp_blocked",
        client_slug: "zamora",
        read: false,
        created_at: "2026-03-06T12:00:00.000Z",
      },
    ];

    mockedListVisibleAssetIdsForScope.mockResolvedValue(new Set());

    const notifications = await listNotificationsForUser("user_1", {
      clientSlug: "zamora",
      scope: {
        allowedCampaignIds: [],
        allowedEventIds: [],
      },
    });

    expect(notifications.map((notification) => notification.id)).toEqual(["notif_workspace"]);
  });

  it("targets shared notification recipients to members whose assigned scope matches the entity", async () => {
    state.clients = [{ id: "client_1", slug: "zamora" }];
    state.client_members = [
      { id: "member_all", client_id: "client_1", clerk_user_id: "user_all", scope: "all" },
      { id: "member_campaign", client_id: "client_1", clerk_user_id: "user_campaign", scope: "assigned" },
      { id: "member_other", client_id: "client_1", clerk_user_id: "user_other", scope: "assigned" },
    ];
    state.client_member_campaigns = [
      { member_id: "member_campaign", campaign_id: "cmp_allowed" },
      { member_id: "member_other", campaign_id: "cmp_other" },
    ];

    const recipientIds = await listClientNotificationRecipients("zamora", {
      entityId: "cmp_allowed",
      entityType: "campaign",
    });

    expect(recipientIds).toEqual(["user_all", "user_campaign"]);
  });

  it("uses asset visibility to target scoped asset recipients", async () => {
    state.clients = [{ id: "client_1", slug: "zamora" }];
    state.client_members = [
      { id: "member_all", client_id: "client_1", clerk_user_id: "user_all", scope: "all" },
      { id: "member_asset", client_id: "client_1", clerk_user_id: "user_asset", scope: "assigned" },
      { id: "member_blocked", client_id: "client_1", clerk_user_id: "user_blocked", scope: "assigned" },
    ];
    state.client_member_campaigns = [
      { member_id: "member_asset", campaign_id: "cmp_asset" },
      { member_id: "member_blocked", campaign_id: "cmp_other" },
    ];

    mockedListVisibleAssetIdsForScope.mockImplementation(async (_clientSlug, assetIds, scope) => {
      if (scope?.allowedCampaignIds?.includes("cmp_asset")) {
        return new Set(assetIds);
      }
      return new Set<string>();
    });

    const recipientIds = await listClientNotificationRecipients("zamora", {
      entityId: "asset_1",
      entityType: "asset",
    });

    expect(recipientIds).toEqual(["user_all", "user_asset"]);
  });
});
