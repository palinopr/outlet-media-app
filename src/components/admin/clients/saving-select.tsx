"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";

interface Option {
  value: string;
  label: string;
}

interface SavingSelectProps {
  currentValue: string;
  options: Option[];
  onSave: (newValue: string) => Promise<void>;
  successMessage: (value: string) => string;
  errorMessage: string;
}

export function SavingSelect({
  currentValue,
  options,
  onSave,
  successMessage,
  errorMessage,
}: SavingSelectProps) {
  const [value, setValue] = useState(currentValue);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleChange(newValue: string) {
    if (newValue === value) return;
    setValue(newValue);
    setSaving(true);
    setSaved(false);
    try {
      await onSave(newValue);
      setSaved(true);
      toast.success(successMessage(newValue));
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : errorMessage,
      );
      setValue(currentValue);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="h-7 rounded border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {saving && (
        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
      )}
      {saved && <Check className="h-3 w-3 text-emerald-400" />}
    </div>
  );
}
