"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";

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

function AdCardUI({ ad, isTopPerformer }: { ad: AdPreview; isTopPerformer: boolean }) {
  const cpaStr = ad.cpc != null ? `$${ad.cpc.toFixed(2)}` : "--";
  const ctrStr = ad.ctr != null ? `${ad.ctr.toFixed(1)}%` : "--";
  const roasStr = ad.roas != null ? `${ad.roas.toFixed(1)}x` : "--";

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all">
      {/* Thumbnail */}
      <div className="relative w-full aspect-video rounded-t-2xl overflow-hidden bg-white/[0.03]">
        {ad.thumbnailUrl ? (
          <Image
            src={ad.thumbnailUrl}
            alt={ad.name}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
            unoptimized={!ad.thumbnailUrl.includes("fbcdn.net")}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-white/[0.01] flex items-center justify-center">
            <span className="text-white/10 text-xs">No preview</span>
          </div>
        )}

        {isTopPerformer && (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-emerald-600/90 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-lg backdrop-blur-sm">
            &#9733; Top Performer
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <p className="text-sm font-medium text-white/80 truncate">{ad.name}</p>

        <p className="mt-1 text-xs text-white/45">
          Avg. CPA {cpaStr}, Conv. Rate {ctrStr}, ROAS {roasStr}
        </p>

        {ad.creativeBody && (
          <p className="mt-1.5 text-[11px] leading-snug text-white/25 line-clamp-2">
            {ad.creativeBody}
          </p>
        )}
      </div>
    </div>
  );
}

const PREVIEW_COUNT = 4;

export function AdsPreview({ ads }: { ads: AdPreview[] }) {
  const [expanded, setExpanded] = useState(false);
  if (ads.length === 0) return null;

  const sorted = [...ads].sort((a, b) => {
    if ((b.roas ?? -1) !== (a.roas ?? -1)) return (b.roas ?? -1) - (a.roas ?? -1);
    if ((b.revenue ?? -1) !== (a.revenue ?? -1)) return (b.revenue ?? -1) - (a.revenue ?? -1);
    return b.impressions - a.impressions;
  });

  const topPerformerIds = new Set(
    sorted.slice(0, 2).map((ad) => ad.adId)
  );

  const visible = expanded ? sorted : sorted.slice(0, PREVIEW_COUNT);
  const hasMore = sorted.length > PREVIEW_COUNT;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visible.map((ad) => (
          <AdCardUI
            key={ad.adId}
            ad={ad}
            isTopPerformer={topPerformerIds.has(ad.adId)}
          />
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] transition-all text-xs font-medium text-white/40 hover:text-white/60"
        >
          {expanded ? (
            <>
              Show less <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              View all {sorted.length} ads <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
