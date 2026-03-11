"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { createClient, bulkDeactivateClients } from "@/app/admin/actions/clients";
import { toSlug } from "@/lib/to-slug";
import Link from "next/link";
import { DataTable } from "@/components/admin/data-table/data-table";
import { clientColumns } from "./columns";
import { fmtUsd, statusBadge } from "@/lib/formatters";
import { exportToCsv, todayFilename } from "@/lib/export-csv";
import type { ClientSummary } from "@/app/admin/clients/data";

interface Props {
  clients: ClientSummary[];
}

// ─── Create client form ─────────────────────────────────────────────────────

function CreateClientForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);

  function handleNameChange(val: string) {
    setName(val);
    setSlug(toSlug(val));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await createClient({
        name: name.trim(),
        slug,
      });
      setCreated(true);
      toast.success(`Client "${name.trim()}" created`);
      setTimeout(() => {
        onDone();
      }, 1500);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create client",
      );
    } finally {
      setLoading(false);
    }
  }

  if (created) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-400 py-2">
        <Check className="h-4 w-4" /> Client created
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3 pt-1">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Name</label>
          <Input
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Acme Events"
            className="h-8 w-48 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Slug</label>
          <Input
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="acme_events"
            className="h-8 w-40 text-sm"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={loading} className="h-8">
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            "Create"
          )}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-8"
          onClick={onDone}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ─── Selection toolbar ───────────────────────────────────────────────────────

function ClientSelectionToolbar({ selectedRows }: { selectedRows: ClientSummary[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDeactivate() {
    const ids = selectedRows.map((r) => r.id);
    const confirmed = window.confirm(
      `Deactivate ${ids.length} client(s)? This will pause all their active campaigns.`,
    );
    if (!confirmed) return;
    startTransition(async () => {
      try {
        await bulkDeactivateClients({ clientIds: ids });
        toast.success(`Deactivated ${ids.length} client(s)`);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to deactivate clients");
      }
    });
  }

  return (
    <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded px-3 py-1.5">
      <span className="text-xs font-medium whitespace-nowrap">
        {selectedRows.length} selected
      </span>
      <span className="text-xs text-muted-foreground">|</span>
      <button
        onClick={handleDeactivate}
        disabled={isPending}
        className="h-7 rounded bg-red-600 px-3 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
      >
        {isPending ? "Deactivating..." : "Deactivate"}
      </button>
    </div>
  );
}

// ─── Main table ──────────────────────────────────────────────────────────────

const clientCsvColumns = [
  { header: "Name", accessor: (r: Record<string, unknown>) => String(r.name ?? "") },
  { header: "Slug", accessor: (r: Record<string, unknown>) => String(r.slug ?? "") },
  { header: "Status", accessor: (r: Record<string, unknown>) => String(r.status ?? "") },
  { header: "Campaigns", accessor: (r: Record<string, unknown>) => (r.totalCampaigns != null ? String(r.totalCampaigns) : "") },
  { header: "Connected Accounts", accessor: (r: Record<string, unknown>) => (r.connectedAccountCount != null ? String(r.connectedAccountCount) : "") },
  { header: "Connections At Risk", accessor: (r: Record<string, unknown>) => (r.connectionRiskAccounts != null ? String(r.connectionRiskAccounts) : "") },
  { header: "Total Spend ($)", accessor: (r: Record<string, unknown>) => (r.totalSpend != null ? Number(r.totalSpend).toFixed(2) : "") },
  { header: "ROAS", accessor: (r: Record<string, unknown>) => (r.roas != null && Number(r.roas) > 0 ? Number(r.roas).toFixed(2) : "") },
];

export function ClientTable({ clients }: Props) {
  const [showCreate, setShowCreate] = useState(false);

  const createToolbar = showCreate ? (
    <CreateClientForm onDone={() => setShowCreate(false)} />
  ) : (
    <Button
      size="sm"
      variant="outline"
      className="gap-2 h-8 text-xs"
      onClick={() => setShowCreate(true)}
    >
      <Plus className="h-3.5 w-3.5" />
      Create Client
    </Button>
  );

  return (
    <DataTable
      columns={clientColumns}
      data={clients}
      searchColumn="name"
      searchPlaceholder="Search clients..."
      enableRowSelection
      getRowId={(row) => row.id}
      selectionToolbar={(selectedRows) => (
        <ClientSelectionToolbar selectedRows={selectedRows as ClientSummary[]} />
      )}
      toolbar={createToolbar}
      onExport={() => exportToCsv(clients as unknown as Record<string, unknown>[], clientCsvColumns, todayFilename("clients"))}
      mobileCard={(c) => (
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <Link
              href={`/admin/clients/${c.id}`}
              className="text-sm font-medium truncate hover:underline"
            >
              {c.name}
            </Link>
            {statusBadge(c.status)}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            <div>
              <p className="text-xs text-muted-foreground">Campaigns</p>
              <p className="text-xs tabular-nums">
                {c.activeCampaigns} active / {c.totalCampaigns}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Spend</p>
              <p className="text-xs tabular-nums">{fmtUsd(c.totalSpend)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Revenue</p>
              <p className="text-xs tabular-nums">{fmtUsd(c.totalRevenue)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">ROAS</p>
              <p className="text-xs tabular-nums font-medium">
                {c.roas > 0 ? `${c.roas.toFixed(2)}x` : "--"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Connections</p>
              <p className="text-xs tabular-nums">
                {c.connectedAccountCount} linked
                {c.connectionRiskAccounts > 0
                  ? ` / ${c.connectionRiskAccounts} at risk`
                  : ""}
              </p>
            </div>
          </div>
        </div>
      )}
    />
  );
}
