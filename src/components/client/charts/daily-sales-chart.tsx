"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { tooltipStyle } from "./types";

export interface DailySalesRow {
  date: string;
  label: string;
  ticketsDelta: number;
  revenueDelta: number;
}

export function DailySalesChart({ data }: { data: DailySalesRow[] }) {
  if (data.length < 2) return null;

  const hasRevenue = data.some((d) => d.revenueDelta > 0);

  return (
    <div className="glass-card p-5">
      <p className="text-xs font-semibold text-white/60 mb-4">Daily Ticket Sales</p>
      <div className="h-40 sm:h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="label"
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              yAxisId="tickets"
              tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={40}
              tickFormatter={(v: number) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)
              }
            />
            {hasRevenue && (
              <YAxis
                yAxisId="revenue"
                orientation="right"
                tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={50}
                tickFormatter={(v: number) =>
                  v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`
                }
              />
            )}
            <Tooltip
              {...tooltipStyle}
              formatter={(value, name) => {
                const v = Number(value);
                if (String(name) === "ticketsDelta")
                  return [v.toLocaleString(), "Tickets"];
                return [`$${v.toLocaleString()}`, "Revenue"];
              }}
              labelFormatter={(label) => String(label)}
            />
            <Bar
              yAxisId="tickets"
              dataKey="ticketsDelta"
              fill="#22d3ee"
              fillOpacity={0.7}
              radius={[4, 4, 0, 0]}
            />
            {hasRevenue && (
              <Bar
                yAxisId="revenue"
                dataKey="revenueDelta"
                fill="#34d399"
                fillOpacity={0.5}
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 mt-3 justify-center">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          <span className="text-[10px] text-white/40">Tickets/Day</span>
        </div>
        {hasRevenue && (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-white/40">Revenue/Day</span>
          </div>
        )}
      </div>
    </div>
  );
}
