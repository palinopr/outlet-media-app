import type { ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { slugToLabel } from "@/lib/formatters";
import { supabaseAdmin } from "@/lib/supabase";
import { ClientNav } from "./components/client-nav";

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
  const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

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
      client_slug?: string;
      client_role?: string;
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

    // Auto-enroll: ensure client_members row exists for invited users
    if (!isAdmin && isOwnPortal && supabaseAdmin) {
      const { data: clientRow } = await supabaseAdmin
        .from("clients")
        .select("id")
        .eq("slug", slug)
        .single();

      if (clientRow) {
        const enrollRole = meta.client_role === "owner" ? "owner" : "member";
        await supabaseAdmin
          .from("client_members")
          .upsert(
            { client_id: clientRow.id, clerk_user_id: userId, role: enrollRole },
            { onConflict: "client_id,clerk_user_id" }
          );
      }
    }
  }

  const clientName = slugToLabel(slug);

  return (
    <div className="dark flex min-h-screen bg-background text-foreground">
      <aside className="hidden lg:flex w-60 border-r border-white/[0.04] bg-[oklch(0.12_0_0)] flex-col shrink-0 relative">
        {/* Subtle gradient accent on the edge */}
        <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/20 via-violet-500/10 to-transparent" />
        <div className="px-5 pt-6 pb-5">
          <div className="flex items-center gap-3 mb-5">
            <Image src="/images/brand/symbol-white.png" alt="Outlet Media" width={36} height={36} className="h-9 w-9 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-white/90 truncate">{clientName}</p>
              <p className="text-[10px] text-white/30 font-medium tracking-wide">Client Portal</p>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
        </div>
        <ClientNav slug={slug} />
        <div className="px-5 py-4">
          <div className="h-px bg-gradient-to-r from-white/[0.06] to-transparent mb-4" />
          <div className="flex items-center gap-2">
            <Image src="/images/brand/symbol-white.png" alt="Outlet Media" width={20} height={20} className="h-5 w-5" />
            <p className="text-[10px] text-white/25 font-medium">Outlet Media</p>
          </div>
        </div>
      </aside>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 border-b border-border/50 bg-[oklch(0.16_0_0)]">
        <div className="flex items-center gap-2">
          <Image src="/images/brand/symbol-white.png" alt="Outlet Media" width={24} height={24} className="h-6 w-6 shrink-0" />
          <p className="text-sm font-semibold text-white/90">{clientName}</p>
        </div>
        <div className="flex items-center gap-3">
          <a href={`/client/${slug}`} className="text-xs text-white/50 hover:text-white transition-colors">Overview</a>
          <a href={`/client/${slug}/settings`} className="text-xs text-white/50 hover:text-white transition-colors">Settings</a>
        </div>
      </div>
      <main className="flex-1 overflow-auto lg:pt-0 pt-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</div>
      </main>
    </div>
  );
}
