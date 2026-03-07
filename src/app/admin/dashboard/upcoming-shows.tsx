import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { matchedCampaigns } from "@/lib/campaign-event-match";
import { fmtDate } from "@/lib/formatters";
import type { TmEvent, MetaCampaign } from "./data";

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / 86_400_000);
}

interface Props {
  shows: TmEvent[];
  allCampaigns: Pick<MetaCampaign, "name" | "status" | "spend" | "roas" | "client_slug">[];
}

export function UpcomingShows({ shows, allCampaigns }: Props) {
  if (shows.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Upcoming Shows</h2>
        <Link href="/admin/events" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {shows.map((e) => {
          const days = daysUntil(e.date);
          const linked = matchedCampaigns(allCampaigns, e).filter((campaign) => {
            if (!e.client_slug || !campaign.client_slug) return true;
            return campaign.client_slug === e.client_slug;
          });
          const hasActive = linked.some(c => c.status === "ACTIVE");
          const hasPaused = linked.some(c => c.status === "PAUSED");
          const urgent = days != null && days <= 7 && !hasActive;
          const borderColor = urgent ? "border-red-500/40" : "border-border/60";
          const bgColor = urgent ? "bg-red-500/5" : "bg-card";
          return (
            <div key={e.id} className={`rounded-xl border ${borderColor} ${bgColor} p-4`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{e.artist}</p>
                  <p className="text-xs text-muted-foreground truncate">{e.city}</p>
                </div>
                {days != null && (
                  <span className={`text-xs font-semibold tabular-nums shrink-0 px-1.5 py-0.5 rounded ${days <= 3 ? "bg-red-500/15 text-red-400" :
                      days <= 7 ? "bg-amber-500/15 text-amber-400" :
                        "bg-zinc-500/10 text-zinc-400"
                    }`}>
                    {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days}d`}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-2">{fmtDate(e.date)}</p>
              {hasActive ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Campaign active
                </span>
              ) : hasPaused ? (
                <span className="inline-flex items-center gap-1 text-xs text-amber-400">
                  <AlertTriangle className="h-3 w-3" />
                  Campaign paused
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">No campaign</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
