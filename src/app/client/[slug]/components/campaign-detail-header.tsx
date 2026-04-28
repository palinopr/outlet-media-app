import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getRangeQuery, type CampaignRangeInput, type DateRange } from "@/lib/constants";
import { fmtUsd, fmtDate } from "@/lib/formatters";
import type { CampaignCard } from "../types";
import { CampaignStatusBadge } from "./campaign-status-badge";
import type { ClientPortalTheme } from "@/features/client-portal/theme";

const CLIENT_CAMPAIGN_DATE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7", label: "7d" },
  { value: "lifetime", label: "Lifetime" },
];

interface Props {
  slug: string;
  range: CampaignRangeInput;
  rangeLabel: string;
  campaign: CampaignCard;
  theme: ClientPortalTheme;
}

export function CampaignDetailHeader({ slug, range, rangeLabel, campaign: c }: Props) {
  const activeRange = typeof range === "string" ? range : "custom";

  return (
    <div className="space-y-4">
      <Link
        href={`/client/${slug}/campaigns?${getRangeQuery(range)}`}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 transition hover:border-white/[0.16] hover:text-white"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to campaigns
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Campaign Detail
            </h1>
            <CampaignStatusBadge status={c.status} />

            <div className="overflow-x-auto">
              <div className="flex items-center gap-0.5 rounded-xl border border-white/[0.08] bg-white/[0.04] p-1 w-max">
                {CLIENT_CAMPAIGN_DATE_OPTIONS.map((opt) => (
                  <a
                    key={opt.value}
                    href={`?range=${opt.value}`}
                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all duration-300 ${
                      activeRange === opt.value
                        ? "bg-white text-zinc-900 shadow-lg shadow-white/10"
                        : "text-white/60 hover:text-white/80 hover:bg-white/[0.06]"
                    }`}
                  >
                    {opt.label}
                  </a>
                ))}
                <span
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
                    activeRange === "custom"
                      ? "bg-white text-zinc-900 shadow-lg shadow-white/10"
                      : "text-white/35"
                  }`}
                >
                  {activeRange === "custom" ? rangeLabel : "Custom"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/58">
            <span className="font-medium text-white/92">{c.name}</span>
            {c.startTime ? (
              <>
                <span className="text-white/24">&bull;</span>
                <span>since {fmtDate(c.startTime)}</span>
              </>
            ) : null}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">Daily budget</p>
          <p className="mt-1 text-xl font-bold tracking-tight text-white">
            {c.dailyBudget != null ? `${fmtUsd(c.dailyBudget)} USD` : "--"}
          </p>
        </div>
      </div>
    </div>
  );
}
