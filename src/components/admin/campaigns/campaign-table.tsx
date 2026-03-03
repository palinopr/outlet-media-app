"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/data-table/data-table";
import { getCampaignColumns } from "./columns";
import { bulkAssignClient } from "@/app/admin/actions/campaigns";
import { toast } from "sonner";
import type { MetaCampaignCard, DailyInsight } from "@/lib/meta-campaigns";

interface CampaignTableProps {
  campaigns: MetaCampaignCard[];
  dailyInsightsByCampaign: Record<string, DailyInsight[]>;
  clients: string[];
  metaAdAccountId: string | null;
  hasData: boolean;
}

function AssignToolbar({
  selectedRows,
  clients,
}: {
  selectedRows: MetaCampaignCard[];
  clients: string[];
}) {
  const [slug, setSlug] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleAssign() {
    const target = slug.trim();
    if (!target) return;
    const ids = selectedRows.map((r) => r.campaignId);
    startTransition(async () => {
      try {
        const count = await bulkAssignClient({ campaignIds: ids, clientSlug: target });
        toast.success(`Assigned ${count} campaign(s) to ${target}`);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to assign");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {selectedRows.length} selected
      </span>
      <select
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="h-7 rounded border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
      >
        <option value="">Assign to...</option>
        {clients.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <input
        type="text"
        value={clients.includes(slug) ? "" : slug}
        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "_"))}
        placeholder="or new slug"
        className="h-7 w-28 rounded border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
      />
      <button
        onClick={handleAssign}
        disabled={!slug.trim() || isPending}
        className="h-7 rounded bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {isPending ? "Assigning..." : "Assign"}
      </button>
    </div>
  );
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
      enableRowSelection
      getRowId={(row) => row.campaignId}
      selectionToolbar={(selectedRows) => (
        <AssignToolbar
          selectedRows={selectedRows as MetaCampaignCard[]}
          clients={clients}
        />
      )}
    />
  );
}
