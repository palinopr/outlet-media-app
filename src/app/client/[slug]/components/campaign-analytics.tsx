import { BarChart3, CalendarDays, Globe2, Layers, Sparkles } from "lucide-react";
import { fmtNum, fmtUsd } from "@/lib/formatters";
import type {
  AgeGenderBreakdown,
  PlacementBreakdown,
  GeographyBreakdown,
  AdCard,
  HourlyBreakdown,
  DailyPoint,
} from "../types";
import { AGE_BRACKETS } from "../types";
import {
  findBestDayOfWeek,
  findBestHour,
  findTopCreative,
  findTopMarket,
  summarizeDayOfWeekPerformance,
} from "../lib";
import {
  AgeDistributionChart,
  GenderDonutChart,
  AgeGenderHeatmap,
  PlacementTreemap,
  PlacementTable,
  MarketPerformanceTable,
  HourlyHeatmap,
  PerformanceTrendTabs,
  DayOfWeekChart,
  type AgeRow,
  type GenderRow,
  type AgeGenderCell,
  type PlacementRow,
  type MarketRow,
  type HourlyRow,
  type PerformanceTrendRow,
  type DayOfWeekRow,
} from "@/components/client/charts";

interface Props {
  ageGender: AgeGenderBreakdown[];
  placements: PlacementBreakdown[];
  geography: GeographyBreakdown[];
  ads: AdCard[];
  hourly: HourlyBreakdown[];
  daily: DailyPoint[];
  rangeLabel: string;
}

export function CampaignAnalytics({
  ageGender,
  placements,
  geography,
  ads,
  hourly,
  daily,
  rangeLabel,
}: Props) {
  const totalImp = ageGender.reduce((sum, row) => sum + row.impressions, 0);

  const byAge = new Map<string, { impressions: number; clicks: number; ctr: number | null }>();
  for (const row of ageGender) {
    const prev = byAge.get(row.age) ?? { impressions: 0, clicks: 0, ctr: null };
    const impressions = prev.impressions + row.impressions;
    const clicks = prev.clicks + row.clicks;
    byAge.set(row.age, {
      impressions,
      clicks,
      ctr: impressions > 0 ? (clicks / impressions) * 100 : null,
    });
  }

  const ageChartData: AgeRow[] = AGE_BRACKETS
    .filter((age) => byAge.has(age))
    .map((age) => ({ age, ...byAge.get(age)! }));

  const byGender = new Map<string, { impressions: number; clicks: number }>();
  for (const row of ageGender) {
    const prev = byGender.get(row.gender) ?? { impressions: 0, clicks: 0 };
    byGender.set(row.gender, {
      impressions: prev.impressions + row.impressions,
      clicks: prev.clicks + row.clicks,
    });
  }

  const genderMetrics = Array.from(byGender.entries())
    .map(([gender, stats]) => ({
      gender,
      impressions: stats.impressions,
      clicks: stats.clicks,
      pct: totalImp > 0 ? (stats.impressions / totalImp) * 100 : 0,
      ctr: stats.impressions > 0 ? (stats.clicks / stats.impressions) * 100 : null,
    }))
    .sort((a, b) => b.impressions - a.impressions);

  const genderChartData: GenderRow[] = genderMetrics.map(({ gender, impressions, pct }) => ({
    gender,
    impressions,
    pct,
  }));

  const heatmapData: AgeGenderCell[] = ageGender.map((row) => ({
    age: row.age,
    gender: row.gender,
    impressions: row.impressions,
    pct: totalImp > 0 ? (row.impressions / totalImp) * 100 : 0,
  }));

  const heatmapAges = AGE_BRACKETS.filter((age) => byAge.has(age));

  const totalPlacementImp = placements.reduce((sum, row) => sum + row.impressions, 0);
  const placementData: PlacementRow[] = placements.map((row) => ({
    platform: row.platform,
    position: row.position,
    impressions: row.impressions,
    clicks: row.clicks,
    ctr: row.ctr,
    pct: totalPlacementImp > 0 ? (row.impressions / totalPlacementImp) * 100 : 0,
  }));

  const totalMarketImp = geography.reduce((sum, row) => sum + row.impressions, 0);
  const marketData: MarketRow[] = geography.map((row) => ({
    market: row.market,
    spend: row.spend,
    impressions: row.impressions,
    clicks: row.clicks,
    ctr: row.ctr,
    cpc: row.cpc,
    pct: totalMarketImp > 0 ? (row.impressions / totalMarketImp) * 100 : 0,
  }));

  const hourlyData: HourlyRow[] = hourly.map((row) => ({
    hour: row.hour,
    spend: row.spend,
    impressions: row.impressions,
    clicks: row.clicks,
    ctr: row.ctr,
  }));

  const trendData: PerformanceTrendRow[] = daily.map((row) => {
    const date = new Date(`${row.date}T12:00:00`);
    return {
      date: row.date,
      label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      spend: row.spend,
      revenue: row.revenue,
      roas: row.roas,
      impressions: row.impressions,
      clicks: row.clicks,
      ctr: row.ctr,
    };
  });

  const dayPerformance = summarizeDayOfWeekPerformance(daily);
  const dowData: DayOfWeekRow[] = dayPerformance.map((row) => ({
    day: row.label,
    impressions: row.impressions,
    clicks: row.clicks,
  }));

  const topAge = getTopAgeBracket(ageChartData, totalImp);
  const leadingGender = genderMetrics[0] ?? null;
  const bestDay = findBestDayOfWeek(daily);
  const topMarket = findTopMarket(geography);
  const bestHour = findBestHour(hourly);
  const topCreative = findTopCreative(ads);
  const story = buildDemandStory({
    totalImp,
    topAge,
    leadingGender,
    bestDay,
    topMarket,
    bestHour,
    topCreative,
  });

  return (
    <div className="flex flex-col gap-6">
      {story && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Demand Story</span>
            <span className="ml-auto text-xs text-white/45">{rangeLabel}</span>
          </div>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.85fr)]">
            <div className="relative overflow-hidden rounded-[28px] border border-white/[0.06] bg-white/[0.03] p-6 sm:p-7">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.08] via-violet-500/[0.04] to-transparent" />
              <div className="relative">
                <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-300/70">
                  Campaign Intelligence
                </p>
                <h3 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-[2rem]">
                  {story.headline}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
                  {story.body}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {story.highlights.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/[0.08] bg-black/10 p-4 backdrop-blur-sm"
                    >
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                        {item.label}
                      </p>
                      <p className="mt-2 text-lg font-semibold tracking-tight text-white">
                        {item.value}
                      </p>
                      <p className="mt-2 text-xs leading-5 text-white/45">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card p-5 sm:p-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">Signal Rail</p>
              <div className="mt-4 space-y-3">
                {story.rail.map((item, index) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-[10px] font-semibold text-white/55">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white/90">{item.value}</p>
                        <p className="mt-1 text-xs leading-5 text-white/45">{item.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {daily.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Performance Timeline</span>
            <span className="ml-auto text-xs text-white/45">{rangeLabel}</span>
          </div>
          <PerformanceTrendTabs data={trendData} />
        </section>
      )}

      {ageGender.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Audience Demographics</span>
            <span className="ml-auto text-xs text-white/45">{rangeLabel}</span>
          </div>
          <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <AgeDistributionChart data={ageChartData} />
            <GenderDonutChart data={genderChartData} />
          </div>
          <AgeGenderHeatmap data={heatmapData} ages={[...heatmapAges]} />
        </section>
      )}

      {(placements.length > 0 || marketData.length > 0) && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Globe2 className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Markets & Placements</span>
            <span className="ml-auto text-xs text-white/45">{rangeLabel}</span>
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {marketData.length > 0 && <MarketPerformanceTable data={marketData} />}
            {placements.length > 0 && (
              <div className="grid grid-cols-1 gap-4">
                <PlacementTreemap data={placementData} />
                <PlacementTable data={placementData} />
              </div>
            )}
          </div>
        </section>
      )}

      {(hourly.length > 0 || dowData.length > 0) && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Timing & Delivery</span>
            <span className="ml-auto text-xs text-white/45">{rangeLabel}</span>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {hourly.length > 0 && <HourlyHeatmap data={hourlyData} />}
            {dowData.length > 0 && <DayOfWeekChart data={dowData} />}
          </div>
        </section>
      )}
    </div>
  );
}

function formatHour(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
}

function formatDay(day: string): string {
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

function getTopAgeBracket(ageRows: AgeRow[], totalImpressions: number): AgeRow | null {
  if (ageRows.length === 0) return null;

  const meaningfulThreshold = Math.max(100, Math.round(totalImpressions * 0.08));
  const candidates = ageRows.filter((row) => row.impressions >= meaningfulThreshold);
  const pool = candidates.length > 0 ? candidates : ageRows;

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

function buildDemandStory({
  totalImp,
  topAge,
  leadingGender,
  bestDay,
  topMarket,
  bestHour,
  topCreative,
}: {
  totalImp: number;
  topAge: AgeRow | null;
  leadingGender: { gender: string; impressions: number; clicks: number; pct: number; ctr: number | null } | null;
  bestDay: ReturnType<typeof findBestDayOfWeek>;
  topMarket: GeographyBreakdown | null;
  bestHour: HourlyBreakdown | null;
  topCreative: AdCard | null;
}) {
  const hasSignals = Boolean(topAge || leadingGender || bestDay || topMarket || bestHour || topCreative);
  if (!hasSignals) return null;

  const highlights = [
    topAge
      ? {
          label: "Top Age",
          value: topAge.age,
          detail: `${Math.round((topAge.impressions / Math.max(totalImp, 1)) * 100)}% of measured reach`,
        }
      : null,
    bestDay
      ? {
          label: "Best Day",
          value: formatDay(bestDay.label),
          detail:
            bestDay.roas != null
              ? `${bestDay.roas.toFixed(2)}x ROAS`
              : `${fmtNum(bestDay.clicks)} clicks in the strongest weekday`,
        }
      : null,
    topMarket
      ? {
          label: "Lead Market",
          value: topMarket.market,
          detail:
            topMarket.ctr != null
              ? `${topMarket.ctr.toFixed(2)}% CTR`
              : `${fmtNum(topMarket.impressions)} impressions in market`,
        }
      : topCreative
        ? {
            label: "Lead Creative",
            value: topCreative.name,
            detail:
              topCreative.roas != null
                ? `${topCreative.roas.toFixed(1)}x ROAS benchmark`
                : `${fmtNum(topCreative.clicks)} clicks from the strongest ad`,
          }
        : null,
  ].filter(
    (item): item is { label: string; value: string; detail: string } => item != null,
  );

  const rail = [
    bestHour
      ? {
          label: "Best Hour",
          value: formatHour(bestHour.hour),
          detail:
            bestHour.ctr != null
              ? `${bestHour.ctr.toFixed(2)}% CTR with ${fmtNum(bestHour.clicks)} clicks`
              : `${fmtNum(bestHour.impressions)} impressions in the strongest hour`,
        }
      : null,
    topCreative
      ? {
          label: "Top Creative",
          value: topCreative.name,
          detail:
            topCreative.revenue != null && topCreative.revenue > 0
              ? `${fmtUsd(topCreative.revenue)} attributed revenue`
              : topCreative.ctr != null
                ? `${topCreative.ctr.toFixed(2)}% CTR on measured delivery`
                : `${fmtNum(topCreative.clicks)} clicks from this ad`,
        }
      : null,
    leadingGender
      ? {
          label: "Gender Mix",
          value: leadingGender.gender,
          detail:
            leadingGender.ctr != null
              ? `${leadingGender.pct.toFixed(0)}% of reach with ${leadingGender.ctr.toFixed(2)}% CTR`
              : `${leadingGender.pct.toFixed(0)}% of measured reach`,
        }
      : null,
  ].filter((item): item is { label: string; value: string; detail: string } => item != null);

  if (bestDay && bestHour && topMarket) {
    return {
      headline: `${formatDay(bestDay.label)} around ${formatHour(bestHour.hour)} is the strongest demand window.`,
      body: `The best signal in this range is clustering around ${topMarket.market}. Use this as the benchmark for pacing conversations, scheduling pushes, and evaluating where the next creative test should land.`,
      highlights,
      rail,
    };
  }

  if (topCreative) {
    return {
      headline: `${topCreative.name} is the clearest creative benchmark right now.`,
      body: `This campaign already has a usable benchmark creative. Pair that read with the strongest timing and geography signals below before shifting budget or asking the client for the next move.`,
      highlights,
      rail,
    };
  }

  if (topAge || leadingGender) {
    return {
      headline: `Audience response is starting to cluster around a specific profile.`,
      body: `Use the demographic and timing readouts below to explain who is responding, when attention builds, and where the campaign has the cleanest signal so far.`,
      highlights,
      rail,
    };
  }

  return {
    headline: `The range is starting to show a directional performance story.`,
    body: `There is enough signal here to discuss timing, geography, and creative direction without overclaiming precision. The ranked rail on the right is the cleanest read for clients.`,
    highlights,
    rail,
  };
}
