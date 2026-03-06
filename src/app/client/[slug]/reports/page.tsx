import type { Metadata } from "next";
import {
  DollarSign,
  TrendingUp,
  MousePointerClick,
  Eye,
  Trophy,
  BarChart3,
  Ticket,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { AgentOutcomesPanel } from "@/components/agents/agent-outcomes-panel";
import { DashboardActionCenterSection } from "@/components/dashboard/dashboard-action-center";
import { EventOperationsSection } from "@/components/events/event-operations-section";
import { RoasTrendChart, SpendTrendChart } from "@/components/charts/roas-trend-chart";
import { fmtUsd, fmtNum, roasColor, slugToLabel } from "@/lib/formatters";
import { getCampaignStatusCfg, buildTrendData } from "../lib";
import { ClientPortalFooter } from "../components/client-portal-footer";
import { getReportsData } from "./data";
import { requireClientAccess } from "@/features/client-portal/access";
import { DashboardOpsSummarySection } from "@/components/dashboard/dashboard-ops-summary";
import { getReportsWorkflowData } from "@/features/reports/server";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const clientName = slugToLabel(slug);
  return {
    title: `${clientName} Reports`,
    description: `Analytics and reporting for ${clientName}`,
  };
}

export default async function ReportsPage({ params }: Props) {
  const { slug } = await params;
  const { scope } = await requireClientAccess(slug, "meta_ads");
  const clientName = slugToLabel(slug);

  const [{ campaigns, snapshots, events, summary, dataSource }, workflow] = await Promise.all([
    getReportsData(slug, scope),
    getReportsWorkflowData({
      clientSlug: slug,
      limit: 4,
      mode: "client",
      scope,
    }),
  ]);
  const trendData = buildTrendData(snapshots);

  const hasData = campaigns.length > 0;
  const withSpend = [...campaigns]
    .filter((c) => c.spend > 0)
    .sort((a, b) => (b.roas ?? 0) - (a.roas ?? 0));
  const topPerformers = withSpend.filter((c) => c.roas != null).slice(0, 3);

  const maxCpc = Math.max(...withSpend.filter((c) => c.cpc != null).map((c) => c.cpc ?? 0), 0);
  const maxCpm = Math.max(...withSpend.filter((c) => c.cpm != null).map((c) => c.cpm ?? 0), 0);
  const withCpm = withSpend.filter((c) => c.cpm != null);
  const avgCpm = withCpm.length > 0
    ? withCpm.reduce((s, c) => s + (c.cpm ?? 0), 0) / withCpm.length
    : null;

  const bestEvent = events.length > 0
    ? [...events]
        .filter((e) => e.sellThrough != null)
        .sort((a, b) => (b.sellThrough ?? 0) - (a.sellThrough ?? 0))[0] ?? null
    : null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.07] via-violet-500/[0.05] to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-500/[0.08] to-transparent rounded-full blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="h-4 w-4 text-cyan-400/70" />
              <span className="text-xs font-semibold tracking-widest uppercase text-cyan-400">
                Reports & Analytics
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {clientName} Performance
            </h1>
            <p className="text-sm text-white/60 mt-1.5">Last 30 days across all campaigns</p>
          </div>
          <div className="flex items-center gap-2 self-start">
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

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-card hero-stat-card stat-glow p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-cyan-500/10 ring-1 ring-cyan-500/20">
              <DollarSign className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-white/60">
              Total Spend
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tighter leading-none">
            {fmtUsd(summary.totalSpend)}
          </p>
          <p className="text-xs text-white/45 mt-2">last 30 days</p>
        </div>

        <div className="glass-card hero-stat-card stat-glow p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <Target className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-white/60">
              Revenue
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tighter leading-none">
            {fmtUsd(summary.totalRevenue)}
          </p>
          <p className="text-xs text-white/45 mt-2">attributed to campaigns</p>
        </div>

        <div className="glass-card hero-stat-card stat-glow p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-violet-500/10 ring-1 ring-violet-500/20">
              <TrendingUp className="h-3.5 w-3.5 text-violet-400" />
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-white/60">
              Blended ROAS
            </span>
          </div>
          <p className={`text-2xl sm:text-3xl font-extrabold tracking-tighter leading-none ${roasColor(summary.blendedRoas)}`}>
            {summary.blendedRoas != null ? `${summary.blendedRoas.toFixed(1)}x` : "--"}
          </p>
          <p className="text-xs text-white/45 mt-2">return on ad spend</p>
        </div>

        <div className="glass-card hero-stat-card stat-glow p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20">
              <Eye className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-white/60">
              Impressions
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tighter leading-none">
            {fmtNum(summary.totalImpressions)}
          </p>
          <p className="text-xs text-white/45 mt-2">
            {fmtNum(summary.totalClicks)} clicks
          </p>
        </div>
      </div>

      <DashboardOpsSummarySection
        campaignHrefPrefix={`/client/${slug}/campaign`}
        description="Use the same report page to understand both performance trends and the workflow items that need attention."
        emptyState="Your shared campaign workflows look clear right now."
        summary={workflow.opsSummary}
        title="Reporting workflow summary"
        variant="client"
      />

      <DashboardActionCenterSection
        actionCenter={workflow.actionCenter}
        assetHrefPrefix={`/client/${slug}/assets`}
        assetLibraryHref={`/client/${slug}/assets`}
        campaignHrefPrefix={`/client/${slug}/campaign`}
        description="The approvals and shared threads that still need attention in the current reporting window."
        eventHrefPrefix={`/client/${slug}/event`}
        showCrmFollowUps={false}
        variant="client"
      />

      <AgentOutcomesPanel
        assetHrefPrefix={`/client/${slug}/assets`}
        campaignHrefPrefix={`/client/${slug}/campaign`}
        crmHrefPrefix={`/client/${slug}/crm`}
        description="Agent work and recommendations connected to the same campaigns and events behind these results."
        eventHrefPrefix={`/client/${slug}/event`}
        outcomes={workflow.agentOutcomes}
        title="Agent follow-through"
        variant="client"
      />

      <EventOperationsSection
        description="Keep the reporting surface connected to show-level follow-through, open event threads, and ticketing updates."
        hrefPrefix={`/client/${slug}/event`}
        summary={workflow.eventOperations}
        title="Event reporting pressure"
        variant="client"
      />

      {/* Trend Charts */}
      {hasData && trendData.length > 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-3.5 w-3.5 text-white/50" />
              <span className="section-label">Spend Over Time</span>
            </div>
            <SpendTrendChart data={trendData} />
          </div>
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-3.5 w-3.5 text-white/50" />
              <span className="section-label">ROAS Trend</span>
            </div>
            <RoasTrendChart data={trendData} />
          </div>
        </div>
      )}

      {/* Top Performers */}
      {topPerformers.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Top Performers</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {topPerformers.map((c, i) => {
              const medals = ["from-amber-500/20 via-amber-500/5", "from-zinc-400/20 via-zinc-400/5", "from-orange-600/20 via-orange-600/5"];
              const medalColors = ["text-amber-400", "text-zinc-400", "text-orange-500"];
              return (
                <div key={c.campaignId} className="glass-card p-5 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${medals[i]} to-transparent pointer-events-none`} />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-lg font-extrabold ${medalColors[i]}`}>#{i + 1}</span>
                      <span className={`text-sm font-bold tabular-nums ${roasColor(c.roas)}`}>
                        {c.roas != null ? `${c.roas.toFixed(1)}x` : "--"}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white/90 truncate mb-1">{c.name}</p>
                    <div className="flex items-center gap-3 text-xs text-white/50">
                      <span>Spend: {fmtUsd(c.spend)}</span>
                      <span>Rev: {fmtUsd(c.revenue)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Campaign Performance Table */}
      {withSpend.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-white/50" />
              <span className="section-label">Campaign Performance</span>
            </div>
            <span className="text-xs text-white/45">{withSpend.length} campaigns</span>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-xs font-medium text-white/50 uppercase tracking-wider px-4 py-3">
                    Campaign
                  </th>
                  <th className="text-left text-xs font-medium text-white/50 uppercase tracking-wider px-4 py-3">
                    Status
                  </th>
                  <th className="text-right text-xs font-medium text-white/50 uppercase tracking-wider px-4 py-3">
                    Spend
                  </th>
                  <th className="text-right text-xs font-medium text-white/50 uppercase tracking-wider px-4 py-3">
                    Revenue
                  </th>
                  <th className="text-right text-xs font-medium text-white/50 uppercase tracking-wider px-4 py-3">
                    ROAS
                  </th>
                  <th className="text-right text-xs font-medium text-white/50 uppercase tracking-wider px-4 py-3">
                    CTR
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {withSpend.map((c) => {
                  const statusCfg = getCampaignStatusCfg(c.status);
                  return (
                    <tr key={c.campaignId} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-white/90 truncate max-w-[220px]">
                          {c.name}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusCfg.dot}`} />
                          <span className="text-xs text-white/50">{statusCfg.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium tabular-nums text-white/90">
                        {fmtUsd(c.spend)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium tabular-nums text-white/90">
                        {fmtUsd(c.revenue)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm font-semibold tabular-nums ${roasColor(c.roas)}`}>
                          {c.roas != null ? `${c.roas.toFixed(1)}x` : "--"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm tabular-nums text-white/60">
                        {c.ctr != null ? `${c.ctr.toFixed(2)}%` : "--"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile card stack */}
          <div className="md:hidden glass-card divide-y divide-white/[0.04] overflow-hidden">
            {withSpend.map((c) => {
              const statusCfg = getCampaignStatusCfg(c.status);
              return (
                <div key={c.campaignId} className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusCfg.dot}`} />
                    <p className="text-sm font-medium truncate text-white/90">{c.name}</p>
                    <span className={`text-sm font-semibold tabular-nums ml-auto shrink-0 ${roasColor(c.roas)}`}>
                      {c.roas != null ? `${c.roas.toFixed(1)}x` : "--"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-xs text-white/40">Spend</span>
                      <span className="font-medium tabular-nums text-white/80">{fmtUsd(c.spend)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-white/40">Revenue</span>
                      <span className="font-medium tabular-nums text-white/80">{fmtUsd(c.revenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-white/40">CTR</span>
                      <span className="tabular-nums text-white/60">
                        {c.ctr != null ? `${c.ctr.toFixed(2)}%` : "--"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-white/40">Status</span>
                      <span className="text-xs text-white/50">{statusCfg.label}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Cost Efficiency */}
      {withSpend.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Cost Efficiency</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <MousePointerClick className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-xs font-semibold tracking-wider uppercase text-white/60">
                  Avg. Cost Per Click
                </span>
              </div>
              <p className="text-2xl font-extrabold text-white tracking-tighter leading-none mb-3">
                {summary.avgCpc != null ? `$${summary.avgCpc.toFixed(2)}` : "--"}
              </p>
              <div className="space-y-2">
                {withSpend
                  .filter((c) => c.cpc != null)
                  .sort((a, b) => (a.cpc ?? 0) - (b.cpc ?? 0))
                  .slice(0, 5)
                  .map((c) => {
                    const pct = maxCpc > 0 ? ((c.cpc ?? 0) / maxCpc) * 100 : 0;
                    return (
                      <div key={c.campaignId}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-white/60 truncate max-w-[180px]">{c.name}</span>
                          <span className="text-xs font-medium tabular-nums text-white/80">
                            ${(c.cpc ?? 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="progress-track">
                          <div
                            className="gradient-bar h-full"
                            style={{ width: `${Math.max(pct, 4)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="h-3.5 w-3.5 text-violet-400" />
                <span className="text-xs font-semibold tracking-wider uppercase text-white/60">
                  Cost Per 1K Impressions
                </span>
              </div>
              <p className="text-2xl font-extrabold text-white tracking-tighter leading-none mb-3">
                {avgCpm != null ? `$${avgCpm.toFixed(2)}` : "--"}
              </p>
              <div className="space-y-2">
                {withSpend
                  .filter((c) => c.cpm != null)
                  .sort((a, b) => (a.cpm ?? 0) - (b.cpm ?? 0))
                  .slice(0, 5)
                  .map((c) => {
                    const pct = maxCpm > 0 ? ((c.cpm ?? 0) / maxCpm) * 100 : 0;
                    return (
                      <div key={c.campaignId}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-white/60 truncate max-w-[180px]">{c.name}</span>
                          <span className="text-xs font-medium tabular-nums text-white/80">
                            ${(c.cpm ?? 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="progress-track">
                          <div
                            className="gradient-bar h-full"
                            style={{ width: `${Math.max(pct, 4)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Event Metrics */}
      {events.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Ticket className="h-3.5 w-3.5 text-white/50" />
              <span className="section-label">Event Metrics</span>
            </div>
            <span className="text-xs text-white/45">{events.length} events</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="glass-card p-5">
              <span className="text-xs font-semibold tracking-wider uppercase text-white/60">
                Total Tickets Sold
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tighter leading-none mt-2">
                {fmtNum(summary.totalTicketsSold)}
              </p>
              <p className="text-xs text-white/45 mt-2">across all events</p>
            </div>
            {bestEvent && (
              <div className="glass-card p-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.06] to-transparent pointer-events-none" />
                <div className="relative">
                  <span className="text-xs font-semibold tracking-wider uppercase text-white/60">
                    Best Sell-Through
                  </span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tighter leading-none mt-2">
                    {bestEvent.sellThrough}%
                  </p>
                  <p className="text-xs text-white/50 mt-2 truncate">{bestEvent.name}</p>
                  <p className="text-xs text-white/30">{bestEvent.city}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Empty state */}
      {!hasData && (
        <div className="glass-card p-12 text-center">
          <div className="mx-auto h-10 w-10 rounded-full bg-white/[0.06] flex items-center justify-center mb-3">
            <BarChart3 className="h-5 w-5 text-white/40" />
          </div>
          <p className="text-sm text-white/60">No report data available yet</p>
          <p className="text-xs text-white/30 mt-1">Data will appear once campaigns are active</p>
        </div>
      )}

      <ClientPortalFooter dataSource={dataSource} />
    </div>
  );
}
