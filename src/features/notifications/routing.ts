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

function buildAdminNotificationEntityHref(notification: AppNotification) {
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
  if (
    notification.entityType === "campaign_comment" ||
    notification.entityType === "crm_comment" ||
    notification.entityType === "asset_comment" ||
    notification.entityType === "event_comment"
  ) {
    return "/admin/conversations";
  }
  if (notification.entityType === "campaign_action_item") {
    return "/admin/campaigns";
  }
  if (notification.entityType === "asset_follow_up_item") {
    return "/admin/assets";
  }
  if (notification.entityType === "event_follow_up_item") {
    return "/admin/events";
  }
  if (notification.entityType === "crm_follow_up_item") {
    return "/admin/crm";
  }
  return null;
}

function buildClientNotificationEntityHref(
  notification: AppNotification,
  clientSlug: string,
) {
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
  if (
    notification.entityType === "campaign_comment" ||
    notification.entityType === "crm_comment" ||
    notification.entityType === "asset_comment" ||
    notification.entityType === "event_comment"
  ) {
    return `/client/${clientSlug}/conversations`;
  }
  if (notification.entityType === "campaign_action_item") {
    return `/client/${clientSlug}/campaigns`;
  }
  if (notification.entityType === "asset_follow_up_item") {
    return `/client/${clientSlug}/assets`;
  }
  if (notification.entityType === "event_follow_up_item") {
    return `/client/${clientSlug}/events`;
  }
  if (notification.entityType === "crm_follow_up_item") {
    return `/client/${clientSlug}/crm`;
  }
  return null;
}

export function buildNotificationHref(
  notification: AppNotification,
  options: BuildNotificationHrefOptions,
) {
  const clientSlug = clientSlugForNotification(notification, options.fallbackClientSlug);

  if (options.viewer === "admin") {
    const entityHref = buildAdminNotificationEntityHref(notification);
    if (entityHref) return entityHref;
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

  const entityHref = buildClientNotificationEntityHref(notification, clientSlug);
  if (entityHref) return entityHref;
  if (notification.pageId) {
    return `/client/${clientSlug}/workspace/${notification.pageId}`;
  }
  if (notification.taskId || notification.entityType === "workspace_task") {
    return `/client/${clientSlug}/workspace/tasks`;
  }

  return `/client/${clientSlug}/updates`;
}
