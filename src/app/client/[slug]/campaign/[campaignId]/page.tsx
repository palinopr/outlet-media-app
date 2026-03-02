import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  Eye,
  MousePointer,
  Target,
  BarChart3,
  Image as ImageIcon,
  Clock,
  Shield,
  Sparkles,
  Layers,
  Activity,
  CalendarDays,
  Lightbulb,
} from "lucide-react";
import type { DateRange } from "../../data";
import {
  fmtUsd,
  fmtNum,
  fmtDate,
  roasLabel,
  getCampaignStatusCfg,
  AGE_BRACKETS,
  DAY_LABELS,
} from "../../lib";
import { getCampaignDetail } from "./data";
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
import { AdsPreview, type AdPreview } from "@/components/client/ads-preview";
import {
  RecommendationsList,
  type RecommendationItem,
} from "@/components/client/recommendations";

interface Props {
  params: Promise<{ slug: string; campaignId: string }>;
  searchParams: Promise<{ range?: string }>;
}

const DATE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7", label: "7d" },
  { value: "14", label: "14d" },
  { value: "30", label: "30d" },
  { value: "lifetime", label: "Lifetime" },
];

// --- Small UI pieces ---

function StatCard({
  icon: Icon,
  iconColor,
  label,
  value,
  sub,
}: {
  icon: typeof TrendingUp;
  iconColor: string;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`flex items-center justify-center h-6 w-6 rounded-lg ${iconColor}`}>
          <Icon className="h-3 w-3" />
        </div>
        <span className="text-[10px] font-semibold tracking-wider uppercase text-white/40">
          {label}
        </span>
      </div>
      <p className="text-xl font-extrabold text-white tracking-tight">{value}</p>
      {sub && <p className="text-[10px] text-white/25 mt-1">{sub}</p>}
    </div>
  );
}

function CampaignStatusBadge({ status }: { status: string }) {
  const cfg = getCampaignStatusCfg(status);
  return (
    <span className={`badge-status ${cfg.text} ${cfg.bg}`}>
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ========================================
// PAGE
// ========================================

export default async function CampaignDetailPage({ params, searchParams }: Props) {
  const { slug, campaignId } = await params;
  const { range: rangeParam } = await searchParams;
  const validRanges: DateRange[] = ["today", "yesterday", "7", "14", "30", "lifetime"];
  const range: DateRange = validRanges.includes(rangeParam as DateRange)
    ? (rangeParam as DateRange)
    : "lifetime";

  const data = await getCampaignDetail(slug, campaignId, range);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-white/40 text-sm">Campaign not found.</p>
        <Link
          href={`/client/${slug}`}
          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
        >
          <ArrowLeft className="h-3 w-3" /> Back to dashboard
        </Link>
      </div>
    );
  }

  const {
    campaign: c,
    ageGender,
    placements,
    ads,
    hourly,
    daily,
    recommendations,
    dataSource,
    rangeLabel,
  } = data;

  // --- Prepare chart data (serialize for client components) ---

  const totalImp = ageGender.reduce((s, r) => s + r.impressions, 0);

  // Age chart data
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

  // Gender chart data
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

  // Heatmap data
  const heatmapData: AgeGenderCell[] = ageGender.map((row) => ({
    age: row.age,
    gender: row.gender,
    impressions: row.impressions,
    pct: totalImp > 0 ? (row.impressions / totalImp) * 100 : 0,
  }));
  const heatmapAges = AGE_BRACKETS.filter((a) => byAge.has(a));

  // Placement chart data (no spend)
  const totalPlacementImp = placements.reduce((s, r) => s + r.impressions, 0);
  const placementData: PlacementRow[] = placements.map((r) => ({
    platform: r.platform,
    position: r.position,
    impressions: r.impressions,
    clicks: r.clicks,
    ctr: r.ctr,
    pct: totalPlacementImp > 0 ? (r.impressions / totalPlacementImp) * 100 : 0,
  }));

  // Ads preview data (no spend)
  const adsPreviewData: AdPreview[] = ads.map((ad) => ({
    adId: ad.adId,
    name: ad.name,
    status: ad.status,
    thumbnailUrl: ad.thumbnailUrl,
    creativeTitle: ad.creativeTitle,
    creativeBody: ad.creativeBody,
    impressions: ad.impressions,
    clicks: ad.clicks,
    reach: ad.reach,
    ctr: ad.ctr,
    roas: ad.roas,
  }));

  // Hourly heatmap data
  const hourlyData: HourlyRow[] = hourly.map((h) => ({
    hour: h.hour,
    impressions: h.impressions,
    clicks: h.clicks,
    ctr: h.ctr,
  }));

  // Daily trend data
  const dailyData: DailyRow[] = daily.map((d) => ({
    date: d.date,
    dayOfWeek: d.dayOfWeek,
    dayLabel: d.dayLabel,
    impressions: d.impressions,
    clicks: d.clicks,
    ctr: d.ctr,
  }));

  // Day-of-week aggregation
  const dowMap = new Map<number, { impressions: number; clicks: number }>();
  for (const d of daily) {
    const prev = dowMap.get(d.dayOfWeek) ?? { impressions: 0, clicks: 0 };
    dowMap.set(d.dayOfWeek, {
      impressions: prev.impressions + d.impressions,
      clicks: prev.clicks + d.clicks,
    });
  }
  const dowData: DayOfWeekRow[] = [1, 2, 3, 4, 5, 6, 0] // Mon-Sun order
    .filter((dow) => dowMap.has(dow))
    .map((dow) => ({
      day: DAY_LABELS[dow],
      impressions: dowMap.get(dow)!.impressions,
      clicks: dowMap.get(dow)!.clicks,
    }));

  // Recommendations
  const recsData: RecommendationItem[] = recommendations.map((r) => ({
    title: r.title,
    detail: r.detail,
    type: r.type,
  }));

  return (
    <div className="space-y-6">
      {/* -- Header -- */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.07] via-violet-500/[0.05] to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-500/[0.08] to-transparent rounded-full blur-3xl" />

        <div className="relative">
          <Link
            href={`/client/${slug}?range=${range}`}
            className="inline-flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition mb-4"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to dashboard
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-cyan-400/70" />
                <span className="text-[10px] font-semibold tracking-widest uppercase text-cyan-400/70">
                  Campaign Detail
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{c.name}</h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <CampaignStatusBadge status={c.status} />
                {c.startTime && (
                  <span className="text-[10px] text-white/25">Since {fmtDate(c.startTime)}</span>
                )}
                {c.dailyBudget != null && (
                  <span className="text-[10px] text-white/25">
                    {fmtUsd(c.dailyBudget)}/day budget
                  </span>
                )}
                {dataSource === "meta_api" && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1 sm:gap-0.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] self-start">
              {DATE_OPTIONS.map((opt) => (
                <a
                  key={opt.value}
                  href={`?range=${opt.value}`}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-300 ${
                    range === opt.value
                      ? "bg-white text-zinc-900 shadow-lg shadow-white/10"
                      : "text-white/40 hover:text-white/70 hover:bg-white/[0.06]"
                  }`}
                >
                  {opt.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* -- Key Metrics (no spend at campaign level either -- keep ROAS, revenue, impressions, clicks, CTR, CPC) -- */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard
          icon={TrendingUp}
          iconColor="bg-violet-500/10 ring-1 ring-violet-500/20 text-violet-400"
          label="ROAS"
          value={c.roas != null ? `${c.roas.toFixed(1)}x` : "--"}
          sub={roasLabel(c.roas)}
        />
        <StatCard
          icon={Target}
          iconColor="bg-emerald-500/10 ring-1 ring-emerald-500/20 text-emerald-400"
          label="Revenue"
          value={fmtUsd(c.revenue)}
        />
        <StatCard
          icon={Eye}
          iconColor="bg-blue-500/10 ring-1 ring-blue-500/20 text-blue-400"
          label="Impressions"
          value={fmtNum(c.impressions)}
        />
        <StatCard
          icon={MousePointer}
          iconColor="bg-amber-500/10 ring-1 ring-amber-500/20 text-amber-400"
          label="Clicks"
          value={fmtNum(c.clicks)}
          sub={c.ctr != null ? `${c.ctr.toFixed(2)}% CTR` : undefined}
        />
        <StatCard
          icon={Activity}
          iconColor="bg-cyan-500/10 ring-1 ring-cyan-500/20 text-cyan-400"
          label="CPC"
          value={c.cpc != null ? `$${c.cpc.toFixed(2)}` : "--"}
          sub={c.cpm != null ? `$${c.cpm.toFixed(2)} CPM` : undefined}
        />
      </div>

      {/* -- Demographics: Charts + Heatmap -- */}
      {ageGender.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-3.5 w-3.5 text-white/30" />
            <span className="section-label">Audience Demographics</span>
            <span className="text-[10px] text-white/20 ml-auto">{rangeLabel}</span>
          </div>

          {/* Row 1: Age bar chart + Gender donut */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <AgeDistributionChart data={ageChartData} />
            <GenderDonutChart data={genderChartData} />
          </div>

          {/* Row 2: Age x Gender heatmap (full width) */}
          <AgeGenderHeatmap data={heatmapData} ages={[...heatmapAges]} />
        </section>
      )}

      {/* -- Placements: Treemap + Table -- */}
      {placements.length > 0 && (
        <section>
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

      {/* -- Performance Timeline: Hourly heatmap + Daily trend -- */}
      {(hourly.length > 0 || daily.length >= 2) && (
        <section>
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

      {/* -- Recommendations -- */}
      {recsData.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-3.5 w-3.5 text-white/30" />
            <span className="section-label">Insights & Recommendations</span>
          </div>
          <RecommendationsList items={recsData} />
        </section>
      )}

      {/* -- Ads: 3 previews + expand -- */}
      {ads.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="h-3.5 w-3.5 text-white/30" />
            <span className="section-label">Ad Creatives</span>
            <span className="text-[10px] text-white/20 ml-auto">{ads.length} ads</span>
          </div>
          <AdsPreview ads={adsPreviewData} />
        </section>
      )}

      {/* -- Empty state -- */}
      {dataSource === "supabase" && ageGender.length === 0 && ads.length === 0 && (
        <div className="glass-card p-8 text-center">
          <p className="text-sm text-white/30 mb-1">Demographics and ad breakdowns unavailable</p>
          <p className="text-[11px] text-white/15">
            Live data from Meta is required for detailed breakdowns. Showing cached totals.
          </p>
        </div>
      )}

      {/* -- Footer -- */}
      <footer className="pt-4 print:hidden">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">O</span>
            </div>
            <span className="text-xs text-white/25 font-medium">Powered by Outlet Media</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[11px] text-white/20">
              <Shield className="h-3 w-3" />
              <span>Secure Portal</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-white/20">
              <Clock className="h-3 w-3" />
              <span>{dataSource === "meta_api" ? "Live from Meta" : "Last sync"}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
