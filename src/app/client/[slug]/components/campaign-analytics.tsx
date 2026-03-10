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

  return (
    <div className="flex flex-col gap-6">
      {(topAge || leadingGender || bestDay || topMarket || bestHour || topCreative) && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Decision Signals</span>
            <span className="ml-auto text-xs text-white/45">{rangeLabel}</span>
          </div>
          <p className="mb-4 max-w-3xl text-xs leading-5 text-white/45">
            The fastest read on who is responding, when the campaign gets attention, and which
            market or creative is setting the pace.
          </p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {topAge && (
              <SignalCard
                label="Top Age Bracket"
                value={topAge.age}
                detail={`${Math.round((topAge.impressions / Math.max(totalImp, 1)) * 100)}% of campaign reach`}
                note={topAge.ctr != null ? `${topAge.ctr.toFixed(2)}% CTR` : "Largest share of delivery"}
              />
            )}
            {leadingGender && (
              <SignalCard
                label="Leading Gender"
                value={leadingGender.gender}
                detail={`${leadingGender.pct.toFixed(0)}% of total impressions`}
                note={leadingGender.ctr != null ? `${leadingGender.ctr.toFixed(2)}% CTR` : "Largest reach share"}
              />
            )}
            {bestDay && (
              <SignalCard
                label="Best Day"
                value={formatDay(bestDay.label)}
                detail={`${fmtNum(bestDay.impressions)} impressions and ${fmtNum(bestDay.clicks)} clicks`}
                note={
                  bestDay.roas != null
                    ? `${bestDay.roas.toFixed(2)}x ROAS`
                    : bestDay.ctr != null
                      ? `${bestDay.ctr.toFixed(2)}% CTR`
                      : "Strongest day in the selected window"
                }
              />
            )}
            {topMarket && (
              <SignalCard
                label="Top Market"
                value={topMarket.market}
                detail={`${fmtNum(topMarket.impressions)} impressions and ${fmtNum(topMarket.clicks)} clicks`}
                note={topMarket.ctr != null ? `${topMarket.ctr.toFixed(2)}% CTR` : "Leading geography"}
              />
            )}
            {bestHour && (
              <SignalCard
                label="Best Hour"
                value={formatHour(bestHour.hour)}
                detail={`${fmtNum(bestHour.impressions)} impressions and ${fmtNum(bestHour.clicks)} clicks`}
                note={bestHour.ctr != null ? `${bestHour.ctr.toFixed(2)}% CTR` : "Highest activity window"}
              />
            )}
            {topCreative && (
              <SignalCard
                label="Top Creative"
                value={topCreative.name}
                detail={topCreative.revenue != null ? fmtUsd(topCreative.revenue) : `${topCreative.clicks.toLocaleString()} clicks`}
                note={topCreative.roas != null ? `${topCreative.roas.toFixed(1)}x ROAS` : topCreative.ctr != null ? `${topCreative.ctr.toFixed(2)}% CTR` : "Best-performing ad"}
              />
            )}
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

function SignalCard({
  label,
  value,
  detail,
  note,
}: {
  label: string;
  value: string;
  detail: string;
  note: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.08] via-violet-500/[0.04] to-transparent" />
      <div className="relative">
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">{label}</p>
        <p className="mt-2 line-clamp-2 text-lg font-bold tracking-tight text-white">{value}</p>
        <p className="mt-2 text-xs text-white/55">{detail}</p>
        <p className="mt-1 text-[11px] text-cyan-300/70">{note}</p>
      </div>
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
