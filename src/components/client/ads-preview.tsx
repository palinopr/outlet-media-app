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
  impressions: number;
  clicks: number;
  reach: number | null;
  ctr: number | null;
  roas: number | null;
}

function fmtNum(n: number | null): string {
  if (n == null) return "--";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString("en-US");
}

function roasColor(roas: number | null): string {
  if (roas == null) return "text-white/40";
  if (roas >= 3) return "text-emerald-400";
  if (roas >= 2) return "text-amber-400";
  return "text-red-400";
}

function statusCfg(status: string) {
  const map: Record<string, { label: string; text: string; bg: string; dot: string }> = {
    ACTIVE: { label: "Active", text: "text-emerald-400", bg: "bg-emerald-400/10", dot: "bg-emerald-400" },
    PAUSED: { label: "Paused", text: "text-amber-400", bg: "bg-amber-400/10", dot: "bg-amber-400" },
    DELETED: { label: "Deleted", text: "text-red-400", bg: "bg-red-400/10", dot: "bg-red-400" },
    ARCHIVED: { label: "Archived", text: "text-zinc-400", bg: "bg-zinc-400/10", dot: "bg-zinc-400" },
  };
  return map[status.toUpperCase()] ?? { label: status, text: "text-white/40", bg: "bg-white/5", dot: "bg-white/40" };
}

function AdCardUI({ ad }: { ad: AdPreview }) {
  const cfg = statusCfg(ad.status);
  return (
    <div className="glass-card p-4 flex flex-col">
      {/* Thumbnail */}
      {ad.thumbnailUrl && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3 bg-white/[0.03]">
          <Image
            src={ad.thumbnailUrl}
            alt={ad.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            unoptimized={!ad.thumbnailUrl.includes("fbcdn.net")}
          />
        </div>
      )}
      {!ad.thumbnailUrl && (
        <div className="w-full aspect-video rounded-lg mb-3 bg-gradient-to-br from-white/[0.03] to-white/[0.01] flex items-center justify-center">
          <span className="text-white/10 text-xs">No preview</span>
        </div>
      )}

      {/* Name and status */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="text-xs font-semibold text-white/80 leading-tight line-clamp-2">{ad.name}</p>
        <span className={`badge-status ${cfg.text} ${cfg.bg} shrink-0`}>
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
      </div>

      {ad.creativeTitle && (
        <p className="text-[10px] text-white/25 mb-2 line-clamp-1">{ad.creativeTitle}</p>
      )}

      {/* Metrics -- no spend */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-auto pt-3 border-t border-white/[0.06]">
        {ad.roas != null && (
          <div>
            <p className="text-[9px] text-white/25">ROAS</p>
            <p className={`text-sm font-bold ${roasColor(ad.roas)}`}>{ad.roas.toFixed(1)}x</p>
          </div>
        )}
        <div>
          <p className="text-[9px] text-white/25">Impressions</p>
          <p className="text-xs font-semibold text-white/60">{fmtNum(ad.impressions)}</p>
        </div>
        <div>
          <p className="text-[9px] text-white/25">Clicks</p>
          <p className="text-xs font-semibold text-white/60">{fmtNum(ad.clicks)}</p>
        </div>
        {ad.reach != null && (
          <div>
            <p className="text-[9px] text-white/25">Reach</p>
            <p className="text-xs font-semibold text-white/60">{fmtNum(ad.reach)}</p>
          </div>
        )}
        {ad.ctr != null && (
          <div>
            <p className="text-[9px] text-white/25">CTR</p>
            <p className="text-xs font-semibold text-white/60">{ad.ctr.toFixed(2)}%</p>
          </div>
        )}
      </div>
    </div>
  );
}

const PREVIEW_COUNT = 3;

export function AdsPreview({ ads }: { ads: AdPreview[] }) {
  const [expanded, setExpanded] = useState(false);
  if (ads.length === 0) return null;

  // Sort by impressions (highest first) since we're not showing spend
  const sorted = [...ads].sort((a, b) => b.impressions - a.impressions);
  const visible = expanded ? sorted : sorted.slice(0, PREVIEW_COUNT);
  const hasMore = sorted.length > PREVIEW_COUNT;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((ad) => (
          <AdCardUI key={ad.adId} ad={ad} />
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
