"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import { ColumnHeader } from "@/components/admin/data-table/column-header";
import { StatusSelect } from "@/components/admin/status-select";
import {
  fmtNum,
  fmtObjective,
  slugToLabel,
  roasColor,
} from "@/lib/formatters";
import { updateCampaignStatus } from "@/app/admin/actions/campaigns";
import { toast } from "sonner";
import type { MetaCampaignCard, DailyInsight } from "@/lib/meta-campaigns";
import {
  BudgetBar,
  RoasBadge,
  RoasSparkline,
  SyncButton,
} from "./campaign-cells";

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "PAUSED", label: "Paused" },
];

interface CampaignColumnsOptions {
  dailyInsightsByCampaign: Record<string, DailyInsight[]>;
  clients: string[];
  metaAdAccountId: string | null;
}

function computeMarginalFromInsights(points: DailyInsight[]): number | null {
  if (points.length < 2) return null;
  const sorted = [...points].sort((a, b) => a.date.localeCompare(b.date));
  const first = sorted[0], last = sorted[sorted.length - 1];
  if (first.spend == null || last.spend == null || first.roas == null || last.roas == null) return null;
  const deltaSpend = last.spend - first.spend;
  if (deltaSpend <= 0) return null;
  const revFirst = first.spend * first.roas;
  const revLast = last.spend * last.roas;
  return (revLast - revFirst) / deltaSpend;
}

export function getCampaignColumns(opts: CampaignColumnsOptions): ColumnDef<MetaCampaignCard>[] {
  const { dailyInsightsByCampaign, metaAdAccountId } = opts;

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
              await updateCampaignStatus({ campaignId: row.original.campaignId, status: newStatus });
              toast.success(`Status updated to ${newStatus}`);
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Failed to update status");
            }
          }}
        />
      ),
    },
    {
      accessorKey: "clientSlug",
      header: ({ column }) => <ColumnHeader column={column} title="Client" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {slugToLabel(row.original.clientSlug)}
        </span>
      ),
    },
    {
      id: "budget",
      accessorFn: (row) => row.spend,
      header: ({ column }) => <ColumnHeader column={column} title="Budget spent" />,
      cell: ({ row }) => (
        <BudgetBar
          spend={row.original.spend}
          dailyBudget={row.original.dailyBudget}
          lifetimeBudget={null}
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
        <RoasSparkline points={dailyInsightsByCampaign[row.original.campaignId] ?? []} />
      ),
    },
    {
      id: "marginal",
      accessorFn: (row) => computeMarginalFromInsights(dailyInsightsByCampaign[row.campaignId] ?? []),
      header: ({ column }) => <ColumnHeader column={column} title="Marginal" className="justify-end" />,
      cell: ({ row }) => {
        const m = computeMarginalFromInsights(dailyInsightsByCampaign[row.original.campaignId] ?? []);
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
            campaignId={row.original.campaignId}
            status={row.original.status}
            dailyBudget={row.original.dailyBudget != null ? Math.round(row.original.dailyBudget * 100) : null}
          />
          {metaAdAccountId ? (
            <a
              href={`https://www.facebook.com/adsmanager/manage/campaigns?act=${metaAdAccountId}&selected_campaign_ids=${row.original.campaignId}`}
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
