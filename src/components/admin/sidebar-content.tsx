import { Separator } from "@/components/ui/separator";
import { NavLinks } from "./nav-links";
import { UserAvatar } from "./user-avatar";

interface SidebarContentProps {
  clerkEnabled: boolean;
}

export function SidebarContent({ clerkEnabled }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">O</span>
        </div>
        <div>
          <p className="text-sm font-semibold leading-none text-white">Outlet Media</p>
          <p className="text-xs text-white/50 mt-0.5">Ad Operations</p>
        </div>
      </div>
      <Separator />

      {/* Nav */}
      <NavLinks />

      <Separator />

      {/* User */}
      <div className="px-4 py-4 flex items-center gap-3">
        <UserAvatar clerkEnabled={clerkEnabled} />
        <div className="min-w-0">
          <p className="text-xs font-medium truncate text-white">Jaime Ortiz</p>
          <p className="text-xs text-white/50">Admin</p>
        </div>
      </div>
    </div>
  );
}
