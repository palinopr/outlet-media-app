"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail } from "lucide-react";
import { getClientNavLinks, isNavActive } from "./nav-config";
import type { ServiceKey } from "@/lib/service-registry";

interface Props {
  slug: string;
  enabledServices?: ServiceKey[] | null;
}

export function ClientNav({ slug, enabledServices }: Props) {
  const pathname = usePathname();
  const links = getClientNavLinks(slug, enabledServices);

  return (
    <nav className="flex-1 px-3 py-1">
      <div className="space-y-1">
        {links.map((link) => {
          const active = isNavActive(link, pathname);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "text-white/90 bg-white/[0.06] border border-white/[0.04]"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-cyan-400" : "text-white/30"}`} />
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-white/[0.06]">
        <a
          href="mailto:hello@outletmedia.io"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:text-white/70 hover:bg-white/[0.03] transition-all"
        >
          <Mail className="h-4 w-4" />
          Contact Support
        </a>
      </div>
    </nav>
  );
}
