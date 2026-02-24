import { supabaseAdmin } from "@/lib/supabase";
import {
  type TmEvent,
  type DemographicsRow,
  type CityCardData,
  type HeroStats,
  type AudienceProfile,
  type ChannelBreakdown,
  buildAudienceProfile,
} from "./lib";

export interface ClientData {
  heroStats: HeroStats;
  cities: CityCardData[];
  audience: AudienceProfile | null;
  channels: ChannelBreakdown;
  totalPotentialRevenue: number | null;
  totalCurrentRevenue: number | null;
}

const EMPTY: ClientData = {
  heroStats: {
    totalSpend: 0,
    blendedRoas: null,
    totalRevenue: null,
    showsRunning: 0,
    spendDelta: null,
    revenueDelta: null,
  },
  cities: [],
  audience: null,
  channels: { mobile: null, internet: null, box: null, phone: null },
  totalPotentialRevenue: null,
  totalCurrentRevenue: null,
};

export async function getData(
  slug: string,
  days: 7 | 14,
): Promise<ClientData> {
  if (!supabaseAdmin) return EMPTY;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const prevCutoff = new Date(cutoff);
  prevCutoff.setDate(prevCutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  const prevCutoffStr = prevCutoff.toISOString().slice(0, 10);

  // --- Batch 1: campaigns + events ---
  const [campaignsRes, eventsRes] = await Promise.all([
    supabaseAdmin
      .from("meta_campaigns")
      .select("campaign_id, tm_event_id")
      .eq("client_slug", slug),
    supabaseAdmin
      .from("tm_events")
      .select("*")
      .eq("client_slug", slug)
      .order("date", { ascending: true })
      .limit(50),
  ]);

  const campaigns = campaignsRes.data ?? [];
  const events = (eventsRes.data ?? []) as TmEvent[];
  const campaignIds = campaigns.map((c) => c.campaign_id);
  const tmIds = events.map((e) => e.tm_id);

  if (campaignIds.length === 0 && events.length === 0) return EMPTY;

  // --- Batch 2: snapshots, daily tickets, demographics ---
  const [snapshotsRes, dailyRes, demosRes] = await Promise.all([
    campaignIds.length > 0
      ? supabaseAdmin
          .from("campaign_snapshots")
          .select("campaign_id, spend, roas, snapshot_date")
          .in("campaign_id", campaignIds)
          .gte("snapshot_date", prevCutoffStr)
          .order("snapshot_date", { ascending: false })
      : Promise.resolve({ data: [] as never[] }),
    tmIds.length > 0
      ? supabaseAdmin
          .from("tm_event_daily")
          .select("tm_id, date, tickets_sold")
          .in("tm_id", tmIds)
          .order("date", { ascending: true })
      : Promise.resolve({ data: [] as never[] }),
    tmIds.length > 0
      ? supabaseAdmin
          .from("tm_event_demographics")
          .select("*")
          .in("tm_id", tmIds)
      : Promise.resolve({ data: [] as never[] }),
  ]);

  const snapshots = snapshotsRes.data ?? [];
  const dailyData = dailyRes.data ?? [];
  const demoRows = (demosRes.data ?? []) as DemographicsRow[];

  // --- Snapshot aggregation ---
  // Snapshots are cumulative. Get latest, at-cutoff, and at-prev-cutoff per campaign.
  const latest = new Map<string, { spend: number; roas: number | null }>();
  const atCutoff = new Map<string, { spend: number; roas: number | null }>();
  const atPrev = new Map<string, { spend: number; roas: number | null }>();

  for (const s of snapshots) {
    const val = { spend: s.spend ?? 0, roas: s.roas };
    if (!latest.has(s.campaign_id)) latest.set(s.campaign_id, val);
    if (s.snapshot_date <= cutoffStr && !atCutoff.has(s.campaign_id)) {
      atCutoff.set(s.campaign_id, val);
    }
    if (s.snapshot_date <= prevCutoffStr && !atPrev.has(s.campaign_id)) {
      atPrev.set(s.campaign_id, val);
    }
  }

  // Total cumulative spend and weighted ROAS
  let totalSpendCents = 0;
  let weightedRoas = 0;
  for (const [, v] of latest) {
    totalSpendCents += v.spend;
    weightedRoas += (v.roas ?? 0) * v.spend;
  }
  const blendedRoas =
    totalSpendCents > 0 ? weightedRoas / totalSpendCents : null;
  const totalSpend = totalSpendCents / 100;
  const totalRevenue =
    blendedRoas != null ? totalSpend * blendedRoas : null;

  // Period deltas: compare spend in current period vs previous period
  let cutoffSpendCents = 0;
  let prevSpendCents = 0;
  for (const cid of campaignIds) {
    const c = atCutoff.get(cid);
    const p = atPrev.get(cid);
    cutoffSpendCents += c?.spend ?? 0;
    prevSpendCents += p?.spend ?? 0;
  }
  const currentPeriodSpend = totalSpendCents - cutoffSpendCents;
  const prevPeriodSpend = cutoffSpendCents - prevSpendCents;
  const spendDelta =
    prevPeriodSpend > 0
      ? ((currentPeriodSpend - prevPeriodSpend) / prevPeriodSpend) * 100
      : null;

  const currentRev =
    blendedRoas != null ? (currentPeriodSpend / 100) * blendedRoas : null;
  const prevRev =
    prevPeriodSpend > 0 && blendedRoas != null
      ? (prevPeriodSpend / 100) * blendedRoas
      : null;
  const revenueDelta =
    prevRev != null && prevRev > 0 && currentRev != null
      ? ((currentRev - prevRev) / prevRev) * 100
      : null;

  // --- Per-event ad spend (via tm_event_id -> events.id) ---
  const spendByEventId = new Map<
    string,
    { totalSpend: number; totalWeighted: number }
  >();
  for (const c of campaigns) {
    if (!c.tm_event_id) continue;
    const snap = latest.get(c.campaign_id);
    if (!snap) continue;
    const cur = spendByEventId.get(c.tm_event_id) ?? {
      totalSpend: 0,
      totalWeighted: 0,
    };
    cur.totalSpend += snap.spend;
    cur.totalWeighted += (snap.roas ?? 0) * snap.spend;
    spendByEventId.set(c.tm_event_id, cur);
  }

  // --- Daily ticket data per event (for sparklines) ---
  const dailyByTmId = new Map<string, { date: string; sold: number }[]>();
  for (const d of dailyData) {
    if (!dailyByTmId.has(d.tm_id)) dailyByTmId.set(d.tm_id, []);
    dailyByTmId.get(d.tm_id)!.push({
      date: d.date,
      sold: d.tickets_sold ?? 0,
    });
  }

  // --- Build city cards ---
  const cities: CityCardData[] = events.map((e) => {
    const cap = (e.tickets_sold ?? 0) + (e.tickets_available ?? 0);
    const sellThrough =
      cap > 0
        ? Math.round(((e.tickets_sold ?? 0) / cap) * 100)
        : null;
    const ad = spendByEventId.get(e.id);
    const showSpend = ad ? ad.totalSpend / 100 : 0;
    const showRoas =
      ad && ad.totalSpend > 0
        ? ad.totalWeighted / ad.totalSpend
        : null;

    return {
      id: e.id,
      city: e.city ?? e.name,
      date: e.date,
      venue: e.venue,
      status: e.status,
      ticketsSold: e.tickets_sold ?? 0,
      ticketsAvailable: e.tickets_available ?? 0,
      sellThrough,
      avgTicketPrice: e.avg_ticket_price,
      edpViews: e.edp_total_views,
      conversionRate: e.conversion_rate,
      potentialRevenue: e.potential_revenue,
      gross: e.gross,
      showSpend,
      showRoas,
      dailyTickets: dailyByTmId.get(e.tm_id) ?? [],
      channelMobile: e.channel_mobile_pct,
      channelInternet: e.channel_internet_pct,
      channelBox: e.channel_box_pct,
      channelPhone: e.channel_phone_pct,
    };
  });

  // --- Aggregate sales channels ---
  const withChannels = events.filter((e) => e.channel_mobile_pct != null);
  const n = withChannels.length;
  const channels: ChannelBreakdown =
    n > 0
      ? {
          mobile:
            withChannels.reduce(
              (s, e) => s + (e.channel_mobile_pct ?? 0),
              0,
            ) / n,
          internet:
            withChannels.reduce(
              (s, e) => s + (e.channel_internet_pct ?? 0),
              0,
            ) / n,
          box:
            withChannels.reduce(
              (s, e) => s + (e.channel_box_pct ?? 0),
              0,
            ) / n,
          phone:
            withChannels.reduce(
              (s, e) => s + (e.channel_phone_pct ?? 0),
              0,
            ) / n,
        }
      : { mobile: null, internet: null, box: null, phone: null };

  // --- Revenue projections ---
  const totalPotentialRevenue =
    events.reduce((s, e) => s + (e.potential_revenue ?? 0), 0) || null;
  const totalCurrentRevenue =
    events.reduce((s, e) => s + (e.gross ?? 0), 0) || null;

  // --- Audience ---
  const audience =
    demoRows.length > 0 ? buildAudienceProfile(demoRows) : null;

  return {
    heroStats: {
      totalSpend,
      blendedRoas,
      totalRevenue,
      showsRunning: events.length,
      spendDelta,
      revenueDelta,
    },
    cities,
    audience,
    channels,
    totalPotentialRevenue,
    totalCurrentRevenue,
  };
}
