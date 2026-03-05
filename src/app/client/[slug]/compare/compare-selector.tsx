"use client";

import { useRouter } from "next/navigation";

interface Option {
  id: string;
  name: string;
  status: string;
}

interface Props {
  slug: string;
  options: Option[];
  selectedA: string;
  selectedB: string;
}

export function CompareSelector({ slug, options, selectedA, selectedB }: Props) {
  const router = useRouter();

  function handleChange(side: "a" | "b", value: string) {
    const a = side === "a" ? value : selectedA;
    const b = side === "b" ? value : selectedB;
    const params = new URLSearchParams();
    if (a) params.set("a", a);
    if (b) params.set("b", b);
    router.push(`/client/${slug}/compare?${params.toString()}`);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs text-white/50 font-medium mb-1.5 block">Campaign A</label>
        <select
          value={selectedA}
          onChange={(e) => handleChange("a", e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg text-sm bg-white/[0.03] border border-white/[0.08] text-white/90 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
        >
          <option value="" className="bg-zinc-900">Select a campaign</option>
          {options.map((o) => (
            <option key={o.id} value={o.id} disabled={o.id === selectedB} className="bg-zinc-900">
              {o.name} ({o.status})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs text-white/50 font-medium mb-1.5 block">Campaign B</label>
        <select
          value={selectedB}
          onChange={(e) => handleChange("b", e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg text-sm bg-white/[0.03] border border-white/[0.08] text-white/90 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
        >
          <option value="" className="bg-zinc-900">Select a campaign</option>
          {options.map((o) => (
            <option key={o.id} value={o.id} disabled={o.id === selectedA} className="bg-zinc-900">
              {o.name} ({o.status})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
