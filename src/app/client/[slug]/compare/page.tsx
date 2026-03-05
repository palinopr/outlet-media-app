import Link from "next/link";
import { ArrowLeft, Sparkles, Scale } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { getScopeFilter } from "@/lib/member-access";
import { fetchAllCampaigns, type MetaCampaignCard } from "@/lib/meta-campaigns";
import { fmtUsd, fmtNum, roasColor } from "@/lib/formatters";
import { roasLabel } from "../lib";
import { ClientPortalFooter } from "../components/client-portal-footer";
import { CompareSelector } from "./compare-selector";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ a?: string; b?: string }>;
}

function MetricRow({
  label,
  valA,
  valB,
  highlight,
}: {
  label: string;
  valA: string;
  valB: string;
  highlight?: "a" | "b" | null;
}) {
  return (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-white/[0.04]">
      <span className="text-xs text-white/50 font-medium">{label}</span>
      <span
        className={`text-sm font-bold text-right tabular-nums ${
          highlight === "a" ? "text-cyan-400" : "text-white/90"
        }`}
      >
        {valA}
      </span>
      <span
        className={`text-sm font-bold text-right tabular-nums ${
          highlight === "b" ? "text-cyan-400" : "text-white/90"
        }`}
      >
        {valB}
      </span>
    </div>
  );
}

function pickWinner(a: number | null, b: number | null, higherBetter = true): "a" | "b" | null {
  if (a == null || b == null) return null;
  if (a === b) return null;
  return higherBetter ? (a > b ? "a" : "b") : a < b ? "a" : "b";
}

export default async function ComparePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { a: idA, b: idB } = await searchParams;

  const { userId } = await auth();
  const scope = await getScopeFilter(userId, slug);

  const result = await fetchAllCampaigns("30", slug);
  let campaigns = result.campaigns;

  if (scope?.allowedCampaignIds) {
    const allowed = new Set(scope.allowedCampaignIds);
    campaigns = campaigns.filter((c) => allowed.has(c.campaignId));
  }

  const campA = idA ? campaigns.find((c) => c.campaignId === idA) : null;
  const campB = idB ? campaigns.find((c) => c.campaignId === idB) : null;

  const options = campaigns.map((c) => ({ id: c.campaignId, name: c.name, status: c.status }));

  if (!campA || !campB) {
    return (
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.07] via-violet-500/[0.05] to-transparent" />
          <div className="relative">
            <Link
              href={`/client/${slug}`}
              className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white/70 transition mb-4"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to dashboard
            </Link>
            <div className="flex items-center gap-2 mb-1">
              <Scale className="h-4 w-4 text-cyan-400/70" />
              <span className="text-xs font-semibold tracking-widest uppercase text-cyan-400">Compare</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Campaign Comparison
            </h1>
            <p className="text-sm text-white/50 mt-1.5">
              Select two campaigns to compare side by side
            </p>
          </div>
        </div>

        <CompareSelector slug={slug} options={options} selectedA={idA ?? ""} selectedB={idB ?? ""} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.07] via-violet-500/[0.05] to-transparent" />
        <div className="relative">
          <Link
            href={`/client/${slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white/70 transition mb-4"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to dashboard
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <Scale className="h-4 w-4 text-cyan-400/70" />
            <span className="text-xs font-semibold tracking-widest uppercase text-cyan-400">Compare</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Campaign Comparison
          </h1>
        </div>
      </div>

      <CompareSelector slug={slug} options={options} selectedA={idA ?? ""} selectedB={idB ?? ""} />

      <div className="glass-card p-5">
        <div className="grid grid-cols-3 gap-4 pb-3 border-b border-white/[0.08] mb-1">
          <span className="text-xs text-white/40 font-medium">Metric</span>
          <span className="text-xs text-white/70 font-semibold text-right truncate">{campA.name}</span>
          <span className="text-xs text-white/70 font-semibold text-right truncate">{campB.name}</span>
        </div>

        <MetricRow
          label="Status"
          valA={campA.status}
          valB={campB.status}
        />
        <MetricRow
          label="Spend"
          valA={fmtUsd(campA.spend)}
          valB={fmtUsd(campB.spend)}
        />
        <MetricRow
          label="Revenue"
          valA={fmtUsd(campA.revenue)}
          valB={fmtUsd(campB.revenue)}
          highlight={pickWinner(campA.revenue, campB.revenue)}
        />
        <MetricRow
          label="ROAS"
          valA={campA.roas != null ? `${campA.roas.toFixed(1)}x` : "--"}
          valB={campB.roas != null ? `${campB.roas.toFixed(1)}x` : "--"}
          highlight={pickWinner(campA.roas, campB.roas)}
        />
        <MetricRow
          label="Performance"
          valA={roasLabel(campA.roas)}
          valB={roasLabel(campB.roas)}
        />
        <MetricRow
          label="Impressions"
          valA={fmtNum(campA.impressions)}
          valB={fmtNum(campB.impressions)}
          highlight={pickWinner(campA.impressions, campB.impressions)}
        />
        <MetricRow
          label="Clicks"
          valA={fmtNum(campA.clicks)}
          valB={fmtNum(campB.clicks)}
          highlight={pickWinner(campA.clicks, campB.clicks)}
        />
        <MetricRow
          label="CTR"
          valA={campA.ctr != null ? `${campA.ctr.toFixed(2)}%` : "--"}
          valB={campB.ctr != null ? `${campB.ctr.toFixed(2)}%` : "--"}
          highlight={pickWinner(campA.ctr, campB.ctr)}
        />
        <MetricRow
          label="CPC"
          valA={campA.cpc != null ? `$${campA.cpc.toFixed(2)}` : "--"}
          valB={campB.cpc != null ? `$${campB.cpc.toFixed(2)}` : "--"}
          highlight={pickWinner(campA.cpc, campB.cpc, false)}
        />
        <MetricRow
          label="CPM"
          valA={campA.cpm != null ? `$${campA.cpm.toFixed(2)}` : "--"}
          valB={campB.cpm != null ? `$${campB.cpm.toFixed(2)}` : "--"}
          highlight={pickWinner(campA.cpm, campB.cpm, false)}
        />
        <MetricRow
          label="Daily Budget"
          valA={campA.dailyBudget != null ? fmtUsd(campA.dailyBudget) : "--"}
          valB={campB.dailyBudget != null ? fmtUsd(campB.dailyBudget) : "--"}
        />
      </div>

      {/* Winner summary */}
      {campA.roas != null && campB.roas != null && (
        <div className="glass-card p-5">
          <p className="text-xs font-semibold text-white/60 mb-3">Summary</p>
          <div className="space-y-2">
            {campA.roas > campB.roas ? (
              <p className="text-sm text-white/80">
                <span className="text-cyan-400 font-semibold">{campA.name}</span> has a higher ROAS
                ({campA.roas.toFixed(1)}x vs {campB.roas.toFixed(1)}x), generating more revenue per dollar spent.
              </p>
            ) : campB.roas > campA.roas ? (
              <p className="text-sm text-white/80">
                <span className="text-cyan-400 font-semibold">{campB.name}</span> has a higher ROAS
                ({campB.roas.toFixed(1)}x vs {campA.roas.toFixed(1)}x), generating more revenue per dollar spent.
              </p>
            ) : (
              <p className="text-sm text-white/80">
                Both campaigns have the same ROAS ({campA.roas.toFixed(1)}x).
              </p>
            )}
            {campA.cpc != null && campB.cpc != null && campA.cpc !== campB.cpc && (
              <p className="text-sm text-white/60">
                {campA.cpc < campB.cpc ? campA.name : campB.name} is more cost-efficient per click
                (${Math.min(campA.cpc, campB.cpc).toFixed(2)} vs ${Math.max(campA.cpc, campB.cpc).toFixed(2)}).
              </p>
            )}
          </div>
        </div>
      )}

      <ClientPortalFooter dataSource={result.error ? "supabase" : "meta_api"} />
    </div>
  );
}
