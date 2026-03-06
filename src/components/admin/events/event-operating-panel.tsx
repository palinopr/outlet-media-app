"use client";

import Link from "next/link";
import { ExternalLink, Ticket } from "lucide-react";
import { toast } from "sonner";
import { assignEventClient, updateEventStatus, updateEventTickets } from "@/app/admin/actions/events";
import { InlineEdit } from "@/components/admin/inline-edit";
import { StatusSelect } from "@/components/admin/status-select";
import { ClientSelect, SellBarVisual } from "@/components/admin/events/event-cells";
import type { EventClientOption, EventOperatingRecord } from "@/features/events/server";
import { fmtDate, fmtUsd, slugToLabel } from "@/lib/formatters";
import { EVENT_STATUS_OPTIONS } from "@/lib/constants";

interface EventOperatingPanelProps {
  clients: EventClientOption[];
  event: EventOperatingRecord;
}

export function EventOperatingPanel({ clients, event }: EventOperatingPanelProps) {
  return (
    <section className="rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#787774]">Operations</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#2f2f2f]">
            Event controls
          </h2>
          <p className="mt-1 text-sm text-[#9b9a97]">
            Manage ticketing state, client assignment, and core event details from one place.
          </p>
        </div>
        {event.url ? (
          <a
            href={event.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-border/70 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Open event page
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[#9b9a97]">Status</p>
          <div className="mt-3">
            <StatusSelect
              value={event.status.toLowerCase()}
              options={EVENT_STATUS_OPTIONS}
              onSave={async (status) => {
                try {
                  await updateEventStatus({ eventId: event.id, status });
                  toast.success(`Updated event status to ${status}`);
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Failed to update status");
                }
              }}
            />
          </div>
          <p className="mt-3 text-xs text-[#9b9a97]">
            Event date: {fmtDate(event.date)}
          </p>
        </div>

        <div className="rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[#9b9a97]">Client</p>
          <div className="mt-3">
            <ClientSelect
              value={event.clientSlug ?? ""}
              clients={clients.map((client) => client.slug)}
              onSave={async (clientSlug) => {
                try {
                  await assignEventClient({ eventId: event.id, clientSlug });
                  toast.success(
                    clientSlug ? `Assigned to ${slugToLabel(clientSlug)}` : "Client unassigned",
                  );
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Failed to assign client");
                }
              }}
            />
          </div>
          <p className="mt-3 text-xs text-[#9b9a97]">
            TM1 #: <span className="font-mono">{event.tm1Number ?? "--"}</span>
          </p>
        </div>

        <div className="rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[#9b9a97]">Ticket counts</p>
          <div className="mt-3 space-y-3">
            <div>
              <p className="mb-1 text-xs text-[#9b9a97]">Tickets sold</p>
              <InlineEdit
                value={event.ticketsSold}
                type="number"
                className="text-sm font-medium tabular-nums text-[#2f2f2f]"
                onSave={async (value) => {
                  const parsed = value === "" ? null : parseInt(value, 10);
                  try {
                    await updateEventTickets({
                      eventId: event.id,
                      ticketsSold: parsed,
                      ticketsAvailable: event.ticketsAvailable,
                    });
                    toast.success("Tickets sold updated");
                  } catch (error) {
                    toast.error(
                      error instanceof Error ? error.message : "Failed to update tickets sold",
                    );
                  }
                }}
              />
            </div>
            <div>
              <p className="mb-1 text-xs text-[#9b9a97]">Tickets available</p>
              <InlineEdit
                value={event.ticketsAvailable}
                type="number"
                className="text-sm font-medium tabular-nums text-[#2f2f2f]"
                onSave={async (value) => {
                  const parsed = value === "" ? null : parseInt(value, 10);
                  try {
                    await updateEventTickets({
                      eventId: event.id,
                      ticketsSold: event.ticketsSold,
                      ticketsAvailable: parsed,
                    });
                    toast.success("Tickets available updated");
                  } catch (error) {
                    toast.error(
                      error instanceof Error ? error.message : "Failed to update tickets available",
                    );
                  }
                }}
              />
            </div>
            <SellBarVisual sold={event.ticketsSold} available={event.ticketsAvailable} />
          </div>
        </div>

        <div className="rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[#9b9a97]">Revenue snapshot</p>
          <div className="mt-3 space-y-2 text-sm text-[#2f2f2f]">
            <div className="flex items-center justify-between gap-3">
              <span>Gross</span>
              <span className="font-medium tabular-nums">{fmtUsd(event.gross)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Average ticket</span>
              <span className="font-medium tabular-nums">
                {event.avgTicketPrice != null ? `$${event.avgTicketPrice.toFixed(2)}` : "--"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Updated</span>
              <span className="font-medium">{event.updatedAt ? fmtDate(event.updatedAt) : "--"}</span>
            </div>
          </div>
          {event.clientSlug ? (
            <div className="mt-4">
              <Link
                href={`/client/${event.clientSlug}/event/${event.id}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-[#0f7b6c] hover:text-[#0b5e52]"
              >
                Open client view
                <Ticket className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
