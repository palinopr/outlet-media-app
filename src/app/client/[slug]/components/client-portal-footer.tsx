import { Shield, Eye, Clock } from "lucide-react";
import { timeAgo } from "@/lib/formatters";

interface Props {
  dataSource: string;
  /** Use the Clock icon instead of Eye for the sync indicator (campaign detail pages). */
  showClock?: boolean;
  lastSyncedAt?: string | null;
}

export function ClientPortalFooter({ dataSource, showClock = false, lastSyncedAt }: Props) {
  const SyncIcon = showClock ? Clock : Eye;
  return (
    <footer className="pt-4 print:hidden">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">O</span>
          </div>
          <span className="text-xs text-white/50 font-medium">Powered by Outlet Media</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-white/45">
            <Shield className="h-3 w-3" />
            <span>Secure Portal</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/45">
            <SyncIcon className="h-3 w-3" />
            <span>{dataSource === "meta_api" ? "Live from Meta" : lastSyncedAt ? `Synced ${timeAgo(lastSyncedAt)}` : "Last sync"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
