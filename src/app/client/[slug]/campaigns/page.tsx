import type { Metadata } from "next";
import Link from "next/link";
import { DollarSign, Megaphone, TrendingUp, MousePointerClick, Sparkles, Clock } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { RoasTrendChart, SpendTrendChart } from "@/components/charts/roas-trend-chart";
import { fmtUsd, fmtNum, roasColor, slugToLabel } from "@/lib/formatters";
import { getCampaignsPageData } from "../data";
import { getScopeFilter } from "@/lib/member-access";
import { ClientPortalFooter } from "../components/client-portal-footer";
import { CampaignsTable } from "./campaigns-table";

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

// --- Helpers ---

function buildTrendData(snapshots: Array<{ snapshot_date: string; roas: number | null; spend: number | null }>) {
  const byDate: Record<string, { roasSum: number; roasCount: number; spendSum: number }> = {};
  for (const s of snapshots) {
    const d = s.snapshot_date;
    if (!byDate[d]) byDate[d] = { roasSum: 0, roasCount: 0, spendSum: 0 };
    if (s.roas != null) { byDate[d].roasSum += s.roas; byDate[d].roasCount++; }
    if (s.spend != null) byDate[d].spendSum += s.spend / 100;
  }
  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      roas: v.roasCount > 0 ? v.roasSum / v.roasCount : 0,
      spend: v.spendSum,
    }));
}

// --- Page ---

export default async function ClientCampaigns({ params }: Props) {
  const { slug } = await params;
  const clientName = slugToLabel(slug);

  const { userId } = await auth();
  const scope = await getScopeFilter(userId, slug);
  const { campaigns, snapshots, dataSource } = await getCampaignsPageData(slug, scope);
  const trendData = buildTrendData(snapshots);

  const totalSpend       = campaigns.reduce((a, c) => a + c.spend, 0);
  const totalRevenue     = campaigns.reduce((a, c) => a + (c.revenue ?? 0), 0);
  const totalImpressions = campaigns.reduce((a, c) => a + c.impressions, 0);
  const blendedRoas      = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const hasData          = campaigns.length > 0;

  const now = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

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
      sub: "attributed to campaigns",
      icon: TrendingUp,
      iconBg: "bg-violet-500/10",
      iconRing: "ring-violet-500/20",
      iconColor: "text-violet-400",
    },
    {
      label: "Blended ROAS",
      value: blendedRoas > 0 ? blendedRoas.toFixed(1) + "x" : "--",
      valueColor: roasColor(blendedRoas > 0 ? blendedRoas : null),
      sub: "return on ad spend",
      icon: Megaphone,
      iconBg: "bg-emerald-500/10",
      iconRing: "ring-emerald-500/20",
      iconColor: "text-emerald-400",
    },
    {
      label: "Total Impressions",
      value: fmtNum(totalImpressions),
      sub: "across all campaigns",
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
            <Link
              href={`/client/${slug}/campaigns/new`}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-zinc-900 shadow-lg shadow-white/10 hover:bg-white/90 transition-all"
            >
              Create Campaign
            </Link>
            <a
              href={`/client/${slug}`}
              className="text-xs text-white/50 hover:text-white/80 transition-colors"
            >
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

      {/* -- Campaigns Table with Search -- */}
      <CampaignsTable campaigns={campaigns} />

      {/* -- Footer -- */}
      <ClientPortalFooter dataSource={dataSource} />

    </div>
  );
}
