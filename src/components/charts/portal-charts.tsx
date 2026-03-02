"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TrendPoint } from "@/app/client/[slug]/_lib/helpers";

interface TooltipPayload {
  value: number;
  name: string;
}

function GlassTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[oklch(0.14_0_0/95%)] backdrop-blur-xl px-4 py-2.5 shadow-2xl shadow-black/40">
      <p className="font-medium text-white/50 mb-1.5 text-[10px] uppercase tracking-wider">
        {label}
      </p>
      {payload.map((p) => (
        <p key={p.name} className="text-sm font-bold text-white/90">
          {p.name === "roas"
            ? `${p.value.toFixed(2)}x ROAS`
            : `$${Math.round(p.value).toLocaleString()}`}
        </p>
      ))}
    </div>
  );
}

const emptyState = (
  <div className="h-[200px] flex items-center justify-center text-xs text-white/25">
    Trend data available after 2+ days of syncing
  </div>
);

interface ChartConfig {
  dataKey: "roas" | "spend";
  color: string;
  gradientId: string;
  tickFormatter: (v: number) => string;
  leftMargin: number;
}

const roasConfig: ChartConfig = {
  dataKey: "roas",
  color: "#34d399",
  gradientId: "portalRoasGrad",
  tickFormatter: (v: number) => `${v.toFixed(1)}x`,
  leftMargin: -16,
};

const spendConfig: ChartConfig = {
  dataKey: "spend",
  color: "#22d3ee",
  gradientId: "portalSpendGrad",
  tickFormatter: (v: number) =>
    v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`,
  leftMargin: -8,
};

function PortalAreaChart({
  data,
  config,
}: {
  data: TrendPoint[];
  config: ChartConfig;
}) {
  if (data.length < 2) return emptyState;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart
        data={data}
        margin={{ top: 8, right: 8, left: config.leftMargin, bottom: 0 }}
      >
        <defs>
          <linearGradient
            id={config.gradientId}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor={config.color}
              stopOpacity={0.25}
            />
            <stop
              offset="100%"
              stopColor={config.color}
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          stroke="oklch(1 0 0 / 4%)"
          strokeDasharray="3 3"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "oklch(1 0 0 / 25%)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "oklch(1 0 0 / 25%)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={config.tickFormatter}
        />
        <Tooltip content={<GlassTooltip />} />
        <Area
          type="monotone"
          dataKey={config.dataKey}
          stroke={config.color}
          fill={`url(#${config.gradientId})`}
          strokeWidth={2}
          dot={false}
          activeDot={{
            r: 5,
            fill: config.color,
            stroke: "oklch(0.14 0 0)",
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function PortalRoasChart({ data }: { data: TrendPoint[] }) {
  return <PortalAreaChart data={data} config={roasConfig} />;
}

export function PortalSpendChart({ data }: { data: TrendPoint[] }) {
  return <PortalAreaChart data={data} config={spendConfig} />;
}
