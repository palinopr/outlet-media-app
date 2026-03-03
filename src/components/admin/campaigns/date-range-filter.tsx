"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const DATE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7", label: "7 days" },
  { value: "14", label: "14 days" },
  { value: "30", label: "30 days" },
  { value: "lifetime", label: "Lifetime" },
];

export function DateRangeFilter({ selected }: { selected: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "lifetime") {
      params.delete("range");
    } else {
      params.set("range", value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      value={selected}
      onChange={(e) => handleChange(e.target.value)}
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
