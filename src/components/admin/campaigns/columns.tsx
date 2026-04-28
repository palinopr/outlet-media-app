"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { createSelectColumn } from "@/components/admin/data-table/select-column";
import { ExternalLink, Loader2 } from "lucide-react";
import { ColumnHeader } from "@/components/admin/data-table/column-header";
import { StatusSelect } from "@/components/admin/status-select";
import {
  fmtNum,
  fmtObjective,
  slugToLabel,
  roasColor,
  computeMarginalRoas,
} from "@/lib/formatters";
import { assignCampaignClient, updateCampaignStatus, updateCampaignType } from "@/app/admin/actions/campaigns";
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

const TYPE_OPTIONS = [
  { value: "sales", label: "Sales" },
  { value: "music", label: "Music" },
  { value: "traffic", label: "Traffic" },
];

interface CampaignColumnsOptions {
  clients: string[];
  dailyInsightsByCampaign: Record<string, DailyInsight[]>;
  metaAdAccountId: string | null;
}

function CampaignClientSelect({
  campaignId,
  clients,
  currentClientSlug,
}: {
  campaignId: string;
  clients: string[];
  currentClientSlug: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(currentClientSlug === "unknown" ? "" : currentClientSlug);
  const [isPending, startTransition] = useTransition();

  function handleChange(nextClientSlug: string) {
    if (!nextClientSlug || nextClientSlug === value) return;

    const previous = value;
    setValue(nextClientSlug);
    startTransition(async () => {
      try {
        await assignCampaignClient({
          campaignId,
          clientSlug: nextClientSlug,
        });
        toast.success(`Assigned to ${slugToLabel(nextClientSlug)}`);
        router.refresh();
      } catch (err) {
        setValue(previous);
        toast.error(err instanceof Error ? err.message : "Failed to assign client");
      }
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        disabled={isPending || clients.length === 0}
        className={`h-7 min-w-36 rounded border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50 ${
          value ? "border-border" : "border-amber-500/30 text-amber-300"
        }`}
      >
        <option value="" disabled>
          {clients.length === 0 ? "No active clients" : "Assign client..."}
        </option>
        {clients.map((slug) => (
          <option key={slug} value={slug}>
            {slugToLabel(slug)}
          </option>
        ))}
      </select>
      {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" /> : null}
    </div>
  );
}

export function getCampaignColumns(opts: CampaignColumnsOptions): ColumnDef<MetaCampaignCard>[] {
  const { clients, dailyInsightsByCampaign, metaAdAccountId } = opts;

  return [
    createSelectColumn<MetaCampaignCard>(),
    {
      accessorKey: "name",
      header: ({ column }) => <ColumnHeader column={column} title="Campaign" />,
      cell: ({ row }) => (
        <div>
          <Link
            href={`/admin/campaigns/${row.original.campaignId}`}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            {row.original.name}
          </Link>
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
      accessorKey: "campaignType",
      header: ({ column }) => <ColumnHeader column={column} title="Type" />,
      cell: ({ row }) => (
        <StatusSelect
          value={row.original.campaignType}
          options={TYPE_OPTIONS}
          onSave={async (newType) => {
            try {
              await updateCampaignType({ campaignId: row.original.campaignId, campaignType: newType });
              toast.success(`Type updated to ${newType}`);
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Failed to update type");
            }
          }}
        />
      ),
    },
    {
      accessorKey: "clientSlug",
      header: ({ column }) => <ColumnHeader column={column} title="Client" />,
      cell: ({ row }) => (
        <CampaignClientSelect
          campaignId={row.original.campaignId}
          clients={clients}
          currentClientSlug={row.original.clientSlug}
        />
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
      cell: ({ row }) => {
        if (row.original.campaignType !== "sales") return <div className="text-right"><span className="text-muted-foreground text-sm">--</span></div>;
        return (
          <div className="text-right">
            <RoasBadge roas={row.original.roas} />
          </div>
        );
      },
    },
    {
      id: "trend",
      enableSorting: false,
      header: () => <span className="text-xs font-medium text-muted-foreground">Trend</span>,
      cell: ({ row }) => {
        if (row.original.campaignType !== "sales") return <span className="text-muted-foreground text-sm">--</span>;
        return <RoasSparkline points={dailyInsightsByCampaign[row.original.campaignId] ?? []} />;
      },
    },
    {
      id: "marginal",
      accessorFn: (row) => computeMarginalRoas(dailyInsightsByCampaign[row.campaignId] ?? []),
      header: ({ column }) => <ColumnHeader column={column} title="Marginal" className="justify-end" />,
      cell: ({ row, getValue }) => {
        if (row.original.campaignType !== "sales") return <div className="text-right"><span className="text-muted-foreground text-sm">--</span></div>;
        const m = getValue<number | null>();
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
