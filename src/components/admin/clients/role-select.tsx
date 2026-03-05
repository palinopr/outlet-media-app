"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { changeClientMemberRole } from "@/app/admin/actions/clients";

export function RoleSelect({
  memberId,
  currentRole,
}: {
  memberId: string;
  currentRole: string;
}) {
  const [value, setValue] = useState(currentRole);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleChange(newRole: string) {
    if (newRole === value) return;
    setValue(newRole);
    setSaving(true);
    setSaved(false);
    try {
      await changeClientMemberRole({ memberId, role: newRole });
      setSaved(true);
      toast.success(`Role updated to ${newRole}`);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to change role",
      );
      setValue(currentRole);
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
        <option value="owner">Owner</option>
        <option value="member">Member</option>
      </select>
      {saving && (
        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
      )}
      {saved && <Check className="h-3 w-3 text-emerald-400" />}
    </div>
  );
}
