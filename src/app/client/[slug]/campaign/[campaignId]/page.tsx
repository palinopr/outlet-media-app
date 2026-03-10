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
import { getCampaignDetail } from "./data";
import { AdsPreview } from "@/components/client/ads-preview";
import { RecommendationsList } from "@/components/client/recommendations";
import { ClientPortalFooter } from "../../components/client-portal-footer";
import { StatCard } from "../../components/stat-card";
import { CampaignDetailHeader } from "../../components/campaign-detail-header";
import { CampaignAnalytics } from "../../components/campaign-analytics";
import { requireClientAccess } from "@/features/client-portal/access";

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
