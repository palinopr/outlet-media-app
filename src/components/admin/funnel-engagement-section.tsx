import { BarChart3, Eye, MousePointerClick, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fmtNum } from "@/lib/formatters";
import type { FunnelEngagementSummary, FunnelMetric, FunnelCtaMetric, FunnelCreativeMetric } from "@/features/meta/funnel-analytics";

interface Props {
  data: FunnelEngagementSummary;
}

function fmtPct(value: number | null | undefined) {
  if (value == null) return "--";
  return `${(value * 100).toFixed(value >= 0.1 ? 1 : 2)}%`;
}

function MetricRow({ metric, max }: { metric: FunnelMetric; max: number }) {
  const width = max > 0 ? Math.max(6, Math.round((metric.count / max) * 100)) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="truncate font-medium">{metric.label}</span>
        <span className="shrink-0 tabular-nums text-muted-foreground">
          {fmtNum(metric.count)}{metric.rate != null ? ` · ${fmtPct(metric.rate)}` : ""}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-cyan-400/70" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function SectionList({ title, items, empty }: { title: string; items: FunnelMetric[]; empty: string }) {
  const max = Math.max(0, ...items.map((item) => item.count));
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length > 0 ? items.slice(0, 8).map((item) => <MetricRow key={item.id} metric={item} max={max} />) : (
          <p className="text-sm text-muted-foreground">{empty}</p>
        )}
      </CardContent>
    </Card>
  );
}

function CtaTable({ items }: { items: FunnelCtaMetric[] }) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">CTA performance</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">CTA impressions and clicks will appear after the tracker collects data.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-muted-foreground">
                <tr className="border-b border-border/60">
                  <th className="pb-2 font-medium">CTA</th>
                  <th className="pb-2 text-right font-medium">Impr.</th>
                  <th className="pb-2 text-right font-medium">Clicks</th>
                  <th className="pb-2 text-right font-medium">CTR</th>
                </tr>
              </thead>
              <tbody>
                {items.slice(0, 8).map((item) => (
                  <tr key={item.id} className="border-b border-border/40 last:border-0">
                    <td className="py-2 font-medium">{item.label}</td>
                    <td className="py-2 text-right tabular-nums text-muted-foreground">{fmtNum(item.impressions)}</td>
                    <td className="py-2 text-right tabular-nums">{fmtNum(item.clicks)}</td>
                    <td className="py-2 text-right tabular-nums text-muted-foreground">{fmtPct(item.ctr)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SourceTable({ items }: { items: FunnelCreativeMetric[] }) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Top ad / creative sources</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Ad and creative sources will appear when URL parameters are present.</p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-border/50 p-2.5">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">{item.source}</p>
                  <p className="text-[11px] text-muted-foreground">{item.sessions ?? 0} sessions</p>
                </div>
                <div className="text-right text-xs tabular-nums">
                  <p>{fmtNum(item.clicks)} clicks</p>
                  <p className="text-muted-foreground">{fmtNum(item.count)} events</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function FunnelEngagementSection({ data }: Props) {
  const statCards = [
    {
      icon: Eye,
      label: "Page views",
      value: fmtNum(data.totals.pageViews),
      sub: `${fmtNum(data.totals.sessions)} sessions`,
    },
    {
      icon: MousePointerClick,
      label: "CTA clicks",
      value: fmtNum(data.totals.ctaClicks),
      sub: `${fmtPct(data.totals.ctaCtr)} impression CTR`,
    },
    {
      icon: BarChart3,
      label: "75% scroll rate",
      value: fmtPct(data.totals.scroll75Rate),
      sub: `last ${data.lookbackDays} days`,
    },
    {
      icon: Smartphone,
      label: "Device signals",
      value: fmtNum(data.deviceSplit.reduce((sum, item) => sum + item.count, 0)),
      sub: "privacy-safe aggregate",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold">Funnel engagement</h2>
          <p className="text-xs text-muted-foreground">
            Directional first-party heatmap-lite data. Not purchase attribution; purchases remain sourced from Ticketmaster CAPI.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          {data.updatedAt ? `Updated ${new Date(data.updatedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}` : "Waiting for funnel data"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ icon: Icon, ...stat }) => (
          <Card key={stat.label} className="border-border/60">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{stat.sub}</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <SectionList title="Section visibility" items={data.sections} empty="Section visibility will appear after data-om-section impressions are observed." />
        <SectionList title="Scroll depth" items={data.scrollDepths} empty="Scroll depth buckets will appear after visitors scroll." />
        <CtaTable items={data.ctas} />
        <SectionList title="Device split" items={data.deviceSplit} empty="Device mix will appear after page views are collected." />
        <div className="xl:col-span-2">
          <SourceTable items={data.topSources} />
        </div>
      </div>
    </section>
  );
}
