type CampaignStatus = "ACTIVE" | "PAUSED" | "DELETED" | "ARCHIVED";

const campaignStatusMap: Record<
  CampaignStatus,
  { label: string; text: string; bg: string; dot: string }
> = {
  ACTIVE: { label: "Active", text: "text-emerald-400", bg: "bg-emerald-400/10", dot: "bg-emerald-400" },
  PAUSED: { label: "Paused", text: "text-amber-400", bg: "bg-amber-400/10", dot: "bg-amber-400" },
  DELETED: { label: "Deleted", text: "text-red-400", bg: "bg-red-400/10", dot: "bg-red-400" },
  ARCHIVED: { label: "Archived", text: "text-zinc-400", bg: "bg-zinc-400/10", dot: "bg-zinc-400" },
};

export function getCampaignStatusCfg(status: string) {
  const key = status.toUpperCase() as CampaignStatus;
  return (
    campaignStatusMap[key] ?? {
      label: status,
      text: "text-white/40",
      bg: "bg-white/5",
      dot: "bg-white/40",
    }
  );
}

export function getGenericStatusCfg(status: string) {
  return {
    label: status,
    text: "text-amber-400",
    bg: "bg-amber-400/10",
    dot: "bg-amber-400",
  };
}
