"use client";

import {
  Treemap,
  ResponsiveContainer,
} from "recharts";
import { type PlacementRow } from "./types";

// --- Treemap ---

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

// --- Table ---

const platformDot: Record<string, string> = {
  Facebook: "bg-blue-400",
  Instagram: "bg-violet-400",
  Messenger: "bg-cyan-400",
  "Audience Network": "bg-amber-400",
};

export function PlacementTable({ data }: { data: PlacementRow[] }) {
  if (data.length === 0) return null;

  const totalImp = data.reduce((s, r) => s + r.impressions, 0);
  const sorted = [...data].sort((a, b) => b.impressions - a.impressions);

  return (
    <div className="glass-card p-5">
      <p className="text-xs font-semibold text-white/60 mb-4">Placement Breakdown</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ minWidth: 540 }}>
          <thead>
            <tr className="text-white/30 text-left border-b border-white/[0.06]">
              <th className="pb-2 pr-3 font-medium whitespace-nowrap">Platform</th>
              <th className="pb-2 pr-3 font-medium whitespace-nowrap">Position</th>
              <th className="pb-2 pl-3 font-medium text-right whitespace-nowrap">Impressions</th>
              <th className="pb-2 pl-3 font-medium text-right whitespace-nowrap">Clicks</th>
              <th className="pb-2 pl-3 font-medium text-right whitespace-nowrap">CTR</th>
              <th className="pb-2 pl-3 font-medium text-right whitespace-nowrap">Share</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => {
              const pct = totalImp > 0 ? (row.impressions / totalImp) * 100 : 0;
              const dot = platformDot[row.platform] ?? "bg-white/30";
              return (
                <tr key={i} className="border-b border-white/[0.03] last:border-0">
                  <td className="py-2.5 pr-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dot}`} />
                      <span className="text-white/70">{row.platform}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-3 text-white/50 whitespace-nowrap">{row.position}</td>
                  <td className="py-2.5 pl-3 text-white/60 text-right font-medium whitespace-nowrap">
                    {row.impressions.toLocaleString()}
                  </td>
                  <td className="py-2.5 pl-3 text-white/50 text-right whitespace-nowrap">
                    {row.clicks.toLocaleString()}
                  </td>
                  <td className="py-2.5 pl-3 text-white/50 text-right whitespace-nowrap">
                    {row.ctr != null ? `${row.ctr.toFixed(2)}%` : "--"}
                  </td>
                  <td className="py-2.5 pl-3 text-white/60 text-right font-medium whitespace-nowrap">
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
