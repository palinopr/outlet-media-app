import { describeCount } from "@/lib/formatters";
import type { AppNotification } from "./types";

export type NotificationFilterKey =
  | "all"
  | "unread"
  | "approval"
  | "comment"
  | "assignment";

export interface NotificationSummaryMetric {
  detail: string;
  key: "unread" | "stale_unread" | "approvals" | "comments" | "assignments";
  label: string;
  value: number;
}

export interface NotificationFilterOption {
  count: number;
  key: NotificationFilterKey;
  label: string;
}

export interface NotificationsCenterSummary {
  filters: NotificationFilterOption[];
  metrics: NotificationSummaryMetric[];
}

function isCommentNotification(notification: AppNotification) {
  return notification.type === "comment" || notification.type === "mention";
}

export function notificationMatchesFilter(
  notification: AppNotification,
  filter: NotificationFilterKey,
) {
  switch (filter) {
    case "all":
      return true;
    case "unread":
      return !notification.read;
    case "approval":
      return notification.type === "approval";
    case "comment":
      return isCommentNotification(notification);
    case "assignment":
      return notification.type === "assignment";
  }
}

export function buildNotificationsCenterSummary(
  notifications: AppNotification[],
  now = new Date(),
): NotificationsCenterSummary {
  const staleCutoff = now.getTime() - 24 * 60 * 60 * 1000;
  const unread = notifications.filter((notification) => !notification.read);
  const staleUnread = unread.filter(
    (notification) => new Date(notification.createdAt).getTime() <= staleCutoff,
  );
  const approvals = notifications.filter((notification) => notification.type === "approval");
  const comments = notifications.filter((notification) => isCommentNotification(notification));
  const assignments = notifications.filter((notification) => notification.type === "assignment");

  return {
    filters: [
      {
        key: "all",
        label: "All",
        count: notifications.length,
      },
      {
        key: "unread",
        label: "Unread",
        count: unread.length,
      },
      {
        key: "approval",
        label: "Approvals",
        count: approvals.length,
      },
      {
        key: "comment",
        label: "Comments",
        count: comments.length,
      },
      {
        key: "assignment",
        label: "Assignments",
        count: assignments.length,
      },
    ],
    metrics: [
      {
        key: "unread",
        label: "Unread",
        value: unread.length,
        detail: describeCount(unread.length, "new notification"),
      },
      {
        key: "stale_unread",
        label: "Waiting >24h",
        value: staleUnread.length,
        detail: describeCount(staleUnread.length, "stale unread item"),
      },
      {
        key: "approvals",
        label: "Approvals",
        value: approvals.length,
        detail: describeCount(approvals.length, "approval update"),
      },
      {
        key: "comments",
        label: "Comments",
        value: comments.length,
        detail: describeCount(comments.length, "discussion update"),
      },
      {
        key: "assignments",
        label: "Assignments",
        value: assignments.length,
        detail: describeCount(assignments.length, "assignment"),
      },
    ],
  };
}
