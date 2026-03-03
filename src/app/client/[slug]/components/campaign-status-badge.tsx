import { getCampaignStatusCfg } from "../lib";

export function CampaignStatusBadge({ status }: { status: string }) {
  const cfg = getCampaignStatusCfg(status);
  return (
    <span className={`badge-status ${cfg.text} ${cfg.bg}`}>
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
