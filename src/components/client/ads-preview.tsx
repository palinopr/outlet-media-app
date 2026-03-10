"use client";

import Image from "next/image";
import { fmtUsd, fmtNum } from "@/lib/formatters";

export interface AdPreview {
  adId: string;
  name: string;
  status: string;
  thumbnailUrl: string | null;
  creativeTitle: string | null;
  creativeBody: string | null;
  spend: number;
  impressions: number;
  clicks: number;
  reach: number | null;
  ctr: number | null;
  cpc: number | null;
  roas: number | null;
  revenue: number | null;
}

const TH =
  "px-2 py-2.5 text-left text-[10px] uppercase tracking-wider text-white/40 font-medium";
const TD = "px-2 py-2.5 text-xs text-white/80 tabular-nums";

export function AdsPreview({ ads }: { ads: AdPreview[] }) {
  if (ads.length === 0) return null;

  const sorted = [...ads].sort((a, b) => {
    if ((b.roas ?? -1) !== (a.roas ?? -1)) return (b.roas ?? -1) - (a.roas ?? -1);
    if ((b.revenue ?? -1) !== (a.revenue ?? -1))
      return (b.revenue ?? -1) - (a.revenue ?? -1);
    return b.impressions - a.impressions;
  });

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/[0.06]">
            <th className={TH}>Creative</th>
            <th className={`${TH} text-right`}>Spend</th>
            <th className={`${TH} text-right`}>Revenue</th>
            <th className={`${TH} text-right`}>ROAS</th>
            <th className={`${TH} text-right`}>Impress.</th>
            <th className={`${TH} text-right`}>Clicks</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((ad) => (
            <tr
              key={ad.adId}
              className="border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.04] transition-colors"
            >
              <td className={`${TD} !py-2`}>
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-white/[0.04]">
                    {ad.thumbnailUrl ? (
                      <Image
                        src={ad.thumbnailUrl}
                        alt={ad.name}
                        fill
                        sizes="32px"
                        className="object-cover"
                        unoptimized={!ad.thumbnailUrl.includes("fbcdn.net")}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-[8px] text-white/10">N/A</span>
                      </div>
                    )}
                  </div>
                  <p className="max-w-[120px] truncate text-[11px] font-medium text-white/80">
                    {ad.name}
                  </p>
                </div>
              </td>

              <td className={`${TD} text-right`}>{fmtUsd(ad.spend)}</td>

              <td className={`${TD} text-right`}>
                {ad.revenue != null ? fmtUsd(ad.revenue) : "--"}
              </td>

              <td className={`${TD} text-right`}>
                {ad.roas != null ? ad.roas.toFixed(2) : "--"}
              </td>

              <td className={`${TD} text-right`}>{fmtNum(ad.impressions)}</td>

              <td className={`${TD} text-right`}>{fmtNum(ad.clicks)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
