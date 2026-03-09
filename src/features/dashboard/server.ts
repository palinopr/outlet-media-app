import { currentUser } from "@clerk/nextjs/server";
import type { TaskPriority } from "@/lib/workspace-types";
import type { ScopeFilter } from "@/lib/member-access";
import {
  applyEffectiveCampaignClientSlugs,
  listEffectiveCampaignIdsForClientSlug,
} from "@/lib/campaign-client-assignment";
import { createClerkSupabaseClient, supabaseAdmin } from "@/lib/supabase";
import { listApprovalRequests } from "@/features/approvals/server";
import { listCrmFollowUpItems } from "@/features/crm-follow-up-items/server";
import { listConversationThreads } from "@/features/conversations/server";
import type { ConversationThread } from "@/features/conversations/summary";
import { buildAssetLibrarySummary, type AssetLibrarySummary } from "@/features/assets/summary";
import { listAssetLibrary } from "@/features/assets/server";
import {
  buildDashboardOpsSummary,
  type DashboardApprovalRecord,
  type DashboardActionItemRecord,
  type DashboardCampaignRecord,
  type DashboardCommentRecord,
  type DashboardEventRecord,
  type DashboardOpsSummary,
  type DashboardSummaryMode,
} from "@/features/dashboard/summary";

interface GetDashboardOpsSummaryOptions {
  clientSlug?: string;
  limit?: number;
  mode: DashboardSummaryMode;
  scopeCampaignIds?: string[] | null;
}

interface GetDashboardActionCenterOptions {
  clientSlug?: string;
  limit?: number;
  mode: DashboardSummaryMode;
  scopeCampaignIds?: string[] | null;
  scopeEventIds?: string[] | null;
}

interface GetDashboardAssetSummaryOptions {
  clientSlug?: string;
  limit?: number;
  scope?: ScopeFilter;
}

export interface DashboardActionCenterApproval {
  assetId: string | null;
  assetName: string | null;
  campaignId: string | null;
  campaignName: string | null;
  clientSlug: string;
  createdAt: string;
  eventId: string | null;
  eventName: string | null;
  id: string;
  summary: string | null;
  title: string;
}

export type DashboardActionCenterDiscussion = ConversationThread;

export interface DashboardActionCenterCrmFollowUp {
  clientSlug: string;
  contactId: string;
  contactName: string | null;
  createdAt: string;
  dueDate: string | null;
  id: string;
  priority: TaskPriority;
  title: string;
}

export interface DashboardActionCenter {
  approvals: DashboardActionCenterApproval[];
  crmFollowUps: DashboardActionCenterCrmFollowUp[];
  discussions: DashboardActionCenterDiscussion[];
}

async function getDashboardReadClient(options: {
  clientSlug?: string;
  mode: DashboardSummaryMode;
}) {
  if (!supabaseAdmin) return null;
  if (options.mode !== "client" || !options.clientSlug) return supabaseAdmin;

  try {
    const user = await currentUser();
    const role = (user?.publicMetadata as { role?: string } | null)?.role;
    if (role === "admin") {
      return supabaseAdmin;
    }
  } catch {
    return supabaseAdmin;
  }

  return (await createClerkSupabaseClient()) ?? supabaseAdmin;
}

function emptySummary(mode: DashboardSummaryMode, limit?: number): DashboardOpsSummary {
  return buildDashboardOpsSummary({
    actionItems: [],
    approvals: [],
    campaigns: [],
    comments: [],
    events: [],
    limit,
    mode,
  });
}

function resolveCampaignId(
  entityType: string | null,
  entityId: string | null,
  metadata: Record<string, unknown>,
) {
  if (entityType === "campaign" && entityId) return entityId;

  const campaignId = metadata.campaignId;
  return typeof campaignId === "string" && campaignId.length > 0 ? campaignId : null;
}

function resolveCampaignName(
  campaignId: string | null,
  metadata: Record<string, unknown>,
  campaignNames: Map<string, string>,
) {
  const metadataName = metadata.campaignName;
  if (typeof metadataName === "string" && metadataName.length > 0) return metadataName;
  if (!campaignId) return null;
  return campaignNames.get(campaignId) ?? null;
}

function resolveAssetId(
  entityType: string | null,
  entityId: string | null,
  metadata: Record<string, unknown>,
) {
  if (entityType === "asset" && entityId) return entityId;

  const assetId = metadata.assetId;
  return typeof assetId === "string" && assetId.length > 0 ? assetId : null;
}

function resolveAssetName(metadata: Record<string, unknown>) {
  const assetName = metadata.assetName;
  return typeof assetName === "string" && assetName.length > 0 ? assetName : null;
}

function resolveEventId(
  entityType: string | null,
  entityId: string | null,
  metadata: Record<string, unknown>,
) {
  if (entityType === "event" && entityId) return entityId;

  const eventId = metadata.eventId;
  return typeof eventId === "string" && eventId.length > 0 ? eventId : null;
}

function resolveEventName(
  eventId: string | null,
  metadata: Record<string, unknown>,
  eventNames: Map<string, string>,
) {
  const metadataName = metadata.eventName;
  if (typeof metadataName === "string" && metadataName.length > 0) return metadataName;
  if (!eventId) return null;
  return eventNames.get(eventId) ?? null;
}

export async function getDashboardOpsSummary(
  options: GetDashboardOpsSummaryOptions,
): Promise<DashboardOpsSummary> {
  const db = await getDashboardReadClient(options);
  if (!db) return emptySummary(options.mode, options.limit);

  const effectiveClientCampaignIds = options.clientSlug
    ? await listEffectiveCampaignIdsForClientSlug(options.clientSlug)
    : null;
  const scopeIds = options.scopeCampaignIds ?? effectiveClientCampaignIds ?? null;
  if (scopeIds && scopeIds.length === 0) {
    return emptySummary(options.mode, options.limit);
  }

  const recentSince = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  let campaignsQuery = db
    .from("meta_campaigns")
    .select("campaign_id, client_slug, name, status")
    .limit(600);

  let actionItemsQuery = db
    .from("campaign_action_items")
    .select("campaign_id, client_slug, priority, status, updated_at")
    .neq("status", "done")
    .order("updated_at", { ascending: false })
    .limit(500);

  let commentsQuery = db
    .from("campaign_comments")
    .select("campaign_id, client_slug, created_at")
    .eq("resolved", false)
    .is("parent_comment_id", null)
    .order("created_at", { ascending: false })
    .limit(500);

  let eventsQuery = db
    .from("system_events")
    .select("client_slug, created_at, entity_id, entity_type, metadata")
    .gte("created_at", recentSince)
    .order("created_at", { ascending: false })
    .limit(500);

  if (options.clientSlug) {
    eventsQuery = eventsQuery.eq("client_slug", options.clientSlug);
  }

  if (scopeIds && scopeIds.length > 0) {
    campaignsQuery = campaignsQuery.in("campaign_id", scopeIds);
    actionItemsQuery = actionItemsQuery.in("campaign_id", scopeIds);
    commentsQuery = commentsQuery.in("campaign_id", scopeIds);
  }

  if (options.mode === "client") {
    actionItemsQuery = actionItemsQuery.eq("visibility", "shared");
    commentsQuery = commentsQuery.eq("visibility", "shared");
    eventsQuery = eventsQuery.eq("visibility", "shared");
  }

  const [campaignsRes, approvals, actionItemsRes, commentsRes, eventsRes] = await Promise.all([
    campaignsQuery,
    listApprovalRequests({
      audience: "all",
      clientSlug: options.clientSlug,
      limit: 500,
      scope:
        scopeIds != null
          ? { allowedCampaignIds: scopeIds, allowedEventIds: null }
          : null,
      status: "pending",
    }),
    actionItemsQuery,
    commentsQuery,
    eventsQuery,
  ]);

  const allowedCampaignIds = scopeIds ? new Set(scopeIds) : null;
  const clientCampaignIds = effectiveClientCampaignIds
    ? new Set(effectiveClientCampaignIds)
    : null;

  const effectiveCampaignRows = await applyEffectiveCampaignClientSlugs(
    ((campaignsRes.data ?? []) as Array<Record<string, unknown> & {
      campaign_id: string;
      client_slug: string | null;
      name: string | null;
      status: string | null;
    }>),
  );

  const campaigns: DashboardCampaignRecord[] = effectiveCampaignRows
    .filter((row) => row.client_slug && (!options.clientSlug || row.client_slug === options.clientSlug))
    .map((row) => ({
      campaignId: row.campaign_id as string,
      clientSlug: row.client_slug as string,
      name: (row.name as string) ?? (row.campaign_id as string),
      status: (row.status as string) ?? "unknown",
    }));

  const approvalRecords: DashboardApprovalRecord[] = approvals
    .map((row) => ({
      clientSlug: row.clientSlug,
      createdAt: row.createdAt,
      entityId: row.entityId,
      entityType: row.entityType,
      metadata: row.metadata,
    }))
    .filter((row) => {
      const campaignId =
        row.entityType === "campaign"
          ? row.entityId
          : typeof row.metadata.campaignId === "string"
            ? row.metadata.campaignId
            : null;

      if (options.clientSlug) {
        if (campaignId) {
          return clientCampaignIds?.has(campaignId) ?? false;
        }
        return row.clientSlug === options.clientSlug;
      }

      if (!allowedCampaignIds) return true;
      return !!campaignId && allowedCampaignIds.has(campaignId);
    });

  const actionItems: DashboardActionItemRecord[] = (actionItemsRes.data ?? []).map((row) => ({
    campaignId: row.campaign_id as string,
    clientSlug: row.client_slug as string,
    priority: row.priority as TaskPriority,
    status: row.status as string,
    updatedAt: row.updated_at as string,
  }));

  const comments: DashboardCommentRecord[] = (commentsRes.data ?? []).map((row) => ({
    campaignId: row.campaign_id as string,
    clientSlug: row.client_slug as string,
    createdAt: row.created_at as string,
  }));

  const events: DashboardEventRecord[] = (eventsRes.data ?? [])
    .map((row) => ({
      clientSlug: row.client_slug as string,
      createdAt: row.created_at as string,
      entityId: (row.entity_id as string | null) ?? null,
      entityType: (row.entity_type as string | null) ?? null,
      metadata: ((row.metadata as Record<string, unknown> | null) ?? {}) as Record<string, unknown>,
    }))
    .filter((row) => {
      if (!allowedCampaignIds) return true;
      const campaignId =
        row.entityType === "campaign"
          ? row.entityId
          : typeof row.metadata.campaignId === "string"
            ? row.metadata.campaignId
            : null;
      return !!campaignId && allowedCampaignIds.has(campaignId);
    });

  return buildDashboardOpsSummary({
    actionItems,
    approvals: approvalRecords,
    campaigns,
    comments,
    events,
    limit: options.limit,
    mode: options.mode,
  });
}

export async function getDashboardAssetSummary(
  options: GetDashboardAssetSummaryOptions = {},
): Promise<AssetLibrarySummary> {
  const records = await listAssetLibrary(
    options.clientSlug,
    Math.max((options.limit ?? 6) * 8, 48),
    options.scope,
  );
  return buildAssetLibrarySummary(records, options.limit ?? 6);
}

export async function getDashboardActionCenter(
  options: GetDashboardActionCenterOptions,
): Promise<DashboardActionCenter> {
  const db = await getDashboardReadClient(options);
  if (!db) {
    return { approvals: [], crmFollowUps: [], discussions: [] };
  }

  const effectiveClientCampaignIds = options.clientSlug
    ? await listEffectiveCampaignIdsForClientSlug(options.clientSlug)
    : null;
  const scopeIds = options.scopeCampaignIds ?? effectiveClientCampaignIds ?? null;
  const scopeEventIds = options.scopeEventIds ?? null;
  if (scopeIds && scopeIds.length === 0 && scopeEventIds && scopeEventIds.length === 0) {
    return { approvals: [], crmFollowUps: [], discussions: [] };
  }

  let campaignsQuery = db
    .from("meta_campaigns")
    .select("campaign_id, client_slug, name")
    .limit(600);

  if (scopeIds && scopeIds.length > 0) {
    campaignsQuery = campaignsQuery.in("campaign_id", scopeIds);
  }

  const [campaignsRes, approvals, discussions, crmFollowUpItems] = await Promise.all([
    campaignsQuery,
    listApprovalRequests({
      audience: "all",
      clientSlug: options.clientSlug,
      limit: Math.max((options.limit ?? 4) * 4, 12),
      scope:
        options.scopeCampaignIds != null || options.scopeEventIds != null
          ? {
              allowedCampaignIds: options.scopeCampaignIds ?? null,
              allowedEventIds: options.scopeEventIds ?? null,
            }
          : null,
      status: "pending",
    }),
    listConversationThreads({
      clientSlug: options.clientSlug,
      limit: Math.max((options.limit ?? 4) * 4, 12),
      mode: options.mode,
      scope: {
        allowedCampaignIds: options.scopeCampaignIds ?? null,
        allowedEventIds: options.scopeEventIds ?? null,
      },
    }),
    listCrmFollowUpItems({
      audience: options.mode === "client" ? "shared" : "all",
      clientSlug: options.clientSlug,
      limit: Math.max((options.limit ?? 4) * 4, 12),
    }),
  ]);

  const allowedCampaignIds = scopeIds ? new Set(scopeIds) : null;
  const clientCampaignIds = effectiveClientCampaignIds
    ? new Set(effectiveClientCampaignIds)
    : null;
  const effectiveCampaignNameRows = await applyEffectiveCampaignClientSlugs(
    ((campaignsRes.data ?? []) as Array<Record<string, unknown> & {
      campaign_id: string;
      client_slug: string | null;
      name: string | null;
    }>),
  );
  const campaignNames = new Map<string, string>();

  for (const row of effectiveCampaignNameRows) {
    if (options.clientSlug && row.client_slug !== options.clientSlug) continue;
    if (!row.client_slug) continue;
    const campaignId = row.campaign_id as string;
    const name = row.name as string | null;
    campaignNames.set(campaignId, name && name.length > 0 ? name : campaignId);
  }

  const allowedEventIdSet = scopeEventIds ? new Set(scopeEventIds) : null;

  const approvalRows: DashboardActionCenterApproval[] = approvals
    .map((row) => {
      const metadata = row.metadata;
      const campaignId = resolveCampaignId(
        row.entityType ?? null,
        row.entityId ?? null,
        metadata,
      );
      const eventId = resolveEventId(
        row.entityType ?? null,
        row.entityId ?? null,
        metadata,
      );

      return {
        assetId: resolveAssetId(
          row.entityType ?? null,
          row.entityId ?? null,
          metadata,
        ),
        assetName: resolveAssetName(metadata),
        campaignId,
        campaignName: resolveCampaignName(campaignId, metadata, campaignNames),
        clientSlug: row.clientSlug,
        createdAt: row.createdAt,
        eventId,
        eventName: resolveEventName(eventId, metadata, new Map<string, string>()),
        id: row.id,
        summary: row.summary,
        title: row.title,
      };
    })
    .filter((row) => {
      if (options.clientSlug) {
        if (row.campaignId) {
          return clientCampaignIds?.has(row.campaignId) ?? false;
        }

        return row.clientSlug === options.clientSlug;
      }

      if (!allowedCampaignIds && !allowedEventIdSet) return true;
      if (row.campaignId && allowedCampaignIds?.has(row.campaignId)) return true;
      if (row.eventId && allowedEventIdSet?.has(row.eventId)) return true;
      return false;
    })
    .slice(0, options.limit ?? 4);

  const eventIds = [
    ...new Set(
      approvalRows
        .map((row) => row.eventId)
        .filter((value): value is string => typeof value === "string" && value.length > 0),
    ),
  ];

  if (eventIds.length > 0) {
    const { data: eventRows } = await db
      .from("tm_events")
      .select("id, name, artist")
      .in("id", eventIds);
    const eventNames = new Map<string, string>();

    for (const row of (eventRows ?? []) as Record<string, unknown>[]) {
      eventNames.set(
        row.id as string,
        (row.artist as string | null) ?? (row.name as string | null) ?? "Event",
      );
    }

    for (const approval of approvalRows) {
      approval.eventName = approval.eventName ?? resolveEventName(approval.eventId, {}, eventNames);
    }
  }

  const crmFollowUps: DashboardActionCenterCrmFollowUp[] = crmFollowUpItems
    .filter((item) => item.status !== "done")
    .sort((a, b) => {
      const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
      const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;
      if (aDate !== bDate) return aDate - bDate;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    })
    .slice(0, options.limit ?? 4)
    .map((item) => ({
      clientSlug: item.clientSlug,
      contactId: item.contactId,
      contactName: item.contactName,
      createdAt: item.createdAt,
      dueDate: item.dueDate,
      id: item.id,
      priority: item.priority,
      title: item.title,
    }));

  return {
    approvals: approvalRows,
    crmFollowUps,
    discussions: discussions.slice(0, options.limit ?? 4),
  };
}
