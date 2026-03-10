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

export interface HourlyRow {
  hour: number;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number | null;
}

export interface DailyRow {
  date: string;
  dayOfWeek: number;
  dayLabel: string;
  impressions: number;
  clicks: number;
  ctr: number | null;
}

export interface DayOfWeekRow {
  day: string;
  impressions: number;
  clicks: number;
}

export interface PerformanceTrendRow {
  date: string;
  label: string;
  spend: number;
  revenue: number | null;
  roas: number | null;
  impressions: number;
  clicks: number;
  ctr: number | null;
}

export interface MarketRow {
  market: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number | null;
  cpc: number | null;
  pct: number;
}

export const tooltipStyle = {
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

export const sharedAxisProps = {
  x: {
    tick: { fill: "rgba(255,255,255,0.3)", fontSize: 10 },
    axisLine: false as const,
    tickLine: false as const,
    interval: "preserveStartEnd" as const,
  },
  y: {
    tick: { fill: "rgba(255,255,255,0.25)", fontSize: 10 },
    axisLine: false as const,
    tickLine: false as const,
  },
};

export const gridProps = {
  strokeDasharray: "3 3",
  stroke: "rgba(255,255,255,0.04)",
};

export function kFormatter(v: number): string {
  return v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v);
}

export function usdKFormatter(v: number): string {
  return v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`;
}
