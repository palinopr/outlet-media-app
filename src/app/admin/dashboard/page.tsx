import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Megaphone,
  TrendingUp,
} from "lucide-react";
import { RoasTrendChart } from "@/components/charts/roas-trend-chart";
import { centsToUsd, fmtUsd, fmtNum, computeBlendedRoas, fmtTodayLong } from "@/lib/formatters";
import { StatCard } from "@/components/admin/stat-card";
import { getData } from "./data";
import { CampaignCards } from "./campaign-cards";

import { AdminPageHeader } from "@/components/admin/page-header";

export default async function AdminDashboard() {
  const { campaigns, trendData, marginalRoasByCampaign, fromDb } = await getData();

  const totalSpend = campaigns.reduce((sum, campaign) => sum + (centsToUsd(campaign.spend) ?? 0), 0);
  const totalImpressions = campaigns.reduce((sum, campaign) => sum + (campaign.impressions ?? 0), 0);
  const avgRoas = computeBlendedRoas(campaigns.map((campaign) => ({
    spend: campaign.spend ?? 0,
    roas: campaign.roas,
  }))) ?? 0;

  const now = fmtTodayLong();

  const heroStats = [
    {
      label: "Ad Spend",
      value: fmtUsd(totalSpend),
      sub: "active campaigns",
      icon: DollarSign,
      accent: "from-cyan-500/20 to-blue-500/20",
      iconColor: "text-cyan-400",
    },
    {
      label: "Avg. ROAS",
      value: avgRoas > 0 ? `${avgRoas.toFixed(1)}x` : "---",
      sub: "blended by spend",
      icon: TrendingUp,
      accent: "from-violet-500/20 to-purple-500/20",
      iconColor: "text-violet-400",
    },
    {
      label: "Active Campaigns",
      value: String(campaigns.length),
      sub: `${fmtNum(totalImpressions)} impressions`,
      icon: Megaphone,
      accent: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-400",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-8">
      <AdminPageHeader title="Dashboard" description={now}>
        {fromDb ? (
          <Badge variant="outline" className="text-xs gap-1.5 py-1 px-2.5 text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            Live
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs gap-1.5 py-1 px-2.5 text-amber-400 border-amber-500/20">
            No live data
          </Badge>
        )}
      </AdminPageHeader>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {heroStats.map((stat) => (
          <StatCard key={stat.label} {...stat} size="lg" />
        ))}
      </div>

      {trendData.length > 0 ? (
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Blended ROAS Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RoasTrendChart data={trendData} />
          </CardContent>
        </Card>
      ) : campaigns.length > 0 ? (
        <Card className="border-border/60 border-dashed">
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10">
              <TrendingUp className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Trend data is still building</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Campaign totals are available; historical ROAS snapshots will appear here after syncs run.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <CampaignCards campaigns={campaigns} marginalRoasByCampaign={marginalRoasByCampaign} />
    </div>
  );
}
