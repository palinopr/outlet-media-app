import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { dbError } from "@/lib/api-helpers";
import type { IngestPayload } from "@/lib/api-schemas";

export async function ingestMetaCampaigns(body: IngestPayload) {
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
    return dbError(error);
  }

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
      console.warn("Supabase upsert warning (campaign_snapshots):", snapErr.message);
    }
  }

  // Mark any campaigns currently ACTIVE in DB but absent from this payload as PAUSED.
  // The agent sends all ACTIVE campaigns each sync -- if one is missing, it was paused.
  const incomingIds = campaigns.map((c) => c.campaign_id);
  if (incomingIds.length > 0) {
    const { data: active } = await supabaseAdmin!
      .from("meta_campaigns")
      .select("campaign_id")
      .eq("status", "ACTIVE");

    const incomingSet = new Set(incomingIds);
    const stale = (active ?? []).filter((r) => !incomingSet.has(r.campaign_id));

    if (stale.length > 0) {
      const staleIds = stale.map((r) => r.campaign_id);
      await supabaseAdmin!
        .from("meta_campaigns")
        .update({ status: "PAUSED", synced_at: body.data.scraped_at })
        .in("campaign_id", staleIds);
      console.log(`Ingest: marked ${staleIds.length} campaign(s) PAUSED (absent from sync):`, staleIds);
    }
  }

  console.log(`Ingest: upserted ${rows.length} Meta campaigns, ${snapshots.length} snapshots`);
  return NextResponse.json({ ok: true, inserted: rows.length, snapshots: snapshots.length });
}
