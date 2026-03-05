import { supabaseAdmin } from "@/lib/supabase";
import type {
  TmEvent,
  DemographicsRow,
  EventCard,
  AudienceProfile,
  TicketSnapshot,
  LinkedCampaign,
  EventDetailData,
} from "../../types";
import { buildAudienceProfile } from "../../lib";

function buildEventCard(e: TmEvent): EventCard {
  const sold = e.tickets_sold ?? 0;
  const available = e.tickets_available;
  const cap = available != null ? sold + available : null;
  const sellThrough = cap != null && cap > 0 ? Math.round((sold / cap) * 100) : null;

  return {
    id: e.id,
    name: e.name,
    venue: e.venue,
    city: e.city ?? "",
    date: e.date,
    status: e.status,
    ticketsSold: sold,
    ticketsAvailable: available,
    sellThrough,
    avgTicketPrice: e.avg_ticket_price != null ? Number(e.avg_ticket_price) : null,
    potentialRevenue: e.potential_revenue,
    gross: e.gross,
    updatedAt: e.updated_at ?? null,
  };
}

export async function getEventDetail(
  slug: string,
  eventId: string,
): Promise<EventDetailData | null> {
  if (!supabaseAdmin) return null;

  const { data: row } = await supabaseAdmin
    .from("tm_events")
    .select("*")
    .eq("id", eventId)
    .eq("client_slug", slug)
    .single();

  if (!row) return null;

  const tmEvent = row as TmEvent;
  const event = buildEventCard(tmEvent);

  // Fetch snapshots, demographics, and linked campaigns in parallel
  const [snapshotsRes, demosRes, campaignsRes] = await Promise.all([
    supabaseAdmin
      .from("event_snapshots")
      .select("snapshot_date, tickets_sold, tickets_available, gross")
      .eq("tm_id", tmEvent.tm_id)
      .order("snapshot_date", { ascending: true }),
    supabaseAdmin
      .from("tm_event_demographics")
      .select("*")
      .eq("tm_id", tmEvent.tm_id),
    supabaseAdmin
      .from("meta_campaigns")
      .select("campaign_id, name, status, spend, roas, impressions, clicks")
      .eq("tm_event_id", eventId),
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
    spend: (c.spend ?? 0) / 100,
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

  return {
    event,
    snapshots,
    audience,
    linkedCampaigns,
    channelBreakdown,
  };
}
