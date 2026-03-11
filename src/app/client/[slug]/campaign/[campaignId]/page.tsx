import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Image as ImageIcon,
  Lightbulb,
  Globe2,
  Users,
} from "lucide-react";
import { parseRange } from "@/lib/constants";
import { fmtDate, fmtUsd, fmtNum } from "@/lib/formatters";
import type {
  AdCard,
  AgeGenderBreakdown,
  CampaignCard,
  DailyPoint,
  GeographyBreakdown,
  HourlyBreakdown,
} from "../../types";
import { getCampaignDetail } from "./data";
import { AdsPreview } from "@/components/client/ads-preview";
import {
  AudienceDemographics,
  HourlyHeatmap,
  MarketPerformanceTable,
  PerformanceTrendTabs,
  PlacementBarChart,
} from "@/components/client/charts";
import { ClientPortalFooter } from "../../components/client-portal-footer";
import { CampaignDetailHeader } from "../../components/campaign-detail-header";
import { requireClientAccess } from "@/features/client-portal/access";
import { canManageClientAccount } from "@/features/client-portal/ownership";
import { getClientPortalTheme } from "@/features/client-portal/theme";
import { findBestDayOfWeek, findBestHour, findTopCreative, findTopMarket, roasLabel } from "../../lib";

interface Props {
  params: Promise<{ slug: string; campaignId: string }>;
  searchParams: Promise<{ range?: string }>;
}

export default async function CampaignDetailPage({ params, searchParams }: Props) {
  const { slug, campaignId } = await params;
  const { scope } = await requireClientAccess(slug, "meta_ads");
  const canManage = await canManageClientAccount(slug);
  const { range: rangeParam } = await searchParams;
  const range = parseRange(rangeParam, "7");

  const data = await getCampaignDetail(slug, campaignId, range, scope);
  const theme = getClientPortalTheme(slug);

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
  const avgDailySpend = trackedDays > 0 ? totalDailySpend / trackedDays : null;
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
  const topAge = findTopAge(ageGender);
  const leadingGender = findLeadingGender(ageGender);
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

  const snapshotCards = [
    topAge
      ? {
          label: "Best Age",
          value: topAge.age,
          detail:
            topAge.ctr != null
              ? `${topAge.ctr.toFixed(2)}% CTR`
              : `${fmtNum(topAge.impressions)} impressions`,
        }
      : null,
    leadingGender
      ? {
          label: "Leading Gender",
          value: leadingGender.gender,
          detail:
            leadingGender.ctr != null
              ? `${leadingGender.ctr.toFixed(2)}% CTR`
              : `${leadingGender.pct.toFixed(0)}% of reach`,
        }
      : null,
    topMarket
      ? {
          label: "Best Market",
          value: topMarket.market,
          detail:
            topMarket.ctr != null
              ? `${topMarket.ctr.toFixed(2)}% CTR`
              : `${fmtNum(topMarket.impressions)} impressions`,
        }
      : null,
    bestDay
      ? {
          label: "Best Day",
          value: formatDay(bestDay.label),
          detail:
            bestDay.roas != null
              ? `${bestDay.roas.toFixed(2)}x ROAS`
              : `${fmtNum(bestDay.clicks)} clicks`,
        }
      : null,
    bestHour
      ? {
          label: "Best Hour",
          value: formatHour(bestHour.hour),
          detail:
            bestHour.ctr != null
              ? `${bestHour.ctr.toFixed(2)}% CTR`
              : `${fmtNum(bestHour.impressions)} impressions`,
        }
      : null,
    topCreative
      ? {
          label: "Top Creative",
          value: topCreative.name,
          detail:
            topCreative.roas != null
              ? `${topCreative.roas.toFixed(1)}x ROAS`
              : `${fmtNum(topCreative.clicks)} clicks`,
        }
      : null,
    pacePct != null
      ? {
          label: "Budget Pace",
          value: `${pacePct.toFixed(0)}%`,
          detail: avgDailySpend != null ? `${fmtUsd(avgDailySpend)}/day avg` : "Average daily pace",
        }
      : daysLive != null
        ? {
            label: "Days Live",
            value: daysLive.toLocaleString(),
            detail: c.startTime ? `Since ${fmtDate(c.startTime)}` : "Campaign lifetime so far",
          }
        : null,
  ].filter(
    (
      card,
    ): card is {
      label: string;
      value: string;
      detail: string;
    } => card != null,
  );

  const trendData = daily.map((row) => {
    const date = new Date(`${row.date}T12:00:00`);
    return {
      date: row.date,
      label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      spend: row.spend,
      revenue: row.revenue,
      roas: row.roas,
      impressions: row.impressions,
      clicks: row.clicks,
      ctr: row.ctr,
    };
  });

  const totalPlacementImp = placements.reduce((sum, row) => sum + row.impressions, 0);
  const placementData = placements.map((row) => ({
    platform: row.platform,
    position: row.position,
    impressions: row.impressions,
    clicks: row.clicks,
    ctr: row.ctr,
    pct: totalPlacementImp > 0 ? (row.impressions / totalPlacementImp) * 100 : 0,
  }));

  const totalMarketImp = geography.reduce((sum, row) => sum + row.impressions, 0);
  const marketData = geography.map((row) => ({
    market: row.market,
    spend: row.spend,
    impressions: row.impressions,
    clicks: row.clicks,
    ctr: row.ctr,
    cpc: row.cpc,
    pct: totalMarketImp > 0 ? (row.impressions / totalMarketImp) * 100 : 0,
  }));

  const hourlyData = hourly.map((row) => ({
    hour: row.hour,
    spend: row.spend,
    impressions: row.impressions,
    clicks: row.clicks,
    ctr: row.ctr,
  }));

  const operatingRecommendations =
    recommendations.length > 0
      ? recommendations.map((item) => ({
          title: item.title,
          detail: item.detail,
        }))
      : brief.watchItems.map((item) => ({
          title: item.label,
          detail: item.detail,
        }));

  return (
    <div className="space-y-4">
      {/* -- Header -- */}
      <CampaignDetailHeader
        slug={slug}
        range={range}
        rangeLabel={rangeLabel}
        campaign={c}
        editHref={canManage ? `/client/${slug}/campaign/${campaignId}/edit` : null}
        theme={theme}
      />

      {/* -- Intelligence Brief (simple text) -- */}
      <CampaignIntelligenceBrief brief={brief} theme={theme} />

      {/* -- Audience Snapshot (horizontal row) -- */}
      {snapshotCards.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {snapshotCards.map((card) => (
            <SnapshotCard key={card.label} {...card} />
          ))}
        </div>
      )}

      {/* -- Row 2: Performance Timeline | Daypart Heatmap | Audience Demographics -- */}
      <div className="grid gap-3 xl:grid-cols-3">
        <section className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Strong performance timeline</span>
            <span className="ml-auto text-xs text-white/45">{rangeLabel}</span>
          </div>
          <PerformanceTrendTabs data={trendData} />
        </section>

        <section className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <BarChart3 className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">True daypart heatmap</span>
          </div>
          {hourlyData.length > 0 ? (
            <HourlyHeatmap data={hourlyData} />
          ) : (
            <FallbackCard
              title="Daypart Heatmap"
              detail="Hourly delivery data is not available for this selected range yet."
            />
          )}
        </section>

        <section className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Audience demographics</span>
          </div>
          {ageGender.length > 0 ? (
            <AudienceDemographics data={ageGender} />
          ) : (
            <FallbackCard
              title="Audience Demographics"
              detail="Demographic breakdowns are not available from the current data source."
            />
          )}
        </section>
      </div>

      {/* -- Row 3: Markets & Placements | Ad Performance + Recommendations -- */}
      <div className="grid gap-3 xl:grid-cols-2">
        {(marketData.length > 0 || placementData.length > 0) && (
          <section className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <Globe2 className="h-3.5 w-3.5 text-white/50" />
              <span className="section-label">Markets & placements</span>
              <span className="ml-auto text-xs text-white/45">{rangeLabel}</span>
            </div>
            <div className="space-y-3">
              {marketData.length > 0 ? <MarketPerformanceTable data={marketData} /> : null}
              {placementData.length > 0 ? <PlacementBarChart data={placementData} /> : null}
            </div>
          </section>
        )}

        <div className="space-y-3 min-w-0">
          <section>
            <div className="mb-2 flex items-center gap-2">
              <ImageIcon className="h-3.5 w-3.5 text-white/50" />
              <span className="section-label">Ad performance</span>
              <span className="ml-auto text-xs text-white/45">
                {ads.length > 0 ? `${ads.length} ads` : "No ad previews"}
              </span>
            </div>
            {ads.length > 0 ? (
              <AdsPreview ads={ads} />
            ) : (
              <FallbackCard
                title="Ad Performance"
                detail="Creative-level previews are not available from the current data source."
              />
            )}
          </section>

          <OperatingRecommendations items={operatingRecommendations} />
        </div>
      </div>

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

function SnapshotCard({
  label,
  value,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">{label}</p>
      <p className="mt-1.5 text-lg font-bold tracking-tight text-white leading-tight truncate">{value}</p>
    </div>
  );
}

function FallbackCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="glass-card p-5">
      <p className="text-xs font-semibold text-white/65">{title}</p>
      <p className="mt-2 text-xs leading-6 text-white/42">{detail}</p>
    </div>
  );
}

function OperatingRecommendations({
  items,
}: {
  items: Array<{ title: string; detail: string }>;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Lightbulb className="h-3.5 w-3.5 text-white/50" />
        <span className="section-label">Recommendations</span>
      </div>
      <div className="glass-card p-5">
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.slice(0, 4).map((item, index) => (
              <div key={`${item.title}-${index}`} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                <div className="min-w-0">
                  <p className="text-xs leading-5 text-white/45">
                    <span className="font-semibold text-white/80">Strategy:</span>{" "}
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs leading-6 text-white/42">
            Recommendations will appear here once the campaign has enough signal for a confident
            next step.
          </p>
        )}
      </div>
    </section>
  );
}

function findTopAge(rows: AgeGenderBreakdown[]) {
  if (rows.length === 0) return null;

  const byAge = new Map<string, { age: string; impressions: number; clicks: number; ctr: number | null }>();
  for (const row of rows) {
    const existing = byAge.get(row.age) ?? {
      age: row.age,
      impressions: 0,
      clicks: 0,
      ctr: null,
    };
    const impressions = existing.impressions + row.impressions;
    const clicks = existing.clicks + row.clicks;
    byAge.set(row.age, {
      age: row.age,
      impressions,
      clicks,
      ctr: impressions > 0 ? (clicks / impressions) * 100 : null,
    });
  }

  return Array.from(byAge.values()).sort((a, b) => {
    if ((b.ctr ?? 0) !== (a.ctr ?? 0)) return (b.ctr ?? 0) - (a.ctr ?? 0);
    if (b.clicks !== a.clicks) return b.clicks - a.clicks;
    return b.impressions - a.impressions;
  })[0] ?? null;
}

function findLeadingGender(rows: AgeGenderBreakdown[]) {
  if (rows.length === 0) return null;

  const totalImpressions = rows.reduce((sum, row) => sum + row.impressions, 0);
  const byGender = new Map<string, { gender: string; impressions: number; clicks: number; ctr: number | null; pct: number }>();

  for (const row of rows) {
    const existing = byGender.get(row.gender) ?? {
      gender: row.gender,
      impressions: 0,
      clicks: 0,
      ctr: null,
      pct: 0,
    };
    const impressions = existing.impressions + row.impressions;
    const clicks = existing.clicks + row.clicks;
    byGender.set(row.gender, {
      gender: row.gender,
      impressions,
      clicks,
      ctr: impressions > 0 ? (clicks / impressions) * 100 : null,
      pct: totalImpressions > 0 ? (impressions / totalImpressions) * 100 : 0,
    });
  }

  return Array.from(byGender.values()).sort((a, b) => {
    if (b.impressions !== a.impressions) return b.impressions - a.impressions;
    return (b.ctr ?? 0) - (a.ctr ?? 0);
  })[0] ?? null;
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
  theme,
}: {
  brief: {
    headline: string;
    body: string;
    highlights: Array<{ label: string; value: string; detail: string }>;
    watchItems: Array<{ label: string; detail: string }>;
  };
  theme: ReturnType<typeof getClientPortalTheme>;
}) {
  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 py-5"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(${theme.accentRgb}, 0.10), rgba(${theme.secondaryRgb}, 0.05) 60%, transparent 100%)`,
      }}
    >
      <div className="relative">
        <p className="text-sm font-semibold text-white/80">Campaign Intelligence Brief</p>
        <p className="mt-2 text-sm leading-6 text-white/50">{brief.body}</p>
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
