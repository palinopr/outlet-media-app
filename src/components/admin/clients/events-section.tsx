"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fmtDate, statusBadge } from "@/lib/formatters";
import type { ClientDetail } from "@/app/admin/clients/data";

interface EventsSectionProps {
  events: ClientDetail["events"];
}

export function EventsSection({ events }: EventsSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Assigned events</h2>
        </div>

        <Card className="border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="text-xs font-medium text-muted-foreground">
                  Event
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">
                  Venue
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">
                  Date
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length === 0 ? (
                <TableRow>
                  <TableCell
                    className="py-10 text-center text-sm text-muted-foreground"
                    colSpan={4}
                  >
                    No events assigned to this client yet.
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow className="border-border/60" key={event.id}>
                    <TableCell className="text-sm font-medium">
                      <Link className="hover:text-foreground/80" href={`/admin/events/${event.id}`}>
                        {event.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {event.venue}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {fmtDate(event.date)}
                    </TableCell>
                    <TableCell>{statusBadge(event.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
