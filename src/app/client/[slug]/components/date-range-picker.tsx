"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { DateRange } from "@/lib/constants";

const STORAGE_KEY = "outlet-preferred-range";

interface Props {
  options: Array<{ value: DateRange; label: string }>;
  current: DateRange;
}

export function DateRangePicker({ options, current }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // On mount: if no range param in URL, redirect to stored preference
  useEffect(() => {
    try {
      if (!searchParams.get("range")) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && stored !== current) {
          router.replace(`?range=${stored}`);
        }
      }
    } catch { /* localStorage unavailable */ }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist current choice
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, current);
    } catch { /* localStorage unavailable */ }
  }, [current]);

  return (
    <div className="flex flex-wrap items-center gap-1 sm:gap-0.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
      {options.map((opt) => (
        <a
          key={opt.value}
          href={`?range=${opt.value}`}
          className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
            current === opt.value
              ? "bg-white text-zinc-900 shadow-lg shadow-white/10"
              : "text-white/60 hover:text-white/80 hover:bg-white/[0.06]"
          }`}
        >
          {opt.label}
        </a>
      ))}
    </div>
  );
}
