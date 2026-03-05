"use client";

import { useState } from "react";
import { Search, Ticket } from "lucide-react";
import { EventCard } from "../components/event-card";
import type { EventCard as EventCardData } from "../types";

type StatusFilter = "onsale" | "offsale" | "all";

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "onsale", label: "On Sale" },
  { value: "offsale", label: "Off Sale" },
  { value: "all", label: "All" },
];

function normalizeStatus(status: string): string {
  return (status ?? "").toLowerCase().replace(/_/g, "");
}

function matchesFilter(event: EventCardData, filter: StatusFilter): boolean {
  if (filter === "all") return true;
  return normalizeStatus(event.status) === filter;
}

function matchesSearch(event: EventCardData, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    event.name.toLowerCase().includes(q) ||
    event.city.toLowerCase().includes(q) ||
    event.venue.toLowerCase().includes(q)
  );
}

export function EventsFilter({
  events,
  slug,
  initialStatus,
  initialQuery,
}: {
  events: EventCardData[];
  slug: string;
  initialStatus?: string;
  initialQuery?: string;
}) {
  const validStatuses: StatusFilter[] = ["onsale", "offsale", "all"];
  const hasOnSale = events.some((e) => normalizeStatus(e.status) === "onsale");
  const defaultFilter = validStatuses.includes(initialStatus as StatusFilter)
    ? (initialStatus as StatusFilter)
    : hasOnSale
      ? "onsale"
      : "all";

  const [filter, setFilter] = useState<StatusFilter>(defaultFilter);
  const [search, setSearch] = useState(initialQuery ?? "");

  const filtered = events.filter(
    (e) => matchesFilter(e, filter) && matchesSearch(e, search),
  );

  const onSaleCt = events.filter((e) => normalizeStatus(e.status) === "onsale").length;
  const offSaleCt = events.filter((e) => normalizeStatus(e.status) === "offsale").length;

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <Ticket className="h-3.5 w-3.5 text-white/50" />
          <span className="section-label">All Events</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="pl-8 pr-3 py-1.5 rounded-lg text-xs bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 focus:border-cyan-500/30 transition w-48"
            />
          </div>

          {/* Status tabs */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
            {FILTERS.map((f) => {
              const count =
                f.value === "onsale"
                  ? onSaleCt
                  : f.value === "offsale"
                    ? offSaleCt
                    : events.length;
              return (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
                    filter === f.value
                      ? "bg-white text-zinc-900 shadow-sm"
                      : "text-white/60 hover:text-white/80 hover:bg-white/[0.06]"
                  }`}
                >
                  {f.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((e) => (
            <EventCard key={e.id} e={e} slug={slug} />
          ))}
        </div>
      ) : (
        <div className="glass-card p-8 text-center">
          <p className="text-sm text-white/60">
            No {filter === "all" ? "" : filter === "onsale" ? "on sale " : "off sale "}
            events
            {search ? ` matching "${search}"` : ""} found.
          </p>
        </div>
      )}
    </section>
  );
}
