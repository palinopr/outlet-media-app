import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { DateRange } from "../data";
import { fmtUsd, fmtDate, fmtNum } from "@/lib/formatters";
import { DATE_OPTIONS } from "../lib";
import type { CampaignCard } from "../types";
import { CampaignStatusBadge } from "./campaign-status-badge";
import type { ClientPortalTheme } from "@/features/client-portal/theme";

interface Props {
  slug: string;
  range: DateRange;
  rangeLabel: string;
  campaign: CampaignCard;
  theme: ClientPortalTheme;
}

export function CampaignDetailHeader({ slug, range, rangeLabel, campaign: c, theme }: Props) {
  return (
    <div
      className="relative overflow-hidden rounded-[32px] border border-white/[0.08] p-5 sm:p-7"
      style={{
        backgroundImage: theme.heroBackground,
      }}
    >
      <div
        className="absolute inset-y-0 right-0 w-72 blur-3xl"
        style={{
          background: `linear-gradient(180deg, rgba(${theme.secondaryRgb}, 0.18), rgba(${theme.accentRgb}, 0))`,
        }}
      />

      <div className="relative">
        <Link
          href={`/client/${slug}?range=${range}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-black/10 px-3 py-1.5 text-xs text-white/60 transition hover:border-white/[0.16] hover:text-white"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to dashboard
        </Link>

        <div className="mt-4 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-[2.7rem]">
                Campaign Detail
              </h1>
              <CampaignStatusBadge status={c.status} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/58">
              <span className="font-medium text-white/92">{c.name}</span>
              {c.startTime ? (
                <>
                  <span className="text-white/24">•</span>
                  <span>since {fmtDate(c.startTime)}</span>
                </>
              ) : null}
              <span className="text-white/24">•</span>
              <span>{rangeLabel}</span>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <Sparkles
                className="h-4 w-4"
                style={{ color: `rgba(${theme.highlightRgb}, 0.9)` }}
              />
              <span
                className="text-xs font-semibold tracking-[0.22em] uppercase"
                style={{ color: `rgba(${theme.accentRgb}, 0.92)` }}
              >
                Client-ready performance view
              </span>
            </div>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/64">
              A cleaner customer-facing campaign board focused on the performance story first, then
              the timing, creative, and market evidence behind it.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 xl:max-w-sm">
            {theme.brandLogoSrc ? (
              <div className="rounded-[24px] border border-white/[0.08] bg-white/95 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.24)]">
                <Image
                  src={theme.brandLogoSrc}
                  alt={theme.brandLogoAlt ?? theme.brandBadge}
                  width={theme.brandLogoWidth ?? 280}
                  height={theme.brandLogoHeight ?? 140}
                  className="h-16 w-full object-contain"
                />
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-3">
              <HeaderMetric
                label="Daily budget"
                value={c.dailyBudget != null ? fmtUsd(c.dailyBudget) : "--"}
                note={c.dailyBudget != null ? "Current Meta budget" : "Budget not available"}
              />
              <HeaderMetric label="Spend" value={fmtUsd(c.spend)} note={`${rangeLabel} total`} />
              <HeaderMetric
                label="Revenue"
                value={fmtUsd(c.revenue)}
                note="Attributed purchase value"
              />
              <HeaderMetric
                label="Reach"
                value={fmtNum(c.impressions)}
                note={c.clicks > 0 ? `${fmtNum(c.clicks)} clicks` : "Waiting for clicks"}
              />
            </div>

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
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/[0.07] bg-black/12 p-4 backdrop-blur-sm">
      <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">{label}</p>
      <p className="mt-2 text-xl font-bold tracking-tight text-white">{value}</p>
      {note ? <p className="mt-1 text-xs text-white/45">{note}</p> : null}
    </div>
  );
}
