import type { ReactNode } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface Props {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function ClientLayout({ children, params }: Props) {
  const { slug } = await params;
  const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (clerkEnabled) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const user = await currentUser();
    const meta = (user?.publicMetadata ?? {}) as {
      role?: string;
      client_slug?: string;
    };

    const isAdmin = meta.role === "admin";
    const isOwnPortal = meta.client_slug === slug;

    if (!isAdmin && !isOwnPortal) {
      // Redirect to their own portal if they have one, otherwise access denied
      if (meta.client_slug) {
        redirect(`/client/${meta.client_slug}`);
      }
      return (
        <div className="dark flex min-h-screen items-center justify-center bg-background text-foreground">
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold">Access denied</p>
            <p className="text-sm text-muted-foreground">
              You don&apos;t have access to this client portal.
            </p>
          </div>
        </div>
      );
    }
  }

  const clientName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/_/g, " ");

  return (
    <div className="dark flex min-h-screen bg-background text-foreground">
      <aside className="hidden lg:flex w-56 border-r border-border/50 bg-[oklch(0.16_0_0)] flex-col shrink-0">
        <div className="px-4 pt-5 pb-4">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">{clientName.charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white/90 truncate">{clientName}</p>
              <p className="text-[10px] text-white/40">Client Portal</p>
            </div>
          </div>
          <div className="h-px bg-white/[0.06]" />
        </div>
        <nav className="flex-1 px-2 py-1 space-y-0.5">
          <a
            href={`/client/${slug}`}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            Overview
          </a>
          <a
            href={`/client/${slug}/campaigns`}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            Campaigns
          </a>
        </nav>
        <div className="px-4 py-3">
          <div className="h-px bg-white/[0.06] mb-3" />
          <p className="text-[10px] text-white/30">Powered by Outlet Media</p>
        </div>
      </aside>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 border-b border-border/50 bg-[oklch(0.16_0_0)]">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">{clientName.charAt(0)}</span>
          </div>
          <p className="text-sm font-semibold text-white/90">{clientName}</p>
        </div>
        <div className="flex items-center gap-3">
          <a href={`/client/${slug}`} className="text-xs text-white/50 hover:text-white transition-colors">Overview</a>
          <a href={`/client/${slug}/campaigns`} className="text-xs text-white/50 hover:text-white transition-colors">Campaigns</a>
        </div>
      </div>
      <main className="flex-1 overflow-auto lg:pt-0 pt-14">
        <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
