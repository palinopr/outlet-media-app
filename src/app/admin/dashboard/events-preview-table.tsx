import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarDays, ArrowRight } from "lucide-react";
import { fmtUsd, fmtDate, fmtNum, statusBadge } from "@/lib/formatters";
import type { TmEvent } from "./data";

interface Props {
  events: TmEvent[];
}

export function EventsPreviewTable({ events }: Props) {
  return (
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
              <CalendarDays className="h-8 w-8 text-muted-foreground/60" />
              <p className="text-sm text-muted-foreground">No events yet</p>
              <p className="text-xs text-muted-foreground">TM One credentials needed to sync ticket data</p>
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
  );
}
