"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tooltipStyle, type PerformanceTrendRow, gridProps, sharedAxisProps, kFormatter, usdKFormatter } from "./types";

type TrendTab = "roas" | "revenue" | "spend" | "attention";

interface Props {
  data: PerformanceTrendRow[];
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function PerformanceTrendTabs({ data }: Props) {
  const availableTabs = useMemo(() => {
    const tabs: TrendTab[] = [];
    if (data.some((row) => row.roas != null)) tabs.push("roas");
    if (data.some((row) => row.revenue != null)) tabs.push("revenue");
    if (data.some((row) => row.spend > 0)) tabs.push("spend");
    tabs.push("attention");
    return tabs;
  }, [data]);

  const [tab, setTab] = useState<TrendTab>(availableTabs[0] ?? "attention");

  if (data.length < 2) {
    return (
      <div className="glass-card p-5">
        <p className="text-xs font-semibold text-white/60 mb-1">Trend Story</p>
        <p className="text-xs text-white/35">
          Trends need at least 2 days in the selected range. Switch to `7d`, `14d`, `30d`, or
          `Lifetime` for a fuller read.
        </p>
      </div>
    );
  }

  const latest = data[data.length - 1];
  const summary = getSummary(tab, data, latest);

  return (
    <Tabs className="glass-card p-5" value={tab} onValueChange={(value) => setTab(value as TrendTab)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-white/60">Trend Story</p>
          <p className="text-xs text-white/35">
            Move between ROAS, revenue, spend, and attention to see what is changing across the run.
          </p>
        </div>
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-1 lg:w-auto">
          {availableTabs.map((value) => (
            <TabsTrigger
              key={value}
              value={value}
              className="h-9 rounded-xl px-3 text-xs text-white/55 data-[state=active]:bg-white data-[state=active]:text-zinc-900"
            >
              {TAB_LABELS[value]}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">{summary.primaryLabel}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-white">{summary.primaryValue}</p>
          <p className="mt-1 text-xs text-white/35">{summary.primaryDetail}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">{summary.secondaryLabel}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-white">{summary.secondaryValue}</p>
          <p className="mt-1 text-xs text-white/35">{summary.secondaryDetail}</p>
        </div>
      </div>

      <div className="mt-4 h-56 sm:h-64">
        {tab === "roas" && <RoasChart data={data} />}
        {tab === "revenue" && <RevenueChart data={data} />}
        {tab === "spend" && <SpendChart data={data} />}
        {tab === "attention" && <AttentionChart data={data} />}
      </div>
    </Tabs>
  );
}

const TAB_LABELS: Record<TrendTab, string> = {
  roas: "ROAS",
  revenue: "Revenue",
  spend: "Spend",
  attention: "Attention",
};

function getSummary(tab: TrendTab, data: PerformanceTrendRow[], latest: PerformanceTrendRow) {
  if (tab === "roas") {
    const values = data.map((row) => row.roas).filter((row): row is number => row != null);
    const avgRoas = average(values);
    return {
      primaryLabel: "Latest ROAS",
      primaryValue: latest.roas != null ? `${latest.roas.toFixed(2)}x` : "--",
      primaryDetail: "Latest day in this selected range.",
      secondaryLabel: "Average ROAS",
      secondaryValue: avgRoas != null ? `${avgRoas.toFixed(2)}x` : "--",
      secondaryDetail: "Average across days with attributed purchase data.",
    };
  }

  if (tab === "revenue") {
    const values = data.map((row) => row.revenue ?? 0);
    const totalRevenue = values.reduce((sum, value) => sum + value, 0);
    return {
      primaryLabel: "Latest Revenue",
      primaryValue: latest.revenue != null ? usdKFormatter(latest.revenue) : "--",
      primaryDetail: "Attributed purchase value on the latest day.",
      secondaryLabel: "Total Revenue",
      secondaryValue: usdKFormatter(totalRevenue),
      secondaryDetail: "Attributed purchase value across the selected range.",
    };
  }

  if (tab === "spend") {
    const values = data.map((row) => row.spend);
    const totalSpend = values.reduce((sum, value) => sum + value, 0);
    const avgSpend = average(values);
    return {
      primaryLabel: "Latest Spend",
      primaryValue: usdKFormatter(latest.spend),
      primaryDetail: "Spend recorded on the latest day in range.",
      secondaryLabel: "Average Daily Spend",
      secondaryValue: avgSpend != null ? usdKFormatter(avgSpend) : "--",
      secondaryDetail: "Average day-level spend for pacing decisions.",
    };
  }

  const totalImpressions = data.reduce((sum, row) => sum + row.impressions, 0);
  const totalClicks = data.reduce((sum, row) => sum + row.clicks, 0);
  return {
    primaryLabel: "Total Impressions",
    primaryValue: totalImpressions.toLocaleString(),
    primaryDetail: "Delivery volume across the selected range.",
    secondaryLabel: "Blended CTR",
    secondaryValue: totalImpressions > 0 ? `${((totalClicks / totalImpressions) * 100).toFixed(2)}%` : "--",
    secondaryDetail: `${totalClicks.toLocaleString()} clicks across the full range.`,
  };
}

function RoasChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="label" {...sharedAxisProps.x} />
        <YAxis
          {...sharedAxisProps.y}
          width={45}
          tickFormatter={(value: number) => `${value.toFixed(1)}x`}
        />
        <Tooltip
          {...tooltipStyle}
          formatter={(value) => [`${Number(value).toFixed(2)}x`, "ROAS"]}
        />
        <Line
          type="monotone"
          dataKey="roas"
          stroke="#a78bfa"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "#a78bfa" }}
          activeDot={{ r: 5 }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function RevenueChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueTrendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#34d399" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="label" {...sharedAxisProps.x} />
        <YAxis {...sharedAxisProps.y} width={50} tickFormatter={usdKFormatter} />
        <Tooltip
          {...tooltipStyle}
          formatter={(value) => [usdKFormatter(Number(value)), "Revenue"]}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#34d399"
          strokeWidth={2.5}
          fill="url(#revenueTrendFill)"
          connectNulls
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function SpendChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="spendTrendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="label" {...sharedAxisProps.x} />
        <YAxis {...sharedAxisProps.y} width={50} tickFormatter={usdKFormatter} />
        <Tooltip
          {...tooltipStyle}
          formatter={(value) => [usdKFormatter(Number(value)), "Spend"]}
        />
        <Area
          type="monotone"
          dataKey="spend"
          stroke="#22d3ee"
          strokeWidth={2.5}
          fill="url(#spendTrendFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function AttentionChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="label" {...sharedAxisProps.x} />
        <YAxis
          yAxisId="impressions"
          {...sharedAxisProps.y}
          width={45}
          tickFormatter={kFormatter}
        />
        <YAxis
          yAxisId="clicks"
          orientation="right"
          {...sharedAxisProps.y}
          width={45}
          tickFormatter={kFormatter}
        />
        <Tooltip
          {...tooltipStyle}
          formatter={(value, name) => [
            Number(value).toLocaleString(),
            name === "impressions" ? "Impressions" : "Clicks",
          ]}
        />
        <Line
          yAxisId="impressions"
          type="monotone"
          dataKey="impressions"
          stroke="#22d3ee"
          strokeWidth={2.5}
          dot={{ r: 2.5, fill: "#22d3ee" }}
          activeDot={{ r: 4 }}
        />
        <Line
          yAxisId="clicks"
          type="monotone"
          dataKey="clicks"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ r: 2.5, fill: "#f59e0b" }}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
