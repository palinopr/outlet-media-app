import { BarChart3, Layers, CalendarDays } from "lucide-react";
import type { AgeGenderBreakdown, PlacementBreakdown, HourlyBreakdown, DailyPoint } from "../types";
import { AGE_BRACKETS, DAY_LABELS } from "../types";
import {
  AgeDistributionChart,
  GenderDonutChart,
  AgeGenderHeatmap,
  PlacementTreemap,
  PlacementTable,
  HourlyHeatmap,
  DailyTrendChart,
  DayOfWeekChart,
  type AgeRow,
  type GenderRow,
  type AgeGenderCell,
  type PlacementRow,
  type HourlyRow,
  type DailyRow,
  type DayOfWeekRow,
} from "@/components/client/charts";

interface Props {
  ageGender: AgeGenderBreakdown[];
  placements: PlacementBreakdown[];
  hourly: HourlyBreakdown[];
  daily: DailyPoint[];
  rangeLabel: string;
}

export function CampaignAnalytics({ ageGender, placements, hourly, daily, rangeLabel }: Props) {
  const totalImp = ageGender.reduce((s, r) => s + r.impressions, 0);

  const byAge = new Map<string, { impressions: number; clicks: number; ctr: number | null }>();
  for (const row of ageGender) {
    const prev = byAge.get(row.age) ?? { impressions: 0, clicks: 0, ctr: null };
    const imp = prev.impressions + row.impressions;
    const clk = prev.clicks + row.clicks;
    byAge.set(row.age, { impressions: imp, clicks: clk, ctr: imp > 0 ? (clk / imp) * 100 : null });
  }
  const ageChartData: AgeRow[] = AGE_BRACKETS
    .filter((a) => byAge.has(a))
    .map((a) => ({ age: a, ...byAge.get(a)! }));

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
  const heatmapAges = AGE_BRACKETS.filter((a) => byAge.has(a));

  const totalPlacementImp = placements.reduce((s, r) => s + r.impressions, 0);
  const placementData: PlacementRow[] = placements.map((r) => ({
    platform: r.platform,
    position: r.position,
    impressions: r.impressions,
    clicks: r.clicks,
    ctr: r.ctr,
    pct: totalPlacementImp > 0 ? (r.impressions / totalPlacementImp) * 100 : 0,
  }));

  const hourlyData: HourlyRow[] = hourly.map((h) => ({
    hour: h.hour,
    impressions: h.impressions,
    clicks: h.clicks,
    ctr: h.ctr,
  }));

  const dailyData: DailyRow[] = daily.map((d) => ({
    date: d.date,
    dayOfWeek: d.dayOfWeek,
    dayLabel: d.dayLabel,
    impressions: d.impressions,
    clicks: d.clicks,
    ctr: d.ctr,
  }));

  const dowMap = new Map<number, { impressions: number; clicks: number }>();
  for (const d of daily) {
    const prev = dowMap.get(d.dayOfWeek) ?? { impressions: 0, clicks: 0 };
    dowMap.set(d.dayOfWeek, {
      impressions: prev.impressions + d.impressions,
      clicks: prev.clicks + d.clicks,
    });
  }
  const dowData: DayOfWeekRow[] = [1, 2, 3, 4, 5, 6, 0]
    .filter((dow) => dowMap.has(dow))
    .map((dow) => ({
      day: DAY_LABELS[dow],
      impressions: dowMap.get(dow)!.impressions,
      clicks: dowMap.get(dow)!.clicks,
    }));

  // Mobile order: timeline (1) -> placements (2) -> demographics (3)
  // Desktop order: demographics (1) -> placements (2) -> timeline (3)
  return (
    <div className="flex flex-col gap-6">
      {ageGender.length > 0 && (
        <section className="order-3 md:order-1">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-3.5 w-3.5 text-white/30" />
            <span className="section-label">Audience Demographics</span>
            <span className="text-[10px] text-white/20 ml-auto">{rangeLabel}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <AgeDistributionChart data={ageChartData} />
            <GenderDonutChart data={genderChartData} />
          </div>
          <AgeGenderHeatmap data={heatmapData} ages={[...heatmapAges]} />
        </section>
      )}

      {placements.length > 0 && (
        <section className="order-2 md:order-2">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="h-3.5 w-3.5 text-white/30" />
            <span className="section-label">Placements</span>
            <span className="text-[10px] text-white/20 ml-auto">{rangeLabel}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PlacementTreemap data={placementData} />
            <PlacementTable data={placementData} />
          </div>
        </section>
      )}

      {(hourly.length > 0 || daily.length >= 2) && (
        <section className="order-1 md:order-3">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-3.5 w-3.5 text-white/30" />
            <span className="section-label">Performance Timeline</span>
            <span className="text-[10px] text-white/20 ml-auto">{rangeLabel}</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {daily.length >= 2 && <DailyTrendChart data={dailyData} />}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {hourly.length > 0 && <HourlyHeatmap data={hourlyData} />}
              {dowData.length > 0 && <DayOfWeekChart data={dowData} />}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
