"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { tooltipStyle, type GenderRow } from "./types";

const GENDER_COLORS: Record<string, string> = {
  Female: "#a78bfa",
  Male: "#22d3ee",
  Unknown: "rgba(255,255,255,0.15)",
};

export function GenderDonutChart({ data }: { data: GenderRow[] }) {
  if (data.length === 0) return null;

  return (
    <div className="glass-card p-5">
      <p className="text-xs font-semibold text-white/60 mb-4">Gender Distribution</p>
      <div className="flex items-center gap-6">
        <div className="h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="impressions"
                nameKey="gender"
                innerRadius="60%"
                outerRadius="90%"
                paddingAngle={3}
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.gender}
                    fill={GENDER_COLORS[entry.gender] ?? "rgba(255,255,255,0.1)"}
                  />
                ))}
              </Pie>
              <Tooltip
                {...tooltipStyle}
                formatter={(value) => [Number(value).toLocaleString(), "Impressions"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3 flex-1">
          {data.map((row) => (
            <div key={row.gender} className="flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ background: GENDER_COLORS[row.gender] ?? "rgba(255,255,255,0.1)" }}
              />
              <span className="text-xs text-white/50 flex-1">{row.gender}</span>
              <span className="text-sm font-bold text-white/80">{row.pct.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
