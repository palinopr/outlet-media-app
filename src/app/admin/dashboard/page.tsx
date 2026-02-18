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
} from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type TmEvent = Database["public"]["Tables"]["tm_events"]["Row"];
type MetaCampaign = Database["public"]["Tables"]["meta_campaigns"]["Row"];

// ─── Mock fallbacks ────────────────────────────────────────────────────────

const MOCK_EVENTS: TmEvent[] = [
  { id: "1", tm_id: "1A2B3C4D5", tm1_number: "1A2B3C4D5", name: "Spring Tour 2026", artist: "Zamora", venue: "Kaseya Center", city: "Miami, FL", date: "2026-03-15", status: "on_sale", tickets_sold: 1247, tickets_available: 253, gross: 187050, url: "", scraped_at: "", created_at: "", updated_at: "" },
  { id: "2", tm_id: "2B3C4D5E6", tm1_number: "2B3C4D5E6", name: "Spring Tour 2026", artist: "Zamora", venue: "United Center", city: "Chicago, IL", date: "2026-04-02", status: "on_sale", tickets_sold: 892, tickets_available: 1108, gross: 133800, url: "", scraped_at: "", created_at: "", updated_at: "" },
  { id: "3", tm_id: "3C4D5E6F7", tm1_number: "3C4D5E6F7", name: "Spring Tour 2026", artist: "Zamora", venue: "Toyota Center", city: "Houston, TX", date: "2026-04-19", status: "on_sale", tickets_sold: 543, tickets_available: 657, gross: 81450, url: "", scraped_at: "", created_at: "", updated_at: "" },
  { id: "4", tm_id: "4D5E6F7G8", tm1_number: "4D5E6F7G8", name: "Spring Tour 2026", artist: "Zamora", venue: "Crypto.com Arena", city: "Los Angeles, CA", date: "2026-05-08", status: "on_sale", tickets_sold: 2100, tickets_available: 1400, gross: 315000, url: "", scraped_at: "", created_at: "", updated_at: "" },
  { id: "5", tm_id: "5E6F7G8H9", tm1_number: "5E6F7G8H9", name: "Spring Tour 2026", artist: "Zamora", venue: "Madison Square Garden", city: "New York, NY", date: "2026-05-22", status: "on_sale", tickets_sold: 3450, tickets_available: 1550, gross: 517500, url: "", scraped_at: "", created_at: "", updated_at: "" },
];

const MOCK_CAMPAIGNS: MetaCampaign[] = [
  { id: "c1", campaign_id: "c1", name: "Zamora Miami - Spring Tour", status: "ACTIVE", objective: "CONVERSIONS", daily_budget: null, lifetime_budget: null, spend: 4200, roas: 5.2, impressions: 1200000, clicks: 28800, reach: 890000, cpm: 3.47, cpc: 0.14, ctr: 0.024, client_slug: "zamora", tm_event_id: null, synced_at: "", created_at: "", updated_at: "" },
  { id: "c2", campaign_id: "c2", name: "Zamora Chicago - Q2 Push", status: "ACTIVE", objective: "CONVERSIONS", daily_budget: null, lifetime_budget: null, spend: 2850, roas: 3.8, impressions: 890000, clicks: 16910, reach: 640000, cpm: 3.19, cpc: 0.17, ctr: 0.019, client_slug: "zamora", tm_event_id: null, synced_at: "", created_at: "", updated_at: "" },
  { id: "c3", campaign_id: "c3", name: "Zamora National - Awareness", status: "ACTIVE", objective: "REACH", daily_budget: null, lifetime_budget: null, spend: 8100, roas: 4.1, impressions: 3420000, clicks: 58140, reach: 2800000, cpm: 2.37, cpc: 0.14, ctr: 0.017, client_slug: "zamora", tm_event_id: null, synced_at: "", created_at: "", updated_at: "" },
];

// ─── Data fetching ─────────────────────────────────────────────────────────

interface AgentLastRun {
  agentId: string;
  status: string;
  finishedAt: string | null;
}

async function getData() {
  if (!supabaseAdmin) {
    return { events: MOCK_EVENTS, campaigns: MOCK_CAMPAIGNS, agentRuns: [], fromDb: false };
  }

  const [eventsRes, campaignsRes, agentRunsRes] = await Promise.all([
    supabaseAdmin.from("tm_events").select("*").order("date", { ascending: true }).limit(10),
    supabaseAdmin.from("meta_campaigns").select("*").eq("status", "ACTIVE").order("spend", { ascending: false }).limit(5),
    // Get the last completed run for each scheduled agent type
    supabaseAdmin
      .from("agent_jobs")
      .select("agent_id, status, finished_at")
      .in("agent_id", ["meta-ads", "tm-monitor"])
      .in("status", ["done", "error"])
      .order("finished_at", { ascending: false })
      .limit(20),
  ]);

  // Events: only show real TM1 data — empty array until TM1 credentials are added
  // Campaigns: fall back to mock only if Supabase is completely empty (first run)
  const events = (eventsRes.data ?? []) as TmEvent[];
  const campaigns = campaignsRes.data?.length ? (campaignsRes.data as MetaCampaign[]) : MOCK_CAMPAIGNS;
  const fromDb = Boolean(campaignsRes.data?.length); // drives the "Live from Supabase" badge

  // Deduplicate to get the most recent run per agent type
  const seen = new Set<string>();
  const agentRuns: AgentLastRun[] = [];
  for (const row of (agentRunsRes.data ?? [])) {
    if (!seen.has(row.agent_id)) {
      seen.add(row.agent_id);
      agentRuns.push({ agentId: row.agent_id, status: row.status, finishedAt: row.finished_at });
    }
  }

  return { events, campaigns, agentRuns, fromDb };
}

// ─── Helpers ───────────────────────────────────────────────────────────────

// Spend from Meta API is stored in cents — divide by 100 for display
function centsToUsd(cents: number | null) { return cents == null ? null : cents / 100; }

function fmt(n: number) { return n.toLocaleString("en-US"); }
function fmtUsd(n: number | null) { return n == null ? "—" : "$" + Math.round(n).toLocaleString("en-US"); }
function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtNum(n: number | null) {
  if (n == null) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return String(n);
}

function statusBadge(s: string) {
  const map: Record<string, { label: string; classes: string }> = {
    on_sale:  { label: "On Sale",  classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    onsale:   { label: "On Sale",  classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    presale:  { label: "Presale",  classes: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    sold_out: { label: "Sold Out", classes: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    cancelled:{ label: "Cancelled",classes: "bg-red-500/10 text-red-400 border-red-500/20" },
  };
  const { label, classes } = map[s] ?? { label: s, classes: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${classes}`}>
      {label}
    </span>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default async function AdminDashboard() {
  const { events, campaigns, agentRuns, fromDb } = await getData();

  const totalSold  = events.reduce((s, e) => s + (e.tickets_sold ?? 0), 0);
  const totalCap   = events.reduce((s, e) => s + (e.tickets_sold ?? 0) + (e.tickets_available ?? 0), 0);
  const totalGross = events.reduce((s, e) => s + (e.gross ?? 0), 0);
  const totalSpend = campaigns.reduce((s, c) => s + (centsToUsd(c.spend) ?? 0), 0);
  const totalRoasRevenue = campaigns.reduce((s, c) => s + (centsToUsd(c.spend) ?? 0) * (c.roas ?? 0), 0);
  const avgRoas = totalSpend > 0 ? totalRoasRevenue / totalSpend : 0;

  const now = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const stats = [
    { label: "Active Shows",       value: String(events.length),          sub: `${totalCap.toLocaleString()} total capacity`, icon: CalendarDays, trend: null },
    { label: "Tickets Sold",       value: fmt(totalSold),                 sub: `of ${fmt(totalCap)} available`, icon: Ticket, trend: null },
    { label: "Total Gross",        value: fmtUsd(totalGross),             sub: "across all shows", icon: DollarSign, trend: null },
    { label: "Active Campaigns",   value: String(campaigns.length),       sub: "Facebook + Instagram", icon: Megaphone, trend: null },
    { label: "Ad Spend",           value: fmtUsd(totalSpend),             sub: "total across campaigns", icon: DollarSign, trend: null },
    { label: "Avg. ROAS",          value: avgRoas > 0 ? avgRoas.toFixed(1) + "×" : "—", sub: "return on ad spend", icon: TrendingUp, trend: null },
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
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
            Live from Supabase
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs gap-1.5 py-1 px-2.5 text-amber-400 border-amber-500/20">
            Mock data
          </Badge>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map(({ label, value, sub, icon: Icon, trend }) => (
          <Card key={label} className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground/60" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
              {trend && (
                <p className="text-xs text-emerald-400 mt-1.5 font-medium">{trend}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Shows table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Active Shows</h2>
          <a href="/admin/events" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            View all →
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
              {events.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-xs text-muted-foreground">
                    No events yet — TM One credentials needed to sync ticket data
                  </TableCell>
                </TableRow>
              )}
              {events.map((e) => {
                const cap = (e.tickets_sold ?? 0) + (e.tickets_available ?? 0);
                const pct = cap > 0 ? Math.round(((e.tickets_sold ?? 0) / cap) * 100) : 0;
                return (
                  <TableRow key={e.id} className="border-border/60">
                    <TableCell className="font-mono text-xs text-muted-foreground">{e.tm1_number || "—"}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{e.artist}</p>
                        <p className="text-xs text-muted-foreground">{e.venue}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{e.city}</TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{fmtDate(e.date)}</TableCell>
                    <TableCell className="text-right">
                      <div>
                        <p className="text-sm font-medium tabular-nums">{fmt(e.tickets_sold ?? 0)}</p>
                        <p className="text-xs text-muted-foreground">{pct}% of {fmt(cap)}</p>
                      </div>
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
        </Card>
      </div>

      {/* Campaigns + Agent status row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Active campaigns */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Active Campaigns</h2>
            <a href="/admin/campaigns" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              View all →
            </a>
          </div>
          <div className="space-y-3">
            {campaigns.map((c) => (
              <Card key={c.id} className="border-border/60">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <p className="text-sm font-medium truncate">{c.name}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{c.objective}</p>
                    </div>
                    <div className="flex gap-6 shrink-0 text-right">
                      <div>
                        <p className="text-xs text-muted-foreground">Spend</p>
                        <p className="text-sm font-medium tabular-nums">{fmtUsd(centsToUsd(c.spend))}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">ROAS</p>
                        <p className="text-sm font-semibold text-emerald-400 tabular-nums">{c.roas != null ? c.roas.toFixed(1) + "×" : "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Impressions</p>
                        <p className="text-sm font-medium tabular-nums">{fmtNum(c.impressions)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">CTR</p>
                        <p className="text-sm font-medium tabular-nums">{c.ctr != null ? (c.ctr * 100).toFixed(1) + "%" : "—"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Agent status */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Agents</h2>
            <a href="/admin/agents" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Manage →
            </a>
          </div>
          <div className="space-y-3">
            {(
              [
                { agentId: "tm-monitor",  label: "TM One Monitor",   icon: Bot      },
                { agentId: "meta-ads",    label: "Meta Ads Manager",  icon: Megaphone },
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
