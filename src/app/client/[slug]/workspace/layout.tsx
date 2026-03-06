import type { ReactNode } from "react";
import { requireClientAccess } from "@/features/client-portal/access";
import { getWorkspacePages } from "@/features/workspace/server";
import { PageSidebar } from "@/components/workspace/page-sidebar";

interface Props {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function ClientWorkspaceLayout({ children, params }: Props) {
  const { slug } = await params;
  await requireClientAccess(slug, "workspace");
  const { pages } = await getWorkspacePages(slug);

  return (
    <div className="flex gap-0 -mx-4 sm:-mx-6 -my-6 sm:-my-8 h-[calc(100vh-3.5rem)]">
      <aside className="hidden md:flex w-56 border-r border-white/[0.04] bg-[oklch(0.12_0_0)] shrink-0 flex-col h-full">
        <PageSidebar
          pages={pages}
          basePath={`/client/${slug}/workspace`}
          clientSlug={slug}
        />
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
