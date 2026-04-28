import type { CampaignOperatingData } from "@/features/campaigns/server";
import { fmtNum, fmtUsd, roasColor } from "@/lib/formatters";

interface Props {
  data: CampaignOperatingData;
}

function KpiCard({
  label,
  value,
  detail,
  valueClassName,
}: {
  label: string;
  value: string;
  detail: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-2 text-2xl font-semibold tracking-tight ${valueClassName ?? ""}`}>{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

export function CampaignDetailDashboard({ data }: Props) {
  const { campaign } = data;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/60 bg-[linear-gradient(135deg,rgba(20,36,38,1),rgba(19,24,31,1))] p-6 text-white shadow-sm">
        <div className="space-y-6">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-teal-200/70">Campaign snapshot</p>
            <h2 className="text-3xl font-semibold tracking-tight">{campaign.name}</h2>
            <p className="text-sm leading-6 text-slate-200/80">
              A simple admin view of the campaign metrics that matter right now.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <KpiCard
              label="Spend"
              value={fmtUsd(campaign.spend)}
              detail={`${fmtNum(campaign.impressions)} impressions`}
            />
            <KpiCard
              label="ROAS"
              value={campaign.roas != null ? `${campaign.roas.toFixed(2)}x` : "--"}
              detail={campaign.revenue != null ? `${fmtUsd(campaign.revenue)} est. revenue` : "Revenue unavailable"}
              valueClassName={roasColor(campaign.roas)}
            />
            <KpiCard
              label="Clicks"
              value={fmtNum(campaign.clicks)}
              detail={campaign.ctr != null ? `${campaign.ctr.toFixed(2)}% CTR` : "CTR unavailable"}
            />
            <KpiCard
              label="Daily budget"
              value={campaign.dailyBudget != null ? fmtUsd(campaign.dailyBudget) : "--"}
              detail={campaign.status}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
