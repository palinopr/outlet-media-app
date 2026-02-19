"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SidebarContent } from "./sidebar-content";

interface MobileSidebarProps {
  clerkEnabled: boolean;
}

export function MobileSidebar({ clerkEnabled }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border/50 bg-[oklch(0.16_0_0)]">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">O</span>
          </div>
          <p className="text-sm font-semibold text-white/90">Outlet Media</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-56 p-0 bg-[oklch(0.16_0_0)] border-border/50">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <SidebarContent clerkEnabled={clerkEnabled} />
        </SheetContent>
      </Sheet>
    </>
  );
}
