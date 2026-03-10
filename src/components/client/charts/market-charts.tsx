import { type MarketRow } from "./types";

export function MarketPerformanceTable({ data }: { data: MarketRow[] }) {
  if (data.length === 0) return null;

  const sorted = [...data].sort((a, b) => b.impressions - a.impressions).slice(0, 8);
  const maxPct = sorted[0]?.pct ?? 1;

  return (
    <div className="glass-card p-4 sm:p-5">
      <p className="text-xs font-semibold text-white/60 mb-4">Top Markets</p>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/[0.06] text-left text-white/30">
              <th className="pb-2 pr-3 font-medium">Market</th>
              <th className="pb-2 pl-3 font-medium text-right">Impressions</th>
              <th className="pb-2 pl-3 font-medium text-right">Clicks</th>
              <th className="pb-2 pl-3 font-medium text-right">CTR</th>
              <th className="pb-2 pl-3 font-medium text-right">Spend</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.market} className="border-b border-white/[0.03] last:border-0">
                <td className="py-3 pr-3">
                  <div className="space-y-1">
                    <p className="font-medium text-white/75">{row.market}</p>
                    <div className="h-1.5 w-full rounded-full bg-white/[0.05]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400"
                        style={{ width: `${(row.pct / maxPct) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3 pl-3 text-right text-white/60">{row.impressions.toLocaleString()}</td>
                <td className="py-3 pl-3 text-right text-white/60">{row.clicks.toLocaleString()}</td>
                <td className="py-3 pl-3 text-right text-white/60">
                  {row.ctr != null ? `${row.ctr.toFixed(2)}%` : "--"}
                </td>
                <td className="py-3 pl-3 text-right font-medium text-white/75">
                  ${row.spend.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-2 md:hidden">
        {sorted.map((row) => (
          <div key={row.market} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white/75">{row.market}</p>
                <p className="text-[10px] text-white/30">{row.impressions.toLocaleString()} impressions</p>
              </div>
              <span className="text-xs font-semibold text-white/55">{row.pct.toFixed(0)}%</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/[0.04] pt-3">
              <div>
                <p className="text-[9px] uppercase text-white/25">Clicks</p>
                <p className="text-xs font-medium text-white/65">{row.clicks.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase text-white/25">CTR</p>
                <p className="text-xs font-medium text-white/65">
                  {row.ctr != null ? `${row.ctr.toFixed(2)}%` : "--"}
                </p>
              </div>
              <div>
                <p className="text-[9px] uppercase text-white/25">Spend</p>
                <p className="text-xs font-medium text-white/65">
                  ${row.spend.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
