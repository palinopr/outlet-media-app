import type { Metadata } from "next";
import {
  DollarSign,
  Megaphone,
  TrendingUp,
  MousePointerClick,
  Sparkles,
  Clock,
  BarChart3,
} from "lucide-react";
import { RoasTrendChart, SpendTrendChart } from "@/components/charts/roas-trend-chart";
import { fmtUsd, fmtNum, roasColor, slugToLabel, fmtTodayLong } from "@/lib/formatters";
import { getCampaignsPageData } from "../data";
import { buildTrendData, roasLabel, generateCampaignInsights } from "../lib";
import { InsightsPanel } from "../components/insights-panel";
import { ClientPortalFooter } from "../components/client-portal-footer";
import { CampaignsTable } from "./campaigns-table";
import { requireClientAccess } from "@/features/client-portal/access";
import { getRangeLabel, parseClientCampaignRange } from "@/lib/constants";
import { CampaignRangeFilter } from "./campaign-range-filter";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ range?: string; since?: string; until?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const clientName = slugToLabel(slug);
  return {
    title: `${clientName} Campaigns`,
    description: `Campaign performance data for ${clientName}`,
  };
}

export default async function ClientCampaigns({ params, searchParams }: Props) {
  const { slug } = await params;
  const rawSearchParams = await searchParams;
  const range = parseClientCampaignRange(rawSearchParams, "today");
  const rangeLabel = getRangeLabel(range);
  const { scope } = await requireClientAccess(slug);
  const clientName = slugToLabel(slug);

  const { campaigns, snapshots, dataSource } = await getCampaignsPageData(slug, range, scope);
  const trendData = buildTrendData(snapshots);

  const totalSpend       = campaigns.reduce((a, c) => a + c.spend, 0);
  const totalRevenue     = campaigns.reduce((a, c) => a + (c.revenue ?? 0), 0);
  const hasRevenue       = campaigns.some((c) => c.revenue != null || c.roas != null);
  const totalImpressions = campaigns.reduce((a, c) => a + c.impressions, 0);
  const totalClicks      = campaigns.reduce((a, c) => a + c.clicks, 0);
  const blendedRoas      = hasRevenue && totalSpend > 0 ? totalRevenue / totalSpend : null;
  const hasData          = campaigns.length > 0;
  const avgCtr           = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : null;
  const avgCpc           = totalClicks > 0 ? totalSpend / totalClicks : null;
  const avgCpm           = totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : null;

  const insights = generateCampaignInsights(campaigns);
  const now = fmtTodayLong();

  const heroStats = [
    {
      label: "Total Ad Spend",
      value: fmtUsd(totalSpend),
      sub: rangeLabel.toLowerCase(),
      icon: DollarSign,
      iconBg: "bg-blue-500/12",
      iconRing: "ring-blue-400/20",
      iconColor: "text-blue-300",
    },
    {
      label: hasRevenue ? "Ad Revenue" : "Total Clicks",
      value: hasRevenue ? fmtUsd(totalRevenue) : fmtNum(totalClicks),
      sub: blendedRoas != null
        ? `$${blendedRoas.toFixed(2)} return per dollar`
        : hasRevenue
          ? "attributed to campaigns"
          : "link clicks from campaigns",
      icon: TrendingUp,
      iconBg: "bg-violet-500/10",
      iconRing: "ring-violet-500/20",
      iconColor: "text-violet-400",
    },
    {
      label: hasRevenue ? "Blended ROAS" : "Click Rate",
      value: hasRevenue
        ? blendedRoas != null ? blendedRoas.toFixed(1) + "x" : "--"
        : avgCtr != null ? avgCtr.toFixed(2) + "%" : "--",
      valueColor: roasColor(blendedRoas),
      sub: hasRevenue ? roasLabel(blendedRoas) : "of viewers who clicked",
      icon: Megaphone,
      iconBg: "bg-emerald-500/10",
      iconRing: "ring-emerald-500/20",
      iconColor: "text-emerald-400",
    },
    {
      label: "Audience Reach",
      value: fmtNum(totalImpressions),
      sub: `${fmtNum(totalClicks)} clicks`,
      icon: MousePointerClick,
      iconBg: "bg-blue-500/12",
      iconRing: "ring-blue-400/20",
      iconColor: "text-blue-300",
    },
  ];

  return (
    <div className="space-y-4">

      {/* -- Header Banner -- */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#07111f]/72 p-5 shadow-[0_16px_60px_rgba(0,0,0,0.24)] sm:p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.08] via-violet-500/[0.05] to-transparent" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-gradient-to-bl from-violet-500/[0.12] to-transparent blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-blue-300/75" />
              <span className="text-xs font-semibold tracking-widest uppercase text-blue-300">Campaigns</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{clientName} Campaigns</h1>
            <p className="text-sm text-white/60 mt-1.5 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {now}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start flex-wrap">
            <CampaignRangeFilter
              basePath={`/client/${slug}/campaigns`}
              range={range}
            />
            <div className="flex items-center gap-2">
              {hasData ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  <span className="text-xs text-white/54">
                    {dataSource === "meta_api" ? "Live from Meta" : "From database"}
                  </span>
                </>
              ) : (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block" />
                  <span className="text-xs text-white/54">No data</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* -- Hero Stats -- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {heroStats.map(({ label, value, valueColor, sub, icon: Icon, iconBg, iconRing, iconColor }) => (
          <div key={label} className="rounded-2xl border border-white/[0.09] bg-[#07111f]/72 p-4 shadow-[0_14px_48px_rgba(0,0,0,0.22)]">
            <div className="flex items-center gap-2 mb-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full ${iconBg} ring-1 ${iconRing}`}>
                <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
              </div>
              <span className="text-xs font-medium text-white/72">{label}</span>
            </div>
            <p className={`text-2xl sm:text-3xl font-semibold tracking-tight leading-none ${valueColor ?? "text-white"}`}>
              {value}
            </p>
            <p className="text-xs text-white/42 mt-2">{sub}</p>
          </div>
        ))}
      </div>

      {!hasData && (
        <div className="rounded-2xl border border-dashed border-white/[0.10] bg-[#07111f]/72 p-6 text-center shadow-[0_16px_60px_rgba(0,0,0,0.18)]">
          <Megaphone className="mx-auto mb-3 h-8 w-8 text-blue-300/55" />
          <p className="text-sm font-semibold text-white">No campaign data for this view yet</p>
          <p className="mx-auto mt-2 max-w-xl text-xs leading-6 text-white/48">
            If campaigns are active, Meta data may still be syncing or this selected date range may not have delivery yet.
          </p>
        </div>
      )}

      {/* -- Reach & Efficiency -- */}
      {hasData && (
        <div className="grid grid-cols-3 gap-3">
          {([
            { icon: BarChart3, label: "CPM", value: avgCpm != null ? fmtUsd(avgCpm) : "--", desc: "cost per 1,000 views" },
            { icon: MousePointerClick, label: "CPC", value: avgCpc != null ? fmtUsd(avgCpc) : "--", desc: "cost per click" },
            { icon: TrendingUp, label: "Click Rate", value: avgCtr != null ? avgCtr.toFixed(2) + "%" : "--", desc: "of viewers who clicked" },
          ] as const).map(({ icon: Icon, label, value, desc }) => (
            <div key={label} className="rounded-2xl border border-white/[0.08] bg-[#07111f]/72 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-3 w-3 text-white/40" />
                <span className="text-xs font-semibold tracking-wider uppercase text-white/50">{label}</span>
              </div>
              <p className="text-lg font-bold text-white">{value}</p>
              <p className="text-xs text-white/35 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* -- Performance Insights -- */}
      <InsightsPanel insights={insights} title="Performance Insights" />

      {/* -- Trend Charts -- */}
      {hasData && trendData.length > 1 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.09] bg-[#07111f]/72 p-5 shadow-[0_16px_60px_rgba(0,0,0,0.22)]">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-3.5 w-3.5 text-white/50" />
              <span className="section-label">ROAS Trend</span>
            </div>
            <RoasTrendChart data={trendData} />
          </div>
          <div className="rounded-2xl border border-white/[0.09] bg-[#07111f]/72 p-5 shadow-[0_16px_60px_rgba(0,0,0,0.22)]">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-3.5 w-3.5 text-white/50" />
              <span className="section-label">Daily Spend</span>
            </div>
            <SpendTrendChart data={trendData} />
          </div>
        </div>
      )}

      {/* -- Campaigns Table -- */}
      <CampaignsTable campaigns={campaigns} range={range} slug={slug} />

      {/* -- Footer -- */}
      <ClientPortalFooter dataSource={dataSource} />

    </div>
  );
}
