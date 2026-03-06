"use client";

import { ColumnDef } from "@tanstack/react-table";
import { createSelectColumn } from "@/components/admin/data-table/select-column";
import { Eye, MoreHorizontal, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InlineEdit } from "@/components/admin/inline-edit";
import { CopyButton } from "@/components/admin/copy-button";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ColumnHeader } from "@/components/admin/data-table/column-header";
import { fmtUsd, roasColor, statusBadge } from "@/lib/formatters";
import { renameClient, deactivateClient } from "@/app/admin/actions/clients";
import { toast } from "sonner";
import type { ClientSummary } from "@/app/admin/clients/data";

export const clientColumns: ColumnDef<ClientSummary>[] = [
  createSelectColumn<ClientSummary>(),
  {
    accessorKey: "name",
    header: ({ column }) => <ColumnHeader column={column} title="Client" />,
    cell: ({ row }) => {
      const c = row.original;
      const joined = new Date(c.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      return (
        <div>
          <a
            href={`/admin/clients/${c.id}`}
            className="text-sm font-medium hover:underline"
          >
            {c.name}
          </a>
          <p className="text-xs text-muted-foreground">joined {joined}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "slug",
    header: ({ column }) => <ColumnHeader column={column} title="Slug" />,
    cell: ({ row }) => {
      const c = row.original;
      return (
        <InlineEdit
          value={c.slug}
          className="text-xs text-muted-foreground"
          onSave={async (newSlug) => {
            try {
              await renameClient({ oldSlug: c.slug, newSlug });
              toast.success(`Renamed ${c.slug} to ${newSlug}`);
            } catch (err) {
              toast.error(
                err instanceof Error ? err.message : "Failed to rename client",
              );
              throw err;
            }
          }}
        />
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <ColumnHeader column={column} title="Status" />,
    cell: ({ row }) => statusBadge(row.original.status),
  },
  {
    accessorKey: "memberCount",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Members" className="justify-end" />
    ),
    cell: ({ row }) => (
      <div className="text-right text-sm tabular-nums">
        {row.original.memberCount}
      </div>
    ),
  },
  {
    accessorKey: "activeShows",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Shows" className="justify-end" />
    ),
    cell: ({ row }) => (
      <div className="text-right text-sm tabular-nums">
        {row.original.activeShows}
      </div>
    ),
  },
  {
    accessorKey: "activeCampaigns",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Campaigns" className="justify-end" />
    ),
    cell: ({ row }) => (
      <div className="text-right text-sm tabular-nums">
        {row.original.activeCampaigns}
      </div>
    ),
  },
  {
    accessorKey: "needsAttention",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Workflow" className="justify-end" />
    ),
    cell: ({ row }) => {
      const client = row.original;
      const needsAttention = client.needsAttention;
      const detail =
        client.pendingApprovals > 0
          ? `${client.pendingApprovals} approvals`
          : client.openDiscussions > 0
            ? `${client.openDiscussions} discussions`
            : client.openActionItems > 0
              ? `${client.openActionItems} next steps`
              : client.assetsNeedingReview > 0
                ? `${client.assetsNeedingReview} assets`
                : "Clear";

      return (
        <div className="text-right">
          <span
            className={`text-sm font-semibold tabular-nums ${
              needsAttention > 0 ? "text-amber-400" : "text-emerald-400"
            }`}
          >
            {needsAttention}
          </span>
          <p className="text-[11px] text-muted-foreground">{detail}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "totalSpend",
    header: ({ column }) => (
      <ColumnHeader
        column={column}
        title="Total Spend"
        className="justify-end"
      />
    ),
    cell: ({ row }) => (
      <div className="text-right text-sm font-medium tabular-nums">
        {fmtUsd(row.original.totalSpend)}
      </div>
    ),
  },
  {
    accessorKey: "totalRevenue",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Revenue" className="justify-end" />
    ),
    cell: ({ row }) => (
      <div className="text-right text-sm font-medium tabular-nums">
        {fmtUsd(row.original.totalRevenue)}
      </div>
    ),
  },
  {
    accessorKey: "roas",
    header: ({ column }) => (
      <ColumnHeader column={column} title="ROAS" className="justify-end" />
    ),
    cell: ({ row }) => {
      const roas = row.original.roas;
      return (
        <div className="text-right">
          <span
            className={`text-sm font-semibold tabular-nums ${roasColor(roas)}`}
          >
            {roas > 0 ? roas.toFixed(1) + "x" : "\u2014"}
          </span>
        </div>
      );
    },
  },
  {
    id: "portal",
    header: () => (
      <span className="text-xs font-medium text-muted-foreground">Portal</span>
    ),
    enableHiding: false,
    cell: ({ row }) => {
      const c = row.original;
      const portalUrl = `/client/${c.slug}`;
      return (
        <div className="flex items-center gap-3">
          <a
            href={portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            View Portal
          </a>
          <CopyButton text={portalUrl} />
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const c = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href={`/admin/clients/${c.id}`} className="text-xs">
                Client details
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a
                href={`/client/${c.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs"
              >
                <ExternalLink className="mr-2 h-3 w-3" />
                View portal
              </a>
            </DropdownMenuItem>
            {c.activeCampaigns > 0 && (
              <>
                <DropdownMenuSeparator />
                <ConfirmDialog
                  trigger={
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="text-xs text-red-400 focus:text-red-300"
                    >
                      Deactivate campaigns
                    </DropdownMenuItem>
                  }
                  title="Deactivate Client"
                  description={`This will pause all active campaigns for ${c.name}. Continue?`}
                  confirmLabel="Deactivate"
                  variant="destructive"
                  onConfirm={async () => {
                    try {
                      await deactivateClient({ slug: c.slug });
                      toast.success(`All campaigns paused for ${c.name}`);
                    } catch (err) {
                      toast.error(
                        err instanceof Error
                          ? err.message
                          : "Failed to deactivate client",
                      );
                    }
                  }}
                />
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
