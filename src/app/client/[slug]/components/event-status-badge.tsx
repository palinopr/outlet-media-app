import { getEventStatusCfg } from "../lib";

export function EventStatusBadge({ status }: { status: string }) {
  const cfg = getEventStatusCfg(status);
  return (
    <span className={`badge-status ${cfg.text} ${cfg.bg}`}>
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
