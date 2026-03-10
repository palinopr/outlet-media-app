"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { tooltipStyle, gridProps, sharedAxisProps, kFormatter } from "./types";

interface PlacementBarData {
  platform: string;
  position: string;
  impressions: number;
  clicks: number;
  ctr: number | null;
  pct: number;
}

interface ChartRow {
  label: string;
  fullName: string;
  impressions: number;
  clicks: number;
  ctr: number | null;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartRow }>;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div
      style={{
        ...tooltipStyle.contentStyle,
        lineHeight: "1.6",
      }}
    >
      <p style={{ ...tooltipStyle.labelStyle, marginBottom: 4 }}>{row.fullName}</p>
      <p style={tooltipStyle.itemStyle}>
        Impressions: {row.impressions.toLocaleString()}
      </p>
      <p style={tooltipStyle.itemStyle}>Clicks: {row.clicks.toLocaleString()}</p>
      <p style={tooltipStyle.itemStyle}>
        CTR: {row.ctr != null ? `${row.ctr.toFixed(2)}%` : "--"}
      </p>
    </div>
  );
}

export function PlacementBarChart({ data }: { data: PlacementBarData[] }) {
  if (data.length === 0) return null;

  const chartData: ChartRow[] = [...data]
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 6)
    .map((d) => ({
      label: d.position,
      fullName: `${d.platform} ${d.position}`,
      impressions: d.impressions,
      clicks: d.clicks,
      ctr: d.ctr,
    }));

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
      <p className="text-xs font-semibold text-white/60 mb-4">
        Impressions by Placement
      </p>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
          >
            <CartesianGrid {...gridProps} vertical={false} />
            <XAxis
              dataKey="label"
              {...sharedAxisProps.x}
            />
            <YAxis
              {...sharedAxisProps.y}
              width={45}
              tickFormatter={kFormatter}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Bar
              dataKey="impressions"
              fill="#22d3ee"
              radius={[6, 6, 0, 0]}
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
