"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { changeClientMemberScope } from "@/app/admin/actions/clients";

export function ScopeSelect({
  memberId,
  currentScope,
}: {
  memberId: string;
  currentScope: string;
}) {
  const [value, setValue] = useState(currentScope);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleChange(newScope: string) {
    if (newScope === value) return;
    setValue(newScope);
    setSaving(true);
    setSaved(false);
    try {
      await changeClientMemberScope({ memberId, scope: newScope });
      setSaved(true);
      toast.success(`Scope updated to ${newScope}`);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to change scope",
      );
      setValue(currentScope);
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
        <option value="all">All</option>
        <option value="assigned">Assigned only</option>
      </select>
      {saving && (
        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
      )}
      {saved && <Check className="h-3 w-3 text-emerald-400" />}
    </div>
  );
}
