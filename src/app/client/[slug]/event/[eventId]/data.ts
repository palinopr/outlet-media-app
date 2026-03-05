import { supabaseAdmin } from "@/lib/supabase";
import { centsToUsd } from "@/lib/formatters";
import type {
  TmEvent,
  DemographicsRow,
  AudienceProfile,
  TicketSnapshot,
  LinkedCampaign,
  EventDetailData,
} from "../../types";
import { buildAudienceProfile, buildEventCard, computeDailyDeltas, computeVelocity } from "../../lib";

export async function getEventDetail(
  slug: string,
  eventId: string,
): Promise<EventDetailData | null> {
  if (!supabaseAdmin) return null;

  // Campaigns query uses only eventId (a param), so launch in parallel with event fetch
  const [eventRes, campaignsRes] = await Promise.all([
    supabaseAdmin
      .from("tm_events")
      .select("*")
      .eq("id", eventId)
      .eq("client_slug", slug)
      .single(),
    supabaseAdmin
      .from("meta_campaigns")
      .select("campaign_id, name, status, spend, roas, impressions, clicks")
      .eq("tm_event_id", eventId),
  ]);

  if (!eventRes.data) return null;

  const tmEvent = eventRes.data as TmEvent;
  const event = buildEventCard(tmEvent);

  // Snapshots and demographics depend on tm_id from the event row
  const [snapshotsRes, demosRes] = await Promise.all([
    supabaseAdmin
      .from("event_snapshots")
      .select("snapshot_date, tickets_sold, tickets_available, gross")
      .eq("tm_id", tmEvent.tm_id)
      .order("snapshot_date", { ascending: true }),
    supabaseAdmin
      .from("tm_event_demographics")
      .select("*")
      .eq("tm_id", tmEvent.tm_id),
  ]);

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

  const linkedCampaigns: LinkedCampaign[] = (campaignsRes.data ?? []).map((c) => ({
    campaignId: c.campaign_id,
    name: c.name,
    status: c.status,
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
