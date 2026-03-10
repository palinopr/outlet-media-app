"use client";

import { Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

interface Props {
  slug: string;
  clientName: string;
}

const SUPPORT_EMAIL = "hello@outletmedia.io";

export function ClientHelperFab({ slug, clientName }: Props) {
  const pathname = usePathname();
  const pageLabel = getPageLabel(pathname, slug);
  const href = buildSupportHref({
    clientName,
    pageLabel,
    pathname,
  });

  return (
    <a
      href={href}
      aria-label="Open AI helper"
      className="fixed bottom-4 right-4 z-40 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-full border border-cyan-400/20 bg-[oklch(0.15_0.02_240)]/92 px-3 py-3 text-left shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-[oklch(0.17_0.02_240)]/96 sm:bottom-6 sm:right-6 sm:px-4"
      title={`Ask for help with ${pageLabel.toLowerCase()}`}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-400 text-zinc-950 shadow-[0_10px_30px_rgba(34,211,238,0.28)]">
        <Sparkles className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
          AI Helper
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        <span className="mt-0.5 block truncate text-sm font-medium text-white">
          Ask Outlet for help
        </span>
        <span className="mt-0.5 block truncate text-xs text-white/45">
          {pageLabel}
        </span>
      </span>
    </a>
  );
}

function buildSupportHref({
  clientName,
  pageLabel,
  pathname,
}: {
  clientName: string;
  pageLabel: string;
  pathname: string;
}) {
  const subject = `Outlet AI Helper | ${clientName} | ${pageLabel}`;
  const body = [
    "Hi Outlet team,",
    "",
    `I need help with ${pageLabel.toLowerCase()}.`,
    "",
    "Question:",
    "",
    "",
    `Client: ${clientName}`,
    `Page: ${pathname}`,
  ].join("\n");

  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function getPageLabel(pathname: string, slug: string) {
  const basePath = `/client/${slug}`;

  if (pathname === basePath) return "Client Overview";
  if (pathname === `${basePath}/campaigns`) return "Campaigns Dashboard";
  if (pathname.startsWith(`${basePath}/campaign/`)) return "Campaign Detail";
  if (pathname === `${basePath}/events`) return "Events Dashboard";
  if (pathname.startsWith(`${basePath}/event/`)) return "Event Detail";
  return "Client Portal";
}
