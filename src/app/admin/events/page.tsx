import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarDays, ExternalLink, Bot, Ticket, DollarSign, TrendingUp, Users } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { getEvents } from "./data";
import { ClientFilter } from "@/components/admin/campaigns/client-filter";
import { matchedCampaigns } from "@/lib/campaign-event-match";
import { Suspense } from "react";
import { fmtDate, fmtUsd, slugToLabel, statusBadge } from "@/lib/formatters";

// ─── Helpers ───────────────────────────────────────────────────────────────

function SellBar({ sold, available }: { sold: number | null; available: number | null }) {
  if (sold == null) return <span className="text-muted-foreground">—</span>;
  if (available == null) {
    return (
      <div className="min-w-[120px]">
        <span className="text-sm font-medium tabular-nums">{sold.toLocaleString()}</span>
        <div className="text-xs text-muted-foreground mt-0.5">tickets sold</div>
      </div>
    );
  }
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

interface Props {
  searchParams: Promise<{ client?: string }>;
}

export default async function EventsPage({ searchParams }: Props) {
  const { client } = await searchParams;
  const clientSlug = client && client !== "all" ? client : null;

  const { events, clients, demoMap, campaigns, fromDb } = await getEvents(clientSlug);

  const totalSold = events.reduce((s, e) => s + (e.tickets_sold ?? 0), 0);
  // Only include events that have capacity data for the sell-through calculation
  const eventsWithCap = events.filter((e) => e.tickets_sold != null && e.tickets_available != null);
  const capSold = eventsWithCap.reduce((s, e) => s + (e.tickets_sold ?? 0), 0);
  const capTotal = eventsWithCap.reduce((s, e) => s + (e.tickets_sold ?? 0) + (e.tickets_available ?? 0), 0);
  const totalGross = events.reduce((s, e) => s + (e.gross ?? 0), 0);
  const avgSellPct = capTotal > 0 ? Math.round((capSold / capTotal) * 100) : 0;
  const totalFans = Object.values(demoMap).reduce((s, d) => s + (d.fans_total ?? 0), 0);

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
              No data
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
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Shows",  value: String(events.length),                       icon: CalendarDays, accent: "from-cyan-500/20 to-blue-500/20",    iconColor: "text-cyan-400" },
          { label: "Tickets Sold", value: totalSold.toLocaleString(),                  icon: Ticket,       accent: "from-violet-500/20 to-purple-500/20", iconColor: "text-violet-400" },
          { label: "Sell-through", value: capTotal > 0 ? `${avgSellPct}%` : "---",    icon: TrendingUp,   accent: "from-emerald-500/20 to-teal-500/20",  iconColor: "text-emerald-400" },
          { label: "Total Gross",  value: fmtUsd(totalGross > 0 ? totalGross : null),  icon: DollarSign,   accent: "from-rose-500/20 to-pink-500/20",     iconColor: "text-rose-400" },
          { label: "Total Fans",   value: totalFans > 0 ? totalFans.toLocaleString() : "---", icon: Users, accent: "from-orange-500/20 to-amber-500/20", iconColor: "text-orange-400" },
        ].map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Table */}
      <Card className="border-border/60">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <p className="text-sm font-semibold">
            {clientSlug ? slugToLabel(clientSlug) : "All clients"}
            <span className="text-muted-foreground font-normal ml-1.5">({events.length})</span>
          </p>
          {clients.length > 0 && (
            <Suspense>
              <ClientFilter clients={clients} selected={clientSlug ?? "all"} />
            </Suspense>
          )}
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground w-28">TM1 #</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Artist / Event</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Client</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Venue</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">City</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Date</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Sell-through</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground text-right">Gross</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Ads</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground text-right">Fans</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12}>
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <CalendarDays className="h-10 w-10 text-muted-foreground/40 mb-3" />
                    <p className="text-sm font-medium mb-1">No events yet</p>
                    <p className="text-xs text-muted-foreground mb-4 max-w-xs">
                      {fromDb
                        ? "No events match this filter"
                        : "Start the agent on your Mac to pull events from the Ticketmaster promoter portal"}
                    </p>
                    {!fromDb && (
                      <code className="text-xs bg-muted px-3 py-2 rounded">cd agent && npm start</code>
                    )}
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
                  <TableCell className="text-xs text-muted-foreground">{slugToLabel(e.client_slug)}</TableCell>
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
                     {(() => {
                       const linked = matchedCampaigns(campaigns, e);
                       const active = linked.filter((c) => c.status === "ACTIVE");
                       if (active.length === 0 && linked.length === 0) {
                         return <span className="text-muted-foreground">—</span>;
                       }
                       if (active.length === 0) {
                         return <span className="text-xs text-muted-foreground">paused</span>;
                       }
                       const avgRoas = active.reduce((s, c) => s + (c.roas ?? 0), 0) / active.length;
                       const totalSpend = active.reduce((s, c) => s + ((c.spend ?? 0) / 100), 0);
                       return (
                         <div>
                           <span className="text-xs font-medium text-emerald-400">{active.length} active</span>
                           <div className="text-xs text-muted-foreground tabular-nums">
                             {avgRoas > 0 ? avgRoas.toFixed(1) + "× · " : ""}
                             ${Math.round(totalSpend / 1000)}K
                           </div>
                         </div>
                       );
                     })()}
                   </TableCell>
                   <TableCell className="text-right">
                     {demoMap[e.tm_id]?.fans_total != null ? (
                       <span className="text-sm tabular-nums font-medium">
                         {(demoMap[e.tm_id].fans_total ?? 0).toLocaleString()}
                       </span>
                     ) : (
                       <span className="text-muted-foreground">—</span>
                     )}
                   </TableCell>
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
