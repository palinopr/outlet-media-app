import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { CampaignCard as CampaignCardData } from "../types";
import type { DateRange } from "../data";
import { fmtUsd, fmtDate, fmtNum, roasColor } from "@/lib/formatters";
import { roasLabel } from "../lib";
import { CampaignStatusBadge } from "./campaign-status-badge";
import { ProgressBar } from "./progress-bar";

export function CampaignCard({ c, slug, range }: { c: CampaignCardData; slug: string; range: DateRange }) {
  return (
    <Link
      href={`/client/${slug}/campaign/${c.campaignId}?range=${range}`}
      className="glass-card p-5 flex flex-col hover:ring-1 hover:ring-white/10 hover:bg-white/[0.03] transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="text-sm font-semibold text-white/90 leading-tight group-hover:text-cyan-300 transition-colors">{c.name}</p>
        <div className="flex items-center gap-1.5">
          <CampaignStatusBadge status={c.status} />
          <ChevronRight className="h-3 w-3 text-white/15 group-hover:text-white/40 transition-colors" />
        </div>
      </div>
      {c.startTime && (
        <p className="text-[10px] text-white/25 mb-4">
          Since {fmtDate(c.startTime)}
          {c.dailyBudget != null && ` | ${fmtUsd(c.dailyBudget)}/day budget`}
        </p>
      )}

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-auto">
        <div>
          <p className="text-[10px] text-white/30 mb-0.5">Spend</p>
          <p className="text-lg font-bold text-white/90">{fmtUsd(c.spend)}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/30 mb-0.5">ROAS</p>
          <p className={`text-lg font-bold ${roasColor(c.roas)}`}>
            {c.roas != null ? `${c.roas.toFixed(1)}x` : "--"}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-white/30 mb-0.5">Revenue</p>
          <p className="text-sm font-bold text-emerald-400/80">{fmtUsd(c.revenue)}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/30 mb-0.5">Impressions</p>
          <p className="text-sm font-bold text-white/70">{fmtNum(c.impressions)}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/30 mb-0.5">Clicks</p>
          <p className="text-sm font-bold text-white/70">{fmtNum(c.clicks)}</p>
        </div>
        {c.ctr != null && (
          <div>
            <p className="text-[10px] text-white/30 mb-0.5">CTR</p>
            <p className="text-sm font-bold text-white/70">{c.ctr.toFixed(2)}%</p>
          </div>
        )}
      </div>

      {c.roas != null && (
        <div className="mt-4 pt-3 border-t border-white/[0.06]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-white/30">Performance</span>
            <span className={`text-[10px] font-semibold ${roasColor(c.roas)}`}>{roasLabel(c.roas)}</span>
          </div>
          <ProgressBar value={Math.min(c.roas * 25, 100)} />
        </div>
      )}
    </Link>
  );
}
