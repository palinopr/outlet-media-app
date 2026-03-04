"use client";

import { useQueryState, parseAsString } from "nuqs";
import { slugToLabel } from "@/lib/formatters";

interface Props {
  clients: string[];
  selected: string;
}

export function ClientFilter({ clients, selected }: Props) {
  const [client, setClient] = useQueryState(
    "client",
    parseAsString.withDefault("all").withOptions({ shallow: false }),
  );

  const value = client || selected;

  return (
    <select
      value={value}
      onChange={(e) => {
        const v = e.target.value;
        setClient(v === "all" ? null : v);
      }}
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
