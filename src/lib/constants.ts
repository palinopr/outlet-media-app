export const META_API_VERSION = "v21.0";

export type DateRange = "today" | "yesterday" | "7" | "14" | "30" | "lifetime";

export const META_PRESETS: Record<DateRange, string> = {
  today: "today",
  yesterday: "yesterday",
  "7": "last_7d",
  "14": "last_14d",
  "30": "last_30d",
  lifetime: "maximum",
};

export const RANGE_LABELS: Record<DateRange, string> = {
  today: "Today",
  yesterday: "Yesterday",
  "7": "Last 7 Days",
  "14": "Last 14 Days",
  "30": "Last 30 Days",
  lifetime: "Lifetime",
};

/** Parse a raw range string, falling back to a default. */
export function parseRange(raw: string | undefined, fallback: DateRange = "today"): DateRange {
  return raw && raw in RANGE_LABELS ? (raw as DateRange) : fallback;
}

export const EVENT_STATUS_OPTIONS = [
  { value: "onsale", label: "On Sale" },
  { value: "offsale", label: "Off Sale" },
  { value: "cancelled", label: "Cancelled" },
  { value: "postponed", label: "Postponed" },
  { value: "rescheduled", label: "Rescheduled" },
];

export const ASSET_STATUSES = ["new", "labeled", "approved", "archived"] as const;
export type AssetStatus = (typeof ASSET_STATUSES)[number];

export const ASSET_STATUS_COLORS: Record<AssetStatus, string> = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  labeled: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  archived: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};
