import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Eye,
  MousePointer,
  Target,
  Image as ImageIcon,
  Activity,
  Lightbulb,
} from "lucide-react";
import { parseRange } from "@/lib/constants";
import { fmtDate, fmtUsd, fmtNum } from "@/lib/formatters";
import type { AdCard, CampaignCard, DailyPoint, GeographyBreakdown, HourlyBreakdown } from "../../types";
import { getCampaignDetail } from "./data";
import { AdsPreview } from "@/components/client/ads-preview";
import { RecommendationsList } from "@/components/client/recommendations";
import { ClientPortalFooter } from "../../components/client-portal-footer";
import { StatCard } from "../../components/stat-card";
import { CampaignDetailHeader } from "../../components/campaign-detail-header";
import { CampaignAnalytics } from "../../components/campaign-analytics";
import { requireClientAccess } from "@/features/client-portal/access";
import { findBestDayOfWeek, findBestHour, findTopCreative, findTopMarket, roasLabel } from "../../lib";

interface Props {
  params: Promise<{ slug: string; campaignId: string }>;
  searchParams: Promise<{ range?: string }>;
}

export default async function CampaignDetailPage({ params, searchParams }: Props) {
  const { slug, campaignId } = await params;
  const { scope } = await requireClientAccess(slug, "meta_ads");
  const { range: rangeParam } = await searchParams;
  const range = parseRange(rangeParam, "7");

  const data = await getCampaignDetail(slug, campaignId, range, scope);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-white/60 text-sm">Campaign not found.</p>
        <Link
          href={`/client/${slug}`}
          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
        >
          <ArrowLeft className="h-3 w-3" /> Back to dashboard
        </Link>
      </div>
    );
  }

  const {
    campaign: c,
    ageGender,
    placements,
    geography,
    ads,
    hourly,
    daily,
    recommendations,
    dataSource,
    rangeLabel,
  } = data;

  const trackedDays = daily.length;
  const totalDailySpend = daily.reduce((sum, row) => sum + row.spend, 0);
  const totalDailyRevenue = daily.reduce((sum, row) => sum + (row.revenue ?? 0), 0);
  const avgDailySpend = trackedDays > 0 ? totalDailySpend / trackedDays : null;
  const avgDailyRevenue = trackedDays > 0 && totalDailyRevenue > 0 ? totalDailyRevenue / trackedDays : null;
  const pacePct =
    c.dailyBudget != null && avgDailySpend != null && c.dailyBudget > 0
      ? (avgDailySpend / c.dailyBudget) * 100
      : null;
  const daysLive = getDaysLive(c.startTime);
  const hasWindowDelivery = hasMeaningfulCampaignWindow(c, daily);
  const bestDay = findBestDayOfWeek(daily);
  const bestHour = findBestHour(hourly);
  const topCreative = findTopCreative(ads);
  const topMarket = findTopMarket(geography);
  const brief = buildCampaignBrief({
    campaign: c,
    rangeLabel,
    trackedDays,
    hasWindowDelivery,
    pacePct,
    bestDay,
    bestHour,
    topCreative,
    topMarket,
  });

  const overviewCards = [
    daysLive != null
      ? {
          label: "Days Live",
          value: daysLive.toLocaleString(),
          sub: c.startTime ? `Since ${fmtDate(c.startTime)}` : "Campaign lifetime so far",
        }
      : null,
    c.dailyBudget != null
      ? {
          label: "Daily Budget",
          value: fmtUsd(c.dailyBudget),
          sub: "Current Meta daily budget",
        }
      : null,
    avgDailySpend != null
      ? {
          label: "Avg Daily Spend",
          value: fmtUsd(avgDailySpend),
          sub:
            pacePct != null
              ? `${pacePct.toFixed(0)}% of current daily budget`
              : `Average across ${trackedDays} tracked day${trackedDays === 1 ? "" : "s"}`,
        }
      : null,
    avgDailyRevenue != null
      ? {
          label: "Avg Daily Revenue",
          value: fmtUsd(avgDailyRevenue),
          sub: `Attributed revenue across ${trackedDays} tracked day${trackedDays === 1 ? "" : "s"}`,
        }
      : trackedDays > 0
        ? {
            label: "Tracked Days",
            value: trackedDays.toLocaleString(),
            sub: `${rangeLabel} of hourly and daily campaign history`,
          }
        : null,
  ].filter((card): card is { label: string; value: string; sub: string } => card != null);

  return (
    <div className="space-y-6">
      <CampaignDetailHeader slug={slug} range={range} rangeLabel={rangeLabel} campaign={c} />

      <CampaignIntelligenceBrief brief={brief} />

      {overviewCards.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Budget & Pace</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {overviewCards.map((card) => (
              <OverviewCard key={card.label} label={card.label} value={card.value} sub={card.sub} />
            ))}
          </div>
        </section>
      )}

      {hasWindowDelivery && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Delivery Health</span>
            <span className="ml-auto text-xs text-white/45">{rangeLabel}</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              icon={MousePointer}
              iconColor="bg-amber-500/10 ring-1 ring-amber-500/20 text-amber-400"
              label="Clicks"
              value={fmtNum(c.clicks)}
              sub={`${fmtNum(c.impressions)} impressions in window`}
            />
            <StatCard
              icon={Activity}
              iconColor="bg-cyan-500/10 ring-1 ring-cyan-500/20 text-cyan-400"
              label="CTR"
              value={c.ctr != null ? `${c.ctr.toFixed(2)}%` : "--"}
              sub="Click-through rate across the selected window"
            />
            <StatCard
              icon={Target}
              iconColor="bg-violet-500/10 ring-1 ring-violet-500/20 text-violet-400"
              label="CPC"
              value={c.cpc != null ? fmtUsd(c.cpc) : "--"}
              sub="Average cost per click"
            />
            <StatCard
              icon={Eye}
              iconColor="bg-blue-500/10 ring-1 ring-blue-500/20 text-blue-400"
              label="CPM"
              value={c.cpm != null ? fmtUsd(c.cpm) : "--"}
              sub="Average cost per thousand impressions"
            />
          </div>
        </section>
      )}

      <CampaignAnalytics
        ageGender={ageGender}
        placements={placements}
        geography={geography}
        ads={ads}
        hourly={hourly}
        daily={daily}
        rangeLabel={rangeLabel}
      />
      {/* -- Recommendations -- */}
      {recommendations.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Insights & Recommendations</span>
          </div>
          <RecommendationsList items={recommendations} />
        </section>
      )}

      {/* -- Ads -- */}
      {ads.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Ad Performance</span>
            <span className="text-xs text-white/45 ml-auto">{ads.length} ads</span>
          </div>
          <AdsPreview ads={ads} />
        </section>
      )}

      {/* -- Empty state -- */}
      {dataSource === "supabase" && ageGender.length === 0 && ads.length === 0 && (
        <div className="glass-card p-8 text-center">
          <p className="text-sm text-white/50 mb-1">Demographics and ad breakdowns unavailable</p>
          <p className="text-xs text-white/40">
            Live data from Meta is required for detailed breakdowns. Showing cached totals.
          </p>
        </div>
      )}

      <ClientPortalFooter dataSource={dataSource} showClock />
    </div>
  );
}

function OverviewCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-cyan-500/[0.03] to-transparent" />
      <div className="relative">
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">{label}</p>
        <p className="mt-2 text-2xl font-bold tracking-tight text-white">{value}</p>
        <p className="mt-2 text-xs text-white/45">{sub}</p>
      </div>
    </div>
  );
}

function getDaysLive(startTime: string | null): number | null {
  if (!startTime) return null;
  const start = new Date(startTime);
  if (Number.isNaN(start.getTime())) return null;
  const diff = Date.now() - start.getTime();
  return Math.max(1, Math.floor(diff / 86_400_000) + 1);
}

function CampaignIntelligenceBrief({
  brief,
}: {
  brief: {
    headline: string;
    body: string;
    highlights: Array<{ label: string; value: string; detail: string }>;
    watchItems: Array<{ label: string; detail: string }>;
  };
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.8fr)]">
      <div className="relative overflow-hidden rounded-[28px] border border-white/[0.06] bg-white/[0.03] p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.1] via-violet-500/[0.04] to-transparent" />
        <div className="relative">
          <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-300/75">
            Campaign Intelligence Brief
          </p>
          <h2 className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-white sm:text-[2rem]">
            {brief.headline}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">{brief.body}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {brief.highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/[0.08] bg-black/10 p-4 backdrop-blur-sm"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">{item.label}</p>
                <p className="mt-2 text-lg font-semibold tracking-tight text-white">{item.value}</p>
                <p className="mt-2 text-xs leading-5 text-white/45">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-5 sm:p-6">
        <p className="text-[10px] uppercase tracking-[0.24em] text-white/30">What To Watch</p>
        <div className="mt-4 space-y-3">
          {brief.watchItems.map((item, index) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-[10px] font-semibold text-white/55">
                  {index + 1}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">{item.label}</p>
                  <p className="mt-1 text-xs leading-5 text-white/50">{item.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function hasMeaningfulCampaignWindow(campaign: CampaignCard, daily: DailyPoint[]) {
  if (campaign.spend > 0 || campaign.impressions > 0 || campaign.clicks > 0) return true;
  return daily.some(
    (row) =>
      row.spend > 0 ||
      row.impressions > 0 ||
      row.clicks > 0 ||
      (row.revenue ?? 0) > 0,
  );
}

function buildCampaignBrief({
  campaign,
  rangeLabel,
  trackedDays,
  hasWindowDelivery,
  pacePct,
  bestDay,
  bestHour,
  topCreative,
  topMarket,
}: {
  campaign: CampaignCard;
  rangeLabel: string;
  trackedDays: number;
  hasWindowDelivery: boolean;
  pacePct: number | null;
  bestDay: ReturnType<typeof findBestDayOfWeek>;
  bestHour: HourlyBreakdown | null;
  topCreative: AdCard | null;
  topMarket: GeographyBreakdown | null;
}) {
  const normalizedStatus = formatStatus(campaign.status);

  if (!hasWindowDelivery) {
    return {
      headline: `No meaningful delivery is showing in ${rangeLabel.toLowerCase()}.`,
      body:
        normalizedStatus === "Paused"
          ? `${campaign.name} is currently paused, so this window has no spend, impressions, or clicks to analyze with confidence. The client view should steer people toward a wider range before claiming a top audience, market, or hour.`
          : `${campaign.name} does not have enough spend, impressions, or clicks in this range to support a confident performance story. Use 7d, 30d, or Lifetime for a stronger client-facing readout.`,
      highlights: [
        {
          label: "Status",
          value: normalizedStatus,
          detail: "Current campaign state in Meta",
        },
        {
          label: "Daily Budget",
          value: campaign.dailyBudget != null ? `${fmtUsd(campaign.dailyBudget)}/day` : "--",
          detail: "Configured budget ceiling",
        },
        {
          label: "Recommended Range",
          value: trackedDays <= 1 ? "7d or 30d" : "Wider range",
          detail: "Use a fuller window before ranking signals",
        },
      ],
      watchItems: [
        {
          label: "Range Confidence",
          detail: "There is not enough current-window delivery to rank audience, timing, or geography credibly.",
        },
        {
          label: "Budget Pacing",
          detail:
            pacePct != null
              ? `Average spend in this range is ${pacePct.toFixed(0)}% of the configured daily budget.`
              : "No pacing read is available yet in this selected range.",
        },
        {
          label: "Client Story",
          detail: "Show a wider range before presenting “best day”, “best hour”, or “winning creative” claims to the client.",
        },
      ],
    };
  }

  if (bestDay && bestHour && topMarket) {
    return {
      headline: `${formatDay(bestDay.label)} around ${formatHour(bestHour.hour)} is the strongest delivery window.`,
      body: `${campaign.name} has enough signal to talk about timing and geography with confidence. ${topMarket.market} is the cleanest market benchmark, and this window should anchor the client story before budget shifts or creative refreshes.`,
      highlights: [
        {
          label: "ROAS",
          value: campaign.roas != null ? `${campaign.roas.toFixed(1)}x` : "--",
          detail: roasLabel(campaign.roas),
        },
        {
          label: "Best Day",
          value: formatDay(bestDay.label),
          detail:
            bestDay.roas != null
              ? `${bestDay.roas.toFixed(2)}x ROAS`
              : `${fmtNum(bestDay.clicks)} clicks in the strongest weekday`,
        },
        {
          label: "Lead Market",
          value: topMarket.market,
          detail:
            topMarket.ctr != null
              ? `${topMarket.ctr.toFixed(2)}% CTR`
              : `${fmtNum(topMarket.impressions)} impressions in market`,
        },
      ],
      watchItems: [
        {
          label: "Best Hour",
          detail:
            bestHour.ctr != null
              ? `${formatHour(bestHour.hour)} is returning ${bestHour.ctr.toFixed(2)}% CTR.`
              : `${formatHour(bestHour.hour)} is producing the heaviest delivery volume.`,
        },
        {
          label: "Creative Benchmark",
          detail: topCreative
            ? `${topCreative.name} is the current benchmark creative for this campaign.`
            : "Timing and geography are clearer than creative differentiation right now.",
        },
        {
          label: "Budget Pacing",
          detail:
            pacePct != null
              ? `Average spend is pacing at ${pacePct.toFixed(0)}% of the daily budget.`
              : "Use daily trend data to decide whether the budget should stay where it is.",
        },
      ],
    };
  }

  return {
    headline: topCreative
      ? `${topCreative.name} is the clearest creative benchmark right now.`
      : `${campaign.name} is building a directional performance story.`,
    body: `This view now groups the strongest available signals into one operating brief so the client sees what matters first, then the supporting charts below.`,
    highlights: [
      {
        label: "ROAS",
        value: campaign.roas != null ? `${campaign.roas.toFixed(1)}x` : "--",
        detail: roasLabel(campaign.roas),
      },
      {
        label: "Top Creative",
        value: topCreative?.name ?? "Still emerging",
        detail: topCreative?.revenue != null && topCreative.revenue > 0
          ? `${fmtUsd(topCreative.revenue)} attributed revenue`
          : "Creative differentiation is still forming",
      },
      {
        label: "Top Market",
        value: topMarket?.market ?? "Still emerging",
        detail: topMarket?.ctr != null
          ? `${topMarket.ctr.toFixed(2)}% CTR`
          : "Market mix needs more delivery for a strong read",
      },
    ],
    watchItems: [
      {
        label: "Timing",
        detail: bestHour
          ? `${formatHour(bestHour.hour)} is currently the strongest hour for response.`
          : "Wait for more delivery before ranking hours with confidence.",
      },
      {
        label: "Weekday Pattern",
        detail: bestDay
          ? `${formatDay(bestDay.label)} is the strongest weekday in this selected range.`
          : "Weekday performance is still too thin to call a winner.",
      },
      {
        label: "Budget Pacing",
        detail:
          pacePct != null
            ? `Average spend is pacing at ${pacePct.toFixed(0)}% of the configured daily budget.`
            : "Budget pacing becomes clearer once the range has more delivery volume.",
      },
    ],
  };
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatHour(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
}

function formatDay(day: string): string {
  const fullDayMap: Record<string, string> = {
    Sun: "Sunday",
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
  };

  return fullDayMap[day] ?? day;
}
