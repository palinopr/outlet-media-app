import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  DollarSign,
  Megaphone,
  Ticket,
  TrendingUp,
  Clock,
  ArrowRight,
} from "lucide-react";
import { RoasTrendChart } from "@/components/charts/roas-trend-chart";
import { TicketVelocityChart } from "@/components/charts/ticket-velocity-chart";
import { centsToUsd, fmtUsd, fmtNum, computeBlendedRoas } from "@/lib/formatters";
import { StatCard } from "@/components/admin/stat-card";
import { AGENT_CONFIG, DASHBOARD_AGENTS } from "@/components/admin/agents/constants";
import { getData } from "./data";
import { EventsPreviewTable } from "./events-preview-table";
import { UpcomingShows } from "./upcoming-shows";
import { CampaignCards } from "./campaign-cards";
import { DashboardOpsSummarySection } from "@/components/dashboard/dashboard-ops-summary";
import { DashboardActionCenterSection } from "@/components/dashboard/dashboard-action-center";
import { getDashboardActionCenter, getDashboardOpsSummary } from "@/features/dashboard/server";
import { AgentOutcomesPanel } from "@/components/agents/agent-outcomes-panel";
import { listAgentOutcomes } from "@/features/agent-outcomes/server";

import { AdminPageHeader } from "@/components/admin/page-header";

// --- Helpers ---

/** Filter events to those occurring in the next 30 days. */
function getUpcomingShows(events: Parameters<typeof EventsPreviewTable>[0]["events"], limit: number) {
  const nowMs = Date.now();
  return events
    .filter(e => {
      if (!e.date) return false;
      const d = new Date(e.date).getTime();
      return d >= nowMs && d <= nowMs + 30 * 86_400_000;
    })
    .slice(0, limit);
}

// --- Page ---

export default async function AdminDashboard() {
  const [
    { events, campaigns, allCampaigns, agentRuns, trendData, velocityData, marginalRoasByCampaign, fromDb },
    opsSummary,
    actionCenter,
    agentOutcomes,
  ] = await Promise.all([
    getData(),
    getDashboardOpsSummary({ mode: "admin", limit: 6 }),
    getDashboardActionCenter({ mode: "admin", limit: 4 }),
    listAgentOutcomes({ audience: "all", limit: 4 }),
  ]);

  const upcomingShows = getUpcomingShows(events, 8);

  const totalSold = events.reduce((s, e) => s + (e.tickets_sold ?? 0), 0);
  const totalCap = events.reduce((s, e) => s + (e.tickets_sold ?? 0) + (e.tickets_available ?? 0), 0);
  const totalGross = events.reduce((s, e) => s + (e.gross ?? 0), 0);
  const totalSpend = campaigns.reduce((s, c) => s + (centsToUsd(c.spend) ?? 0), 0);
  const avgRoas = computeBlendedRoas(campaigns.map(c => ({ spend: c.spend ?? 0, roas: c.roas }))) ?? 0;

  const now = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const heroStats = [
    { label: "Ad Spend", value: fmtUsd(totalSpend), icon: DollarSign, accent: "from-cyan-500/20 to-blue-500/20", iconColor: "text-cyan-400" },
    { label: "Avg. ROAS", value: avgRoas > 0 ? avgRoas.toFixed(1) + "x" : "---", icon: TrendingUp, accent: "from-violet-500/20 to-purple-500/20", iconColor: "text-violet-400" },
    { label: "Active Campaigns", value: String(campaigns.length), icon: Megaphone, accent: "from-emerald-500/20 to-teal-500/20", iconColor: "text-emerald-400" },
  ];

  const secondaryStats = [
    { label: "Active Shows", value: String(events.length), sub: `${fmtNum(totalCap)} capacity`, icon: CalendarDays },
    { label: "Tickets Sold", value: fmtNum(totalSold), sub: `of ${fmtNum(totalCap)}`, icon: Ticket },
    { label: "Total Gross", value: fmtUsd(totalGross), sub: "box office revenue", icon: DollarSign },
  ];

  return (
    <div className="space-y-4 sm:space-y-8">

      {/* Header */}
      <AdminPageHeader title="Dashboard" description={now}>
        {fromDb ? (
          <Badge variant="outline" className="text-xs gap-1.5 py-1 px-2.5 text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            Live
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs gap-1.5 py-1 px-2.5 text-amber-400 border-amber-500/20">
            No live data
          </Badge>
        )}
      </AdminPageHeader>


      {/* Hero stat cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {heroStats.map((s) => (
          <StatCard key={s.label} {...s} size="lg" />
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {secondaryStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <DashboardOpsSummarySection
        campaignHrefPrefix="/admin/campaigns"
        description="Traditional dashboard KPIs are now backed by the same approvals, action items, comments, and activity flowing through campaign operations."
        emptyState="No campaigns need workflow attention right now."
        summary={opsSummary}
        title="Operations snapshot"
        variant="admin"
      />

      <DashboardActionCenterSection
        actionCenter={actionCenter}
        campaignHrefPrefix="/admin/campaigns"
        variant="admin"
      />

      <AgentOutcomesPanel
        canCreateActionItems
        outcomes={agentOutcomes}
        title="Recent agent outcomes"
        description="The latest completed, running, or blocked agent work across campaign operations."
        emptyState="No agent outcomes are available yet."
        variant="admin"
        campaignHrefPrefix="/admin/campaigns"
      />

      {/* Trend charts */}
      {(trendData.length > 0 || velocityData.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {trendData.length > 0 && (
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Blended ROAS Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RoasTrendChart data={trendData} />
              </CardContent>
            </Card>
          )}
          {velocityData.length > 0 && (
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Daily Ticket Sales (All Shows)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TicketVelocityChart data={velocityData} />
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <EventsPreviewTable events={events} />

      <UpcomingShows shows={upcomingShows} allCampaigns={allCampaigns} />

      {/* Campaigns + Agent status row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <CampaignCards campaigns={campaigns} marginalRoasByCampaign={marginalRoasByCampaign} />

        {/* Agent status */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Agents</h2>
            <a href="/admin/agents" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              Manage <ArrowRight className="h-3 w-3" />
            </a>
          </div>
          <div className="space-y-3">
            {DASHBOARD_AGENTS.map((agentId) => {
              const agent = AGENT_CONFIG[agentId];
              const Icon = agent.icon;
              const label = agent.name;
              const run = agentRuns.find((r) => r.agentId === agentId);
              const lastRun = run?.finishedAt
                ? new Date(run.finishedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
                : "Not yet run";
              const statusColor = run?.status === "done" ? "text-emerald-400" : run?.status === "error" ? "text-red-400" : "text-muted-foreground";
              const statusLabel = run?.status === "done" ? "Done" : run?.status === "error" ? "Error" : "Idle";
              return (
                <Card key={agentId} className="border-border/60">
                  <CardContent className="py-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{label}</span>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 text-xs ${statusColor}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${run?.status === "done" ? "bg-emerald-400 animate-pulse"
                            : run?.status === "error" ? "bg-red-400"
                              : run?.status === "running" ? "bg-blue-400 animate-pulse"
                                : "bg-zinc-600"
                          }`} />
                        {statusLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Last run: {lastRun}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
