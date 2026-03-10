import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { DateRange } from "../data";
import { fmtUsd, fmtDate, fmtNum, roasColor } from "@/lib/formatters";
import { DATE_OPTIONS, roasLabel } from "../lib";
import type { CampaignCard } from "../types";
import { CampaignStatusBadge } from "./campaign-status-badge";

interface Props {
  slug: string;
  range: DateRange;
  rangeLabel: string;
  campaign: CampaignCard;
}

export function CampaignDetailHeader({ slug, range, rangeLabel, campaign: c }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 sm:p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.07] via-violet-500/[0.05] to-transparent" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-500/[0.08] to-transparent rounded-full blur-3xl" />

      <div className="relative">
        <Link
          href={`/client/${slug}?range=${range}`}
          className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white/70 transition mb-4"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to dashboard
        </Link>

        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-cyan-400/70" />
              <span className="text-xs font-semibold tracking-widest uppercase text-cyan-400">
                Campaign Detail
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{c.name}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <CampaignStatusBadge status={c.status} />
              {c.startTime && (
                <span className="text-xs text-white/50">Since {fmtDate(c.startTime)}</span>
              )}
              {c.dailyBudget != null && (
                <span className="text-xs text-white/50">
                  {fmtUsd(c.dailyBudget)}/day budget
                </span>
              )}
              <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                {rangeLabel}
              </span>
            </div>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
              Clear campaign performance by audience, timing, placement, and creative so clients can
              make faster decisions from one screen.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 xl:max-w-md">
            <div className="overflow-x-auto -mx-1 px-1 self-start">
              <div className="flex items-center gap-0.5 rounded-xl border border-white/[0.08] bg-white/[0.04] p-1 w-max">
                {DATE_OPTIONS.map((opt) => (
                  <a
                    key={opt.value}
                    href={`?range=${opt.value}`}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                      range === opt.value
                        ? "bg-white text-zinc-900 shadow-lg shadow-white/10"
                        : "text-white/60 hover:text-white/80 hover:bg-white/[0.06]"
                    }`}
                  >
                    {opt.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <HeaderMetric label="Spend" value={fmtUsd(c.spend)} />
              <HeaderMetric label="Revenue" value={fmtUsd(c.revenue)} />
              <HeaderMetric
                label="ROAS"
                value={c.roas != null ? `${c.roas.toFixed(1)}x` : "--"}
                note={roasLabel(c.roas)}
                valueClassName={roasColor(c.roas)}
              />
              <HeaderMetric label="Impressions" value={fmtNum(c.impressions)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeaderMetric({
  label,
  value,
  note,
  valueClassName,
}: {
  label: string;
  value: string;
  note?: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-black/10 p-4 backdrop-blur-sm">
      <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">{label}</p>
      <p className={`mt-2 text-xl font-bold tracking-tight text-white ${valueClassName ?? ""}`}>
        {value}
      </p>
      {note ? <p className="mt-1 text-xs text-white/45">{note}</p> : null}
    </div>
  );
}
