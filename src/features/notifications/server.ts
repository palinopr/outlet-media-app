import { clerkClient } from "@clerk/nextjs/server";
import { listVisibleAssetIdsForScope } from "@/features/assets/server";
import type { ScopeFilter } from "@/lib/member-access";
import { supabaseAdmin } from "@/lib/supabase";
import type { AppNotification, CreateNotificationInput } from "./types";

interface ListNotificationsForUserOptions {
  clientSlug?: string | null;
  limit?: number;
  scope?: ScopeFilter;
}

type NotificationScopeMaps = {
  allowedApprovalIds: Set<string>;
  allowedAssetCommentIds: Set<string>;
  allowedAssetFollowUpIds: Set<string>;
  allowedAssetIds: Set<string> | null;
  allowedCampaignActionItemIds: Set<string>;
  allowedCampaignCommentIds: Set<string>;
  allowedCampaignIds: Set<string>;
  allowedEventCommentIds: Set<string>;
  allowedEventFollowUpIds: Set<string>;
  allowedEventIds: Set<string>;
};

function mapNotificationRow(row: Record<string, unknown>): AppNotification {
  return {
    clientSlug: (row.client_slug as string | null) ?? null,
    createdAt: row.created_at as string,
    entityId: (row.entity_id as string | null) ?? null,
    entityType: (row.entity_type as string | null) ?? null,
    fromUserId: (row.from_user_id as string | null) ?? null,
    fromUserName: (row.from_user_name as string | null) ?? null,
    id: row.id as string,
    message: (row.message as string | null) ?? null,
    pageId: (row.page_id as string | null) ?? null,
    read: Boolean(row.read),
    taskId: (row.task_id as string | null) ?? null,
    title: row.title as string,
    type: row.type as string,
    userId: row.user_id as string,
  };
}

export async function createNotification(data: CreateNotificationInput) {
  if (!supabaseAdmin) throw new Error("DB not configured");

  const { error } = await supabaseAdmin.from("notifications" as never).insert({
    client_slug: data.clientSlug ?? null,
    created_at: new Date().toISOString(),
    entity_id: data.entityId ?? null,
    entity_type: data.entityType ?? null,
    from_user_id: data.fromUserId ?? null,
    from_user_name: data.fromUserName ?? null,
    message: data.message ?? null,
    page_id: data.pageId ?? null,
    read: data.read ?? false,
    task_id: data.taskId ?? null,
    title: data.title,
    type: data.type,
    user_id: data.userId,
  } as never);
  if (error) throw new Error(error.message);
}

export async function listNotificationsForUser(
  userId: string,
  options: ListNotificationsForUserOptions = {},
): Promise<AppNotification[]> {
  if (!supabaseAdmin || !userId) return [];

  let query = supabaseAdmin
    .from("notifications" as never)
    .select(
      "id, user_id, type, title, message, page_id, task_id, from_user_id, from_user_name, read, created_at, client_slug, entity_type, entity_id",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(options.limit ?? 50);

  if (options.clientSlug) {
    query = query.eq("client_slug", options.clientSlug);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[notifications] failed to list notifications:", error.message);
    return [];
  }

  const notifications = ((data ?? []) as Record<string, unknown>[]).map((row) =>
    mapNotificationRow(row),
  );

  if (!options.clientSlug || !options.scope) {
    return notifications;
  }

  return filterNotificationsByScope(notifications, options.clientSlug, options.scope);
}

export async function listClientNotificationRecipients(
  clientSlug: string,
  options: { excludeUserId?: string | null } = {},
) {
  if (!supabaseAdmin) return [];

  const { data: client, error: clientError } = await supabaseAdmin
    .from("clients")
    .select("id")
    .eq("slug", clientSlug)
    .maybeSingle();

  if (clientError || !client) return [];

  let query = supabaseAdmin
    .from("client_members")
    .select("clerk_user_id")
    .eq("client_id", client.id)
    .not("clerk_user_id", "is", null);

  if (options.excludeUserId) {
    query = query.neq("clerk_user_id", options.excludeUserId);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[notifications] failed to list client recipients:", error.message);
    return [];
  }

  return [...new Set((data ?? []).map((row) => row.clerk_user_id).filter(Boolean))];
}

export async function listAdminNotificationRecipients(
  options: { excludeUserId?: string | null } = {},
) {
  const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!clerkEnabled) return [];

  try {
    const client = await clerkClient();
    const { data: users } = await client.users.getUserList({ limit: 100 });

    return users
      .filter((user) => {
        if (options.excludeUserId && user.id === options.excludeUserId) return false;
        const role = (user.publicMetadata as { role?: string } | null)?.role;
        return role === "admin";
      })
      .map((user) => user.id);
  } catch (error) {
    console.error("[notifications] failed to list admin recipients:", error);
    return [];
  }
}

function isScopedNotificationEntity(entityType: string | null) {
  return [
    "approval_request",
    "asset",
    "asset_comment",
    "asset_follow_up_item",
    "campaign",
    "campaign_action_item",
    "campaign_comment",
    "event",
    "event_comment",
    "event_follow_up_item",
  ].includes(entityType ?? "");
}

async function mapScopedEntityRelations(
  table: string,
  idField: string,
  relationField: string,
  entityIds: string[],
): Promise<Map<string, string>> {
  const db = supabaseAdmin;
  if (!db || entityIds.length === 0) return new Map();

  const { data, error } = await db
    .from(table as never)
    .select("*")
    .in(idField, entityIds);

  if (error) {
    console.error(`[notifications] failed to load ${table} scope mapping:`, error.message);
    return new Map();
  }

  return new Map(
    ((data ?? []) as Record<string, unknown>[]).map((row) => [
      String(row[idField]),
      String(row[relationField]),
    ]),
  );
}

function buildNotificationScopeMaps(scope: ScopeFilter): NotificationScopeMaps {
  return {
    allowedApprovalIds: new Set<string>(),
    allowedAssetCommentIds: new Set<string>(),
    allowedAssetFollowUpIds: new Set<string>(),
    allowedAssetIds: null,
    allowedCampaignActionItemIds: new Set<string>(),
    allowedCampaignCommentIds: new Set<string>(),
    allowedCampaignIds: new Set(scope.allowedCampaignIds ?? []),
    allowedEventCommentIds: new Set<string>(),
    allowedEventFollowUpIds: new Set<string>(),
    allowedEventIds: new Set(scope.allowedEventIds ?? []),
  };
}

async function resolveNotificationScopeMaps(
  notifications: AppNotification[],
  clientSlug: string,
  scope: ScopeFilter,
): Promise<NotificationScopeMaps> {
  const db = supabaseAdmin;
  const maps = buildNotificationScopeMaps(scope);
  if (!db) return maps;
  const campaignCommentIds: string[] = [];
  const campaignActionItemIds: string[] = [];
  const eventCommentIds: string[] = [];
  const eventFollowUpIds: string[] = [];
  const assetIds: string[] = [];
  const assetCommentIds: string[] = [];
  const assetFollowUpIds: string[] = [];
  const approvalIds: string[] = [];

  for (const notification of notifications) {
    if (!notification.entityId) continue;

    switch (notification.entityType) {
      case "campaign_comment":
        campaignCommentIds.push(notification.entityId);
        break;
      case "campaign_action_item":
        campaignActionItemIds.push(notification.entityId);
        break;
      case "event_comment":
        eventCommentIds.push(notification.entityId);
        break;
      case "event_follow_up_item":
        eventFollowUpIds.push(notification.entityId);
        break;
      case "asset":
        assetIds.push(notification.entityId);
        break;
      case "asset_comment":
        assetCommentIds.push(notification.entityId);
        break;
      case "asset_follow_up_item":
        assetFollowUpIds.push(notification.entityId);
        break;
      case "approval_request":
        approvalIds.push(notification.entityId);
        break;
      default:
        break;
    }
  }

  const [campaignComments, campaignActionItems, eventComments, eventFollowUps] =
    await Promise.all([
      mapScopedEntityRelations("campaign_comments", "id", "campaign_id", campaignCommentIds),
      mapScopedEntityRelations(
        "campaign_action_items",
        "id",
        "campaign_id",
        campaignActionItemIds,
      ),
      mapScopedEntityRelations("event_comments", "id", "event_id", eventCommentIds),
      mapScopedEntityRelations("event_follow_up_items", "id", "event_id", eventFollowUpIds),
    ]);

  for (const [id, campaignId] of campaignComments) {
    if (maps.allowedCampaignIds.has(campaignId)) {
      maps.allowedCampaignCommentIds.add(id);
    }
  }

  for (const [id, campaignId] of campaignActionItems) {
    if (maps.allowedCampaignIds.has(campaignId)) {
      maps.allowedCampaignActionItemIds.add(id);
    }
  }

  for (const [id, eventId] of eventComments) {
    if (maps.allowedEventIds.has(eventId)) {
      maps.allowedEventCommentIds.add(id);
    }
  }

  for (const [id, eventId] of eventFollowUps) {
    if (maps.allowedEventIds.has(eventId)) {
      maps.allowedEventFollowUpIds.add(id);
    }
  }

  const rawAssetIds = [
    ...assetIds,
    ...(
      await Promise.all([
        mapScopedEntityRelations("asset_comments", "id", "asset_id", assetCommentIds),
        mapScopedEntityRelations("asset_follow_up_items", "id", "asset_id", assetFollowUpIds),
      ])
    ).flatMap((mapping) => Array.from(mapping.values())),
  ];

  const allowedAssetIds = await listVisibleAssetIdsForScope(
    clientSlug,
    [...new Set(rawAssetIds)],
    scope,
  );
  maps.allowedAssetIds = allowedAssetIds;

  const [assetCommentMap, assetFollowUpMap] = await Promise.all([
    mapScopedEntityRelations("asset_comments", "id", "asset_id", assetCommentIds),
    mapScopedEntityRelations("asset_follow_up_items", "id", "asset_id", assetFollowUpIds),
  ]);

  for (const [id, assetId] of assetCommentMap) {
    if (allowedAssetIds?.has(assetId)) {
      maps.allowedAssetCommentIds.add(id);
    }
  }

  for (const [id, assetId] of assetFollowUpMap) {
    if (allowedAssetIds?.has(assetId)) {
      maps.allowedAssetFollowUpIds.add(id);
    }
  }

  if (approvalIds.length > 0) {
    const { data, error } = await db
      .from("approval_requests" as never)
      .select("id, entity_type, entity_id, metadata")
      .eq("client_slug", clientSlug)
      .in("id", approvalIds);

    if (error) {
      console.error("[notifications] failed to load approval scope mapping:", error.message);
    } else {
      for (const row of (data ?? []) as Record<string, unknown>[]) {
        const id = String(row.id);
        const entityType = (row.entity_type as string | null) ?? null;
        const entityId = (row.entity_id as string | null) ?? null;
        const metadata = (row.metadata as Record<string, unknown> | null) ?? null;
        const campaignId =
          entityType === "campaign"
            ? entityId
            : typeof metadata?.campaignId === "string"
              ? metadata.campaignId
              : null;
        const eventId =
          entityType === "event"
            ? entityId
            : typeof metadata?.eventId === "string"
              ? metadata.eventId
              : null;
        const assetId =
          entityType === "asset"
            ? entityId
            : typeof metadata?.assetId === "string"
              ? metadata.assetId
              : null;

        if (campaignId && maps.allowedCampaignIds.has(campaignId)) {
          maps.allowedApprovalIds.add(id);
          continue;
        }

        if (eventId && maps.allowedEventIds.has(eventId)) {
          maps.allowedApprovalIds.add(id);
          continue;
        }

        if (assetId && allowedAssetIds?.has(assetId)) {
          maps.allowedApprovalIds.add(id);
          continue;
        }

        if (!campaignId && !eventId && !assetId) {
          maps.allowedApprovalIds.add(id);
        }
      }
    }
  }

  return maps;
}

function notificationMatchesScope(
  notification: AppNotification,
  maps: NotificationScopeMaps,
) {
  const entityType = notification.entityType;
  const entityId = notification.entityId;

  if (!isScopedNotificationEntity(entityType)) {
    return true;
  }

  if (!entityId) {
    return false;
  }

  switch (entityType) {
    case "campaign":
      return maps.allowedCampaignIds.has(entityId);
    case "campaign_comment":
      return maps.allowedCampaignCommentIds.has(entityId);
    case "campaign_action_item":
      return maps.allowedCampaignActionItemIds.has(entityId);
    case "event":
      return maps.allowedEventIds.has(entityId);
    case "event_comment":
      return maps.allowedEventCommentIds.has(entityId);
    case "event_follow_up_item":
      return maps.allowedEventFollowUpIds.has(entityId);
    case "asset":
      return maps.allowedAssetIds?.has(entityId) ?? false;
    case "asset_comment":
      return maps.allowedAssetCommentIds.has(entityId);
    case "asset_follow_up_item":
      return maps.allowedAssetFollowUpIds.has(entityId);
    case "approval_request":
      return maps.allowedApprovalIds.has(entityId);
    default:
      return true;
  }
}

export async function filterNotificationsByScope(
  notifications: AppNotification[],
  clientSlug: string,
  scope: ScopeFilter,
): Promise<AppNotification[]> {
  const maps = await resolveNotificationScopeMaps(notifications, clientSlug, scope);
  return notifications.filter((notification) => notificationMatchesScope(notification, maps));
}
