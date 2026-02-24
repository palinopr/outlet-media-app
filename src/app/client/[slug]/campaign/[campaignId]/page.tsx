import Link from "next/link";
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Eye,
  MousePointer,
  Target,
  Users,
  BarChart3,
  Image,
  Clock,
  Shield,
  Sparkles,
  Layers,
} from "lucide-react";
import type { DateRange } from "../../data";
import {
  type AgeGenderBreakdown,
  type PlacementBreakdown,
  type AdCard,
  fmtUsd,
  fmtNum,
  fmtDate,
  roasColor,
  roasLabel,
  getCampaignStatusCfg,
  AGE_BRACKETS,
} from "../../lib";
import { getCampaignDetail } from "./data";

interface Props {
  params: Promise<{ slug: string; campaignId: string }>;
  searchParams: Promise<{ range?: string }>;
}

const DATE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7", label: "7d" },
  { value: "14", label: "14d" },
  { value: "30", label: "30d" },
  { value: "lifetime", label: "Lifetime" },
];

// --- Small UI pieces ---

function StatCard({
  icon: Icon,
  iconColor,
  label,
  value,
  sub,
}: {
  icon: typeof DollarSign;
  iconColor: string;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`flex items-center justify-center h-6 w-6 rounded-lg ${iconColor}`}>
          <Icon className="h-3 w-3" />
        </div>
        <span className="text-[10px] font-semibold tracking-wider uppercase text-white/40">
          {label}
        </span>
      </div>
      <p className="text-xl font-extrabold text-white tracking-tight">{value}</p>
      {sub && <p className="text-[10px] text-white/25 mt-1">{sub}</p>}
    </div>
  );
}

function ProgressBar({ value, color = "gradient" }: { value: number; color?: string }) {
  const cls = color === "gradient" ? "gradient-bar" : color;
  return (
    <div className="progress-track h-1.5">
      <div className={`h-full rounded-full ${cls}`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

function CampaignStatusBadge({ status }: { status: string }) {
  const cfg = getCampaignStatusCfg(status);
  return (
    <span className={`badge-status ${cfg.text} ${cfg.bg}`}>
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// --- Age/Gender Section ---

function AgeGenderSection({ data }: { data: AgeGenderBreakdown[] }) {
  if (data.length === 0) return null;

  // Aggregate by age bracket
  const byAge = new Map<string, { spend: number; impressions: number; clicks: number }>();
  for (const row of data) {
    const prev = byAge.get(row.age) ?? { spend: 0, impressions: 0, clicks: 0 };
    byAge.set(row.age, {
      spend: prev.spend + row.spend,
      impressions: prev.impressions + row.impressions,
      clicks: prev.clicks + row.clicks,
    });
  }

  // Aggregate by gender
  const byGender = new Map<string, { spend: number; impressions: number }>();
  for (const row of data) {
    const prev = byGender.get(row.gender) ?? { spend: 0, impressions: 0 };
    byGender.set(row.gender, {
      spend: prev.spend + row.spend,
      impressions: prev.impressions + row.impressions,
    });
  }

  const totalImpressions = data.reduce((s, r) => s + r.impressions, 0);
  const totalSpend = data.reduce((s, r) => s + r.spend, 0);

  // Sort age brackets in standard order
  const ageEntries = AGE_BRACKETS
    .filter((a) => byAge.has(a))
    .map((a) => ({ age: a, ...byAge.get(a)! }));

  const genderEntries = Array.from(byGender.entries())
    .map(([gender, vals]) => ({ gender, ...vals }))
    .sort((a, b) => b.impressions - a.impressions);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Age breakdown */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-3.5 w-3.5 text-cyan-400/60" />
          <span className="text-xs font-semibold text-white/60">Age Distribution</span>
        </div>
        <div className="space-y-3">
          {ageEntries.map((row) => {
            const pct = totalImpressions > 0 ? (row.impressions / totalImpressions) * 100 : 0;
            return (
              <div key={row.age}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/50">{row.age}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-white/30">{fmtUsd(row.spend)}</span>
                    <span className="text-xs font-semibold text-white/80 w-10 text-right">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <ProgressBar value={pct} color="bg-cyan-400" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Gender breakdown */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-3.5 w-3.5 text-violet-400/60" />
          <span className="text-xs font-semibold text-white/60">Gender Split</span>
        </div>
        <div className="space-y-4">
          {genderEntries.map((row) => {
            const pctImp = totalImpressions > 0 ? (row.impressions / totalImpressions) * 100 : 0;
            const pctSpend = totalSpend > 0 ? (row.spend / totalSpend) * 100 : 0;
            const barColor = row.gender === "Female" ? "bg-violet-400" : row.gender === "Male" ? "bg-cyan-400" : "bg-white/30";
            return (
              <div key={row.gender}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/50">{row.gender}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-white/30">{fmtUsd(row.spend)}</span>
                    <span className="text-xs font-semibold text-white/80 w-10 text-right">
                      {pctImp.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <ProgressBar value={pctImp} color={barColor} />
                <p className="text-[10px] text-white/20 mt-1">
                  {pctSpend.toFixed(0)}% of spend
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- Placements Section ---

function PlacementsSection({ data }: { data: PlacementBreakdown[] }) {
  if (data.length === 0) return null;

  const totalSpend = data.reduce((s, r) => s + r.spend, 0);
  const sorted = [...data].sort((a, b) => b.spend - a.spend);

  const platformColors: Record<string, string> = {
    Facebook: "bg-blue-400",
    Instagram: "bg-violet-400",
    Messenger: "bg-cyan-400",
    "Audience Network": "bg-amber-400",
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="h-3.5 w-3.5 text-blue-400/60" />
        <span className="text-xs font-semibold text-white/60">Placements</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-white/30 text-left border-b border-white/[0.06]">
              <th className="pb-2 font-medium">Platform</th>
              <th className="pb-2 font-medium">Position</th>
              <th className="pb-2 font-medium text-right">Spend</th>
              <th className="pb-2 font-medium text-right">Impressions</th>
              <th className="pb-2 font-medium text-right">Clicks</th>
              <th className="pb-2 font-medium text-right">CTR</th>
              <th className="pb-2 font-medium text-right">Share</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => {
              const pct = totalSpend > 0 ? (row.spend / totalSpend) * 100 : 0;
              const dotColor = platformColors[row.platform] ?? "bg-white/30";
              return (
                <tr key={i} className="border-b border-white/[0.03] last:border-0">
                  <td className="py-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
                      <span className="text-white/70">{row.platform}</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-white/50">{row.position}</td>
                  <td className="py-2.5 text-white/70 text-right font-medium">{fmtUsd(row.spend)}</td>
                  <td className="py-2.5 text-white/50 text-right">{fmtNum(row.impressions)}</td>
                  <td className="py-2.5 text-white/50 text-right">{fmtNum(row.clicks)}</td>
                  <td className="py-2.5 text-white/50 text-right">
                    {row.ctr != null ? `${row.ctr.toFixed(2)}%` : "--"}
                  </td>
                  <td className="py-2.5 text-white/60 text-right font-medium">{pct.toFixed(0)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Ads Section ---

function AdsSection({ ads }: { ads: AdCard[] }) {
  if (ads.length === 0) return null;

  const sorted = [...ads].sort((a, b) => b.spend - a.spend);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sorted.map((ad) => (
        <div key={ad.adId} className="glass-card p-4 flex flex-col">
          {/* Thumbnail */}
          {ad.thumbnailUrl && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3 bg-white/[0.03]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ad.thumbnailUrl}
                alt={ad.name}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          {/* Ad name and status */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-xs font-semibold text-white/80 leading-tight line-clamp-2">
              {ad.name}
            </p>
            <CampaignStatusBadge status={ad.status} />
          </div>

          {ad.creativeTitle && (
            <p className="text-[10px] text-white/30 mb-2 line-clamp-1">{ad.creativeTitle}</p>
          )}

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-auto pt-3 border-t border-white/[0.06]">
            <div>
              <p className="text-[9px] text-white/25">Spend</p>
              <p className="text-sm font-bold text-white/80">{fmtUsd(ad.spend)}</p>
            </div>
            {ad.roas != null && (
              <div>
                <p className="text-[9px] text-white/25">ROAS</p>
                <p className={`text-sm font-bold ${roasColor(ad.roas)}`}>{ad.roas.toFixed(1)}x</p>
              </div>
            )}
            <div>
              <p className="text-[9px] text-white/25">Impressions</p>
              <p className="text-xs font-semibold text-white/60">{fmtNum(ad.impressions)}</p>
            </div>
            <div>
              <p className="text-[9px] text-white/25">Clicks</p>
              <p className="text-xs font-semibold text-white/60">{fmtNum(ad.clicks)}</p>
            </div>
            {ad.reach != null && (
              <div>
                <p className="text-[9px] text-white/25">Reach</p>
                <p className="text-xs font-semibold text-white/60">{fmtNum(ad.reach)}</p>
              </div>
            )}
            {ad.ctr != null && (
              <div>
                <p className="text-[9px] text-white/25">CTR</p>
                <p className="text-xs font-semibold text-white/60">{ad.ctr.toFixed(2)}%</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ========================================
// PAGE
// ========================================

export default async function CampaignDetailPage({ params, searchParams }: Props) {
  const { slug, campaignId } = await params;
  const { range: rangeParam } = await searchParams;
  const validRanges: DateRange[] = ["today", "yesterday", "7", "14", "30", "lifetime"];
  const range: DateRange = validRanges.includes(rangeParam as DateRange)
    ? (rangeParam as DateRange)
    : "lifetime";

  const data = await getCampaignDetail(slug, campaignId, range);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-white/40 text-sm">Campaign not found.</p>
        <Link
          href={`/client/${slug}`}
          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
        >
          <ArrowLeft className="h-3 w-3" /> Back to dashboard
        </Link>
      </div>
    );
  }

  const { campaign: c, ageGender, placements, ads, dataSource, rangeLabel } = data;

  return (
    <div className="space-y-6">
      {/* -- Header -- */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.07] via-violet-500/[0.05] to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-500/[0.08] to-transparent rounded-full blur-3xl" />

        <div className="relative">
          {/* Back link */}
          <Link
            href={`/client/${slug}?range=${range}`}
            className="inline-flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition mb-4"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to dashboard
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-cyan-400/70" />
                <span className="text-[10px] font-semibold tracking-widest uppercase text-cyan-400/70">
                  Campaign Detail
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{c.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <CampaignStatusBadge status={c.status} />
                {c.startTime && (
                  <span className="text-[10px] text-white/25">Since {fmtDate(c.startTime)}</span>
                )}
                {c.dailyBudget != null && (
                  <span className="text-[10px] text-white/25">
                    {fmtUsd(c.dailyBudget)}/day budget
                  </span>
                )}
                {dataSource === "meta_api" && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                )}
              </div>
            </div>

            {/* Date filter */}
            <div className="flex items-center gap-0.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] self-start">
              {DATE_OPTIONS.map((opt) => (
                <a
                  key={opt.value}
                  href={`?range=${opt.value}`}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-300 ${
                    range === opt.value
                      ? "bg-white text-zinc-900 shadow-lg shadow-white/10"
                      : "text-white/40 hover:text-white/70 hover:bg-white/[0.06]"
                  }`}
                >
                  {opt.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* -- Key Metrics -- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        <StatCard
          icon={DollarSign}
          iconColor="bg-cyan-500/10 ring-1 ring-cyan-500/20 text-cyan-400"
          label="Spend"
          value={fmtUsd(c.spend)}
        />
        <StatCard
          icon={TrendingUp}
          iconColor="bg-violet-500/10 ring-1 ring-violet-500/20 text-violet-400"
          label="ROAS"
          value={c.roas != null ? `${c.roas.toFixed(1)}x` : "--"}
          sub={roasLabel(c.roas)}
        />
        <StatCard
          icon={Target}
          iconColor="bg-emerald-500/10 ring-1 ring-emerald-500/20 text-emerald-400"
          label="Revenue"
          value={fmtUsd(c.revenue)}
        />
        <StatCard
          icon={Eye}
          iconColor="bg-blue-500/10 ring-1 ring-blue-500/20 text-blue-400"
          label="Impressions"
          value={fmtNum(c.impressions)}
        />
        <StatCard
          icon={MousePointer}
          iconColor="bg-amber-500/10 ring-1 ring-amber-500/20 text-amber-400"
          label="Clicks"
          value={fmtNum(c.clicks)}
          sub={c.ctr != null ? `${c.ctr.toFixed(2)}% CTR` : undefined}
        />
        <StatCard
          icon={DollarSign}
          iconColor="bg-rose-500/10 ring-1 ring-rose-500/20 text-rose-400"
          label="CPC"
          value={c.cpc != null ? `$${c.cpc.toFixed(2)}` : "--"}
          sub={c.cpm != null ? `$${c.cpm.toFixed(2)} CPM` : undefined}
        />
      </div>

      {/* -- Demographics (Age/Gender) -- */}
      {ageGender.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-3.5 w-3.5 text-white/30" />
            <span className="section-label">Audience Demographics</span>
            <span className="text-[10px] text-white/20 ml-auto">{rangeLabel}</span>
          </div>
          <AgeGenderSection data={ageGender} />
        </section>
      )}

      {/* -- Placements -- */}
      {placements.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Layers className="h-3.5 w-3.5 text-white/30" />
            <span className="section-label">Placement Breakdown</span>
            <span className="text-[10px] text-white/20 ml-auto">{rangeLabel}</span>
          </div>
          <PlacementsSection data={placements} />
        </section>
      )}

      {/* -- Ads -- */}
      {ads.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Image className="h-3.5 w-3.5 text-white/30" />
            <span className="section-label">Ads</span>
            <span className="text-[10px] text-white/20 ml-auto">{ads.length} ads</span>
          </div>
          <AdsSection ads={ads} />
        </section>
      )}

      {/* -- Empty state for Supabase fallback -- */}
      {dataSource === "supabase" && ageGender.length === 0 && ads.length === 0 && (
        <div className="glass-card p-8 text-center">
          <p className="text-sm text-white/30 mb-1">Demographics and ad breakdowns unavailable</p>
          <p className="text-[11px] text-white/15">
            Live data from Meta is required for detailed breakdowns. Showing cached totals.
          </p>
        </div>
      )}

      {/* -- Footer -- */}
      <footer className="pt-4 print:hidden">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">O</span>
            </div>
            <span className="text-xs text-white/25 font-medium">Powered by Outlet Media</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[11px] text-white/20">
              <Shield className="h-3 w-3" />
              <span>Secure Portal</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-white/20">
              <Clock className="h-3 w-3" />
              <span>{dataSource === "meta_api" ? "Live from Meta" : "Last sync"}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
