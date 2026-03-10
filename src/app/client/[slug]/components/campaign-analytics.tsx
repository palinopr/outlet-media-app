import { BarChart3, CalendarDays, Globe2, Layers, Sparkles } from "lucide-react";
import { fmtUsd } from "@/lib/formatters";
import type {
  AgeGenderBreakdown,
  PlacementBreakdown,
  GeographyBreakdown,
  AdCard,
  HourlyBreakdown,
  DailyPoint,
} from "../types";
import { AGE_BRACKETS, DAY_LABELS } from "../types";
import { findBestHour, findTopCreative, findTopMarket } from "../lib";
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

  const byGender = new Map<string, number>();
  for (const row of ageGender) {
    byGender.set(row.gender, (byGender.get(row.gender) ?? 0) + row.impressions);
  }

  const genderChartData: GenderRow[] = Array.from(byGender.entries())
    .map(([gender, impressions]) => ({
      gender,
      impressions,
      pct: totalImp > 0 ? (impressions / totalImp) * 100 : 0,
    }))
    .sort((a, b) => b.impressions - a.impressions);

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

  const dowMap = new Map<number, { impressions: number; clicks: number }>();
  for (const row of daily) {
    const prev = dowMap.get(row.dayOfWeek) ?? { impressions: 0, clicks: 0 };
    dowMap.set(row.dayOfWeek, {
      impressions: prev.impressions + row.impressions,
      clicks: prev.clicks + row.clicks,
    });
  }

  const dowData: DayOfWeekRow[] = [1, 2, 3, 4, 5, 6, 0]
    .filter((day) => dowMap.has(day))
    .map((day) => ({
      day: DAY_LABELS[day],
      impressions: dowMap.get(day)!.impressions,
      clicks: dowMap.get(day)!.clicks,
    }));

  const topAudience = ageGender.length > 0
    ? [...ageGender].sort((a, b) => b.impressions - a.impressions)[0]
    : null;
  const topMarket = findTopMarket(geography);
  const bestHour = findBestHour(hourly);
  const topCreative = findTopCreative(ads);

  return (
    <div className="flex flex-col gap-6">
      {(topAudience || topMarket || bestHour || topCreative) && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Performance Signals</span>
            <span className="ml-auto text-xs text-white/45">{rangeLabel}</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {topAudience && (
              <SignalCard
                label="Top Audience"
                value={`${topAudience.gender} ${topAudience.age}`}
                detail={`${Math.round((topAudience.impressions / Math.max(totalImp, 1)) * 100)}% of reach`}
                note={topAudience.ctr != null ? `${topAudience.ctr.toFixed(2)}% CTR` : "Highest delivery share"}
              />
            )}
            {topMarket && (
              <SignalCard
                label="Top Market"
                value={topMarket.market}
                detail={`${topMarket.clicks.toLocaleString()} clicks`}
                note={topMarket.ctr != null ? `${topMarket.ctr.toFixed(2)}% CTR` : "Leading geography"}
              />
            )}
            {bestHour && (
              <SignalCard
                label="Best Hour"
                value={formatHour(bestHour.hour)}
                detail={`${bestHour.impressions.toLocaleString()} impressions`}
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
