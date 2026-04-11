import { useId } from "react";
import { cn } from "@/lib/utils";

type LandingMetricAccent = "blue" | "emerald" | "violet" | "amber";
type LandingMetricSize = "default" | "compact";
type LandingMetricTrack = "media" | "ticketing" | "system";

const ACCENT_STYLES: Record<
  LandingMetricAccent,
  {
    readonly shell: string;
    readonly label: string;
    readonly pill: string;
    readonly dot: string;
    readonly stroke: string;
  }
> = {
  blue: {
    shell:
      "border-[#8fd4ff]/18 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_46%),rgba(255,255,255,0.04)]",
    label: "text-[#bfeaff]",
    pill: "border-[#8fd4ff]/18 bg-[#8fd4ff]/12 text-[#bfeaff]",
    dot: "bg-[#8fd4ff]",
    stroke: "#8fd4ff",
  },
  emerald: {
    shell:
      "border-emerald-300/18 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_46%),rgba(255,255,255,0.04)]",
    label: "text-emerald-200",
    pill: "border-emerald-300/18 bg-emerald-300/12 text-emerald-200",
    dot: "bg-emerald-300",
    stroke: "#86efac",
  },
  violet: {
    shell:
      "border-violet-300/18 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.12),transparent_46%),rgba(255,255,255,0.04)]",
    label: "text-violet-200",
    pill: "border-violet-300/18 bg-violet-300/12 text-violet-200",
    dot: "bg-violet-300",
    stroke: "#c4b5fd",
  },
  amber: {
    shell:
      "border-amber-300/18 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.12),transparent_46%),rgba(255,255,255,0.04)]",
    label: "text-amber-200",
    pill: "border-amber-300/18 bg-amber-300/12 text-amber-200",
    dot: "bg-amber-300",
    stroke: "#fcd34d",
  },
};

const TRACK_STYLES: Record<
  LandingMetricTrack,
  {
    readonly badge: string;
    readonly shell: string;
    readonly label: string;
  }
> = {
  media: {
    badge: "border-[#8fd4ff]/18 bg-[#8fd4ff]/12 text-[#bfeaff]",
    shell: "after:bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_42%)]",
    label: "Media",
  },
  ticketing: {
    badge: "border-amber-300/18 bg-amber-300/12 text-amber-200",
    shell: "after:bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.14),transparent_42%)]",
    label: "Ticketing",
  },
  system: {
    badge: "border-violet-300/18 bg-violet-300/12 text-violet-200",
    shell: "after:bg-[radial-gradient(circle_at_top_right,rgba(167,139,250,0.14),transparent_42%)]",
    label: "System",
  },
};

interface LandingSampleMetricCardProps {
  readonly label: string;
  readonly value: string;
  readonly caption: string;
  readonly delta: string;
  readonly accent: LandingMetricAccent;
  readonly track?: LandingMetricTrack;
  readonly trendPoints: string;
  readonly className?: string;
  readonly size?: LandingMetricSize;
}

export function LandingSampleMetricCard({
  label,
  value,
  caption,
  delta,
  accent,
  track = "system",
  trendPoints,
  className,
  size = "default",
}: LandingSampleMetricCardProps) {
  const gradientId = useId().replace(/:/g, "");
  const accentStyle = ACCENT_STYLES[accent];
  const trackStyle = TRACK_STYLES[track];
  const compact = size === "compact";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[20px] border shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] after:pointer-events-none after:absolute after:inset-0 after:opacity-100",
        compact ? "p-2.5" : "p-3.5",
        accentStyle.shell,
        trackStyle.shell,
        className,
      )}
    >
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={cn("size-2 rounded-full", accentStyle.dot)} />
          <p
            className={cn(
              "font-semibold uppercase tracking-[0.16em]",
              compact ? "text-[8px]" : "text-[9px]",
              accentStyle.label,
            )}
          >
            {label}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 font-semibold uppercase tracking-[0.14em]",
              compact ? "text-[8px]" : "text-[9px]",
              accentStyle.pill,
            )}
          >
            {delta}
          </span>
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 font-semibold uppercase tracking-[0.14em]",
              compact ? "text-[8px]" : "text-[9px]",
              trackStyle.badge,
            )}
          >
            {trackStyle.label}
          </span>
        </div>
      </div>

      <p className={cn("relative z-10 font-semibold leading-none text-white", compact ? "mt-2 text-base" : "mt-3 text-[1.55rem]")}>{value}</p>
      <p className={cn("relative z-10 uppercase tracking-[0.14em] text-slate-400", compact ? "mt-1 text-[8px]" : "mt-1.5 text-[10px]")}>{caption}</p>

      <div className={cn("relative z-10 rounded-[14px] border border-white/6 bg-[#07111d]/72", compact ? "mt-2 p-1.5" : "mt-3 p-2") }>
        <svg viewBox="0 0 100 34" className={cn("w-full", compact ? "h-7" : "h-8")} aria-hidden="true">
          <defs>
            <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={accentStyle.stroke} stopOpacity="0" />
              <stop offset="25%" stopColor={accentStyle.stroke} stopOpacity="0.35" />
              <stop offset="100%" stopColor={accentStyle.stroke} stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <polygon points={`0,34 ${trendPoints} 100,34`} fill={`url(#${gradientId})`} opacity="0.3" />
          <polyline
            points={trendPoints}
            fill="none"
            stroke={accentStyle.stroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
