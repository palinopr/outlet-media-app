"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, ChevronDown, Archive } from "lucide-react";
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
          router.refresh();
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
      <div className="p-3 space-y-2 shrink-0">
        <Button
          size="sm"
          className="w-full gap-2"
          onClick={() => handleCreatePage()}
          disabled={isPending}
        >
          <Plus className="h-4 w-4" />
          New Page
        </Button>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search pages..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-1">
        <div className="py-1">
          {tree.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              {filter ? "No pages match your search" : "No pages yet"}
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
