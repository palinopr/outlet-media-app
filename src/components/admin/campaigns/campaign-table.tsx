"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/data-table/data-table";
import { getCampaignColumns } from "./columns";
import { bulkAssignClient } from "@/app/admin/actions/campaigns";
import { toast } from "sonner";
import { fmtUsd, fmtNum, roasColor, slugToLabel } from "@/lib/formatters";
import { exportToCsv, todayFilename } from "@/lib/export-csv";
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
  const [mode, setMode] = useState<"select" | "new">("select");
  const [selectedClient, setSelectedClient] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const slug = mode === "select" ? selectedClient : newSlug;

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
    <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded px-3 py-1.5">
      <span className="text-xs font-medium whitespace-nowrap">
        {selectedRows.length} selected
      </span>
      <span className="text-xs text-muted-foreground">|</span>
      <select
        value={mode === "select" ? selectedClient : "__new__"}
        onChange={(e) => {
          if (e.target.value === "__new__") {
            setMode("new");
            setSelectedClient("");
          } else {
            setMode("select");
            setSelectedClient(e.target.value);
            setNewSlug("");
          }
        }}
        className="h-7 rounded border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
      >
        <option value="">Assign to...</option>
        {clients.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
        <option value="__new__">+ New client...</option>
      </select>
      {mode === "new" && (
        <input
          type="text"
          value={newSlug}
          onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, "_"))}
          placeholder="new_client_slug"
          className="h-7 w-32 rounded border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
          autoFocus
        />
      )}
      <button
        onClick={handleAssign}
        disabled={!slug.trim() || isPending}
        className="h-7 rounded bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {isPending ? "Saving..." : "Assign"}
      </button>
    </div>
  );
}

const campaignCsvColumns = [
  { header: "Name", accessor: (r: Record<string, unknown>) => String(r.name ?? "") },
  { header: "Status", accessor: (r: Record<string, unknown>) => String(r.status ?? "") },
  { header: "Client", accessor: (r: Record<string, unknown>) => String(r.clientSlug ?? "") },
  { header: "Spend ($)", accessor: (r: Record<string, unknown>) => (r.spend != null ? Number(r.spend).toFixed(2) : "") },
  { header: "ROAS", accessor: (r: Record<string, unknown>) => (r.roas != null ? Number(r.roas).toFixed(2) : "") },
  { header: "Impressions", accessor: (r: Record<string, unknown>) => (r.impressions != null ? String(r.impressions) : "") },
  { header: "CTR", accessor: (r: Record<string, unknown>) => (r.ctr != null ? `${Number(r.ctr).toFixed(2)}%` : "") },
];

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
      onExport={() => exportToCsv(campaigns as unknown as Record<string, unknown>[], campaignCsvColumns, todayFilename("campaigns"))}
      selectionToolbar={(selectedRows) => (
        <AssignToolbar
          selectedRows={selectedRows as MetaCampaignCard[]}
          clients={clients}
        />
      )}
      mobileCard={(c) => (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`h-2 w-2 rounded-full shrink-0 ${
                c.status === "ACTIVE" ? "bg-emerald-400" : "bg-zinc-500"
              }`}
            />
            <p className="text-sm font-medium truncate">{c.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            <div>
              <p className="text-xs text-muted-foreground">Spend</p>
              <p className="text-xs tabular-nums">{fmtUsd(c.spend)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">ROAS</p>
              <p className={`text-xs tabular-nums font-medium ${roasColor(c.roas)}`}>
                {c.roas != null ? `${c.roas.toFixed(2)}x` : "--"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Impressions</p>
              <p className="text-xs tabular-nums">{fmtNum(c.impressions)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">CTR</p>
              <p className="text-xs tabular-nums">
                {c.ctr != null ? `${c.ctr.toFixed(2)}%` : "--"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Client</p>
              <p className="text-xs truncate">{slugToLabel(c.clientSlug)}</p>
            </div>
          </div>
        </div>
      )}
    />
  );
}
