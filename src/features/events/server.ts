import { supabaseAdmin } from "@/lib/supabase";

export interface EventOperatingRecord {
  id: string;
  tmId: string;
  tm1Number: string | null;
  clientSlug: string | null;
  name: string;
  artist: string;
  venue: string;
  city: string | null;
  date: string | null;
  status: string;
  ticketsSold: number;
  ticketsAvailable: number | null;
  gross: number | null;
  avgTicketPrice: number | null;
  url: string | null;
  updatedAt: string | null;
}

export interface EventLinkedCampaign {
  campaignId: string;
  name: string;
  status: string;
  spend: number | null;
  roas: number | null;
  impressions: number | null;
  clicks: number | null;
}

export interface EventClientOption {
  slug: string;
  name: string;
}

export interface EventOperatingData {
  clients: EventClientOption[];
  event: EventOperatingRecord;
  linkedCampaigns: EventLinkedCampaign[];
}

function mapEvent(row: Record<string, unknown>): EventOperatingRecord {
  return {
    id: row.id as string,
    tmId: row.tm_id as string,
    tm1Number: (row.tm1_number as string | null) ?? null,
    clientSlug: (row.client_slug as string | null) ?? null,
    name: row.name as string,
    artist: (row.artist as string | null) ?? (row.name as string),
    venue: row.venue as string,
    city: (row.city as string | null) ?? null,
    date: (row.date as string | null) ?? null,
    status: row.status as string,
    ticketsSold: (row.tickets_sold as number | null) ?? 0,
    ticketsAvailable: (row.tickets_available as number | null) ?? null,
    gross: (row.gross as number | null) ?? null,
    avgTicketPrice: (row.avg_ticket_price as number | null) ?? null,
    url: (row.url as string | null) ?? null,
    updatedAt: (row.updated_at as string | null) ?? null,
  };
}

export async function getEventRecordById(eventId: string): Promise<EventOperatingRecord | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from("tm_events")
    .select(
      "id, tm_id, tm1_number, client_slug, name, artist, venue, city, date, status, tickets_sold, tickets_available, gross, avg_ticket_price, url, updated_at",
    )
    .eq("id", eventId)
    .maybeSingle();

  if (error) {
    console.error("[events] event lookup failed:", error.message);
    return null;
  }

  if (!data) return null;
  return mapEvent(data as Record<string, unknown>);
}

export async function getEventOperatingData(eventId: string): Promise<EventOperatingData | null> {
  if (!supabaseAdmin) return null;

  const [eventRes, campaignsRes, clientsRes] = await Promise.all([
    supabaseAdmin
      .from("tm_events")
      .select(
        "id, tm_id, tm1_number, client_slug, name, artist, venue, city, date, status, tickets_sold, tickets_available, gross, avg_ticket_price, url, updated_at",
      )
      .eq("id", eventId)
      .maybeSingle(),
    supabaseAdmin
      .from("meta_campaigns")
      .select("campaign_id, name, status, spend, roas, impressions, clicks")
      .eq("tm_event_id", eventId)
      .order("name", { ascending: true }),
    supabaseAdmin.from("clients").select("slug, name").order("name", { ascending: true }),
  ]);

  if (eventRes.error) {
    console.error("[events] event lookup failed:", eventRes.error.message);
    return null;
  }

  if (!eventRes.data) return null;

  if (campaignsRes.error) {
    console.error("[events] linked campaign lookup failed:", campaignsRes.error.message);
  }

  if (clientsRes.error) {
    console.error("[events] client option lookup failed:", clientsRes.error.message);
  }

  return {
    clients: (clientsRes.data ?? []).map((row) => ({
      slug: row.slug as string,
      name: (row.name as string | null) ?? (row.slug as string),
    })),
    event: mapEvent(eventRes.data as Record<string, unknown>),
    linkedCampaigns: (campaignsRes.data ?? []).map((row) => ({
      campaignId: row.campaign_id as string,
      name: row.name as string,
      status: row.status as string,
      spend: (row.spend as number | null) ?? null,
      roas: (row.roas as number | null) ?? null,
      impressions: (row.impressions as number | null) ?? null,
      clicks: (row.clicks as number | null) ?? null,
    })),
  };
}
