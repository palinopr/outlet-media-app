"use client";

import {
  fmtUsd,
  roasColor,
  slugToLabel,
  type SnapshotPoint,
} from "@/lib/formatters";
import { StatusSelect } from "@/components/admin/status-select";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { syncCampaignToMeta } from "@/app/admin/actions/campaigns";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";

export type { SnapshotPoint };

export function BudgetBar({ spend, dailyBudget, lifetimeBudget }: { spend: number | null; dailyBudget: number | null; lifetimeBudget: number | null }) {
  if (spend == null) {
    return <span className="text-xs text-muted-foreground tabular-nums">--</span>;
  }

  if (lifetimeBudget != null && lifetimeBudget > 0) {
    const pct = Math.min(100, Math.round((spend / lifetimeBudget) * 100));
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
        <div className="text-xs text-muted-foreground mt-1 tabular-nums">of {fmtUsd(lifetimeBudget)}</div>
      </div>
    );
  }

  return (
    <div className="min-w-[100px]">
      <span className="text-xs tabular-nums">{fmtUsd(spend)}</span>
      {dailyBudget != null && dailyBudget > 0 && (
        <div className="text-xs text-muted-foreground mt-0.5 tabular-nums">{fmtUsd(dailyBudget)}/day</div>
      )}
    </div>
  );
}

export function RoasBadge({ roas }: { roas: number | null }) {
  if (roas == null) return <span className="text-sm text-muted-foreground">--</span>;
  return <span className={`text-sm font-semibold tabular-nums ${roasColor(roas)}`}>{roas.toFixed(1)}x</span>;
}

export function RoasSparkline({ points }: { points: SnapshotPoint[] }) {
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

export function SyncButton({ campaignId, status, dailyBudget }: { campaignId: string; status: string; dailyBudget: number | null }) {
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

export function ClientSelect({ value, clients, onSave }: { value: string; clients: string[]; onSave: (slug: string) => Promise<void> }) {
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
