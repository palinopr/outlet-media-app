import { currentUser } from "@clerk/nextjs/server";
import { createClerkSupabaseClient, supabaseAdmin } from "@/lib/supabase";
import { applyEffectiveCampaignClientSlugs } from "@/lib/campaign-client-assignment";
import type { ScopeFilter } from "@/lib/member-access";
import { centsToUsd } from "@/lib/formatters";
import { allowsEventInScope } from "@/features/client-portal/scope";
import type {
  TmEvent,
  DemographicsRow,
  AudienceProfile,
  TicketSnapshot,
  LinkedCampaign,
  EventDetailData,
} from "../../types";
import { buildAudienceProfile, buildEventCard, computeDailyDeltas, computeVelocity } from "../../lib";

interface LinkedCampaignRow {
  campaign_id: string;
  client_slug: string | null;
  name: string | null;
  status: string | null;
  spend: number | null;
  roas: number | null;
  impressions: number | null;
  clicks: number | null;
}

async function getEventDetailReadContext() {
  if (!supabaseAdmin) return null;

  try {
    const user = await currentUser();
    const role = (user?.publicMetadata as { role?: string } | null)?.role;
    if (role === "admin") {
      return {
        db: supabaseAdmin,
        trustsCampaignRls: false,
      };
    }
  } catch {
    return null;
  }

  const userScopedClient = await createClerkSupabaseClient();
  if (!userScopedClient) {
    return null;
  }

  return {
    db: userScopedClient,
    trustsCampaignRls: true,
  };
}

export async function getEventDetail(
  slug: string,
  eventId: string,
  scope?: ScopeFilter,
): Promise<EventDetailData | null> {
  if (!allowsEventInScope(scope, eventId)) {
    return null;
  }

  const readContext = await getEventDetailReadContext();
  if (!readContext) return null;

  // Campaigns query uses only eventId (a param), so launch in parallel with event fetch
  const [eventRes, campaignsRes] = await Promise.all([
    readContext.db
      .from("tm_events")
      .select("*")
      .eq("id", eventId)
      .eq("client_slug", slug)
      .maybeSingle(),
    readContext.db
      .from("meta_campaigns")
      .select("campaign_id, client_slug, name, status, spend, roas, impressions, clicks")
      .eq("tm_event_id", eventId),
  ]);

  if (eventRes.error) {
    console.error("[client-event-detail] event read failed:", eventRes.error.message);
    return null;
  }

  if (campaignsRes.error) {
    console.error("[client-event-detail] linked campaign read failed:", campaignsRes.error.message);
    return null;
  }

  if (!eventRes.data) return null;

  const tmEvent = eventRes.data as TmEvent;
  const event = buildEventCard(tmEvent);

  // Snapshots and demographics depend on tm_id from the event row
  const [snapshotsRes, demosRes] = await Promise.all([
    readContext.db
      .from("event_snapshots")
      .select("snapshot_date, tickets_sold, tickets_available, gross")
      .eq("tm_id", tmEvent.tm_id)
      .order("snapshot_date", { ascending: true }),
    readContext.db
      .from("tm_event_demographics")
      .select("*")
      .eq("tm_id", tmEvent.tm_id),
  ]);

  if (snapshotsRes.error) {
    console.error("[client-event-detail] snapshot read failed:", snapshotsRes.error.message);
    return null;
  }

  if (demosRes.error) {
    console.error("[client-event-detail] audience read failed:", demosRes.error.message);
    return null;
  }

  const snapshots: TicketSnapshot[] = (snapshotsRes.data ?? []).map((s) => ({
    date: s.snapshot_date,
    ticketsSold: s.tickets_sold ?? 0,
    ticketsAvailable: s.tickets_available,
    gross: s.gross,
  }));

  let audience: AudienceProfile | null = null;
  if (demosRes.data && demosRes.data.length > 0) {
    audience = buildAudienceProfile(demosRes.data as DemographicsRow[]);
  }

  const linkedCampaignRows = readContext.trustsCampaignRls
    ? ((campaignsRes.data ?? []) as LinkedCampaignRow[])
    : await applyEffectiveCampaignClientSlugs(
        ((campaignsRes.data ?? []) as LinkedCampaignRow[]),
      );

  const linkedCampaigns: LinkedCampaign[] = linkedCampaignRows
    .filter((campaign) => readContext.trustsCampaignRls || campaign.client_slug === slug)
    .map((c) => ({
      campaignId: c.campaign_id,
      name: c.name ?? c.campaign_id,
      status: c.status ?? "unknown",
      spend: centsToUsd(c.spend) ?? 0,
      roas: c.roas != null ? Number(c.roas) : null,
      impressions: c.impressions,
      clicks: c.clicks,
    }));

  const channelBreakdown =
    tmEvent.channel_internet_pct != null ||
    tmEvent.channel_mobile_pct != null ||
    tmEvent.channel_box_pct != null ||
    tmEvent.channel_phone_pct != null
      ? {
          internet: tmEvent.channel_internet_pct,
          mobile: tmEvent.channel_mobile_pct,
          box: tmEvent.channel_box_pct,
          phone: tmEvent.channel_phone_pct,
        }
      : null;

  const dailyDeltas = computeDailyDeltas(snapshots);
  const velocity = computeVelocity(snapshots, tmEvent.date, event.ticketsSold);

  return {
    event,
    snapshots,
    dailyDeltas,
    velocity,
    audience,
    linkedCampaigns,
    channelBreakdown,
  };
}
