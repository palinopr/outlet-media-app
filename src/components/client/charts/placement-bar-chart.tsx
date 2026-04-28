import { PlatformIcon } from "../platform-icons";

interface PlacementBarData {
  platform: string;
  position: string;
  impressions: number;
  clicks: number;
  ctr: number | null;
  pct: number;
}

interface ChartRow {
  label: string;
  fullName: string;
  badgeClassName: string;
  platformName: string;
  pct: number;
  impressions: number;
  clicks: number;
  ctr: number | null;
}

function normalizePlacement(platform: string, position: string): Pick<ChartRow, "label" | "fullName" | "badgeClassName" | "platformName"> {
  const platformLower = platform.toLowerCase();
  const positionLower = position.toLowerCase();
  const platformName = platformLower.includes("instagram")
    ? "Instagram"
    : platformLower.includes("facebook")
      ? "Facebook"
      : titleCase(platform || "Meta");
  const placementName = titleCase(position.replace(/_/g, " ").replace(/\s+/g, " ").trim() || "Placement");
  const badgeClassName =
    platformName === "Instagram"
      ? "border-fuchsia-300/20 bg-fuchsia-500/15 text-fuchsia-200"
      : platformName === "Facebook"
        ? "border-blue-300/20 bg-blue-500/15 text-blue-200"
        : "border-violet-300/20 bg-violet-500/15 text-violet-200";

  return {
    badgeClassName,
    fullName: `${platformName} ${placementName}`,
    label: positionLower.includes(platformName.toLowerCase())
      ? placementName
      : `${platformName} ${placementName}`,
    platformName,
  };
}

function titleCase(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function PlacementBarChart({
  data,
  compact = false,
}: {
  data: PlacementBarData[];
  compact?: boolean;
}) {
  if (data.length === 0) return null;

  const chartData: ChartRow[] = [...data]
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 6)
    .map((d) => {
      const placement = normalizePlacement(d.platform, d.position);
      return {
        ...placement,
        pct: d.pct,
        impressions: d.impressions,
        clicks: d.clicks,
        ctr: d.ctr,
      };
    });

  const maxPct = Math.max(...chartData.map((row) => row.pct), 1);

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-black/15 p-4">
      <p className="mb-4 text-xs font-medium text-white/62">Placements</p>
      <div className={compact ? "space-y-3" : "space-y-3.5"}>
        {chartData.map((row) => (
          <div
            key={row.fullName}
            className="grid grid-cols-[minmax(9rem,0.9fr)_minmax(8rem,1.1fr)_3.25rem] items-center gap-3"
            title={`${row.fullName}: ${row.impressions.toLocaleString()} impressions, ${row.clicks.toLocaleString()} clicks, ${row.ctr != null ? `${row.ctr.toFixed(2)}% CTR` : "CTR unavailable"}`}
          >
            <div className="flex min-w-0 items-center gap-2">
              <span className={`inline-flex h-6 w-7 shrink-0 items-center justify-center rounded-lg border text-[10px] font-bold ${row.badgeClassName}`}>
                <PlatformIcon platform={row.platformName} size={14} />
              </span>
              <span className="truncate text-xs font-medium text-white/72">{row.label}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                style={{ width: `${Math.max(3, (row.pct / maxPct) * 100)}%` }}
              />
            </div>
            <span className="text-right text-xs tabular-nums text-white/62">{row.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
