import { NavLinks } from "./nav-links";
import { UserAvatar } from "./user-avatar";

interface SidebarContentProps {
  clerkEnabled: boolean;
}

export function SidebarContent({ clerkEnabled }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full bg-[oklch(0.16_0_0)]">
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shrink-0">
          <span className="text-white text-sm font-bold">O</span>
        </div>
        <div>
          <p className="text-sm font-semibold leading-none text-white">Outlet Media</p>
          <p className="text-[11px] text-white/40 mt-0.5">Ad Operations</p>
        </div>
      </div>
      <div className="h-px bg-white/[0.06] mx-3" />

      {/* Nav */}
      <NavLinks />

      <div className="h-px bg-white/[0.06] mx-3" />

      {/* User */}
      <div className="px-4 py-4 flex items-center gap-3">
        <UserAvatar clerkEnabled={clerkEnabled} />
        <div className="min-w-0">
          <p className="text-xs font-medium truncate text-white/90">Jaime Ortiz</p>
          <p className="text-[11px] text-white/40">Admin</p>
        </div>
      </div>
    </div>
  );
}
