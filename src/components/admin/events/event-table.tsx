"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/data-table/data-table";
import { getEventColumns } from "./columns";
import { bulkAssignEventClient, bulkUpdateEventStatus } from "@/app/admin/actions/events";
import { toast } from "sonner";
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

const EVENT_STATUS_OPTIONS = [
  { value: "onsale", label: "On Sale" },
  { value: "offsale", label: "Off Sale" },
  { value: "cancelled", label: "Cancelled" },
  { value: "postponed", label: "Postponed" },
  { value: "rescheduled", label: "Rescheduled" },
];

function EventSelectionToolbar({
  selectedRows,
  clients,
}: {
  selectedRows: TmEventRow[];
  clients: string[];
}) {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleAssignClient() {
    if (!selectedClient) return;
    const ids = selectedRows.map((r) => r.id);
    startTransition(async () => {
      try {
        await bulkAssignEventClient({ eventIds: ids, clientSlug: selectedClient });
        toast.success(`Assigned ${ids.length} event(s) to ${selectedClient}`);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to assign client");
      }
    });
  }

  function handleUpdateStatus() {
    if (!selectedStatus) return;
    const ids = selectedRows.map((r) => r.id);
    startTransition(async () => {
      try {
        await bulkUpdateEventStatus({ eventIds: ids, status: selectedStatus });
        toast.success(`Updated ${ids.length} event(s) to ${selectedStatus}`);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update status");
      }
    });
  }

  return (
    <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded px-3 py-1.5">
      <span className="text-xs font-medium whitespace-nowrap">
        {selectedRows.length} selected
      </span>
      <span className="text-xs text-muted-foreground">|</span>
      <select
        value={selectedClient}
        onChange={(e) => setSelectedClient(e.target.value)}
        className="h-7 rounded border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
      >
        <option value="">Assign to...</option>
        {clients.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <button
        onClick={handleAssignClient}
        disabled={!selectedClient || isPending}
        className="h-7 rounded bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        Assign
      </button>
      <span className="text-xs text-muted-foreground">|</span>
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="h-7 rounded border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
      >
        <option value="">Set status...</option>
        {EVENT_STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <button
        onClick={handleUpdateStatus}
        disabled={!selectedStatus || isPending}
        className="h-7 rounded bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {isPending ? "Saving..." : "Update"}
      </button>
    </div>
  );
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
      enableRowSelection
      getRowId={(row) => row.id}
      selectionToolbar={(selectedRows) => (
        <EventSelectionToolbar
          selectedRows={selectedRows as TmEventRow[]}
          clients={clients}
        />
      )}
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
