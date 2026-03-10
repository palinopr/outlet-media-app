"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { adminNavItems } from "./nav-config";

interface NavLinksProps {
  collapsed?: boolean;
}

export function NavLinks({ collapsed }: NavLinksProps) {
  const pathname = usePathname();

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <nav className="px-2 py-4 space-y-0.5">
          {adminNavItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Tooltip key={href}>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center justify-center h-10 w-full rounded-lg transition-all duration-150",
                      active
                        ? "bg-white/[0.08] text-white font-medium shadow-sm"
                        : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        active ? "text-cyan-400" : "text-white/40"
                      )}
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  {label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </TooltipProvider>
    );
  }

  return (
    <nav className="px-2 py-4 space-y-0.5">
      {adminNavItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150",
              active
                ? "bg-white/[0.08] text-white font-medium shadow-sm"
                : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 shrink-0",
                active ? "text-cyan-400" : "text-white/40"
              )}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
