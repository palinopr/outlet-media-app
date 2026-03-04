import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { DateRange } from "../data";
import { fmtUsd, fmtDate } from "@/lib/formatters";
import { DATE_OPTIONS } from "../lib";
import { CampaignStatusBadge } from "./campaign-status-badge";

interface Props {
  slug: string;
  range: DateRange;
  campaign: {
    name: string;
    status: string;
    startTime: string | null;
    dailyBudget: number | null;
  };
}

export function CampaignDetailHeader({ slug, range, campaign: c }: Props) {
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

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
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
            </div>
          </div>

          <div className="overflow-x-auto -mx-1 px-1 self-start">
            <div className="flex items-center gap-0.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] w-max">
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
        </div>
      </div>
    </div>
  );
}
