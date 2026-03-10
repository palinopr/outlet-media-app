import type { ScopeFilter } from "@/lib/member-access";
import { applyEffectiveCampaignClientSlugs } from "@/lib/campaign-client-assignment";
import { getFeatureReadClient, supabaseAdmin } from "@/lib/supabase";
import { listAgentOutcomes } from "@/features/agent-outcomes/server";
import type { AgentOutcomeView } from "@/features/agent-outcomes/summary";
import {
  getDashboardActionCenter,
  type DashboardActionCenter,
} from "@/features/dashboard/server";
import { listSystemEvents } from "@/features/system-events/server";
import {
  buildEventOperationsSummary,
  type EventOperationsCommentRecord,
  type EventOperationsEventRecord,
  type EventOperationsFollowUpRecord,
  type EventOperationsUpdateRecord,
} from "./summary";

export interface EventOperatingRecord {
  avgTicketPrice: number | null;
  artist: string | null;
  city: string | null;
  clientSlug: string | null;
  date: string | null;
  gross: number | null;
  id: string;
  name: string;
  status: string;
  ticketsAvailable: number | null;
  ticketsSold: number;
  tm1Number: string | null;
  updatedAt: string | null;
  url: string | null;
  venue: string | null;
}

export interface EventLinkedCampaign {
  campaignId: string;
  clicks: number | null;
  impressions: number | null;
  name: string;
  roas: number | null;
  spend: number | null;
  status: string;
}

export interface EventClientOption {
  slug: string;
}

export interface EventOperatingData {
  clients: EventClientOption[];
  event: EventOperatingRecord;
  linkedCampaigns: EventLinkedCampaign[];
}

interface EventLinkedCampaignRow {
  campaign_id: string;
  client_slug: string | null;
  name: string | null;
  status: string | null;
  spend: number | null;
  roas: number | null;
  impressions: number | null;
  clicks: number | null;
}

interface GetEventOperationsSummaryOptions {
  clientSlug?: string | null;
  limit?: number;
  mode: "admin" | "client";
  scope?: ScopeFilter;
}

interface GetEventsWorkflowDataOptions {
  clientSlug?: string | null;
  limit?: number;
  mode: "admin" | "client";
  scope?: ScopeFilter;
}

export interface EventsWorkflowData {
  actionCenter: DashboardActionCenter;
  agentOutcomes: AgentOutcomeView[];
}


function mapEventRow(row: Record<string, unknown>): EventOperatingRecord {
  return {
    avgTicketPrice: (row.avg_ticket_price as number | null) ?? null,
    artist: (row.artist as string | null) ?? null,
    city: (row.city as string | null) ?? null,
    clientSlug: (row.client_slug as string | null) ?? null,
    date: (row.date as string | null) ?? null,
    gross: (row.gross as number | null) ?? null,
    id: row.id as string,
    name: (row.name as string) ?? "Unknown event",
    status: (row.status as string) ?? "unknown",
    ticketsAvailable: (row.tickets_available as number | null) ?? null,
    ticketsSold: (row.tickets_sold as number | null) ?? 0,
    tm1Number: (row.tm1_number as string | null) ?? null,
    updatedAt: (row.updated_at as string | null) ?? null,
    url: (row.url as string | null) ?? null,
    venue: (row.venue as string | null) ?? null,
  };
}

export async function getEventRecordById(eventId: string): Promise<EventOperatingRecord | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from("tm_events")
    .select(
      "id, name, artist, city, date, venue, status, client_slug, tickets_sold, tickets_available, gross, avg_ticket_price, tm1_number, url, updated_at",
    )
    .eq("id", eventId)
    .maybeSingle();

  if (error) {
    console.error("[events] get record failed:", error.message);
    return null;
  }

  return data ? mapEventRow(data as Record<string, unknown>) : null;
}

export async function getEventOperatingData(
  eventId: string,
): Promise<EventOperatingData | null> {
  if (!supabaseAdmin) return null;

  const [eventRes, clientsRes, campaignsRes] = await Promise.all([
    supabaseAdmin
      .from("tm_events")
      .select(
        "id, name, artist, city, date, venue, status, client_slug, tickets_sold, tickets_available, gross, avg_ticket_price, tm1_number, url, updated_at",
      )
      .eq("id", eventId)
      .maybeSingle(),
    supabaseAdmin.from("clients").select("slug").order("name", { ascending: true }),
    supabaseAdmin
      .from("meta_campaigns")
      .select("campaign_id, client_slug, name, status, spend, roas, impressions, clicks")
      .eq("tm_event_id", eventId),
  ]);

  if (eventRes.error) {
    console.error("[events] get operating event failed:", eventRes.error.message);
    return null;
  }

  const event = eventRes.data ? mapEventRow(eventRes.data as Record<string, unknown>) : null;
  if (!event) return null;

  if (campaignsRes.error) {
    console.error("[events] linked campaigns failed:", campaignsRes.error.message);
  }

  const linkedCampaignRows = await applyEffectiveCampaignClientSlugs(
    ((campaignsRes.data ?? []) as EventLinkedCampaignRow[]),
  );

  const linkedCampaigns: EventLinkedCampaign[] = linkedCampaignRows
    .filter((campaign) => !event.clientSlug || campaign.client_slug === event.clientSlug)
    .map((campaign) => ({
      campaignId: campaign.campaign_id,
      clicks: campaign.clicks ?? null,
      impressions: campaign.impressions ?? null,
      name: campaign.name ?? campaign.campaign_id,
      roas: campaign.roas ?? null,
      spend: campaign.spend ?? null,
      status: campaign.status ?? "unknown",
    }));

  const clients: EventClientOption[] = ((clientsRes.data ?? []) as { slug: string | null }[])
    .map((client) => client.slug)
    .filter((slug): slug is string => typeof slug === "string" && slug.length > 0)
    .map((slug) => ({ slug }));

  return {
    clients,
    event,
    linkedCampaigns,
  };
}

export async function getEventsWorkflowData(
  options: GetEventsWorkflowDataOptions,
): Promise<EventsWorkflowData> {
  const scopeCampaignIds = options.scope?.allowedCampaignIds ?? null;
  const scopeEventIds = options.scope?.allowedEventIds ?? null;
  const audience = options.mode === "client" ? "shared" : "all";
  const limit = options.limit ?? 4;

  const [actionCenter, agentOutcomes] = await Promise.all([
    getDashboardActionCenter({
      clientSlug: options.clientSlug ?? undefined,
      limit,
      mode: options.mode,
      scopeCampaignIds,
      scopeEventIds,
    }),
    listAgentOutcomes({
      audience,
      clientSlug: options.clientSlug ?? undefined,
      eventId: null,
      limit,
      scopeCampaignIds,
      scopeEventIds,
    }),
  ]);

  return {
    actionCenter: {
      approvals: actionCenter.approvals,
      crmFollowUps: [],
      discussions: actionCenter.discussions.filter((discussion) => discussion.kind === "event"),
    },
    agentOutcomes,
  };
}

export async function getEventOperationsSummary(
  options: GetEventOperationsSummaryOptions,
) {
  const db = await getFeatureReadClient(options.mode === "client" && !!options.clientSlug);
  if (!db) {
    return buildEventOperationsSummary({
      comments: [],
      events: [],
      followUps: [],
      limit: options.limit,
      updates: [],
    });
  }

  const allowedEventIds = options.scope?.allowedEventIds ?? null;
  if (allowedEventIds && allowedEventIds.length === 0) {
    return buildEventOperationsSummary({
      comments: [],
      events: [],
      followUps: [],
      limit: options.limit,
      updates: [],
    });
  }

  const recentSince = Date.now() - 7 * 24 * 60 * 60 * 1000;

  let eventsQuery = db
    .from("tm_events")
    .select("id, client_slug, name, artist, date, venue, status")
    .order("date", { ascending: true })
    .limit(250);

  let followUpsQuery = db
    .from("event_follow_up_items" as never)
    .select("event_id, client_slug, priority, updated_at")
    .neq("status", "done")
    .order("updated_at", { ascending: false })
    .limit(500);

  let commentsQuery = db
    .from("event_comments")
    .select("event_id, client_slug, created_at")
    .eq("resolved", false)
    .is("parent_comment_id", null)
    .order("created_at", { ascending: false })
    .limit(500);

  if (options.clientSlug) {
    eventsQuery = eventsQuery.eq("client_slug", options.clientSlug);
    followUpsQuery = followUpsQuery.eq("client_slug", options.clientSlug);
    commentsQuery = commentsQuery.eq("client_slug", options.clientSlug);
  }

  if (allowedEventIds && allowedEventIds.length > 0) {
    eventsQuery = eventsQuery.in("id", allowedEventIds);
    followUpsQuery = followUpsQuery.in("event_id", allowedEventIds);
    commentsQuery = commentsQuery.in("event_id", allowedEventIds);
  }

  if (options.mode === "client") {
    followUpsQuery = followUpsQuery.eq("visibility", "shared");
    commentsQuery = commentsQuery.eq("visibility", "shared");
  }

  const [eventsRes, followUpsRes, commentsRes, updatesRes] = await Promise.all([
    eventsQuery,
    followUpsQuery,
    commentsQuery,
    listSystemEvents({
      audience: options.mode === "client" ? "shared" : "all",
      clientSlug: options.clientSlug,
      limit: 500,
    }),
  ]);

  const allowedEventSet = allowedEventIds ? new Set(allowedEventIds) : null;

  const events: EventOperationsEventRecord[] = (eventsRes.data ?? []).map((row) => ({
    clientSlug: (row.client_slug as string | null) ?? null,
    date: (row.date as string | null) ?? null,
    eventId: row.id as string,
    name: ((row.artist as string | null) ?? (row.name as string | null) ?? "Unknown event") as string,
    status: (row.status as string | null) ?? null,
    venue: (row.venue as string | null) ?? null,
  }));

  const followUps: EventOperationsFollowUpRecord[] = ((followUpsRes.data ?? []) as Record<
    string,
    unknown
  >[]).map((row) => ({
    clientSlug: (row.client_slug as string | null) ?? null,
    eventId: row.event_id as string,
    priority: row.priority as EventOperationsFollowUpRecord["priority"],
    updatedAt: row.updated_at as string,
  }));

  const comments: EventOperationsCommentRecord[] = ((commentsRes.data ?? []) as Record<
    string,
    unknown
  >[]).map((row) => ({
    clientSlug: (row.client_slug as string | null) ?? null,
    createdAt: row.created_at as string,
    eventId: row.event_id as string,
  }));

  const updates: EventOperationsUpdateRecord[] = updatesRes
    .filter((event) => new Date(event.createdAt).getTime() >= recentSince)
    .map((event) => {
      const eventId =
        (event.entityType === "event" && event.entityId) ||
        (typeof event.metadata.eventId === "string" ? event.metadata.eventId : null);

      return eventId
        ? {
            clientSlug: event.clientSlug,
            createdAt: event.createdAt,
            eventId,
          }
        : null;
    })
    .filter((row): row is EventOperationsUpdateRecord => !!row)
    .filter((row) => (allowedEventSet ? allowedEventSet.has(row.eventId) : true));

  return buildEventOperationsSummary({
    comments,
    events,
    followUps,
    limit: options.limit,
    updates,
  });
}
