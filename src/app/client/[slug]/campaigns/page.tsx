import type { Metadata } from "next";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Megaphone, TrendingUp, MousePointerClick } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { RoasTrendChart, SpendTrendChart } from "@/components/charts/roas-trend-chart";
import { fmtUsd, fmtNum, slugToLabel, roasColor } from "@/lib/formatters";
import { getCampaignStatusCfg } from "../lib";
import { getCampaignsPageData } from "../data";
import { getMemberAccessForSlug } from "@/lib/member-access";

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
    if (s.spend != null) byDate[d].spendSum += s.spend / 100; // cents to dollars
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

  // Build scope filter
  let scope: import("../data").ScopeFilter | undefined;
  const { userId } = await auth();
  if (userId) {
    const access = await getMemberAccessForSlug(userId, slug);
    if (access?.scope === "assigned") {
      scope = {
        allowedCampaignIds: access.allowedCampaignIds,
        allowedEventIds: access.allowedEventIds,
      };
    }
  }

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
      gradient: "from-cyan-500/20 via-cyan-500/5 to-transparent",
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-400",
    },
    {
      label: "Ad Revenue",
      value: fmtUsd(totalRevenue),
      sub: "attributed to campaigns",
      icon: TrendingUp,
      gradient: "from-violet-500/20 via-violet-500/5 to-transparent",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-400",
    },
    {
      label: "Blended ROAS",
      value: blendedRoas > 0 ? blendedRoas.toFixed(1) + "x" : "--",
      sub: "return on ad spend",
      icon: Megaphone,
      gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
    },
    {
      label: "Total Impressions",
      value: fmtNum(totalImpressions),
      sub: "across all campaigns",
      icon: MousePointerClick,
      gradient: "from-rose-500/20 via-rose-500/5 to-transparent",
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-400",
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{clientName} Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">{now}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link href={`/client/${slug}/campaigns/new`}>
            <Button size="sm">Create Campaign</Button>
          </Link>
          <a href={`/client/${slug}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Back to overview
          </a>
          <div className="flex items-center gap-2">
            {hasData ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                <span className="text-xs text-muted-foreground">
                  {dataSource === "meta_api" ? "Live from Meta" : "From database"}
                </span>
              </>
            ) : (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block" />
                <span className="text-xs text-muted-foreground">No data</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hero stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        {heroStats.map(({ label, value, sub, icon: Icon, gradient, iconBg, iconColor }) => (
          <div key={label} className="relative overflow-hidden rounded-xl border border-border/60 bg-card p-5 transition-all duration-200 hover:border-border/80 hover:shadow-lg hover:shadow-black/20">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} pointer-events-none`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                <div className={`h-8 w-8 rounded-lg ${iconBg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${iconColor}`} />
                </div>
              </div>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trend charts */}
      {hasData && trendData.length > 1 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-8">
          <Card className="border-border/60 bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                ROAS Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RoasTrendChart data={trendData} />
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Daily Spend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SpendTrendChart data={trendData} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Campaigns table */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold mb-3">
          All Campaigns
          <span className="text-muted-foreground font-normal ml-2">({campaigns.length})</span>
        </h2>
        {campaigns.length === 0 ? (
          <div className="rounded-xl border border-border/60 bg-card p-12 text-center">
            <div className="mx-auto h-10 w-10 rounded-full bg-white/[0.06] flex items-center justify-center mb-3">
              <Megaphone className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No campaign data yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Data refreshes on page load</p>
          </div>
        ) : (
          <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-xl border border-border/60 bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40 hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-muted-foreground">Campaign</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground text-right">Spend</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground text-right">Revenue</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground text-right">ROAS</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground text-right">Impressions</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground text-right">CTR</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground text-right">CPC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((c) => (
                  <TableRow key={c.campaignId} className="border-border/40">
                    <TableCell>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${getCampaignStatusCfg(c.status).dot}`} />
                        <div>
                          <p className="text-sm font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{getCampaignStatusCfg(c.status).label}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium tabular-nums">{fmtUsd(c.spend)}</TableCell>
                    <TableCell className="text-right text-sm font-medium tabular-nums">{fmtUsd(c.revenue)}</TableCell>
                    <TableCell className="text-right">
                      <span className={`text-sm font-semibold tabular-nums ${roasColor(c.roas)}`}>
                        {c.roas != null ? c.roas.toFixed(1) + "x" : "--"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums text-muted-foreground">{fmtNum(c.impressions)}</TableCell>
                    <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                      {c.ctr != null ? c.ctr.toFixed(2) + "%" : "--"}
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                      {c.cpc != null ? "$" + c.cpc.toFixed(2) : "--"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile card stack */}
          <div className="md:hidden rounded-xl border border-border/60 bg-card divide-y divide-border/40 overflow-hidden">
            {campaigns.map((c) => {
              const statusCfg = getCampaignStatusCfg(c.status);
              return (
                <div key={c.campaignId} className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusCfg.dot}`} />
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <span className="text-xs text-white/40 ml-auto shrink-0">{statusCfg.label}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-xs text-white/40">Spend</span>
                      <span className="font-medium tabular-nums">{fmtUsd(c.spend)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-white/40">Revenue</span>
                      <span className="font-medium tabular-nums">{fmtUsd(c.revenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-white/40">ROAS</span>
                      <span className={`font-semibold tabular-nums ${roasColor(c.roas)}`}>
                        {c.roas != null ? c.roas.toFixed(1) + "x" : "--"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-white/40">CTR</span>
                      <span className="tabular-nums text-white/70">
                        {c.ctr != null ? c.ctr.toFixed(2) + "%" : "--"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-white/40">Impressions</span>
                      <span className="tabular-nums text-white/70">{fmtNum(c.impressions)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-white/40">CPC</span>
                      <span className="tabular-nums text-white/70">
                        {c.cpc != null ? "$" + c.cpc.toFixed(2) : "--"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border/40 pt-6 flex items-center justify-between text-xs text-muted-foreground">
        <span>Powered by Outlet Media</span>
        <span>Data from Meta Ads</span>
      </div>
    </>
  );
}
