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
  Zap,
  Bot,
  Clock,
  AlertTriangle,
  Info,
  ArrowRight,
} from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
import { RoasTrendChart } from "@/components/charts/roas-trend-chart";

type TmEvent = Database["public"]["Tables"]["tm_events"]["Row"];
type MetaCampaign = Database["public"]["Tables"]["meta_campaigns"]["Row"];

interface AgentLastRun { agentId: string; status: string; finishedAt: string | null; }
interface Alert { id: string; message: string; level: string; created_at: string; }
interface SnapshotRow { snapshot_date: string; roas: number | null; spend: number | null; }

// --- Data fetching ---

async function getData() {
  if (!supabaseAdmin) {
    return { events: [], campaigns: [], agentRuns: [], alerts: [], trendData: [], fromDb: false };
  }

  const [eventsRes, campaignsRes, agentRunsRes, alertsRes, snapshotsRes] = await Promise.all([
    supabaseAdmin.from("tm_events").select("*").order("date", { ascending: true }).limit(10),
    supabaseAdmin.from("meta_campaigns").select("*").eq("status", "ACTIVE").order("spend", { ascending: false }).limit(5),
    supabaseAdmin
      .from("agent_jobs")
      .select("agent_id, status, finished_at")
      .in("agent_id", ["meta-ads", "tm-monitor", "campaign-monitor"])
      .in("status", ["done", "error"])
      .order("finished_at", { ascending: false })
      .limit(20),
    supabaseAdmin
      .from("agent_alerts")
      .select("id, message, level, created_at")
      .is("read_at", null)
      .order("created_at", { ascending: false })
      .limit(5),
    supabaseAdmin
      .from("campaign_snapshots")
      .select("snapshot_date, roas, spend")
      .order("snapshot_date", { ascending: true })
      .limit(300),
  ]);

  const events = (eventsRes.data ?? []) as TmEvent[];
  const campaigns = (campaignsRes.data ?? []) as MetaCampaign[];
  const alerts = (alertsRes.data ?? []) as Alert[];
  const snapshots = (snapshotsRes.data ?? []) as SnapshotRow[];

  const seen = new Set<string>();
  const agentRuns: AgentLastRun[] = [];
  for (const row of (agentRunsRes.data ?? [])) {
    if (!seen.has(row.agent_id)) {
      seen.add(row.agent_id);
      agentRuns.push({ agentId: row.agent_id, status: row.status, finishedAt: row.finished_at });
    }
  }

  const byDate: Record<string, { roasSum: number; roasCount: number; spendSum: number }> = {};
  for (const s of snapshots) {
    const d = s.snapshot_date;
    if (!byDate[d]) byDate[d] = { roasSum: 0, roasCount: 0, spendSum: 0 };
    if (s.roas != null) { byDate[d].roasSum += s.roas; byDate[d].roasCount++; }
    if (s.spend != null) byDate[d].spendSum += s.spend / 100;
  }
  const trendData = Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      roas: v.roasCount > 0 ? v.roasSum / v.roasCount : 0,
      spend: v.spendSum,
    }));

  return { events, campaigns, agentRuns, alerts, trendData, fromDb: Boolean(campaigns.length) };
}

// --- Helpers ---

function centsToUsd(cents: number | null) { return cents == null ? null : cents / 100; }
function fmt(n: number) { return n.toLocaleString("en-US"); }
function fmtUsd(n: number | null) { return n == null ? "---" : "$" + Math.round(n).toLocaleString("en-US"); }
function fmtObjective(raw: string | null) {
  if (!raw) return null;
  return raw.replace(/^OUTCOME_/, "").replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
function fmtDate(d: string | null) {
  if (!d) return "---";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtNum(n: number | null) {
  if (n == null) return "---";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return String(n);
}

function eventStatusBadge(s: string) {
  const map: Record<string, { label: string; classes: string }> = {
    on_sale:   { label: "On Sale",   classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    onsale:    { label: "On Sale",   classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    presale:   { label: "Presale",   classes: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    sold_out:  { label: "Sold Out",  classes: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    cancelled: { label: "Cancelled", classes: "bg-red-500/10 text-red-400 border-red-500/20" },
  };
  const { label, classes } = map[s] ?? { label: s, classes: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${classes}`}>
      {label}
    </span>
  );
}

// --- Page ---

export default async function AdminDashboard() {
  const { events, campaigns, agentRuns, alerts, trendData, fromDb } = await getData();

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
    { label: "Active Shows",  value: String(events.length),  sub: `${fmt(totalCap)} capacity`, icon: CalendarDays },
    { label: "Tickets Sold",  value: fmt(totalSold),         sub: `of ${fmt(totalCap)}`,       icon: Ticket },
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
        {heroStats.map(({ label, value, icon: Icon, accent, iconColor }) => (
          <div key={label} className="relative overflow-hidden rounded-xl border border-border/60 bg-card p-5">
            <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-50`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                <div className={`h-8 w-8 rounded-lg bg-white/[0.06] flex items-center justify-center ${iconColor}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-3 gap-4">
        {secondaryStats.map(({ label, value, sub, icon: Icon }) => (
          <Card key={label} className="border-border/60">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                <Icon className="h-3.5 w-3.5 text-muted-foreground/40" />
              </div>
              <p className="text-xl font-bold tracking-tight">{value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ROAS trend chart */}
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

      {/* Shows table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Active Shows</h2>
          <a href="/admin/events" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </a>
        </div>
        <Card className="border-border/60">
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
              {events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <CalendarDays className="h-8 w-8 text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground">No events yet</p>
                      <p className="text-xs text-muted-foreground/60">TM One credentials needed to sync ticket data</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : events.map((e) => {
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
                      <p className="text-sm font-medium tabular-nums">{fmt(e.tickets_sold ?? 0)}</p>
                      <p className="text-xs text-muted-foreground">{pct}% of {fmt(cap)}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <p className="text-sm font-medium tabular-nums">{fmtUsd(e.gross)}</p>
                    </TableCell>
                    <TableCell>{eventStatusBadge(e.status)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>

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
                      <div className="flex gap-6 shrink-0 text-right">
                        <div>
                          <p className="text-[11px] text-muted-foreground">Spend</p>
                          <p className="text-sm font-medium tabular-nums">{fmtUsd(centsToUsd(c.spend))}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-muted-foreground">ROAS</p>
                          <p className={`text-sm font-semibold tabular-nums ${(c.roas ?? 0) >= 4 ? "text-emerald-400" : (c.roas ?? 0) >= 2 ? "text-amber-400" : "text-red-400"}`}>
                            {c.roas != null ? c.roas.toFixed(1) + "x" : "---"}
                          </p>
                        </div>
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
            {(
              [
                { agentId: "tm-monitor",       label: "TM One Monitor",   icon: Bot      },
                { agentId: "meta-ads",          label: "Meta Ads Manager", icon: Megaphone },
                { agentId: "campaign-monitor",  label: "Campaign Monitor", icon: TrendingUp },
              ] as const
            ).map(({ agentId, label, icon: Icon }) => {
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
                      <span className={`inline-flex items-center gap-1 text-xs ${statusColor}`}>
                        <Zap className="h-3 w-3" />
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
