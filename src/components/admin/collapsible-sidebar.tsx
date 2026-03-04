"use client";

import { useSidebarState } from "@/hooks/use-sidebar-state";
import { SidebarContent } from "./sidebar-content";
import { cn } from "@/lib/utils";

interface CollapsibleSidebarProps {
  clerkEnabled: boolean;
  displayName: string;
}

export function CollapsibleSidebar({ clerkEnabled, displayName }: CollapsibleSidebarProps) {
  const { collapsed, toggle, hydrated } = useSidebarState();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r border-border/50 shrink-0 transition-all duration-200 overflow-hidden relative",
        hydrated ? (collapsed ? "w-16" : "w-60") : "w-60"
      )}
    >
      {/* Subtle right-edge gradient accent matching client portal */}
      <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-500/20 via-violet-500/10 to-transparent pointer-events-none" />
      <SidebarContent
        clerkEnabled={clerkEnabled}
        displayName={displayName}
        collapsed={hydrated ? collapsed : false}
        onToggle={toggle}
      />
    </aside>
  );
}
