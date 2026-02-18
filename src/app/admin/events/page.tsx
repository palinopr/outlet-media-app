import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarDays, ExternalLink, Bot, Ticket, DollarSign, TrendingUp } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type TmEventRow = Database["public"]["Tables"]["tm_events"]["Row"];

// ─── Mock data – replaced by Supabase when connected ──────────────────────

const MOCK_EVENTS: TmEventRow[] = [
  { id: "1", tm_id: "1A2B3C4D5", tm1_number: "1A2B3C4D5", name: "Spring Tour 2026", artist: "Zamora", venue: "Kaseya Center", city: "Miami, FL", date: "2026-03-15", status: "on_sale", tickets_sold: 1247, tickets_available: 253, gross: 187050, url: "", scraped_at: "", created_at: "", updated_at: "" },
  { id: "2", tm_id: "2B3C4D5E6", tm1_number: "2B3C4D5E6", name: "Spring Tour 2026", artist: "Zamora", venue: "United Center", city: "Chicago, IL", date: "2026-04-02", status: "on_sale", tickets_sold: 892, tickets_available: 1108, gross: 133800, url: "", scraped_at: "", created_at: "", updated_at: "" },
  { id: "3", tm_id: "3C4D5E6F7", tm1_number: "3C4D5E6F7", name: "Spring Tour 2026", artist: "Zamora", venue: "Toyota Center", city: "Houston, TX", date: "2026-04-19", status: "on_sale", tickets_sold: 543, tickets_available: 657, gross: 81450, url: "", scraped_at: "", created_at: "", updated_at: "" },
  { id: "4", tm_id: "4D5E6F7G8", tm1_number: "4D5E6F7G8", name: "Spring Tour 2026", artist: "Zamora", venue: "Crypto.com Arena", city: "Los Angeles, CA", date: "2026-05-08", status: "on_sale", tickets_sold: 2100, tickets_available: 1400, gross: 315000, url: "", scraped_at: "", created_at: "", updated_at: "" },
  { id: "5", tm_id: "5E6F7G8H9", tm1_number: "5E6F7G8H9", name: "Spring Tour 2026", artist: "Zamora", venue: "Madison Square Garden", city: "New York, NY", date: "2026-05-22", status: "on_sale", tickets_sold: 3450, tickets_available: 1550, gross: 517500, url: "", scraped_at: "", created_at: "", updated_at: "" },
  { id: "6", tm_id: "6F7G8H9I0", tm1_number: "6F7G8H9I0", name: "Spring Tour 2026", artist: "Zamora", venue: "American Airlines Center", city: "Dallas, TX", date: "2026-06-05", status: "on_sale", tickets_sold: 688, tickets_available: 1512, gross: 103200, url: "", scraped_at: "", created_at: "", updated_at: "" },
  { id: "7", tm_id: "7G8H9I0J1", tm1_number: "7G8H9I0J1", name: "Spring Tour 2026", artist: "Zamora", venue: "Chase Center", city: "San Francisco, CA", date: "2026-06-20", status: "presale", tickets_sold: 312, tickets_available: 2188, gross: 46800, url: "", scraped_at: "", created_at: "", updated_at: "" },
  { id: "8", tm_id: "8H9I0J1K2", tm1_number: "8H9I0J1K2", name: "Spring Tour 2026", artist: "Zamora", venue: "Ball Arena", city: "Denver, CO", date: "2026-07-04", status: "presale", tickets_sold: 124, tickets_available: 1876, gross: 18600, url: "", scraped_at: "", created_at: "", updated_at: "" },
];

// ─── Data fetching ─────────────────────────────────────────────────────────

async function getEvents(): Promise<{ events: TmEventRow[]; fromDb: boolean }> {
  if (!supabaseAdmin) return { events: MOCK_EVENTS, fromDb: false };

  const { data, error } = await supabaseAdmin
    .from("tm_events")
    .select("*")
    .order("date", { ascending: true })
    .limit(200);

  if (error) return { events: [], fromDb: false };
  return { events: (data ?? []) as TmEventRow[], fromDb: data.length > 0 };
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmtUsd(n: number | null) {
  if (n == null) return "—";
  return "$" + n.toLocaleString("en-US");
}

function statusBadge(s: string) {
  const map: Record<string, { label: string; classes: string }> = {
    on_sale:  { label: "On Sale",  classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    onsale:   { label: "On Sale",  classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    presale:  { label: "Presale",  classes: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    sold_out: { label: "Sold Out", classes: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    offsale:  { label: "Off Sale", classes: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
    cancelled:{ label: "Cancelled",classes: "bg-red-500/10 text-red-400 border-red-500/20" },
  };
  const { label, classes } = map[s] ?? { label: s, classes: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${classes}`}>
      {label}
    </span>
  );
}

function SellBar({ sold, available }: { sold: number | null; available: number | null }) {
  if (sold == null || available == null) return <span className="text-muted-foreground">—</span>;
  const capacity = sold + available;
  const pct = Math.round((sold / capacity) * 100);
  const barColor = pct >= 90 ? "bg-purple-500" : pct >= 60 ? "bg-emerald-500" : pct >= 30 ? "bg-blue-500" : "bg-zinc-600";
  return (
    <div className="min-w-[120px]">
      <div className="flex justify-between text-xs mb-1">
        <span className="font-medium tabular-nums">{sold.toLocaleString()}</span>
        <span className="text-muted-foreground tabular-nums">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="text-xs text-muted-foreground mt-1 tabular-nums">
        of {capacity.toLocaleString()}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default async function EventsPage() {
  const { events, fromDb } = await getEvents();

  const totalSold = events.reduce((s, e) => s + (e.tickets_sold ?? 0), 0);
  const totalCap  = events.reduce((s, e) => s + (e.tickets_sold ?? 0) + (e.tickets_available ?? 0), 0);
  const totalGross = events.reduce((s, e) => s + (e.gross ?? 0), 0);
  const avgSellPct = totalCap > 0 ? Math.round((totalSold / totalCap) * 100) : 0;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Events</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Synced from Ticketmaster One promoter portal
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!fromDb && (
            <span className="text-xs text-amber-400 border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 rounded">
              Mock data
            </span>
          )}
          {fromDb && (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 rounded">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live from Supabase
            </span>
          )}
          <Button size="sm" variant="outline" className="gap-2 h-8 text-xs" asChild>
            <a href="/admin/agents">
              <Bot className="h-3.5 w-3.5" />
              Run Agent
            </a>
          </Button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Shows", value: String(events.length), icon: CalendarDays },
          { label: "Tickets Sold", value: totalSold.toLocaleString(), icon: Ticket },
          { label: "Sell-through", value: `${avgSellPct}%`, icon: TrendingUp },
          { label: "Total Gross", value: fmtUsd(totalGross), icon: DollarSign },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="border-border/60">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                <Icon className="h-4 w-4 text-muted-foreground/60" />
              </div>
              <p className="text-2xl font-bold tracking-tight">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="border-border/60">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground w-28">TM1 #</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Artist / Event</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Venue</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">City</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Date</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Sell-through</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground text-right">Gross</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <CalendarDays className="h-10 w-10 text-muted-foreground/40 mb-3" />
                    <p className="text-sm font-medium mb-1">No events yet</p>
                    <p className="text-xs text-muted-foreground mb-4 max-w-xs">
                      Start the agent on your Mac to pull events from the Ticketmaster promoter portal
                    </p>
                    <code className="text-xs bg-muted px-3 py-2 rounded">cd agent && npm start</code>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              events.map((e) => (
                <TableRow key={e.id} className="border-border/60">
                  <TableCell className="font-mono text-xs text-muted-foreground">{e.tm1_number || "—"}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{e.artist}</p>
                      <p className="text-xs text-muted-foreground">{e.name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{e.venue}</TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{e.city}</TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{fmtDate(e.date)}</TableCell>
                  <TableCell>
                    <SellBar sold={e.tickets_sold} available={e.tickets_available} />
                  </TableCell>
                  <TableCell className="text-right">
                    <p className="text-sm font-medium tabular-nums">{fmtUsd(e.gross)}</p>
                  </TableCell>
                  <TableCell>{statusBadge(e.status)}</TableCell>
                  <TableCell>
                    {e.url ? (
                      <a href={e.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

    </div>
  );
}
