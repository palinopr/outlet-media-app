import { describe, expect, it } from "vitest";
import {
  buildNotificationHref,
  buildNotificationsCenterHref,
} from "@/features/notifications/routing";
import type { AppNotification } from "@/features/notifications/types";

function makeNotification(
  overrides: Partial<AppNotification> = {},
): AppNotification {
  return {
    clientSlug: "zamora",
    createdAt: "2026-03-06T12:00:00.000Z",
    entityId: null,
    entityType: null,
    fromUserId: null,
    fromUserName: null,
    id: "notif_1",
    message: null,
    pageId: null,
    read: false,
    taskId: null,
    title: "Notification",
    type: "comment",
    userId: "user_1",
    ...overrides,
  };
}

describe("buildNotificationHref", () => {
  it("routes admin notifications to entity-specific admin surfaces", () => {
    expect(
      buildNotificationHref(
        makeNotification({ entityId: "cmp_1", entityType: "campaign" }),
        { viewer: "admin" },
      ),
    ).toBe("/admin/campaigns/cmp_1");

    expect(
      buildNotificationHref(
        makeNotification({ entityId: "asset_1", entityType: "asset" }),
        { viewer: "admin" },
      ),
    ).toBe("/admin/assets/asset_1");

    expect(
      buildNotificationHref(
        makeNotification({ entityId: "approval_1", entityType: "approval_request" }),
        { viewer: "admin" },
      ),
    ).toBe("/admin/approvals");

    expect(
      buildNotificationHref(
        makeNotification({
          entityId: "comment_1",
          entityType: "campaign_comment",
          routeEntityId: "cmp_2",
          routeEntityType: "campaign",
        }),
        { viewer: "admin" },
      ),
    ).toBe("/admin/campaigns/cmp_2");

    expect(
      buildNotificationHref(
        makeNotification({
          entityId: "item_1",
          entityType: "asset_follow_up_item",
          routeEntityId: "asset_9",
          routeEntityType: "asset",
        }),
        { viewer: "admin" },
      ),
    ).toBe("/admin/assets/asset_9");
  });

  it("routes client notifications using the notification slug or fallback slug", () => {
    expect(
      buildNotificationHref(
        makeNotification({ entityId: "evt_1", entityType: "event" }),
        { viewer: "client" },
      ),
    ).toBe("/client/zamora/event/evt_1");

    expect(
      buildNotificationHref(
        makeNotification({
          clientSlug: null,
          entityId: "crm_1",
          entityType: "crm_contact",
        }),
        { fallbackClientSlug: "kybba", viewer: "client" },
      ),
    ).toBe("/client/kybba/crm/crm_1");

    expect(
      buildNotificationHref(
        makeNotification({
          entityId: "comment_1",
          entityType: "event_comment",
          routeEntityId: "evt_2",
          routeEntityType: "event",
        }),
        { viewer: "client" },
      ),
    ).toBe("/client/zamora/event/evt_2");

    expect(
      buildNotificationHref(
        makeNotification({
          entityId: "item_1",
          entityType: "campaign_action_item",
          routeEntityId: "cmp_5",
          routeEntityType: "campaign",
        }),
        { viewer: "client" },
      ),
    ).toBe("/client/zamora/campaign/cmp_5");
  });

  it("falls back to workspace or updates routes when entity context is missing", () => {
    expect(
      buildNotificationHref(
        makeNotification({ pageId: "page_1" }),
        { viewer: "admin" },
      ),
    ).toBe("/admin/workspace/page_1");

    expect(
      buildNotificationHref(
        makeNotification({ clientSlug: "happy_paws", taskId: "task_1" }),
        { viewer: "client" },
      ),
    ).toBe("/client/happy_paws/workspace/tasks");

    expect(
      buildNotificationHref(
        makeNotification({ clientSlug: "beamina" }),
        { viewer: "client" },
      ),
    ).toBe("/client/beamina/updates");
  });
});

describe("buildNotificationsCenterHref", () => {
  it("routes admin viewers to the admin inbox", () => {
    expect(buildNotificationsCenterHref("admin")).toBe("/admin/notifications");
  });

  it("keeps client viewers on client-safe inbox routes", () => {
    expect(buildNotificationsCenterHref("client", "zamora")).toBe(
      "/client/zamora/notifications",
    );
    expect(buildNotificationsCenterHref("client")).toBe("/client");
  });
});
