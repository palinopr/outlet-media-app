"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { slugToLabel } from "@/lib/formatters";

export function SellBarVisual({ sold, available }: { sold: number | null; available: number | null }) {
  if (sold == null || available == null) return null;
  const capacity = sold + available;
  if (capacity === 0) return null;
  const pct = Math.round((sold / capacity) * 100);
  const barColor = pct >= 90 ? "bg-purple-500" : pct >= 60 ? "bg-emerald-500" : pct >= 30 ? "bg-blue-500" : "bg-zinc-600";
  return (
    <div className="mt-1">
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5 tabular-nums">
        <span>{pct}%</span>
        <span>of {capacity.toLocaleString()}</span>
      </div>
    </div>
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
