"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Treemap,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

// --- Types (serializable from server) ---

export interface AgeRow {
  age: string;
  impressions: number;
  clicks: number;
  ctr: number | null;
}

export interface GenderRow {
  gender: string;
  impressions: number;
  pct: number;
}

export interface AgeGenderCell {
  age: string;
  gender: string;
  impressions: number;
  pct: number;
}

export interface PlacementRow {
  platform: string;
  position: string;
  impressions: number;
  clicks: number;
  ctr: number | null;
  pct: number;
}

// --- Shared tooltip style ---

const tooltipStyle = {
  contentStyle: {
    background: "rgba(15, 15, 20, 0.95)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    fontSize: "11px",
    color: "rgba(255,255,255,0.7)",
    padding: "8px 12px",
  },
  itemStyle: { color: "rgba(255,255,255,0.6)" },
  labelStyle: { color: "rgba(255,255,255,0.4)", marginBottom: "4px" },
};

// --- Age Distribution Bar Chart ---

export function AgeDistributionChart({ data }: { data: AgeRow[] }) {
  if (data.length === 0) return null;

  const maxImp = Math.max(...data.map((d) => d.impressions));

  return (
    <div className="glass-card p-5">
      <p className="text-xs font-semibold text-white/60 mb-4">Reach by Age Group</p>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 12, bottom: 0, left: 0 }}>
            <XAxis
              type="number"
              hide
              domain={[0, maxImp * 1.15]}
            />
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
            <Bar
              dataKey="impressions"
              fill="url(#ageGrad)"
              radius={[0, 6, 6, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* CTR by age underneath */}
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

// --- Gender Donut Chart ---

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

// --- Age x Gender Heatmap ---

export function AgeGenderHeatmap({ data, ages }: { data: AgeGenderCell[]; ages: string[] }) {
  if (data.length === 0) return null;

  const genders = [...new Set(data.map((d) => d.gender))].sort();
  const maxPct = Math.max(...data.map((d) => d.pct), 1);

  function cellOpacity(pct: number): number {
    return 0.15 + (pct / maxPct) * 0.85;
  }

  function cellColor(gender: string, pct: number): string {
    const opacity = cellOpacity(pct);
    if (gender === "Female") return `rgba(167, 139, 250, ${opacity})`;
    if (gender === "Male") return `rgba(34, 211, 238, ${opacity})`;
    return `rgba(255, 255, 255, ${opacity * 0.3})`;
  }

  return (
    <div className="glass-card p-5">
      <p className="text-xs font-semibold text-white/60 mb-4">Audience Heatmap</p>
      <p className="text-[10px] text-white/20 mb-3">
        Impression density by age and gender -- brighter = higher concentration
      </p>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="pb-2 text-left text-[10px] text-white/25 font-medium w-16" />
              {ages.map((age) => (
                <th key={age} className="pb-2 text-center text-[10px] text-white/30 font-medium px-1">
                  {age}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {genders.map((gender) => (
              <tr key={gender}>
                <td className="py-1 text-[10px] text-white/40 font-medium">{gender}</td>
                {ages.map((age) => {
                  const cell = data.find((d) => d.age === age && d.gender === gender);
                  const pct = cell?.pct ?? 0;
                  return (
                    <td key={age} className="py-1 px-1">
                      <div
                        className="rounded-lg h-10 flex items-center justify-center transition-all"
                        style={{ background: cellColor(gender, pct) }}
                      >
                        {pct > 0 && (
                          <span className="text-[10px] font-bold text-white/90">
                            {pct.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Placement Treemap ---

interface TreemapContentProps {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  pct: number;
}

const PLATFORM_TREEMAP_COLORS: Record<string, string> = {
  Facebook: "#3b82f6",
  Instagram: "#8b5cf6",
  Messenger: "#22d3ee",
  "Audience Network": "#f59e0b",
};

function TreemapContent({ x, y, width, height, name, pct }: TreemapContentProps) {
  if (width < 40 || height < 30) return null;
  const color = PLATFORM_TREEMAP_COLORS[name] ?? "#6b7280";
  return (
    <g>
      <rect
        x={x + 1}
        y={y + 1}
        width={width - 2}
        height={height - 2}
        rx={8}
        fill={color}
        fillOpacity={0.25}
        stroke={color}
        strokeOpacity={0.4}
        strokeWidth={1}
      />
      {width > 60 && (
        <text
          x={x + width / 2}
          y={y + height / 2 - 6}
          textAnchor="middle"
          fill="rgba(255,255,255,0.7)"
          fontSize={11}
          fontWeight={600}
        >
          {name}
        </text>
      )}
      <text
        x={x + width / 2}
        y={y + height / 2 + 10}
        textAnchor="middle"
        fill="rgba(255,255,255,0.4)"
        fontSize={10}
      >
        {pct.toFixed(0)}%
      </text>
    </g>
  );
}

export function PlacementTreemap({ data }: { data: PlacementRow[] }) {
  if (data.length === 0) return null;

  // Aggregate by platform for the treemap
  const byPlatform = new Map<string, { impressions: number; clicks: number }>();
  for (const row of data) {
    const prev = byPlatform.get(row.platform) ?? { impressions: 0, clicks: 0 };
    byPlatform.set(row.platform, {
      impressions: prev.impressions + row.impressions,
      clicks: prev.clicks + row.clicks,
    });
  }
  const totalImp = data.reduce((s, r) => s + r.impressions, 0);
  const treemapData = Array.from(byPlatform.entries()).map(([name, vals]) => ({
    name,
    value: vals.impressions,
    pct: totalImp > 0 ? (vals.impressions / totalImp) * 100 : 0,
    clicks: vals.clicks,
  }));

  return (
    <div className="glass-card p-5">
      <p className="text-xs font-semibold text-white/60 mb-4">Platform Distribution</p>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={treemapData}
            dataKey="value"
            stroke="none"
            content={<TreemapContent x={0} y={0} width={0} height={0} name="" pct={0} />}
          />
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// --- Placement Detail Table (no spend) ---

export function PlacementTable({ data }: { data: PlacementRow[] }) {
  if (data.length === 0) return null;

  const totalImp = data.reduce((s, r) => s + r.impressions, 0);
  const sorted = [...data].sort((a, b) => b.impressions - a.impressions);

  const platformDot: Record<string, string> = {
    Facebook: "bg-blue-400",
    Instagram: "bg-violet-400",
    Messenger: "bg-cyan-400",
    "Audience Network": "bg-amber-400",
  };

  return (
    <div className="glass-card p-5">
      <p className="text-xs font-semibold text-white/60 mb-4">Placement Breakdown</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-white/30 text-left border-b border-white/[0.06]">
              <th className="pb-2 font-medium">Platform</th>
              <th className="pb-2 font-medium">Position</th>
              <th className="pb-2 font-medium text-right">Impressions</th>
              <th className="pb-2 font-medium text-right">Clicks</th>
              <th className="pb-2 font-medium text-right">CTR</th>
              <th className="pb-2 font-medium text-right">Share</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => {
              const pct = totalImp > 0 ? (row.impressions / totalImp) * 100 : 0;
              const dot = platformDot[row.platform] ?? "bg-white/30";
              return (
                <tr key={i} className="border-b border-white/[0.03] last:border-0">
                  <td className="py-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                      <span className="text-white/70">{row.platform}</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-white/50">{row.position}</td>
                  <td className="py-2.5 text-white/60 text-right font-medium">
                    {row.impressions.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-white/50 text-right">
                    {row.clicks.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-white/50 text-right">
                    {row.ctr != null ? `${row.ctr.toFixed(2)}%` : "--"}
                  </td>
                  <td className="py-2.5 text-white/60 text-right font-medium">
                    {pct.toFixed(0)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Hourly Activity Heatmap (time-of-day grid) ---

export interface HourlyRow {
  hour: number;
  impressions: number;
  clicks: number;
  ctr: number | null;
}

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

  // Fill all 24 hours (some may be missing from API)
  const byHour = new Map(data.map((d) => [d.hour, d]));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="glass-card p-5">
      <p className="text-xs font-semibold text-white/60 mb-1">Activity by Hour</p>
      <p className="text-[10px] text-white/20 mb-4">
        Brighter cells indicate higher impression volume
      </p>
      <div className="overflow-x-auto">
        <div className="flex flex-wrap gap-1">
          {hours.map((h) => {
            const row = byHour.get(h);
            const imp = row?.impressions ?? 0;
            const opacity = imp > 0 ? cellOpacity(imp) : 0.04;
            return (
              <div
                key={h}
                className="group relative h-9 w-9 sm:h-8 sm:w-8 rounded-md flex items-center justify-center cursor-default transition-all hover:scale-110 hover:z-10"
                style={{ background: `rgba(34, 211, 238, ${opacity})` }}
              >
                <span className="text-[8px] sm:text-[9px] font-medium text-white/50">
                  {formatHourLabel(h)}
                </span>
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded-md bg-zinc-900/95 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                  <span className="text-[10px] text-white/70">
                    {imp > 0 ? `${imp.toLocaleString()} imp` : "No data"}
                    {row?.clicks ? ` / ${row.clicks.toLocaleString()} clicks` : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {/* Legend */}
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

// --- Daily Trend Area Chart ---

export interface DailyRow {
  date: string;
  dayOfWeek: number;
  dayLabel: string;
  impressions: number;
  clicks: number;
  ctr: number | null;
}

export function DailyTrendChart({ data }: { data: DailyRow[] }) {
  if (data.length < 2) return null;

  // Format date as "Mar 5"
  const chartData = data.map((d) => {
    const dt = new Date(d.date + "T12:00:00");
    const label = dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return { ...d, label };
  });

  return (
    <div className="glass-card p-5">
      <p className="text-xs font-semibold text-white/60 mb-4">Daily Performance Trend</p>
      <div className="h-52">
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
      {/* Legend */}
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

// --- Day of Week Bar Chart ---

export interface DayOfWeekRow {
  day: string;
  impressions: number;
  clicks: number;
}

export function DayOfWeekChart({ data }: { data: DayOfWeekRow[] }) {
  if (data.length === 0) return null;

  return (
    <div className="glass-card p-5">
      <p className="text-xs font-semibold text-white/60 mb-4">Performance by Day of Week</p>
      <div className="h-44">
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
