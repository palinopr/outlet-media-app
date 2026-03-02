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
