import type { ReactNode } from "react";
import { getWorkspacePages } from "@/features/workspace/server";
import { PageSidebar } from "@/components/workspace/page-sidebar";

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {
  const { pages } = await getWorkspacePages();

  return (
    <div className="flex gap-0 -mx-4 sm:-mx-6 lg:-mx-8 -my-4 sm:-my-6 lg:-my-8 h-[calc(100vh-3.5rem)]">
      <aside className="hidden md:flex w-56 border-r border-white/[0.04] bg-[oklch(0.12_0_0)] shrink-0 flex-col h-full">
        <PageSidebar
          pages={pages}
          basePath="/admin/workspace"
          clientSlug="admin"
        />
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
