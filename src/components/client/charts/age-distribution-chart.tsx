"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { tooltipStyle, type AgeRow } from "./types";

export function AgeDistributionChart({ data }: { data: AgeRow[] }) {
  if (data.length === 0) return null;

  const maxImp = Math.max(...data.map((d) => d.impressions));

  return (
    <div className="glass-card p-5">
      <p className="text-xs font-semibold text-white/60 mb-4">Reach by Age Group</p>
      <div className="h-40 sm:h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 12, bottom: 0, left: 0 }}>
            <XAxis type="number" hide domain={[0, maxImp * 1.15]} />
            <YAxis
              dataKey="age"
              type="category"
              width={48}
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              {...tooltipStyle}
              formatter={(value) => [Number(value).toLocaleString(), "Impressions"]}
            />
            <defs>
              <linearGradient id="ageGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.9} />
              </linearGradient>
            </defs>
            <Bar dataKey="impressions" fill="url(#ageGrad)" radius={[0, 6, 6, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 pt-3 border-t border-white/[0.06]">
        <p className="text-[10px] text-white/30 mb-2">Click-Through Rate</p>
        <div className="flex gap-2 flex-wrap">
          {data.map((row) => (
            <div
              key={row.age}
              className="flex flex-col items-center px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05]"
            >
              <span className="text-[9px] text-white/30">{row.age}</span>
              <span className="text-xs font-bold text-white/70">
                {row.ctr != null ? `${row.ctr.toFixed(2)}%` : "--"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
