import { StatCard as BaseStatCard, type StatCardProps } from "@/components/admin/stat-card";

export function StatCard(props: Omit<StatCardProps, "variant">) {
  return <BaseStatCard {...props} variant="glass" />;
}
