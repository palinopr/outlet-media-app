import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarDays,
  DollarSign,
  Megaphone,
  Ticket,
  TrendingUp,
  Clock,
  AlertTriangle,
  Info,
  ArrowRight,
} from "lucide-react";
import { RoasTrendChart } from "@/components/charts/roas-trend-chart";
import { TicketVelocityChart } from "@/components/charts/ticket-velocity-chart";
import { matchedCampaigns } from "@/lib/campaign-event-match";
import { centsToUsd, fmtUsd, fmtDate, fmtNum, statusBadge, fmtObjective, computeMarginalRoas, roasColor } from "@/lib/formatters";
import { StatCard } from "@/components/admin/stat-card";
import { AGENT_CONFIG, DASHBOARD_AGENTS } from "@/components/admin/agents/constants";
import { getData, type TmEvent } from "./data";

// --- Helpers ---

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / 86_400_000);
}

/** Filter events to those occurring in the next 30 days. */
function getUpcomingShows(events: TmEvent[], limit: number) {
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
  const { events, campaigns, allCampaigns, agentRuns, alerts, trendData, velocityData, snapshotsByCampaign, fromDb } = await getData();

  // Upcoming shows: next 30 days, sorted by date
  const upcomingShows = getUpcomingShows(events, 8);

  const totalSold  = events.reduce((s, e) => s + (e.tickets_sold ?? 0), 0);
  const totalCap   = events.reduce((s, e) => s + (e.tickets_sold ?? 0) + (e.tickets_available ?? 0), 0);
  const totalGross = events.reduce((s, e) => s + (e.gross ?? 0), 0);
  const totalSpend = campaigns.reduce((s, c) => s + (centsToUsd(c.spend) ?? 0), 0);
  const totalRevenue = campaigns.reduce((s, c) => s + (centsToUsd(c.spend) ?? 0) * (c.roas ?? 0), 0);
  const avgRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

  const now = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  // Featured metrics (top row with accent styling)
  const heroStats = [
    { label: "Ad Spend",         value: fmtUsd(totalSpend),       icon: DollarSign,  accent: "from-cyan-500/20 to-blue-500/20", iconColor: "text-cyan-400" },
    { label: "Avg. ROAS",        value: avgRoas > 0 ? avgRoas.toFixed(1) + "x" : "---", icon: TrendingUp, accent: "from-violet-500/20 to-purple-500/20", iconColor: "text-violet-400" },
    { label: "Active Campaigns", value: String(campaigns.length), icon: Megaphone,   accent: "from-emerald-500/20 to-teal-500/20", iconColor: "text-emerald-400" },
  ];

  const secondaryStats = [
    { label: "Active Shows",  value: String(events.length),  sub: `${fmtNum(totalCap)} capacity`, icon: CalendarDays },
    { label: "Tickets Sold",  value: fmtNum(totalSold),      sub: `of ${fmtNum(totalCap)}`,       icon: Ticket },
    { label: "Total Gross",   value: fmtUsd(totalGross),     sub: "box office revenue",        icon: DollarSign },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">{now}</p>
        </div>
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
      </div>

      {/* Agent alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((a) => {
            const isCritical = a.level === "critical";
            const isWarning  = a.level === "warning";
            const Icon = isCritical || isWarning ? AlertTriangle : Info;
            const classes = isCritical
              ? "border-red-500/30 bg-red-500/5 text-red-400"
              : isWarning
              ? "border-amber-500/30 bg-amber-500/5 text-amber-400"
              : "border-blue-500/30 bg-blue-500/5 text-blue-400";
            return (
              <div key={a.id} className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${classes}`}>
                <Icon className="h-4 w-4 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed">{a.message}</p>
                <span className="ml-auto text-xs opacity-60 whitespace-nowrap shrink-0">
                  {new Date(a.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                </span>
              </div>
            );
          })}
        </div>
      )}

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

      {/* Shows table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Active Shows</h2>
          <a href="/admin/events" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </a>
        </div>
        <Card className="border-border/60">
          {events.length === 0 ? (
            <div className="py-12 text-center">
              <div className="flex flex-col items-center gap-2">
                <CalendarDays className="h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No events yet</p>
                <p className="text-xs text-muted-foreground/60">TM One credentials needed to sync ticket data</p>
              </div>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/60 hover:bg-transparent">
                      <TableHead className="text-xs font-medium text-muted-foreground w-28">TM1 #</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Event</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">City</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Date</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground text-right">Sold</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground text-right">Gross</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.slice(0, 10).map((e) => {
                      const cap = (e.tickets_sold ?? 0) + (e.tickets_available ?? 0);
                      const pct = cap > 0 ? Math.round(((e.tickets_sold ?? 0) / cap) * 100) : 0;
                      return (
                        <TableRow key={e.id} className="border-border/60">
                          <TableCell className="font-mono text-xs text-muted-foreground">{e.tm1_number || "---"}</TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm font-medium">{e.artist}</p>
                              <p className="text-xs text-muted-foreground">{e.venue}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{e.city}</TableCell>
                          <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{fmtDate(e.date)}</TableCell>
                          <TableCell className="text-right">
                            <p className="text-sm font-medium tabular-nums">{fmtNum(e.tickets_sold ?? 0)}</p>
                            <p className="text-xs text-muted-foreground">{pct}% of {fmtNum(cap)}</p>
                          </TableCell>
                          <TableCell className="text-right">
                            <p className="text-sm font-medium tabular-nums">{fmtUsd(e.gross)}</p>
                          </TableCell>
                          <TableCell>{statusBadge(e.status)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="md:hidden divide-y divide-border/40">
                {events.slice(0, 10).map((e) => {
                  const cap = (e.tickets_sold ?? 0) + (e.tickets_available ?? 0);
                  const pct = cap > 0 ? Math.round(((e.tickets_sold ?? 0) / cap) * 100) : 0;
                  return (
                    <div key={e.id} className="px-4 py-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{e.artist}</p>
                          <p className="text-xs text-muted-foreground truncate">{e.venue} -- {e.city}</p>
                        </div>
                        {statusBadge(e.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <div>
                          <p className="text-muted-foreground">Date</p>
                          <p className="font-medium">{fmtDate(e.date)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Sold</p>
                          <p className="font-medium tabular-nums">{fmtNum(e.tickets_sold ?? 0)} <span className="text-muted-foreground">({pct}%)</span></p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Gross</p>
                          <p className="font-medium tabular-nums">{fmtUsd(e.gross)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Upcoming Shows countdown */}
      {upcomingShows.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Upcoming Shows</h2>
            <a href="/admin/events" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {upcomingShows.map((e) => {
              const days = daysUntil(e.date);
              const linked = matchedCampaigns(allCampaigns, e);
              const hasActive = linked.some(c => c.status === "ACTIVE");
              const hasPaused = linked.some(c => c.status === "PAUSED");
              const urgent = days != null && days <= 7 && !hasActive;
              const borderColor = urgent ? "border-red-500/40" : "border-border/60";
              const bgColor = urgent ? "bg-red-500/5" : "bg-card";
              return (
                <div key={e.id} className={`rounded-xl border ${borderColor} ${bgColor} p-4`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{e.artist}</p>
                      <p className="text-xs text-muted-foreground truncate">{e.city}</p>
                    </div>
                    {days != null && (
                      <span className={`text-xs font-semibold tabular-nums shrink-0 px-1.5 py-0.5 rounded ${
                        days <= 3 ? "bg-red-500/15 text-red-400" :
                        days <= 7 ? "bg-amber-500/15 text-amber-400" :
                        "bg-zinc-500/10 text-zinc-400"
                      }`}>
                        {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days}d`}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{fmtDate(e.date)}</p>
                  {hasActive ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Campaign active
                    </span>
                  ) : hasPaused ? (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-400">
                      <AlertTriangle className="h-3 w-3" />
                      Campaign paused
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">No campaign</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Campaigns + Agent status row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Active campaigns */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Active Campaigns</h2>
            <a href="/admin/campaigns" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </a>
          </div>
          {campaigns.length === 0 ? (
            <Card className="border-border/60 border-dashed">
              <CardContent className="py-12 text-center">
                <Megaphone className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No active campaigns</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Run the Meta sync agent to pull live data</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {campaigns.map((c) => (
                <Card key={c.id} className="border-border/60 hover:border-border transition-colors">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                          <p className="text-sm font-medium truncate">{c.name}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{fmtObjective(c.objective)}</p>
                      </div>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 shrink-0 text-right">
                        <div>
                          <p className="text-[11px] text-muted-foreground">Spend</p>
                          <p className="text-sm font-medium tabular-nums">{fmtUsd(centsToUsd(c.spend))}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-muted-foreground">ROAS</p>
                          <p className={`text-sm font-semibold tabular-nums ${roasColor(c.roas)}`}>
                            {c.roas != null ? c.roas.toFixed(1) + "x" : "---"}
                          </p>
                        </div>
                        {(() => {
                          const m = computeMarginalRoas(snapshotsByCampaign[c.campaign_id] ?? []);
                          if (m == null) return null;
                          const color = m >= 2 ? "text-emerald-400" : m >= 1 ? "text-blue-400" : "text-red-400";
                          return (
                            <div>
                              <p className="text-[11px] text-muted-foreground">Marginal</p>
                              <p className={`text-sm font-semibold tabular-nums ${color}`}>{m.toFixed(1)}×</p>
                            </div>
                          );
                        })()}
                        <div>
                          <p className="text-[11px] text-muted-foreground">Impressions</p>
                          <p className="text-sm font-medium tabular-nums">{fmtNum(c.impressions)}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-muted-foreground">CTR</p>
                          <p className="text-sm font-medium tabular-nums">{c.ctr != null ? c.ctr.toFixed(2) + "%" : "---"}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

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
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          run?.status === "done" ? "bg-emerald-400 animate-pulse"
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

