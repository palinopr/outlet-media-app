"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function InviteMemberForm({
  clientSlug,
  onDone,
}: {
  clientSlug: string;
  onDone: () => void;
}) {
  const [email, setEmail] = useState("");
  const [clientRole, setClientRole] = useState<"owner" | "member">("member");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, client_slug: clientSlug, client_role: clientRole }),
      });
      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        throw new Error(d.error ?? "Failed to send invite");
      }
      setSent(true);
      toast.success("Invite sent to " + email);
      setTimeout(() => {
        onDone();
      }, 1500);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to send invite",
      );
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-400 py-2">
        <Check className="h-4 w-4" /> Invite sent to {email}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-3 pt-1">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Email</label>
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="member@example.com"
          className="h-8 w-52 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Role</label>
        <select
          value={clientRole}
          onChange={(e) => setClientRole(e.target.value as "owner" | "member")}
          className="h-8 rounded-md border border-border bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="owner">Owner</option>
          <option value="member">Member</option>
        </select>
      </div>
      <Button type="submit" size="sm" disabled={loading} className="h-8">
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          "Send Invite"
        )}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="h-8"
        onClick={onDone}
      >
        Cancel
      </Button>
    </form>
  );
}
