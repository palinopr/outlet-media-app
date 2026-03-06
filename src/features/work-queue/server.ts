import type { ScopeFilter } from "@/lib/member-access";
import { supabaseAdmin } from "@/lib/supabase";
import { listVisibleAssetIdsForScope } from "@/features/assets/server";
import { buildWorkQueueSummary, type WorkQueueItem } from "./summary";

interface GetWorkQueueOptions {
  assigneeId?: string | null;
  clientSlug?: string | null;
  kinds?: WorkQueueItem["kind"][];
  limit?: number;
  mode: "admin" | "client";
  scope?: ScopeFilter;
}

function visibilityForMode(mode: "admin" | "client") {
  return mode === "client" ? "shared" : null;
}

function slugForHref(itemClientSlug: string | null, options: GetWorkQueueOptions) {
  return options.mode === "client" ? options.clientSlug ?? itemClientSlug : itemClientSlug;
}

function buildHref(
  kind: WorkQueueItem["kind"],
  contextId: string,
  clientSlug: string | null,
  options: GetWorkQueueOptions,
) {
  if (options.mode === "admin") {
    switch (kind) {
      case "campaign_action":
        return `/admin/campaigns/${contextId}`;
      case "crm_follow_up":
        return `/admin/crm/${contextId}`;
      case "event_follow_up":
        return `/admin/events/${contextId}`;
      case "asset_follow_up":
        return `/admin/assets/${contextId}`;
    }
  }

  const slug = slugForHref(clientSlug, options);
  if (!slug) return "/client";

  switch (kind) {
    case "campaign_action":
      return `/client/${slug}/campaign/${contextId}`;
    case "crm_follow_up":
      return `/client/${slug}/crm/${contextId}`;
    case "event_follow_up":
      return `/client/${slug}/event/${contextId}`;
    case "asset_follow_up":
      return `/client/${slug}/assets/${contextId}`;
  }
}

function scopeAllowsCampaign(campaignId: string, scope?: ScopeFilter) {
  if (!scope?.allowedCampaignIds || scope.allowedCampaignIds.length === 0) return true;
  return scope.allowedCampaignIds.includes(campaignId);
}

function scopeAllowsEvent(eventId: string, scope?: ScopeFilter) {
  if (!scope?.allowedEventIds || scope.allowedEventIds.length === 0) return true;
  return scope.allowedEventIds.includes(eventId);
}

export function matchesWorkQueueKinds(
  item: Pick<WorkQueueItem, "kind">,
  kinds?: WorkQueueItem["kind"][] | null,
) {
  if (!kinds || kinds.length === 0) return true;
  return kinds.includes(item.kind);
}

export async function getWorkQueue(options: GetWorkQueueOptions) {
  if (!supabaseAdmin) {
    return buildWorkQueueSummary([], { limit: options.limit });
  }

  const visibility = visibilityForMode(options.mode);

  let campaignQuery = supabaseAdmin
    .from("campaign_action_items")
    .select("id, campaign_id, client_slug, title, description, status, priority, assignee_name, due_date, updated_at")
    .neq("status", "done")
    .order("updated_at", { ascending: false })
    .limit(100);

  let crmQuery = supabaseAdmin
    .from("crm_follow_up_items" as never)
    .select("id, contact_id, client_slug, title, description, status, priority, assignee_name, due_date, updated_at")
    .neq("status", "done")
    .order("updated_at", { ascending: false })
    .limit(100);

  let eventQuery = supabaseAdmin
    .from("event_follow_up_items" as never)
    .select("id, event_id, client_slug, title, description, status, priority, assignee_name, due_date, updated_at")
    .neq("status", "done")
    .order("updated_at", { ascending: false })
    .limit(100);

  let assetQuery = supabaseAdmin
    .from("asset_follow_up_items" as never)
    .select("id, asset_id, client_slug, title, description, status, priority, assignee_name, due_date, updated_at")
    .neq("status", "done")
    .order("updated_at", { ascending: false })
    .limit(100);

  if (options.clientSlug) {
    campaignQuery = campaignQuery.eq("client_slug", options.clientSlug);
    crmQuery = crmQuery.eq("client_slug", options.clientSlug);
    eventQuery = eventQuery.eq("client_slug", options.clientSlug);
    assetQuery = assetQuery.eq("client_slug", options.clientSlug);
  }

  if (options.assigneeId) {
    campaignQuery = campaignQuery.eq("assignee_id", options.assigneeId);
    crmQuery = crmQuery.eq("assignee_id", options.assigneeId);
    eventQuery = eventQuery.eq("assignee_id", options.assigneeId);
    assetQuery = assetQuery.eq("assignee_id", options.assigneeId);
  }

  if (visibility) {
    campaignQuery = campaignQuery.eq("visibility", visibility);
    crmQuery = crmQuery.eq("visibility", visibility);
    eventQuery = eventQuery.eq("visibility", visibility);
    assetQuery = assetQuery.eq("visibility", visibility);
  }

  const [campaignRes, crmRes, eventRes, assetRes] = await Promise.all([
    campaignQuery,
    crmQuery,
    eventQuery,
    assetQuery,
  ]);

  const campaignRows = (campaignRes.data ?? []) as Record<string, unknown>[];
  const crmRows = (crmRes.data ?? []) as Record<string, unknown>[];
  const eventRows = (eventRes.data ?? []) as Record<string, unknown>[];
  const rawAssetRows = (assetRes.data ?? []) as Record<string, unknown>[];

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

  const filteredCampaignRows = campaignRows.filter((row) =>
    scopeAllowsCampaign(String(row.campaign_id), options.scope),
  );
  const filteredEventRows = eventRows.filter((row) =>
    scopeAllowsEvent(String(row.event_id), options.scope),
  );

  const [campaignNamesRes, contactNamesRes, eventNamesRes, assetNamesRes] = await Promise.all([
    filteredCampaignRows.length > 0
      ? supabaseAdmin
          .from("meta_campaigns")
          .select("campaign_id, name")
          .in(
            "campaign_id",
            [...new Set(filteredCampaignRows.map((row) => String(row.campaign_id)))],
          )
      : Promise.resolve({ data: [] }),
    crmRows.length > 0
      ? supabaseAdmin
          .from("crm_contacts" as never)
          .select("id, full_name")
          .in("id", [...new Set(crmRows.map((row) => String(row.contact_id)))])
      : Promise.resolve({ data: [] }),
    filteredEventRows.length > 0
      ? supabaseAdmin
          .from("tm_events")
          .select("id, name, artist")
          .in("id", [...new Set(filteredEventRows.map((row) => String(row.event_id)))])
      : Promise.resolve({ data: [] }),
    assetRows.length > 0
      ? supabaseAdmin
          .from("ad_assets")
          .select("id, file_name")
          .in("id", [...new Set(assetRows.map((row) => String(row.asset_id)))])
      : Promise.resolve({ data: [] }),
  ]);

  const campaignNames = new Map(
    ((campaignNamesRes.data ?? []) as { campaign_id: string; name: string | null }[]).map((row) => [
      row.campaign_id,
      row.name ?? row.campaign_id,
    ]),
  );
  const contactNames = new Map(
    ((contactNamesRes.data ?? []) as Record<string, unknown>[]).map((row) => [
      String(row.id),
      String(row.full_name ?? row.id),
    ]),
  );
  const eventNames = new Map(
    ((eventNamesRes.data ?? []) as { id: string; artist: string | null; name: string | null }[]).map((row) => [
      row.id,
      row.artist ?? row.name ?? row.id,
    ]),
  );
  const assetNames = new Map(
    ((assetNamesRes.data ?? []) as { id: string; file_name: string | null }[]).map((row) => [
      row.id,
      row.file_name ?? row.id,
    ]),
  );

  const items: WorkQueueItem[] = [
    ...filteredCampaignRows.map((row) => {
      const contextId = String(row.campaign_id);
      const clientSlug = (row.client_slug as string | null) ?? options.clientSlug ?? null;

      return {
        id: String(row.id),
        kind: "campaign_action" as const,
        title: String(row.title),
        description: (row.description as string | null) ?? null,
        clientSlug,
        contextId,
        contextLabel: campaignNames.get(contextId) ?? contextId,
        href: buildHref("campaign_action", contextId, clientSlug, options),
        status: row.status as WorkQueueItem["status"],
        priority: row.priority as WorkQueueItem["priority"],
        assigneeName: (row.assignee_name as string | null) ?? null,
        dueDate: (row.due_date as string | null) ?? null,
        updatedAt: String(row.updated_at),
      };
    }),
    ...crmRows.map((row) => {
      const contextId = String(row.contact_id);
      const clientSlug = (row.client_slug as string | null) ?? options.clientSlug ?? null;

      return {
        id: String(row.id),
        kind: "crm_follow_up" as const,
        title: String(row.title),
        description: (row.description as string | null) ?? null,
        clientSlug,
        contextId,
        contextLabel: contactNames.get(contextId) ?? contextId,
        href: buildHref("crm_follow_up", contextId, clientSlug, options),
        status: row.status as WorkQueueItem["status"],
        priority: row.priority as WorkQueueItem["priority"],
        assigneeName: (row.assignee_name as string | null) ?? null,
        dueDate: (row.due_date as string | null) ?? null,
        updatedAt: String(row.updated_at),
      };
    }),
    ...filteredEventRows.map((row) => {
      const contextId = String(row.event_id);
      const clientSlug = (row.client_slug as string | null) ?? options.clientSlug ?? null;

      return {
        id: String(row.id),
        kind: "event_follow_up" as const,
        title: String(row.title),
        description: (row.description as string | null) ?? null,
        clientSlug,
        contextId,
        contextLabel: eventNames.get(contextId) ?? contextId,
        href: buildHref("event_follow_up", contextId, clientSlug, options),
        status: row.status as WorkQueueItem["status"],
        priority: row.priority as WorkQueueItem["priority"],
        assigneeName: (row.assignee_name as string | null) ?? null,
        dueDate: (row.due_date as string | null) ?? null,
        updatedAt: String(row.updated_at),
      };
    }),
    ...assetRows.map((row) => {
      const contextId = String(row.asset_id);
      const clientSlug = (row.client_slug as string | null) ?? options.clientSlug ?? null;

      return {
        id: String(row.id),
        kind: "asset_follow_up" as const,
        title: String(row.title),
        description: (row.description as string | null) ?? null,
        clientSlug,
        contextId,
        contextLabel: assetNames.get(contextId) ?? contextId,
        href: buildHref("asset_follow_up", contextId, clientSlug, options),
        status: row.status as WorkQueueItem["status"],
        priority: row.priority as WorkQueueItem["priority"],
        assigneeName: (row.assignee_name as string | null) ?? null,
        dueDate: (row.due_date as string | null) ?? null,
        updatedAt: String(row.updated_at),
      };
    }),
  ].filter((item) => matchesWorkQueueKinds(item, options.kinds));

  return buildWorkQueueSummary(items, { limit: options.limit });
}
