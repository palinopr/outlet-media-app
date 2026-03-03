export const CLIENT_SLUGS = ["zamora", "kybba", "beamina", "happy_paws"] as const;

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
