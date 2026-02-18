import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarDays, ExternalLink, RefreshCw } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type TmEventRow = Database["public"]["Tables"]["tm_events"]["Row"];

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  onsale: "default",
  presale: "secondary",
  offsale: "outline",
  cancelled: "destructive",
};

async function getEvents(): Promise<TmEventRow[]> {
  if (!supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from("tm_events")
    .select("*")
    .order("date", { ascending: true })
    .limit(100);

  if (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }

  return (data as TmEventRow[]) ?? [];
}

export default async function EventsPage() {
  const events = await getEvents();
  const hasEvents = events.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Events</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Synced from Ticketmaster promoter portal
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasEvents && (
            <span className="text-xs text-muted-foreground">
              {events.length} events
            </span>
          )}
          <Button size="sm" variant="outline" className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" />
            Run Scraper
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Upcoming Events</CardTitle>
            <Badge variant={hasEvents ? "default" : "outline"} className="text-xs">
              {hasEvents ? "Live data" : "No data yet"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {hasEvents ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>TM1 #</TableHead>
                  <TableHead>Sold</TableHead>
                  <TableHead>Gross</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{event.name}</p>
                        <p className="text-xs text-muted-foreground">{event.artist}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>
                        <p>{event.venue}</p>
                        <p className="text-xs text-muted-foreground">{event.city}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {event.date
                        ? new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {event.tm1_number || "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {event.tickets_sold != null
                        ? event.tickets_sold.toLocaleString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {event.gross != null
                        ? `$${(event.gross / 100).toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                          })}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusVariant[event.status] ?? "outline"}
                        className="text-xs capitalize"
                      >
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {event.url && (
                        <a
                          href={event.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CalendarDays className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">No events synced yet</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4 max-w-sm">
                Run the local scraper on your Mac to pull events from the
                Ticketmaster promoter portal
              </p>
              <code className="text-xs bg-muted px-3 py-2 rounded block">
                cd scraper && npm run login && npm run scrape
              </code>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
