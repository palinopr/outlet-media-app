import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { apiError } from "@/lib/api-helpers";
import type { IngestPayload } from "@/lib/api-schemas";

export async function ingestTmDemographics(body: IngestPayload) {
  const rows = body.data.demographics ?? [];

  if (rows.length === 0) {
    return NextResponse.json({ ok: true, inserted: 0, message: "No demographics to insert" });
  }

  const { error } = await supabaseAdmin!
    .from("tm_event_demographics")
    .upsert(rows, { onConflict: "tm_id" });

  if (error) {
    console.error("Supabase upsert error (tm_event_demographics):", error);
    return apiError(error.message, 500);
  }

  console.log(`Ingest: upserted ${rows.length} TM demographics rows`);
  return NextResponse.json({ ok: true, inserted: rows.length });
}
