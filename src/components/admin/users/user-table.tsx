"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserPlus, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { UserRow } from "@/app/admin/users/data";
import { DataTable } from "@/components/admin/data-table/data-table";
import { getUserColumns, ClientOption } from "./columns";
import { bulkUpdateUserRole } from "@/app/admin/actions/users";
import { slugToLabel } from "@/lib/formatters";
import { exportToCsv, formatDate, todayFilename } from "@/lib/export-csv";

interface Props {
  users: UserRow[];
  clients: ClientOption[];
}

// --- Invite form ---------------------------------------------------------------

function InviteForm({ onDone, clients }: { onDone: () => void; clients: ClientOption[] }) {
  const [email, setEmail] = useState("");
  const [clientSlug, setClientSlug] = useState<string>("");
  const [clientRole, setClientRole] = useState<"owner" | "member">("member");
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
          client_role: asAdmin ? undefined : clientRole,
          role: asAdmin ? "admin" : undefined,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        let msg = "Failed to send invite";
        try { msg = (JSON.parse(text) as { error?: string }).error ?? msg; } catch { /* non-JSON */ }
        throw new Error(msg);
      }
      setSent(true);
      toast.success("Invite sent to " + email);
      setTimeout(() => { onDone(); }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      toast.error(err instanceof Error ? err.message : "Failed to send invite");
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
          <option value="">-- Select client --</option>
          {clients.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
          <option value="__admin__">Admin (Outlet Media team)</option>
        </select>
      </div>
      {!asAdmin && clientSlug && (
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
      )}
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

// --- Selection toolbar -----------------------------------------------------------

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "client", label: "Client" },
];

function UserSelectionToolbar({ selectedRows }: { selectedRows: UserRow[] }) {
  const [selectedRole, setSelectedRole] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleUpdateRole() {
    if (!selectedRole) return;
    const ids = selectedRows.map((r) => r.id);
    startTransition(async () => {
      try {
        await bulkUpdateUserRole({ userIds: ids, role: selectedRole });
        toast.success(`Updated ${ids.length} user(s) to ${selectedRole}`);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update role");
      }
    });
  }

  return (
    <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded px-3 py-1.5">
      <span className="text-xs font-medium whitespace-nowrap">
        {selectedRows.length} selected
      </span>
      <span className="text-xs text-muted-foreground">|</span>
      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
        className="h-7 rounded border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
      >
        <option value="">Set role...</option>
        {ROLE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <button
        onClick={handleUpdateRole}
        disabled={!selectedRole || isPending}
        className="h-7 rounded bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {isPending ? "Saving..." : "Update Role"}
      </button>
    </div>
  );
}

// --- Main table ----------------------------------------------------------------

const userCsvColumns = [
  { header: "Name", accessor: (r: Record<string, unknown>) => String(r.name ?? "") },
  { header: "Email", accessor: (r: Record<string, unknown>) => String(r.email ?? "") },
  { header: "Role", accessor: (r: Record<string, unknown>) => String(r.role ?? "") },
  { header: "Client", accessor: (r: Record<string, unknown>) => String(r.client_slug ?? "") },
  { header: "Joined", accessor: (r: Record<string, unknown>) => formatDate(r.created_at as string | null) },
];

export function UserTable({ users, clients }: Props) {
  const [showInvite, setShowInvite] = useState(false);
  const columns = getUserColumns({ clients });

  return (
    <div>
      <DataTable
        columns={columns}
        data={users}
        searchColumn="name"
        searchPlaceholder="Search users..."
        enableRowSelection
        getRowId={(row) => row.id}
        selectionToolbar={(selectedRows) => (
          <UserSelectionToolbar selectedRows={selectedRows as UserRow[]} />
        )}
        emptyMessage="No users yet. Invite someone to get started."
        onExport={() => exportToCsv(users as unknown as Record<string, unknown>[], userCsvColumns, todayFilename("users"))}
        toolbar={
          showInvite ? (
            <InviteForm onDone={() => setShowInvite(false)} clients={clients} />
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
          )
        }
        mobileCard={(u) => (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-medium truncate">
                {u.name || u.email}
              </p>
              {u.status === "invited" && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border border-amber-400/20 bg-amber-400/10 text-amber-400">
                  Invited
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="text-xs">{u.role ?? "--"}</p>
              </div>
              {u.client_slug && (
                <div>
                  <p className="text-xs text-muted-foreground">Client</p>
                  <p className="text-xs truncate">{slugToLabel(u.client_slug)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      />
    </div>
  );
}
