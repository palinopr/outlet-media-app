import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type TmEvent = Database["public"]["Tables"]["tm_events"]["Row"];
type MetaCampaign = Database["public"]["Tables"]["meta_campaigns"]["Row"];

interface Props {
  params: Promise<{ slug: string }>;
}

// ─── Data fetching ─────────────────────────────────────────────────────────

async function getData(slug: string) {
  if (!supabaseAdmin) {
    return { events: [], campaigns: [], fromDb: false };
  }

  const [eventsRes, campaignsRes] = await Promise.all([
    supabaseAdmin
      .from("tm_events")
      .select("*")
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

// ─── Helpers ──────────────────────────────────────────────────────────────

// Spend from Meta API is stored in cents — divide by 100 for display
function centsToUsd(cents: number | null) { return cents == null ? null : cents / 100; }

function fmt(n: number) { return n.toLocaleString("en-US"); }
function fmtUsd(n: number | null) { return n == null ? "—" : "$" + Math.round(n).toLocaleString("en-US"); }
function fmtNum(n: number | null) {
  if (n == null) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return String(n);
}
function fmtDate(d: string | null) {
  if (!d) return "—";
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

// ─── Page ─────────────────────────────────────────────────────────────────

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

  const stats = [
    { label: "Active Shows",     value: String(events.length),   sub: "Upcoming dates",           icon: CalendarDays },
    { label: "Tickets Sold",     value: fmt(totalSold),          sub: `of ${fmt(totalCapacity)} available`, icon: Ticket },
    { label: "Total Gross",      value: fmtUsd(totalGross),      sub: "across all shows",         icon: DollarSign },
    { label: "Active Campaigns", value: String(campaigns.length),sub: "Facebook + Instagram",     icon: Megaphone },
    { label: "Ad Spend",         value: fmtUsd(totalSpend),      sub: "total across campaigns",   icon: DollarSign },
    { label: "Blended ROAS",     value: blendedRoas ? `${blendedRoas}×` : "—", sub: "return on ad spend", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="border-b border-border/60">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded bg-foreground text-background flex items-center justify-center text-xs font-bold">
              {clientName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">{clientName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Campaign Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {fromDb ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                <span className="text-xs text-muted-foreground">Live · Updated {now}</span>
              </>
            ) : (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block" />
                <span className="text-xs text-muted-foreground">Mock data · {now}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {stats.map(({ label, value, sub, icon: Icon }) => (
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
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Shows */}
        <div>
          <h2 className="text-sm font-semibold mb-3">Your Shows</h2>
          <Card className="border-border/60">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
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
                    <TableRow key={e.id} className="border-border/60">
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {e.tm1_number || "—"}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{e.name}</p>
                          <p className="text-xs text-muted-foreground">{e.venue}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{e.city}</TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {fmtDate(e.date)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
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
          </Card>
        </div>

        {/* Campaigns */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Active Ad Campaigns</h2>
            <a
              href={`/client/${slug}/campaigns`}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View all campaigns →
            </a>
          </div>
          <div className="space-y-3">
            {campaigns.map((c) => (
              <Card key={c.id} className="border-border/60">
                <CardContent className="py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <p className="text-sm font-medium truncate">{c.name}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{c.objective}</p>
                    </div>
                    <div className="flex gap-6 shrink-0 sm:text-right">
                      <div>
                        <p className="text-xs text-muted-foreground">Ad Spend</p>
                        <p className="text-sm font-medium tabular-nums">{fmtUsd(centsToUsd(c.spend))}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                        <p className="text-sm font-medium tabular-nums">
                          {c.spend != null && c.roas != null ? fmtUsd(centsToUsd(c.spend)! * c.roas) : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">ROAS</p>
                        <p className={`text-sm font-semibold tabular-nums ${
                          (c.roas ?? 0) >= 4 ? "text-emerald-400" : (c.roas ?? 0) >= 2 ? "text-amber-400" : "text-red-400"
                        }`}>
                          {c.roas != null ? c.roas.toFixed(1) + "×" : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Impressions</p>
                        <p className="text-sm font-medium tabular-nums">{fmtNum(c.impressions)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">CTR</p>
                        <p className="text-sm font-medium tabular-nums">
                          {c.ctr != null ? (c.ctr * 100).toFixed(1) + "%" : "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/60 pt-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>Powered by Outlet Media</span>
          <span>Data updates every 2 hours via autonomous agent</span>
        </div>

      </div>
    </div>
  );
}
