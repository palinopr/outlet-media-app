import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  DollarSign,
  Eye,
  Gauge,
  Image as ImageIcon,
  MousePointerClick,
  Globe2,
  Users,
  type LucideIcon,
} from "lucide-react";
import { parseClientCampaignRange } from "@/lib/constants";
import { fmtDate, fmtUsd, fmtNum } from "@/lib/formatters";
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
import { getClientPortalTheme } from "@/features/client-portal/theme";
import { getClientCampaignOperatingView } from "@/features/campaigns/client-operating";
import { CampaignOperatingPanel } from "../../components/campaign-operating-panel";
import { findBestDayOfWeek, findBestHour, findTopCreative, findTopMarket } from "../../lib";

interface Props {
  params: Promise<{ slug: string; campaignId: string }>;
  searchParams: Promise<{ range?: string; since?: string; until?: string }>;
}

export default async function CampaignDetailPage({ params, searchParams }: Props) {
  const { slug, campaignId } = await params;
  const { scope } = await requireClientAccess(slug);
  const rawSearchParams = await searchParams;
  const range = parseClientCampaignRange(rawSearchParams, "today");

  const [data, operatingView] = await Promise.all([
    getCampaignDetail(slug, campaignId, range, scope),
    getClientCampaignOperatingView({
      campaignId,
      clientSlug: slug,
      scope,
    }),
  ]);
  const theme = getClientPortalTheme(slug);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-white/60 text-sm">Campaign not found.</p>
        <Link
          href={`/client/${slug}/campaigns`}
          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
        >
          <ArrowLeft className="h-3 w-3" /> Back to campaigns
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
    dataSource,
    rangeLabel,
  } = data;

  const trackedDays = daily.length;
  const totalDailySpend = daily.reduce((sum, row) => sum + row.spend, 0);
  const avgDailySpend = trackedDays > 0 ? totalDailySpend / trackedDays : null;
  const daysLive = getDaysLive(c.startTime);
  const bestDay = findBestDayOfWeek(daily);
  const bestHour = findBestHour(hourly);
  const topCreative = findTopCreative(ads);
  const topMarket = findTopMarket(geography);

  const performanceCards = [
    {
      label: "Spend",
      value: fmtUsd(c.spend),
      detail: rangeLabel,
      icon: DollarSign,
    },
    {
      label: "Impressions",
      value: fmtNum(c.impressions),
      detail: "Ad views",
      icon: Eye,
    },
    {
      label: "Clicks",
      value: fmtNum(c.clicks),
      detail: "Link clicks",
      icon: MousePointerClick,
    },
    {
      label: "CTR",
      value: c.ctr != null ? `${c.ctr.toFixed(2)}%` : "--",
      detail: "Click rate",
      icon: Gauge,
    },
    {
      label: "CPC",
      value: c.cpc != null ? fmtUsd(c.cpc) : "--",
      detail: "Cost per click",
      icon: MousePointerClick,
    },
    {
      label: "CPM",
      value: c.cpm != null ? fmtUsd(c.cpm) : "--",
      detail: "Cost per 1,000 views",
      icon: BarChart3,
    },
  ];

  const breakdownCards = [
    topMarket
      ? {
          label: "Top Market",
          value: topMarket.market,
          detail:
            topMarket.ctr != null
              ? `${topMarket.ctr.toFixed(2)}% CTR`
              : `${fmtNum(topMarket.impressions)} impressions`,
        }
      : null,
    bestDay
      ? {
          label: "Top Day",
          value: formatDay(bestDay.label),
          detail:
            bestDay.roas != null
              ? `${bestDay.roas.toFixed(2)}x ROAS`
              : `${fmtNum(bestDay.clicks)} clicks`,
        }
      : null,
    bestHour
      ? {
          label: "Top Hour",
          value: formatHour(bestHour.hour),
          detail:
            bestHour.ctr != null
              ? `${bestHour.ctr.toFixed(2)}% CTR`
              : `${fmtNum(bestHour.impressions)} impressions`,
        }
      : null,
    topCreative
      ? {
          label: "Top Ad",
          value: topCreative.name,
          detail:
            topCreative.roas != null
              ? `${topCreative.roas.toFixed(1)}x ROAS`
              : `${fmtNum(topCreative.clicks)} clicks`,
        }
      : null,
    avgDailySpend != null
      ? {
          label: "Daily Avg",
          value: fmtUsd(avgDailySpend),
          detail: trackedDays > 1 ? `${trackedDays} tracked days` : "Today",
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
      cpc: row.clicks > 0 ? row.spend / row.clicks : null,
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

  return (
    <div className="space-y-4">
      {/* -- Header -- */}
      <CampaignDetailHeader
        slug={slug}
        range={range}
        rangeLabel={rangeLabel}
        campaign={c}
        theme={theme}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        {performanceCards.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </div>

      {breakdownCards.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {breakdownCards.map((card) => (
            <SnapshotCard key={card.label} {...card} />
          ))}
        </div>
      )}

      <section className="min-w-0">
        <div className="mb-2 flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-white/50" />
          <span className="section-label">Performance timeline</span>
          <span className="ml-auto text-xs text-white/45">{rangeLabel}</span>
        </div>
        <PerformanceTrendTabs data={trendData} />
      </section>

      <div className="grid gap-3 xl:grid-cols-[1.15fr_0.85fr]">
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

        <section className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <BarChart3 className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Hourly delivery</span>
          </div>
          {hourlyData.length > 0 ? (
            <HourlyHeatmap data={hourlyData} />
          ) : (
            <FallbackCard
              title="Hourly Delivery"
              detail="Hourly delivery data is not available for this selected range yet."
            />
          )}
        </section>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <ImageIcon className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Creative performance</span>
            <span className="ml-auto text-xs text-white/45">
              {ads.length > 0 ? `${ads.length} ads` : "No ad previews"}
            </span>
          </div>
          {ads.length > 0 ? (
            <AdsPreview ads={ads} />
          ) : (
            <FallbackCard
              title="Creative Performance"
              detail="Creative-level previews are not available from the current data source."
            />
          )}
        </section>

        <section className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Audience breakdown</span>
          </div>
          {ageGender.length > 0 ? (
            <AudienceDemographics data={ageGender} />
          ) : (
            <FallbackCard
              title="Audience Breakdown"
              detail="Audience breakdowns are not available from the current data source."
            />
          )}
        </section>
      </div>

      <CampaignOperatingPanel campaignId={campaignId} data={operatingView} slug={slug} />

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

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05] text-white/62">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">{label}</p>
      <p className="mt-1.5 text-2xl font-bold tracking-tight text-white leading-none">{value}</p>
      <p className="mt-2 text-[11px] leading-4 text-white/38">{detail}</p>
    </div>
  );
}

function SnapshotCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">{label}</p>
      <p className="mt-1.5 truncate text-lg font-bold leading-tight tracking-tight text-white">{value}</p>
      <p className="mt-1 text-[11px] leading-4 text-white/38">{detail}</p>
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

function getDaysLive(startTime: string | null): number | null {
  if (!startTime) return null;
  const start = new Date(startTime);
  if (Number.isNaN(start.getTime())) return null;
  const diff = Date.now() - start.getTime();
  return Math.max(1, Math.floor(diff / 86_400_000) + 1);
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
