import type { LucideIcon } from "lucide-react";
import { StatCard as SharedStatCard } from "@/components/admin/stat-card";

export function StatCard({
  icon,
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
    <SharedStatCard
      icon={icon}
      iconColor={iconColor}
      label={label}
      value={value}
      sub={sub}
      variant="glass"
    />
  );
}
