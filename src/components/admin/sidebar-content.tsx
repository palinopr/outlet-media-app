import Image from "next/image";
import { NavLinks } from "./nav-links";
import { UserAvatar } from "./user-avatar";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

interface SidebarContentProps {
  clerkEnabled: boolean;
  displayName?: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

export function SidebarContent({
  clerkEnabled,
  displayName = "Admin",
  collapsed,
  onToggle,
}: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full bg-[oklch(0.12_0_0)]">
      {/* Logo */}
      <div className={collapsed ? "px-2 py-5 flex items-center justify-center" : "px-4 py-5 flex items-center gap-2.5"}>
        <Image src="/images/brand/symbol-white.png" alt="Outlet Media" width={32} height={32} className="h-8 w-8 shrink-0" />
        {!collapsed && (
          <div>
            <p className="text-sm font-semibold leading-none text-white">Outlet Media</p>
            <p className="text-[11px] text-white/40 mt-0.5">Ad Operations</p>
          </div>
        )}
      </div>
      <div className="h-px bg-white/[0.06] mx-3" />

      {/* Nav (scrollable if content overflows) */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <NavLinks collapsed={collapsed} />
      </div>

      <div className="h-px bg-white/[0.06] mx-3" />

      {/* User + collapse toggle — single row pinned to bottom */}
      <div className={collapsed ? "px-2 py-3 flex items-center justify-center shrink-0" : "px-4 py-3 flex items-center gap-3 shrink-0"}>
        <UserAvatar clerkEnabled={clerkEnabled} />
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium truncate text-white/90">{displayName}</p>
            <p className="text-[11px] text-white/40">Admin</p>
          </div>
        )}
        {onToggle && (
          <button
            onClick={onToggle}
            className="flex items-center justify-center h-8 w-8 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.04] transition-colors duration-150 shrink-0"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
