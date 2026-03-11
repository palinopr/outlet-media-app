"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, Mail } from "lucide-react";
import { getClientNavLinks, isNavActive } from "./nav-config";

interface Props {
  slug: string;
  clientName: string;
  eventsEnabled: boolean;
}

export function MobileNav({ slug, clientName, eventsEnabled }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = getClientNavLinks(slug, { eventsEnabled });

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  return (
    <div className="lg:hidden">
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[oklch(0.12_0_0)]">
        <div className="flex items-center gap-2">
          <Image src="/images/brand/symbol-white.png" alt="Outlet Media" width={24} height={24} className="h-6 w-6 shrink-0" />
          <p className="text-sm font-semibold text-white/90">{clientName}</p>
        </div>
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle navigation menu"
          className="flex items-center justify-center h-8 w-8 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-all"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={close}
            role="presentation"
          />
          <div className="fixed top-[53px] right-0 z-50 w-64 h-[calc(100vh-53px)] bg-[oklch(0.12_0_0)] border-l border-white/[0.06] overflow-y-auto">
            <nav className="px-3 py-4 space-y-1" aria-label="Mobile navigation">
              {links.map((link) => {
                const active = isNavActive(link, pathname);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={close}
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
            </nav>

            <div className="px-3 mt-4 pt-4 border-t border-white/[0.06]">
              <a
                href="mailto:hello@outletmedia.io"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:text-white/70 hover:bg-white/[0.03] transition-all"
              >
                <Mail className="h-4 w-4" />
                Contact Support
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
