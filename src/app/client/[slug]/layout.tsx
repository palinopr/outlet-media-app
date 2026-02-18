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
        <div className="flex min-h-screen items-center justify-center bg-background">
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
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="w-56 border-r border-border/60 bg-muted/30 flex flex-col shrink-0">
        <div className="px-4 pt-5 pb-4 border-b border-border/60">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
            Client Portal
          </p>
          <p className="text-sm font-semibold truncate">{clientName}</p>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          <a
            href={`/client/${slug}`}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Overview
          </a>
          <a
            href={`/client/${slug}/campaigns`}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Campaigns
          </a>
        </nav>
        <div className="px-4 py-3 border-t border-border/60">
          <p className="text-[10px] text-muted-foreground">Powered by Outlet Media</p>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
