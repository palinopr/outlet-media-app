"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, ChevronDown, Archive, CheckSquare, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { WorkspacePage } from "@/lib/workspace-types";
import { usePageTree } from "@/hooks/use-page-tree";
import { PageTreeItem } from "./page-tree-item";

interface PageSidebarProps {
  pages: WorkspacePage[];
  basePath: string;
  clientSlug: string;
}

export function PageSidebar({ pages, basePath, clientSlug }: PageSidebarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showArchived, setShowArchived] = useState(false);
  const { tree, archivedTree, filter, setFilter, toggleExpanded, isExpanded } =
    usePageTree(pages);

  const handleCreatePage = useCallback(
    async (parentId?: string) => {
      const res = await fetch("/api/workspace/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Untitled",
          client_slug: clientSlug,
          parent_page_id: parentId,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        startTransition(() => {
          router.push(`${basePath}/${data.id}`);
        });
      }
    },
    [clientSlug, basePath, router],
  );

  const handleArchive = useCallback(
    async (pageId: string) => {
      await fetch(`/api/workspace/pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_archived: true }),
      });
      startTransition(() => router.refresh());
    },
    [router],
  );

  const handleRestore = useCallback(
    async (pageId: string) => {
      await fetch(`/api/workspace/pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_archived: false }),
      });
      startTransition(() => router.refresh());
    },
    [router],
  );

  const handleDelete = useCallback(
    async (pageId: string) => {
      await fetch(`/api/workspace/pages/${pageId}`, {
        method: "DELETE",
      });
      startTransition(() => router.refresh());
    },
    [router],
  );

  return (
    <div className="flex flex-col h-full">
      {/* Top navigation */}
      <div className="px-2 pt-3 pb-1 shrink-0 space-y-0.5">
        <button
          onClick={() => router.push(basePath)}
          className="flex items-center gap-2.5 w-full px-2 py-1.5 text-sm text-white/50 hover:text-white hover:bg-white/[0.04] rounded-md transition-colors"
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </button>
        <button
          onClick={() => router.push(`${basePath}/tasks`)}
          className="flex items-center gap-2.5 w-full px-2 py-1.5 text-sm text-white/50 hover:text-white hover:bg-white/[0.04] rounded-md transition-colors"
        >
          <CheckSquare className="h-4 w-4" />
          <span>Tasks</span>
        </button>
      </div>

      {/* Search */}
      <div className="px-2 py-2 shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-white/25" />
          <Input
            placeholder="Search..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-7 pl-8 text-xs bg-white/[0.03] border-white/[0.06] text-white/70 placeholder:text-white/20"
          />
        </div>
      </div>

      {/* Pages section header */}
      <div className="flex items-center justify-between px-3 pt-2 pb-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/25">Pages</span>
        <button
          onClick={() => handleCreatePage()}
          disabled={isPending}
          className="h-5 w-5 flex items-center justify-center rounded text-white/25 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
          title="New page"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <ScrollArea className="flex-1 px-1">
        <div className="py-0.5">
          {tree.length === 0 && (
            <p className="text-xs text-white/25 text-center py-6">
              {filter ? "No pages match" : "No pages yet"}
            </p>
          )}
          {tree.map((node) => (
            <PageTreeItem
              key={node.page.id}
              node={node}
              depth={0}
              isNodeExpanded={isExpanded}
              onToggle={toggleExpanded}
              basePath={basePath}
              onCreateChild={handleCreatePage}
              onArchive={handleArchive}
            />
          ))}
        </div>

        {archivedTree.length > 0 && (
          <div className="mt-4 border-t pt-2">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              <Archive className="h-3 w-3" />
              <span>Archived ({archivedTree.length})</span>
              <ChevronDown
                className={`h-3 w-3 ml-auto transition-transform ${showArchived ? "rotate-180" : ""}`}
              />
            </button>
            {showArchived &&
              archivedTree.map((node) => (
                <PageTreeItem
                  key={node.page.id}
                  node={node}
                  depth={0}
                  isNodeExpanded={isExpanded}
                  onToggle={toggleExpanded}
                  basePath={basePath}
                  onRestore={handleRestore}
                  onDelete={handleDelete}
                  isArchived
                />
              ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
