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
      <div className="px-4 py-5 flex items-center gap-2">
        <div className="h-6 w-6 rounded bg-primary flex items-center justify-center shrink-0">
          <span className="text-primary-foreground text-xs font-bold">O</span>
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">Outlet Media</p>
          <p className="text-xs text-muted-foreground mt-0.5">Ad Operations</p>
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
          <p className="text-xs font-medium truncate">Admin</p>
          <p className="text-xs text-muted-foreground">Outlet Media</p>
        </div>
      </div>
    </div>
  );
}
