"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExternalLink, RefreshCw } from "lucide-react";
import { StatusSelect } from "@/components/admin/status-select";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  fmtUsd,
  fmtNum,
  centsToUsd,
  slugToLabel,
  fmtObjective,
  computeMarginalRoas,
  roasColor,
  type SnapshotPoint,
} from "@/lib/formatters";
import {
  updateCampaignStatus,
  assignCampaignClient,
  syncCampaignToMeta,
} from "@/app/admin/actions/campaigns";
import type { MetaCampaign } from "@/app/admin/campaigns/data";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";

// ---- Helpers (moved from page.tsx) ----

function BudgetBar({ spend, budget }: { spend: number | null; budget: number | null }) {
  if (spend == null || budget == null) {
    return <span className="text-xs text-muted-foreground tabular-nums">{fmtUsd(spend)}</span>;
  }
  const pct = Math.min(100, Math.round((spend / budget) * 100));
  const color = pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-blue-500";
  return (
    <div className="min-w-[100px]">
      <div className="flex justify-between text-xs mb-1">
        <span className="tabular-nums">{fmtUsd(spend)}</span>
        <span className="text-muted-foreground tabular-nums">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="text-xs text-muted-foreground mt-1 tabular-nums">of {fmtUsd(budget)}</div>
    </div>
  );
}

function RoasBadge({ roas }: { roas: number | null }) {
  if (roas == null) return <span className="text-sm text-muted-foreground">--</span>;
  return <span className={`text-sm font-semibold tabular-nums ${roasColor(roas)}`}>{roas.toFixed(1)}x</span>;
}

function RoasSparkline({ points }: { points: SnapshotPoint[] }) {
  const vals = points.map((p) => p.roas).filter((v): v is number => v != null);
  if (vals.length < 2) return null;

  const W = 52, H = 18, PAD = 2;
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;

  const coords = vals.map((v, i) => {
    const x = PAD + (i / (vals.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((v - min) / range) * (H - PAD * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const first = vals[0], last = vals[vals.length - 1];
  const trend = last > first + 0.05 ? "up" : last < first - 0.05 ? "down" : "flat";
  const stroke = trend === "up" ? "#34d399" : trend === "down" ? "#f87171" : "#71717a";
  const delta = last - first;
  const deltaStr = (delta >= 0 ? "+" : "") + delta.toFixed(1) + "x";
  const deltaColor = trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-zinc-400";

  return (
    <div className="flex items-center gap-1.5">
      <svg width={W} height={H} className="shrink-0">
        <polyline
          points={coords.join(" ")}
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={coords[coords.length - 1].split(",")[0]} cy={coords[coords.length - 1].split(",")[1]} r="2" fill={stroke} />
      </svg>
      <span className={`text-[10px] tabular-nums font-medium ${deltaColor}`}>{deltaStr}</span>
    </div>
  );
}

// ---- Sync button with loading spinner ----

function SyncButton({ campaignId, status, dailyBudget }: { campaignId: string; status: string; dailyBudget: number | null }) {
  const [syncing, setSyncing] = useState(false);

  return (
    <ConfirmDialog
      trigger={
        <button
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Sync to Meta"
        >
          {syncing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
        </button>
      }
      title="Sync campaign to Meta?"
      description="This will push the current status and budget to the Meta Marketing API."
      confirmLabel="Sync"
      variant="default"
      onConfirm={async () => {
        setSyncing(true);
        try {
          const changes: { status?: string; dailyBudgetCents?: number } = { status };
          if (dailyBudget != null) changes.dailyBudgetCents = dailyBudget;
          await syncCampaignToMeta(campaignId, changes);
          toast.success("Synced to Meta");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Sync failed");
        } finally {
          setSyncing(false);
        }
      }}
    />
  );
}

// ---- Main component ----

interface CampaignTableProps {
  campaigns: MetaCampaign[];
  snapshotsByCampaign: Record<string, SnapshotPoint[]>;
  clients: string[];
  metaAdAccountId: string | null;
  fromDb: boolean;
}

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "PAUSED", label: "Paused" },
];

export function CampaignTable({ campaigns, snapshotsByCampaign, clients, metaAdAccountId, fromDb }: CampaignTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border/60 hover:bg-transparent">
          <TableHead className="text-xs font-medium text-muted-foreground">Campaign</TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">Client</TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">Budget spent</TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground text-right">ROAS</TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">Trend</TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground text-right">Marginal</TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground text-right">Impressions</TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground text-right">CTR</TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground text-right">CPC</TableHead>
          <TableHead className="w-8" />
          <TableHead className="w-8" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.length === 0 ? (
          <TableRow>
            <TableCell colSpan={12} className="py-12 text-center text-xs text-muted-foreground">
              {fromDb ? "No campaigns match this filter" : "No campaign data -- run the Meta sync agent to pull live data"}
            </TableCell>
          </TableRow>
        ) : (
          campaigns.map((c) => (
            <TableRow key={c.id} className="border-border/60">
              <TableCell>
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{fmtObjective(c.objective)}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <StatusSelect
                  value={c.status}
                  options={STATUS_OPTIONS}
                  onSave={async (newStatus) => {
                    try {
                      await updateCampaignStatus({ campaignId: c.campaign_id, status: newStatus });
                      toast.success(`Status updated to ${newStatus}`);
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : "Failed to update status");
                    }
                  }}
                />
              </TableCell>
              <TableCell>
                <ClientSelect
                  value={c.client_slug ?? ""}
                  clients={clients}
                  onSave={async (slug) => {
                    try {
                      await assignCampaignClient({ campaignId: c.campaign_id, clientSlug: slug });
                      toast.success(slug ? `Assigned to ${slugToLabel(slug)}` : "Client unassigned");
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : "Failed to assign client");
                    }
                  }}
                />
              </TableCell>
              <TableCell>
                <BudgetBar
                  spend={centsToUsd(c.spend)}
                  budget={centsToUsd(c.lifetime_budget ?? c.daily_budget)}
                />
              </TableCell>
              <TableCell className="text-right">
                <RoasBadge roas={c.roas} />
              </TableCell>
              <TableCell>
                <RoasSparkline points={snapshotsByCampaign[c.campaign_id] ?? []} />
              </TableCell>
              <TableCell className="text-right">
                {(() => {
                  const m = computeMarginalRoas(snapshotsByCampaign[c.campaign_id] ?? []);
                  if (m == null) return <span className="text-muted-foreground text-sm">--</span>;
                  return <span className={`text-sm font-semibold tabular-nums ${roasColor(m)}`}>{m.toFixed(1)}x</span>;
                })()}
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground tabular-nums">
                {fmtNum(c.impressions)}
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground tabular-nums">
                {c.ctr != null ? c.ctr.toFixed(2) + "%" : "--"}
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground tabular-nums">
                {c.cpc != null ? "$" + c.cpc.toFixed(2) : "--"}
              </TableCell>
              <TableCell>
                <SyncButton
                  campaignId={c.campaign_id}
                  status={c.status}
                  dailyBudget={c.daily_budget}
                />
              </TableCell>
              <TableCell>
                {metaAdAccountId ? (
                  <a
                    href={`https://www.facebook.com/adsmanager/manage/campaigns?act=${metaAdAccountId}&selected_campaign_ids=${c.campaign_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

// ---- Client dropdown ----

function ClientSelect({ value, clients, onSave }: { value: string; clients: string[]; onSave: (slug: string) => Promise<void> }) {
  const [saving, setSaving] = useState(false);

  async function handleChange(newValue: string) {
    if (newValue === value) return;
    setSaving(true);
    try {
      await onSave(newValue);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        disabled={saving}
        className="h-7 rounded border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
      >
        <option value="">Unassigned</option>
        {clients.map((slug) => (
          <option key={slug} value={slug}>{slugToLabel(slug)}</option>
        ))}
      </select>
      {saving && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
    </div>
  );
}
