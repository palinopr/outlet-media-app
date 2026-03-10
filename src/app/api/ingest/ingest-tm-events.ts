import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { dbError } from "@/lib/api-helpers";
import type { IngestPayload } from "@/lib/api-schemas";

export async function ingestTmEvents(body: IngestPayload) {
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
    return {
      ...base,
      ...(e.tickets_sold != null       ? { tickets_sold: e.tickets_sold }             : {}),
      ...(e.tickets_available != null  ? { tickets_available: e.tickets_available }   : {}),
      ...(e.gross != null              ? { gross: e.gross }                           : {}),
      ...(e.avg_ticket_price != null   ? { avg_ticket_price: e.avg_ticket_price }     : {}),
      ...(e.tickets_sold_today != null ? { tickets_sold_today: e.tickets_sold_today } : {}),
      ...(e.revenue_today != null    ? { revenue_today: e.revenue_today }           : {}),
      ...(e.surrogate_id != null     ? { surrogate_id: e.surrogate_id }             : {}),
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
    return dbError(error);
  }

  const freshSnapshots = events
    .filter((e) => e.tickets_sold != null || e.gross != null)
    .map((e) => ({
      tm_id: e.tm_id,
      tickets_sold: e.tickets_sold ?? null,
      tickets_available: e.tickets_available ?? null,
      gross: e.gross ?? null,
    }));

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
      console.warn("Supabase upsert warning (event_snapshots):", snapErr.message);
    }
  }

  console.log(`Ingest: upserted ${rows.length} TM events, ${snapshots.length} snapshots (${freshSnapshots.length} fresh, ${fallbackSnapshots.length} from db)`);
  return NextResponse.json({ ok: true, inserted: rows.length, snapshots: snapshots.length });
}
