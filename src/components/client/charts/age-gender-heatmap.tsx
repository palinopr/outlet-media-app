"use client";

import type { AgeGenderCell } from "./types";

export function AgeGenderHeatmap({ data, ages }: { data: AgeGenderCell[]; ages: string[] }) {
  if (data.length === 0) return null;

  const genders = [...new Set(data.map((d) => d.gender))].sort();
  const maxPct = Math.max(...data.map((d) => d.pct), 1);

  function cellColor(gender: string, pct: number): string {
    const opacity = 0.15 + (pct / maxPct) * 0.85;
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
              <th className="pb-2 text-left text-[10px] text-white/25 font-medium w-16 sticky left-0 z-10" />
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
                <td className="py-1 text-[10px] text-white/40 font-medium sticky left-0 z-10">{gender}</td>
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
