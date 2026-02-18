"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserPlus, Check, Loader2 } from "lucide-react";

const KNOWN_CLIENTS = ["zamora", "kybba", "beamina", "happy_paws"] as const;
type ClientSlug = (typeof KNOWN_CLIENTS)[number];

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string | null;
  client_slug: string | null;
  created_at: string;
}

interface Props {
  users: UserRow[];
}

// ─── Invite form ──────────────────────────────────────────────────────────────

function InviteForm({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [clientSlug, setClientSlug] = useState<string>("");
  const [asAdmin, setAsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          client_slug: asAdmin ? undefined : clientSlug || undefined,
          role: asAdmin ? "admin" : undefined,
        }),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        throw new Error(d.error ?? "Failed to send invite");
      }
      setSent(true);
      setTimeout(() => { onDone(); }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
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
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="client@example.com"
          className="h-8 rounded-md border border-border bg-background px-3 text-sm w-52 focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Access</label>
        <select
          value={asAdmin ? "__admin__" : clientSlug}
          onChange={(e) => {
            if (e.target.value === "__admin__") {
              setAsAdmin(true);
              setClientSlug("");
            } else {
              setAsAdmin(false);
              setClientSlug(e.target.value);
            }
          }}
          className="h-8 rounded-md border border-border bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">— Select client —</option>
          {KNOWN_CLIENTS.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </option>
          ))}
          <option value="__admin__">Admin (Outlet Media team)</option>
        </select>
      </div>
      {error && <p className="text-xs text-red-400 self-end pb-1">{error}</p>}
      <Button type="submit" size="sm" disabled={loading} className="h-8">
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Send Invite"}
      </Button>
      <Button type="button" size="sm" variant="ghost" className="h-8" onClick={onDone}>
        Cancel
      </Button>
    </form>
  );
}

// ─── Assignment cell ──────────────────────────────────────────────────────────

function AssignCell({ user }: { user: UserRow }) {
  const [value, setValue] = useState(user.client_slug ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (user.role === "admin") {
    return <span className="text-xs text-muted-foreground italic">admin — no client</span>;
  }

  async function save(newVal: string) {
    setValue(newVal);
    setSaving(true);
    setSaved(false);
    try {
      await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_slug: newVal || null }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        onChange={(e) => save(e.target.value)}
        className="h-7 rounded border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
      >
        <option value="">— Unassigned —</option>
        {KNOWN_CLIENTS.map((s) => (
          <option key={s} value={s}>
            {s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </option>
        ))}
      </select>
      {saving && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
      {saved && <Check className="h-3 w-3 text-emerald-400" />}
    </div>
  );
}

// ─── Main table ───────────────────────────────────────────────────────────────

export function UserTable({ users }: Props) {
  const [showInvite, setShowInvite] = useState(false);

  function fmtDate(s: string) {
    return new Date(s).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-4">
      {/* Invite bar */}
      <div className="flex items-center justify-between">
        {showInvite ? (
          <InviteForm onDone={() => setShowInvite(false)} />
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="gap-2 h-8 text-xs"
            onClick={() => setShowInvite(true)}
          >
            <UserPlus className="h-3.5 w-3.5" />
            Invite User
          </Button>
        )}
      </div>

      {/* Table */}
      <Card className="border-border/60">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground">Name</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Email</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Role</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Client Access</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-sm text-muted-foreground">
                  No users yet. Invite someone to get started.
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id} className="border-border/60">
                  <TableCell className="text-sm font-medium">
                    {u.name || <span className="text-muted-foreground italic">No name</span>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    {u.role === "admin" ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border bg-violet-500/10 text-violet-400 border-violet-500/20">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border bg-blue-500/10 text-blue-400 border-blue-500/20">
                        Client
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <AssignCell user={u} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {fmtDate(u.created_at)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
