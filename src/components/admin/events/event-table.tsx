"use client";

import { DataTable } from "@/components/admin/data-table/data-table";
import { getEventColumns } from "./columns";
import { fmtUsd, fmtDate, fmtNum, statusBadge, slugToLabel } from "@/lib/formatters";
import { exportToCsv, formatDate, todayFilename } from "@/lib/export-csv";
import type { TmEventRow, DemoRow, CampaignRow } from "@/app/admin/events/data";

interface EventTableProps {
  events: TmEventRow[];
  clients: string[];
  demoMap: Record<string, DemoRow>;
  campaigns: CampaignRow[];
  fromDb: boolean;
}

const eventCsvColumns = [
  { header: "Name", accessor: (r: Record<string, unknown>) => String(r.artist ?? "") },
  { header: "Venue", accessor: (r: Record<string, unknown>) => String(r.venue ?? "") },
  { header: "City", accessor: (r: Record<string, unknown>) => String(r.city ?? "") },
  { header: "Date", accessor: (r: Record<string, unknown>) => formatDate(r.date as string | null) },
  { header: "Tickets Sold", accessor: (r: Record<string, unknown>) => (r.tickets_sold != null ? String(r.tickets_sold) : "") },
  { header: "Gross ($)", accessor: (r: Record<string, unknown>) => (r.gross != null ? Number(r.gross).toFixed(2) : "") },
  { header: "Status", accessor: (r: Record<string, unknown>) => String(r.status ?? "") },
  { header: "Client", accessor: (r: Record<string, unknown>) => String(r.client_slug ?? "") },
];

export function EventTable({ events, clients, demoMap, campaigns, fromDb }: EventTableProps) {
  const columns = getEventColumns({ clients, demoMap, campaigns });

  return (
    <DataTable
      columns={columns}
      data={events}
      searchColumn="artist"
      searchPlaceholder="Search events..."
      onExport={() => exportToCsv(events as unknown as Record<string, unknown>[], eventCsvColumns, todayFilename("events"))}
      emptyMessage={
        fromDb
          ? "No events match this filter"
          : "No event data -- start the agent to pull events from the Ticketmaster promoter portal"
      }
      mobileCard={(e) => {
        const soldPct =
          e.tickets_sold != null && e.tickets_available
            ? Math.round((e.tickets_sold / e.tickets_available) * 100)
            : null;
        return (
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{e.artist}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {e.venue} &middot; {e.city}
                </p>
              </div>
              {statusBadge(e.status)}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-xs tabular-nums">{fmtDate(e.date)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sold</p>
                <p className="text-xs tabular-nums">
                  {e.tickets_sold != null ? fmtNum(e.tickets_sold) : "--"}
                  {soldPct != null && (
                    <span className="text-muted-foreground ml-1">({soldPct}%)</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Gross</p>
                <p className="text-xs tabular-nums">{fmtUsd(e.gross)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Client</p>
                <p className="text-xs truncate">{slugToLabel(e.client_slug)}</p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
