import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// ─── TM Demographics types ─────────────────────────────────────────────────

interface TmDemographics {
  tm_id: string;
  fans_total?: number;
  fans_female_pct?: number;
  fans_male_pct?: number;
  fans_married_pct?: number;
  fans_with_children_pct?: number;
  age_18_24_pct?: number;
  age_25_34_pct?: number;
  age_35_44_pct?: number;
  age_45_54_pct?: number;
  age_over_54_pct?: number;
  income_0_30k_pct?: number;
  income_30_60k_pct?: number;
  income_60_90k_pct?: number;
  income_90_125k_pct?: number;
  income_over_125k_pct?: number;
  education_high_school_pct?: number;
  education_college_pct?: number;
  education_grad_school_pct?: number;
  payment_visa_pct?: number;
  payment_mc_pct?: number;
  payment_amex_pct?: number;
  payment_discover_pct?: number;
  fetched_at: string;
}

// ─── TM One types ──────────────────────────────────────────────────────────

interface TmEvent {
  tm_id: string;
  tm1_number: string;
  name: string;
  artist: string;
  venue: string;
  city: string;
  date: string;
  status: string;
  tickets_sold?: number;
  tickets_available?: number;
  gross?: number;
  avg_ticket_price?: number;
  channel_mobile_pct?: number;
  channel_internet_pct?: number;
  channel_box_pct?: number;
  channel_phone_pct?: number;
  edp_total_views?: number;
  edp_avg_daily_views?: number;
  conversion_rate?: number;
  url: string;
  scraped_at: string;
  client_slug?: string;
}

// ─── Meta types ────────────────────────────────────────────────────────────

interface MetaCampaign {
  campaign_id: string;
  name: string;
  status: string;
  objective?: string;
  daily_budget?: number;
  lifetime_budget?: number;
  spend?: number;
  impressions?: number;
  clicks?: number;
  reach?: number;
  cpm?: number;
  cpc?: number;
  ctr?: number;
  roas?: number;
  client_slug?: string;
  start_time?: string;
}

// ─── Payload ───────────────────────────────────────────────────────────────

interface IngestPayload {
  secret: string;
  source: "ticketmaster_one" | "meta" | "tm_demographics";
  data: {
    // TM One
    events?: TmEvent[];
    // Meta
    campaigns?: MetaCampaign[];
    // TM Demographics
    demographics?: TmDemographics[];
    scraped_at: string;
  };
}

// ─── Handler ───────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const body = await request.json() as IngestPayload;

  if (body.secret !== process.env.INGEST_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Database not configured. Set SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 }
    );
  }

  if (body.source === "ticketmaster_one") {
    return ingestTmEvents(body);
  }

  if (body.source === "meta") {
    return ingestMetaCampaigns(body);
  }

  if (body.source === "tm_demographics") {
    return ingestTmDemographics(body);
  }

  return NextResponse.json({ error: "Unknown source" }, { status: 400 });
}

async function ingestTmEvents(body: IngestPayload) {
  const events = body.data.events ?? [];

  if (events.length === 0) {
    return NextResponse.json({ ok: true, inserted: 0, message: "No events to insert" });
  }

  const rows = events.map((e) => {
    const base = {
      tm_id: e.tm_id,
      tm1_number: e.tm1_number,
      name: e.name,
      artist: e.artist,
      venue: e.venue,
      city: e.city,
      date: e.date || null,
      status: e.status,
      url: e.url,
      scraped_at: e.scraped_at,
      client_slug: e.client_slug ?? null,
    };
    // Only include ticket/financial fields when present — omitting them preserves
    // whatever is already in the DB rather than overwriting with null.
    return {
      ...base,
      ...(e.tickets_sold != null       ? { tickets_sold: e.tickets_sold }             : {}),
      ...(e.tickets_available != null  ? { tickets_available: e.tickets_available }   : {}),
      ...(e.gross != null              ? { gross: e.gross }                           : {}),
      ...(e.avg_ticket_price != null   ? { avg_ticket_price: e.avg_ticket_price }     : {}),
      ...(e.channel_mobile_pct != null ? { channel_mobile_pct: e.channel_mobile_pct } : {}),
      ...(e.channel_internet_pct != null ? { channel_internet_pct: e.channel_internet_pct } : {}),
      ...(e.channel_box_pct != null    ? { channel_box_pct: e.channel_box_pct }       : {}),
      ...(e.channel_phone_pct != null  ? { channel_phone_pct: e.channel_phone_pct }   : {}),
      ...(e.edp_total_views != null    ? { edp_total_views: e.edp_total_views }       : {}),
      ...(e.edp_avg_daily_views != null ? { edp_avg_daily_views: e.edp_avg_daily_views } : {}),
      ...(e.conversion_rate != null    ? { conversion_rate: e.conversion_rate }       : {}),
    };
  });

  const { error } = await supabaseAdmin!
    .from("tm_events")
    .upsert(rows, { onConflict: "tm_id" });

  if (error) {
    console.error("Supabase upsert error (tm_events):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Write daily snapshots — one row per event per day (ignore conflicts = already snapshotted today)
  // Start with events that have fresh ticket data in the current payload
  const freshSnapshots = events
    .filter((e) => e.tickets_sold != null || e.gross != null)
    .map((e) => ({
      tm_id: e.tm_id,
      tickets_sold: e.tickets_sold ?? null,
      tickets_available: e.tickets_available ?? null,
      gross: e.gross ?? null,
    }));

  // For events without fresh data, fall back to whatever is stored in tm_events (preserves history)
  const tmIdsWithFreshData = new Set(freshSnapshots.map((s) => s.tm_id));
  const tmIdsNeedingFallback = events
    .filter((e) => !tmIdsWithFreshData.has(e.tm_id))
    .map((e) => e.tm_id);

  let fallbackSnapshots: { tm_id: string; tickets_sold: number | null; tickets_available: number | null; gross: number | null }[] = [];
  if (tmIdsNeedingFallback.length > 0) {
    const { data: existing } = await supabaseAdmin!
      .from("tm_events")
      .select("tm_id, tickets_sold, tickets_available, gross")
      .in("tm_id", tmIdsNeedingFallback)
      .not("tickets_sold", "is", null);

    fallbackSnapshots = (existing ?? []).map((row) => ({
      tm_id: row.tm_id,
      tickets_sold: row.tickets_sold ?? null,
      tickets_available: row.tickets_available ?? null,
      gross: row.gross ?? null,
    }));
  }

  const snapshots = [...freshSnapshots, ...fallbackSnapshots];

  if (snapshots.length > 0) {
    const { error: snapErr } = await supabaseAdmin!
      .from("event_snapshots")
      .upsert(snapshots, { onConflict: "tm_id,snapshot_date", ignoreDuplicates: true });

    if (snapErr) {
      // Non-fatal: log and continue
      console.warn("Supabase upsert warning (event_snapshots):", snapErr.message);
    }
  }

  console.log(`Ingest: upserted ${rows.length} TM events, ${snapshots.length} snapshots (${freshSnapshots.length} fresh, ${fallbackSnapshots.length} from db)`);
  return NextResponse.json({ ok: true, inserted: rows.length, snapshots: snapshots.length });
}

async function ingestMetaCampaigns(body: IngestPayload) {
  const campaigns = body.data.campaigns ?? [];

  if (campaigns.length === 0) {
    return NextResponse.json({ ok: true, inserted: 0, message: "No campaigns to insert" });
  }

  const rows = campaigns.map((c) => ({
    campaign_id: c.campaign_id,
    name: c.name,
    status: c.status,
    objective: c.objective ?? "",
    daily_budget: c.daily_budget ?? null,
    lifetime_budget: c.lifetime_budget ?? null,
    spend: c.spend ?? null,
    impressions: c.impressions ?? null,
    clicks: c.clicks ?? null,
    reach: c.reach ?? null,
    cpm: c.cpm ?? null,
    cpc: c.cpc ?? null,
    ctr: c.ctr ?? null,
    roas: c.roas ?? null,
    client_slug: c.client_slug ?? "unknown",
    start_time: c.start_time ?? null,
    synced_at: body.data.scraped_at,
  }));

  const { error } = await supabaseAdmin!
    .from("meta_campaigns")
    .upsert(rows, { onConflict: "campaign_id" });

  if (error) {
    console.error("Supabase upsert error (meta_campaigns):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Write daily snapshots — one row per campaign per day (ignore conflicts = already snapshotted today)
  const snapshots = campaigns
    .filter((c) => c.spend != null)
    .map((c) => ({
      campaign_id: c.campaign_id,
      spend: c.spend ?? null,
      impressions: c.impressions ?? null,
      clicks: c.clicks ?? null,
      roas: c.roas ?? null,
      cpm: c.cpm ?? null,
      cpc: c.cpc ?? null,
      ctr: c.ctr ?? null,
    }));

  if (snapshots.length > 0) {
    const { error: snapErr } = await supabaseAdmin!
      .from("campaign_snapshots")
      .upsert(snapshots, { onConflict: "campaign_id,snapshot_date", ignoreDuplicates: true });

    if (snapErr) {
      // Non-fatal: log and continue
      console.warn("Supabase upsert warning (campaign_snapshots):", snapErr.message);
    }
  }

  console.log(`Ingest: upserted ${rows.length} Meta campaigns, ${snapshots.length} snapshots`);
  return NextResponse.json({ ok: true, inserted: rows.length, snapshots: snapshots.length });
}

async function ingestTmDemographics(body: IngestPayload) {
  const rows = body.data.demographics ?? [];

  if (rows.length === 0) {
    return NextResponse.json({ ok: true, inserted: 0, message: "No demographics to insert" });
  }

  const { error } = await supabaseAdmin!
    .from("tm_event_demographics")
    .upsert(rows, { onConflict: "tm_id" });

  if (error) {
    console.error("Supabase upsert error (tm_event_demographics):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(`Ingest: upserted ${rows.length} TM demographics rows`);
  return NextResponse.json({ ok: true, inserted: rows.length });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Ingest endpoint ready. POST scraped data here.",
    supabase_connected: !!supabaseAdmin,
    sources: ["ticketmaster_one", "meta"],
  });
}
