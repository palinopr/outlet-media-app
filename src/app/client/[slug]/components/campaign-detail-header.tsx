import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { getRangeQuery, type CampaignRangeInput, type DateRange } from "@/lib/constants";
import { fmtDate } from "@/lib/formatters";
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
    <div className="space-y-3">
      <Link
        href={`/client/${slug}/campaigns?${getRangeQuery(range)}`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-300 transition hover:text-blue-200"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to campaigns
      </Link>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-[2rem] sm:leading-10">
              {c.name}
            </h1>
            <CampaignStatusBadge status={c.status} />
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-white/52">
            {c.startTime ? (
              <span>Since {fmtDate(c.startTime)}</span>
            ) : null}
          </div>
        </div>

        <div className="overflow-x-auto xl:pt-1">
          <div className="flex w-max overflow-hidden rounded-xl border border-white/[0.12] bg-black/25 shadow-[0_0_0_1px_rgba(37,99,235,0.08),0_14px_44px_rgba(0,0,0,0.22)]">
            {CLIENT_CAMPAIGN_DATE_OPTIONS.map((opt) => (
              <a
                key={opt.value}
                href={`?range=${opt.value}`}
                className={`min-w-24 border-r border-white/[0.1] px-5 py-2.5 text-center text-xs font-semibold transition ${
                  activeRange === opt.value
                    ? "bg-blue-600/14 text-blue-200 ring-1 ring-inset ring-blue-500/70 shadow-[0_0_24px_rgba(37,99,235,0.18)]"
                    : "text-white/62 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {opt.label}
              </a>
            ))}
            <span
              className={`flex min-w-28 items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold ${
                activeRange === "custom"
                  ? "bg-blue-600/14 text-blue-200 ring-1 ring-inset ring-blue-500/70"
                  : "text-white/62"
              }`}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              {activeRange === "custom" ? rangeLabel : "Custom"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
