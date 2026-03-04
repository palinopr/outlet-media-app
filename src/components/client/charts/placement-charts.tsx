import { type PlacementRow } from "./types";
import { PlatformIcon } from "../platform-icons";

// --- Platform bar list ---

const PLATFORM_BAR_COLORS: Record<string, string> = {
  Facebook: "bg-blue-500",
  Instagram: "bg-violet-500",
  Messenger: "bg-cyan-500",
  "Audience Network": "bg-amber-500",
};

export function PlacementTreemap({ data }: { data: PlacementRow[] }) {
  if (data.length === 0) return null;

  const byPlatform = new Map<string, { impressions: number; clicks: number }>();
  for (const row of data) {
    const prev = byPlatform.get(row.platform) ?? { impressions: 0, clicks: 0 };
    byPlatform.set(row.platform, {
      impressions: prev.impressions + row.impressions,
      clicks: prev.clicks + row.clicks,
    });
  }
  const totalImp = data.reduce((s, r) => s + r.impressions, 0);
  const platforms = Array.from(byPlatform.entries())
    .map(([name, vals]) => ({
      name,
      impressions: vals.impressions,
      clicks: vals.clicks,
      pct: totalImp > 0 ? (vals.impressions / totalImp) * 100 : 0,
    }))
    .sort((a, b) => b.impressions - a.impressions);

  const maxPct = platforms[0]?.pct ?? 100;

  return (
    <div className="glass-card p-4 sm:p-5">
      <p className="text-xs font-semibold text-white/60 mb-4">Platform Distribution</p>
      <div className="space-y-3">
        {platforms.map((p) => {
          const barColor = PLATFORM_BAR_COLORS[p.name] ?? "bg-white/30";
          return (
            <div key={p.name}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <PlatformIcon platform={p.name} size={14} />
                  <span className="text-xs text-white/70 font-medium">{p.name}</span>
                </div>
                <span className="text-xs text-white/50 font-semibold">{p.pct.toFixed(0)}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className={`h-full rounded-full ${barColor} opacity-60`}
                  style={{ width: `${(p.pct / maxPct) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Table (desktop) + Cards (mobile) ---

export function PlacementTable({ data }: { data: PlacementRow[] }) {
  if (data.length === 0) return null;

  const totalImp = data.reduce((s, r) => s + r.impressions, 0);
  const sorted = [...data].sort((a, b) => b.impressions - a.impressions);

  return (
    <div className="glass-card p-4 sm:p-5">
      <p className="text-xs font-semibold text-white/60 mb-4">Placement Breakdown</p>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-white/30 text-left border-b border-white/[0.06]">
              <th className="pb-2 pr-3 font-medium whitespace-nowrap">Platform</th>
              <th className="pb-2 pr-3 font-medium whitespace-nowrap">Position</th>
              <th className="pb-2 pl-3 font-medium text-right whitespace-nowrap">Impressions</th>
              <th className="pb-2 pl-3 font-medium text-right whitespace-nowrap">Clicks</th>
              <th className="pb-2 pl-3 font-medium text-right whitespace-nowrap">CTR</th>
              <th className="pb-2 pl-3 font-medium text-right whitespace-nowrap">Share</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => {
              const pct = totalImp > 0 ? (row.impressions / totalImp) * 100 : 0;
              return (
                <tr key={i} className="border-b border-white/[0.03] last:border-0">
                  <td className="py-2.5 pr-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <PlatformIcon platform={row.platform} size={14} />
                      <span className="text-white/70">{row.platform}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-3 text-white/50 whitespace-nowrap">{row.position}</td>
                  <td className="py-2.5 pl-3 text-white/60 text-right font-medium whitespace-nowrap">
                    {row.impressions.toLocaleString()}
                  </td>
                  <td className="py-2.5 pl-3 text-white/50 text-right whitespace-nowrap">
                    {row.clicks.toLocaleString()}
                  </td>
                  <td className="py-2.5 pl-3 text-white/50 text-right whitespace-nowrap">
                    {row.ctr != null ? `${row.ctr.toFixed(2)}%` : "--"}
                  </td>
                  <td className="py-2.5 pl-3 text-white/60 text-right font-medium whitespace-nowrap">
                    {pct.toFixed(0)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: card stack */}
      <div className="md:hidden space-y-2">
        {sorted.map((row, i) => {
          const pct = totalImp > 0 ? (row.impressions / totalImp) * 100 : 0;
          return (
            <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <PlatformIcon platform={row.platform} size={16} />
                  <div>
                    <p className="text-xs font-medium text-white/70">{row.position}</p>
                    <p className="text-[10px] text-white/30">{row.platform}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-white/50">{pct.toFixed(0)}%</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.04]">
                <div>
                  <p className="text-[9px] text-white/25 uppercase">Impressions</p>
                  <p className="text-xs font-medium text-white/60">{row.impressions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[9px] text-white/25 uppercase">Clicks</p>
                  <p className="text-xs font-medium text-white/60">{row.clicks.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[9px] text-white/25 uppercase">CTR</p>
                  <p className="text-xs font-medium text-white/60">
                    {row.ctr != null ? `${row.ctr.toFixed(2)}%` : "--"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
