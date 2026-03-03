"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarDays, ExternalLink } from "lucide-react";
import { Loader2 } from "lucide-react";
import { StatusSelect } from "@/components/admin/status-select";
import { InlineEdit } from "@/components/admin/inline-edit";
import { fmtDate, fmtUsd, slugToLabel } from "@/lib/formatters";
import { matchedCampaigns } from "@/lib/campaign-event-match";
import {
  updateEventStatus,
  assignEventClient,
  updateEventTickets,
} from "@/app/admin/actions/events";
import type { TmEventRow, DemoRow, CampaignRow } from "@/app/admin/events/data";
import { toast } from "sonner";
import { useState } from "react";

// ---- Helpers (moved from page.tsx) ----

function SellBarVisual({ sold, available }: { sold: number | null; available: number | null }) {
  if (sold == null || available == null) return null;
  const capacity = sold + available;
  if (capacity === 0) return null;
  const pct = Math.round((sold / capacity) * 100);
  const barColor = pct >= 90 ? "bg-purple-500" : pct >= 60 ? "bg-emerald-500" : pct >= 30 ? "bg-blue-500" : "bg-zinc-600";
  return (
    <div className="mt-1">
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5 tabular-nums">
        <span>{pct}%</span>
        <span>of {capacity.toLocaleString()}</span>
      </div>
    </div>
  );
}

// ---- Client dropdown ----

function ClientSelect({ value, clients, onSave }: { value: string; clients: string[]; onSave: (slug: string) => Promise<void> }) {
  const [saving, setSaving] = useState(false);

  async function handleChange(newValue: string) {
    if (newValue === value) return;
    setSaving(true);
    try {
      await onSave(newValue);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        disabled={saving}
        className="h-7 rounded border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
      >
        <option value="">Unassigned</option>
        {clients.map((slug) => (
          <option key={slug} value={slug}>{slugToLabel(slug)}</option>
        ))}
      </select>
      {saving && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
    </div>
  );
}

// ---- Main component ----

const EVENT_STATUS_OPTIONS = [
  { value: "onsale", label: "On Sale" },
  { value: "offsale", label: "Off Sale" },
  { value: "cancelled", label: "Cancelled" },
  { value: "postponed", label: "Postponed" },
  { value: "rescheduled", label: "Rescheduled" },
];

interface EventTableProps {
  events: TmEventRow[];
  clients: string[];
  demoMap: Record<string, DemoRow>;
  campaigns: CampaignRow[];
  fromDb: boolean;
}

export function EventTable({ events, clients, demoMap, campaigns, fromDb }: EventTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border/60 hover:bg-transparent">
          <TableHead className="text-xs font-medium text-muted-foreground w-28">TM1 #</TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">Artist / Event</TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">Client</TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">Venue</TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">City</TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">Date</TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">Sell-through</TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground text-right">Gross</TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">Ads</TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground text-right">Fans</TableHead>
          <TableHead className="w-8" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.length === 0 ? (
          <TableRow>
            <TableCell colSpan={12}>
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CalendarDays className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm font-medium mb-1">No events yet</p>
                <p className="text-xs text-muted-foreground mb-4 max-w-xs">
                  {fromDb
                    ? "No events match this filter"
                    : "Start the agent on your Mac to pull events from the Ticketmaster promoter portal"}
                </p>
                {!fromDb && (
                  <code className="text-xs bg-muted px-3 py-2 rounded">cd agent && npm start</code>
                )}
              </div>
            </TableCell>
          </TableRow>
        ) : (
          events.map((e) => (
            <TableRow key={e.id} className="border-border/60">
              <TableCell className="font-mono text-xs text-muted-foreground">{e.tm1_number || "--"}</TableCell>
              <TableCell>
                <div>
                  <p className="text-sm font-medium">{e.artist}</p>
                  <p className="text-xs text-muted-foreground">{e.name}</p>
                </div>
              </TableCell>
              <TableCell>
                <ClientSelect
                  value={e.client_slug ?? ""}
                  clients={clients}
                  onSave={async (slug) => {
                    try {
                      await assignEventClient({ eventId: e.id, clientSlug: slug });
                      toast.success(slug ? `Assigned to ${slugToLabel(slug)}` : "Client unassigned");
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : "Failed to assign client");
                    }
                  }}
                />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{e.venue}</TableCell>
              <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{e.city}</TableCell>
              <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{fmtDate(e.date)}</TableCell>
              <TableCell>
                <div className="min-w-[120px]">
                  <InlineEdit
                    value={e.tickets_sold}
                    type="number"
                    suffix=" sold"
                    className="text-sm font-medium tabular-nums"
                    onSave={async (val) => {
                      const parsed = val === "" ? null : parseInt(val, 10);
                      try {
                        await updateEventTickets({
                          eventId: e.id,
                          ticketsSold: parsed,
                          ticketsAvailable: e.tickets_available,
                        });
                        toast.success("Tickets updated");
                      } catch (err) {
                        toast.error(err instanceof Error ? err.message : "Failed to update tickets");
                      }
                    }}
                  />
                  <SellBarVisual sold={e.tickets_sold} available={e.tickets_available} />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <p className="text-sm font-medium tabular-nums">{fmtUsd(e.gross)}</p>
              </TableCell>
              <TableCell>
                <StatusSelect
                  value={(e.status ?? "").toLowerCase()}
                  options={EVENT_STATUS_OPTIONS}
                  onSave={async (newStatus) => {
                    try {
                      await updateEventStatus({ eventId: e.id, status: newStatus });
                      toast.success(`Status updated to ${newStatus}`);
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : "Failed to update status");
                    }
                  }}
                />
              </TableCell>
              <TableCell>
                {(() => {
                  const linked = matchedCampaigns(campaigns, e);
                  const active = linked.filter((c) => c.status === "ACTIVE");
                  if (active.length === 0 && linked.length === 0) {
                    return <span className="text-muted-foreground">--</span>;
                  }
                  if (active.length === 0) {
                    return <span className="text-xs text-muted-foreground">paused</span>;
                  }
                  const avgRoas = active.reduce((s, c) => s + (c.roas ?? 0), 0) / active.length;
                  const totalSpend = active.reduce((s, c) => s + ((c.spend ?? 0) / 100), 0);
                  return (
                    <div>
                      <span className="text-xs font-medium text-emerald-400">{active.length} active</span>
                      <div className="text-xs text-muted-foreground tabular-nums">
                        {avgRoas > 0 ? avgRoas.toFixed(1) + "x " : ""}
                        ${Math.round(totalSpend / 1000)}K
                      </div>
                    </div>
                  );
                })()}
              </TableCell>
              <TableCell className="text-right">
                {demoMap[e.tm_id]?.fans_total != null ? (
                  <span className="text-sm tabular-nums font-medium">
                    {(demoMap[e.tm_id].fans_total ?? 0).toLocaleString()}
                  </span>
                ) : (
                  <span className="text-muted-foreground">--</span>
                )}
              </TableCell>
              <TableCell>
                {e.url ? (
                  <a href={e.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
