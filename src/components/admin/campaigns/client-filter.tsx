"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface Props {
  clients: string[];
  selected: string;
}

export function ClientFilter({ clients, selected }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("client");
    } else {
      params.set("client", value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function slugToLabel(slug: string) {
    return slug.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }

  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="text-xs bg-background border border-border/60 rounded px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
    >
      <option value="all">All clients</option>
      {clients.map((slug) => (
        <option key={slug} value={slug}>
          {slugToLabel(slug)}
        </option>
      ))}
    </select>
  );
}
