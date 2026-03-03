"use client";

import { usePathname } from "next/navigation";

interface Props {
  slug: string;
}

export function ClientNav({ slug }: Props) {
  const pathname = usePathname();
  const links = [
    { href: `/client/${slug}`, label: "Overview" },
    { href: `/client/${slug}/campaigns`, label: "Campaigns" },
    { href: `/client/${slug}/settings`, label: "Settings" },
  ];

  return (
    <nav className="flex-1 px-3 py-1 space-y-1">
      {links.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <a
            key={href}
            href={href}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? "text-white/90 bg-white/[0.06] border border-white/[0.04]"
                : "text-white/50 hover:text-white/80 hover:bg-white/[0.03] border border-transparent"
            }`}
          >
            <div className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-cyan-400" : "bg-white/20"}`} />
            {label}
          </a>
        );
      })}
    </nav>
  );
}
