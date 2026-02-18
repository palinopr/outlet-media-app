import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

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

interface IngestPayload {
  secret: string;
  source: string;
  data: {
    events: TmEvent[];
    scraped_at: string;
  };
}

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

  const { events } = body.data;

  if (!Array.isArray(events) || events.length === 0) {
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

  const { error } = await supabaseAdmin
    .from("tm_events")
    .upsert(rows, { onConflict: "tm_id" });

  if (error) {
    console.error("Supabase upsert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const count = rows.length;
  console.log(`Ingest: upserted ${count} events from ${body.source}`);

  return NextResponse.json({ ok: true, inserted: count });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Ingest endpoint ready. POST scraped data here.",
    supabase_connected: !!supabaseAdmin,
  });
}
