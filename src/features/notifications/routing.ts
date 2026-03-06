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

function routeEntityTypeForNotification(notification: AppNotification) {
  return notification.routeEntityType ?? notification.entityType;
}

function routeEntityIdForNotification(notification: AppNotification) {
  return notification.routeEntityId ?? notification.entityId;
}

function buildAdminNotificationEntityHref(notification: AppNotification) {
  const entityType = routeEntityTypeForNotification(notification);
  const entityId = routeEntityIdForNotification(notification);

  if (entityType === "campaign" && entityId) {
    return `/admin/campaigns/${entityId}`;
  }
  if (entityType === "asset" && entityId) {
    return `/admin/assets/${entityId}`;
  }
  if (entityType === "event" && entityId) {
    return `/admin/events/${entityId}`;
  }
  if (entityType === "crm_contact" && entityId) {
    return `/admin/crm/${entityId}`;
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
  const entityType = routeEntityTypeForNotification(notification);
  const entityId = routeEntityIdForNotification(notification);

  if (entityType === "campaign" && entityId) {
    return `/client/${clientSlug}/campaign/${entityId}`;
  }
  if (entityType === "asset" && entityId) {
    return `/client/${clientSlug}/assets/${entityId}`;
  }
  if (entityType === "event" && entityId) {
    return `/client/${clientSlug}/event/${entityId}`;
  }
  if (entityType === "crm_contact" && entityId) {
    return `/client/${clientSlug}/crm/${entityId}`;
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
