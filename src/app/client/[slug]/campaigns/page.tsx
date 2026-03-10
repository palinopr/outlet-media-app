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

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const clientName = slugToLabel(slug);
  return {
    title: `${clientName} Campaigns`,
    description: `Campaign performance data for ${clientName}`,
  };
}

export default async function ClientCampaigns({ params }: Props) {
  const { slug } = await params;
  const { scope } = await requireClientAccess(slug, "meta_ads");
  const clientName = slugToLabel(slug);

  const { campaigns, snapshots, dataSource } = await getCampaignsPageData(slug, scope);
  const trendData = buildTrendData(snapshots);

  const totalSpend       = campaigns.reduce((a, c) => a + c.spend, 0);
  const totalRevenue     = campaigns.reduce((a, c) => a + (c.revenue ?? 0), 0);
  const totalImpressions = campaigns.reduce((a, c) => a + c.impressions, 0);
  const totalClicks      = campaigns.reduce((a, c) => a + c.clicks, 0);
  const blendedRoas      = totalSpend > 0 ? totalRevenue / totalSpend : null;
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
      sub: "last 30 days",
      icon: DollarSign,
      iconBg: "bg-cyan-500/10",
      iconRing: "ring-cyan-500/20",
      iconColor: "text-cyan-400",
    },
    {
      label: "Ad Revenue",
      value: fmtUsd(totalRevenue),
      sub: blendedRoas != null
        ? `$${blendedRoas.toFixed(2)} return per dollar`
        : "attributed to campaigns",
      icon: TrendingUp,
      iconBg: "bg-violet-500/10",
      iconRing: "ring-violet-500/20",
      iconColor: "text-violet-400",
    },
    {
      label: "Blended ROAS",
      value: blendedRoas != null ? blendedRoas.toFixed(1) + "x" : "--",
      valueColor: roasColor(blendedRoas),
      sub: roasLabel(blendedRoas),
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
      iconBg: "bg-rose-500/10",
      iconRing: "ring-rose-500/20",
      iconColor: "text-rose-400",
    },
  ];

  return (
    <div className="space-y-6">

      {/* -- Header Banner -- */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.07] via-violet-500/[0.05] to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-500/[0.08] to-transparent rounded-full blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-cyan-400/70" />
              <span className="text-xs font-semibold tracking-widest uppercase text-cyan-400">Campaigns</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{clientName} Campaigns</h1>
            <p className="text-sm text-white/60 mt-1.5 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {now}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start flex-wrap">
            <a href={`/client/${slug}`} className="text-xs text-white/50 hover:text-white/80 transition-colors">
              Back to overview
            </a>
            <div className="flex items-center gap-2">
              {hasData ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  <span className="text-xs text-white/50">
                    {dataSource === "meta_api" ? "Live from Meta" : "From database"}
                  </span>
                </>
              ) : (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block" />
                  <span className="text-xs text-white/50">No data</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* -- Hero Stats -- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {heroStats.map(({ label, value, valueColor, sub, icon: Icon, iconBg, iconRing, iconColor }) => (
          <div key={label} className="glass-card hero-stat-card stat-glow p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className={`flex items-center justify-center h-7 w-7 rounded-lg ${iconBg} ring-1 ${iconRing}`}>
                <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
              </div>
              <span className="text-xs font-semibold tracking-wider uppercase text-white/60">{label}</span>
            </div>
            <p className={`text-2xl sm:text-3xl font-extrabold tracking-tighter leading-none ${valueColor ?? "text-white"}`}>
              {value}
            </p>
            <p className="text-xs text-white/45 mt-2">{sub}</p>
          </div>
        ))}
      </div>

      {/* -- Reach & Efficiency -- */}
      {hasData && (
        <div className="grid grid-cols-3 gap-3">
          {([
            { icon: BarChart3, label: "CPM", value: avgCpm != null ? fmtUsd(avgCpm) : "--", desc: "cost per 1,000 views" },
            { icon: MousePointerClick, label: "CPC", value: avgCpc != null ? fmtUsd(avgCpc) : "--", desc: "cost per click" },
            { icon: TrendingUp, label: "Click Rate", value: avgCtr != null ? avgCtr.toFixed(2) + "%" : "--", desc: "of viewers who clicked" },
          ] as const).map(({ icon: Icon, label, value, desc }) => (
            <div key={label} className="glass-card p-4">
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
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-3.5 w-3.5 text-white/50" />
              <span className="section-label">ROAS Trend</span>
            </div>
            <RoasTrendChart data={trendData} />
          </div>
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-3.5 w-3.5 text-white/50" />
              <span className="section-label">Daily Spend</span>
            </div>
            <SpendTrendChart data={trendData} />
          </div>
        </div>
      )}

      {/* -- Campaigns Table -- */}
      <CampaignsTable campaigns={campaigns} />

      {/* -- Footer -- */}
      <ClientPortalFooter dataSource={dataSource} />

    </div>
  );
}
