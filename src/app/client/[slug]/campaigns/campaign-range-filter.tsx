"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CampaignRangeInput, DateRange } from "@/lib/constants";

const QUICK_OPTIONS: Array<{ label: string; value: DateRange }> = [
  { label: "Today", value: "today" },
  { label: "Last 7 days", value: "7" },
  { label: "Lifetime", value: "lifetime" },
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function weekAgoIso() {
  const date = new Date();
  date.setDate(date.getDate() - 6);
  return date.toISOString().slice(0, 10);
}

export function CampaignRangeFilter({
  basePath,
  range,
}: {
  basePath: string;
  range: CampaignRangeInput;
}) {
  const router = useRouter();
  const isCustom = typeof range !== "string";
  const [since, setSince] = useState(isCustom ? range.since : weekAgoIso());
  const [until, setUntil] = useState(isCustom ? range.until : todayIso());
  const activeRange = typeof range === "string" ? range : "custom";

  const customHref = useMemo(() => {
    return `${basePath}?range=custom&since=${encodeURIComponent(since)}&until=${encodeURIComponent(until)}`;
  }, [basePath, since, until]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-0.5 rounded-xl border border-white/[0.12] bg-black/25 p-1 shadow-[0_0_0_1px_rgba(37,99,235,0.08)]">
        {QUICK_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => router.push(`${basePath}?range=${option.value}`)}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
              activeRange === option.value
                ? "bg-blue-600/20 text-blue-200 ring-1 ring-inset ring-blue-500/70"
                : "text-white/62 hover:bg-white/[0.05] hover:text-white"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <form
        className={`flex items-center gap-1 rounded-xl border px-2 py-1 ${
          isCustom
            ? "border-blue-400/35 bg-blue-600/10"
            : "border-white/[0.1] bg-black/25"
        }`}
        onSubmit={(event) => {
          event.preventDefault();
          router.push(customHref);
        }}
      >
        <input
          aria-label="Custom range start"
          id="campaign-range-since"
          name="since"
          className="h-7 w-[8.5rem] rounded-md border border-white/[0.1] bg-black/25 px-2 text-xs text-white/80 outline-none focus:border-blue-400/50"
          max={until}
          onChange={(event) => setSince(event.target.value)}
          type="date"
          value={since}
        />
        <span className="text-xs text-white/35">to</span>
        <input
          aria-label="Custom range end"
          id="campaign-range-until"
          name="until"
          className="h-7 w-[8.5rem] rounded-md border border-white/[0.1] bg-black/25 px-2 text-xs text-white/80 outline-none focus:border-blue-400/50"
          min={since}
          onChange={(event) => setUntil(event.target.value)}
          type="date"
          value={until}
        />
        <button
          className="h-7 rounded-md bg-blue-600 px-2 text-[11px] font-semibold text-white disabled:opacity-50"
          disabled={!since || !until}
          type="submit"
        >
          Custom
        </button>
      </form>
    </div>
  );
}
