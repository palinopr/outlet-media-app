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
import { tooltipStyle, sharedAxisProps, gridProps, kFormatter, usdKFormatter } from "./types";
import type { DailyDelta } from "@/app/client/[slug]/types";

export function DailySalesChart({ data }: { data: DailyDelta[] }) {
  if (data.length < 2) return null;

  const hasRevenue = data.some((d) => d.revenueDelta > 0);

  return (
    <div className="glass-card p-5">
      <p className="text-xs font-semibold text-white/60 mb-4">Daily Ticket Sales</p>
      <div className="h-40 sm:h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="label" {...sharedAxisProps.x} />
            <YAxis
              yAxisId="tickets"
              {...sharedAxisProps.y}
              width={40}
              tickFormatter={kFormatter}
            />
            {hasRevenue && (
              <YAxis
                yAxisId="revenue"
                orientation="right"
                {...sharedAxisProps.y}
                width={50}
                tickFormatter={usdKFormatter}
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
