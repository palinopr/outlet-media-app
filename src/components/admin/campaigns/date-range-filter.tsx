"use client";

import { useQueryState, parseAsString } from "nuqs";

const DATE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7", label: "7 days" },
  { value: "14", label: "14 days" },
  { value: "30", label: "30 days" },
  { value: "lifetime", label: "Lifetime" },
];

export function DateRangeFilter({ selected }: { selected: string }) {
  const [range, setRange] = useQueryState(
    "range",
    parseAsString.withDefault("today").withOptions({ shallow: false }),
  );

  const value = range || selected;

  return (
    <select
      value={value}
      onChange={(e) => {
        const v = e.target.value;
        setRange(v === "today" ? null : v);
      }}
      className="h-7 rounded border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
    >
      {DATE_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
