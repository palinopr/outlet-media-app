import type { ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { slugToLabel } from "@/lib/formatters";
import { ClientNav } from "./components/client-nav";
import { MobileNav } from "./components/mobile-nav";
import { CompleteProfileModal } from "./components/complete-profile-modal";
import { getClientPortalTheme } from "@/features/client-portal/theme";
import { getClientPortalConfig } from "@/features/client-portal/config";
import {
  getUserEmailAddresses,
  resolveClientPortalEntry,
} from "@/features/client-portal/entry";

interface Props {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const clientName = slugToLabel(slug);
  return {
    title: `${clientName} Portal`,
    description: `${clientName} campaign performance dashboard powered by Outlet Media`,
    openGraph: {
      title: `${clientName} | Outlet Media`,
      description: `${clientName} campaign performance dashboard`,
      type: "website",
    },
    twitter: {
      card: "summary",
    },
  };
}

export default async function ClientLayout({ children, params }: Props) {
  const { slug } = await params;
  const portalConfig = await getClientPortalConfig(slug);
  const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  let needsName = false;

  if (clerkEnabled) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    let user: Awaited<ReturnType<typeof currentUser>> = null;
    try {
      user = await currentUser();
    } catch (err) {
      console.error("[client/layout] Failed to fetch current user:", err);
    }

    const meta = (user?.publicMetadata ?? {}) as {
      role?: string;
    };

    const isAdmin = meta.role === "admin";

    if (!isAdmin) {
      const entry = await resolveClientPortalEntry({
        emailAddresses: getUserEmailAddresses(user),
        preferredSlug: slug,
        role: meta.role ?? null,
        userId,
      });

      if (entry.kind === "pending" || entry.kind === "picker") {
        redirect(entry.destination);
      }

      if (entry.kind === "portal" && entry.clientSlug !== slug) {
        redirect(entry.destination);
      }
    }

    needsName = !isAdmin && (!user?.firstName || !user?.lastName);
  }

  const clientName = portalConfig?.brandName ?? slugToLabel(slug);
  const eventsEnabled = portalConfig?.eventsEnabled ?? false;
  const reportsEnabled = portalConfig?.reportsEnabled ?? true;
  const theme = getClientPortalTheme(slug, {
    brandName: portalConfig?.brandName,
    logoAlt: portalConfig?.logoAlt,
    logoUrl: portalConfig?.logoUrl,
  });

  return (
    <div
      className="dark flex h-screen overflow-hidden text-foreground"
      style={{
        ...theme.style,
        backgroundImage: theme.shellBackground,
      }}
    >
      <aside
        className="hidden lg:flex w-60 border-r border-white/[0.04] flex-col shrink-0 relative"
        style={{ backgroundImage: theme.sidebarBackground }}
      >
        {/* Subtle gradient accent on the edge */}
        <div
          className="absolute top-0 right-0 bottom-0 w-px"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(${theme.accentRgb}, 0.28), rgba(${theme.secondaryRgb}, 0.12), transparent)`,
          }}
        />
        <div className="px-5 pt-6 pb-5 shrink-0">
          <div className="flex items-center gap-3 mb-5">
            <Image src="/images/brand/symbol-white.png" alt="Outlet Media" width={36} height={36} className="h-9 w-9 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-white/90 truncate">{clientName}</p>
              <p className="text-[10px] text-white/30 font-medium tracking-wide">Read-Only Portal</p>
            </div>
          </div>
          {theme.brandLogoSrc ? (
            <div className="mb-5 rounded-2xl border border-white/[0.08] bg-white/95 p-3 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
              <Image
                src={theme.brandLogoSrc}
                alt={theme.brandLogoAlt ?? clientName}
                width={theme.brandLogoWidth ?? 240}
                height={theme.brandLogoHeight ?? 120}
                className="h-12 w-full object-contain"
              />
            </div>
          ) : null}
          <div className="h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <ClientNav
            slug={slug}
            eventsEnabled={eventsEnabled}
            reportsEnabled={reportsEnabled}
          />
        </div>
        <div className="px-5 py-4 shrink-0">
          <div className="h-px bg-gradient-to-r from-white/[0.06] to-transparent mb-4" />
          <div className="flex items-center gap-2">
            <Image src="/images/brand/symbol-white.png" alt="Outlet Media" width={20} height={20} className="h-5 w-5" />
            <p className="text-[10px] text-white/25 font-medium">Outlet Media</p>
          </div>
        </div>
      </aside>
      {/* Mobile header */}
      <MobileNav
        slug={slug}
        clientName={clientName}
        eventsEnabled={eventsEnabled}
        reportsEnabled={reportsEnabled}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <main className="flex-1 overflow-auto lg:pt-0 pt-14">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">{children}</div>
        </main>
      </div>
      {needsName && <CompleteProfileModal needsName />}
    </div>
  );
}
