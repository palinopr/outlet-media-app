import { type MarketRow } from "./types";
import { fmtUsd } from "@/lib/formatters";

export function MarketPerformanceTable({
  data,
  compact = false,
}: {
  data: MarketRow[];
  compact?: boolean;
}) {
  if (data.length === 0) return null;

  const sorted = [...data].sort((a, b) => b.impressions - a.impressions).slice(0, 8);
  const maxPct = sorted[0]?.pct ?? 1;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-black/15 p-4">
      <p className="mb-4 text-xs font-medium text-white/62">Top Markets</p>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/[0.06] text-left text-white/34">
              <th className="pb-2 pr-3 font-medium">Market</th>
              <th className={`pb-2 pl-3 font-medium text-right ${compact ? "hidden 2xl:table-cell" : ""}`}>Impressions</th>
              <th className={`pb-2 pl-3 font-medium text-right ${compact ? "hidden 2xl:table-cell" : ""}`}>Clicks</th>
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
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                        style={{ width: `${(row.pct / maxPct) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className={`py-3 pl-3 text-right text-white/60 ${compact ? "hidden 2xl:table-cell" : ""}`}>{row.impressions.toLocaleString()}</td>
                <td className={`py-3 pl-3 text-right text-white/60 ${compact ? "hidden 2xl:table-cell" : ""}`}>{row.clicks.toLocaleString()}</td>
                <td className="py-3 pl-3 text-right text-white/60">
                  {row.ctr != null ? `${row.ctr.toFixed(2)}%` : "--"}
                </td>
                <td className="py-3 pl-3 text-right font-medium text-white/75">
                  {fmtUsd(row.spend)}
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
                  {fmtUsd(row.spend)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
