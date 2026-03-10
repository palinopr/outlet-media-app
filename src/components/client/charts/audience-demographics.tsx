"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { AgeGenderBreakdown } from "@/app/client/[slug]/types";
import { tooltipStyle, kFormatter } from "./types";

type Tab = "age" | "gender" | "heatmap";

const AGE_ORDER = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];

const GENDER_COLORS: Record<string, string> = {
  Female: "#a78bfa",
  Male: "#22d3ee",
  Unknown: "rgba(255,255,255,0.15)",
};

interface AgeRow {
  age: string;
  impressions: number;
}

interface GenderRow {
  gender: string;
  impressions: number;
  pct: number;
}

interface HeatCell {
  age: string;
  gender: string;
  impressions: number;
}

function aggregateByAge(data: AgeGenderBreakdown[]): AgeRow[] {
  const map = new Map<string, number>();
  for (const row of data) {
    map.set(row.age, (map.get(row.age) ?? 0) + row.impressions);
  }
  return AGE_ORDER.filter((a) => map.has(a)).map((age) => ({
    age,
    impressions: map.get(age)!,
  }));
}

function aggregateByGender(data: AgeGenderBreakdown[]): GenderRow[] {
  const map = new Map<string, number>();
  for (const row of data) {
    map.set(row.gender, (map.get(row.gender) ?? 0) + row.impressions);
  }
  const total = [...map.values()].reduce((a, b) => a + b, 0) || 1;
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([gender, impressions]) => ({
      gender,
      impressions,
      pct: (impressions / total) * 100,
    }));
}

function buildHeatCells(data: AgeGenderBreakdown[]): {
  cells: HeatCell[];
  ages: string[];
  genders: string[];
} {
  const map = new Map<string, number>();
  const ageSet = new Set<string>();
  const genderSet = new Set<string>();
  for (const row of data) {
    const key = `${row.gender}|${row.age}`;
    map.set(key, (map.get(key) ?? 0) + row.impressions);
    ageSet.add(row.age);
    genderSet.add(row.gender);
  }
  const ages = AGE_ORDER.filter((a) => ageSet.has(a));
  const genders = [...genderSet].sort();
  const cells: HeatCell[] = [];
  for (const gender of genders) {
    for (const age of ages) {
      cells.push({
        age,
        gender,
        impressions: map.get(`${gender}|${age}`) ?? 0,
      });
    }
  }
  return { cells, ages, genders };
}

export function AudienceDemographics({ data }: { data: AgeGenderBreakdown[] }) {
  const [tab, setTab] = useState<Tab>("age");

  const ageRows = useMemo(() => aggregateByAge(data), [data]);
  const genderRows = useMemo(() => aggregateByGender(data), [data]);
  const heatmap = useMemo(() => buildHeatCells(data), [data]);

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
        <p className="text-xs text-white/35">No audience data available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold text-white/60">
          Audience Demographics
        </p>
        <div className="flex gap-0.5 rounded-full bg-white/[0.05] p-0.5">
          {(
            [
              ["age", "Age"],
              ["gender", "Gender"],
              ["heatmap", "Age x Gender"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors ${
                tab === key
                  ? "bg-white text-zinc-900"
                  : "text-white/50 hover:text-white/70"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === "age" && <AgeTab data={ageRows} />}
      {tab === "gender" && <GenderTab data={genderRows} />}
      {tab === "heatmap" && (
        <HeatmapTab
          cells={heatmap.cells}
          ages={heatmap.ages}
          genders={heatmap.genders}
        />
      )}
    </div>
  );
}

function AgeTab({ data }: { data: AgeRow[] }) {
  const maxImp = Math.max(...data.map((d) => d.impressions));

  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
        >
          <XAxis type="number" hide domain={[0, maxImp * 1.15]} />
          <YAxis
            dataKey="age"
            type="category"
            width={44}
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            {...tooltipStyle}
            formatter={(value) => [
              Number(value).toLocaleString(),
              "Impressions",
            ]}
          />
          <Bar
            dataKey="impressions"
            fill="#22d3ee"
            radius={[0, 6, 6, 0]}
            barSize={24}
            label={{
              position: "right" as const,
              fill: "rgba(255,255,255,0.5)",
              fontSize: 10,
              formatter: (v) => kFormatter(Number(v)),
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function GenderTab({ data }: { data: GenderRow[] }) {
  return (
    <div className="flex flex-col items-center gap-4 h-[260px]">
      <div className="h-44 w-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="impressions"
              nameKey="gender"
              innerRadius="55%"
              outerRadius="90%"
              paddingAngle={3}
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.gender}
                  fill={
                    GENDER_COLORS[entry.gender] ?? "rgba(255,255,255,0.1)"
                  }
                />
              ))}
            </Pie>
            <Tooltip
              {...tooltipStyle}
              formatter={(value) => [
                Number(value).toLocaleString(),
                "Impressions",
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-5 w-full justify-center">
        {data.map((row) => (
          <div key={row.gender} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{
                background:
                  GENDER_COLORS[row.gender] ?? "rgba(255,255,255,0.1)",
              }}
            />
            <span className="text-xs text-white/50">{row.gender}</span>
            <span className="text-sm font-bold text-white/80">
              {row.pct.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeatmapTab({
  cells,
  ages,
  genders,
}: {
  cells: HeatCell[];
  ages: string[];
  genders: string[];
}) {
  const maxImp = Math.max(...cells.map((c) => c.impressions), 1);

  function cellBg(gender: string, impressions: number): string {
    if (impressions === 0) return "rgba(255,255,255,0.03)";
    const intensity = 0.15 + (impressions / maxImp) * 0.85;
    if (gender === "Female") return `rgba(167, 139, 250, ${intensity})`;
    if (gender === "Male") return `rgba(34, 211, 238, ${intensity})`;
    return `rgba(255, 255, 255, ${intensity * 0.3})`;
  }

  return (
    <div>
      <p className="text-[10px] text-white/20 mb-2">
        Impression density -- brighter = higher concentration
      </p>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="pb-2 text-left text-[10px] text-white/25 font-medium w-14" />
              {ages.map((age) => (
                <th
                  key={age}
                  className="pb-2 text-center text-[10px] text-white/30 font-medium px-0.5"
                >
                  {age}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {genders.map((gender) => (
              <tr key={gender}>
                <td className="py-0.5 text-[10px] text-white/40 font-medium">
                  {gender}
                </td>
                {ages.map((age) => {
                  const cell = cells.find(
                    (c) => c.age === age && c.gender === gender,
                  );
                  const imp = cell?.impressions ?? 0;
                  return (
                    <td key={age} className="py-0.5 px-0.5">
                      <div
                        className="rounded-lg h-9 flex items-center justify-center"
                        style={{ background: cellBg(gender, imp) }}
                      >
                        {imp > 0 && (
                          <span className="text-[9px] font-bold text-white/90">
                            {kFormatter(imp)}
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
