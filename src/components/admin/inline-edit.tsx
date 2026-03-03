"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";

interface Props {
  value: string | number | null;
  type?: "text" | "number";
  prefix?: string;
  suffix?: string;
  onSave: (value: string) => Promise<void>;
  className?: string;
}

export function InlineEdit({ value, type = "text", prefix, suffix, onSave, className = "" }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value ?? ""));
  const [saving, setSaving] = useState(false);

  if (!editing) {
    return (
      <button
        onClick={() => { setDraft(String(value ?? "")); setEditing(true); }}
        className={`text-left hover:bg-muted/50 px-1 -mx-1 rounded transition-colors cursor-pointer ${className}`}
        title="Click to edit"
      >
        {prefix}{value ?? "\u2014"}{suffix}
      </button>
    );
  }

  async function save() {
    setSaving(true);
    try {
      await onSave(draft);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <input
        autoFocus
        type={type}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
        className="h-7 w-24 rounded border border-border bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
      />
      {saving ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
      ) : (
        <>
          <button onClick={save} className="text-emerald-400 hover:text-emerald-300"><Check className="h-3.5 w-3.5" /></button>
          <button onClick={() => setEditing(false)} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
        </>
      )}
    </div>
  );
}
