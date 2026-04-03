import { centsToUsd } from "@/lib/formatters";
import type {
  TmEvent,
  DemographicsRow,
  AudienceProfile,
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
} from "@/features/client-portal/types";
import { DAY_LABELS } from "@/features/client-portal/types";
import { type DateRange } from "@/lib/constants";

export { getCampaignStatusCfg, getEventStatusCfg } from "@/lib/status";

export interface TrendPoint {
  date: string;
  roas: number;
  spend: number;
}

export function buildTrendData(
  snapshots: Array<{ snapshot_date: string; roas: number | null; spend: number | null }>,
): TrendPoint[] {
  const byDate: Record<string, { roasSum: number; roasCount: number; spendSum: number }> = {};
  for (const snapshot of snapshots) {
    const date = snapshot.snapshot_date;
    if (!byDate[date]) byDate[date] = { roasSum: 0, roasCount: 0, spendSum: 0 };
    if (snapshot.roas != null) {
      byDate[date].roasSum += snapshot.roas;
      byDate[date].roasCount++;
    }
    if (snapshot.spend != null) byDate[date].spendSum += centsToUsd(snapshot.spend) as number;
  }

  return Object.entries(byDate)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, value]) => ({
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      roas: value.roasCount > 0 ? value.roasSum / value.roasCount : 0,
      spend: value.spendSum,
    }));
}

function detectPlatform(tmId: string): TicketPlatform {
  if (tmId.startsWith("eata_")) return "vivaticket";
  if (tmId.length > 0) return "ticketmaster";
  return "unknown";
}

export function buildEventCard(event: TmEvent): EventCard {
  const sold = event.tickets_sold ?? 0;
  const available = event.tickets_available;
  const capacity = available != null ? sold + available : null;
  const sellThrough = capacity != null && capacity > 0 ? Math.round((sold / capacity) * 100) : null;

  return {
    id: event.id,
    name: event.name,
    venue: event.venue,
    city: event.city ?? "",
    date: event.date,
    status: event.status,
    ticketsSold: sold,
    ticketsAvailable: available,
    sellThrough,
    avgTicketPrice: event.avg_ticket_price != null ? Number(event.avg_ticket_price) : null,
    potentialRevenue: event.potential_revenue,
    gross: event.gross,
    updatedAt: event.updated_at ?? null,
    ticketPlatform: detectPlatform(event.tm_id),
    artist: event.artist ?? "",
    ticketsSoldToday: event.tickets_sold_today ?? null,
    revenueToday: event.revenue_today ?? null,
    conversionRate: event.conversion_rate != null ? Number(event.conversion_rate) : null,
    edpTotalViews: event.edp_total_views != null ? Number(event.edp_total_views) : null,
    edpAvgDailyViews: event.edp_avg_daily_views != null ? Number(event.edp_avg_daily_views) : null,
  };
}

export function computeDailyDeltas(snapshots: TicketSnapshot[]): DailyDelta[] {
  if (snapshots.length < 2) return [];
  const deltas: DailyDelta[] = [];
  for (let index = 1; index < snapshots.length; index++) {
    const previous = snapshots[index - 1];
    const current = snapshots[index];
    const date = new Date(`${current.date}T12:00:00`);
    deltas.push({
      date: current.date,
      label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      ticketsDelta: current.ticketsSold - previous.ticketsSold,
      revenueDelta: (current.gross ?? 0) - (previous.gross ?? 0),
    });
  }
  return deltas;
}

function sliceRate(snapshots: TicketSnapshot[]): number {
  const days = Math.max(
    1,
    (new Date(snapshots[snapshots.length - 1].date).getTime() -
      new Date(snapshots[0].date).getTime()) / 86400000,
  );
  return (snapshots[snapshots.length - 1].ticketsSold - snapshots[0].ticketsSold) / days;
}

function computeTrendRate(snapshots: TicketSnapshot[]): {
  recentDailySales: number | null;
  trend: SalesVelocity["trend"];
  trendPct: number | null;
} {
  if (snapshots.length < 4) return { recentDailySales: null, trend: null, trendPct: null };

  const midpoint = Math.floor(snapshots.length / 2);
  const firstRate = sliceRate(snapshots.slice(0, midpoint));
  const secondRate = sliceRate(snapshots.slice(midpoint));
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
    if (dailyRate > 0) projectedTotalSold = currentSold + dailyRate * daysUntilEvent;
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

export function roasLabel(roas: number | null): string {
  if (roas == null) return "No data";
  if (roas >= 4) return "Exceptional";
  if (roas >= 3) return "Strong";
  if (roas >= 2) return "Good";
  if (roas >= 1) return "Below target";
  return "Underperforming";
}

function weightedAvg(rows: DemographicsRow[], key: keyof DemographicsRow): number | null {
  const valid = rows.filter((row) => row[key] != null && (row.fans_total ?? 0) > 0);
  if (!valid.length) return null;
  const totalWeight = valid.reduce((sum, row) => sum + (row.fans_total ?? 0), 0);
  const sum = valid.reduce((accumulator, row) => accumulator + Number(row[key]) * (row.fans_total ?? 0), 0);
  return totalWeight > 0 ? sum / totalWeight : null;
}

const DEMO_FIELD_MAP: [keyof AudienceProfile, keyof DemographicsRow][] = [
  ["femalePct", "fans_female_pct"],
  ["malePct", "fans_male_pct"],
  ["marriedPct", "fans_married_pct"],
  ["childrenPct", "fans_with_children_pct"],
  ["age1824", "age_18_24_pct"],
  ["age2534", "age_25_34_pct"],
  ["age3544", "age_35_44_pct"],
  ["age4554", "age_45_54_pct"],
  ["ageOver54", "age_over_54_pct"],
  ["income0_30", "income_0_30k_pct"],
  ["income30_60", "income_30_60k_pct"],
  ["income60_90", "income_60_90k_pct"],
  ["income90_125", "income_90_125k_pct"],
  ["incomeOver125", "income_over_125k_pct"],
  ["educationHighSchool", "education_high_school_pct"],
  ["educationCollege", "education_college_pct"],
  ["educationGradSchool", "education_grad_school_pct"],
  ["paymentVisa", "payment_visa_pct"],
  ["paymentMC", "payment_mc_pct"],
  ["paymentAmex", "payment_amex_pct"],
  ["paymentDiscover", "payment_discover_pct"],
];

export function buildAudienceProfile(demos: DemographicsRow[]): AudienceProfile {
  const totalFans = demos.reduce((sum, row) => sum + (row.fans_total ?? 0), 0);
  const fields: Record<string, number | null> = {};
  for (const [profileKey, demoKey] of DEMO_FIELD_MAP) {
    fields[profileKey] = weightedAvg(demos, demoKey);
  }
  return { totalFans, ...fields } as AudienceProfile;
}

export function generateCampaignInsights(campaigns: CampaignCard[]): Insight[] {
  const out: Insight[] = [];
  const totalClicks = campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0);
  const totalImpressions = campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0);

  const withRoas = campaigns.filter((campaign) => campaign.roas != null && campaign.spend > 10);
  if (withRoas.length >= 2) {
    const sorted = [...withRoas].sort((left, right) => (right.roas ?? 0) - (left.roas ?? 0));
    out.push({
      text: `"${sorted[0].name}" leads at ${sorted[0].roas?.toFixed(1)}x ROAS -- consider increasing its budget.`,
      type: "positive",
    });
  }

  const active = campaigns.filter((campaign) => campaign.status === "ACTIVE");
  const under = active.filter((campaign) => campaign.roas != null && campaign.roas < 1 && campaign.spend > 10);
  if (under.length > 0) {
    out.push({
      text: `${under.length} active campaign${under.length > 1 ? "s" : ""} below 1x ROAS. Review targeting or pause to reallocate budget.`,
      type: "warning",
    });
  }

  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : null;
  if (avgCtr != null) {
    const msg = avgCtr >= 1.5 ? "Ads are resonating with the audience." : "Testing new creatives could boost engagement.";
    out.push({
      text: `Average click-through rate is ${avgCtr.toFixed(2)}%. ${msg}`,
      type: avgCtr >= 1.5 ? "positive" : "neutral",
    });
  }

  return out.slice(0, 4);
}

export function findBestHour(hourly: HourlyBreakdown[]): HourlyBreakdown | null {
  if (hourly.length === 0) return null;

  const totalImpressions = hourly.reduce((sum, row) => sum + row.impressions, 0);
  const totalClicks = hourly.reduce((sum, row) => sum + row.clicks, 0);
  const totalSpend = hourly.reduce((sum, row) => sum + row.spend, 0);
  if (totalImpressions <= 0 && totalClicks <= 0 && totalSpend <= 0) return null;

  const meaningfulThreshold = Math.max(50, Math.round(totalImpressions * 0.04));
  const candidates = hourly.filter((row) => row.impressions >= meaningfulThreshold);
  const pool = candidates.length > 0 ? candidates : hourly;
  const withCtr = pool.filter((row) => row.ctr != null);

  if (withCtr.length > 0) {
    return [...withCtr].sort((left, right) => {
      if ((right.ctr ?? 0) !== (left.ctr ?? 0)) return (right.ctr ?? 0) - (left.ctr ?? 0);
      if (right.clicks !== left.clicks) return right.clicks - left.clicks;
      return right.impressions - left.impressions;
    })[0];
  }

  return [...pool].sort((left, right) => right.impressions - left.impressions)[0] ?? null;
}

interface DayOfWeekPerformance {
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
    const previous = byDay.get(row.dayOfWeek) ?? {
      spend: 0,
      revenue: 0,
      revenueSeen: false,
      roasWeightedSum: 0,
      roasWeight: 0,
      impressions: 0,
      clicks: 0,
    };

    previous.spend += row.spend;
    if (row.revenue != null) {
      previous.revenue += row.revenue;
      previous.revenueSeen = true;
    }
    if (row.roas != null && row.spend > 0) {
      previous.roasWeightedSum += row.roas * row.spend;
      previous.roasWeight += row.spend;
    }
    previous.impressions += row.impressions;
    previous.clicks += row.clicks;
    byDay.set(row.dayOfWeek, previous);
  }

  return [1, 2, 3, 4, 5, 6, 0]
    .filter((day) => byDay.has(day))
    .map((day) => {
      const totals = byDay.get(day)!;
      const revenue = totals.revenueSeen ? totals.revenue : null;
      const ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : null;
      const roas = revenue != null && totals.spend > 0
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
  const totalClicks = summary.reduce((sum, row) => sum + row.clicks, 0);
  const totalSpend = summary.reduce((sum, row) => sum + row.spend, 0);
  const totalRevenue = summary.reduce((sum, row) => sum + (row.revenue ?? 0), 0);
  if (totalImpressions <= 0 && totalClicks <= 0 && totalSpend <= 0 && totalRevenue <= 0) return null;

  const meaningfulThreshold = Math.max(100, Math.round(totalImpressions * 0.08));
  const candidates = summary.filter((row) => row.impressions >= meaningfulThreshold);
  const pool = candidates.length > 0 ? candidates : summary;
  const withRoas = pool.filter((row) => row.roas != null);

  if (withRoas.length > 0) {
    return [...withRoas].sort((left, right) => {
      if ((right.roas ?? 0) !== (left.roas ?? 0)) return (right.roas ?? 0) - (left.roas ?? 0);
      if ((right.revenue ?? 0) !== (left.revenue ?? 0)) return (right.revenue ?? 0) - (left.revenue ?? 0);
      if (right.clicks !== left.clicks) return right.clicks - left.clicks;
      return right.impressions - left.impressions;
    })[0];
  }

  const withCtr = pool.filter((row) => row.ctr != null);
  if (withCtr.length > 0) {
    return [...withCtr].sort((left, right) => {
      if ((right.ctr ?? 0) !== (left.ctr ?? 0)) return (right.ctr ?? 0) - (left.ctr ?? 0);
      if (right.clicks !== left.clicks) return right.clicks - left.clicks;
      return right.impressions - left.impressions;
    })[0];
  }

  return [...pool].sort((left, right) => {
    if (right.clicks !== left.clicks) return right.clicks - left.clicks;
    return right.impressions - left.impressions;
  })[0] ?? null;
}

export function findTopMarket(geography: GeographyBreakdown[]): GeographyBreakdown | null {
  if (geography.length === 0) return null;

  const totalImpressions = geography.reduce((sum, row) => sum + row.impressions, 0);
  const totalClicks = geography.reduce((sum, row) => sum + row.clicks, 0);
  const totalSpend = geography.reduce((sum, row) => sum + row.spend, 0);
  if (totalImpressions <= 0 && totalClicks <= 0 && totalSpend <= 0) return null;

  const meaningfulThreshold = Math.max(100, Math.round(totalImpressions * 0.08));
  const candidates = geography.filter((row) => row.impressions >= meaningfulThreshold);
  const pool = candidates.length > 0 ? candidates : geography;
  const withCtr = pool.filter((row) => row.ctr != null);

  if (withCtr.length > 0) {
    return [...withCtr].sort((left, right) => {
      if ((right.ctr ?? 0) !== (left.ctr ?? 0)) return (right.ctr ?? 0) - (left.ctr ?? 0);
      if (right.clicks !== left.clicks) return right.clicks - left.clicks;
      return right.impressions - left.impressions;
    })[0];
  }

  return [...pool].sort((left, right) => right.impressions - left.impressions)[0] ?? null;
}

export function findTopCreative(ads: AdCard[]): AdCard | null {
  if (ads.length === 0) return null;

  const measurable = ads.filter(
    (ad) => ad.spend > 0 || ad.impressions > 0 || ad.clicks > 0 || (ad.revenue ?? 0) > 0 || ad.roas != null,
  );
  if (measurable.length === 0) return null;

  const meaningful = measurable.filter(
    (ad) => ad.spend >= 10 || ad.impressions >= 500 || ad.clicks >= 5 || (ad.revenue ?? 0) > 0,
  );
  const pool = meaningful.length > 0 ? meaningful : measurable;
  const withRoas = pool.filter((ad) => ad.roas != null);

  if (withRoas.length > 0) {
    return [...withRoas].sort((left, right) => {
      if ((right.roas ?? 0) !== (left.roas ?? 0)) return (right.roas ?? 0) - (left.roas ?? 0);
      return (right.revenue ?? 0) - (left.revenue ?? 0);
    })[0];
  }

  const withCtr = pool.filter((ad) => ad.ctr != null);
  if (withCtr.length > 0) {
    return [...withCtr].sort((left, right) => {
      if ((right.ctr ?? 0) !== (left.ctr ?? 0)) return (right.ctr ?? 0) - (left.ctr ?? 0);
      return right.clicks - left.clicks;
    })[0];
  }

  return [...pool].sort((left, right) => right.impressions - left.impressions)[0] ?? null;
}

export function generateRecommendations(
  campaign: CampaignCard,
  ageGender: AgeGenderBreakdown[],
  placements: PlacementBreakdown[],
  geography: GeographyBreakdown[],
  ads: AdCard[],
  hourly: HourlyBreakdown[],
  daily: DailyPoint[],
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (campaign.roas != null) {
    if (campaign.roas >= 3) {
      recommendations.push({
        title: "Strong return on investment",
        detail: `This campaign is generating $${campaign.roas.toFixed(2)} for every dollar invested. This is above the 3x benchmark.`,
        type: "success",
      });
    } else if (campaign.roas >= 2) {
      recommendations.push({
        title: "Solid performance",
        detail: `At ${campaign.roas.toFixed(1)}x ROAS, this campaign is profitable. Scaling budget could amplify returns.`,
        type: "success",
      });
    } else if (campaign.roas >= 1) {
      recommendations.push({
        title: "Room to improve",
        detail: `ROAS of ${campaign.roas.toFixed(1)}x means you're breaking even. Tightening targeting or refreshing creatives could help.`,
        type: "opportunity",
      });
    }
  }

  if (ageGender.length > 0) {
    const totalImpressions = ageGender.reduce((sum, row) => sum + row.impressions, 0);
    if (totalImpressions > 0) {
      const sorted = [...ageGender].sort((left, right) => right.impressions - left.impressions);
      const top = sorted[0];
      const topPct = ((top.impressions / totalImpressions) * 100).toFixed(0);
      recommendations.push({
        title: `${top.gender} ${top.age} is your strongest segment`,
        detail: `This group accounts for ${topPct}% of impressions. Consider tailoring creative messaging to this demographic.`,
        type: "info",
      });
    }

    const genderCtr = new Map<string, { clicks: number; impressions: number }>();
    for (const row of ageGender) {
      const previous = genderCtr.get(row.gender) ?? { clicks: 0, impressions: 0 };
      genderCtr.set(row.gender, {
        clicks: previous.clicks + row.clicks,
        impressions: previous.impressions + row.impressions,
      });
    }
    const genderRates = Array.from(genderCtr.entries())
      .map(([gender, value]) => ({
        gender,
        ctr: value.impressions > 0 ? (value.clicks / value.impressions) * 100 : 0,
      }))
      .sort((left, right) => right.ctr - left.ctr);
    if (genderRates.length >= 2 && genderRates[0].ctr > genderRates[1].ctr * 1.2) {
      recommendations.push({
        title: `${genderRates[0].gender} audience engages more`,
        detail: `${genderRates[0].gender} CTR is ${genderRates[0].ctr.toFixed(2)}% vs ${genderRates[1].ctr.toFixed(2)}% for ${genderRates[1].gender}. Consider increasing reach to the higher-engagement group.`,
        type: "opportunity",
      });
    }
  }

  if (placements.length > 1) {
    const totalImpressions = placements.reduce((sum, row) => sum + row.impressions, 0);
    if (totalImpressions > 0) {
      const byCtr = [...placements]
        .filter((placement) => placement.impressions > totalImpressions * 0.05)
        .sort((left, right) => (right.ctr ?? 0) - (left.ctr ?? 0));
      if (byCtr.length > 0 && byCtr[0].ctr != null) {
        recommendations.push({
          title: `${byCtr[0].platform} ${byCtr[0].position} drives highest engagement`,
          detail: `CTR of ${byCtr[0].ctr.toFixed(2)}% in this placement. Allocating more delivery here could improve overall performance.`,
          type: "opportunity",
        });
      }
    }
  }

  if (hourly.length > 0) {
    const bestHour = findBestHour(hourly);
    if (bestHour) {
      recommendations.push({
        title: `${formatHour(bestHour.hour)} is your strongest hour`,
        detail: bestHour.ctr != null
          ? `This window is delivering ${bestHour.ctr.toFixed(2)}% CTR on ${bestHour.impressions.toLocaleString()} impressions. Concentrating spend here can improve efficiency.`
          : "This window is delivering the strongest delivery volume right now. Concentrating spend here can improve efficiency.",
        type: "info",
      });
    }
  }

  if (geography.length > 0) {
    const topMarket = findTopMarket(geography);
    if (topMarket) {
      recommendations.push({
        title: `${topMarket.market} is your hottest market`,
        detail: topMarket.ctr != null
          ? `${topMarket.market} is returning ${topMarket.ctr.toFixed(2)}% CTR with ${topMarket.clicks.toLocaleString()} clicks. Use this market as your benchmark when shifting spend.`
          : `${topMarket.market} is currently driving the heaviest delivery. Use it as a benchmark when shifting spend.`,
        type: "info",
      });
    }
  }

  if (daily.length >= 3) {
    const bestDay = findBestDayOfWeek(daily);
    const dayBreakdown = summarizeDayOfWeekPerformance(daily);

    if (bestDay && dayBreakdown.length >= 2) {
      const worstDay = [...dayBreakdown].sort((left, right) => left.impressions - right.impressions)[0];
      const bestDayLabel = formatWeekday(bestDay.label);
      const worstDayLabel = formatWeekday(worstDay.label);
      recommendations.push({
        title: `${bestDayLabel} is delivering the strongest response`,
        detail: bestDay.roas != null
          ? `${bestDayLabel} is leading at ${bestDay.roas.toFixed(2)}x ROAS. ${worstDayLabel} is the softest day for delivery in this window.`
          : bestDay.ctr != null
            ? `${bestDayLabel} is leading at ${bestDay.ctr.toFixed(2)}% CTR. ${worstDayLabel} is the softest day for delivery in this window.`
            : `${bestDayLabel} is producing the strongest delivery volume, while ${worstDayLabel} is the quietest day in this window.`,
        type: "info",
      });
    }
  }

  const bestCreative = findTopCreative(ads);
  if (bestCreative) {
    recommendations.push({
      title: `"${bestCreative.name}" is your top creative`,
      detail: bestCreative.roas != null
        ? `At ${bestCreative.roas.toFixed(1)}x ROAS, this ad is outperforming the rest. Use its messaging and visual structure as the next creative benchmark.`
        : "This ad is leading on engagement. Use its messaging and visual structure as the next creative benchmark.",
      type: bestCreative.roas != null && bestCreative.roas >= 2 ? "success" : "info",
    });
  }

  return recommendations.slice(0, 6);
}

function formatHour(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
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
