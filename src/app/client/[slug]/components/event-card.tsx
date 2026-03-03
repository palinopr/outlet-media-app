import { Calendar, MapPin } from "lucide-react";
import type { EventCard as EventCardData } from "../types";
import { fmtDate, fmtUsd } from "@/lib/formatters";
import { getEventStatusCfg } from "../lib";
import { ProgressBar } from "./progress-bar";

function EventStatusBadge({ status }: { status: string }) {
  const cfg = getEventStatusCfg(status);
  return (
    <span className={`badge-status ${cfg.text} ${cfg.bg}`}>
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export function EventCard({ e }: { e: EventCardData }) {
  return (
    <div className="glass-card p-5 flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="text-sm font-semibold text-white/90 leading-tight truncate">{e.city || e.name}</p>
        <EventStatusBadge status={e.status} />
      </div>
      <div className="flex items-center gap-2 text-[10px] text-white/30 mb-4">
        <Calendar className="h-3 w-3" />
        <span>{fmtDate(e.date)}</span>
        {e.venue && (
          <>
            <span className="text-white/10">|</span>
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{e.venue}</span>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-auto">
        <div>
          <p className="text-[10px] text-white/30 mb-0.5">Tickets Sold</p>
          <p className="text-sm font-bold text-white/80">{e.ticketsSold.toLocaleString()}</p>
        </div>
        {e.sellThrough != null && (
          <div>
            <p className="text-[10px] text-white/30 mb-0.5">Sell-Through</p>
            <p className="text-sm font-bold text-white/80">{e.sellThrough}%</p>
          </div>
        )}
        {e.avgTicketPrice != null && (
          <div>
            <p className="text-[10px] text-white/30 mb-0.5">Avg Ticket</p>
            <p className="text-sm font-bold text-white/80">${e.avgTicketPrice.toFixed(0)}</p>
          </div>
        )}
        {e.gross != null && e.gross > 0 && (
          <div>
            <p className="text-[10px] text-white/30 mb-0.5">Gross</p>
            <p className="text-sm font-bold text-emerald-400/80">{fmtUsd(e.gross)}</p>
          </div>
        )}
      </div>

      {e.sellThrough != null && (
        <div className="mt-3 pt-3 border-t border-white/[0.06]">
          <ProgressBar value={e.sellThrough} />
        </div>
      )}
    </div>
  );
}
