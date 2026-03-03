"use client";

import { DataTable } from "@/components/admin/data-table/data-table";
import { getCampaignColumns } from "./columns";
import type { MetaCampaignCard, DailyInsight } from "@/lib/meta-campaigns";

interface CampaignTableProps {
  campaigns: MetaCampaignCard[];
  dailyInsightsByCampaign: Record<string, DailyInsight[]>;
  clients: string[];
  metaAdAccountId: string | null;
  hasData: boolean;
}

export function CampaignTable({ campaigns, dailyInsightsByCampaign, clients, metaAdAccountId, hasData }: CampaignTableProps) {
  const columns = getCampaignColumns({ dailyInsightsByCampaign, clients, metaAdAccountId });

  return (
    <DataTable
      columns={columns}
      data={campaigns}
      searchColumn="name"
      searchPlaceholder="Search campaigns..."
      emptyMessage={hasData ? "No campaigns match this filter" : "No campaign data -- run the Meta sync agent to pull live data"}
    />
  );
}
