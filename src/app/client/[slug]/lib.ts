import { centsToUsd } from "@/lib/formatters";
import type {
  TmEvent,
  DemographicsRow,
  AudienceProfile,
  HeroStats,
  CampaignCard,
  EventCard,
  Insight,
  AgeGenderBreakdown,
  PlacementBreakdown,
  GeographyBreakdown,
  AdCard,
  HourlyBreakdown,
  DailyPoint,
  Recommendation,
  TicketPlatform,
  TicketSnapshot,
  DailyDelta,
  SalesVelocity,
} from "./types";
import { DAY_LABELS } from "./types";

import { type DateRange } from "@/lib/constants";

export { getCampaignStatusCfg, getEventStatusCfg } from "@/lib/status";

// --- Trend data builder (shared by campaigns + reports pages) ---

export interface TrendPoint {
  date: string;
  roas: number;
  spend: number;
}

export function buildTrendData(
  snapshots: Array<{ snapshot_date: string; roas: number | null; spend: number | null }>,
): TrendPoint[] {
  const byDate: Record<string, { roasSum: number; roasCount: number; spendSum: number }> = {};
  for (const s of snapshots) {
    const d = s.snapshot_date;
    if (!byDate[d]) byDate[d] = { roasSum: 0, roasCount: 0, spendSum: 0 };
    if (s.roas != null) { byDate[d].roasSum += s.roas; byDate[d].roasCount++; }
    if (s.spend != null) byDate[d].spendSum += centsToUsd(s.spend) as number;
  }
  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      roas: v.roasCount > 0 ? v.roasSum / v.roasCount : 0,
      spend: v.spendSum,
    }));
}

// --- Platform detection ---

export function detectPlatform(tmId: string): TicketPlatform {
  if (tmId.startsWith("eata_")) return "vivaticket";
  if (tmId.length > 0) return "ticketmaster";
  return "unknown";
}

// --- Shared event card builder ---

export function buildEventCard(e: TmEvent): EventCard {
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
    ticketPlatform: detectPlatform(e.tm_id),
    artist: e.artist ?? "",
    ticketsSoldToday: e.tickets_sold_today ?? null,
    revenueToday: e.revenue_today ?? null,
    conversionRate: e.conversion_rate != null ? Number(e.conversion_rate) : null,
    edpTotalViews: e.edp_total_views != null ? Number(e.edp_total_views) : null,
    edpAvgDailyViews: e.edp_avg_daily_views != null ? Number(e.edp_avg_daily_views) : null,
  };
}

// --- Sales velocity computation ---

export function computeDailyDeltas(snapshots: TicketSnapshot[]): DailyDelta[] {
  if (snapshots.length < 2) return [];
  const deltas: DailyDelta[] = [];
  for (let i = 1; i < snapshots.length; i++) {
    const prev = snapshots[i - 1];
    const curr = snapshots[i];
    const dt = new Date(curr.date + "T12:00:00");
    deltas.push({
      date: curr.date,
      label: dt.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      ticketsDelta: curr.ticketsSold - prev.ticketsSold,
      revenueDelta: (curr.gross ?? 0) - (prev.gross ?? 0),
    });
  }
  return deltas;
}

/** Compute daily sales rate for a slice of snapshots. */
function sliceRate(snapshots: TicketSnapshot[]): number {
  const days = Math.max(
    1,
    (new Date(snapshots[snapshots.length - 1].date).getTime() -
      new Date(snapshots[0].date).getTime()) / 86400000,
  );
  return (snapshots[snapshots.length - 1].ticketsSold - snapshots[0].ticketsSold) / days;
}

/** Compare first-half vs second-half rate to detect trend direction. */
function computeTrendRate(snapshots: TicketSnapshot[]): {
  recentDailySales: number | null;
  trend: SalesVelocity["trend"];
  trendPct: number | null;
} {
  if (snapshots.length < 4) return { recentDailySales: null, trend: null, trendPct: null };

  const mid = Math.floor(snapshots.length / 2);
  const firstRate = sliceRate(snapshots.slice(0, mid));
  const secondRate = sliceRate(snapshots.slice(mid));
  const recentDailySales = Math.round(secondRate);

  if (firstRate <= 0) return { recentDailySales, trend: null, trendPct: null };

  const change = ((secondRate - firstRate) / firstRate) * 100;
  const trendPct = Math.round(change);
  let trend: SalesVelocity["trend"] = "steady";
  if (change > 10) trend = "accelerating";
  else if (change < -10) trend = "decelerating";

  return { recentDailySales, trend, trendPct };
}

export function getDaysUntilEvent(eventDate: string | null): number | null {
  if (!eventDate) return null;
  return Math.max(0, Math.round((new Date(eventDate).getTime() - Date.now()) / 86400000));
}

export function computeVelocity(
  snapshots: TicketSnapshot[],
  eventDate: string | null,
  currentSold: number,
): SalesVelocity | null {
  if (snapshots.length < 2) return null;

  const avgDailySales = Math.round(sliceRate(snapshots));
  const { recentDailySales, trend, trendPct } = computeTrendRate(snapshots);

  const daysUntilEvent = getDaysUntilEvent(eventDate);
  let projectedTotalSold: number | null = null;
  if (daysUntilEvent != null && daysUntilEvent > 0) {
    const dailyRate = recentDailySales ?? avgDailySales;
    if (dailyRate > 0) {
      projectedTotalSold = currentSold + dailyRate * daysUntilEvent;
    }
  }

  return { avgDailySales, recentDailySales, trend, trendPct, daysUntilEvent, projectedTotalSold };
}

export const DATE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7", label: "7d" },
  { value: "14", label: "14d" },
  { value: "30", label: "30d" },
  { value: "lifetime", label: "Lifetime" },
];

// --- Formatting ---

export function roasLabel(roas: number | null): string {
  if (roas == null) return "No data";
  if (roas >= 4) return "Exceptional";
  if (roas >= 3) return "Strong";
  if (roas >= 2) return "Good";
  if (roas >= 1) return "Below target";
  return "Underperforming";
}

// --- Demographics builder ---

export function weightedAvg(
  rows: DemographicsRow[],
  key: keyof DemographicsRow,
): number | null {
  const valid = rows.filter((r) => r[key] != null && (r.fans_total ?? 0) > 0);
  if (!valid.length) return null;
  const totalWeight = valid.reduce((s, r) => s + (r.fans_total ?? 0), 0);
  const sum = valid.reduce(
    (s, r) => s + Number(r[key]) * (r.fans_total ?? 0),
    0,
  );
  return totalWeight > 0 ? sum / totalWeight : null;
}

const DEMO_FIELD_MAP: [keyof AudienceProfile, keyof DemographicsRow][] = [
  ["femalePct", "fans_female_pct"], ["malePct", "fans_male_pct"],
  ["marriedPct", "fans_married_pct"], ["childrenPct", "fans_with_children_pct"],
  ["age1824", "age_18_24_pct"], ["age2534", "age_25_34_pct"],
  ["age3544", "age_35_44_pct"], ["age4554", "age_45_54_pct"], ["ageOver54", "age_over_54_pct"],
  ["income0_30", "income_0_30k_pct"], ["income30_60", "income_30_60k_pct"],
  ["income60_90", "income_60_90k_pct"], ["income90_125", "income_90_125k_pct"],
  ["incomeOver125", "income_over_125k_pct"],
  ["educationHighSchool", "education_high_school_pct"],
  ["educationCollege", "education_college_pct"],
  ["educationGradSchool", "education_grad_school_pct"],
  ["paymentVisa", "payment_visa_pct"], ["paymentMC", "payment_mc_pct"],
  ["paymentAmex", "payment_amex_pct"], ["paymentDiscover", "payment_discover_pct"],
];

export function buildAudienceProfile(demos: DemographicsRow[]): AudienceProfile {
  const totalFans = demos.reduce((s, d) => s + (d.fans_total ?? 0), 0);
  const fields: Record<string, number | null> = {};
  for (const [profileKey, demoKey] of DEMO_FIELD_MAP) {
    fields[profileKey] = weightedAvg(demos, demoKey);
  }
  return { totalFans, ...fields } as AudienceProfile;
}

// --- Smart insights ---

export function generateInsights(
  hero: HeroStats,
  campaigns: CampaignCard[],
  events: EventCard[],
  audience: AudienceProfile | null,
): Insight[] {
  const out: Insight[] = [];

  // ROI statement
  if (hero.totalRevenue != null && hero.totalSpend > 0) {
    const ratio = hero.totalRevenue / hero.totalSpend;
    out.push({
      text: `Every $1 in ad spend has generated $${ratio.toFixed(2)} in attributed revenue.`,
      type: ratio >= 2 ? "positive" : "neutral",
    });
  }

  // Best performing campaign
  const withRoas = campaigns.filter((c) => c.roas != null && c.spend > 0);
  if (withRoas.length >= 2) {
    const best = [...withRoas].sort((a, b) => (b.roas ?? 0) - (a.roas ?? 0))[0];
    out.push({
      text: `"${best.name}" is your top performer at ${best.roas?.toFixed(1)}x ROAS.`,
      type: "positive",
    });
  }

  // Active campaign count
  const active = campaigns.filter((c) => c.status === "ACTIVE");
  if (active.length > 0 && campaigns.length > active.length) {
    out.push({
      text: `${active.length} of ${campaigns.length} campaigns currently active.`,
      type: "neutral",
    });
  }

  // Best-selling event (TM clients)
  if (events.length > 0) {
    const ranked = events
      .filter((e) => e.sellThrough != null)
      .sort((a, b) => (b.sellThrough ?? 0) - (a.sellThrough ?? 0));
    if (ranked.length >= 1) {
      out.push({
        text: `${ranked[0].city} is your top market at ${ranked[0].sellThrough}% sell-through.`,
        type: "positive",
      });
    }
  }

  // Audience segment
  if (audience) {
    const ages = [
      { label: "18-24", pct: audience.age1824 },
      { label: "25-34", pct: audience.age2534 },
      { label: "35-44", pct: audience.age3544 },
      { label: "45-54", pct: audience.age4554 },
      { label: "55+", pct: audience.ageOver54 },
    ]
      .filter((a) => a.pct != null)
      .sort((a, b) => (b.pct ?? 0) - (a.pct ?? 0));
    if (ages.length > 0) {
      const gender =
        (audience.femalePct ?? 0) > (audience.malePct ?? 0) ? "Female" : "Male";
      out.push({
        text: `Core audience: ${gender} ${ages[0].label} (${ages[0].pct?.toFixed(0)}% of buyers).`,
        type: "neutral",
      });
    }
  }

  return out.slice(0, 3);
}

// --- Campaign-page insights (spending efficiency + audience engagement) ---

export function generateCampaignInsights(campaigns: CampaignCard[]): Insight[] {
  const out: Insight[] = [];
  const totalClicks = campaigns.reduce((a, c) => a + c.clicks, 0);
  const totalImpressions = campaigns.reduce((a, c) => a + c.impressions, 0);

  const withRoas = campaigns.filter((c) => c.roas != null && c.spend > 10);
  if (withRoas.length >= 2) {
    const sorted = [...withRoas].sort((a, b) => (b.roas ?? 0) - (a.roas ?? 0));
    out.push({
      text: `"${sorted[0].name}" leads at ${sorted[0].roas?.toFixed(1)}x ROAS -- consider increasing its budget.`,
      type: "positive",
    });
  }

  const active = campaigns.filter((c) => c.status === "ACTIVE");
  const under = active.filter((c) => c.roas != null && c.roas < 1 && c.spend > 10);
  if (under.length > 0) {
    out.push({
      text: `${under.length} active campaign${under.length > 1 ? "s" : ""} below 1x ROAS. Review targeting or pause to reallocate budget.`,
      type: "warning",
    });
  }

  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : null;
  if (avgCtr != null) {
    const msg = avgCtr >= 1.5
      ? "Ads are resonating with the audience."
      : "Testing new creatives could boost engagement.";
    out.push({ text: `Average click-through rate is ${avgCtr.toFixed(2)}%. ${msg}`, type: avgCtr >= 1.5 ? "positive" : "neutral" });
  }

  return out.slice(0, 4);
}

export function findBestHour(hourly: HourlyBreakdown[]): HourlyBreakdown | null {
  if (hourly.length === 0) return null;

  const totalImpressions = hourly.reduce((sum, row) => sum + row.impressions, 0);
  const meaningfulThreshold = Math.max(50, Math.round(totalImpressions * 0.04));
  const candidates = hourly.filter((row) => row.impressions >= meaningfulThreshold);

  const pool = candidates.length > 0 ? candidates : hourly;
  const withCtr = pool.filter((row) => row.ctr != null);

  if (withCtr.length > 0) {
    return [...withCtr].sort((a, b) => {
      if ((b.ctr ?? 0) !== (a.ctr ?? 0)) return (b.ctr ?? 0) - (a.ctr ?? 0);
      if (b.clicks !== a.clicks) return b.clicks - a.clicks;
      return b.impressions - a.impressions;
    })[0];
  }

  return [...pool].sort((a, b) => b.impressions - a.impressions)[0] ?? null;
}

export interface DayOfWeekPerformance {
  dayOfWeek: number;
  label: string;
  spend: number;
  revenue: number | null;
  roas: number | null;
  impressions: number;
  clicks: number;
  ctr: number | null;
}

export function summarizeDayOfWeekPerformance(daily: DailyPoint[]): DayOfWeekPerformance[] {
  const byDay = new Map<number, {
    spend: number;
    revenue: number;
    revenueSeen: boolean;
    roasWeightedSum: number;
    roasWeight: number;
    impressions: number;
    clicks: number;
  }>();

  for (const row of daily) {
    const prev = byDay.get(row.dayOfWeek) ?? {
      spend: 0,
      revenue: 0,
      revenueSeen: false,
      roasWeightedSum: 0,
      roasWeight: 0,
      impressions: 0,
      clicks: 0,
    };

    prev.spend += row.spend;
    if (row.revenue != null) {
      prev.revenue += row.revenue;
      prev.revenueSeen = true;
    }
    if (row.roas != null && row.spend > 0) {
      prev.roasWeightedSum += row.roas * row.spend;
      prev.roasWeight += row.spend;
    }
    prev.impressions += row.impressions;
    prev.clicks += row.clicks;

    byDay.set(row.dayOfWeek, prev);
  }

  return [1, 2, 3, 4, 5, 6, 0]
    .filter((day) => byDay.has(day))
    .map((day) => {
      const totals = byDay.get(day)!;
      const revenue = totals.revenueSeen ? totals.revenue : null;
      const ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : null;
      const roas =
        revenue != null && totals.spend > 0
          ? revenue / totals.spend
          : totals.roasWeight > 0
            ? totals.roasWeightedSum / totals.roasWeight
            : null;

      return {
        dayOfWeek: day,
        label: DAY_LABELS[day],
        spend: totals.spend,
        revenue,
        roas,
        impressions: totals.impressions,
        clicks: totals.clicks,
        ctr,
      } satisfies DayOfWeekPerformance;
    });
}

export function findBestDayOfWeek(daily: DailyPoint[]): DayOfWeekPerformance | null {
  const summary = summarizeDayOfWeekPerformance(daily);
  if (summary.length === 0) return null;

  const totalImpressions = summary.reduce((sum, row) => sum + row.impressions, 0);
  const meaningfulThreshold = Math.max(100, Math.round(totalImpressions * 0.08));
  const candidates = summary.filter((row) => row.impressions >= meaningfulThreshold);
  const pool = candidates.length > 0 ? candidates : summary;

  const withRoas = pool.filter((row) => row.roas != null);
  if (withRoas.length > 0) {
    return [...withRoas].sort((a, b) => {
      if ((b.roas ?? 0) !== (a.roas ?? 0)) return (b.roas ?? 0) - (a.roas ?? 0);
      if ((b.revenue ?? 0) !== (a.revenue ?? 0)) return (b.revenue ?? 0) - (a.revenue ?? 0);
      if (b.clicks !== a.clicks) return b.clicks - a.clicks;
      return b.impressions - a.impressions;
    })[0];
  }

  const withCtr = pool.filter((row) => row.ctr != null);
  if (withCtr.length > 0) {
    return [...withCtr].sort((a, b) => {
      if ((b.ctr ?? 0) !== (a.ctr ?? 0)) return (b.ctr ?? 0) - (a.ctr ?? 0);
      if (b.clicks !== a.clicks) return b.clicks - a.clicks;
      return b.impressions - a.impressions;
    })[0];
  }

  return [...pool].sort((a, b) => {
    if (b.clicks !== a.clicks) return b.clicks - a.clicks;
    return b.impressions - a.impressions;
  })[0] ?? null;
}

export function findTopMarket(geography: GeographyBreakdown[]): GeographyBreakdown | null {
  if (geography.length === 0) return null;

  const totalImpressions = geography.reduce((sum, row) => sum + row.impressions, 0);
  const meaningfulThreshold = Math.max(100, Math.round(totalImpressions * 0.08));
  const candidates = geography.filter((row) => row.impressions >= meaningfulThreshold);
  const pool = candidates.length > 0 ? candidates : geography;

  const withCtr = pool.filter((row) => row.ctr != null);
  if (withCtr.length > 0) {
    return [...withCtr].sort((a, b) => {
      if ((b.ctr ?? 0) !== (a.ctr ?? 0)) return (b.ctr ?? 0) - (a.ctr ?? 0);
      if (b.clicks !== a.clicks) return b.clicks - a.clicks;
      return b.impressions - a.impressions;
    })[0];
  }

  return [...pool].sort((a, b) => b.impressions - a.impressions)[0] ?? null;
}

export function findTopCreative(ads: AdCard[]): AdCard | null {
  if (ads.length === 0) return null;

  const meaningful = ads.filter((ad) => ad.spend >= 10 || ad.impressions >= 500);
  const pool = meaningful.length > 0 ? meaningful : ads;
  const withRoas = pool.filter((ad) => ad.roas != null);

  if (withRoas.length > 0) {
    return [...withRoas].sort((a, b) => {
      if ((b.roas ?? 0) !== (a.roas ?? 0)) return (b.roas ?? 0) - (a.roas ?? 0);
      return (b.revenue ?? 0) - (a.revenue ?? 0);
    })[0];
  }

  const withCtr = pool.filter((ad) => ad.ctr != null);
  if (withCtr.length > 0) {
    return [...withCtr].sort((a, b) => {
      if ((b.ctr ?? 0) !== (a.ctr ?? 0)) return (b.ctr ?? 0) - (a.ctr ?? 0);
      return b.clicks - a.clicks;
    })[0];
  }

  return [...pool].sort((a, b) => b.impressions - a.impressions)[0] ?? null;
}

// --- Campaign detail recommendations ---

export function generateRecommendations(
  campaign: CampaignCard,
  ageGender: AgeGenderBreakdown[],
  placements: PlacementBreakdown[],
  geography: GeographyBreakdown[],
  ads: AdCard[],
  hourly: HourlyBreakdown[],
  daily: DailyPoint[],
): Recommendation[] {
  const recs: Recommendation[] = [];

  // ROAS summary
  if (campaign.roas != null) {
    if (campaign.roas >= 3) {
      recs.push({
        title: "Strong return on investment",
        detail: `This campaign is generating $${campaign.roas.toFixed(2)} for every dollar invested. This is above the 3x benchmark.`,
        type: "success",
      });
    } else if (campaign.roas >= 2) {
      recs.push({
        title: "Solid performance",
        detail: `At ${campaign.roas.toFixed(1)}x ROAS, this campaign is profitable. Scaling budget could amplify returns.`,
        type: "success",
      });
    } else if (campaign.roas >= 1) {
      recs.push({
        title: "Room to improve",
        detail: `ROAS of ${campaign.roas.toFixed(1)}x means you're breaking even. Tightening targeting or refreshing creatives could help.`,
        type: "opportunity",
      });
    }
  }

  // Best audience segment
  if (ageGender.length > 0) {
    const totalImp = ageGender.reduce((s, r) => s + r.impressions, 0);
    const sorted = [...ageGender].sort((a, b) => b.impressions - a.impressions);
    const top = sorted[0];
    const topPct = totalImp > 0 ? ((top.impressions / totalImp) * 100).toFixed(0) : "0";
    recs.push({
      title: `${top.gender} ${top.age} is your strongest segment`,
      detail: `This group accounts for ${topPct}% of impressions. Consider tailoring creative messaging to this demographic.`,
      type: "info",
    });

    // CTR comparison between genders
    const genderCtr = new Map<string, { clicks: number; impressions: number }>();
    for (const r of ageGender) {
      const prev = genderCtr.get(r.gender) ?? { clicks: 0, impressions: 0 };
      genderCtr.set(r.gender, { clicks: prev.clicks + r.clicks, impressions: prev.impressions + r.impressions });
    }
    const genderRates = Array.from(genderCtr.entries())
      .map(([g, v]) => ({ gender: g, ctr: v.impressions > 0 ? (v.clicks / v.impressions) * 100 : 0 }))
      .sort((a, b) => b.ctr - a.ctr);
    if (genderRates.length >= 2 && genderRates[0].ctr > genderRates[1].ctr * 1.2) {
      recs.push({
        title: `${genderRates[0].gender} audience engages more`,
        detail: `${genderRates[0].gender} CTR is ${genderRates[0].ctr.toFixed(2)}% vs ${genderRates[1].ctr.toFixed(2)}% for ${genderRates[1].gender}. Consider increasing reach to the higher-engagement group.`,
        type: "opportunity",
      });
    }
  }

  // Best placement
  if (placements.length > 1) {
    const totalImp = placements.reduce((s, r) => s + r.impressions, 0);
    const byCtr = [...placements].filter((p) => p.impressions > totalImp * 0.05).sort((a, b) => (b.ctr ?? 0) - (a.ctr ?? 0));
    if (byCtr.length > 0 && byCtr[0].ctr != null) {
      recs.push({
        title: `${byCtr[0].platform} ${byCtr[0].position} drives highest engagement`,
        detail: `CTR of ${byCtr[0].ctr.toFixed(2)}% in this placement. Allocating more delivery here could improve overall performance.`,
        type: "opportunity",
      });
    }
  }

  // Best time of day
  if (hourly.length > 0) {
    const bestHour = findBestHour(hourly);
    if (bestHour) {
      recs.push({
        title: `${formatHour(bestHour.hour)} is your strongest hour`,
        detail: bestHour.ctr != null
          ? `This window is delivering ${bestHour.ctr.toFixed(2)}% CTR on ${bestHour.impressions.toLocaleString()} impressions. Concentrating spend here can improve efficiency.`
          : `This window is delivering the strongest delivery volume right now. Concentrating spend here can improve efficiency.`,
        type: "info",
      });
    }
  }

  if (geography.length > 0) {
    const topMarket = findTopMarket(geography);
    if (topMarket) {
      recs.push({
        title: `${topMarket.market} is your hottest market`,
        detail: topMarket.ctr != null
          ? `${topMarket.market} is returning ${topMarket.ctr.toFixed(2)}% CTR with ${topMarket.clicks.toLocaleString()} clicks. Use this market as your benchmark when shifting spend.`
          : `${topMarket.market} is currently driving the heaviest delivery. Use it as a benchmark when shifting spend.`,
        type: "info",
      });
    }
  }

  // Best day of week
  if (daily.length >= 3) {
    const bestDay = findBestDayOfWeek(daily);
    const dayBreakdown = summarizeDayOfWeekPerformance(daily);

    if (bestDay && dayBreakdown.length >= 2) {
      const worstDay = [...dayBreakdown].sort((a, b) => a.impressions - b.impressions)[0];
      const bestDayLabel = formatWeekday(bestDay.label);
      const worstDayLabel = formatWeekday(worstDay.label);
      recs.push({
        title: `${bestDayLabel} is delivering the strongest response`,
        detail:
          bestDay.roas != null
            ? `${bestDayLabel} is leading at ${bestDay.roas.toFixed(2)}x ROAS. ${worstDayLabel} is the softest day for delivery in this window.`
            : bestDay.ctr != null
              ? `${bestDayLabel} is leading at ${bestDay.ctr.toFixed(2)}% CTR. ${worstDayLabel} is the softest day for delivery in this window.`
              : `${bestDayLabel} is producing the strongest delivery volume, while ${worstDayLabel} is the quietest day in this window.`,
        type: "info",
      });
    }
  }

  // Top performing ad
  const bestCreative = findTopCreative(ads);
  if (bestCreative) {
    recs.push({
      title: `"${bestCreative.name}" is your top creative`,
      detail: bestCreative.roas != null
        ? `At ${bestCreative.roas.toFixed(1)}x ROAS, this ad is outperforming the rest. Use its messaging and visual structure as the next creative benchmark.`
        : `This ad is leading on engagement. Use its messaging and visual structure as the next creative benchmark.`,
      type: bestCreative.roas != null && bestCreative.roas >= 2 ? "success" : "info",
    });
  }

  return recs.slice(0, 6);
}

function formatHour(h: number): string {
  if (h === 0) return "12 AM";
  if (h === 12) return "12 PM";
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

function formatWeekday(day: string): string {
  const fullDayMap: Record<string, string> = {
    Sun: "Sunday",
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
  };

  return fullDayMap[day] ?? day;
}
