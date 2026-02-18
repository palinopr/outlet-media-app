import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

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
  url: string;
  scraped_at: string;
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
  source: "ticketmaster_one" | "meta";
  data: {
    // TM One
    events?: TmEvent[];
    // Meta
    campaigns?: MetaCampaign[];
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

  return NextResponse.json({ error: "Unknown source" }, { status: 400 });
}

async function ingestTmEvents(body: IngestPayload) {
  const events = body.data.events ?? [];

  if (events.length === 0) {
    return NextResponse.json({ ok: true, inserted: 0, message: "No events to insert" });
  }

  const rows = events.map((e) => ({
    tm_id: e.tm_id,
    tm1_number: e.tm1_number,
    name: e.name,
    artist: e.artist,
    venue: e.venue,
    city: e.city,
    date: e.date || null,
    status: e.status,
    tickets_sold: e.tickets_sold ?? null,
    tickets_available: e.tickets_available ?? null,
    gross: e.gross ?? null,
    url: e.url,
    scraped_at: e.scraped_at,
  }));

  const { error } = await supabaseAdmin!
    .from("tm_events")
    .upsert(rows, { onConflict: "tm_id" });

  if (error) {
    console.error("Supabase upsert error (tm_events):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Write daily snapshots — one row per event per day (ignore conflicts = already snapshotted today)
  const snapshots = events
    .filter((e) => e.tickets_sold != null || e.gross != null)
    .map((e) => ({
      tm_id: e.tm_id,
      tickets_sold: e.tickets_sold ?? null,
      tickets_available: e.tickets_available ?? null,
      gross: e.gross ?? null,
    }));

  if (snapshots.length > 0) {
    const { error: snapErr } = await supabaseAdmin!
      .from("event_snapshots")
      .upsert(snapshots, { onConflict: "tm_id,snapshot_date", ignoreDuplicates: true });

    if (snapErr) {
      // Non-fatal: log and continue
      console.warn("Supabase upsert warning (event_snapshots):", snapErr.message);
    }
  }

  console.log(`Ingest: upserted ${rows.length} TM events, ${snapshots.length} snapshots`);
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

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Ingest endpoint ready. POST scraped data here.",
    supabase_connected: !!supabaseAdmin,
    sources: ["ticketmaster_one", "meta"],
  });
}
