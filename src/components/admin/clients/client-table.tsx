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
import { Input } from "@/components/ui/input";
import { ExternalLink, Plus, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { CopyButton } from "@/components/admin/copy-button";
import { InlineEdit } from "@/components/admin/inline-edit";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { renameClient, deactivateClient, createClient } from "@/app/admin/actions/clients";
import { fmtUsd, statusBadge, roasColor } from "@/lib/formatters";
import { toSlug } from "@/lib/to-slug";
import type { ClientSummary } from "@/app/admin/clients/data";

interface Props {
  clients: ClientSummary[];
}

// ─── Create client form ─────────────────────────────────────────────────────

function CreateClientForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);

  function handleNameChange(val: string) {
    setName(val);
    setSlug(toSlug(val));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await createClient({ name: name.trim(), slug });
      setCreated(true);
      toast.success(`Client "${name.trim()}" created`);
      setTimeout(() => { onDone(); }, 1500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create client");
    } finally {
      setLoading(false);
    }
  }

  if (created) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-400 py-2">
        <Check className="h-4 w-4" /> Client created
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-3 pt-1">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Name</label>
        <Input
          required
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Acme Events"
          className="h-8 w-48 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Slug</label>
        <Input
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="acme_events"
          className="h-8 w-40 text-sm"
        />
      </div>
      <Button type="submit" size="sm" disabled={loading} className="h-8">
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Create"}
      </Button>
      <Button type="button" size="sm" variant="ghost" className="h-8" onClick={onDone}>
        Cancel
      </Button>
    </form>
  );
}

// ─── Main table ──────────────────────────────────────────────────────────────

export function ClientTable({ clients }: Props) {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">All Clients</h2>
      </div>

      {/* Create client bar */}
      <div className="mb-4">
        {showCreate ? (
          <CreateClientForm onDone={() => setShowCreate(false)} />
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="gap-2 h-8 text-xs"
            onClick={() => setShowCreate(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            Create Client
          </Button>
        )}
      </div>

      <Card className="border-border/60">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground">Client</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Slug</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground text-right">Members</TableHead>
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
              const joined = new Date(c.createdAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              });
              return (
                <TableRow key={c.id} className="border-border/60">
                  <TableCell>
                    <div>
                      <a
                        href={`/admin/clients/${c.id}`}
                        className="text-sm font-medium hover:underline"
                      >
                        {c.name}
                      </a>
                      <p className="text-xs text-muted-foreground">
                        joined {joined}
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
                    {c.memberCount}
                  </TableCell>
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
