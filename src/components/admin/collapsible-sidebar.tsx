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
        "hidden lg:flex flex-col border-r border-border/50 shrink-0 transition-all duration-200 overflow-hidden",
        hydrated ? (collapsed ? "w-16" : "w-60") : "w-60"
      )}
    >
      <SidebarContent
        clerkEnabled={clerkEnabled}
        displayName={displayName}
        collapsed={hydrated ? collapsed : false}
        onToggle={toggle}
      />
    </aside>
  );
}
