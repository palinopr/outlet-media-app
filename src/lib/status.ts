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

type EventStatus = "onsale" | "presale" | "soldout" | "offsale" | "cancelled" | "published";

const eventStatusMap: Record<
  EventStatus,
  { label: string; text: string; bg: string; dot: string }
> = {
  onsale: { label: "On Sale", text: "text-emerald-400", bg: "bg-emerald-400/10", dot: "bg-emerald-400" },
  presale: { label: "Presale", text: "text-blue-400", bg: "bg-blue-400/10", dot: "bg-blue-400" },
  soldout: { label: "Sold Out", text: "text-violet-400", bg: "bg-violet-400/10", dot: "bg-violet-400" },
  offsale: { label: "Off Sale", text: "text-zinc-400", bg: "bg-zinc-400/10", dot: "bg-zinc-400" },
  cancelled: { label: "Cancelled", text: "text-red-400", bg: "bg-red-400/10", dot: "bg-red-400" },
  published: { label: "Published", text: "text-blue-400", bg: "bg-blue-400/10", dot: "bg-blue-400" },
};

export function getEventStatusCfg(status: string) {
  const key = (status ?? "").toLowerCase().replace(/_/g, "") as EventStatus;
  return (
    eventStatusMap[key] ?? {
      label: status,
      text: "text-amber-400",
      bg: "bg-amber-400/10",
      dot: "bg-amber-400",
    }
  );
}
