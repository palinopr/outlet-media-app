"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { tooltipStyle, sharedAxisProps, gridProps, kFormatter, usdKFormatter } from "./types";

export interface TicketChartRow {
  date: string;
  label: string;
  ticketsSold: number;
  gross: number | null;
}

export function TicketSalesChart({ data }: { data: TicketChartRow[] }) {
  if (data.length < 2) return null;

  const hasGross = data.some((d) => d.gross != null && d.gross > 0);

  return (
    <div className="glass-card p-5">
      <p className="text-xs font-semibold text-white/60 mb-4">Ticket Sales Over Time</p>
      <div className="h-40 sm:h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="ticketGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
              {hasGross && (
                <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              )}
            </defs>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="label" {...sharedAxisProps.x} />
            <YAxis
              yAxisId="tickets"
              {...sharedAxisProps.y}
              width={50}
              tickFormatter={kFormatter}
            />
            {hasGross && (
              <YAxis
                yAxisId="gross"
                orientation="right"
                {...sharedAxisProps.y}
                width={55}
                tickFormatter={usdKFormatter}
              />
            )}
            <Tooltip
              {...tooltipStyle}
              formatter={(value, name) => {
                const v = Number(value);
                if (String(name) === "ticketsSold")
                  return [v.toLocaleString(), "Tickets Sold"];
                return [`$${v.toLocaleString()}`, "Revenue"];
              }}
              labelFormatter={(label) => String(label)}
            />
            <Area
              yAxisId="tickets"
              type="monotone"
              dataKey="ticketsSold"
              stroke="#22d3ee"
              strokeWidth={2}
              fill="url(#ticketGrad)"
            />
            {hasGross && (
              <Area
                yAxisId="gross"
                type="monotone"
                dataKey="gross"
                stroke="#34d399"
                strokeWidth={2}
                fill="url(#grossGrad)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 mt-3 justify-center">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          <span className="text-[10px] text-white/40">Tickets Sold</span>
        </div>
        {hasGross && (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-white/40">Revenue</span>
          </div>
        )}
      </div>
    </div>
  );
}
