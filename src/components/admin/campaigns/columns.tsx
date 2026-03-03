"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import { ColumnHeader } from "@/components/admin/data-table/column-header";
import { StatusSelect } from "@/components/admin/status-select";
import {
  fmtNum,
  fmtObjective,
  centsToUsd,
  slugToLabel,
  computeMarginalRoas,
  roasColor,
  type SnapshotPoint,
} from "@/lib/formatters";
import {
  updateCampaignStatus,
  assignCampaignClient,
} from "@/app/admin/actions/campaigns";
import { toast } from "sonner";
import type { MetaCampaign } from "@/app/admin/campaigns/data";
import {
  BudgetBar,
  RoasBadge,
  RoasSparkline,
  SyncButton,
  ClientSelect,
} from "./campaign-cells";

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "PAUSED", label: "Paused" },
];

interface CampaignColumnsOptions {
  snapshotsByCampaign: Record<string, SnapshotPoint[]>;
  clients: string[];
  metaAdAccountId: string | null;
}

export function getCampaignColumns(opts: CampaignColumnsOptions): ColumnDef<MetaCampaign>[] {
  const { snapshotsByCampaign, clients, metaAdAccountId } = opts;

  return [
    {
      accessorKey: "name",
      header: ({ column }) => <ColumnHeader column={column} title="Campaign" />,
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium">{row.original.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-muted-foreground">{fmtObjective(row.original.objective)}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => <ColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <StatusSelect
          value={row.original.status}
          options={STATUS_OPTIONS}
          onSave={async (newStatus) => {
            try {
              await updateCampaignStatus({ campaignId: row.original.campaign_id, status: newStatus });
              toast.success(`Status updated to ${newStatus}`);
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Failed to update status");
            }
          }}
        />
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
              await assignCampaignClient({ campaignId: row.original.campaign_id, clientSlug: slug });
              toast.success(slug ? `Assigned to ${slugToLabel(slug)}` : "Client unassigned");
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Failed to assign client");
            }
          }}
        />
      ),
    },
    {
      id: "budget",
      accessorFn: (row) => row.spend,
      header: ({ column }) => <ColumnHeader column={column} title="Budget spent" />,
      cell: ({ row }) => (
        <BudgetBar
          spend={centsToUsd(row.original.spend)}
          dailyBudget={centsToUsd(row.original.daily_budget)}
          lifetimeBudget={centsToUsd(row.original.lifetime_budget)}
        />
      ),
    },
    {
      accessorKey: "roas",
      header: ({ column }) => <ColumnHeader column={column} title="ROAS" className="justify-end" />,
      cell: ({ row }) => (
        <div className="text-right">
          <RoasBadge roas={row.original.roas} />
        </div>
      ),
    },
    {
      id: "trend",
      enableSorting: false,
      header: () => <span className="text-xs font-medium text-muted-foreground">Trend</span>,
      cell: ({ row }) => (
        <RoasSparkline points={snapshotsByCampaign[row.original.campaign_id] ?? []} />
      ),
    },
    {
      id: "marginal",
      accessorFn: (row) => computeMarginalRoas(snapshotsByCampaign[row.campaign_id] ?? []),
      header: ({ column }) => <ColumnHeader column={column} title="Marginal" className="justify-end" />,
      cell: ({ row }) => {
        const m = computeMarginalRoas(snapshotsByCampaign[row.original.campaign_id] ?? []);
        if (m == null) return <div className="text-right"><span className="text-muted-foreground text-sm">--</span></div>;
        return <div className="text-right"><span className={`text-sm font-semibold tabular-nums ${roasColor(m)}`}>{m.toFixed(1)}x</span></div>;
      },
    },
    {
      accessorKey: "impressions",
      header: ({ column }) => <ColumnHeader column={column} title="Impressions" className="justify-end" />,
      cell: ({ row }) => (
        <div className="text-right text-sm text-muted-foreground tabular-nums">
          {fmtNum(row.original.impressions)}
        </div>
      ),
    },
    {
      accessorKey: "ctr",
      header: ({ column }) => <ColumnHeader column={column} title="CTR" className="justify-end" />,
      cell: ({ row }) => (
        <div className="text-right text-sm text-muted-foreground tabular-nums">
          {row.original.ctr != null ? row.original.ctr.toFixed(2) + "%" : "--"}
        </div>
      ),
    },
    {
      accessorKey: "cpc",
      header: ({ column }) => <ColumnHeader column={column} title="CPC" className="justify-end" />,
      cell: ({ row }) => (
        <div className="text-right text-sm text-muted-foreground tabular-nums">
          {row.original.cpc != null ? "$" + row.original.cpc.toFixed(2) : "--"}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <SyncButton
            campaignId={row.original.campaign_id}
            status={row.original.status}
            dailyBudget={row.original.daily_budget}
          />
          {metaAdAccountId ? (
            <a
              href={`https://www.facebook.com/adsmanager/manage/campaigns?act=${metaAdAccountId}&selected_campaign_ids=${row.original.campaign_id}`}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      ),
    },
  ];
}
