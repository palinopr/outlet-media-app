import type { ReactNode } from "react";
import { getPages } from "./data";
import { PageSidebar } from "@/components/workspace/page-sidebar";

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {
  const { pages } = await getPages();

  return (
    <div className="flex gap-0 -mx-4 sm:-mx-6 lg:-mx-8 -my-4 sm:-my-6 lg:-my-8 h-[calc(100vh-0px)] lg:h-auto">
      <aside className="hidden md:flex w-60 border-r border-border/50 bg-background shrink-0 flex-col h-full lg:h-[calc(100vh-3.5rem)]">
        <PageSidebar
          pages={pages}
          basePath="/admin/workspace"
          clientSlug="admin"
        />
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
