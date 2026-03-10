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
  "px-3 py-2.5 text-left text-[11px] uppercase tracking-wider text-white/40 font-medium";
const TD = "px-3 py-3 text-sm text-white/80 tabular-nums";

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
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className={`${TH} w-10 text-center`}>#</th>
              <th className={TH}>Creative</th>
              <th className={`${TH} text-right`}>Spend</th>
              <th className={`${TH} text-right`}>Revenue</th>
              <th className={`${TH} text-right`}>ROAS</th>
              <th className={`${TH} text-right`}>Impress.</th>
              <th className={`${TH} text-right`}>CPC</th>
              <th className={`${TH} text-right`}>Clicks</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((ad, i) => (
              <tr
                key={ad.adId}
                className="border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.04] transition-colors"
              >
                {/* Row number */}
                <td className={`${TD} text-center text-white/30`}>{i + 1}</td>

                {/* Creative: thumbnail + name + handle */}
                <td className={`${TD} !py-2.5`}>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/[0.04]">
                      {ad.thumbnailUrl ? (
                        <Image
                          src={ad.thumbnailUrl}
                          alt={ad.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                          unoptimized={!ad.thumbnailUrl.includes("fbcdn.net")}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="text-[9px] text-white/10">N/A</span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="max-w-[140px] truncate text-xs font-medium text-white/80">
                        {ad.name}
                      </p>
                      <p className="text-[10px] text-white/30">@OutletMedia</p>
                    </div>
                  </div>
                </td>

                {/* Spend */}
                <td className={`${TD} text-right`}>{fmtUsd(ad.spend)}</td>

                {/* Revenue */}
                <td className={`${TD} text-right`}>
                  {ad.revenue != null ? fmtUsd(ad.revenue) : "--"}
                </td>

                {/* ROAS */}
                <td className={`${TD} text-right`}>
                  {ad.roas != null ? ad.roas.toFixed(2) : "--"}
                </td>

                {/* Impressions */}
                <td className={`${TD} text-right`}>{fmtNum(ad.impressions)}</td>

                {/* CPC */}
                <td className={`${TD} text-right`}>
                  {ad.cpc != null ? fmtUsd(ad.cpc) : "--"}
                </td>

                {/* Clicks */}
                <td className={`${TD} text-right`}>{fmtNum(ad.clicks)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
