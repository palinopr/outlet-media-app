"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import { tooltipStyle, type HourlyRow, type DailyRow, type DayOfWeekRow } from "./types";

// --- Hourly Heatmap ---

function formatHourLabel(h: number): string {
  if (h === 0) return "12a";
  if (h === 12) return "12p";
  return h < 12 ? `${h}a` : `${h - 12}p`;
}

export function HourlyHeatmap({ data }: { data: HourlyRow[] }) {
  if (data.length === 0) return null;

  const maxImp = Math.max(...data.map((d) => d.impressions), 1);

  function cellOpacity(impressions: number): number {
    return 0.08 + (impressions / maxImp) * 0.92;
  }

  const byHour = new Map(data.map((d) => [d.hour, d]));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="glass-card p-5">
      <p className="text-xs font-semibold text-white/60 mb-1">Activity by Hour</p>
      <p className="text-[10px] text-white/20 mb-4">
        Brighter cells indicate higher impression volume
      </p>
      <div>
        <div className="grid grid-cols-6 gap-1">
          {hours.map((h) => {
            const row = byHour.get(h);
            const imp = row?.impressions ?? 0;
            const opacity = imp > 0 ? cellOpacity(imp) : 0.04;
            return (
              <div
                key={h}
                className="group relative aspect-square rounded-md flex items-center justify-center cursor-default transition-all hover:scale-105 hover:z-10"
                style={{ background: `rgba(34, 211, 238, ${opacity})` }}
              >
                <span className="text-[8px] sm:text-[9px] font-medium text-white/50">
                  {formatHourLabel(h)}
                </span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded-md bg-zinc-900/95 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                  <span className="text-[10px] text-white/70">
                    {imp > 0 ? `${imp.toLocaleString()} imp` : "No data"}
                    {row?.clicks ? ` / ${row.clicks.toLocaleString()} clicks` : ""}
                    {row?.spend ? ` / $${Math.round(row.spend).toLocaleString()} spend` : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-[9px] text-white/20">Low</span>
          <div className="flex gap-0.5">
            {[0.08, 0.25, 0.45, 0.65, 0.85].map((op) => (
              <div
                key={op}
                className="h-2 w-4 rounded-sm"
                style={{ background: `rgba(34, 211, 238, ${op})` }}
              />
            ))}
          </div>
          <span className="text-[9px] text-white/20">High</span>
        </div>
      </div>
    </div>
  );
}

// --- Daily Trend ---

export function DailyTrendChart({ data }: { data: DailyRow[] }) {
  if (data.length < 2) return null;

  const chartData = data.map((d) => {
    const dt = new Date(d.date + "T12:00:00");
    const label = dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return { ...d, label };
  });

  return (
    <div className="glass-card p-5">
      <p className="text-xs font-semibold text-white/60 mb-4">Daily Performance Trend</p>
      <div className="h-40 sm:h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="dailyImpGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="dailyClickGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="label"
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={45}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v))}
            />
            <Tooltip
              {...tooltipStyle}
              formatter={(value, name) => [
                Number(value).toLocaleString(),
                String(name) === "impressions" ? "Impressions" : "Clicks",
              ]}
              labelFormatter={(label) => String(label)}
            />
            <Area
              type="monotone"
              dataKey="impressions"
              stroke="#22d3ee"
              strokeWidth={2}
              fill="url(#dailyImpGrad)"
            />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#dailyClickGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 mt-3 justify-center">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          <span className="text-[10px] text-white/40">Impressions</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-violet-400" />
          <span className="text-[10px] text-white/40">Clicks</span>
        </div>
      </div>
    </div>
  );
}

// --- Day of Week ---

export function DayOfWeekChart({ data }: { data: DayOfWeekRow[] }) {
  if (data.length === 0) return null;

  return (
    <div className="glass-card p-5">
      <p className="text-xs font-semibold text-white/60 mb-4">Performance by Day of Week</p>
      <div className="h-36 sm:h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
            <XAxis
              dataKey="day"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={45}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v))}
            />
            <Tooltip
              {...tooltipStyle}
              formatter={(value) => [Number(value).toLocaleString(), "Impressions"]}
            />
            <defs>
              <linearGradient id="dowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <Bar dataKey="impressions" fill="url(#dowGrad)" radius={[6, 6, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
