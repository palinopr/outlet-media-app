"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { createSelectColumn } from "@/components/admin/data-table/select-column";
import { Trash2, Loader2, Check, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColumnHeader } from "@/components/admin/data-table/column-header";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { StatusSelect } from "@/components/admin/status-select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { fmtDate, slugToLabel } from "@/lib/formatters";
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
  const [selected, setSelected] = useState<Set<string>>(new Set(user.client_slugs));
  const [busySlug, setBusySlug] = useState<string | null>(null);

  if (user.role === "admin") {
    return <span className="text-xs text-muted-foreground italic">admin -- no client</span>;
  }

  async function toggle(slug: string) {
    const isAdding = !selected.has(slug);
    setBusySlug(slug);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: isAdding ? "add" : "remove", client_slug: slug }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSelected((prev) => {
        const next = new Set(prev);
        if (isAdding) next.add(slug);
        else next.delete(slug);
        return next;
      });
      toast.success(isAdding ? `Added ${slugToLabel(slug)}` : `Removed ${slugToLabel(slug)}`);
    } catch {
      toast.error("Failed to update client access");
    } finally {
      setBusySlug(null);
    }
  }

  const count = selected.size;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 h-7 rounded border border-border bg-background px-2 text-xs hover:bg-accent/50 transition-colors focus:outline-none focus:ring-1 focus:ring-ring">
          {count === 0 ? (
            <span className="text-muted-foreground">Unassigned</span>
          ) : count === 1 ? (
            <span>{clients.find((c) => selected.has(c.slug))?.name ?? selected.values().next().value}</span>
          ) : (
            <span>{count} clients</span>
          )}
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
          {busySlug && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel className="text-xs">Assign clients</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {clients.map((c) => (
          <DropdownMenuCheckboxItem
            key={c.slug}
            checked={selected.has(c.slug)}
            disabled={busySlug !== null}
            onSelect={(e) => e.preventDefault()}
            onCheckedChange={() => toggle(c.slug)}
          >
            {c.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
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
    createSelectColumn<UserRow>(),
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
            ) : u.role !== "admin" && u.client_slugs.length === 0 ? (
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
        return <AssignCell user={u} clients={clients} />;
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
