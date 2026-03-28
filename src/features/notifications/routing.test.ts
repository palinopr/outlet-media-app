import { describe, expect, it } from "vitest";
import type { AppNotification } from "./types";
import {
  buildNotificationHref,
  buildNotificationsCenterHref,
} from "./routing";

function makeNotification(
  overrides: Partial<AppNotification> = {},
): AppNotification {
  return {
    clientSlug: "acme",
    createdAt: "2026-03-27T00:00:00.000Z",
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
    type: "info",
    userId: "user_1",
    ...overrides,
  };
}

describe("notification routing", () => {
  it("sends client notification-center links to campaigns", () => {
    expect(buildNotificationsCenterHref("client", "acme")).toBe(
      "/client/acme/campaigns",
    );
  });

  it("collapses removed client destinations onto kept shell routes", () => {
    expect(
      buildNotificationHref(
        makeNotification({
          entityId: "asset_1",
          entityType: "asset",
        }),
        { fallbackClientSlug: "acme", viewer: "client" },
      ),
    ).toBe("/client/acme/campaigns");

    expect(
      buildNotificationHref(
        makeNotification({
          entityId: "approval_1",
          entityType: "approval_request",
        }),
        { fallbackClientSlug: "acme", viewer: "client" },
      ),
    ).toBe("/client/acme/campaigns");

    expect(
      buildNotificationHref(
        makeNotification({
          entityId: "comment_1",
          entityType: "campaign_comment",
        }),
        { fallbackClientSlug: "acme", viewer: "client" },
      ),
    ).toBe("/client/acme/campaigns");
  });

  it("falls back to campaigns instead of retired client workspace and updates routes", () => {
    expect(
      buildNotificationHref(
        makeNotification({
          pageId: "page_1",
        }),
        { fallbackClientSlug: "acme", viewer: "client" },
      ),
    ).toBe("/client/acme/campaigns");

    expect(
      buildNotificationHref(
        makeNotification({
          entityType: "workspace_task",
          taskId: "task_1",
        }),
        { fallbackClientSlug: "acme", viewer: "client" },
      ),
    ).toBe("/client/acme/campaigns");
  });

  it("collapses removed admin asset destinations onto campaigns", () => {
    expect(
      buildNotificationHref(
        makeNotification({
          entityId: "asset_1",
          entityType: "asset",
        }),
        { viewer: "admin" },
      ),
    ).toBe("/admin/campaigns");

    expect(
      buildNotificationHref(
        makeNotification({
          entityId: "follow_1",
          entityType: "asset_follow_up_item",
        }),
        { viewer: "admin" },
      ),
    ).toBe("/admin/campaigns");
  });
});
