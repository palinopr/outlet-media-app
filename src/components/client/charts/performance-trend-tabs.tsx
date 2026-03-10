"use client";

import { useMemo } from "react";
import {
  Area,
  ComposedChart,
  CartesianGrid,
  Line,
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
  usdKFormatter,
} from "./types";

interface Props {
  data: PerformanceTrendRow[];
}

export function PerformanceTrendTabs({ data }: Props) {
  const { hasRevenue, hasRoas } = useMemo(() => {
    return {
      hasRevenue: data.some((row) => row.revenue != null && row.revenue > 0),
      hasRoas: data.some((row) => row.roas != null && row.roas > 0),
    };
  }, [data]);

  if (data.length < 2) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
        <p className="text-xs text-white/35">
          Trends need at least 2 days in the selected range.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid {...gridProps} />

            <XAxis dataKey="label" {...sharedAxisProps.x} />

            <YAxis
              yAxisId="dollars"
              {...sharedAxisProps.y}
              width={50}
              tickFormatter={usdKFormatter}
            />

            {hasRoas && (
              <YAxis
                yAxisId="roas"
                orientation="right"
                {...sharedAxisProps.y}
                width={42}
                tickFormatter={(v: number) => `${v.toFixed(1)}x`}
              />
            )}

            <Tooltip
              {...tooltipStyle}
              formatter={(value, name) => {
                const v = Number(value);
                if (name === "roas")
                  return [`${v.toFixed(2)}x`, "ROAS"];
                if (name === "revenue")
                  return [usdKFormatter(v), "Revenue"];
                return [usdKFormatter(v), "Spend"];
              }}
            />

            <Area
              yAxisId="dollars"
              type="monotone"
              dataKey="spend"
              stroke="#22d3ee"
              strokeWidth={2}
              fill="url(#spendFill)"
              dot={false}
              activeDot={{ r: 3, fill: "#22d3ee" }}
            />

            {hasRevenue && (
              <Area
                yAxisId="dollars"
                type="monotone"
                dataKey="revenue"
                stroke="#34d399"
                strokeWidth={2}
                fill="url(#revenueFill)"
                dot={false}
                activeDot={{ r: 3, fill: "#34d399" }}
                connectNulls
              />
            )}

            {hasRoas && (
              <Line
                yAxisId="roas"
                type="monotone"
                dataKey="roas"
                stroke="#a78bfa"
                strokeWidth={2.5}
                dot={{ r: 2.5, fill: "#a78bfa", strokeWidth: 0 }}
                activeDot={{ r: 4 }}
                connectNulls
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-center gap-5">
        <LegendItem color="#22d3ee" label="Spend" />
        {hasRevenue && <LegendItem color="#34d399" label="Revenue" />}
        {hasRoas && <LegendItem color="#a78bfa" label="ROAS" />}
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
