"use client";

import { useState } from "react";
import { Megaphone } from "lucide-react";
import { CampaignCard } from "./campaign-card";
import type { CampaignCard as CampaignCardData } from "../types";
import type { DateRange } from "@/lib/constants";

type StatusFilter = "active" | "paused" | "all";

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "all", label: "All" },
];

export function CampaignSection({
  campaigns,
  slug,
  range,
  rangeLabel,
}: {
  campaigns: CampaignCardData[];
  slug: string;
  range: DateRange;
  rangeLabel: string;
}) {
  const hasActive = campaigns.some((c) => c.status === "ACTIVE");
  const [filter, setFilter] = useState<StatusFilter>(hasActive ? "active" : "all");

  const filtered = campaigns.filter((c) => {
    if (filter === "active") return c.status === "ACTIVE";
    if (filter === "paused") return c.status === "PAUSED";
    return true;
  });

  // Active campaigns first, then by start time descending
  const sorted = [...filtered].sort((a, b) => {
    if (a.status === "ACTIVE" && b.status !== "ACTIVE") return -1;
    if (a.status !== "ACTIVE" && b.status === "ACTIVE") return 1;
    const aTime = a.startTime ? new Date(a.startTime).getTime() : 0;
    const bTime = b.startTime ? new Date(b.startTime).getTime() : 0;
    return bTime - aTime;
  });

  const activeCt = campaigns.filter((c) => c.status === "ACTIVE").length;
  const pausedCt = campaigns.filter((c) => c.status === "PAUSED").length;

  return (
    <section>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Megaphone className="h-3.5 w-3.5 text-white/50" />
          <span className="section-label">Your Campaigns</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
            {FILTERS.map((f) => {
              const count =
                f.value === "active" ? activeCt : f.value === "paused" ? pausedCt : campaigns.length;
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
          <span className="text-xs text-white/45">{rangeLabel}</span>
        </div>
      </div>

      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((c) => (
            <CampaignCard key={c.campaignId} c={c} slug={slug} range={range} />
          ))}
        </div>
      ) : (
        <div className="glass-card p-8 text-center">
          <p className="text-sm text-white/60">
            No {filter === "all" ? "" : filter} campaigns found.
          </p>
        </div>
      )}
    </section>
  );
}
