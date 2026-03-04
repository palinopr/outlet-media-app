import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: string;
  iconColor?: string;
  sub?: string;
  size?: "sm" | "lg";
}

export function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  iconColor,
  sub,
  size = "sm",
}: StatCardProps) {
  const isLg = size === "lg";

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-white/[0.04] bg-card ${isLg ? "p-5" : "p-4"} transition-all duration-200 hover:border-white/[0.08] hover:shadow-lg hover:shadow-black/20`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${accent ?? "from-white/[0.02] to-transparent"} opacity-50`}
      />
      <div className="relative">
        <div className={`flex items-center justify-between ${isLg ? "mb-3" : "mb-2"}`}>
          <p
            className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
          >
            {label}
          </p>
          <div
            className={`${isLg ? "h-8 w-8" : "h-7 w-7"} rounded-lg bg-white/[0.06] flex items-center justify-center ${iconColor ?? "text-muted-foreground"}`}
          >
            <Icon className={isLg ? "h-4 w-4" : "h-3.5 w-3.5"} />
          </div>
        </div>
        <p className={`${isLg ? "text-3xl" : "text-2xl"} font-bold tracking-tight`}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
