export type BarColor = "gradient" | "cyan" | "violet" | "emerald" | "amber";

const BAR_COLORS: Record<string, string> = {
  cyan: "bg-cyan-400",
  violet: "bg-violet-400",
  emerald: "bg-emerald-400",
  amber: "bg-amber-400",
};

export function ProgressBar({ value, color = "gradient" }: { value: number; color?: BarColor }) {
  return (
    <div className="progress-track h-1.5">
      <div
        className={`h-full rounded-full ${color === "gradient" ? "gradient-bar" : BAR_COLORS[color]}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}
