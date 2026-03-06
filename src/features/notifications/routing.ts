import type { AppNotification } from "./types";

interface BuildNotificationHrefOptions {
  fallbackClientSlug?: string | null;
  viewer: "admin" | "client";
}

export function buildNotificationsCenterHref(
  viewer: "admin" | "client",
  fallbackClientSlug?: string | null,
) {
  if (viewer === "admin") {
    return "/admin/notifications";
  }

  return fallbackClientSlug ? `/client/${fallbackClientSlug}/notifications` : "/client";
}

function clientSlugForNotification(
  notification: AppNotification,
  fallbackClientSlug?: string | null,
) {
  return notification.clientSlug ?? fallbackClientSlug ?? null;
}

export function buildNotificationHref(
  notification: AppNotification,
  options: BuildNotificationHrefOptions,
) {
  const clientSlug = clientSlugForNotification(notification, options.fallbackClientSlug);

  if (options.viewer === "admin") {
    if (notification.entityType === "campaign" && notification.entityId) {
      return `/admin/campaigns/${notification.entityId}`;
    }
    if (notification.entityType === "asset" && notification.entityId) {
      return `/admin/assets/${notification.entityId}`;
    }
    if (notification.entityType === "event" && notification.entityId) {
      return `/admin/events/${notification.entityId}`;
    }
    if (notification.entityType === "crm_contact" && notification.entityId) {
      return `/admin/crm/${notification.entityId}`;
    }
    if (notification.entityType === "approval_request") {
      return "/admin/approvals";
    }
    if (notification.pageId) {
      return `/admin/workspace/${notification.pageId}`;
    }
    if (notification.taskId || notification.entityType === "workspace_task") {
      return "/admin/workspace/tasks";
    }
    return null;
  }

  if (!clientSlug) {
    return "/client";
  }

  if (notification.entityType === "campaign" && notification.entityId) {
    return `/client/${clientSlug}/campaign/${notification.entityId}`;
  }
  if (notification.entityType === "asset" && notification.entityId) {
    return `/client/${clientSlug}/assets/${notification.entityId}`;
  }
  if (notification.entityType === "event" && notification.entityId) {
    return `/client/${clientSlug}/event/${notification.entityId}`;
  }
  if (notification.entityType === "crm_contact" && notification.entityId) {
    return `/client/${clientSlug}/crm/${notification.entityId}`;
  }
  if (notification.entityType === "approval_request") {
    return `/client/${clientSlug}/approvals`;
  }
  if (notification.pageId) {
    return `/client/${clientSlug}/workspace/${notification.pageId}`;
  }
  if (notification.taskId || notification.entityType === "workspace_task") {
    return `/client/${clientSlug}/workspace/tasks`;
  }

  return `/client/${clientSlug}/updates`;
}
