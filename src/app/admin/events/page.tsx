import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Bot, Ticket, DollarSign, TrendingUp, Users } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { getEvents } from "./data";
import { ClientFilter } from "@/components/admin/campaigns/client-filter";
import { EventTable } from "@/components/admin/events/event-table";
import { Suspense } from "react";
import { fmtUsd, slugToLabel } from "@/lib/formatters";

// ---- Page ----

interface Props {
  searchParams: Promise<{ client?: string }>;
}

export default async function EventsPage({ searchParams }: Props) {
  const { client } = await searchParams;
  const clientSlug = client && client !== "all" ? client : null;

  const { events, clients, demoMap, campaigns, fromDb } = await getEvents(clientSlug);

  const totalSold = events.reduce((s, e) => s + (e.tickets_sold ?? 0), 0);
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
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4 pb-2">
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
        <EventTable
          events={events}
          clients={clients}
          demoMap={demoMap}
          campaigns={campaigns}
          fromDb={fromDb}
        />
      </Card>

    </div>
  );
}
