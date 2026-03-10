import type { ScopeFilter } from "@/lib/member-access";
import { getFeatureReadClient, supabaseAdmin } from "@/lib/supabase";
import { listVisibleAssetIdsForScope } from "@/features/assets/server";
import { listEffectiveCampaignIdsForClientSlug } from "@/lib/campaign-client-assignment";
import {
  buildConversationsSummary,
  type ConversationThread,
  type ConversationThreadKind,
  type ConversationsSummary,
} from "./summary";

interface GetConversationsCenterOptions {
  clientSlug?: string | null;
  kinds?: ConversationThreadKind[];
  limit?: number;
  mode: "admin" | "client";
  scope?: ScopeFilter;
}

export interface ConversationsCenter {
  summary: ConversationsSummary;
  threads: ConversationThread[];
}


function stringValue(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function sortThreads(left: ConversationThread, right: ConversationThread) {
  return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
}

export function matchesConversationKinds(
  thread: Pick<ConversationThread, "kind">,
  kinds?: ConversationThreadKind[] | null,
) {
  if (!kinds || kinds.length === 0) return true;
  return kinds.includes(thread.kind);
}

export async function listConversationThreads(
  options: GetConversationsCenterOptions,
): Promise<ConversationThread[]> {
  const db = await getFeatureReadClient(options.mode === "client" && !!options.clientSlug);
  if (!db) return [];

  const limitPerKind = Math.max((options.limit ?? 12) * 4, 24);
  const effectiveClientCampaignIds = options.clientSlug
    ? await listEffectiveCampaignIdsForClientSlug(options.clientSlug)
    : null;
  const allowedCampaignIds = options.scope?.allowedCampaignIds ?? effectiveClientCampaignIds;
  const allowedEventIds = options.scope?.allowedEventIds ?? null;

  let campaignQuery = db
    .from("campaign_comments")
    .select("id, campaign_id, client_slug, author_name, content, created_at")
    .eq("resolved", false)
    .is("parent_comment_id", null)
    .order("created_at", { ascending: false })
    .limit(limitPerKind);

  let crmQuery = db
    .from("crm_comments")
    .select("id, contact_id, client_slug, author_name, content, created_at")
    .eq("resolved", false)
    .is("parent_comment_id", null)
    .order("created_at", { ascending: false })
    .limit(limitPerKind);

  let assetQuery = db
    .from("asset_comments" as never)
    .select("id, asset_id, client_slug, author_name, content, created_at")
    .eq("resolved", false)
    .is("parent_comment_id", null)
    .order("created_at", { ascending: false })
    .limit(limitPerKind);

  let eventQuery = db
    .from("event_comments" as never)
    .select("id, event_id, client_slug, author_name, content, created_at")
    .eq("resolved", false)
    .is("parent_comment_id", null)
    .order("created_at", { ascending: false })
    .limit(limitPerKind);

  if (options.clientSlug) {
    crmQuery = crmQuery.eq("client_slug", options.clientSlug);
    assetQuery = assetQuery.eq("client_slug", options.clientSlug);
    eventQuery = eventQuery.eq("client_slug", options.clientSlug);
  }

  if (allowedCampaignIds && allowedCampaignIds.length > 0) {
    campaignQuery = campaignQuery.in("campaign_id", allowedCampaignIds);
  } else if (options.mode === "client" && allowedCampaignIds && allowedCampaignIds.length === 0) {
    campaignQuery = campaignQuery.limit(0);
  }

  if (allowedEventIds && allowedEventIds.length > 0) {
    eventQuery = eventQuery.in("event_id", allowedEventIds);
  } else if (options.mode === "client" && allowedEventIds && allowedEventIds.length === 0) {
    eventQuery = eventQuery.limit(0);
  }

  if (options.mode === "client") {
    campaignQuery = campaignQuery.eq("visibility", "shared");
    crmQuery = crmQuery.eq("visibility", "shared");
    assetQuery = assetQuery.eq("visibility", "shared");
    eventQuery = eventQuery.eq("visibility", "shared");
  }

  const [campaignRes, crmRes, assetRes, eventRes] = await Promise.all([
    campaignQuery,
    crmQuery,
    assetQuery,
    eventQuery,
  ]);

  const campaignRows = (campaignRes.data ?? []) as Record<string, unknown>[];
  const crmRows = (crmRes.data ?? []) as Record<string, unknown>[];
  const rawAssetRows = (assetRes.data ?? []) as Record<string, unknown>[];
  const eventRows = (eventRes.data ?? []) as Record<string, unknown>[];

  const scopedAssetIds =
    options.mode === "client" && options.clientSlug
      ? await listVisibleAssetIdsForScope(
          options.clientSlug,
          rawAssetRows.map((row) => String(row.asset_id)).filter(Boolean),
          options.scope,
        )
      : null;
  const assetRows =
    scopedAssetIds === null
      ? rawAssetRows
      : rawAssetRows.filter((row) => scopedAssetIds.has(String(row.asset_id)));

  const campaignNames = new Map<string, string>();
  const contactNames = new Map<string, string>();
  const assetNames = new Map<string, string>();
  const eventNames = new Map<string, string>();

  const campaignIds = [
    ...new Set(
      campaignRows
        .map((row) => stringValue(row.campaign_id))
        .filter((value): value is string => value !== null),
    ),
  ];
  const contactIds = [
    ...new Set(
      crmRows
        .map((row) => stringValue(row.contact_id))
        .filter((value): value is string => value !== null),
    ),
  ];
  const assetIds = [
    ...new Set(
      assetRows
        .map((row) => stringValue(row.asset_id))
        .filter((value): value is string => value !== null),
    ),
  ];
  const eventIds = [
    ...new Set(
      eventRows
        .map((row) => stringValue(row.event_id))
        .filter((value): value is string => value !== null),
    ),
  ];
  const campaignCommentIds = campaignRows.map((row) => String(row.id));
  const crmCommentIds = crmRows.map((row) => String(row.id));
  const assetCommentIds = assetRows.map((row) => String(row.id));
  const eventCommentIds = eventRows.map((row) => String(row.id));

  const [
    campaignNamesRes,
    contactNamesRes,
    assetNamesRes,
    eventNamesRes,
    linkedCampaignItemRows,
    linkedCrmItemRows,
    linkedAssetItemRows,
    linkedEventItemRows,
  ] = await Promise.all([
    campaignIds.length > 0
      ? db
          .from("meta_campaigns")
          .select("campaign_id, name")
          .in("campaign_id", campaignIds)
      : Promise.resolve({ data: [] }),
    contactIds.length > 0
      ? db
          .from("crm_contacts" as never)
          .select("id, full_name")
          .in("id", contactIds)
      : Promise.resolve({ data: [] }),
    assetIds.length > 0
      ? db
          .from("ad_assets")
          .select("id, file_name")
          .in("id", assetIds)
      : Promise.resolve({ data: [] }),
    eventIds.length > 0
      ? db
          .from("tm_events")
          .select("id, name, artist")
          .in("id", eventIds)
      : Promise.resolve({ data: [] }),
    campaignCommentIds.length > 0
      ? db
          .from("campaign_action_items")
          .select("id, source_entity_id")
          .eq("source_entity_type", "campaign_comment")
          .in("source_entity_id", campaignCommentIds)
      : Promise.resolve({ data: [] }),
    crmCommentIds.length > 0
      ? db
          .from("crm_follow_up_items" as never)
          .select("id, source_entity_id")
          .eq("source_entity_type", "crm_comment")
          .in("source_entity_id", crmCommentIds)
      : Promise.resolve({ data: [] }),
    assetCommentIds.length > 0
      ? db
          .from("asset_follow_up_items" as never)
          .select("id, source_entity_id")
          .eq("source_entity_type", "asset_comment")
          .in("source_entity_id", assetCommentIds)
      : Promise.resolve({ data: [] }),
    eventCommentIds.length > 0
      ? db
          .from("event_follow_up_items" as never)
          .select("id, source_entity_id")
          .eq("source_entity_type", "event_comment")
          .in("source_entity_id", eventCommentIds)
      : Promise.resolve({ data: [] }),
  ]);

  for (const row of (campaignNamesRes.data ?? []) as { campaign_id: string; name: string | null }[]) {
    campaignNames.set(row.campaign_id, row.name ?? row.campaign_id);
  }

  for (const row of (contactNamesRes.data ?? []) as Record<string, unknown>[]) {
    contactNames.set(String(row.id), String(row.full_name ?? "CRM contact"));
  }

  for (const row of (assetNamesRes.data ?? []) as { id: string; file_name: string | null }[]) {
    assetNames.set(row.id, row.file_name ?? row.id);
  }

  for (const row of (eventNamesRes.data ?? []) as Record<string, unknown>[]) {
    eventNames.set(
      String(row.id),
      String(row.artist ?? row.name ?? "Event"),
    );
  }

  const linkedCampaignItems = new Map<string, string>();
  for (const row of (linkedCampaignItemRows.data ?? []) as Record<string, unknown>[]) {
    linkedCampaignItems.set(String(row.source_entity_id), String(row.id));
  }

  const linkedCrmItems = new Map<string, string>();
  for (const row of (linkedCrmItemRows.data ?? []) as Record<string, unknown>[]) {
    linkedCrmItems.set(String(row.source_entity_id), String(row.id));
  }

  const linkedAssetItems = new Map<string, string>();
  for (const row of (linkedAssetItemRows.data ?? []) as Record<string, unknown>[]) {
    linkedAssetItems.set(String(row.source_entity_id), String(row.id));
  }

  const linkedEventItems = new Map<string, string>();
  for (const row of (linkedEventItemRows.data ?? []) as Record<string, unknown>[]) {
    linkedEventItems.set(String(row.source_entity_id), String(row.id));
  }

  return [
    ...campaignRows.map((row) => ({
      authorName: (row.author_name as string | null) ?? null,
      clientSlug: stringValue(row.client_slug),
      content: row.content as string,
      createdAt: row.created_at as string,
      id: row.id as string,
      kind: "campaign" as const,
      linkedFollowUpItemId: linkedCampaignItems.get(String(row.id)) ?? null,
      targetId: row.campaign_id as string,
      targetName: campaignNames.get(row.campaign_id as string) ?? null,
    })),
    ...crmRows.map((row) => ({
      authorName: (row.author_name as string | null) ?? null,
      clientSlug: stringValue(row.client_slug),
      content: row.content as string,
      createdAt: row.created_at as string,
      id: row.id as string,
      kind: "crm" as const,
      linkedFollowUpItemId: linkedCrmItems.get(String(row.id)) ?? null,
      targetId: row.contact_id as string,
      targetName: contactNames.get(row.contact_id as string) ?? null,
    })),
    ...assetRows.map((row) => ({
      authorName: (row.author_name as string | null) ?? null,
      clientSlug: stringValue(row.client_slug),
      content: row.content as string,
      createdAt: row.created_at as string,
      id: row.id as string,
      kind: "asset" as const,
      linkedFollowUpItemId: linkedAssetItems.get(String(row.id)) ?? null,
      targetId: row.asset_id as string,
      targetName: assetNames.get(row.asset_id as string) ?? null,
    })),
    ...eventRows.map((row) => ({
      authorName: (row.author_name as string | null) ?? null,
      clientSlug: stringValue(row.client_slug),
      content: row.content as string,
      createdAt: row.created_at as string,
      id: row.id as string,
      kind: "event" as const,
      linkedFollowUpItemId: linkedEventItems.get(String(row.id)) ?? null,
      targetId: row.event_id as string,
      targetName: eventNames.get(row.event_id as string) ?? null,
    })),
  ]
    .filter((thread) => matchesConversationKinds(thread, options.kinds))
    .sort(sortThreads);
}

export async function getConversationsCenter(
  options: GetConversationsCenterOptions,
): Promise<ConversationsCenter> {
  const threads = await listConversationThreads({
    ...options,
    limit: Math.max(options.limit ?? 16, 24),
  });

  return {
    summary: buildConversationsSummary(threads),
    threads: threads.slice(0, options.limit ?? 16),
  };
}
