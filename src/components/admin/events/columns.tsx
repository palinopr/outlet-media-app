"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { createSelectColumn } from "@/components/admin/data-table/select-column";
import { ExternalLink } from "lucide-react";
import { ColumnHeader } from "@/components/admin/data-table/column-header";
import { StatusSelect } from "@/components/admin/status-select";
import { InlineEdit } from "@/components/admin/inline-edit";
import { centsToUsd, fmtDate, fmtUsd, slugToLabel } from "@/lib/formatters";
import { matchedCampaigns } from "@/lib/campaign-event-match";
import {
  updateEventStatus,
  assignEventClient,
  updateEventTickets,
} from "@/app/admin/actions/events";
import { toast } from "sonner";
import type { TmEventRow, DemoRow, CampaignRow } from "@/app/admin/events/data";
import { SellBarVisual, ClientSelect } from "./event-cells";

import { EVENT_STATUS_OPTIONS } from "@/lib/constants";

interface EventColumnsOptions {
  clients: string[];
  demoMap: Record<string, DemoRow>;
  campaigns: CampaignRow[];
}

export function getEventColumns(opts: EventColumnsOptions): ColumnDef<TmEventRow>[] {
  const { clients, demoMap, campaigns } = opts;

  return [
    createSelectColumn<TmEventRow>(),
    {
      accessorKey: "tm1_number",
      header: ({ column }) => <ColumnHeader column={column} title="TM1 #" />,
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.tm1_number || "--"}
        </span>
      ),
    },
    {
      accessorKey: "artist",
      header: ({ column }) => <ColumnHeader column={column} title="Artist / Event" />,
      cell: ({ row }) => (
        <div>
          <Link
            href={`/admin/events/${row.original.id}`}
            className="text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            {row.original.artist}
          </Link>
          <p className="text-xs text-muted-foreground">{row.original.name}</p>
        </div>
      ),
    },
    {
      accessorKey: "client_slug",
      header: ({ column }) => <ColumnHeader column={column} title="Client" />,
      cell: ({ row }) => (
        <ClientSelect
          value={row.original.client_slug ?? ""}
          clients={clients}
          onSave={async (slug) => {
            try {
              await assignEventClient({ eventId: row.original.id, clientSlug: slug });
              toast.success(slug ? `Assigned to ${slugToLabel(slug)}` : "Client unassigned");
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Failed to assign client");
            }
          }}
        />
      ),
    },
    {
      accessorKey: "venue",
      header: ({ column }) => <ColumnHeader column={column} title="Venue" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.venue}</span>
      ),
    },
    {
      accessorKey: "city",
      header: ({ column }) => <ColumnHeader column={column} title="City" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground whitespace-nowrap">{row.original.city}</span>
      ),
    },
    {
      accessorKey: "date",
      header: ({ column }) => <ColumnHeader column={column} title="Date" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {fmtDate(row.original.date)}
        </span>
      ),
    },
    {
      id: "sell-through",
      enableSorting: false,
      header: () => <span className="text-xs font-medium text-muted-foreground">Sell-through</span>,
      cell: ({ row }) => (
        <div className="min-w-[120px]">
          <InlineEdit
            value={row.original.tickets_sold}
            type="number"
            suffix=" sold"
            className="text-sm font-medium tabular-nums"
            onSave={async (val) => {
              const parsed = val === "" ? null : parseInt(val, 10);
              try {
                await updateEventTickets({
                  eventId: row.original.id,
                  ticketsSold: parsed,
                  ticketsAvailable: row.original.tickets_available,
                });
                toast.success("Tickets updated");
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Failed to update tickets");
              }
            }}
          />
          <SellBarVisual sold={row.original.tickets_sold} available={row.original.tickets_available} />
        </div>
      ),
    },
    {
      accessorKey: "gross",
      header: ({ column }) => <ColumnHeader column={column} title="Gross" className="justify-end" />,
      cell: ({ row }) => (
        <div className="text-right">
          <p className="text-sm font-medium tabular-nums">{fmtUsd(row.original.gross)}</p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => <ColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <StatusSelect
          value={(row.original.status ?? "").toLowerCase()}
          options={EVENT_STATUS_OPTIONS}
          onSave={async (newStatus) => {
            try {
              await updateEventStatus({ eventId: row.original.id, status: newStatus });
              toast.success(`Status updated to ${newStatus}`);
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Failed to update status");
            }
          }}
        />
      ),
    },
    {
      id: "ads",
      enableSorting: false,
      header: () => <span className="text-xs font-medium text-muted-foreground">Ads</span>,
      cell: ({ row }) => {
        const linked = matchedCampaigns(campaigns, row.original);
        const active = linked.filter((c) => c.status === "ACTIVE");
        if (active.length === 0 && linked.length === 0) {
          return <span className="text-muted-foreground">--</span>;
        }
        if (active.length === 0) {
          return <span className="text-xs text-muted-foreground">paused</span>;
        }
        const avgRoas = active.reduce((s, c) => s + (c.roas ?? 0), 0) / active.length;
        const totalSpend = active.reduce((s, c) => s + (centsToUsd(c.spend ?? 0) as number), 0);
        return (
          <div>
            <span className="text-xs font-medium text-emerald-400">{active.length} active</span>
            <div className="text-xs text-muted-foreground tabular-nums">
              {avgRoas > 0 ? avgRoas.toFixed(1) + "x " : ""}
              ${Math.round(totalSpend / 1000)}K
            </div>
          </div>
        );
      },
    },
    {
      id: "fans",
      accessorFn: (row) => demoMap[row.tm_id]?.fans_total ?? null,
      header: ({ column }) => <ColumnHeader column={column} title="Fans" className="justify-end" />,
      cell: ({ row }) => {
        const fansTotal = demoMap[row.original.tm_id]?.fans_total;
        if (fansTotal == null) {
          return <div className="text-right"><span className="text-muted-foreground">--</span></div>;
        }
        return (
          <div className="text-right">
            <span className="text-sm tabular-nums font-medium">{fansTotal.toLocaleString()}</span>
          </div>
        );
      },
    },
    {
      id: "link",
      enableSorting: false,
      header: () => null,
      cell: ({ row }) => {
        if (!row.original.url) return null;
        return (
          <a
            href={row.original.url}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        );
      },
    },
  ];
}
