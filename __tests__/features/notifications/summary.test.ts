import { describe, expect, it } from "vitest";
import {
  buildNotificationsCenterSummary,
  notificationMatchesFilter,
} from "@/features/notifications/summary";
import type { AppNotification } from "@/features/notifications/types";

function notification(overrides: Partial<AppNotification> = {}): AppNotification {
  return {
    clientSlug: "zamora",
    createdAt: "2026-03-06T12:00:00.000Z",
    entityId: "entity_1",
    entityType: "campaign",
    fromUserId: "user_1",
    fromUserName: "Outlet",
    id: crypto.randomUUID(),
    message: null,
    pageId: null,
    read: false,
    taskId: null,
    title: "Notification",
    type: "comment",
    userId: "user_target",
    ...overrides,
  };
}

describe("buildNotificationsCenterSummary", () => {
  it("builds counts for unread, stale, approvals, comments, and assignments", () => {
    const summary = buildNotificationsCenterSummary(
      [
        notification({
          createdAt: "2026-03-04T12:00:00.000Z",
          type: "approval",
        }),
        notification({
          id: "notif_2",
          read: true,
          type: "assignment",
        }),
        notification({
          id: "notif_3",
          type: "mention",
        }),
      ],
      new Date("2026-03-06T12:00:00.000Z"),
    );

    expect(summary.metrics).toEqual([
      {
        key: "unread",
        label: "Unread",
        value: 2,
        detail: "2 new notifications",
      },
      {
        key: "stale_unread",
        label: "Waiting >24h",
        value: 1,
        detail: "1 stale unread item",
      },
      {
        key: "approvals",
        label: "Approvals",
        value: 1,
        detail: "1 approval update",
      },
      {
        key: "comments",
        label: "Comments",
        value: 1,
        detail: "1 discussion update",
      },
      {
        key: "assignments",
        label: "Assignments",
        value: 1,
        detail: "1 assignment",
      },
    ]);
  });
});

describe("notificationMatchesFilter", () => {
  it("keeps comment and mention notifications in the discussion filter", () => {
    expect(notificationMatchesFilter(notification({ type: "comment" }), "comment")).toBe(true);
    expect(notificationMatchesFilter(notification({ type: "mention" }), "comment")).toBe(true);
    expect(notificationMatchesFilter(notification({ type: "approval" }), "comment")).toBe(false);
  });
});
