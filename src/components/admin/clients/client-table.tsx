"use client";

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
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { CopyButton } from "@/components/admin/copy-button";
import { InlineEdit } from "@/components/admin/inline-edit";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { renameClient, deactivateClient } from "@/app/admin/actions/clients";
import { fmtUsd, statusBadge, roasColor } from "@/lib/formatters";

interface ClientSummary {
  id: string;
  name: string;
  slug: string;
  type: string;
  status: string;
  joinedAt: string;
  activeShows: number;
  activeCampaigns: number;
  totalSpend: number;
  totalRevenue: number;
  roas: number;
}

interface Props {
  clients: ClientSummary[];
}

export function ClientTable({ clients }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">All Clients</h2>
      </div>
      <Card className="border-border/60">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground">Client</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Slug</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground text-right">Shows</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground text-right">Campaigns</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground text-right">Total Spend</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground text-right">Revenue</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground text-right">ROAS</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Portal</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((c) => {
              const portalUrl = `/client/${c.slug}`;
              return (
                <TableRow key={c.id} className="border-border/60">
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.type} &middot; joined {c.joinedAt}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <InlineEdit
                      value={c.slug}
                      className="text-xs text-muted-foreground"
                      onSave={async (newSlug) => {
                        try {
                          await renameClient({ oldSlug: c.slug, newSlug });
                          toast.success(`Renamed ${c.slug} to ${newSlug}`);
                        } catch (err) {
                          toast.error(err instanceof Error ? err.message : "Failed to rename client");
                          throw err;
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>{statusBadge(c.status)}</TableCell>
                  <TableCell className="text-right text-sm tabular-nums">
                    {c.activeShows}
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums">
                    {c.activeCampaigns}
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium tabular-nums">
                    {fmtUsd(c.totalSpend)}
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium tabular-nums">
                    {fmtUsd(c.totalRevenue)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`text-sm font-semibold tabular-nums ${roasColor(c.roas)}`}>
                      {c.roas > 0 ? c.roas.toFixed(1) + "x" : "\u2014"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <a
                        href={portalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Open
                      </a>
                      <CopyButton text={`/client/${c.slug}`} />
                    </div>
                  </TableCell>
                  <TableCell>
                    {c.activeCampaigns > 0 && (
                      <ConfirmDialog
                        trigger={
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-red-400 hover:text-red-300">
                            Deactivate
                          </Button>
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
                            toast.error(err instanceof Error ? err.message : "Failed to deactivate client");
                          }
                        }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
