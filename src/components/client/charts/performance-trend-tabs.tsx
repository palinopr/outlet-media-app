"use client";

import { useMemo, useState } from "react";
import {
  Area,
  ComposedChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  tooltipStyle,
  type PerformanceTrendRow,
  gridProps,
  sharedAxisProps,
  kFormatter,
} from "./types";

interface Props {
  data: PerformanceTrendRow[];
}

type MetricKey = "spend" | "clicks" | "impressions" | "ctr" | "cpc" | "revenue";

const METRICS: Array<{
  key: MetricKey;
  label: string;
  color: string;
  fillId: string;
  defaultVisible?: boolean;
  formatter: (value: number) => string;
}> = [
  {
    key: "spend",
    label: "Spend",
    color: "#22d3ee",
    fillId: "spendTrendFill",
    defaultVisible: true,
    formatter: moneyFormatter,
  },
  {
    key: "clicks",
    label: "Clicks",
    color: "#f472b6",
    fillId: "clickTrendFill",
    defaultVisible: true,
    formatter: (value) => value.toLocaleString(),
  },
  {
    key: "impressions",
    label: "Impressions",
    color: "#a78bfa",
    fillId: "impressionTrendFill",
    defaultVisible: true,
    formatter: kFormatter,
  },
  {
    key: "ctr",
    label: "CTR",
    color: "#34d399",
    fillId: "ctrTrendFill",
    defaultVisible: true,
    formatter: (value) => `${value.toFixed(2)}%`,
  },
  {
    key: "cpc",
    label: "CPC",
    color: "#fbbf24",
    fillId: "cpcTrendFill",
    defaultVisible: true,
    formatter: moneyFormatter,
  },
  {
    key: "revenue",
    label: "Revenue",
    color: "#fb7185",
    fillId: "revenueTrendFill",
    formatter: moneyFormatter,
  },
];

function moneyFormatter(value: number): string {
  if (Math.abs(value) >= 1000) {
    const formatted = value / 1000;
    return `$${formatted >= 10 ? formatted.toFixed(0) : formatted.toFixed(1)}K`;
  }
  if (Math.abs(value) >= 100) return `$${value.toFixed(0)}`;
  return `$${value.toFixed(2)}`;
}

export function PerformanceTrendTabs({ data }: Props) {
  const chartData = useMemo(() => {
    return data.map((row) => ({
      ...row,
      cpc: row.cpc ?? (row.clicks > 0 ? row.spend / row.clicks : null),
    }));
  }, [data]);

  const availableMetrics = useMemo(() => {
    return METRICS.filter((metric) => {
      if (metric.defaultVisible) return true;
      return chartData.some((row) => {
        const value = row[metric.key];
        return typeof value === "number" && value > 0;
      });
    });
  }, [chartData]);

  const [activeMetric, setActiveMetric] = useState<MetricKey>("spend");
  const metric = availableMetrics.find((option) => option.key === activeMetric) ?? availableMetrics[0] ?? METRICS[0];

  if (data.length < 2) {
    const row = chartData[0] ?? null;
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
        <p className="mb-4 text-xs font-semibold text-white/60">Today at a glance</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {METRICS.filter((option) => option.defaultVisible).map((option) => {
            const value = row?.[option.key];
            const numericValue = typeof value === "number" ? value : null;
            return (
              <div key={option.key} className="rounded-xl border border-white/[0.06] bg-black/10 p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/32">{option.label}</p>
                <p className="mt-1.5 text-sm font-semibold text-white">
                  {numericValue != null ? option.formatter(numericValue) : "--"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {availableMetrics.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setActiveMetric(option.key)}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
              metric.key === option.key
                ? "bg-white text-zinc-950"
                : "border border-white/[0.07] bg-white/[0.03] text-white/55 hover:bg-white/[0.07] hover:text-white"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <ComposedChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              {availableMetrics.map((option) => (
                <linearGradient key={option.fillId} id={option.fillId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={option.color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={option.color} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid {...gridProps} />

            <XAxis dataKey="label" {...sharedAxisProps.x} />

            <YAxis
              yAxisId="metric"
              {...sharedAxisProps.y}
              width={56}
              tickFormatter={metric.formatter}
            />

            <Tooltip
              {...tooltipStyle}
              formatter={(value, name) => {
                const v = Number(value);
                const selected = availableMetrics.find((option) => option.key === name);
                return [selected?.formatter(v) ?? v.toLocaleString(), selected?.label ?? String(name)];
              }}
            />

            <Area
              key={metric.key}
              yAxisId="metric"
              type="monotone"
              dataKey={metric.key}
              stroke={metric.color}
              strokeWidth={2}
              fill={`url(#${metric.fillId})`}
              dot={false}
              activeDot={{ r: 3, fill: metric.color }}
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-center gap-5">
        <LegendItem color={metric.color} label={metric.label} />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-[11px] text-white/50">{label}</span>
    </div>
  );
}
