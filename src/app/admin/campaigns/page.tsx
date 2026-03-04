import { Card, CardContent } from "@/components/ui/card";
import { Megaphone, DollarSign, TrendingUp, Eye, MousePointerClick } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { getCampaigns, type DateRange } from "./data";
import { ClientFilter } from "@/components/admin/campaigns/client-filter";
import { DateRangeFilter } from "@/components/admin/campaigns/date-range-filter";
import { CampaignTable } from "@/components/admin/campaigns/campaign-table";
import { Suspense } from "react";
import { fmtUsd, fmtNum, slugToLabel } from "@/lib/formatters";
import type { DailyInsight } from "@/lib/meta-campaigns";

const VALID_RANGES = new Set<DateRange>(["today", "yesterday", "7", "14", "30", "lifetime"]);

interface Props {
  searchParams: Promise<{ client?: string; range?: string }>;
}

export default async function CampaignsPage({ searchParams }: Props) {
  const { client, range: rawRange } = await searchParams;
  const clientSlug = client && client !== "all" ? client : null;
  const range: DateRange = rawRange && VALID_RANGES.has(rawRange as DateRange)
    ? (rawRange as DateRange)
    : "today";

  const { campaigns, clients, dailyInsights, error } = await getCampaigns(clientSlug, range);

  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalRevenue = campaigns.reduce((s, c) => s + (c.revenue ?? 0), 0);
  const avgRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const overallCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  const metaAdAccountId = process.env.META_AD_ACCOUNT_ID ?? null;
  const hasData = campaigns.length > 0;

  const dailyInsightsByCampaign: Record<string, DailyInsight[]> = {};
  for (const d of dailyInsights) {
    if (!dailyInsightsByCampaign[d.campaignId]) {
      dailyInsightsByCampaign[d.campaignId] = [];
    }
    dailyInsightsByCampaign[d.campaignId].push(d);
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Facebook and Instagram ad campaigns
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasData ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 rounded">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live from Meta
            </span>
          ) : (
            <span className="text-xs text-amber-400 border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 rounded">
              No data
            </span>
          )}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Spend",  value: fmtUsd(totalSpend),        icon: DollarSign, accent: "from-cyan-500/20 to-blue-500/20", iconColor: "text-cyan-400" },
          { label: "Avg. ROAS",    value: avgRoas > 0 ? avgRoas.toFixed(1) + "x" : "---", icon: TrendingUp, accent: "from-violet-500/20 to-purple-500/20", iconColor: "text-violet-400" },
          { label: "Impressions",  value: fmtNum(totalImpressions),  icon: Eye, accent: "from-blue-500/20 to-indigo-500/20", iconColor: "text-blue-400" },
          { label: "Clicks / CTR", value: fmtNum(totalClicks) + (overallCtr > 0 ? ` (${overallCtr.toFixed(1)}%)` : ""), icon: MousePointerClick, accent: "from-emerald-500/20 to-teal-500/20", iconColor: "text-emerald-400" },
        ].map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Campaigns table */}
      <Card className="border-border/60">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4 pb-2">
          <p className="text-sm font-semibold">
            {clientSlug ? slugToLabel(clientSlug) : "All clients"}
            <span className="text-muted-foreground font-normal ml-1.5">({campaigns.length})</span>
          </p>
          <div className="flex items-center gap-2">
            <Suspense>
              <DateRangeFilter selected={range} />
            </Suspense>
            <Suspense>
              <ClientFilter clients={clients} selected={clientSlug ?? "all"} />
            </Suspense>
          </div>
        </div>
        <CampaignTable
          campaigns={campaigns}
          dailyInsightsByCampaign={dailyInsightsByCampaign}
          clients={clients}
          metaAdAccountId={metaAdAccountId}
          hasData={hasData}
        />
      </Card>

      {!hasData && !error && (
        <Card className="border-border/60 border-dashed">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Megaphone className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">No campaign data</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Run the Meta sync agent to pull live data from the Meta Marketing API
                  </p>
                </div>
              </div>
              <a
                href="/admin/agents"
                className="text-xs border border-border/60 px-3 py-1.5 rounded hover:bg-muted transition-colors shrink-0"
              >
                Run Agent
              </a>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
