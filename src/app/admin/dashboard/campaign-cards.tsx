import { Card, CardContent } from "@/components/ui/card";
import { Megaphone, ArrowRight } from "lucide-react";
import { centsToUsd, fmtUsd, fmtNum, fmtObjective, computeMarginalRoas, roasColor } from "@/lib/formatters";
import type { Database } from "@/lib/database.types";
import type { SnapshotRow } from "./data";

type MetaCampaign = Database["public"]["Tables"]["meta_campaigns"]["Row"];

interface Props {
  campaigns: MetaCampaign[];
  snapshotsByCampaign: Record<string, SnapshotRow[]>;
}

export function CampaignCards({ campaigns, snapshotsByCampaign }: Props) {
  return (
    <div className="lg:col-span-2">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Active Campaigns</h2>
        <a href="/admin/campaigns" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          View all <ArrowRight className="h-3 w-3" />
        </a>
      </div>
      {campaigns.length === 0 ? (
        <Card className="border-border/60 border-dashed">
          <CardContent className="py-12 text-center">
            <Megaphone className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No active campaigns</p>
            <p className="text-xs text-muted-foreground mt-1">Run the Meta sync agent to pull live data</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => (
            <Card key={c.id} className="border-border/60 hover:border-border transition-colors">
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                      <p className="text-sm font-medium truncate">{c.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{fmtObjective(c.objective)}</p>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 shrink-0 text-right">
                    <div>
                      <p className="text-xs text-muted-foreground">Spend</p>
                      <p className="text-sm font-medium tabular-nums">{fmtUsd(centsToUsd(c.spend))}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">ROAS</p>
                      <p className={`text-sm font-semibold tabular-nums ${roasColor(c.roas)}`}>
                        {c.roas != null ? c.roas.toFixed(1) + "x" : "---"}
                      </p>
                    </div>
                    {(() => {
                      const m = computeMarginalRoas(snapshotsByCampaign[c.campaign_id] ?? []);
                      if (m == null) return null;
                      const color = m >= 2 ? "text-emerald-400" : m >= 1 ? "text-blue-400" : "text-red-400";
                      return (
                        <div>
                          <p className="text-xs text-muted-foreground">Marginal</p>
                          <p className={`text-sm font-semibold tabular-nums ${color}`}>{m.toFixed(1)}×</p>
                        </div>
                      );
                    })()}
                    <div>
                      <p className="text-xs text-muted-foreground">Impressions</p>
                      <p className="text-sm font-medium tabular-nums">{fmtNum(c.impressions)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">CTR</p>
                      <p className="text-sm font-medium tabular-nums">{c.ctr != null ? c.ctr.toFixed(2) + "%" : "---"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
