"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColumnHeader } from "@/components/admin/data-table/column-header";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { StatusSelect } from "@/components/admin/status-select";
import { fmtDate } from "@/lib/formatters";
import { changeUserRole, deleteUser, revokeInvitation } from "@/app/admin/actions/users";
import { toast } from "sonner";
import type { UserRow } from "@/app/admin/users/data";

export interface ClientOption {
  id: string;
  name: string;
  slug: string;
}

interface UserColumnsOptions {
  clients: ClientOption[];
}

function AssignCell({ user, clients }: { user: UserRow; clients: ClientOption[] }) {
  const [value, setValue] = useState(user.client_slug ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (user.role === "admin") {
    return <span className="text-xs text-muted-foreground italic">admin -- no client</span>;
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
      toast.success("Client access updated");
      setTimeout(() => setSaved(false), 2000);
    } catch {
      toast.error("Failed to update client access");
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
        <option value="">-- Unassigned --</option>
        {clients.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
      {saving && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
      {saved && <Check className="h-3 w-3 text-emerald-400" />}
    </div>
  );
}

function RevokeButton({ invitationId, email }: { invitationId: string; email: string }) {
  return (
    <ConfirmDialog
      trigger={
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-red-400"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      }
      title="Revoke Invitation"
      description={`This will revoke the pending invitation for ${email}.`}
      confirmLabel="Revoke"
      variant="destructive"
      onConfirm={async () => {
        try {
          await revokeInvitation({ invitationId });
          toast.success(`Invitation revoked for ${email}`);
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Failed to revoke invitation");
        }
      }}
    />
  );
}

export function getUserColumns(opts: UserColumnsOptions): ColumnDef<UserRow>[] {
  const { clients } = opts;

  return [
    {
      accessorKey: "name",
      header: ({ column }) => <ColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        const u = row.original;
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {u.name || <span className="text-muted-foreground italic">No name</span>}
            </span>
            {u.status === "invited" ? (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">
                Invited
              </span>
            ) : u.role !== "admin" && !u.client_slug ? (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                Pending
              </span>
            ) : null}
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => <ColumnHeader column={column} title="Email" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => <ColumnHeader column={column} title="Role" />,
      cell: ({ row }) => {
        const u = row.original;
        if (u.status === "invited") {
          return <span className="text-xs text-muted-foreground italic">{u.role ?? "client"}</span>;
        }
        return (
          <StatusSelect
            value={u.role ?? "client"}
            options={[
              { value: "admin", label: "Admin" },
              { value: "client", label: "Client" },
            ]}
            onSave={async (newRole) => {
              try {
                await changeUserRole({ userId: u.id, role: newRole });
                toast.success(`Role updated to ${newRole}`);
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Failed to change role");
              }
            }}
          />
        );
      },
    },
    {
      accessorKey: "client_slug",
      header: ({ column }) => <ColumnHeader column={column} title="Client Access" />,
      cell: ({ row }) => {
        const u = row.original;
        if (u.status === "invited") {
          return <span className="text-xs text-muted-foreground italic">{u.client_slug ?? "unassigned"}</span>;
        }
        return <AssignCell user={row.original} clients={clients} />;
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => <ColumnHeader column={column} title="Joined" />,
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">{fmtDate(row.original.created_at)}</span>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const u = row.original;
        if (u.status === "invited") {
          return <RevokeButton invitationId={u.id} email={u.email} />;
        }
        return (
          <ConfirmDialog
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            }
            title="Delete User"
            description={`This will permanently delete ${u.name || u.email}. This cannot be undone.`}
            confirmLabel="Delete"
            variant="destructive"
            onConfirm={async () => {
              try {
                await deleteUser({ userId: u.id });
                toast.success(`Deleted ${u.name || u.email}`);
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Failed to delete user");
              }
            }}
          />
        );
      },
    },
  ];
}
