"use client";

import { DataTable } from "@/components/admin/data-table/data-table";
import { getEventColumns } from "./columns";
import type { TmEventRow, DemoRow, CampaignRow } from "@/app/admin/events/data";

interface EventTableProps {
  events: TmEventRow[];
  clients: string[];
  demoMap: Record<string, DemoRow>;
  campaigns: CampaignRow[];
  fromDb: boolean;
}

export function EventTable({ events, clients, demoMap, campaigns, fromDb }: EventTableProps) {
  const columns = getEventColumns({ clients, demoMap, campaigns });

  return (
    <DataTable
      columns={columns}
      data={events}
      searchColumn="artist"
      searchPlaceholder="Search events..."
      emptyMessage={
        fromDb
          ? "No events match this filter"
          : "No event data -- start the agent to pull events from the Ticketmaster promoter portal"
      }
    />
  );
}
