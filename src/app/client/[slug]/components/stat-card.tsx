import type { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  iconColor,
  label,
  value,
  sub,
}: {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="glass-card p-3 sm:p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`flex items-center justify-center h-6 w-6 rounded-lg ${iconColor}`}>
          <Icon className="h-3 w-3" />
        </div>
        <span className="text-[10px] font-semibold tracking-wider uppercase text-white/40">
          {label}
        </span>
      </div>
      <p className="text-xl font-extrabold text-white tracking-tight">{value}</p>
      {sub && <p className="text-[10px] text-white/25 mt-1">{sub}</p>}
    </div>
  );
}
