"use client";

import { DataTable } from "@/components/admin/data-table/data-table";
import { getCampaignColumns } from "./columns";
import type { MetaCampaign } from "@/app/admin/campaigns/data";
import type { SnapshotPoint } from "@/lib/formatters";

interface CampaignTableProps {
  campaigns: MetaCampaign[];
  snapshotsByCampaign: Record<string, SnapshotPoint[]>;
  clients: string[];
  metaAdAccountId: string | null;
  fromDb: boolean;
}

export function CampaignTable({ campaigns, snapshotsByCampaign, clients, metaAdAccountId, fromDb }: CampaignTableProps) {
  const columns = getCampaignColumns({ snapshotsByCampaign, clients, metaAdAccountId });

  return (
    <DataTable
      columns={columns}
      data={campaigns}
      searchColumn="name"
      searchPlaceholder="Search campaigns..."
      emptyMessage={fromDb ? "No campaigns match this filter" : "No campaign data -- run the Meta sync agent to pull live data"}
    />
  );
}
