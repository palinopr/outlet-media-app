import type { ScopeFilter } from "@/lib/member-access";
import { supabaseAdmin } from "@/lib/supabase";
import {
  buildConversationsSummary,
  type ConversationThread,
  type ConversationsSummary,
} from "./summary";

interface GetConversationsCenterOptions {
  clientSlug?: string | null;
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

export async function listConversationThreads(
  options: GetConversationsCenterOptions,
): Promise<ConversationThread[]> {
  if (!supabaseAdmin) return [];

  const limitPerKind = Math.max((options.limit ?? 12) * 4, 24);
  const allowedCampaignIds = options.scope?.allowedCampaignIds ?? null;
  const allowedEventIds = options.scope?.allowedEventIds ?? null;

  let campaignQuery = supabaseAdmin
    .from("campaign_comments")
    .select("id, campaign_id, client_slug, author_name, content, created_at")
    .eq("resolved", false)
    .is("parent_comment_id", null)
    .order("created_at", { ascending: false })
    .limit(limitPerKind);

  let crmQuery = supabaseAdmin
    .from("crm_comments")
    .select("id, contact_id, client_slug, author_name, content, created_at")
    .eq("resolved", false)
    .is("parent_comment_id", null)
    .order("created_at", { ascending: false })
    .limit(limitPerKind);

  let assetQuery = supabaseAdmin
    .from("asset_comments" as never)
    .select("id, asset_id, client_slug, author_name, content, created_at")
    .eq("resolved", false)
    .is("parent_comment_id", null)
    .order("created_at", { ascending: false })
    .limit(limitPerKind);

  let eventQuery = supabaseAdmin
    .from("event_comments" as never)
    .select("id, event_id, client_slug, author_name, content, created_at")
    .eq("resolved", false)
    .is("parent_comment_id", null)
    .order("created_at", { ascending: false })
    .limit(limitPerKind);

  if (options.clientSlug) {
    campaignQuery = campaignQuery.eq("client_slug", options.clientSlug);
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
  const assetRows = (assetRes.data ?? []) as Record<string, unknown>[];
  const eventRows = (eventRes.data ?? []) as Record<string, unknown>[];

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

  const [campaignNamesRes, contactNamesRes, assetNamesRes, eventNamesRes] = await Promise.all([
    campaignIds.length > 0
      ? supabaseAdmin
          .from("meta_campaigns")
          .select("campaign_id, name")
          .in("campaign_id", campaignIds)
      : Promise.resolve({ data: [] }),
    contactIds.length > 0
      ? supabaseAdmin
          .from("crm_contacts" as never)
          .select("id, full_name")
          .in("id", contactIds)
      : Promise.resolve({ data: [] }),
    assetIds.length > 0
      ? supabaseAdmin
          .from("ad_assets")
          .select("id, file_name")
          .in("id", assetIds)
      : Promise.resolve({ data: [] }),
    eventIds.length > 0
      ? supabaseAdmin
          .from("tm_events")
          .select("id, name, artist")
          .in("id", eventIds)
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

  return [
    ...campaignRows.map((row) => ({
      authorName: (row.author_name as string | null) ?? null,
      clientSlug: stringValue(row.client_slug),
      content: row.content as string,
      createdAt: row.created_at as string,
      id: row.id as string,
      kind: "campaign" as const,
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
      targetId: row.event_id as string,
      targetName: eventNames.get(row.event_id as string) ?? null,
    })),
  ].sort(sortThreads);
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
