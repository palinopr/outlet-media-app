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
  ArrowRight,
} from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type TmEvent = Database["public"]["Tables"]["tm_events"]["Row"];
type MetaCampaign = Database["public"]["Tables"]["meta_campaigns"]["Row"];

interface Props {
  params: Promise<{ slug: string }>;
}

// --- Data fetching ---

async function getData(slug: string) {
  if (!supabaseAdmin) {
    return { events: [], campaigns: [], fromDb: false };
  }

  const [eventsRes, campaignsRes] = await Promise.all([
    supabaseAdmin
      .from("tm_events")
      .select("*")
      .eq("client_slug", slug)
      .order("date", { ascending: true })
      .limit(50),
    supabaseAdmin
      .from("meta_campaigns")
      .select("*")
      .eq("client_slug", slug)
      .order("spend", { ascending: false })
      .limit(20),
  ]);

  const events = (eventsRes.data ?? []) as TmEvent[];
  const campaigns = (campaignsRes.data ?? []) as MetaCampaign[];
  const fromDb = Boolean(campaignsRes.data?.length);

  return { events, campaigns, fromDb };
}

// --- Helpers ---

function centsToUsd(cents: number | null) { return cents == null ? null : cents / 100; }
function fmtObjective(raw: string | null) {
  if (!raw) return null;
  return raw.replace(/^OUTCOME_/, "").replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
function fmt(n: number) { return n.toLocaleString("en-US"); }
function fmtUsd(n: number | null) { return n == null ? "--" : "$" + Math.round(n).toLocaleString("en-US"); }
function fmtNum(n: number | null) {
  if (n == null) return "--";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return String(n);
}
function fmtDate(d: string | null) {
  if (!d) return "--";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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

// --- Page ---

export default async function ClientDashboard({ params }: Props) {
  const { slug } = await params;
  const { events, campaigns, fromDb } = await getData(slug);

  const totalSold     = events.reduce((a, s) => a + (s.tickets_sold ?? 0), 0);
  const totalCapacity = events.reduce((a, s) => a + (s.tickets_sold ?? 0) + (s.tickets_available ?? 0), 0);
  const totalGross    = events.reduce((a, s) => a + (s.gross ?? 0), 0);
  const totalSpend    = campaigns.reduce((a, c) => a + (centsToUsd(c.spend) ?? 0), 0);
  const totalRevenue  = campaigns.reduce((a, c) => a + (centsToUsd(c.spend) ?? 0) * (c.roas ?? 0), 0);
  const blendedRoas   = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(1) : null;

  const clientName = slug.charAt(0).toUpperCase() + slug.slice(1);

  const now = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const heroStats = [
    {
      label: "Tickets Sold",
      value: fmt(totalSold),
      sub: `of ${fmt(totalCapacity)} available`,
      icon: Ticket,
      gradient: "from-cyan-500/20 via-cyan-500/5 to-transparent",
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-400",
    },
    {
      label: "Total Gross",
      value: fmtUsd(totalGross),
      sub: "across all shows",
      icon: DollarSign,
      gradient: "from-violet-500/20 via-violet-500/5 to-transparent",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-400",
    },
    {
      label: "Blended ROAS",
      value: blendedRoas ? `${blendedRoas}x` : "--",
      sub: "return on ad spend",
      icon: TrendingUp,
      gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
    },
  ];

  const secondaryStats = [
    { label: "Active Shows", value: String(events.length), icon: CalendarDays },
    { label: "Active Campaigns", value: String(campaigns.length), icon: Megaphone },
    { label: "Ad Spend", value: fmtUsd(totalSpend), icon: DollarSign },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{clientName} Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">{now}</p>
        </div>
        <div className="flex items-center gap-2">
          {fromDb ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              <span className="text-xs text-muted-foreground">Live data</span>
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block" />
              <span className="text-xs text-muted-foreground">No data yet</span>
            </>
          )}
        </div>
      </div>

      {/* Hero stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        {heroStats.map(({ label, value, sub, icon: Icon, gradient, iconBg, iconColor }) => (
          <div key={label} className="relative overflow-hidden rounded-xl border border-border/60 bg-card p-5">
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

      {/* Secondary stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {secondaryStats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-lg border border-border/40 bg-card/50 p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-semibold">{value}</p>
              <p className="text-[11px] text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Shows table */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold mb-3">Your Shows</h2>
        {events.length === 0 ? (
          <div className="rounded-xl border border-border/60 bg-card p-12 text-center">
            <div className="mx-auto h-10 w-10 rounded-full bg-white/[0.06] flex items-center justify-center mb-3">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No shows synced yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Event data syncs from Ticketmaster automatically</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40 hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-muted-foreground w-28">TM1 #</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Event / Venue</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">City</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Date</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Sell-Through</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground text-right">Gross</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((e) => {
                  const cap = (e.tickets_sold ?? 0) + (e.tickets_available ?? 0);
                  const pct = cap > 0 ? Math.round(((e.tickets_sold ?? 0) / cap) * 100) : 0;
                  const barColor = pct >= 90 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-zinc-500";
                  return (
                    <TableRow key={e.id} className="border-border/40">
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {e.tm1_number || "--"}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium">{e.name}</p>
                        <p className="text-xs text-muted-foreground">{e.venue}</p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{e.city}</TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {fmtDate(e.date)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                            <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">{pct}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {fmt(e.tickets_sold ?? 0)} / {fmt(cap)}
                        </p>
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium tabular-nums">
                        {fmtUsd(e.gross)}
                      </TableCell>
                      <TableCell>{statusBadge(e.status)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Campaigns */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Active Ad Campaigns</h2>
          <a
            href={`/client/${slug}/campaigns`}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {campaigns.length > 5 ? `View all ${campaigns.length}` : "View all"} <ArrowRight className="h-3 w-3" />
          </a>
        </div>
        {campaigns.length === 0 ? (
          <div className="rounded-xl border border-border/60 bg-card p-12 text-center">
            <div className="mx-auto h-10 w-10 rounded-full bg-white/[0.06] flex items-center justify-center mb-3">
              <Megaphone className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No campaigns yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Campaign data syncs automatically every 6 hours</p>
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.slice(0, 5).map((c) => (
              <div key={c.id} className="rounded-xl border border-border/60 bg-card p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                        c.status === "ACTIVE" || c.status === "active" ? "bg-emerald-400" : "bg-amber-400"
                      }`} />
                      <p className="text-sm font-medium truncate">{c.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{fmtObjective(c.objective)}</p>
                  </div>
                  <div className="flex gap-6 shrink-0 sm:text-right">
                    <div>
                      <p className="text-xs text-muted-foreground">Ad Spend</p>
                      <p className="text-sm font-medium tabular-nums">{fmtUsd(centsToUsd(c.spend))}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="text-sm font-medium tabular-nums">
                        {c.spend != null && c.roas != null ? fmtUsd(centsToUsd(c.spend)! * c.roas) : "--"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">ROAS</p>
                      <p className={`text-sm font-semibold tabular-nums ${
                        (c.roas ?? 0) >= 4 ? "text-emerald-400" : (c.roas ?? 0) >= 2 ? "text-amber-400" : "text-red-400"
                      }`}>
                        {c.roas != null ? c.roas.toFixed(1) + "x" : "--"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Impressions</p>
                      <p className="text-sm font-medium tabular-nums">{fmtNum(c.impressions)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">CTR</p>
                      <p className="text-sm font-medium tabular-nums">
                        {c.ctr != null ? c.ctr.toFixed(2) + "%" : "--"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border/40 pt-6 flex items-center justify-between text-xs text-muted-foreground">
        <span>Powered by Outlet Media</span>
        <span>Data updates every 2 hours via autonomous agent</span>
      </div>
    </>
  );
}
