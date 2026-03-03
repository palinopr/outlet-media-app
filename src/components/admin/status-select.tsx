"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  value: string;
  options: { value: string; label: string }[];
  onSave: (value: string) => Promise<void>;
}

export function StatusSelect({ value, options, onSave }: Props) {
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
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {saving && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
    </div>
  );
}
